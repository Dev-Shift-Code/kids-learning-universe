import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { CURRICULUM } from "@shared/curriculumConfig";
import { AGE_GROUPS, LEARNING_CONFIG, type AgeGroup } from "@shared/learningConfig";
import { getProfileLibraryPath } from "@shared/profileRoute";
import { Baby, Check, ChevronRight, CirclePlus, LockKeyhole, Sparkles, Star, Trophy, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useLocation } from "wouter";

const avatarChoices = ["🦊", "🐼", "🦁", "🐨", "🐸", "🐳", "🦄", "🐯"];

export default function Profiles() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const profiles = trpc.learning.profiles.useQuery(undefined, { enabled: isAuthenticated });
  const summaries = trpc.learning.profileSummaries.useQuery(undefined, { enabled: isAuthenticated });
  const createProfile = trpc.learning.createProfile.useMutation({ onSuccess: () => { profiles.refetch(); summaries.refetch(); } });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatarChoices[0]);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("3–5");
  const [formError, setFormError] = useState("");
  const children = profiles.data ?? [];
  const summariesById = useMemo(() => new Map((summaries.data ?? []).map((summary) => [summary.profile.id, summary])), [summaries.data]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    try {
      await createProfile.mutateAsync({ name, avatar, ageGroup });
      setName("");
      setAvatar(avatarChoices[(avatarChoices.indexOf(avatar) + 1) % avatarChoices.length]);
      setAgeGroup("3–5");
      setShowForm(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We could not create this profile just yet.");
    }
  };

  if (!loading && !isAuthenticated) {
    return <div className="kid-page grid min-h-screen place-items-center p-5"><div className="cloud-card max-w-md rounded-[2rem] p-8 text-center"><LockKeyhole className="mx-auto h-11 w-11 text-[#6C4CE0]" /><h1 className="font-display mt-5 text-3xl font-bold text-[#41375e]">A grown-up keeps the magic safe</h1><p className="mt-3 font-bold leading-relaxed text-[#7a7392]">Sign in once to make individual profiles and keep every child’s learning journey in sync.</p><button onClick={() => startLogin()} className="lift-on-hover mt-7 rounded-2xl bg-[#6C4CE0] px-5 py-3 font-extrabold text-white shadow-[0_7px_0_#5638bd]">Sign in to begin</button></div></div>;
  }

  return (
    <div className="kid-page min-h-screen pb-12">
      <header className="container flex items-center justify-between py-6"><button onClick={() => setLocation("/")} className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#6C4CE0] text-white shadow-[0_7px_0_#5638bd]"><Sparkles className="h-5 w-5" /></div><span className="font-display hidden text-xl font-bold text-[#41375e] sm:inline">Learning Universe</span></button><button onClick={() => setLocation("/parent")} className="lift-on-hover flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-extrabold text-[#5b527b] shadow-sm"><LockKeyhole className="h-4 w-4 text-[#6C4CE0]" /> Parent space</button></header>
      <main className="container max-w-5xl">
        <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-black uppercase tracking-[.16em] text-[#f07c45]">Family launchpad</p><h1 className="font-display mt-2 text-4xl font-bold tracking-[-.04em] text-[#40375e] sm:text-5xl">Who&apos;s ready to explore?</h1><p className="mt-3 text-base font-bold leading-relaxed text-[#7b7494]">Each explorer gets their own stars, badges, level map, and learning pace.</p></div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {children.map((child) => {
            const summary = summariesById.get(child.id);
            const completed = summary?.progress.reduce((total, item) => total + item.completedLevels, 0) ?? 0;
            const stars = summary?.progress.reduce((total, item) => total + item.totalStars, 0) ?? 0;
            const totalLevels = LEARNING_CONFIG.levelsPerSubject * CURRICULUM.reduce((total, category) => total + category.activities.length, 0);
            const percent = Math.round((completed / totalLevels) * 100);
            return <button key={child.id} onClick={() => setLocation(getProfileLibraryPath(child.id))} className="lift-on-hover group min-h-72 overflow-hidden rounded-[2rem] bg-white p-5 text-left shadow-[0_12px_34px_rgba(63,45,116,.1)]"><div className="flex items-start justify-between"><span className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-[#f0ecff] text-4xl shadow-[0_6px_0_#d9d1fa]">{child.avatar}</span><ChevronRight className="h-5 w-5 text-[#a39bb8] transition-transform group-hover:translate-x-1" /></div><div className="mt-6"><p className="font-display text-2xl font-bold text-[#423a60]">{child.name}</p><p className="mt-1 inline-flex rounded-full bg-[#fff1de] px-2.5 py-1 text-xs font-black text-[#b76433]">Age {child.ageGroup}</p><div className="mt-5 rounded-2xl bg-[#faf9ff] p-3"><div className="flex items-center justify-between text-xs font-black text-[#746c8f]"><span>Universe progress</span><span className="text-[#6C4CE0]">{percent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9e4f2]"><div className="h-full rounded-full bg-[#6C4CE0] transition-all" style={{ width: `${percent}%` }} /></div><div className="mt-3 flex items-center justify-between text-xs font-bold text-[#938ba7]"><span>{completed}/{totalLevels} levels</span><span className="inline-flex items-center gap-1 text-[#a36a12]"><Star className="h-3.5 w-3.5 fill-[#f4b939] text-[#f4b939]" /> {stars}</span></div></div></div></button>;
          })}
          {children.length < LEARNING_CONFIG.maxProfilesPerFamily && <button onClick={() => setShowForm(true)} className="lift-on-hover grid min-h-72 place-items-center rounded-[2rem] border-2 border-dashed border-[#d7caef] bg-white/55 p-5 text-center text-[#655795]"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] bg-[#ede8ff]"><CirclePlus className="h-7 w-7" /></span><p className="font-display mt-5 text-xl font-bold">Add an explorer</p><p className="mt-2 text-sm font-bold text-[#938bad]">{LEARNING_CONFIG.maxProfilesPerFamily - children.length} spaces left</p></div></button>}
        </div>
        {children.length === 0 && !profiles.isLoading && <div className="mt-8 rounded-[2rem] border border-[#eee5d9] bg-[#fffdf9] p-5 text-center text-sm font-bold text-[#7e7596]"><Trophy className="mx-auto mb-2 h-6 w-6 text-[#6C4CE0]" />Start by making the first explorer profile. You can make up to four profiles for one family.</div>}
      </main>

      {showForm && <div className="fixed inset-0 z-50 grid place-items-center bg-[#30275b]/55 p-4 backdrop-blur-sm"><form onSubmit={submit} className="relative w-full max-w-md rounded-[2.3rem] bg-[#fffaf3] p-7 shadow-[0_24px_80px_rgba(36,25,76,.34)]"><button type="button" onClick={() => setShowForm(false)} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-xl bg-white text-[#817891] shadow-sm" aria-label="Close profile form"><X className="h-4 w-4" /></button><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#6C4CE0] text-white"><Baby className="h-7 w-7" /></div><h2 className="font-display mt-5 text-3xl font-bold text-[#41375e]">New explorer</h2><p className="mt-2 text-sm font-bold text-[#7c7593]">Create a personal launchpad for this child.</p><label className="mt-6 block text-sm font-black text-[#5e557a]">Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required placeholder="Explorer name" className="mt-2 h-12 w-full rounded-2xl border-[#e8dfd1] bg-white px-4 font-bold text-[#423a60] outline-none focus:border-[#6C4CE0] focus:ring-4 focus:ring-[#eae5ff]" /></label><p className="mt-5 text-sm font-black text-[#5e557a]">Choose an avatar</p><div className="mt-2 grid grid-cols-4 gap-2">{avatarChoices.map((choice) => <button key={choice} type="button" onClick={() => setAvatar(choice)} className={`grid h-13 place-items-center rounded-2xl text-2xl ${avatar === choice ? "bg-[#eae5ff] ring-2 ring-[#6C4CE0]" : "bg-white"}`}>{choice}</button>)}</div><p className="mt-5 text-sm font-black text-[#5e557a]">Age group</p><div className="mt-2 grid grid-cols-3 gap-2">{AGE_GROUPS.map((age) => <button key={age} type="button" onClick={() => setAgeGroup(age)} className={`min-h-12 rounded-2xl text-sm font-black ${age === ageGroup ? "bg-[#6C4CE0] text-white" : "bg-white text-[#71698d]"}`}>{age}</button>)}</div>{formError && <p className="mt-4 rounded-xl bg-[#fff0ea] p-3 text-sm font-bold text-[#b14c29]">{formError}</p>}<button disabled={createProfile.isPending} className="lift-on-hover mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8b5c] font-extrabold text-white shadow-[0_7px_0_#df6740] disabled:opacity-60">{createProfile.isPending ? "Creating…" : <><Check className="h-5 w-5" /> Create explorer</>}</button></form></div>}
    </div>
  );
}
