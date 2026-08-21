import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { LEARNING_CONFIG, type AgeGroup } from "@shared/learningConfig";
import { ArrowRight, BookOpen, Calculator, ChevronRight, FlaskConical, Heart, LockKeyhole, Music, Palette, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const subjectIcons = {
  calculator: Calculator,
  "book-open": BookOpen,
  "flask-conical": FlaskConical,
  palette: Palette,
  music: Music,
};

const ageCopy: Record<AgeGroup, string> = {
  "3–5": "Big pictures, gentle steps, and lots of cheerful voice support.",
  "6–8": "Curious challenges with a little more reading and problem-solving.",
  "9–10": "Smart missions, streaks, and brain-boosting challenges await.",
};

export default function Home() {
  const [selectedAge, setSelectedAge] = useState<AgeGroup>("3–5");
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  const beginLearning = () => {
    if (isAuthenticated) setLocation("/profiles");
    else startLogin();
  };

  return (
    <div className="kid-page home-shell">
      <div className="orbit-dot h-4 w-4 bg-[#FFC744] left-[7%] top-[22%] animate-twinkle" />
      <div className="orbit-dot h-7 w-7 bg-[#BFEFE0] right-[7%] top-[35%] animate-float" />
      <div className="orbit-dot h-3 w-3 bg-[#FF9FC3] left-[43%] top-[9%] animate-twinkle" />

      <header className="container flex items-center justify-between py-5 md:py-7">
        <button onClick={() => setLocation("/")} className="flex items-center gap-3 rounded-2xl p-1 text-left" aria-label="Kids Learning Universe home">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#6C4CE0] text-white shadow-[0_7px_0_#5638bd]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-bold leading-none tracking-tight">Learning Universe</p>
            <p className="mt-1 text-xs font-extrabold uppercase tracking-[.15em] text-[#867fa2]">Play. Grow. Glow.</p>
          </div>
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setLocation("/parent")} className="lift-on-hover flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-sm font-extrabold text-[#5d587d] shadow-sm sm:px-4" aria-label="Open parent space">
            <LockKeyhole className="h-4 w-4 text-[#6C4CE0]" />
            <span className="hidden sm:inline">Parent space</span>
          </button>
          <button onClick={beginLearning} disabled={loading} className="lift-on-hover rounded-2xl bg-[#6C4CE0] px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_7px_0_#5638bd] disabled:opacity-60 sm:px-5">
            {isAuthenticated ? "My family" : "Sign in"}
          </button>
        </div>
      </header>

      <main>
        <section className="container grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[1.08fr_.92fr] lg:pb-24 lg:pt-14">
          <div className="max-w-2xl animate-pop-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#fff0b8] px-4 py-2 text-sm font-extrabold text-[#805110] shadow-sm">
              <Star className="h-4 w-4 fill-current" />
              A universe made for growing minds
            </div>
            <h1 className="font-display text-5xl font-bold leading-[.98] tracking-[-.045em] text-[#322b56] sm:text-6xl md:text-7xl">
              Little learners.<br />
              <span className="sparkle-text">Big bright ideas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-bold leading-relaxed text-[#736d92] md:text-xl">
              Choose an age group, follow the wonder, and discover a new favorite thing to learn every day.
            </p>

            <div className="cloud-card mt-8 rounded-[1.85rem] p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-[#3c355f]">Who is playing today?</p>
                  <p className="mt-1 text-sm font-bold text-[#817a9e]">{ageCopy[selectedAge]}</p>
                </div>
                <div className="flex gap-2" role="group" aria-label="Choose age group">
                  {LEARNING_CONFIG.ageGroups && (Object.keys(LEARNING_CONFIG.ageGroups) as AgeGroup[]).map((age) => (
                    <button key={age} type="button" className="age-button" aria-pressed={selectedAge === age} onClick={() => setSelectedAge(age)}>{age}</button>
                  ))}
                </div>
              </div>
              <button onClick={beginLearning} disabled={loading} className="lift-on-hover mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8b5c] px-5 py-4 text-base font-extrabold text-white shadow-[0_7px_0_#df6740] disabled:opacity-60 sm:w-auto">
                Start a learning adventure <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[480px] lg:mr-0">
            <div className="absolute -left-7 top-12 h-14 w-14 rounded-[1.5rem] bg-[#ffe3ed] animate-float" />
            <div className="absolute -right-3 bottom-11 h-16 w-16 rounded-full bg-[#dbf6ea] animate-float [animation-delay:-1.8s]" />
            <div className="soft-ring relative overflow-hidden rounded-[2.8rem] border-[10px] border-white bg-gradient-to-br from-[#E9E3FF] via-[#FEECF5] to-[#FFF3CF] p-5 sm:p-7">
              <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#ffc3d9]/70" />
              <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#c5efd9]/70" />
              <div className="relative rounded-[2rem] bg-white/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.8)] backdrop-blur-sm sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-[#6C4CE0] px-3 py-2 text-xs font-black uppercase tracking-[.13em] text-white">Today&apos;s quest</div>
                  <Sparkles className="h-6 w-6 text-[#f1a526] animate-twinkle" />
                </div>
                <div className="mt-9 flex justify-center gap-4">
                  <div className="animate-float grid h-24 w-24 place-items-center rounded-[2rem] bg-[#FFE4AD] shadow-[0_9px_0_#f5bf54]"><span className="font-display text-5xl">7</span></div>
                  <div className="mt-8 grid h-16 w-16 place-items-center rounded-[1.4rem] bg-[#D8F2E6] text-[#159367] shadow-[0_7px_0_#8fd2b4]"><span className="font-display text-3xl">+</span></div>
                  <div className="animate-float grid h-24 w-24 place-items-center rounded-[2rem] bg-[#E3DBFF] shadow-[0_9px_0_#b9a8fb] [animation-delay:-1.2s]"><span className="font-display text-5xl">3</span></div>
                </div>
                <div className="mt-10 rounded-2xl bg-[#f6f3ff] p-4 text-center">
                  <p className="font-display text-xl font-bold text-[#4a3e84]">What comes next?</p>
                  <div className="mt-3 flex justify-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-display font-bold text-[#4a3e84] shadow-sm">8</span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#6C4CE0] font-display font-bold text-white shadow-sm">10</span>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-display font-bold text-[#4a3e84] shadow-sm">9</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-center gap-2 text-sm font-extrabold text-[#967e43]"><Star className="h-4 w-4 fill-[#ffc744] text-[#ffc744]" /> Learn, play, and collect stars</div>
              </div>
            </div>
          </div>
        </section>

        <section className="container pb-20">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[.16em] text-[#f07c45]">Pick a portal</p>
              <h2 className="font-display mt-1 text-3xl font-bold tracking-[-.03em] text-[#372f5c] sm:text-4xl">What sounds fun right now?</h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm font-bold leading-relaxed text-[#837c9e] sm:block">Every subject grows with the learner.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {LEARNING_CONFIG.subjects.map((subject, index) => {
              const Icon = subjectIcons[subject.icon];
              return (
                <button key={subject.id} onClick={() => beginLearning()} className="subject-card lift-on-hover group p-5 text-left" style={{ "--subject": subject.color, "--soft": subject.softColor, animationDelay: `${index * 60}ms` } as React.CSSProperties}>
                  <div className="subject-icon relative z-10"><Icon className="h-6 w-6" /></div>
                  <div className="relative z-10 mt-8">
                    <p className="font-display text-2xl font-bold tracking-[-.03em] text-[#3f385f]">{subject.id}</p>
                    <p className="mt-2 min-h-10 text-sm font-bold leading-snug text-[#827b9e]">{subject.tagline}</p>
                  </div>
                  <span className="relative z-10 mt-5 flex items-center gap-1 text-sm font-black" style={{ color: subject.color }}>Explore <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="container pb-20">
          <div className="grid gap-5 rounded-[2.5rem] bg-[#43356f] p-6 text-white shadow-[0_18px_45px_rgba(61,45,103,.18)] sm:grid-cols-3 sm:p-8">
            {[
              ["1", "Pick an age", "A learning path grows just right."],
              ["2", "Follow the quest", "Listen, tap, move, and make."],
              ["3", "Collect bright things", "Stars and badges celebrate brave tries."],
            ].map(([step, title, text]) => (
              <div key={step} className="flex gap-4 sm:block">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#f8bf45] font-display text-xl font-bold text-[#493962] shadow-[0_5px_0_#d89b23]">{step}</span>
                <div className="sm:mt-5"><h3 className="font-display text-xl font-bold">{title}</h3><p className="mt-1 text-sm font-bold leading-relaxed text-[#d9d1f0]">{text}</p></div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="container flex flex-col gap-3 border-t border-[#eee7d9] py-7 text-sm font-bold text-[#918aaa] sm:flex-row sm:items-center sm:justify-between">
        <p>Made with a little extra wonder for young learners.</p>
        <button onClick={() => setLocation("/parent")} className="inline-flex items-center gap-2 text-[#6C4CE0] hover:text-[#5236b7]"><Heart className="h-4 w-4 fill-current" /> Parent controls &amp; progress</button>
      </footer>
    </div>
  );
}
