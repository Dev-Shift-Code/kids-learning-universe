import { Volume2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type VoiceGuidanceButtonProps = {
  instructions: string;
  autoPlay?: boolean;
};

export function VoiceGuidanceButton({ instructions, autoPlay = false }: VoiceGuidanceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceBlocked, setVoiceBlocked] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(() => {
    if (!supported) return;
    setVoiceBlocked(false);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(instructions);
    utterance.rate = 0.88;
    utterance.pitch = 1.15;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceBlocked(true);
    };
    window.speechSynthesis.speak(utterance);
  }, [instructions, supported]);

  useEffect(() => {
    if (!autoPlay || !supported) return;
    const timer = window.setTimeout(speak, 450);
    return () => {
      window.clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [autoPlay, speak, supported]);

  return (
    <div className="max-w-56">
      <button
        type="button"
        onClick={speak}
        disabled={!supported}
        className="lift-on-hover inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#e7ddff] bg-white px-4 text-sm font-extrabold text-[#5d4aa7] shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Listen to the activity instructions"
      >
        <span className={`grid h-7 w-7 place-items-center rounded-xl ${isSpeaking ? "bg-[#6C4CE0] text-white" : "bg-[#eee9ff] text-[#6C4CE0]"}`}>
          <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-pulse" : ""}`} />
        </span>
        {isSpeaking ? "Listening…" : "Listen"}
      </button>
      {(!supported || voiceBlocked) && <p className="mt-2 text-xs font-bold leading-snug text-[#9b5a44]">Voice guidance is unavailable here. The instruction is shown on screen; try a browser with spoken guidance enabled.</p>}
    </div>
  );
}
