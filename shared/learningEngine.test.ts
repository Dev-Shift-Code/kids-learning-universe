import { describe, expect, it } from "vitest";
import { CURRICULUM } from "./curriculumConfig";
import { AGE_GROUPS } from "./learningConfig";
import { calculateStars, getAgeAdaptation, isMilestoneLevel, nextProgressAfterCompletion, nextUnlockedLevel } from "./learningEngine";

describe("required learning configuration", () => {
  it("preserves the exact supported age groups and the supplied curriculum structure", () => {
    expect(AGE_GROUPS).toEqual(["3–5", "6–8", "9–10"]);
    expect(CURRICULUM.map((category) => category.title)).toEqual([
      "Alphabet & Phonics", "Numbers & Counting", "Math Adventures", "Reading & Stories", "Science Explorer",
      "Arts & Creativity", "Music & Rhythm", "Puzzles & Brain Games", "English & Vocabulary", "Filipino Language",
      "Social & Emotional Learning", "Life Skills", "Geography & World", "Nature & Environment", "Fun & Games",
    ]);
    expect(CURRICULUM.every((category) => category.activities.length === 6)).toBe(true);
  });
});

describe("learning progression", () => {
  it("unlocks exactly one sequential level when a child earns a passing star", () => {
    expect(nextUnlockedLevel(1, 1)).toBe(2);
    expect(nextUnlockedLevel(5, 3)).toBe(6);
  });

  it("does not unlock a level without a passing star", () => {
    expect(nextUnlockedLevel(4, 0)).toBe(4);
  });

  it("does not progress beyond the configured subject level count", () => {
    expect(nextUnlockedLevel(12, 3)).toBe(12);
  });

  it("does not unlock a future level when an older level is replayed", () => {
    expect(nextProgressAfterCompletion(4, 2, 3)).toBe(4);
    expect(nextProgressAfterCompletion(4, 4, 3)).toBe(5);
  });

  it("identifies reward milestones", () => {
    expect(isMilestoneLevel(3)).toBe(true);
    expect(isMilestoneLevel(5)).toBe(false);
  });
});

describe("age adaptation", () => {
  it("provides spoken-first no-timer support for the youngest group", () => {
    expect(getAgeAdaptation("3–5", "numbers-counting")).toMatchObject({
      maxAnswerOptions: 2,
      targetSeconds: 0,
      voiceAutoplay: true,
    });
  });

  it("raises answer choices and introduces time guidance for older groups", () => {
    expect(getAgeAdaptation("9–10", "science-explorer")).toMatchObject({
      maxAnswerOptions: 4,
      targetSeconds: 30,
      voiceAutoplay: false,
    });
  });
});

describe("activity scoring", () => {
  it("rewards three stars for a correct first attempt within the target time", () => {
    expect(calculateStars({ successful: true, incorrectAttempts: 0, elapsedSeconds: 12, targetSeconds: 30 })).toBe(3);
  });

  it("uses two and one star tiers for successful retries", () => {
    expect(calculateStars({ successful: true, incorrectAttempts: 1, elapsedSeconds: 45, targetSeconds: 30 })).toBe(2);
    expect(calculateStars({ successful: true, incorrectAttempts: 3, elapsedSeconds: 45, targetSeconds: 30 })).toBe(1);
  });

  it("does not award stars for an unfinished activity", () => {
    expect(calculateStars({ successful: false, incorrectAttempts: 0, elapsedSeconds: 5, targetSeconds: 0 })).toBe(0);
  });
});
