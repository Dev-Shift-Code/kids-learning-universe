import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = (fileName: string) => readFileSync(resolve(process.cwd(), "client", "src", "pages", fileName), "utf8");

describe("child-learning route profile context", () => {
  it("reads the active profile query in every child-learning route", () => {
    ["Library.tsx", "Activities.tsx", "Levels.tsx", "Activity.tsx"].forEach((fileName) => {
      expect(pageSource(fileName)).toContain("getProfileIdFromSearch(window.location.search)");
    });
  });

  it("uses profile-preserving navigation helpers through the learning flow", () => {
    expect(pageSource("Library.tsx")).toContain("getCategoryActivitiesPath(category.id, profileId)");
    expect(pageSource("Activities.tsx")).toContain("getCategoryLevelsPath(categoryId, profileId, activity.id)");
    expect(pageSource("Levels.tsx")).toContain("getActivityPath(categoryId, profileId, selectedActivity.id, level)");
    expect(pageSource("Activity.tsx")).toContain("getCategoryActivitiesPath(categoryId, profileId)");
  });
});
