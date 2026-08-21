import { describe, expect, it } from "vitest";
import { getActivityExercise } from "./activityContent";
import { CURRICULUM } from "./curriculumConfig";
import { AGE_GROUPS } from "./learningConfig";

describe("activity content catalog", () => {
  it("provides a meaningful age-specific exercise for every one of the 90 category activities", () => {
    expect(CURRICULUM).toHaveLength(15);
    expect(CURRICULUM.flatMap((category) => category.activities)).toHaveLength(90);

    CURRICULUM.forEach((category) => {
      expect(category.activities).toHaveLength(6);
      category.activities.forEach((activity) => {
        AGE_GROUPS.forEach((ageGroup) => {
          const exercise = getActivityExercise(category.id, activity.id, ageGroup, 1);
          expect(exercise.instruction.length).toBeGreaterThan(12);
          expect(exercise.hint.length).toBeGreaterThan(12);
          expect(exercise.instruction).not.toContain("Best answer");
          expect(exercise.instruction).not.toContain("Best match");

          if (activity.interaction === "drawing") {
            expect(exercise.drawingGoal?.length).toBeGreaterThan(8);
          } else {
            expect(exercise.choices).toContain(exercise.answer);
            expect(exercise.choices).toHaveLength(4);
          }
        });
      });
    });
  });

  it("uses distinct learning content for a representative activity across the three age bands", () => {
    const young = getActivityExercise("math-adventures", "multiplication-fun", "3–5", 1);
    const middle = getActivityExercise("math-adventures", "multiplication-fun", "6–8", 1);
    const older = getActivityExercise("math-adventures", "multiplication-fun", "9–10", 1);

    expect(young.answer).toBe("6");
    expect(middle.answer).toBe("24");
    expect(older.answer).toBe("56");
  });

  it("provides an Aa visual tracing guide for the youngest Letter Tracing activity", () => {
    const tracing = getActivityExercise("alphabet-phonics", "letter-tracing", "3–5", 1);
    expect(tracing.tracingGuide).toBe("Aa");
    expect(tracing.drawingGoal).toContain("Aa");
  });
});
