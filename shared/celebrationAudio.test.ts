import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CELEBRATION_CLAP_URL, CELEBRATION_SOUND_DURATION_MS } from "../client/src/components/CelebrationOverlay";

describe("celebration audio", () => {
  it("uses the supplied crowd-clapping media file for completion feedback", () => {
    expect(CELEBRATION_CLAP_URL).toBe("/manus-storage/celebration-crowd-clapping_6baab30d.mp3");
    expect(CELEBRATION_SOUND_DURATION_MS).toBe(7000);
  });

  it("renders explicit home and next-level celebration actions", () => {
    const overlay = readFileSync(resolve(process.cwd(), "client/src/components/CelebrationOverlay.tsx"), "utf8");
    expect(overlay).toContain("> Back</button>");
    expect(overlay).toContain("Next Level");
    expect(overlay).not.toContain("Celebrating…");
  });
});
