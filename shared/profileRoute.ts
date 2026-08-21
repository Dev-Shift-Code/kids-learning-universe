export function getProfileIdFromSearch(search: string) {
  const profileId = Number(new URLSearchParams(search).get("profile"));
  return Number.isInteger(profileId) && profileId > 0 ? profileId : 0;
}

export function getProfileLibraryPath(profileId: number) {
  if (!Number.isInteger(profileId) || profileId <= 0) return "/profiles";
  return `/library?profile=${profileId}`;
}

function withProfileQuery(path: string, profileId: number, extra: Record<string, string | number> = {}) {
  if (!Number.isInteger(profileId) || profileId <= 0) return "/profiles";
  const search = new URLSearchParams({ profile: String(profileId) });
  Object.entries(extra).forEach(([key, value]) => search.set(key, String(value)));
  return `${path}?${search.toString()}`;
}

export function getCategoryActivitiesPath(categoryId: string, profileId: number) {
  return withProfileQuery(`/activities/${categoryId}`, profileId);
}

export function getCategoryLevelsPath(categoryId: string, profileId: number, activityId: string) {
  return withProfileQuery(`/levels/${categoryId}`, profileId, { activity: activityId });
}

export function getActivityPath(categoryId: string, profileId: number, activityId: string, level: number) {
  return withProfileQuery(`/activity/${categoryId}`, profileId, { activity: activityId, level });
}
