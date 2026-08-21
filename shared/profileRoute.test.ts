import { describe, expect, it } from "vitest";
import { getActivityPath, getCategoryActivitiesPath, getCategoryLevelsPath, getProfileIdFromSearch, getProfileLibraryPath } from "./profileRoute";

describe("getProfileIdFromSearch", () => {
  it("preserves a selected child profile identifier from a navigation query", () => {
    expect(getProfileIdFromSearch("?profile=42")).toBe(42);
    expect(getProfileIdFromSearch("?activity=learn-alphabet&profile=7&level=1")).toBe(7);
  });

  it("returns zero when no usable child profile identifier is present", () => {
    expect(getProfileIdFromSearch("")).toBe(0);
    expect(getProfileIdFromSearch("?profile=0")).toBe(0);
    expect(getProfileIdFromSearch("?profile=not-a-number")).toBe(0);
  });

  it("builds the selected child navigation URL that the category library consumes", () => {
    expect(getProfileLibraryPath(8)).toBe("/library?profile=8");
    expect(getProfileLibraryPath(0)).toBe("/profiles");
  });

  it("keeps the selected profile through category, level, and activity navigation", () => {
    expect(getCategoryActivitiesPath("alphabet-phonics", 8)).toBe("/activities/alphabet-phonics?profile=8");
    expect(getCategoryLevelsPath("alphabet-phonics", 8, "learn-alphabet")).toBe("/levels/alphabet-phonics?profile=8&activity=learn-alphabet");
    expect(getActivityPath("alphabet-phonics", 8, "learn-alphabet", 3)).toBe("/activity/alphabet-phonics?profile=8&activity=learn-alphabet&level=3");
  });
});
