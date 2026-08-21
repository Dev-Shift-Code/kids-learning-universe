import { useAuth } from "@/_core/hooks/useAuth";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { VoiceGuidanceButton } from "@/components/VoiceGuidanceButton";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { getActivityExercise } from "@shared/activityContent";
import { getCelebrationBackPath, getCompletionNextPath } from "@shared/celebrationNavigation";
import { CATEGORY_IDS, CURRICULUM, getCategory, type CategoryId } from "@shared/curriculumConfig";
import { LEARNING_CONFIG, type AgeGroup } from "@shared/learningConfig";
import { getCategoryActivitiesPath, getCategoryLevelsPath, getProfileIdFromSearch } from "@shared/profileRoute";
import { calculateStars, getAgeAdaptation } from "@shared/learningEngine";
import { ArrowLeft, Check, CircleHelp, Flag, GripVertical, Lightbulb, Sparkles, Star } from "lucide-react";
import React, { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";

function DrawingPad({ onDraw, requiredStrokes, currentStrokes, drawingGoal, tracingGuide }: { onDraw: () => void; requiredStrokes: number; currentStrokes: number; drawingGoal: string; tracingGuide?: string }) {
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
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#F45091";
  }, []);

  const getPoint = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const begin = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const point = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    onDraw();
  };
  const move = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = getPoint(event);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  return <div><div className="relative h-64 overflow-hidden rounded-[1.65rem] border-2 border-dashed border-[#e9c6d7] bg-[#fffdf8] sm:h-80">{tracingGuide && <svg aria-hidden="true" viewBox="0 0 1000 420" className="pointer-events-none absolute inset-0 h-full w-full"><text x="500" y="285" textAnchor="middle" fill="none" stroke="#D9C9F8" strokeWidth="7" strokeDasharray="13 13" paintOrder="stroke" fontFamily="Nunito, Arial, sans-serif" fontSize={tracingGuide.length > 2 ? "190" : "300"} fontWeight="900">{tracingGuide}</text><path d="M130 338 H870" stroke="#F3C8D7" strokeWidth="4" strokeDasharray="12 14" /></svg>}<canvas ref={canvasRef} aria-label={`A drawing canvas for ${tracingGuide ? `tracing ${tracingGuide}` : "this activity"}`} className="drawing-grid relative h-full w-full touch-none bg-transparent" onPointerDown={begin} onPointerMove={move} onPointerUp={() => { drawing.current = false; }} onPointerLeave={() => { drawing.current = false; }} /></div><p className="mt-3 text-center text-sm font-bold text-[#907990]">{drawingGoal} · Add {requiredStrokes} {requiredStrokes === 1 ? "creative line" : "creative lines"} to finish · {Math.min(currentStrokes, requiredStrokes)}/{requiredStrokes}</p></div>;
}

export default function Activity() {
  const { category: categoryParam } = useParams<{ category: string }>();
  const categoryId = CATEGORY_IDS.includes(categoryParam as CategoryId) ? categoryParam as CategoryId : CURRICULUM[0].id;
  const category = getCategory(categoryId);
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const profileId = getProfileIdFromSearch(window.location.search);
  const activityId = params.get("activity") ?? category.activities[0].id;
  const selectedActivity = category.activities.find((item) => item.id === activityId) ?? category.activities[0];
  const level = Math.max(1, Math.min(LEARNING_CONFIG.levelsPerSubject, Number(params.get("level")) || 1));
  const { isAuthenticated, loading } = useAuth();
  const snapshot = trpc.learning.childSnapshot.useQuery({ profileId }, { enabled: isAuthenticated && profileId > 0 });
  const complete = trpc.learning.completeActivity.useMutation();
  const [chosen, setChosen] = useState<string | null>(null);
  const [drawnStrokes, setDrawnStrokes] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [voicePaused, setVoicePaused] = useState(false);
  const [celebration, setCelebration] = useState<{ stars: number; milestone: boolean; badgeName?: string } | null>(null);
  const startedAt = useRef(Date.now());

  const profile = snapshot.data?.profile;
  const ageGroup = (profile?.ageGroup ?? "3–5") as AgeGroup;
  const adaptation = getAgeAdaptation(ageGroup, categoryId);
  const exercise = getActivityExercise(categoryId, selectedActivity.id, ageGroup, level);
  const options = useMemo(() => {
    const answers = [exercise.answer, ...exercise.choices.filter((choice) => choice !== exercise.answer)].slice(0, adaptation.maxAnswerOptions);
    const offset = answers.length ? (level - 1) % answers.length : 0;
    return [...answers.slice(offset), ...answers.slice(0, offset)];
  }, [exercise.answer, exercise.choices, adaptation.maxAnswerOptions, level]);
  const isDrawing = selectedActivity.interaction === "drawing";
  const isDrag = selectedActivity.interaction === "drag-and-drop";
  const requiredStrokes = ageGroup === "3–5" ? 1 + ((level - 1) % 2) : ageGroup === "6–8" ? 2 + ((level - 1) % 3) : 3 + ((level - 1) % 3);
  const answeredCorrectly = isDrawing ? drawnStrokes >= requiredStrokes : chosen === exercise.answer;
  const progress = snapshot.data?.progress.find((item) => item.subject === categoryId);
  const percent = Math.round(((progress?.completedLevels ?? 0) / LEARNING_CONFIG.levelsPerSubject) * 100);

  useEffect(() => {
    setChosen(null);
    setDrawnStrokes(0);
    setIncorrectAttempts(0);
    setVoicePaused(false);
    startedAt.current = Date.now();
  }, [categoryId, activityId, level]);

  const chooseOption = (option: string) => {
    setVoicePaused(true);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setChosen(option);
    if (option !== exercise.answer) setIncorrectAttempts((count) => count + 1);
  };

  const finishActivity = async () => {
    if (!answeredCorrectly || complete.isPending || !profile) return;
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
    const stars = calculateStars({ successful: true, incorrectAttempts, elapsedSeconds: durationSeconds, targetSeconds: adaptation.targetSeconds });
    const result = await complete.mutateAsync({ childProfileId: profile.id, category: categoryId, activityId: selectedActivity.id, levelNumber: level, interactionType: selectedActivity.interaction, stars, durationSeconds });
    setCelebration({ stars, milestone: result.completion.milestone, badgeName: result.completion.earnedMilestoneBadge ? `${category.title} milestone` : undefined });
  };

  if (!loading && !isAuthenticated) return <div className="kid-page grid min-h-screen place-items-center p-5"><div className="cloud-card max-w-md rounded-[2rem] p-8 text-center"><Sparkles className="mx-auto h-11 w-11 text-[#6C4CE0]" /><h1 className="font-display mt-5 text-3xl font-bold text-[#41375e]">A parent starts the adventure</h1><p className="mt-3 font-bold leading-relaxed text-[#7a7392]">Sign in to choose a child profile and keep every learning step safely in sync.</p><button onClick={() => startLogin()} className="lift-on-hover mt-7 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white shadow-[0_7px_0_#5638bd]">Sign in to continue</button></div></div>;
  if (snapshot.isLoading || loading) return <div className="kid-page grid min-h-screen place-items-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7ddff] border-t-[#6C4CE0]" /></div>;
  if (!profile) return <div className="kid-page grid min-h-screen place-items-center p-5"><div className="cloud-card max-w-md rounded-[2rem] p-8 text-center"><CircleHelp className="mx-auto h-11 w-11 text-[#ff8b5c]" /><h1 className="font-display mt-5 text-3xl font-bold text-[#41375e]">Choose a learning explorer</h1><p className="mt-3 font-bold leading-relaxed text-[#7a7392]">This activity needs a child profile so progress and rewards can be saved.</p><button onClick={() => setLocation("/profiles")} className="lift-on-hover mt-7 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white shadow-[0_7px_0_#5638bd]">Choose a profile</button></div></div>;

  return <div className="kid-page min-h-screen pb-10"><header className="container flex items-center justify-between py-5"><button onClick={() => setLocation(getCategoryActivitiesPath(categoryId, profileId))} className="lift-on-hover grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#514471] shadow-sm" aria-label="Back to activities"><ArrowLeft className="h-5 w-5" /></button><div className="text-center"><p className="font-display text-lg font-bold text-[#443a61]">{selectedActivity.title}</p><p className="mt-0.5 text-xs font-extrabold uppercase tracking-[.12em] text-[#9086a7]">{category.title} · Level {level}</p></div><div className="star-pill flex h-12 min-w-12 items-center justify-center gap-1 rounded-2xl px-3 font-black"><Star className="h-4 w-4 fill-current" /> {progress?.totalStars ?? 0}</div></header><main className="container max-w-5xl"><div className="mb-5 flex items-center gap-3"><div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e9e2f8]"><div className="h-full rounded-full transition-all" style={{ width: `${Math.max(8, percent)}%`, background: category.color }} /></div><span className="text-sm font-black text-[#746c8f]">{percent}%</span></div><section className="relative overflow-hidden rounded-[2.6rem] bg-white p-5 shadow-[0_18px_45px_rgba(58,39,115,.1)] sm:p-8 lg:p-10" style={{ borderTop: `8px solid ${category.color}` }}><div className="absolute -right-14 -top-16 h-48 w-48 rounded-full opacity-70" style={{ background: category.softColor }} /><div className="relative mx-auto max-w-3xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[.13em]" style={{ background: category.softColor, color: category.color }}><Sparkles className="h-3.5 w-3.5" /> {ageGroup} adventure</div><h1 className="font-display mt-5 text-3xl font-bold tracking-[-.035em] text-[#3e355e] sm:text-4xl">{exercise.instruction}</h1><p className="mt-3 max-w-xl text-base font-bold leading-relaxed text-[#78718f]">{exercise.hint}</p></div><VoiceGuidanceButton instructions={`${exercise.instruction} ${exercise.hint}`} autoPlay={adaptation.voiceAutoplay} paused={voicePaused} /></div><div className="mt-8">{isDrawing ? <DrawingPad requiredStrokes={requiredStrokes} currentStrokes={drawnStrokes} drawingGoal={exercise.drawingGoal ?? "Create your best work"} tracingGuide={exercise.tracingGuide} onDraw={() => { setVoicePaused(true); if ("speechSynthesis" in window) window.speechSynthesis.cancel(); setDrawnStrokes((count) => count + 1); }} /> : isDrag ? <><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => chooseOption(event.dataTransfer.getData("text/plain"))} className={`grid min-h-36 place-items-center rounded-[1.7rem] border-2 border-dashed p-5 text-center transition-colors ${chosen ? "border-[#74cdaa] bg-[#effbf6]" : "border-[#dcd1f5] bg-[#faf8ff]"}`}><p className="font-display text-3xl font-bold" style={{ color: chosen ? category.color : "#837a9c" }}>{chosen ? `${chosen}  ✓` : "Drop your answer here"}</p></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{options.map((option) => <button key={option} draggable onDragStart={(event) => { setVoicePaused(true); if ("speechSynthesis" in window) window.speechSynthesis.cancel(); event.dataTransfer.setData("text/plain", option); }} onClick={() => chooseOption(option)} className={`lift-on-hover min-h-24 rounded-[1.45rem] border-2 p-4 text-center ${chosen === option ? "border-[#6C4CE0] bg-[#f1eeff]" : "border-[#eee8dc] bg-[#fffdf9]"}`}><GripVertical className="mx-auto h-4 w-4 text-[#b0a7c4]" /><span className="font-display mt-2 block text-xl font-bold text-[#453c63]">{option}</span></button>)}</div></> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{options.map((option) => <button key={option} onClick={() => chooseOption(option)} className={`lift-on-hover grid min-h-32 place-items-center rounded-[1.75rem] border-2 p-4 text-center ${chosen === option ? "border-[#6C4CE0] bg-[#f0edff] shadow-[0_8px_0_#d9d0fb]" : "border-[#eee8dc] bg-[#fffdf9]"}`}><span className="font-display text-lg font-bold text-[#463d65]">{option}</span></button>)}</div>}</div>{chosen && !answeredCorrectly && !isDrawing && <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#fff2e9] p-4 text-sm font-bold text-[#a64d28]"><Lightbulb className="h-5 w-5 shrink-0" />Not quite. {exercise.hint}</div>}<div className="mt-8 flex flex-col-reverse justify-between gap-4 border-t border-[#f0ebdf] pt-6 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-sm font-bold text-[#8a82a1]"><Flag className="h-4 w-4" /> {adaptation.targetSeconds ? `Challenge time: ${adaptation.targetSeconds} seconds` : "Take your time — you are doing great."}</p><button onClick={finishActivity} disabled={!answeredCorrectly || complete.isPending} className="lift-on-hover inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-extrabold text-white shadow-[0_7px_0_#5638bd] disabled:cursor-not-allowed disabled:opacity-45" style={{ background: category.color }}>{complete.isPending ? "Saving your stars…" : <><Check className="h-5 w-5" /> Finish this level</>}</button></div></div></section></main>{celebration && <CelebrationOverlay {...celebration} onBackToLevels={() => setLocation(getCelebrationBackPath({ categoryId, profileId, activityId: selectedActivity.id }))} onNextLevel={() => setLocation(getCompletionNextPath({ categoryId, profileId, activityId: selectedActivity.id, level, levelsPerActivity: LEARNING_CONFIG.levelsPerSubject }))} />}</div>;
}
