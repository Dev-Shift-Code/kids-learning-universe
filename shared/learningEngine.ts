import { LEARNING_CONFIG, type AgeGroup, type Subject } from "./learningConfig";

export function clampStars(stars: number) {
  return Math.min(3, Math.max(0, Math.floor(stars)));
}

export function calculateStars(input: { successful: boolean; incorrectAttempts: number; elapsedSeconds: number; targetSeconds: number }) {
  if (!input.successful) return 0;
  if (input.incorrectAttempts === 0 && (input.targetSeconds === 0 || input.elapsedSeconds <= input.targetSeconds)) return 3;
  if (input.incorrectAttempts <= 1) return 2;
  return 1;
}

export function canCreateProfile(existingProfileCount: number) {
  return existingProfileCount < LEARNING_CONFIG.maxProfilesPerFamily;
}

export function canUnlockNextLevel(stars: number) {
  return clampStars(stars) >= LEARNING_CONFIG.starsRequiredToUnlock;
}

export function nextUnlockedLevel(currentUnlockedLevel: number, starsEarned: number) {
  if (!canUnlockNextLevel(starsEarned)) return currentUnlockedLevel;
  return Math.min(LEARNING_CONFIG.levelsPerSubject, currentUnlockedLevel + 1);
}

export function nextProgressAfterCompletion(currentUnlockedLevel: number, completedLevel: number, starsEarned: number) {
  if (completedLevel !== currentUnlockedLevel) return currentUnlockedLevel;
  return nextUnlockedLevel(currentUnlockedLevel, starsEarned);
}

export function isMilestoneLevel(level: number) {
  return LEARNING_CONFIG.milestoneLevels.includes(level as 3 | 6 | 12);
}

export function getAgeAdaptation(ageGroup: AgeGroup, subject: Subject) {
  const pace = LEARNING_CONFIG.ageGroups[ageGroup].promptPace;
  const maxAnswerOptions = ageGroup === "3–5" ? 2 : ageGroup === "6–8" ? 3 : 4;
  const targetSeconds = ageGroup === "3–5" ? 0 : ageGroup === "6–8" ? 45 : 30;
  return {
    pace,
    maxAnswerOptions,
    targetSeconds,
    subject,
    voiceAutoplay: ageGroup === "3–5",
  };
}
