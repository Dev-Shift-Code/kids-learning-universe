import { describe, expect, it } from "vitest";
import { getCelebrationBackPath, getCompletionNextPath } from "./celebrationNavigation";

describe("celebration navigation", () => {
  it("opens the next level of the same selected activity", () => {
    expect(getCompletionNextPath({ categoryId: "alphabet-phonics", profileId: 7, activityId: "learn-alphabet", level: 1, levelsPerActivity: 12 }))
      .toBe("/activity/alphabet-phonics?profile=7&activity=learn-alphabet&level=2");
  });

  it("returns to the activity list after the last available level", () => {
    expect(getCompletionNextPath({ categoryId: "alphabet-phonics", profileId: 7, activityId: "learn-alphabet", level: 12, levelsPerActivity: 12 }))
      .toBe("/activities/alphabet-phonics?profile=7");
  });

  it("returns Back to the selected activity’s level map", () => {
    expect(getCelebrationBackPath({ categoryId: "alphabet-phonics", profileId: 7, activityId: "learn-alphabet" }))
      .toBe("/levels/alphabet-phonics?profile=7&activity=learn-alphabet");
  });
});
