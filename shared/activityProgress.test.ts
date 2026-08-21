import { describe, expect, it } from "vitest";
import { applyActivityCompletion } from "./activityProgress";

describe("independent activity progression", () => {
  it("advances only Learn the Alphabet without unlocking Letter Tracing", () => {
    const before = [
      { id: 1, subject: "alphabet-phonics", activityId: "learn-alphabet", unlockedLevel: 1, completedLevels: 0, totalStars: 0 },
      { id: 2, subject: "alphabet-phonics", activityId: "letter-tracing", unlockedLevel: 1, completedLevels: 0, totalStars: 0 },
    ];
    const after = applyActivityCompletion(before, { subject: "alphabet-phonics", activityId: "learn-alphabet", levelNumber: 1, stars: 3 });

    expect(after.find((row) => row.activityId === "learn-alphabet")).toMatchObject({ unlockedLevel: 2, completedLevels: 1, totalStars: 3 });
    expect(after.find((row) => row.activityId === "letter-tracing")).toMatchObject({ unlockedLevel: 1, completedLevels: 0, totalStars: 0 });
  });
});
