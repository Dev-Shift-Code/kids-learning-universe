import { Award, ChevronRight, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

type CelebrationOverlayProps = {
  stars: number;
  milestone: boolean;
  badgeName?: string;
  onContinue: () => void;
};

const confetti = ["#FFC744", "#FF7F52", "#77D9B4", "#A78BFA", "#FF8CBE", "#53B0F7", "#F5D179", "#A8DF6E"];
export const CELEBRATION_CLAP_URL = "/manus-storage/celebration-crowd-clapping_6baab30d.mp3";

function playCelebrationSound(milestone: boolean) {
  const applause = new Audio(CELEBRATION_CLAP_URL);
  applause.volume = 0.85;
  void applause.play().catch(() => undefined);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const cheer = new SpeechSynthesisUtterance(milestone ? "Yehey! You earned a new badge!" : "Yehey! Great job!");
    cheer.rate = 1.08;
    cheer.pitch = 1.28;
    cheer.volume = 0.9;
    window.speechSynthesis.speak(cheer);
  }
}

export function CelebrationOverlay({ stars, milestone, badgeName, onContinue }: CelebrationOverlayProps) {
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    playCelebrationSound(milestone);
    const unlockTimer = window.setTimeout(() => setCanContinue(true), 1200);
    const continueTimer = window.setTimeout(onContinue, 3300);
    return () => {
      window.clearTimeout(unlockTimer);
      window.clearTimeout(continueTimer);
    };
  }, [milestone, onContinue]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#34295f]/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Activity celebration">
      {confetti.map((color, index) => (
        <span key={`${color}-${index}`} className="confetti-speck animate-float" style={{ backgroundColor: color, left: `${7 + ((index * 13) % 86)}%`, top: `${7 + ((index * 23) % 82)}%`, animationDelay: `${index * -0.42}s`, animationDuration: `${2.6 + (index % 3) * .5}s` }} />
      ))}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-[#fffaf3] p-7 text-center shadow-[0_24px_80px_rgba(36,25,76,.35)] sm:p-9">
        <div className="absolute -left-12 -top-14 h-36 w-36 rounded-full bg-[#e6ddff]" />
        <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-[#ffe0ad]" />
        <div className="relative">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[1.7rem] bg-[#6C4CE0] text-white shadow-[0_9px_0_#5334bd] animate-float">
            {milestone ? <Award className="h-10 w-10" /> : <Sparkles className="h-10 w-10" />}
          </div>
          <p className="mt-7 text-sm font-black uppercase tracking-[.17em] text-[#ef8049]">{milestone ? "A bright milestone" : "Quest complete"}</p>
          <h2 className="font-display mt-2 text-4xl font-bold tracking-[-.04em] text-[#3e355e]">{milestone ? "You did it!" : "Wonderful work!"}</h2>
          <p className="mt-3 text-base font-bold leading-relaxed text-[#77708f]">{milestone && badgeName ? `You earned the ${badgeName} badge and opened the next adventure.` : "Your next learning adventure is ready when you are."}</p>
          <div className="mt-7 flex justify-center gap-2" aria-label={`${stars} stars earned`}>
            {[1, 2, 3].map((star) => <Star key={star} className={`h-10 w-10 ${star <= stars ? "fill-[#ffc744] text-[#ffc744]" : "fill-[#eee7da] text-[#eee7da]"}`} />)}
          </div>
          <button type="button" onClick={onContinue} disabled={!canContinue} className="lift-on-hover mt-8 inline-flex min-h-13 items-center gap-2 rounded-2xl bg-[#ff8b5c] px-6 py-3.5 font-extrabold text-white shadow-[0_7px_0_#df6740] disabled:cursor-wait disabled:opacity-70">
            {canContinue ? <>Keep exploring <ChevronRight className="h-5 w-5" /></> : "Celebrating…"}
          </button>
        </div>
      </div>
    </div>
  );
}
