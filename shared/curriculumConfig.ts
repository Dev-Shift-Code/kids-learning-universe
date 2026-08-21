import type { AgeGroup, InteractionType } from "./learningConfig";

export const CATEGORY_IDS = [
  "alphabet-phonics",
  "numbers-counting",
  "math-adventures",
  "reading-stories",
  "science-explorer",
  "arts-creativity",
  "music-rhythm",
  "puzzles-brain-games",
  "english-vocabulary",
  "filipino-language",
  "social-emotional-learning",
  "life-skills",
  "geography-world",
  "nature-environment",
  "fun-games",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type CurriculumActivity = {
  id: string;
  title: string;
  description: string;
  interaction: InteractionType;
};

export type CurriculumCategory = {
  id: CategoryId;
  title: string;
  thumbnailFile: string;
  color: string;
  softColor: string;
  activities: readonly CurriculumActivity[];
};

const activity = (id: string, title: string, description: string, interaction: InteractionType): CurriculumActivity => ({ id, title, description, interaction });

export const CURRICULUM: readonly CurriculumCategory[] = [
  { id: "alphabet-phonics", title: "Alphabet & Phonics", thumbnailFile: "AlphabetandPhonics.jpg", color: "#7861D8", softColor: "#ECE8FF", activities: [activity("learn-alphabet", "Learn the Alphabet", "Uppercase and lowercase letters", "multiple-choice"), activity("letter-sounds", "Letter Sounds", "Phonics and pronunciation", "multiple-choice"), activity("letter-tracing", "Letter Tracing", "Tracing A–Z", "drawing"), activity("beginning-sounds", "Beginning Sounds", "Identify the first sound of a word", "multiple-choice"), activity("letter-matching", "Letter Matching", "Match uppercase and lowercase letters", "drag-and-drop"), activity("build-a-word", "Build a Word", "Combine letters to create simple words", "drag-and-drop")] },
  { id: "numbers-counting", title: "Numbers & Counting", thumbnailFile: "NumbersandCounting.jpg", color: "#E2723D", softColor: "#FFF0E7", activities: [activity("learn-numbers", "Learn Numbers", "Number recognition", "multiple-choice"), activity("count-objects", "Count the Objects", "Count animals, fruits, toys, and more", "multiple-choice"), activity("number-matching", "Number Matching", "Match numbers with quantities", "drag-and-drop"), activity("number-sequence", "Number Sequence", "Arrange numbers correctly", "drag-and-drop"), activity("more-or-less", "More or Less", "Compare quantities", "multiple-choice"), activity("basic-add-subtract", "Basic Addition & Subtraction", "Solve simple math problems", "multiple-choice")] },
  { id: "math-adventures", title: "Math Adventures", thumbnailFile: "MathAdventures.jpg", color: "#E09E29", softColor: "#FFF5D9", activities: [activity("shapes-adventure", "Shapes Adventure", "Identify different shapes", "multiple-choice"), activity("color-shape-patterns", "Color & Shape Patterns", "Complete patterns", "drag-and-drop"), activity("addition-challenge", "Addition Challenge", "Solve addition problems", "multiple-choice"), activity("subtraction-challenge", "Subtraction Challenge", "Solve subtraction problems", "multiple-choice"), activity("multiplication-fun", "Multiplication Fun", "Practice basic multiplication", "multiple-choice"), activity("math-word-problems", "Math Word Problems", "Solve simple real-life problems", "multiple-choice")] },
  { id: "reading-stories", title: "Reading & Stories", thumbnailFile: "Reading&Stories.jpg", color: "#E75E94", softColor: "#FFE9F2", activities: [activity("story-time", "Story Time", "Interactive children's stories", "multiple-choice"), activity("read-along", "Read Along", "Listen and read together", "multiple-choice"), activity("picture-stories", "Picture Stories", "Create stories from pictures", "drawing"), activity("word-recognition", "Word Recognition", "Identify common words", "multiple-choice"), activity("reading-comprehension", "Reading Comprehension", "Answer questions about stories", "multiple-choice"), activity("story-quiz", "Story Quiz", "Quiz after completing a story", "multiple-choice")] },
  { id: "science-explorer", title: "Science Explorer", thumbnailFile: "ScienceExplorer.jpg", color: "#37A881", softColor: "#E6F8F0", activities: [activity("animal-world", "Animal World", "Learn about animals", "multiple-choice"), activity("plant-life", "Plant Life", "Seeds, plants, flowers, and trees", "multiple-choice"), activity("human-body", "Human Body", "Basic body parts and functions", "multiple-choice"), activity("space-adventure", "Space Adventure", "Planets, stars, and the solar system", "multiple-choice"), activity("weather-watch", "Weather Watch", "Rain, clouds, wind, and sunshine", "multiple-choice"), activity("science-experiments", "Science Experiments", "Simple and safe experiments", "drag-and-drop")] },
  { id: "arts-creativity", title: "Arts & Creativity", thumbnailFile: "Arts&Creativity.jpg", color: "#F2528A", softColor: "#FFE8F1", activities: [activity("coloring-pages", "Coloring Pages", "Interactive coloring", "drawing"), activity("free-drawing", "Free Drawing", "Digital drawing canvas", "drawing"), activity("paint-create", "Paint & Create", "Digital painting", "drawing"), activity("shape-art", "Shape Art", "Create pictures using shapes", "drag-and-drop"), activity("creative-challenges", "Creative Challenges", "Themed drawing challenges", "drawing"), activity("craft-ideas", "Craft Ideas", "Simple step-by-step crafts", "drag-and-drop")] },
  { id: "music-rhythm", title: "Music & Rhythm", thumbnailFile: "Music&Rhythm.jpg", color: "#C457C0", softColor: "#F8E8F8", activities: [activity("learn-instruments", "Learn Instruments", "Identify musical instruments", "multiple-choice"), activity("musical-notes", "Musical Notes", "Basic music concepts", "multiple-choice"), activity("beat-rhythm", "Beat the Rhythm", "Tap according to the beat", "drag-and-drop"), activity("sing-along", "Sing Along", "Children's songs", "multiple-choice"), activity("instrument-match", "Instrument Match", "Match sound to instrument", "drag-and-drop"), activity("music-memory", "Music Memory", "Remember and repeat sounds", "multiple-choice")] },
  { id: "puzzles-brain-games", title: "Puzzles & Brain Games", thumbnailFile: "Puzzles&BrainGames.jpg", color: "#4D8EE7", softColor: "#E6F1FF", activities: [activity("memory-match", "Memory Match", "Matching cards", "drag-and-drop"), activity("jigsaw-puzzle", "Jigsaw Puzzle", "Assemble pictures", "drag-and-drop"), activity("find-difference", "Find the Difference", "Compare two images", "multiple-choice"), activity("pattern-puzzle", "Pattern Puzzle", "Complete the pattern", "drag-and-drop"), activity("maze-adventure", "Maze Adventure", "Solve simple mazes", "drag-and-drop"), activity("logic-challenge", "Logic Challenge", "Age-appropriate logic problems", "multiple-choice")] },
  { id: "english-vocabulary", title: "English & Vocabulary", thumbnailFile: "English&Vocabulary.jpg", color: "#5D8E65", softColor: "#EAF6E9", activities: [activity("everyday-words", "Everyday Words", "Common English vocabulary", "multiple-choice"), activity("animals-nature-words", "Animals & Nature Words", "Animal and nature vocabulary", "multiple-choice"), activity("colors-shapes", "Colors & Shapes", "Learn descriptive words", "multiple-choice"), activity("spelling-challenge", "Spelling Challenge", "Spell simple words", "drag-and-drop"), activity("word-matching", "Word Matching", "Match words with pictures", "drag-and-drop"), activity("build-sentence", "Build a Sentence", "Create simple English sentences", "drag-and-drop")] },
  { id: "filipino-language", title: "Filipino Language", thumbnailFile: "FilipinoLanguage.jpg", color: "#C26C42", softColor: "#FFF0E8", activities: [activity("mga-salita", "Mga Salita", "Basic Filipino vocabulary", "multiple-choice"), activity("alpabetong-filipino", "Alpabetong Filipino", "Filipino alphabet", "multiple-choice"), activity("pagbasa", "Pagbasa", "Simple Filipino reading", "multiple-choice"), activity("pagbaybay", "Pagbaybay", "Filipino spelling", "drag-and-drop"), activity("buuin-pangungusap", "Buuin ang Pangungusap", "Sentence building", "drag-and-drop"), activity("larawan-salita", "Larawan at Salita", "Match pictures with Filipino words", "drag-and-drop")] },
  { id: "social-emotional-learning", title: "Social & Emotional Learning", thumbnailFile: "Social&EmotionalLearning.jpg", color: "#4F9AB0", softColor: "#E4F5F8", activities: [activity("know-emotions", "Know Your Emotions", "Identify feelings", "multiple-choice"), activity("be-kind", "Be Kind", "Kindness activities", "multiple-choice"), activity("sharing-caring", "Sharing Is Caring", "Sharing scenarios", "multiple-choice"), activity("friendship-skills", "Friendship Skills", "Making and maintaining friendships", "multiple-choice"), activity("problem-solving", "Problem Solving", "Handle everyday situations", "multiple-choice"), activity("good-manners", "Good Manners", "Polite and respectful behavior", "multiple-choice")] },
  { id: "life-skills", title: "Life Skills", thumbnailFile: "LifeSkills.jpg", color: "#A4744F", softColor: "#F9EEE6", activities: [activity("personal-hygiene", "Personal Hygiene", "Brushing teeth, bathing, and washing hands", "drag-and-drop"), activity("getting-dressed", "Getting Dressed", "Identify appropriate clothing", "drag-and-drop"), activity("healthy-eating", "Healthy Eating", "Identify healthy food choices", "multiple-choice"), activity("time-routine", "Time & Routine", "Learn schedules and daily routines", "drag-and-drop"), activity("money-basics", "Money Basics", "Recognize coins, bills, and simple purchases", "multiple-choice"), activity("safety-first", "Safety First", "Basic home, road, and personal safety", "multiple-choice")] },
  { id: "geography-world", title: "Geography & World", thumbnailFile: "Geography&World.jpg", color: "#4369B5", softColor: "#E8EEFF", activities: [activity("our-planet", "Our Planet", "Learn about Earth", "multiple-choice"), activity("continents", "Continents", "Explore the seven continents", "multiple-choice"), activity("countries-flags", "Countries & Flags", "Identify countries and flags", "multiple-choice"), activity("famous-landmarks", "Famous Landmarks", "Discover famous places", "multiple-choice"), activity("world-cultures", "World Cultures", "Learn about different cultures", "multiple-choice"), activity("map-adventure", "Map Adventure", "Basic map and location activities", "drag-and-drop")] },
  { id: "nature-environment", title: "Nature & Environment", thumbnailFile: "Nature&Environment.jpg", color: "#348E6C", softColor: "#E5F7EF", activities: [activity("plants-around-us", "Plants Around Us", "Identify plants", "multiple-choice"), activity("animals-habitats", "Animals & Habitats", "Learn where animals live", "drag-and-drop"), activity("weather-seasons", "Weather & Seasons", "Understand different weather", "multiple-choice"), activity("recycling-game", "Recycling Game", "Sort recyclable materials", "drag-and-drop"), activity("save-planet", "Save Our Planet", "Environmental challenges", "multiple-choice"), activity("nature-explorer", "Nature Explorer", "Discover forests, oceans, and mountains", "multiple-choice")] },
  { id: "fun-games", title: "Fun & Games", thumbnailFile: "Fun&Games.jpg", color: "#EC6A58", softColor: "#FFECE8", activities: [activity("memory-games", "Memory Games", "Memory-based mini-games", "drag-and-drop"), activity("matching-games", "Matching Games", "Match objects, pictures, or words", "drag-and-drop"), activity("quick-quiz", "Quick Quiz", "General knowledge quizzes", "multiple-choice"), activity("sorting-games", "Sorting Games", "Sort objects by color, size, and shape", "drag-and-drop"), activity("reaction-games", "Reaction Games", "Tap or click at the right moment", "multiple-choice"), activity("daily-challenge", "Daily Challenge", "A rotating educational mini-game", "multiple-choice")] },
] as const;

export const CATEGORY_THUMBNAILS: Record<CategoryId, string> = {
  "alphabet-phonics": "/manus-storage/AlphabetandPhonics_60764e9f.jpg",
  "numbers-counting": "/manus-storage/NumbersandCounting_3747ff22.jpg",
  "math-adventures": "/manus-storage/MathAdventures_540435c9.jpg",
  "reading-stories": "/manus-storage/Reading&Stories_c0d337b8.jpg",
  "science-explorer": "/manus-storage/ScienceExplorer_3c5455ef.jpg",
  "arts-creativity": "/manus-storage/Arts&Creativity_90b5a8b0.jpg",
  "music-rhythm": "/manus-storage/Music&Rhythm_132fddd5.jpg",
  "puzzles-brain-games": "/manus-storage/Puzzles&BrainGames_9d3e538e.jpg",
  "english-vocabulary": "/manus-storage/English&Vocabulary_e65f9d37.jpg",
  "filipino-language": "/manus-storage/FilipinoLanguage_c1bf2b3b.jpg",
  "social-emotional-learning": "/manus-storage/Social&EmotionalLearning_d9d933cd.jpg",
  "life-skills": "/manus-storage/LifeSkills_928c40c5.jpg",
  "geography-world": "/manus-storage/Geography&World_92c0b67b.jpg",
  "nature-environment": "/manus-storage/Nature&Environment_45f4ebf0.jpg",
  "fun-games": "/manus-storage/Fun&Games_77232734.jpg",
};

export function getCategory(categoryId: CategoryId) {
  const category = CURRICULUM.find((item) => item.id === categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);
  return category;
}

export function getCurriculumActivity(categoryId: CategoryId, activityId: string) {
  const curriculumActivity = getCategory(categoryId).activities.find((item) => item.id === activityId);
  if (!curriculumActivity) throw new Error(`Unknown activity: ${activityId}`);
  return curriculumActivity;
}

export function getAgeAppropriateActivityCopy(ageGroup: AgeGroup, title: string) {
  if (ageGroup === "3–5") return `Let’s play ${title}! Listen closely, then tap or move the big colorful answer.`;
  if (ageGroup === "6–8") return `Try ${title}. Read the clue, listen if you need help, and make your best choice.`;
  return `Take on ${title}. Use what you know, work carefully, and aim for a bright score.`;
}
