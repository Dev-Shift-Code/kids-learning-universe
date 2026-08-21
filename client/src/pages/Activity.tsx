import { useAuth } from "@/_core/hooks/useAuth";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { VoiceGuidanceButton } from "@/components/VoiceGuidanceButton";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { LEARNING_CONFIG, SUBJECTS, type AgeGroup, type Subject } from "@shared/learningConfig";
import { calculateStars, getAgeAdaptation } from "@shared/learningEngine";
import { ArrowLeft, Check, CircleHelp, Flag, GripVertical, Lightbulb, Palette, Sparkles, Star } from "lucide-react";
import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";

type ActivityPrompt = {
  heading: string;
  instruction: string;
  helper: string;
  target: string;
  options: { id: string; label: string; hint?: string }[];
};

const prompts: Record<Subject, ActivityPrompt> = {
  Math: { heading: "Number Nest", instruction: "Tap the number that comes after 7.", helper: "Look at the number line in your mind. What comes next?", target: "8", options: [{ id: "6", label: "6" }, { id: "8", label: "8" }, { id: "9", label: "9" }, { id: "10", label: "10" }] },
  Reading: { heading: "Sound Safari", instruction: "Drag the first sound in the word sun into the glowing nest.", helper: "Say it slowly: sss-un. Which letter makes the first sound?", target: "S", options: [{ id: "M", label: "M", hint: "moon" }, { id: "S", label: "S", hint: "sun" }, { id: "T", label: "T", hint: "tree" }, { id: "R", label: "R", hint: "rain" }] },
  Science: { heading: "Wonder Lab", instruction: "Which thing grows from a tiny seed?", helper: "Think about what you see in a garden.", target: "flower", options: [{ id: "flower", label: "🌻" }, { id: "cloud", label: "☁️" }, { id: "moon", label: "🌙" }, { id: "star", label: "⭐" }] },
  Art: { heading: "Rainbow Studio", instruction: "Use your finger or mouse to draw a happy rainbow path.", helper: "There is no wrong way to make art. Let your line swoop and sparkle!", target: "drawn", options: [] },
  Music: { heading: "Rhythm Parade", instruction: "Drag the beat with two claps into the glowing stage.", helper: "Listen in your head: clap, clap. Which rhythm matches?", target: "two-claps", options: [{ id: "one-clap", label: "👏" }, { id: "two-claps", label: "👏 👏" }, { id: "three-claps", label: "👏 👏 👏" }, { id: "drum", label: "🥁" }] },
};

function buildPrompt(subject: Subject, ageGroup: AgeGroup, level: number): ActivityPrompt {
  if (subject === "Math") {
    if (ageGroup === "3–5") {
      const start = Math.min(7, Math.max(1, level + 1));
      const answer = String(start + 1);
      return { heading: "Number Nest", instruction: `Tap the number that comes after ${start}.`, helper: "Count slowly with your finger, then find the next number.", target: answer, options: [{ id: String(start), label: String(start) }, { id: answer, label: answer }] };
    }
    if (ageGroup === "6–8") {
      const first = 6 + level;
      const second = 2 + (level % 5);
      const answer = String(first + second);
      return { heading: "Number Nest", instruction: `Solve ${first} + ${second}.`, helper: "Use your number facts, then choose the sum.", target: answer, options: [{ id: String(first + second - 1), label: String(first + second - 1) }, { id: answer, label: answer }, { id: String(first + second + 1), label: String(first + second + 1) }] };
    }
    const first = 34 + level * 3;
    const second = 18 + level * 2;
    const answer = String(first + second);
    return { heading: "Number Nest", instruction: `Solve ${first} + ${second}.`, helper: "Try to add the tens first, then add the ones.", target: answer, options: [{ id: String(first + second - 10), label: String(first + second - 10) }, { id: String(first + second - 1), label: String(first + second - 1) }, { id: answer, label: answer }, { id: String(first + second + 1), label: String(first + second + 1) }] };
  }
  if (subject === "Reading") {
    if (ageGroup === "3–5") {
      const word = level % 2 ? "sun" : "map";
      const answer = word[0].toUpperCase();
      return { heading: "Sound Safari", instruction: `Drag the first sound in the word ${word} into the glowing nest.`, helper: `Say it slowly: ${word}. Which letter comes first?`, target: answer, options: answer === "S" ? [{ id: "M", label: "M", hint: "moon" }, { id: "S", label: "S", hint: "sun" }] : [{ id: "M", label: "M", hint: "map" }, { id: "T", label: "T", hint: "tree" }] };
    }
    if (ageGroup === "6–8") {
      const word = level % 2 ? "rain" : "play";
      const answer = word === "rain" ? "ai" : "ay";
      return { heading: "Sound Safari", instruction: `Drag the missing sound into r__n to make the word ${word}.`, helper: "Listen for the long vowel sound in the middle.", target: answer, options: [{ id: "ai", label: "ai" }, { id: "ee", label: "ee" }, { id: "oa", label: "oa" }] };
    }
    return { heading: "Sound Safari", instruction: "Drag the word that completes this sentence: The explorer used a ___ to find the stars.", helper: "Read every word and choose the one that makes the most sense.", target: "map", options: [{ id: "map", label: "map" }, { id: "nap", label: "nap" }, { id: "mop", label: "mop" }, { id: "mug", label: "mug" }] };
  }
  if (subject === "Science") {
    if (ageGroup === "3–5") {
      const choices = level % 3 === 1
        ? { instruction: "Which thing grows from a tiny seed?", helper: "Think about what you might see in a garden.", target: "flower", options: [{ id: "flower", label: "🌻" }, { id: "cloud", label: "☁️" }] }
        : level % 3 === 2
          ? { instruction: "Which animal lives in a pond?", helper: "Think about the animal that likes to swim and hop.", target: "frog", options: [{ id: "frog", label: "🐸" }, { id: "camel", label: "🐪" }] }
          : { instruction: "Which thing gives us light in the day?", helper: "Look up high in the sky when morning begins.", target: "sun", options: [{ id: "moon", label: "🌙" }, { id: "sun", label: "☀️" }] };
      return { heading: "Wonder Lab", ...choices };
    }
    if (ageGroup === "6–8") {
      const choices = level % 3 === 1
        ? { instruction: "Which part of a plant drinks water from the soil?", helper: "Remember the plant part that stays underground.", target: "roots", options: [{ id: "roots", label: "Roots" }, { id: "petals", label: "Petals" }, { id: "leaves", label: "Leaves" }] }
        : level % 3 === 2
          ? { instruction: "What state of water is an ice cube?", helper: "It is cold, hard, and keeps its shape.", target: "solid", options: [{ id: "solid", label: "Solid" }, { id: "liquid", label: "Liquid" }, { id: "gas", label: "Gas" }] }
          : { instruction: "Which object would a magnet pull toward it?", helper: "Magnets pull some metals, such as iron or steel.", target: "paper-clip", options: [{ id: "paper-clip", label: "Paper clip" }, { id: "leaf", label: "Leaf" }, { id: "crayon", label: "Crayon" }] };
      return { heading: "Wonder Lab", ...choices };
    }
    const choices = level % 3 === 1
      ? { instruction: "A plant in a dark cupboard becomes pale. What did it need more of?", helper: "Think about what plants use to make their own food.", target: "sunlight", options: [{ id: "water", label: "Water" }, { id: "sunlight", label: "Sunlight" }, { id: "sand", label: "Sand" }, { id: "music", label: "Music" }] }
      : level % 3 === 2
        ? { instruction: "Two identical cups have water. One sits in the sun and one in shade. Which cup loses water faster?", helper: "Heat gives water particles more energy to move away.", target: "sun", options: [{ id: "shade", label: "The cup in shade" }, { id: "sun", label: "The cup in the sun" }, { id: "same", label: "Both the same" }, { id: "none", label: "Neither cup" }] }
        : { instruction: "Which change is a physical change, not a new substance?", helper: "A physical change changes form but keeps the same material.", target: "melting", options: [{ id: "burning", label: "Burning paper" }, { id: "melting", label: "Melting ice" }, { id: "rusting", label: "Rusting iron" }, { id: "baking", label: "Baking cake" }] };
    return { heading: "Wonder Lab", ...choices };
  }
  if (subject === "Art") {
    const easyGuides = ["a sunny rainbow path", "three bouncy balloon strings", "a curly trail for a friendly caterpillar"];
    const middleGuides = ["a pattern that repeats with swirls and dots", "a pattern that alternates a star and a circle", "a small picture made from three different shapes"];
    const advancedGuides = ["a balanced mini-poster using a shape, a pattern, and one detail", "a mini-scene with a foreground, background, and one texture", "a visual message that uses contrast, a border, and a focal point"];
    const instruction = ageGroup === "3–5" ? `Use your finger or mouse to draw ${easyGuides[(level - 1) % easyGuides.length]}.` : ageGroup === "6–8" ? `Draw ${middleGuides[(level - 1) % middleGuides.length]}.` : `Create ${advancedGuides[(level - 1) % advancedGuides.length]} for level ${level}.`;
    const helper = ageGroup === "3–5" ? "Make each line big and wiggly. Every mark is a brave art choice!" : ageGroup === "6–8" ? "Repeat your idea the right number of times, then add one surprising color." : "Plan the pieces first, then add details that guide the viewer’s eye.";
    const instructions = instruction;
    return { heading: "Rainbow Studio", instruction: instructions, helper, target: "drawn", options: [] };
  }
  if (ageGroup === "3–5") {
    const target = level % 2 === 0 ? "one-clap" : "two-claps";
    return { heading: "Rhythm Parade", instruction: `Drag the beat with ${target === "one-clap" ? "one clap" : "two claps"} into the glowing stage.`, helper: "Tap the beat on your knees before you choose it.", target, options: [{ id: "one-clap", label: "👏" }, { id: "two-claps", label: "👏 👏" }] };
  }
  if (ageGroup === "6–8") {
    const target = level % 3 === 0 ? "drum-clap" : level % 2 === 0 ? "two-claps" : "three-claps";
    const labels = { "drum-clap": "a drumbeat and one clap", "two-claps": "two steady claps", "three-claps": "three steady claps" };
    return { heading: "Rhythm Parade", instruction: `Drag the beat with ${labels[target]} into the stage.`, helper: "Count each sound carefully before you move the card.", target, options: [{ id: "two-claps", label: "👏 👏" }, { id: "three-claps", label: "👏 👏 👏" }, { id: "drum-clap", label: "🥁 👏" }] };
  }
  const advancedPattern = level % 3 === 0 ? "clap-drum-clap" : level % 2 === 0 ? "drum-clap-clap" : "clap-clap-drum";
  const advancedLabels = { "clap-clap-drum": "👏 👏 🥁", "drum-clap-clap": "🥁 👏 👏", "clap-drum-clap": "👏 🥁 👏" };
  return { heading: "Rhythm Parade", instruction: `Drag the rhythm that repeats ${advancedLabels[advancedPattern]}.`, helper: "Read the pattern from left to right, then hear it in your head before choosing.", target: advancedPattern, options: [{ id: "clap-clap-drum", label: "👏 👏 🥁" }, { id: "drum-clap-clap", label: "🥁 👏 👏" }, { id: "clap-drum-clap", label: "👏 🥁 👏" }, { id: "four-claps", label: "👏 👏 👏 👏" }] };
}

function DrawingPad({ onDraw, requiredStrokes, currentStrokes }: { onDraw: () => void; requiredStrokes: number; currentStrokes: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.scale(ratio, ratio);
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#F45091";
  }, []);

  const point = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const begin = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    onDraw();
  };

  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => { drawing.current = false; };

  return <div><canvas ref={canvasRef} aria-label="A drawing canvas for the art activity" className="drawing-grid h-64 w-full touch-none rounded-[1.65rem] border-2 border-dashed border-[#e9c6d7] bg-[#fffdf8] sm:h-80" onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerLeave={end} /><p className="mt-3 text-center text-sm font-bold text-[#907990]">Make {requiredStrokes} {requiredStrokes === 1 ? "brave line" : "brave lines"} to complete this art quest · {Math.min(currentStrokes, requiredStrokes)}/{requiredStrokes}</p></div>;
}

export default function Activity() {
  const { subject: subjectParam } = useParams<{ subject: string }>();
  const subject = SUBJECTS.includes(subjectParam as Subject) ? subjectParam as Subject : "Math";
  const [location, setLocation] = useLocation();
  const search = new URLSearchParams(location.split("?")[1] ?? "");
  const profileId = Number(search.get("profile"));
  const level = Math.max(1, Math.min(LEARNING_CONFIG.levelsPerSubject, Number(search.get("level")) || 1));
  const { isAuthenticated, loading } = useAuth();
  const snapshot = trpc.learning.childSnapshot.useQuery({ profileId }, { enabled: isAuthenticated && profileId > 0 });
  const complete = trpc.learning.completeActivity.useMutation();
  const [chosen, setChosen] = useState<string | null>(null);
  const [drawnStrokes, setDrawnStrokes] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [celebration, setCelebration] = useState<{ stars: number; milestone: boolean; badgeName?: string } | null>(null);
  const startedAt = useRef(Date.now());

  const profile = snapshot.data?.profile;
  const ageGroup = (profile?.ageGroup ?? "3–5") as AgeGroup;
  const adaptation = getAgeAdaptation(ageGroup, subject);
  const prompt = buildPrompt(subject, ageGroup, level);
  const definition = LEARNING_CONFIG.subjects.find((item) => item.id === subject)!;
  const options = useMemo(() => prompt.options.slice(0, adaptation.maxAnswerOptions), [prompt.options, adaptation.maxAnswerOptions]);
  const isDrag = definition.interaction === "drag-and-drop";
  const isDrawing = definition.interaction === "drawing";
  const requiredStrokes = ageGroup === "3–5" ? 1 + ((level - 1) % 2) : ageGroup === "6–8" ? 2 + ((level - 1) % 3) : 3 + ((level - 1) % 3);
  const answeredCorrectly = isDrawing ? drawnStrokes >= requiredStrokes : chosen === prompt.target;
  const progress = snapshot.data?.progress.find((item) => item.subject === subject);
  const percent = Math.round(((progress?.completedLevels ?? 0) / LEARNING_CONFIG.levelsPerSubject) * 100);

  const chooseOption = (optionId: string) => {
    setChosen(optionId);
    if (optionId !== prompt.target) setIncorrectAttempts((attempts) => attempts + 1);
  };

  const finishActivity = async () => {
    if (!answeredCorrectly || complete.isPending || !profile) return;
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    const stars = calculateStars({ successful: true, incorrectAttempts, elapsedSeconds: durationSeconds, targetSeconds: adaptation.targetSeconds });
    const result = await complete.mutateAsync({
      childProfileId: profile.id,
      subject,
      levelNumber: level,
      interactionType: definition.interaction,
      stars,
      durationSeconds,
    });
    const badge = result.badges.find((item) => item.subject === subject);
    setCelebration({ stars, milestone: result.completion.milestone, badgeName: result.completion.earnedMilestoneBadge ? definition.badgeName : badge ? definition.badgeName : undefined });
  };

  if (!loading && !isAuthenticated) {
    return <div className="kid-page grid min-h-screen place-items-center p-5"><div className="cloud-card max-w-md rounded-[2rem] p-8 text-center"><Sparkles className="mx-auto h-11 w-11 text-[#6C4CE0]" /><h1 className="font-display mt-5 text-3xl font-bold text-[#41375e]">A parent starts the adventure</h1><p className="mt-3 font-bold leading-relaxed text-[#7a7392]">Sign in to choose a child profile and keep every learning step safely in sync.</p><button onClick={() => startLogin()} className="lift-on-hover mt-7 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white shadow-[0_7px_0_#5638bd]">Sign in to continue</button></div></div>;
  }

  if (snapshot.isLoading || loading) return <div className="kid-page grid min-h-screen place-items-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7ddff] border-t-[#6C4CE0]" /></div>;
  if (!profile) return <div className="kid-page grid min-h-screen place-items-center p-5"><div className="cloud-card max-w-md rounded-[2rem] p-8 text-center"><CircleHelp className="mx-auto h-11 w-11 text-[#ff8b5c]" /><h1 className="font-display mt-5 text-3xl font-bold text-[#41375e]">Choose a learning explorer</h1><p className="mt-3 font-bold leading-relaxed text-[#7a7392]">This adventure needs a child profile so progress and rewards can be saved.</p><button onClick={() => setLocation("/profiles")} className="lift-on-hover mt-7 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white shadow-[0_7px_0_#5638bd]">Choose a profile</button></div></div>;

  return (
    <div className="kid-page min-h-screen pb-10">
      <header className="container flex items-center justify-between py-5">
        <button onClick={() => setLocation("/profiles")} className="lift-on-hover grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#514471] shadow-sm" aria-label="Back to activities"><ArrowLeft className="h-5 w-5" /></button>
        <div className="text-center"><p className="font-display text-lg font-bold text-[#443a61]">{prompt.heading}</p><p className="mt-0.5 text-xs font-extrabold uppercase tracking-[.12em] text-[#9086a7]">Level {level} of {LEARNING_CONFIG.levelsPerSubject}</p></div>
        <div className="star-pill flex h-12 min-w-12 items-center justify-center gap-1 rounded-2xl px-3 font-black"><Star className="h-4 w-4 fill-current" /> {progress?.totalStars ?? 0}</div>
      </header>
      <main className="container max-w-5xl">
        <div className="mb-5 flex items-center gap-3"><div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e9e2f8]"><div className="h-full rounded-full bg-[#6C4CE0] transition-all" style={{ width: `${Math.max(8, percent)}%` }} /></div><span className="text-sm font-black text-[#746c8f]">{percent}%</span></div>
        <section className="relative overflow-hidden rounded-[2.6rem] bg-white p-5 shadow-[0_18px_45px_rgba(58,39,115,.1)] sm:p-8 lg:p-10" style={{ borderTop: `8px solid ${definition.color}` }}>
          <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full opacity-70" style={{ background: definition.softColor }} />
          <div className="relative mx-auto max-w-3xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[.13em]" style={{ background: definition.softColor, color: definition.color }}><Sparkles className="h-3.5 w-3.5" /> {ageGroup} adventure</div><h1 className="font-display mt-5 text-3xl font-bold tracking-[-.035em] text-[#3e355e] sm:text-4xl">{prompt.instruction}</h1><p className="mt-3 max-w-xl text-base font-bold leading-relaxed text-[#78718f]">{prompt.helper}</p></div><VoiceGuidanceButton instructions={prompt.instruction} autoPlay={adaptation.voiceAutoplay} /></div>
            <div className="mt-8">
              {isDrawing ? <DrawingPad requiredStrokes={requiredStrokes} currentStrokes={drawnStrokes} onDraw={() => setDrawnStrokes((count) => count + 1)} /> : isDrag ? <><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => chooseOption(event.dataTransfer.getData("text/plain"))} className={`grid min-h-36 place-items-center rounded-[1.7rem] border-2 border-dashed p-5 text-center transition-colors ${chosen ? "border-[#74cdaa] bg-[#effbf6]" : "border-[#dcd1f5] bg-[#faf8ff]"}`}><p className="font-display text-3xl font-bold" style={{ color: chosen ? definition.color : "#837a9c" }}>{chosen ? `${chosen}  ✓` : "Drop the answer here"}</p></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{options.map((option) => <button key={option.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", option.id)} onClick={() => chooseOption(option.id)} className={`lift-on-hover min-h-24 rounded-[1.45rem] border-2 p-4 text-center ${chosen === option.id ? "border-[#6C4CE0] bg-[#f1eeff]" : "border-[#eee8dc] bg-[#fffdf9]"}`}><GripVertical className="mx-auto h-4 w-4 text-[#b0a7c4]" /><span className="font-display mt-2 block text-2xl font-bold text-[#453c63]">{option.label}</span>{option.hint && <span className="mt-1 block text-xs font-bold text-[#9087a2]">{option.hint}</span>}</button>)}</div></> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{options.map((option) => <button key={option.id} onClick={() => chooseOption(option.id)} className={`lift-on-hover grid min-h-32 place-items-center rounded-[1.75rem] border-2 p-4 ${chosen === option.id ? "border-[#6C4CE0] bg-[#f0edff] shadow-[0_8px_0_#d9d0fb]" : "border-[#eee8dc] bg-[#fffdf9]"}`}><span className="font-display text-4xl font-bold text-[#463d65]">{option.label}</span></button>)}</div>}
            </div>
            {chosen && !answeredCorrectly && !isDrawing && <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#fff2e9] p-4 text-sm font-bold text-[#a64d28]"><Lightbulb className="h-5 w-5 shrink-0" />Try once more. Listen for the clue and choose the answer that fits best.</div>}
            <div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-[#f0ebdf] pt-6 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-sm font-bold text-[#8a82a1]"><Flag className="h-4 w-4" /> {adaptation.targetSeconds ? `Challenge time: ${adaptation.targetSeconds} seconds` : "Take your time — you are doing great."}</p><button onClick={finishActivity} disabled={!answeredCorrectly || complete.isPending} className="lift-on-hover inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#6C4CE0] px-6 py-3.5 font-extrabold text-white shadow-[0_7px_0_#5638bd] disabled:cursor-not-allowed disabled:opacity-45">{complete.isPending ? "Saving your stars…" : <><Check className="h-5 w-5" /> Finish this level</>}</button></div>
          </div>
        </section>
      </main>
      {celebration && <CelebrationOverlay {...celebration} onContinue={() => setLocation("/profiles")} />}
    </div>
  );
}
