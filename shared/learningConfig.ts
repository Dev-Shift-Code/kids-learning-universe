export const AGE_GROUPS = ["3–5", "6–8", "9–10"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const SUBJECTS = ["Math", "Reading", "Science", "Art", "Music"] as const;
export type Subject = (typeof SUBJECTS)[number];

export type InteractionType = "multiple-choice" | "drag-and-drop" | "drawing";

export type SubjectDefinition = {
  id: Subject;
  tagline: string;
  color: string;
  softColor: string;
  icon: "calculator" | "book-open" | "flask-conical" | "palette" | "music";
  activityName: string;
  interaction: InteractionType;
  badgeId: string;
  badgeName: string;
};

export const LEARNING_CONFIG = {
  maxProfilesPerFamily: 4,
  levelsPerSubject: 12,
  starsRequiredToUnlock: 1,
  milestoneLevels: [3, 6, 12],
  ageGroups: {
    "3–5": {
      label: "3–5",
      instructionStyle: "spoken-first",
      promptPace: "gentle",
      compactLayout: false,
      questionComplexity: "recognition",
    },
    "6–8": {
      label: "6–8",
      instructionStyle: "spoken-and-written",
      promptPace: "steady",
      compactLayout: false,
      questionComplexity: "foundational",
    },
    "9–10": {
      label: "9–10",
      instructionStyle: "written-with-voice-option",
      promptPace: "brisk",
      compactLayout: true,
      questionComplexity: "challenge",
    },
  },
  subjects: [
    {
      id: "Math",
      tagline: "Count, solve, and shine.",
      color: "#7C5CFF",
      softColor: "#ECE8FF",
      icon: "calculator",
      activityName: "Number Nest",
      interaction: "multiple-choice",
      badgeId: "number-nova",
      badgeName: "Number Nova",
    },
    {
      id: "Reading",
      tagline: "Stories start with a sound.",
      color: "#FF8D5C",
      softColor: "#FFF0E9",
      icon: "book-open",
      activityName: "Sound Safari",
      interaction: "drag-and-drop",
      badgeId: "story-scout",
      badgeName: "Story Scout",
    },
    {
      id: "Science",
      tagline: "Ask, test, and discover.",
      color: "#25A77A",
      softColor: "#E5F8F0",
      icon: "flask-conical",
      activityName: "Wonder Lab",
      interaction: "multiple-choice",
      badgeId: "wonder-spark",
      badgeName: "Wonder Spark",
    },
    {
      id: "Art",
      tagline: "Make every idea colorful.",
      color: "#F45091",
      softColor: "#FFE8F2",
      icon: "palette",
      activityName: "Rainbow Studio",
      interaction: "drawing",
      badgeId: "rainbow-maker",
      badgeName: "Rainbow Maker",
    },
    {
      id: "Music",
      tagline: "Find the beat and play along.",
      color: "#E9AF28",
      softColor: "#FFF6D9",
      icon: "music",
      activityName: "Rhythm Parade",
      interaction: "drag-and-drop",
      badgeId: "rhythm-rockstar",
      badgeName: "Rhythm Rockstar",
    },
  ] satisfies SubjectDefinition[],
} as const;

export const BADGE_BY_SUBJECT = Object.fromEntries(
  LEARNING_CONFIG.subjects.map((subject) => [subject.id, {
    id: subject.badgeId,
    name: subject.badgeName,
    subject: subject.id,
  }]),
) as Record<Subject, { id: string; name: string; subject: Subject }>;

export function getSubject(subject: Subject) {
  const definition = LEARNING_CONFIG.subjects.find((item) => item.id === subject);
  if (!definition) throw new Error(`Unknown subject: ${subject}`);
  return definition;
}

export function getAgeGroup(ageGroup: AgeGroup) {
  return LEARNING_CONFIG.ageGroups[ageGroup];
}
