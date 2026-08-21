import { trpc } from "@/lib/trpc";
import { LEARNING_CONFIG, SUBJECTS, type Subject } from "@shared/learningConfig";
import { ArrowLeft, Award, Lock, Play, Sparkles, Star } from "lucide-react";
import { useLocation, useParams } from "wouter";

export default function Levels() {
  const { subject: subjectParam } = useParams<{ subject: string }>();
  const subject = SUBJECTS.includes(subjectParam as Subject) ? subjectParam as Subject : "Math";
  const [location, setLocation] = useLocation();
  const profileId = Number(new URLSearchParams(location.split("?")[1] ?? "").get("profile"));
  const snapshot = trpc.learning.childSnapshot.useQuery({ profileId }, { enabled: profileId > 0 });
  const definition = LEARNING_CONFIG.subjects.find((item) => item.id === subject)!;

  if (snapshot.isLoading) return <div className="kid-page grid min-h-screen place-items-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7ddff] border-t-[#6C4CE0]" /></div>;
  if (!snapshot.data) return <div className="kid-page grid min-h-screen place-items-center p-5"><div className="cloud-card rounded-[2rem] p-8 text-center"><p className="font-display text-2xl font-bold text-[#423a60]">Choose an explorer first</p><button onClick={() => setLocation("/profiles")} className="mt-5 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white">Back to profiles</button></div></div>;

  const progress = snapshot.data.progress.find((item) => item.subject === subject);
  const unlockedLevel = progress?.unlockedLevel ?? 1;
  const completedLevels = progress?.completedLevels ?? 0;
  const percentage = Math.round((completedLevels / LEARNING_CONFIG.levelsPerSubject) * 100);

  return (
    <div className="kid-page min-h-screen pb-12">
      <header className="container flex items-center justify-between py-5"><button onClick={() => setLocation(`/library?profile=${profileId}`)} className="lift-on-hover grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#514471] shadow-sm" aria-label="Back to subject library"><ArrowLeft className="h-5 w-5" /></button><div className="text-center"><p className="font-display text-xl font-bold text-[#423a60]">{subject} level map</p><p className="text-xs font-extrabold uppercase tracking-[.13em] text-[#8d84a4]">{snapshot.data.profile.name}&apos;s adventure</p></div><span className="star-pill inline-flex h-12 items-center gap-1 rounded-2xl px-3 text-sm font-black"><Star className="h-4 w-4 fill-current" /> {progress?.totalStars ?? 0}</span></header>
      <main className="container max-w-4xl">
        <section className="relative overflow-hidden rounded-[2.5rem] p-6 text-white shadow-[0_18px_45px_rgba(61,45,103,.18)] sm:p-8" style={{ background: definition.color }}><div className="absolute -right-8 -top-11 h-40 w-40 rounded-full bg-white/20" /><div className="relative"><p className="text-sm font-black uppercase tracking-[.15em] text-white/75">Follow the star trail</p><h1 className="font-display mt-2 text-4xl font-bold tracking-[-.04em]">{definition.activityName}</h1><p className="mt-2 max-w-xl font-bold text-white/85">Every finished level opens the next bright stop. Milestone levels unlock collectible badges.</p><div className="mt-6 flex items-center gap-3"><div className="h-3 flex-1 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${percentage}%` }} /></div><span className="text-sm font-black">{completedLevels}/{LEARNING_CONFIG.levelsPerSubject}</span></div></div></section>
        <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-[0_12px_30px_rgba(64,47,110,.07)] sm:p-7"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-black uppercase tracking-[.15em] text-[#f07c45]">Choose a level</p><h2 className="font-display mt-1 text-3xl font-bold text-[#423a60]">Your star trail</h2></div><p className="text-sm font-bold text-[#857d9d]">Level {unlockedLevel} is ready now.</p></div><div className="mt-7 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">{Array.from({ length: LEARNING_CONFIG.levelsPerSubject }, (_, index) => index + 1).map((level) => { const playable = level <= unlockedLevel; const milestone = LEARNING_CONFIG.milestoneLevels.includes(level as 3 | 6 | 12); const completed = level <= completedLevels; return <button key={level} disabled={!playable} onClick={() => setLocation(`/activity/${subject}?profile=${profileId}&level=${level}`)} className={`lift-on-hover relative min-h-24 rounded-[1.45rem] border-2 p-3 text-center ${playable ? "border-transparent bg-[#fbfaff] text-[#453c63] shadow-[0_6px_0_#e5e0ef]" : "cursor-not-allowed border-[#eee9e0] bg-[#f5f2ed] text-[#b6afc0]"}`} style={playable ? { borderColor: level === unlockedLevel ? definition.color : "transparent", boxShadow: level === unlockedLevel ? `0 0 0 4px ${definition.softColor}, 0 7px 0 #e5e0ef` : undefined } : undefined}><span className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${playable ? "bg-white" : "bg-[#e9e5df]"}`}>{playable ? completed ? <Sparkles className="h-4 w-4" style={{ color: definition.color }} /> : <Play className="h-4 w-4" style={{ color: definition.color }} /> : <Lock className="h-4 w-4" />}</span><span className="font-display mt-2 block text-xl font-bold">{level}</span>{milestone && <Award className={`absolute -right-1 -top-1 h-5 w-5 ${playable ? "text-[#f2a725]" : "text-[#c4bdad]"}`} />}</button>; })}</div><div className="mt-7 flex flex-wrap gap-3 border-t border-[#f0ebdf] pt-5 text-xs font-bold text-[#827a99]"><span className="inline-flex items-center gap-1.5"><Play className="h-3.5 w-3.5" style={{ color: definition.color }} /> Ready to play</span><span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-[#aaa2b5]" /> Locked</span><span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-[#f2a725]" /> Badge milestone</span></div></section>
      </main>
    </div>
  );
}
