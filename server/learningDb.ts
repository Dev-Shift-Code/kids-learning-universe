import { and, desc, eq } from "drizzle-orm";
import {
  activityCompletions,
  childBadges,
  childProfiles,
  learningSessions,
  parentControls,
  subjectProgress,
} from "../drizzle/schema";
import { LEARNING_CONFIG, type AgeGroup, type InteractionType, type Subject } from "../shared/learningConfig";
import { canCreateProfile, clampStars, isMilestoneLevel, nextProgressAfterCompletion } from "../shared/learningEngine";
import { getDb } from "./db";
import { hashParentPin, verifyParentPin } from "./parentPin";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("The learning database is temporarily unavailable.");
  return db;
}

export async function listChildProfiles(userId: number) {
  const db = await requireDb();
  return db.select().from(childProfiles).where(eq(childProfiles.userId, userId)).orderBy(desc(childProfiles.createdAt));
}

export async function createChildProfile(input: { userId: number; name: string; avatar: string; ageGroup: AgeGroup }) {
  const db = await requireDb();
  const existing = await listChildProfiles(input.userId);
  if (!canCreateProfile(existing.length)) {
    throw new Error(`A family can have up to ${LEARNING_CONFIG.maxProfilesPerFamily} child profiles.`);
  }
  const [{ id }] = await db.insert(childProfiles).values(input).$returningId();
  await db.insert(subjectProgress).values(
    LEARNING_CONFIG.subjects.map((subject) => ({ childProfileId: id, subject: subject.id })),
  );
  return getChildSnapshot(input.userId, id);
}

export async function getOwnedProfile(userId: number, profileId: number) {
  const db = await requireDb();
  const [profile] = await db
    .select()
    .from(childProfiles)
    .where(and(eq(childProfiles.id, profileId), eq(childProfiles.userId, userId)))
    .limit(1);
  if (!profile) throw new Error("That child profile could not be found.");
  return profile;
}

export async function getChildSnapshot(userId: number, profileId: number) {
  const db = await requireDb();
  const profile = await getOwnedProfile(userId, profileId);
  const [progress, badges, completions, sessions] = await Promise.all([
    db.select().from(subjectProgress).where(eq(subjectProgress.childProfileId, profileId)),
    db.select().from(childBadges).where(eq(childBadges.childProfileId, profileId)),
    db.select().from(activityCompletions).where(eq(activityCompletions.childProfileId, profileId)),
    db.select().from(learningSessions).where(eq(learningSessions.childProfileId, profileId)),
  ]);
  return {
    profile,
    progress,
    badges,
    completedActivities: completions.length,
    timeSpentSeconds: sessions.reduce((total, session) => total + session.durationSeconds, 0),
  };
}

export async function getFamilySnapshot(userId: number) {
  const profiles = await listChildProfiles(userId);
  return Promise.all(profiles.map((profile) => getChildSnapshot(userId, profile.id)));
}

export async function setParentPin(userId: number, pin: string) {
  const db = await requireDb();
  const pinHash = hashParentPin(pin);
  await db.insert(parentControls).values({ userId, pinHash }).onDuplicateKeyUpdate({ set: { pinHash } });
  return { configured: true };
}

export async function parentPinStatus(userId: number) {
  const db = await requireDb();
  const [record] = await db.select({ id: parentControls.id }).from(parentControls).where(eq(parentControls.userId, userId)).limit(1);
  return { configured: Boolean(record) };
}

export async function confirmParentPin(userId: number, pin: string) {
  const db = await requireDb();
  const [record] = await db.select().from(parentControls).where(eq(parentControls.userId, userId)).limit(1);
  if (!record) return { verified: false, reason: "not-configured" as const };
  return { verified: verifyParentPin(pin, record.pinHash), reason: "invalid" as const };
}

export async function completeLearningActivity(input: {
  userId: number;
  childProfileId: number;
  subject: Subject;
  levelNumber: number;
  interactionType: InteractionType;
  stars: number;
  durationSeconds: number;
}) {
  const db = await requireDb();
  await getOwnedProfile(input.userId, input.childProfileId);
  const [currentProgress] = await db
    .select()
    .from(subjectProgress)
    .where(and(eq(subjectProgress.childProfileId, input.childProfileId), eq(subjectProgress.subject, input.subject)))
    .limit(1);
  if (!currentProgress || input.levelNumber > currentProgress.unlockedLevel) {
    throw new Error("Finish the available level before moving ahead.");
  }
  const stars = clampStars(input.stars);
  const durationSeconds = Math.max(0, Math.floor(input.durationSeconds));
  await db.insert(activityCompletions).values({
    childProfileId: input.childProfileId,
    subject: input.subject,
    levelNumber: input.levelNumber,
    interactionType: input.interactionType,
    stars,
    durationSeconds,
  });
  await db.insert(learningSessions).values({
    childProfileId: input.childProfileId,
    subject: input.subject,
    durationSeconds,
  });
  const unlockedLevel = nextProgressAfterCompletion(currentProgress.unlockedLevel, input.levelNumber, stars);
  const completedLevels = stars > 0 ? Math.max(currentProgress.completedLevels, input.levelNumber) : currentProgress.completedLevels;
  await db.update(subjectProgress).set({
    unlockedLevel,
    completedLevels,
    totalStars: currentProgress.totalStars + stars,
  }).where(eq(subjectProgress.id, currentProgress.id));

  const earnedMilestoneBadge = stars > 0 && isMilestoneLevel(input.levelNumber);
  if (earnedMilestoneBadge) {
    const subjectDefinition = LEARNING_CONFIG.subjects.find((subject) => subject.id === input.subject);
    if (subjectDefinition) {
      const badgeId = `${subjectDefinition.badgeId}-level-${input.levelNumber}`;
      await db.insert(childBadges).values({
        childProfileId: input.childProfileId,
        badgeId,
        subject: input.subject,
      }).onDuplicateKeyUpdate({ set: { badgeId } });
    }
  }
  return {
    ...(await getChildSnapshot(input.userId, input.childProfileId)),
    completion: { stars, unlockedLevel, milestone: isMilestoneLevel(input.levelNumber), earnedMilestoneBadge },
  };
}
