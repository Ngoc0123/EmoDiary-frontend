"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/language-provider";

export const MOOD_OPTIONS = [
  { key: "sad",       icon: "/icons/sad.png" },
  { key: "downmood",  icon: "/icons/cry.png" },
  { key: "normal",    icon: "/icons/neutral.png" },
  { key: "happy",     icon: "/icons/happy.png" },
  { key: "pleased",   icon: "/icons/good.png" },
  { key: "angry",     icon: "/icons/angry.png" },
] as const;

export type MoodKey = (typeof MOOD_OPTIONS)[number]["key"];

interface MoodSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mood: MoodKey) => void;
}

// Positions for each emoji around the envelope (top, left in %)
const EMOJI_POSITIONS = [
  { top: "2%",  left: "18%" },  // sad - upper left
  { top: "28%", left: "2%" },   // downmood (cry) - left middle
  { top: "58%", left: "10%" },  // normal - lower left
  { top: "2%",  left: "68%" },  // happy - upper right
  { top: "28%", left: "78%" },  // pleased (good) - right middle
  { top: "58%", left: "72%" },  // angry - lower right
];

export function MoodSelectModal({ isOpen, onClose, onSelect }: MoodSelectModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative flex flex-col items-center">
        {/* Envelope + scattered emojis container */}
        <div className="relative h-[420px] w-[500px]">
          {/* Central envelope */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/icons/envelope.png"
              alt="envelope"
              width={280}
              height={270}
              className="rotate-[7deg]"
              priority
            />
          </div>

          {/* Scattered mood emoji buttons */}
          {MOOD_OPTIONS.map((mood, i) => (
            <button
              key={mood.key}
              onClick={() => onSelect(mood.key)}
              className="absolute h-[100px] w-[100px] transition-transform duration-200 hover:scale-125 active:scale-95"
              style={{
                top: EMOJI_POSITIONS[i].top,
                left: EMOJI_POSITIONS[i].left,
              }}
              title={t.mood[mood.key]}
            >
              <Image
                src={mood.icon}
                alt={t.mood[mood.key]}
                width={100}
                height={100}
              />
            </button>
          ))}
        </div>

        {/* Title text */}
        <p
          className="text-[#4f310b] text-[50px] leading-normal"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          {t.mood.title}
        </p>
      </div>
    </div>
  );
}
