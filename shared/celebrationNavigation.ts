import { getActivityPath, getCategoryActivitiesPath } from "./profileRoute";

export function getCompletionNextPath(input: { categoryId: string; profileId: number; activityId: string; level: number; levelsPerActivity: number }) {
  if (input.level >= input.levelsPerActivity) return getCategoryActivitiesPath(input.categoryId, input.profileId);
  return getActivityPath(input.categoryId, input.profileId, input.activityId, input.level + 1);
}
