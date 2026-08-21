import { clampStars, nextProgressAfterCompletion } from "./learningEngine";

export type ActivityProgressState = {
  id: number;
  subject: string;
  activityId: string;
  unlockedLevel: number;
  completedLevels: number;
  totalStars: number;
};

export function applyActivityCompletion<T extends ActivityProgressState>(rows: readonly T[], input: { subject: string; activityId: string; levelNumber: number; stars: number }) {
  const target = rows.find((row) => row.subject === input.subject && row.activityId === input.activityId);
  if (!target) throw new Error("The selected activity progress row does not exist.");
  if (input.levelNumber > target.unlockedLevel) throw new Error("Finish the available level before moving ahead.");
  const stars = clampStars(input.stars);
  const nextTarget = {
    ...target,
    unlockedLevel: nextProgressAfterCompletion(target.unlockedLevel, input.levelNumber, stars),
    completedLevels: stars > 0 ? Math.max(target.completedLevels, input.levelNumber) : target.completedLevels,
    totalStars: target.totalStars + stars,
  };
  return rows.map((row) => row.id === target.id ? nextTarget : row);
}
