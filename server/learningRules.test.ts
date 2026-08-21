import { describe, expect, it } from "vitest";
import { LEARNING_CONFIG } from "../shared/learningConfig";
import { canCreateProfile } from "../shared/learningEngine";

describe("family profile limit", () => {
  it("permits a family to create up to four child profiles", () => {
    expect(canCreateProfile(0)).toBe(true);
    expect(canCreateProfile(LEARNING_CONFIG.maxProfilesPerFamily - 1)).toBe(true);
  });

  it("prevents a fifth child profile", () => {
    expect(canCreateProfile(LEARNING_CONFIG.maxProfilesPerFamily)).toBe(false);
  });
});
