"use client";

import { useLanguage } from "@/components/providers/language-provider";

export const MOOD_OPTIONS = [
  { key: "sad",       emoji: "\uD83D\uDE22" },
  { key: "downmood",  emoji: "\uD83D\uDE14" },
  { key: "normal",    emoji: "\uD83D\uDE10" },
  { key: "happy",     emoji: "\uD83D\uDE04" },
  { key: "pleased",   emoji: "\uD83D\uDE0A" },
  { key: "angry",     emoji: "\uD83D\uDE21" },
] as const;

export type MoodKey = (typeof MOOD_OPTIONS)[number]["key"];

interface MoodSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mood: MoodKey) => void;
}

export function MoodSelectModal({ isOpen, onClose, onSelect }: MoodSelectModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl shadow-orange-500/10 border border-white/60 p-6 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-1 text-xl font-bold text-slate-800">
            {t.mood.title}
          </h3>
          <p className="mb-6 text-sm text-slate-500">
            {t.mood.subtitle}
          </p>

          <div className="grid grid-cols-3 gap-3 w-full mb-5">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.key}
                onClick={() => onSelect(mood.key)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white/60 px-3 py-4 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-orange-300 hover:bg-orange-50/50 active:scale-95"
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-xs font-semibold text-slate-600">
                  {t.mood[mood.key]}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            {t.common.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
