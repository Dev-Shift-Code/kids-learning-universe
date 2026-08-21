import { and, desc, eq } from "drizzle-orm";
import {
  activityCompletions,
  activityProgress,
  childBadges,
  childProfiles,
  learningSessions,
  parentControls,
  subjectProgress,
} from "../drizzle/schema";
import type { ActivityProgress } from "../drizzle/schema";
import { CURRICULUM, getCategory, type CategoryId } from "../shared/curriculumConfig";
import { applyActivityCompletion } from "../shared/activityProgress";
import { LEARNING_CONFIG, type AgeGroup, type InteractionType } from "../shared/learningConfig";
import { canCreateProfile, clampStars, isMilestoneLevel, nextProgressAfterCompletion } from "../shared/learningEngine";
import { getDb } from "./db";
import { hashParentPin, verifyParentPin } from "./parentPin";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("The learning database is temporarily unavailable.");
  return db;
}

const allActivityProgressRows = (childProfileId: number) => CURRICULUM.flatMap((category) =>
  category.activities.map((activity) => ({ childProfileId, subject: category.id, activityId: activity.id })),
);

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
  await db.insert(subjectProgress).values(CURRICULUM.map((category) => ({ childProfileId: id, subject: category.id })));
  await db.insert(activityProgress).values(allActivityProgressRows(id));
  return getChildSnapshot(input.userId, id);
}

export async function getOwnedProfile(userId: number, profileId: number) {
  const db = await requireDb();
  const [profile] = await db.select().from(childProfiles).where(and(eq(childProfiles.id, profileId), eq(childProfiles.userId, userId))).limit(1);
  if (!profile) throw new Error("That child profile could not be found.");
  return profile;
}

export async function getChildSnapshot(userId: number, profileId: number) {
  const db = await requireDb();
  const profile = await getOwnedProfile(userId, profileId);
  const existingCategoryProgress = await db.select().from(subjectProgress).where(eq(subjectProgress.childProfileId, profileId));
  const existingCategories = new Set(existingCategoryProgress.map((item) => item.subject));
  const missingCategories = CURRICULUM.filter((category) => !existingCategories.has(category.id));
  if (missingCategories.length > 0) {
    await db.insert(subjectProgress).values(missingCategories.map((category) => ({ childProfileId: profileId, subject: category.id })));
  }

  const existingActivityProgress = await db.select({ subject: activityProgress.subject, activityId: activityProgress.activityId }).from(activityProgress).where(eq(activityProgress.childProfileId, profileId));
  const existingActivityKeys = new Set(existingActivityProgress.map((item) => `${item.subject}/${item.activityId}`));
  const legacyProgressBySubject = new Map(existingCategoryProgress.map((item) => [item.subject, item]));
  const missingActivityRows = CURRICULUM.flatMap((category) => category.activities
    .filter((activity) => !existingActivityKeys.has(`${category.id}/${activity.id}`))
    .map((activity, index) => {
      const legacy = legacyProgressBySubject.get(category.id);
      const preserveLegacyFirstActivity = index === 0 && legacy;
      return {
        childProfileId: profileId,
        subject: category.id,
        activityId: activity.id,
        unlockedLevel: preserveLegacyFirstActivity ? legacy.unlockedLevel : 1,
        completedLevels: preserveLegacyFirstActivity ? legacy.completedLevels : 0,
        totalStars: preserveLegacyFirstActivity ? legacy.totalStars : 0,
      };
    }));
  if (missingActivityRows.length > 0) {
    await db.insert(activityProgress).values(missingActivityRows);
  }

  const [progress, activityProgressRows, badges, completions, sessions] = await Promise.all([
    db.select().from(subjectProgress).where(eq(subjectProgress.childProfileId, profileId)),
    db.select().from(activityProgress).where(eq(activityProgress.childProfileId, profileId)),
    db.select().from(childBadges).where(eq(childBadges.childProfileId, profileId)),
    db.select().from(activityCompletions).where(eq(activityCompletions.childProfileId, profileId)),
    db.select().from(learningSessions).where(eq(learningSessions.childProfileId, profileId)),
  ]);
  return {
    profile,
    progress,
    activityProgress: activityProgressRows,
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
  category: CategoryId;
  activityId: string;
  levelNumber: number;
  interactionType: InteractionType;
  stars: number;
  durationSeconds: number;
}) {
  const db = await requireDb();
  await getChildSnapshot(input.userId, input.childProfileId);
  const categoryDefinition = getCategory(input.category);
  if (!categoryDefinition.activities.some((activity) => activity.id === input.activityId)) {
    throw new Error("That activity does not belong to the selected category.");
  }
  const [currentActivityProgress] = await db
    .select()
    .from(activityProgress)
    .where(and(eq(activityProgress.childProfileId, input.childProfileId), eq(activityProgress.subject, input.category), eq(activityProgress.activityId, input.activityId)))
    .limit(1);
  if (!currentActivityProgress || input.levelNumber > currentActivityProgress.unlockedLevel) {
    throw new Error("Finish the available level before moving ahead.");
  }

  const stars = clampStars(input.stars);
  const durationSeconds = Math.max(0, Math.floor(input.durationSeconds));
  await db.insert(activityCompletions).values({
    childProfileId: input.childProfileId,
    subject: input.category,
    activityId: input.activityId,
    levelNumber: input.levelNumber,
    interactionType: input.interactionType,
    stars,
    durationSeconds,
  });
  await db.insert(learningSessions).values({ childProfileId: input.childProfileId, subject: input.category, durationSeconds });

  const categoryActivityRows = await db.select().from(activityProgress).where(and(eq(activityProgress.childProfileId, input.childProfileId), eq(activityProgress.subject, input.category)));
  const nextCategoryActivityRows = applyActivityCompletion<ActivityProgress>(categoryActivityRows, { subject: input.category, activityId: input.activityId, levelNumber: input.levelNumber, stars });
  const nextActivityProgress = nextCategoryActivityRows.find((progress) => progress.id === currentActivityProgress.id);
  if (!nextActivityProgress) throw new Error("The activity progress update could not be prepared.");
  await db.update(activityProgress).set({
    unlockedLevel: nextActivityProgress.unlockedLevel,
    completedLevels: nextActivityProgress.completedLevels,
    totalStars: nextActivityProgress.totalStars,
  }).where(eq(activityProgress.id, currentActivityProgress.id));

  const categoryCompletedLevels = nextCategoryActivityRows.reduce((total, progress) => total + progress.completedLevels, 0);
  const categoryTotalStars = nextCategoryActivityRows.reduce((total, progress) => total + progress.totalStars, 0);
  const categoryUnlockedLevel = Math.max(1, ...nextCategoryActivityRows.map((progress) => progress.unlockedLevel));
  await db.update(subjectProgress).set({
    unlockedLevel: categoryUnlockedLevel,
    completedLevels: categoryCompletedLevels,
    totalStars: categoryTotalStars,
  }).where(and(eq(subjectProgress.childProfileId, input.childProfileId), eq(subjectProgress.subject, input.category)));

  const earnedMilestoneBadge = stars > 0 && isMilestoneLevel(input.levelNumber);
  if (earnedMilestoneBadge) {
    const badgeId = `${categoryDefinition.id}-${input.activityId}-level-${input.levelNumber}`;
    await db.insert(childBadges).values({ childProfileId: input.childProfileId, badgeId, subject: input.category }).onDuplicateKeyUpdate({ set: { badgeId } });
  }
  return {
    ...(await getChildSnapshot(input.userId, input.childProfileId)),
    completion: { stars, unlockedLevel: nextActivityProgress.unlockedLevel, milestone: isMilestoneLevel(input.levelNumber), earnedMilestoneBadge },
  };
}
