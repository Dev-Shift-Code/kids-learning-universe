import type { AgeGroup } from "./learningConfig";
import type { CategoryId } from "./curriculumConfig";

export type ActivityExercise = {
  instruction: string;
  hint: string;
  choices: readonly string[];
  answer: string;
  drawingGoal?: string;
  tracingGuide?: string;
};

type AgeExercises = Record<AgeGroup, ActivityExercise>;

const quiz = (instruction: string, hint: string, choices: readonly string[], answer: string): ActivityExercise => ({ instruction, hint, choices, answer });
const draw = (instruction: string, hint: string, drawingGoal: string, tracingGuide?: string): ActivityExercise => ({ instruction, hint, choices: [], answer: "__drawing_complete__", drawingGoal, tracingGuide });
const ages = (young: ActivityExercise, middle: ActivityExercise, older: ActivityExercise): AgeExercises => ({ "3–5": young, "6–8": middle, "9–10": older });

/**
 * Every learner-facing activity has a real prompt and answer set. The age band
 * determines the reading load and the cognitive demand; the level map controls
 * progression and reward pacing.
 */
export const ACTIVITY_EXERCISES: Record<string, AgeExercises> = {
  "alphabet-phonics/learn-alphabet": ages(
    quiz("Tap the letter A.", "A is the first letter in apple.", ["A", "B", "C", "D"], "A"),
    quiz("Which letter comes after M?", "Say the alphabet quietly from M.", ["L", "N", "O", "P"], "N"),
    quiz("Which is the 20th letter of the alphabet?", "Count from A, or use the alphabet song.", ["R", "S", "T", "U"], "T"),
  ),
  "alphabet-phonics/letter-sounds": ages(
    quiz("Which letter makes the /m/ sound?", "Moon begins with /m/.", ["M", "S", "T", "P"], "M"),
    quiz("Which word starts with the /sh/ sound?", "Listen for the two-letter sound at the beginning.", ["ship", "sun", "tap", "map"], "ship"),
    quiz("Which word has a long a sound?", "Listen for the sound in cake.", ["cake", "cat", "cap", "camp"], "cake"),
  ),
  "alphabet-phonics/letter-tracing": ages(
    draw("Trace the Aa guide, then add a tiny apple beside it.", "Start at the top for A. For a, make a small circle then add its line.", "The Aa guide and one apple", "Aa"),
    draw("Trace the g guide, then add a circle around it.", "Start with the round body, then follow the tail.", "The lowercase g guide with a circle", "g"),
    draw("Trace the word ship using the dotted guide.", "Say each sound: sh-i-p.", "The word ship", "ship"),
  ),
  "alphabet-phonics/beginning-sounds": ages(
    quiz("Which picture-word begins with /b/?", "Ball starts with /b/.", ["ball", "sun", "fish", "moon"], "ball"),
    quiz("Which word begins with the blend /cl/?", "Listen for two consonant sounds at the start.", ["clock", "sock", "rock", "block"], "clock"),
    quiz("Which word begins with the prefix re-?", "Re- can mean again.", ["replay", "paper", "river", "happy"], "replay"),
  ),
  "alphabet-phonics/letter-matching": ages(
    quiz("Drag the lowercase match for B.", "Look for a tall line and one round belly.", ["b", "d", "p", "q"], "b"),
    quiz("Drag the lowercase match for Q.", "Its tail points down on the right.", ["q", "g", "p", "y"], "q"),
    quiz("Choose the lowercase match for the cursive-style capital G.", "Say the letter name, then find g.", ["g", "j", "q", "y"], "g"),
  ),
  "alphabet-phonics/build-a-word": ages(
    quiz("Drag the letters to make cat.", "Listen: c-a-t.", ["cat", "cap", "can", "cab"], "cat"),
    quiz("Build the word that names a small flying animal: bird.", "Use the sounds b-ir-d.", ["bird", "bored", "board", "bride"], "bird"),
    quiz("Build the word that means a person who teaches: teacher.", "Look for t-e-a-c-h-e-r.", ["teacher", "cheater", "reaches", "heater"], "teacher"),
  ),

  "numbers-counting/learn-numbers": ages(
    quiz("Tap the number five.", "Count your fingers to five.", ["3", "5", "7", "9"], "5"),
    quiz("Which number is seventeen?", "It has a 1 in the tens place and a 7 in the ones place.", ["16", "17", "27", "71"], "17"),
    quiz("What number is seventy-eight?", "Seven tens and eight ones.", ["68", "78", "87", "88"], "78"),
  ),
  "numbers-counting/count-objects": ages(
    quiz("Count the 4 apples. Which number tells how many?", "Touch each apple once as you count.", ["3", "4", "5", "6"], "4"),
    quiz("There are 12 shells. Which numeral matches the set?", "Count by ones, or make groups of three.", ["10", "11", "12", "13"], "12"),
    quiz("A tray has 24 cupcakes in 3 equal rows. How many cupcakes are there?", "Count each row or multiply 3 by 8.", ["21", "22", "24", "26"], "24"),
  ),
  "numbers-counting/number-matching": ages(
    quiz("Match the number 3 to the group with three stars.", "Count the stars in each group.", ["★★", "★★★", "★★★★", "★★★★★"], "★★★"),
    quiz("Match 14 to the correct bundle.", "A ten-frame and four single dots make fourteen.", ["10 + 3", "10 + 4", "10 + 5", "20 + 4"], "10 + 4"),
    quiz("Match 45 to its expanded form.", "Think tens first, then ones.", ["4 + 5", "40 + 5", "50 + 4", "400 + 5"], "40 + 5"),
  ),
  "numbers-counting/number-sequence": ages(
    quiz("What number comes next: 1, 2, 3, __?", "Count forward one more.", ["2", "4", "5", "6"], "4"),
    quiz("Fill the missing number: 18, 19, __, 21.", "Count forward from 19.", ["17", "18", "20", "22"], "20"),
    quiz("Fill the missing number: 125, 130, __, 140.", "The pattern adds five each time.", ["132", "134", "135", "145"], "135"),
  ),
  "numbers-counting/more-or-less": ages(
    quiz("Which group has more?", "Compare 5 balloons and 3 balloons.", ["5 balloons", "3 balloons", "They are equal", "No balloons"], "5 balloons"),
    quiz("Which number is less than 47?", "Less means smaller.", ["52", "49", "46", "58"], "46"),
    quiz("Which fraction is greater than one half?", "Picture each fraction on the same-sized shape.", ["1/4", "1/3", "1/2", "3/4"], "3/4"),
  ),
  "numbers-counting/basic-add-subtract": ages(
    quiz("Two birds join one bird. How many birds now?", "Start with 2 and add 1.", ["2", "3", "4", "5"], "3"),
    quiz("Solve 18 − 7.", "Count back seven from eighteen.", ["9", "10", "11", "12"], "11"),
    quiz("Solve 245 + 130.", "Add hundreds, tens, and ones.", ["365", "375", "385", "475"], "375"),
  ),

  "math-adventures/shapes-adventure": ages(
    quiz("Which shape is a triangle?", "A triangle has three sides.", ["circle", "triangle", "square", "rectangle"], "triangle"),
    quiz("Which shape has 6 sides?", "Count the sides carefully.", ["pentagon", "hexagon", "octagon", "triangle"], "hexagon"),
    quiz("Which solid has two circular faces and one curved surface?", "Think of a soup can.", ["cube", "cone", "cylinder", "sphere"], "cylinder"),
  ),
  "math-adventures/color-shape-patterns": ages(
    quiz("Finish the pattern: red, blue, red, blue, __.", "The colors take turns.", ["red", "green", "yellow", "blue"], "red"),
    quiz("Finish: circle, square, triangle, circle, square, __.", "The three-shape pattern repeats.", ["circle", "square", "triangle", "star"], "triangle"),
    quiz("Finish the rule: 2, 5, 8, 11, __.", "Add three each time.", ["12", "13", "14", "15"], "14"),
  ),
  "math-adventures/addition-challenge": ages(
    quiz("What is 4 + 2?", "Count on two more after four.", ["5", "6", "7", "8"], "6"),
    quiz("What is 36 + 27?", "Add ones, then tens.", ["53", "63", "73", "83"], "63"),
    quiz("What is 248 + 176?", "Regroup when ones or tens make ten or more.", ["414", "424", "434", "524"], "424"),
  ),
  "math-adventures/subtraction-challenge": ages(
    quiz("What is 7 − 3?", "Take three away from seven.", ["3", "4", "5", "6"], "4"),
    quiz("What is 54 − 19?", "Subtract 20, then add one back.", ["35", "36", "37", "45"], "35"),
    quiz("What is 600 − 248?", "Regroup one hundred into tens and ones as needed.", ["342", "352", "362", "372"], "352"),
  ),
  "math-adventures/multiplication-fun": ages(
    quiz("There are 2 groups of 3 stars. How many stars?", "Two groups of three is 3 + 3.", ["5", "6", "7", "8"], "6"),
    quiz("What is 6 × 4?", "Think of six groups of four.", ["20", "22", "24", "26"], "24"),
    quiz("A box holds 8 rows of 7 stickers. How many stickers?", "Multiply 8 by 7.", ["48", "54", "56", "63"], "56"),
  ),
  "math-adventures/math-word-problems": ages(
    quiz("Mia has 3 cookies and gets 2 more. How many?", "Put the two groups together.", ["4", "5", "6", "7"], "5"),
    quiz("A book costs ₱35 and a pencil costs ₱12. How much altogether?", "Add the prices.", ["₱45", "₱47", "₱52", "₱57"], "₱47"),
    quiz("A class has 28 pupils. Four teams have the same number. How many in each team?", "Divide 28 into 4 equal groups.", ["5", "6", "7", "8"], "7"),
  ),

  "reading-stories/story-time": ages(
    quiz("Lila packed an umbrella because clouds were dark. What weather might come?", "An umbrella helps in rain.", ["rain", "snow", "wind", "fog"], "rain"),
    quiz("Ben returned a lost toy to its owner. What trait did Ben show?", "He did the right thing even when no one asked.", ["honesty", "laziness", "jealousy", "rudeness"], "honesty"),
    quiz("A character changes plans after seeing a storm warning. Why is this sensible?", "Think about safety and evidence.", ["It saves time", "It ignores the weather", "It keeps people safe", "It makes a story longer"], "It keeps people safe"),
  ),
  "reading-stories/read-along": ages(
    quiz("Read: “The cat naps.” Which animal naps?", "Find the animal word in the sentence.", ["cat", "dog", "bird", "fish"], "cat"),
    quiz("Read: “Rina carried the basket to the market.” Where did Rina go?", "Look for the place word.", ["park", "market", "school", "beach"], "market"),
    quiz("Read: “The inventor tested the bridge twice before the parade.” Why did she test it?", "Testing checks whether something works safely.", ["To decorate it", "To check it works", "To make it louder", "To hide it"], "To check it works"),
  ),
  "reading-stories/picture-stories": ages(
    draw("Draw what happens next after a seed is planted and watered.", "A seed can grow into a little sprout.", "A sprout growing from the soil"),
    draw("Draw the next scene after two friends find a lost puppy.", "Show a kind and safe ending.", "Friends helping the puppy find home"),
    draw("Draw a final scene that solves a problem in a story about a polluted river.", "Show a realistic action that helps the river.", "A community cleaning the river"),
  ),
  "reading-stories/word-recognition": ages(
    quiz("Tap the word sun.", "It starts with s and ends with n.", ["sun", "run", "fun", "bun"], "sun"),
    quiz("Which word means very happy?", "Think of a joyful smile.", ["glad", "sad", "mad", "bad"], "glad"),
    quiz("Which word is a synonym for begin?", "A synonym has a similar meaning.", ["start", "finish", "stop", "rest"], "start"),
  ),
  "reading-stories/reading-comprehension": ages(
    quiz("Tino fed his fish every morning. What did Tino do?", "Find the action word.", ["fed the fish", "lost the fish", "painted the fish", "sold the fish"], "fed the fish"),
    quiz("A paragraph says bees move pollen between flowers. What is pollen for?", "It helps many plants make seeds.", ["making seeds", "making rocks", "making clouds", "making toys"], "making seeds"),
    quiz("An article gives facts, dates, and headings about volcanoes. What is its main purpose?", "Think about why informational articles are written.", ["To inform", "To tell a joke", "To give directions", "To sell a toy"], "To inform"),
  ),
  "reading-stories/story-quiz": ages(
    quiz("In the story, Ana shared her crayons. What did she share?", "Remember the art supplies.", ["crayons", "shoes", "books", "cookies"], "crayons"),
    quiz("Why did the main character apologize after bumping into a friend?", "An apology shows responsibility after a mistake.", ["To be polite", "To get a prize", "To win a race", "To skip class"], "To be polite"),
    quiz("Which event is the climax of a mystery story?", "The climax is the most important turning point.", ["The mystery is solved", "The title appears", "The setting is named", "The story begins"], "The mystery is solved"),
  ),

  "science-explorer/animal-world": ages(
    quiz("Which animal has fins and swims?", "It lives in water.", ["fish", "cat", "bird", "rabbit"], "fish"),
    quiz("Which animal is a mammal?", "Mammals have hair or fur and feed milk to babies.", ["dolphin", "lizard", "frog", "eagle"], "dolphin"),
    quiz("Why do polar bears have thick fur and fat?", "Think about their cold habitat.", ["To stay warm", "To fly", "To make nests", "To breathe underwater"], "To stay warm"),
  ),
  "science-explorer/plant-life": ages(
    quiz("What does a plant need to grow?", "Plants need water, light, and air.", ["sunlight", "plastic", "toys", "shoes"], "sunlight"),
    quiz("Which plant part takes in water from soil?", "It grows under the ground.", ["roots", "flowers", "leaves", "fruit"], "roots"),
    quiz("What is photosynthesis?", "Plants use sunlight to make food.", ["Making food with sunlight", "Growing rocks", "Making rain", "Sleeping in soil"], "Making food with sunlight"),
  ),
  "science-explorer/human-body": ages(
    quiz("Which body part helps you see?", "You use it to look at a book.", ["eyes", "ears", "hands", "feet"], "eyes"),
    quiz("Which organ pumps blood around your body?", "It beats in your chest.", ["heart", "lungs", "stomach", "brain"], "heart"),
    quiz("Which system works with the lungs to bring oxygen to body cells?", "Blood carries oxygen around the body.", ["circulatory system", "digestive system", "skeletal system", "nervous system"], "circulatory system"),
  ),
  "science-explorer/space-adventure": ages(
    quiz("What shines in the daytime sky?", "It gives Earth light and warmth.", ["Sun", "Moon", "Starfish", "Cloud"], "Sun"),
    quiz("Which planet is known as the Red Planet?", "It is named after the Roman god of war.", ["Mars", "Earth", "Venus", "Jupiter"], "Mars"),
    quiz("Why does the Moon appear to change shape during a month?", "We see different amounts of its sunlit half.", ["We see different lit parts", "It changes size", "Clouds paint it", "It moves closer daily"], "We see different lit parts"),
  ),
  "science-explorer/weather-watch": ages(
    quiz("What do you wear when it is raining?", "Choose something that keeps you dry.", ["raincoat", "swimsuit", "sandals", "sunglasses"], "raincoat"),
    quiz("What tool measures temperature?", "It tells how hot or cold something is.", ["thermometer", "ruler", "compass", "scale"], "thermometer"),
    quiz("What weather front often brings steady rain?", "Warm air rises slowly over cooler air.", ["warm front", "cold front", "jet stream", "drought"], "warm front"),
  ),
  "science-explorer/science-experiments": ages(
    quiz("Put these steps in a safe order: ask a grown-up, get materials, try the test, clean up.", "Safety comes before starting.", ["ask a grown-up", "try the test", "clean up", "guess wildly"], "ask a grown-up"),
    quiz("For a fair plant experiment, what should stay the same for each plant?", "Change only one thing at a time.", ["same pot and soil", "different plant type", "different room", "different question"], "same pot and soil"),
    quiz("Which observation is measurable?", "A measurement uses a number and unit.", ["The plant grew 3 cm", "The plant looks nice", "The plant is happy", "The plant is cool"], "The plant grew 3 cm"),
  ),

  "arts-creativity/coloring-pages": ages(
    draw("Color a happy sun using yellow and add three rays.", "Use the whole page and keep your lines inside the shape.", "A yellow sun with three rays"),
    draw("Color a garden scene using at least three different colors.", "Choose colors that help flowers, leaves, and sky look different.", "A garden using three colors"),
    draw("Create a warm-and-cool color study with a sunset and ocean.", "Warm colors include red, orange, yellow; cool colors include blue, green, purple.", "A sunset and ocean using warm and cool colors"),
  ),
  "arts-creativity/free-drawing": ages(
    draw("Draw your favorite animal and one thing it needs.", "An animal might need food, water, or a home.", "An animal with one need"),
    draw("Draw a poster that invites friends to read a book.", "Use a title and one picture that matches your message.", "A reading invitation poster"),
    draw("Sketch an invention that helps people save water.", "Label one useful part of your invention.", "A labeled water-saving invention"),
  ),
  "arts-creativity/paint-create": ages(
    draw("Paint a rainbow with at least four colors.", "Make long curved bands across the page.", "A four-color rainbow"),
    draw("Paint a landscape with sky, land, and one tree.", "Place the horizon between the sky and ground.", "A landscape with a tree"),
    draw("Paint an abstract design using a repeating color pattern.", "Repeat colors and shapes to create rhythm.", "An abstract repeating pattern"),
  ),
  "arts-creativity/shape-art": ages(
    quiz("Which shape can you use for a round sun?", "The sun is round.", ["circle", "triangle", "square", "rectangle"], "circle"),
    quiz("Choose the shapes that could make a house picture.", "A square can be walls and a triangle can be a roof.", ["square and triangle", "two circles", "three stars", "one oval"], "square and triangle"),
    quiz("Which transformation makes the same triangle face the other way?", "A flip reflects a shape like a mirror.", ["reflection", "counting", "coloring", "measuring"], "reflection"),
  ),
  "arts-creativity/creative-challenges": ages(
    draw("Draw a friendly monster with three eyes and two feet.", "Count the features before you finish.", "A monster with three eyes and two feet"),
    draw("Design a book cover for a story called The Moon Garden.", "Include a title, a moon, and a plant.", "A Moon Garden book cover"),
    draw("Create a visual campaign poster that encourages recycling.", "Use a clear slogan and a symbol that supports it.", "A recycling poster with a slogan"),
  ),
  "arts-creativity/craft-ideas": ages(
    quiz("What should you use to stick paper shapes safely?", "Choose a child-safe art material.", ["glue stick", "hot pan", "soap", "sand"], "glue stick"),
    quiz("What is the first step for a paper-folding craft?", "Start with a clean sheet and follow the picture.", ["fold the paper", "throw it", "paint the table", "cut your shirt"], "fold the paper"),
    quiz("Why should you plan a craft before cutting materials?", "Planning reduces waste and helps the design work.", ["It saves materials", "It makes scissors dull", "It hides colors", "It removes creativity"], "It saves materials"),
  ),

  "music-rhythm/learn-instruments": ages(
    quiz("Which instrument has black and white keys?", "You press its keys to make notes.", ["piano", "drum", "flute", "violin"], "piano"),
    quiz("Which instrument is played by blowing air?", "It is a woodwind instrument.", ["flute", "guitar", "drum", "xylophone"], "flute"),
    quiz("Which family does the violin belong to?", "It makes sound with vibrating strings.", ["string family", "brass family", "woodwind family", "percussion family"], "string family"),
  ),
  "music-rhythm/musical-notes": ages(
    quiz("Which symbol tells you to be quiet in music?", "It is called a rest.", ["rest", "note", "drum", "song"], "rest"),
    quiz("How many beats does a quarter note get in common time?", "Tap one steady beat.", ["1", "2", "3", "4"], "1"),
    quiz("What does forte mean in music?", "It tells how loudly to play.", ["loud", "soft", "fast", "slow"], "loud"),
  ),
  "music-rhythm/beat-rhythm": ages(
    quiz("Choose the rhythm with two claps.", "Tap: clap, clap.", ["👏 👏", "👏", "👏 👏 👏", "🤫"], "👏 👏"),
    quiz("Which pattern has four steady beats?", "Count each sound: 1, 2, 3, 4.", ["ta ta ta ta", "ta ta", "ta-a", "rest"], "ta ta ta ta"),
    quiz("Which pattern matches 3/4 time?", "Three quarter-note beats fit in one bar.", ["ta ta ta", "ta ta ta ta", "ta-a-a-a", "rest rest"], "ta ta ta"),
  ),
  "music-rhythm/sing-along": ages(
    quiz("Which action helps you sing safely?", "Use a relaxed voice and breathe gently.", ["stand tall and breathe", "shout", "hold your breath", "whisper only"], "stand tall and breathe"),
    quiz("What helps a group sing together?", "Everyone follows the same steady beat.", ["listen to the beat", "sing faster alone", "skip words", "turn away"], "listen to the beat"),
    quiz("What is harmony?", "Different notes sound together in a pleasing way.", ["notes sung together", "one loud shout", "no music", "a broken instrument"], "notes sung together"),
  ),
  "music-rhythm/instrument-match": ages(
    quiz("Match the boom sound to its instrument.", "A drum is struck to make a boom.", ["drum", "flute", "violin", "piano"], "drum"),
    quiz("Which instrument is likely to make a high ringing sound when struck?", "It has metal bars.", ["xylophone", "tuba", "cello", "bass drum"], "xylophone"),
    quiz("Which instrument uses a reed to produce sound?", "A reed vibrates when air passes over it.", ["clarinet", "trumpet", "violin", "piano"], "clarinet"),
  ),
  "music-rhythm/music-memory": ages(
    quiz("Remember: clap, stomp. What comes second?", "Say the pattern in your head.", ["stomp", "clap", "jump", "spin"], "stomp"),
    quiz("Remember: ta, ta, rest, ta. What is third?", "Count each sound in order.", ["rest", "ta", "clap", "hum"], "rest"),
    quiz("A melody goes C, E, G, E. Which note comes last?", "Repeat the pattern exactly.", ["E", "C", "G", "D"], "E"),
  ),

  "puzzles-brain-games/memory-match": ages(
    quiz("Which card matches the red apple?", "Find the same fruit and color.", ["red apple", "yellow banana", "blue fish", "green leaf"], "red apple"),
    quiz("A card showed a compass. Which card matches its purpose?", "A compass helps with direction.", ["find direction", "measure weight", "tell time", "cut paper"], "find direction"),
    quiz("Match the fraction card 3/4 to its equivalent picture.", "Three of four equal parts are shaded.", ["■■■□", "■□□□", "■■□□", "■■■■"], "■■■□"),
  ),
  "puzzles-brain-games/jigsaw-puzzle": ages(
    quiz("Which piece would finish a blue sky corner?", "Look for blue color and two outside edges.", ["blue corner piece", "green middle piece", "red edge piece", "yellow center piece"], "blue corner piece"),
    quiz("Which clue helps most when sorting jigsaw pieces?", "Edges have a flat side.", ["flat edges", "loud colors", "largest piece", "roundest piece"], "flat edges"),
    quiz("Why do puzzle solvers group pieces by color and pattern?", "It reduces the search space.", ["It organizes clues", "It changes the picture", "It makes pieces larger", "It hides edges"], "It organizes clues"),
  ),
  "puzzles-brain-games/find-difference": ages(
    quiz("Which detail is different: one tree has 3 birds, the other has 2?", "Compare the birds carefully.", ["number of birds", "tree color", "sky", "grass"], "number of birds"),
    quiz("Two pictures are the same except one clock shows 3:00 and one shows 4:00. What differs?", "Look at the hour hand.", ["time", "weather", "building", "color"], "time"),
    quiz("Which change affects the meaning of a map key?", "A key explains symbols.", ["a symbol label changes", "a border gets thicker", "paper gets larger", "a title gets shorter"], "a symbol label changes"),
  ),
  "puzzles-brain-games/pattern-puzzle": ages(
    quiz("Finish: star, heart, star, heart, __.", "The two shapes repeat.", ["star", "circle", "heart", "square"], "star"),
    quiz("Finish: 4, 8, 12, __.", "Add four each time.", ["14", "15", "16", "18"], "16"),
    quiz("Finish: A1, B2, C3, __.", "Both the letter and number move forward one step.", ["D4", "D3", "E4", "C4"], "D4"),
  ),
  "puzzles-brain-games/maze-adventure": ages(
    quiz("Which direction gets the mouse closer to the cheese on the right?", "Move toward the cheese.", ["right", "left", "up", "down"], "right"),
    quiz("A maze path says north, east, east. Where do you end from the start?", "Follow each direction in order.", ["two steps east and one north", "three steps west", "one step south", "back at start"], "two steps east and one north"),
    quiz("Which strategy avoids getting lost in a simple maze?", "Trace one path and mark dead ends.", ["mark dead ends", "jump randomly", "ignore walls", "start at every square"], "mark dead ends"),
  ),
  "puzzles-brain-games/logic-challenge": ages(
    quiz("Sam is taller than Jo. Who is shorter?", "Compare the two names.", ["Jo", "Sam", "Both", "No one"], "Jo"),
    quiz("If all roses are flowers and this is a rose, what is it?", "Use the rule in the sentence.", ["a flower", "a tree", "a rock", "an insect"], "a flower"),
    quiz("Four friends sit in a row. Ana is left of Ben; Cara is right of Ben. Who can be in the middle?", "Picture the order Ana, Ben, Cara.", ["Ben", "Ana only", "Cara only", "Nobody"], "Ben"),
  ),

  "english-vocabulary/everyday-words": ages(
    quiz("Which word names something you sleep in?", "It has a pillow and blanket.", ["bed", "cup", "shoe", "ball"], "bed"),
    quiz("Which word means to look at something carefully?", "You do this with your eyes.", ["observe", "sleep", "jump", "hide"], "observe"),
    quiz("Which word best completes: “The careful driver was ___ at the crossing.”", "Think of a word meaning alert and aware.", ["attentive", "careless", "silent", "tiny"], "attentive"),
  ),
  "english-vocabulary/animals-nature-words": ages(
    quiz("Which animal lives in a nest?", "It has wings and feathers.", ["bird", "fish", "dog", "turtle"], "bird"),
    quiz("What do we call a place where a particular animal lives?", "A frog and a fish need different ones.", ["habitat", "vehicle", "recipe", "schedule"], "habitat"),
    quiz("Which word describes an animal active at night?", "It comes from the Latin word for night.", ["nocturnal", "aquatic", "domestic", "tropical"], "nocturnal"),
  ),
  "english-vocabulary/colors-shapes": ages(
    quiz("What color is a ripe banana?", "It is bright like the sun.", ["yellow", "blue", "purple", "black"], "yellow"),
    quiz("Which adjective describes a smooth pebble?", "It has no rough bumps.", ["smooth", "loud", "hungry", "fast"], "smooth"),
    quiz("Which phrase uses a precise shape word?", "Choose the most specific description.", ["a hexagonal tile", "a nice thing", "a good shape", "a fun object"], "a hexagonal tile"),
  ),
  "english-vocabulary/spelling-challenge": ages(
    quiz("Choose the correct spelling for the animal that says meow.", "Listen: c-a-t.", ["cat", "kat", "cot", "cut"], "cat"),
    quiz("Choose the correct spelling: beautiful.", "It begins b-e-a-u.", ["beautiful", "beutiful", "beautifull", "butiful"], "beautiful"),
    quiz("Which spelling is correct for a person who receives something?", "It has i before e after c.", ["receive", "recieve", "reseive", "receeve"], "receive"),
  ),
  "english-vocabulary/word-matching": ages(
    quiz("Match the word cold with its meaning.", "Cold means not warm.", ["not warm", "very loud", "full of food", "very fast"], "not warm"),
    quiz("Match fragile with the best meaning.", "A fragile glass object breaks easily.", ["easily broken", "very heavy", "always wet", "full of noise"], "easily broken"),
    quiz("Match predict with the best meaning.", "Scientists predict weather using clues.", ["say what may happen", "repeat a word", "measure length", "draw a map"], "say what may happen"),
  ),
  "english-vocabulary/build-sentence": ages(
    quiz("Choose the sentence that makes sense.", "A complete sentence has a clear idea.", ["I see a dog.", "Dog the see I.", "See I dog a.", "A I dog see."], "I see a dog."),
    quiz("Choose the best sentence with a capital letter and period.", "Check both the beginning and ending.", ["We play outside.", "we play outside", "We play outside", "we play outside."], "We play outside."),
    quiz("Choose the strongest topic sentence for a paragraph about recycling.", "A topic sentence tells the main idea.", ["Recycling helps reduce waste.", "I have a blue bin.", "Bins are round.", "Yesterday was sunny."], "Recycling helps reduce waste."),
  ),

  "filipino-language/mga-salita": ages(
    quiz("Alin ang salitang tumutukoy sa araw?", "Ito ay maliwanag sa langit.", ["araw", "ulan", "gabi", "buwan"], "araw"),
    quiz("Ano ang kasingkahulugan ng masaya?", "Isipin ang pakiramdam kapag may magandang balita.", ["maligaya", "malungkot", "galit", "pagod"], "maligaya"),
    quiz("Alin ang salitang may kahulugang mag-ingat?", "Ginagamit ito kapag may panganib.", ["mag-ingat", "maglaro", "matulog", "tumawa"], "mag-ingat"),
  ),
  "filipino-language/alpabetong-filipino": ages(
    quiz("Aling letra ang simula ng salitang bahay?", "Sabihin: b-a-h-a-y.", ["B", "D", "M", "S"], "B"),
    quiz("Aling titik ang kasunod ng N sa alpabeto?", "Bigkasin ang mga titik nang sunod-sunod.", ["M", "O", "P", "Q"], "O"),
    quiz("Alin ang tamang ayos ng mga titik sa salitang kalayaan?", "Tingnan ang bawat letrang bumubuo sa salita.", ["k-a-l-a-y-a-a-n", "k-a-l-a-y-a-n", "k-a-l-a-y-a-a", "k-a-l-a-w-a-n"], "k-a-l-a-y-a-a-n"),
  ),
  "filipino-language/pagbasa": ages(
    quiz("Basahin: “May aso si Ana.” Sino ang may aso?", "Hanapin ang pangalan sa pangungusap.", ["Ana", "aso", "May", "si"], "Ana"),
    quiz("Basahin: “Naglakad si Ben papunta sa palengke.” Saan pumunta si Ben?", "Hanapin ang lugar.", ["palengke", "paaralan", "bahay", "parke"], "palengke"),
    quiz("Basahin: “Nag-ipon si Mira ng tubig-ulan para diligan ang halaman.” Bakit siya nag-ipon?", "Tingnan ang layunin sa pangungusap.", ["Pandilig ng halaman", "Panghugas ng kotse", "Pampalamig", "Panglaro"], "Pandilig ng halaman"),
  ),
  "filipino-language/pagbaybay": ages(
    quiz("Piliin ang tamang baybay ng hayop na tumatahol.", "Sabihin: a-s-o.", ["aso", "asooh", "asoa", "osa"], "aso"),
    quiz("Piliin ang tamang baybay: paaralan.", "May dalawang a sa simula.", ["paaralan", "paralan", "paarallan", "paharalan"], "paaralan"),
    quiz("Alin ang wastong baybay ng salitang nangangahulugang responsibility?", "Ito ay may hulaping -an.", ["pananagutan", "pananagotan", "panagutan", "pananagutanng"], "pananagutan"),
  ),
  "filipino-language/buuin-pangungusap": ages(
    quiz("Piliin ang tamang pangungusap.", "Dapat malinaw ang kilos at ang gumawa nito.", ["Kumakain ang pusa.", "Pusa ang kumakain.", "Ang kumakain pusa.", "Kumain pusa ang."], "Kumakain ang pusa."),
    quiz("Alin ang may wastong pagkakasunod-sunod?", "Unahin ang simuno bago ang kilos.", ["Nagdidilig si Liza ng halaman.", "Halaman Liza nagdidilig si.", "Si halaman Liza nagdidilig.", "Ng didilig halaman Liza."], "Nagdidilig si Liza ng halaman."),
    quiz("Piliin ang pangungusap na may malinaw na dahilan at bunga.", "Hanapin ang dahil at kaya.", ["Umuulan kaya nagpayong kami.", "Payong ulan kami kaya.", "Kami umuulan payong.", "Kaya kami ulan."], "Umuulan kaya nagpayong kami."),
  ),
  "filipino-language/larawan-salita": ages(
    quiz("Itugma ang salitang isda sa tamang tirahan.", "Lumalangoy ito sa tubig.", ["tubig", "pugad", "kweba", "bukid"], "tubig"),
    quiz("Itugma ang salitang magsasaka sa gamit niya.", "Ginagamit niya ito sa pagtatanim.", ["pala", "stethoscope", "mikropono", "pintura"], "pala"),
    quiz("Itugma ang salitang kapaligiran sa tamang kahulugan.", "Kasama rito ang hangin, tubig, halaman, at hayop.", ["ating paligid", "laro sa bahay", "isang pagkain", "isang tao"], "ating paligid"),
  ),

  "social-emotional-learning/know-emotions": ages(
    quiz("Your friend smiles after getting a gift. How might they feel?", "A smile can show a pleasant feeling.", ["happy", "angry", "scared", "sleepy"], "happy"),
    quiz("You feel nervous before speaking in class. What can help?", "Slow breathing can calm your body.", ["take slow breaths", "shout", "run away", "hurt someone"], "take slow breaths"),
    quiz("A classmate is quiet after receiving difficult news. What is a caring response?", "Offer support without forcing them to talk.", ["Ask if they want support", "Make jokes about it", "Ignore them forever", "Tell everyone"], "Ask if they want support"),
  ),
  "social-emotional-learning/be-kind": ages(
    quiz("What is a kind thing to say to a new classmate?", "Welcome them warmly.", ["Come play with us.", "Go away.", "You cannot sit here.", "Be quiet."], "Come play with us."),
    quiz("You see trash near a bin. What is a kind action?", "Help care for a shared place.", ["Put it in the bin", "Kick it away", "Leave more trash", "Blame someone"], "Put it in the bin"),
    quiz("A friend makes a mistake during a game. What shows empathy?", "Encourage them instead of embarrassing them.", ["Say “You can try again.”", "Laugh loudly", "Call them names", "Quit angrily"], "Say “You can try again.”"),
  ),
  "social-emotional-learning/sharing-caring": ages(
    quiz("You have two crayons and your friend has none. What can you do?", "Sharing helps both people create.", ["Share one crayon", "Hide both crayons", "Break them", "Take more"], "Share one crayon"),
    quiz("Two children want the same swing. What is a fair plan?", "Taking turns gives each person a chance.", ["Use a timer for turns", "Push someone", "Keep it all day", "Argue loudly"], "Use a timer for turns"),
    quiz("A group has one laptop for a project. Which plan is most cooperative?", "Share roles so everyone contributes.", ["Take turns with roles", "One person does all work", "Hide the laptop", "Skip the project"], "Take turns with roles"),
  ),
  "social-emotional-learning/friendship-skills": ages(
    quiz("How can you ask to join a game?", "Use polite words.", ["Can I play too?", "Move!", "Mine!", "Stop talking!"], "Can I play too?"),
    quiz("A friend says “Please stop.” What should you do?", "Respecting boundaries is part of friendship.", ["Stop and listen", "Keep going", "Tease them", "Tell others"], "Stop and listen"),
    quiz("A friend disagrees with your idea. What is a respectful response?", "You can disagree without being unkind.", ["Let’s compare our ideas.", "Your idea is stupid.", "I will not listen.", "Leave now."], "Let’s compare our ideas."),
  ),
  "social-emotional-learning/problem-solving": ages(
    quiz("Your tower falls down. What can you do?", "Try again with a new plan.", ["Build it again", "Cry and stop", "Throw blocks", "Blame a friend"], "Build it again"),
    quiz("You forgot a homework instruction. What is a good first step?", "Use a safe source of help.", ["Ask the teacher", "Guess wildly", "Copy secretly", "Ignore it"], "Ask the teacher"),
    quiz("Two teammates choose different project topics. What is a fair solution?", "Use evidence and compromise.", ["Discuss and choose together", "Let one person command", "Refuse to work", "Delete the project"], "Discuss and choose together"),
  ),
  "social-emotional-learning/good-manners": ages(
    quiz("What do you say after someone helps you?", "Use a polite thank-you.", ["Thank you", "Go away", "Give me more", "No"], "Thank you"),
    quiz("What should you do before borrowing a classmate’s ruler?", "Ask permission first.", ["May I borrow it?", "Take it quietly", "Hide it", "Break it"], "May I borrow it?"),
    quiz("How should you respond when someone gives helpful feedback?", "Listen, thank them, and consider the suggestion.", ["Thank them and listen", "Insult them", "Ignore all feedback", "Blame them"], "Thank them and listen"),
  ),

  "life-skills/personal-hygiene": ages(
    quiz("What do you use to wash your hands?", "Soap and water remove germs.", ["soap", "paint", "sand", "glue"], "soap"),
    quiz("When should you wash your hands?", "Think about meals and germs.", ["Before eating", "Only at bedtime", "Never", "Only on holidays"], "Before eating"),
    quiz("Why should you brush for about two minutes?", "Brushing reaches many tooth surfaces and removes plaque.", ["To remove plaque", "To change tooth color", "To make noise", "To skip breakfast"], "To remove plaque"),
  ),
  "life-skills/getting-dressed": ages(
    quiz("What do you wear when it is raining?", "Choose clothes that keep you dry.", ["raincoat", "swimsuit", "shorts only", "sunglasses only"], "raincoat"),
    quiz("Which item should you wear on your feet for running?", "It protects and supports your feet.", ["rubber shoes", "gloves", "hat", "scarf"], "rubber shoes"),
    quiz("Why is dressing in layers useful on a cool day?", "You can add or remove clothing as temperature changes.", ["It helps manage warmth", "It makes you taller", "It replaces sleep", "It stops rain always"], "It helps manage warmth"),
  ),
  "life-skills/healthy-eating": ages(
    quiz("Which snack helps your body grow strong?", "Fruit is a healthy choice.", ["banana", "candy", "soda", "chips"], "banana"),
    quiz("Which meal has a balanced mix of food groups?", "Look for vegetables, protein, and a grain.", ["rice, fish, and vegetables", "candy and soda", "chips only", "ice cream only"], "rice, fish, and vegetables"),
    quiz("Why is water a better everyday drink than soda?", "Your body needs water without added sugar.", ["It hydrates without added sugar", "It is always sweeter", "It has more bubbles", "It replaces all food"], "It hydrates without added sugar"),
  ),
  "life-skills/time-routine": ages(
    quiz("What do you usually do after waking up?", "A healthy morning begins with getting ready.", ["brush teeth", "eat dinner", "go to bed", "turn off the sun"], "brush teeth"),
    quiz("Which task belongs before school starts?", "Think of a morning routine.", ["pack your bag", "wear pajamas", "eat midnight snack", "turn on bedtime light"], "pack your bag"),
    quiz("You need 20 minutes to travel and class begins at 8:00. What is a safe latest departure time?", "Leave before 7:40 to allow a small buffer.", ["7:35", "7:50", "8:00", "8:15"], "7:35"),
  ),
  "life-skills/money-basics": ages(
    quiz("Which coin can buy something that costs ₱5?", "Match the price exactly.", ["₱5", "₱1", "₱2", "₱20"], "₱5"),
    quiz("A snack costs ₱18. You have ₱20. How much change?", "Subtract the cost from twenty.", ["₱2", "₱3", "₱8", "₱38"], "₱2"),
    quiz("You save ₱15 each week for 4 weeks. How much do you save?", "Multiply 15 by 4.", ["₱45", "₱50", "₱60", "₱75"], "₱60"),
  ),
  "life-skills/safety-first": ages(
    quiz("Before crossing a road, what should you do?", "Stop, look, and listen with an adult.", ["Look both ways", "Run fast", "Close eyes", "Play in road"], "Look both ways"),
    quiz("If you see a wet floor, what is safe?", "Wet floors can be slippery.", ["Walk carefully and tell an adult", "Run on it", "Slide on it", "Ignore it"], "Walk carefully and tell an adult"),
    quiz("What is the safest response to an online message from an unknown person asking for your address?", "Keep personal details private and tell a trusted adult.", ["Tell a trusted adult", "Send your address", "Meet them", "Reply with photos"], "Tell a trusted adult"),
  ),

  "geography-world/our-planet": ages(
    quiz("What planet is our home?", "It is blue and has land, water, and air.", ["Earth", "Mars", "Moon", "Sun"], "Earth"),
    quiz("Which part of Earth is covered by the most water?", "It is the largest kind of water body.", ["oceans", "rivers", "puddles", "lakes"], "oceans"),
    quiz("What layer of Earth do people live on?", "It is the solid outer layer.", ["crust", "core", "mantle", "outer space"], "crust"),
  ),
  "geography-world/continents": ages(
    quiz("Which continent is the Philippines in?", "It is the largest continent.", ["Asia", "Africa", "Europe", "Australia"], "Asia"),
    quiz("Which continent is Egypt in?", "It is home to the Sahara Desert.", ["Africa", "Asia", "Europe", "Antarctica"], "Africa"),
    quiz("Which continent has the most countries?", "It includes Nigeria, Kenya, and South Africa.", ["Africa", "Asia", "Europe", "South America"], "Africa"),
  ),
  "geography-world/countries-flags": ages(
    quiz("Which flag has blue, red, white, and a yellow sun?", "It is the flag of the Philippines.", ["Philippines", "Japan", "Brazil", "Canada"], "Philippines"),
    quiz("Which country is shaped like a boot on maps?", "It is in Europe.", ["Italy", "India", "Chile", "Japan"], "Italy"),
    quiz("Which country has Canberra as its capital?", "It is a large island-continent country.", ["Australia", "Canada", "Thailand", "Mexico"], "Australia"),
  ),
  "geography-world/famous-landmarks": ages(
    quiz("Which landmark is a tall tower in Paris?", "It is made of iron.", ["Eiffel Tower", "Pyramids", "Luneta", "Great Wall"], "Eiffel Tower"),
    quiz("Which landmark is a very long wall in China?", "It stretches across mountains and hills.", ["Great Wall", "Colosseum", "Taj Mahal", "Big Ben"], "Great Wall"),
    quiz("Why are landmarks protected?", "They carry cultural, historical, or natural value.", ["They preserve heritage", "They make roads shorter", "They change weather", "They remove history"], "They preserve heritage"),
  ),
  "geography-world/world-cultures": ages(
    quiz("What is a respectful way to learn about another culture?", "Listen and ask kind questions.", ["Learn respectfully", "Make fun of it", "Copy without asking", "Ignore people"], "Learn respectfully"),
    quiz("Why do people celebrate different festivals?", "Festivals can honor history, beliefs, seasons, or community.", ["They honor traditions", "Everyone likes the same thing", "To cancel school only", "To avoid learning"], "They honor traditions"),
    quiz("Which action shows cultural respect when visiting a new place?", "Observe local rules and ask before taking photos.", ["Follow local customs", "Assume all rules are same", "Mock accents", "Ignore signs"], "Follow local customs"),
  ),
  "geography-world/map-adventure": ages(
    quiz("Which direction is at the top of most maps?", "Look at a compass rose.", ["north", "south", "east", "west"], "north"),
    quiz("A park is east of the school. Which way do you travel from school?", "East is to the right on a standard map.", ["east", "west", "north", "south"], "east"),
    quiz("What does a map scale help you estimate?", "It relates map distance to real distance.", ["real distance", "weather", "population only", "time of day"], "real distance"),
  ),

  "nature-environment/plants-around-us": ages(
    quiz("Which part of a plant is usually green and flat?", "It catches sunlight.", ["leaf", "root", "seed", "rock"], "leaf"),
    quiz("What job do flowers often have?", "They help plants reproduce by attracting pollinators.", ["Help make seeds", "Make noise", "Catch fish", "Dig holes"], "Help make seeds"),
    quiz("Why do some plants have waxy leaves?", "A waxy coating can reduce water loss.", ["To save water", "To make sound", "To attract cars", "To create shade only"], "To save water"),
  ),
  "nature-environment/animals-habitats": ages(
    quiz("Where does a fish live?", "It needs water to swim and breathe.", ["water", "tree", "nest", "desert"], "water"),
    quiz("Which habitat is best for a camel?", "It is hot and dry with little water.", ["desert", "ocean", "rainforest", "pond"], "desert"),
    quiz("What can happen if a forest habitat is destroyed?", "Animals can lose food, shelter, and breeding space.", ["Animals lose homes", "More habitats appear", "Oceans disappear", "Animals need no food"], "Animals lose homes"),
  ),
  "nature-environment/weather-seasons": ages(
    quiz("Which weather is best for flying a kite?", "A kite needs moving air.", ["windy", "foggy", "stormy", "very still"], "windy"),
    quiz("Which season is usually the coldest in places with four seasons?", "Snow may fall then.", ["winter", "summer", "spring", "autumn"], "winter"),
    quiz("Why do seasons happen?", "Earth is tilted as it travels around the Sun.", ["Earth is tilted", "The Moon changes color", "Clouds move faster", "Mountains grow"], "Earth is tilted"),
  ),
  "nature-environment/recycling-game": ages(
    quiz("Where should an empty plastic bottle go?", "Place it in the recycling bin if it is clean and accepted locally.", ["recycling bin", "river", "street", "toy box"], "recycling bin"),
    quiz("Which material can often be recycled into new paper?", "Think of old newspapers and clean cardboard.", ["paper", "food scraps", "dirty tissue", "oil"], "paper"),
    quiz("Why should containers be rinsed before recycling?", "Clean materials are easier to process and do not spoil other items.", ["To prevent contamination", "To make them heavier", "To add color", "To waste water"], "To prevent contamination"),
  ),
  "nature-environment/save-planet": ages(
    quiz("What saves electricity after leaving a room?", "Lights use energy when they are on.", ["turn off lights", "open a fridge", "run water", "throw batteries"], "turn off lights"),
    quiz("Which travel choice can reduce air pollution for a short trip?", "It uses your own energy instead of fuel.", ["walk or bike", "drive alone always", "idle a car", "burn trash"], "walk or bike"),
    quiz("Which action has the greatest long-term benefit for reducing waste?", "Use fewer disposable items before recycling them.", ["Reduce and reuse", "Buy more single-use items", "Throw away usable things", "Ignore waste"], "Reduce and reuse"),
  ),
  "nature-environment/nature-explorer": ages(
    quiz("Which place has many tall trees?", "It is a natural home for many animals.", ["forest", "kitchen", "garage", "classroom"], "forest"),
    quiz("Which animal might you find near a coral reef?", "Reefs are colorful underwater homes.", ["clownfish", "camel", "eagle", "bear"], "clownfish"),
    quiz("What makes a mountain ecosystem different from a lowland ecosystem?", "Elevation affects temperature, plants, and animals.", ["Higher elevation", "More television", "Fewer maps", "Different clocks"], "Higher elevation"),
  ),

  "fun-games/memory-games": ages(
    quiz("Remember: red, blue. Which color came second?", "Say the two colors in order.", ["blue", "red", "green", "yellow"], "blue"),
    quiz("Remember: cat, sun, book. Which item came first?", "Replay the list in your mind.", ["cat", "sun", "book", "ball"], "cat"),
    quiz("Remember: 4, 9, 2, 7. Which number came third?", "Count through the sequence.", ["2", "4", "7", "9"], "2"),
  ),
  "fun-games/matching-games": ages(
    quiz("Match a baby cat with its name.", "A baby cat is called a kitten.", ["kitten", "puppy", "calf", "chick"], "kitten"),
    quiz("Match the job with its tool: doctor.", "A doctor listens to hearts and lungs.", ["stethoscope", "paintbrush", "rake", "whistle"], "stethoscope"),
    quiz("Match the fraction 1/2 with an equivalent decimal.", "One half is the same as fifty hundredths.", ["0.5", "0.2", "0.25", "0.75"], "0.5"),
  ),
  "fun-games/quick-quiz": ages(
    quiz("What color do red and yellow make?", "Mix the two paint colors.", ["orange", "green", "purple", "blue"], "orange"),
    quiz("Which planet do we live on?", "It has land, oceans, and people.", ["Earth", "Mars", "Jupiter", "Moon"], "Earth"),
    quiz("Which is a renewable energy source?", "It is naturally replenished.", ["solar power", "coal", "oil", "natural gas"], "solar power"),
  ),
  "fun-games/sorting-games": ages(
    quiz("Which item belongs with fruits?", "It grows from a plant and can be eaten.", ["apple", "spoon", "sock", "ball"], "apple"),
    quiz("Which object belongs in the “things that float” group?", "It stays on top of water.", ["cork", "stone", "coin", "key"], "cork"),
    quiz("Which item belongs in the “renewable resource” group?", "It can be replaced naturally in a short time.", ["sunlight", "coal", "plastic", "metal ore"], "sunlight"),
  ),
  "fun-games/reaction-games": ages(
    quiz("Tap the shape with 3 sides.", "Count the sides.", ["triangle", "circle", "square", "oval"], "triangle"),
    quiz("Choose the answer to 7 + 5.", "Add five after seven.", ["12", "11", "13", "14"], "12"),
    quiz("Choose the word with the correct apostrophe.", "It shows possession for one girl.", ["girl's book", "girls book", "girls' book", "girl book"], "girl's book"),
  ),
  "fun-games/daily-challenge": ages(
    quiz("Today’s challenge: Which tool tells time?", "Look for something with hands or numbers.", ["clock", "spoon", "crayon", "shoe"], "clock"),
    quiz("Today’s challenge: What number makes 9 when added to 6?", "Count up from six to nine.", ["3", "2", "4", "5"], "3"),
    quiz("Today’s challenge: Which choice is the most reliable source for a school science fact?", "Choose a source reviewed by experts or a trusted institution.", ["science museum website", "random rumor", "unlabeled video", "guess"], "science museum website"),
  ),
};

export function getActivityExercise(categoryId: CategoryId, activityId: string, ageGroup: AgeGroup, level: number): ActivityExercise {
  const key = `${categoryId}/${activityId}`;
  const exercise = ACTIVITY_EXERCISES[key]?.[ageGroup];
  if (!exercise) throw new Error(`Missing activity exercise for ${key} and age ${ageGroup}`);
  const levelHint = level >= 9 ? " Challenge level: explain your choice before you tap." : level >= 5 ? " Read every choice carefully before you decide." : " Take your time and use the clue.";
  return { ...exercise, hint: `${exercise.hint}${levelHint}` };
}
