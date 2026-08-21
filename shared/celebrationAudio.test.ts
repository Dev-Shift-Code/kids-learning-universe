import { describe, expect, it } from "vitest";
import { CELEBRATION_CLAP_URL } from "../client/src/components/CelebrationOverlay";

describe("celebration audio", () => {
  it("uses the supplied crowd-clapping media file for completion feedback", () => {
    expect(CELEBRATION_CLAP_URL).toBe("/manus-storage/celebration-crowd-clapping_6baab30d.mp3");
  });
});
