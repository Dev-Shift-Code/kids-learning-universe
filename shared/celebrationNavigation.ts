import { getActivityPath, getCategoryActivitiesPath, getCategoryLevelsPath } from "./profileRoute";

export function getCelebrationBackPath(input: { categoryId: string; profileId: number; activityId: string }) {
  return getCategoryLevelsPath(input.categoryId, input.profileId, input.activityId);
}

export function getCompletionNextPath(input: { categoryId: string; profileId: number; activityId: string; level: number; levelsPerActivity: number }) {
  if (input.level >= input.levelsPerActivity) return getCategoryActivitiesPath(input.categoryId, input.profileId);
  return getActivityPath(input.categoryId, input.profileId, input.activityId, input.level + 1);
}
