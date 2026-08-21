import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { CURRICULUM } from "@shared/curriculumConfig";
import { LEARNING_CONFIG } from "@shared/learningConfig";
import { ArrowLeft, Award, BarChart3, Check, Clock3, LockKeyhole, ShieldCheck, Sparkles, Star, UsersRound, type LucideIcon } from "lucide-react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { useLocation } from "wouter";

function minutes(seconds: number) {
  return Math.max(0, Math.round(seconds / 60));
}

function SummaryCard({ Icon, value, label, background }: { Icon: LucideIcon; value: ReactNode; label: string; background: string }) {
  return (
    <div className="rounded-[1.8rem] bg-white p-5 shadow-[0_10px_25px_rgba(64,47,110,.07)]">
      <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background, color: "#5d4aa7" }}><Icon className="h-5 w-5" /></span>
      <p className="font-display mt-5 text-3xl font-bold text-[#443a62]">{value}</p>
      <p className="mt-1 text-sm font-bold text-[#827b9e]">{label}</p>
    </div>
  );
}

export default function ParentDashboard() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinMessage, setPinMessage] = useState("");
  const pinStatus = trpc.learning.parentPinStatus.useQuery(undefined, { enabled: isAuthenticated });
  const configurePin = trpc.learning.configureParentPin.useMutation();
  const verifyPin = trpc.learning.verifyParentPin.useMutation();
  const family = trpc.learning.familySnapshot.useMutation();
  const configured = pinStatus.data?.configured ?? false;
  const snapshots = family.data ?? [];
  const totals = useMemo(() => snapshots.reduce((summary, child) => ({
    time: summary.time + child.timeSpentSeconds,
    activities: summary.activities + child.completedActivities,
    badges: summary.badges + child.badges.length,
    stars: summary.stars + child.progress.reduce((total, item) => total + item.totalStars, 0),
  }), { time: 0, activities: 0, badges: 0, stars: 0 }), [snapshots]);

  const submitPin = async (event: FormEvent) => {
    event.preventDefault();
    setPinMessage("");
    try {
      if (!configured) {
        await configurePin.mutateAsync({ pin });
      } else {
        const result = await verifyPin.mutateAsync({ pin });
        if (!result.verified) {
          setPinMessage("That PIN doesn’t match. Please try again.");
          return;
        }
      }
      await pinStatus.refetch();
      await family.mutateAsync({ pin });
      setUnlocked(true);
    } catch (error) {
      setPinMessage(error instanceof Error ? error.message : "Please enter a 4–6 digit PIN.");
    }
  };

  if (!loading && !isAuthenticated) {
    return <div className="kid-page grid min-h-screen place-items-center p-5"><div className="cloud-card max-w-md rounded-[2rem] p-8 text-center"><ShieldCheck className="mx-auto h-11 w-11 text-[#6C4CE0]" /><h1 className="font-display mt-5 text-3xl font-bold text-[#41375e]">Parent space</h1><p className="mt-3 font-bold leading-relaxed text-[#7a7392]">Sign in to set your parent PIN and see safe, private learning progress for every child.</p><button onClick={() => startLogin()} className="lift-on-hover mt-7 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white shadow-[0_7px_0_#5638bd]">Sign in</button></div></div>;
  }

  if (loading || pinStatus.isLoading) {
    return <div className="kid-page grid min-h-screen place-items-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e7ddff] border-t-[#6C4CE0]" /></div>;
  }

  if (!unlocked) {
    return (
      <div className="kid-page grid min-h-screen place-items-center p-5">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white p-8 text-center shadow-[0_20px_60px_rgba(61,45,103,.15)]">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#eee8ff]" />
          <button onClick={() => setLocation("/")} className="relative float-left grid h-10 w-10 place-items-center rounded-xl bg-[#faf8ff] text-[#5c527d]" aria-label="Back home"><ArrowLeft className="h-4 w-4" /></button>
          <div className="relative clear-both pt-4">
            <div className="mx-auto grid h-18 w-18 place-items-center rounded-[1.5rem] bg-[#6C4CE0] text-white shadow-[0_8px_0_#5638bd]"><LockKeyhole className="h-8 w-8" /></div>
            <p className="mt-6 text-sm font-black uppercase tracking-[.17em] text-[#f07c45]">Grown-up check</p>
            <h1 className="font-display mt-2 text-4xl font-bold tracking-[-.04em] text-[#423a60]">{configured ? "Enter your PIN" : "Make your parent PIN"}</h1>
            <p className="mx-auto mt-3 max-w-sm font-bold leading-relaxed text-[#7b7494]">{configured ? "This keeps learning details private from little explorers." : "Choose a 4–6 digit PIN. You will use it whenever you open this private parent space."}</p>
            <form onSubmit={submitPin} className="mt-7">
              <input autoFocus value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" type="password" autoComplete={configured ? "current-password" : "new-password"} placeholder="• • • •" className="h-16 w-full rounded-2xl border-2 border-[#e5dcf4] bg-[#fbfaff] text-center font-display text-3xl font-bold tracking-[.5em] text-[#4b3a88] outline-none focus:border-[#6C4CE0] focus:ring-4 focus:ring-[#eae5ff]" />
              <p className="mt-3 text-xs font-bold text-[#9289a8]">4 to 6 digits</p>
              {pinMessage && <p className="mt-4 rounded-xl bg-[#fff0ea] p-3 text-sm font-bold text-[#b14c29]">{pinMessage}</p>}
              <button disabled={pin.length < 4 || configurePin.isPending || verifyPin.isPending} className="lift-on-hover mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8b5c] font-extrabold text-white shadow-[0_7px_0_#df6740] disabled:opacity-55">{configured ? "Unlock parent space" : "Secure parent space"} <Check className="h-5 w-5" /></button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kid-page min-h-screen pb-12">
      <header className="container flex items-center justify-between py-6">
        <button onClick={() => setLocation("/")} className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#6C4CE0] text-white shadow-[0_7px_0_#5638bd]"><Sparkles className="h-5 w-5" /></div><span className="font-display hidden text-xl font-bold text-[#41375e] sm:inline">Learning Universe</span></button>
        <button onClick={() => { setUnlocked(false); setPin(""); }} className="lift-on-hover rounded-2xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#5b527b] shadow-sm">Lock parent space</button>
      </header>
      <main className="container max-w-6xl">
        <section className="rounded-[2.6rem] bg-[#44356f] p-6 text-white shadow-[0_18px_45px_rgba(61,45,103,.18)] sm:p-8"><p className="text-sm font-black uppercase tracking-[.16em] text-[#ffd268]">Private family overview</p><h1 className="font-display mt-2 text-4xl font-bold tracking-[-.04em] sm:text-5xl">Learning, at a glance</h1><p className="mt-3 max-w-2xl font-bold leading-relaxed text-[#dad2ef]">Celebrate effort, spot favorite subjects, and help every explorer choose their next bright challenge.</p></section>
        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard Icon={UsersRound} value={snapshots.length} label="Explorers" background="#E9E1FF" />
          <SummaryCard Icon={Clock3} value={`${minutes(totals.time)} min`} label="Time learning" background="#DFF7ED" />
          <SummaryCard Icon={BarChart3} value={totals.activities} label="Activities done" background="#FFE9DE" />
          <SummaryCard Icon={Award} value={totals.badges} label="Badges earned" background="#FFF1CB" />
        </section>
        {family.isPending ? <div className="mt-8 grid place-items-center rounded-[2rem] bg-white p-12"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e7ddff] border-t-[#6C4CE0]" /></div> : <section className="mt-8 space-y-5">
          {snapshots.length === 0 ? <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm"><UsersRound className="mx-auto h-9 w-9 text-[#6C4CE0]" /><h2 className="font-display mt-4 text-2xl font-bold text-[#423a60]">No explorers yet</h2><p className="mt-2 font-bold text-[#827b9e]">Create a child profile to begin tracking individual learning journeys.</p><button onClick={() => setLocation("/profiles")} className="lift-on-hover mt-5 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white shadow-[0_7px_0_#5638bd]">Create a profile</button></div> : snapshots.map((child) => <article key={child.profile.id} className="overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_10px_28px_rgba(64,47,110,.07)] sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span className="grid h-15 w-15 place-items-center rounded-[1.45rem] bg-[#f0ecff] text-3xl">{child.profile.avatar}</span><div><h2 className="font-display text-2xl font-bold text-[#423a60]">{child.profile.name}</h2><p className="mt-1 text-sm font-bold text-[#827b9e]">Age {child.profile.ageGroup} · {minutes(child.timeSpentSeconds)} minutes · {child.completedActivities} completed</p></div></div><div className="flex gap-2"><span className="star-pill inline-flex h-10 items-center gap-1 rounded-2xl px-3 text-sm font-black"><Star className="h-4 w-4 fill-current" /> {child.progress.reduce((sum, item) => sum + item.totalStars, 0)}</span><span className="inline-flex h-10 items-center gap-1 rounded-2xl bg-[#fff4da] px-3 text-sm font-black text-[#9b6616]"><Award className="h-4 w-4" /> {child.badges.length}</span></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">{CURRICULUM.map((category) => { const progress = child.progress.find((item) => item.subject === category.id); const completed = progress?.completedLevels ?? 0; const pct = Math.round((completed / LEARNING_CONFIG.levelsPerSubject) * 100); return <div key={category.id} className="rounded-2xl bg-[#faf9ff] p-3"><div className="flex items-center justify-between"><span className="text-xs font-black text-[#605878]">{category.title}</span><span className="text-xs font-black" style={{ color: category.color }}>{pct}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9e4f2]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: category.color }} /></div><p className="mt-2 text-xs font-bold text-[#938ba7]">{completed}/{LEARNING_CONFIG.levelsPerSubject} levels</p></div>; })}</div>
            {child.badges.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{child.badges.map((badge) => <span key={badge.id} className="inline-flex items-center gap-1.5 rounded-xl bg-[#fff6dd] px-3 py-2 text-xs font-black text-[#936017]"><Sparkles className="h-3.5 w-3.5" /> {badge.badgeId.replaceAll("-", " ")}</span>)}</div>}
          </article>)}
        </section>}
      </main>
    </div>
  );
}
