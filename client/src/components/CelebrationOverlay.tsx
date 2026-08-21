import { Award, ChevronRight, Home, Sparkles, Star } from "lucide-react";
import React, { useEffect } from "react";

type CelebrationOverlayProps = {
  stars: number;
  milestone: boolean;
  badgeName?: string;
  onBackHome: () => void;
  onNextLevel: () => void;
};

const confetti = ["#FFC744", "#FF7F52", "#77D9B4", "#A78BFA", "#FF8CBE", "#53B0F7", "#F5D179", "#A8DF6E"];
export const CELEBRATION_CLAP_URL = "/manus-storage/celebration-crowd-clapping_6baab30d.mp3";
export const CELEBRATION_SOUND_DURATION_MS = 3000;

function playCelebrationSound() {
  const applause = new Audio(CELEBRATION_CLAP_URL);
  applause.volume = 0.85;
  void applause.play().catch(() => undefined);
  const stopTimer = window.setTimeout(() => {
    applause.pause();
    applause.currentTime = 0;
  }, CELEBRATION_SOUND_DURATION_MS);
  return () => {
    window.clearTimeout(stopTimer);
    applause.pause();
    applause.currentTime = 0;
  };
}

export function CelebrationOverlay({ stars, milestone, badgeName, onBackHome, onNextLevel }: CelebrationOverlayProps) {
  useEffect(() => {
    const stopSound = playCelebrationSound();
    return () => {
      stopSound();
    };
  }, []);

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
          <div className="mt-8 grid gap-3 sm:grid-cols-2"><button type="button" onClick={onBackHome} className="lift-on-hover inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 font-extrabold text-[#5a4b85] shadow-[0_6px_0_#e7dff2]"><Home className="h-5 w-5" /> Back to Home</button><button type="button" onClick={onNextLevel} className="lift-on-hover inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#ff8b5c] px-5 py-3.5 font-extrabold text-white shadow-[0_7px_0_#df6740]">Next Level <ChevronRight className="h-5 w-5" /></button></div>
        </div>
      </div>
    </div>
  );
}
