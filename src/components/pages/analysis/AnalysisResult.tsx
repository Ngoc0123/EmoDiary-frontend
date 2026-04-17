"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAnalysis } from "./useAnalysis";
import { Sparkles } from "lucide-react";

export function AnalysisResult() {
  const searchParams = useSearchParams();
  const drawingId = searchParams.get("id");
  const { analysis, drawingImageUrl, loading, error } = useAnalysis(drawingId);

  if (!drawingId) {
    return (
      <div className="h-screen w-screen bg-[#f7e4ab] flex flex-col overflow-hidden">
        <header className="relative h-20 shrink-0 flex items-center justify-center border-b-[3px] border-[#4f310a]">
          <Link
            href="/"
            className="absolute left-6 flex items-center justify-center w-14 h-14 hover:scale-110 transition-transform z-20"
          >
            <Image
              src="/icons/Back button.png"
              alt="Back"
              width={56}
              height={56}
            />
          </Link>
          <h1
            className="text-[40px] text-black leading-none"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Wellness Analysis
          </h1>
        </header>
        <div className="flex flex-1 min-h-0">
          <div className="w-20 shrink-0 bg-[#f7e4ab] border-r-[3px] border-[#4f310a]" />
          <main className="flex-1 bg-white flex flex-col items-center justify-center px-20">
            <p className="text-black text-lg">Invalid drawing ID</p>
          </main>
          <div className="w-20 shrink-0 bg-[#f7e4ab] border-l-[3px] border-[#4f310a]" />
        </div>
        <div className="h-20 shrink-0 bg-[#f7e4ab] border-t-[3px] border-[#4f310a]" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#f7e4ab] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="relative h-20 shrink-0 flex items-center justify-center border-b-[3px] border-[#4f310a]">
        <Link
          href="/"
          className="absolute left-6 flex items-center justify-center w-14 h-14 hover:scale-110 transition-transform z-20"
        >
          <Image
            src="/icons/Back button.png"
            alt="Back"
            width={56}
            height={56}
          />
        </Link>
        <h1
          className="text-[40px] text-black leading-none"
          style={{ fontFamily: "var(--font-pacifico)" }}
        >
          Wellness Analysis
        </h1>
      </header>

      {/* Middle row: left bar | white content | right bar */}
      <div className="flex flex-1 min-h-0">
        {/* Left beige bar */}
        <div className="w-20 shrink-0 bg-[#f7e4ab] border-r-[3px] border-[#4f310a]" />

        {/* White center content */}
        <main className="flex-1 bg-white flex flex-col px-20 py-12 overflow-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <Sparkles className="w-12 h-12 animate-spin text-black" />
              <p
                className="text-black text-lg"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Analyzing your drawing...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <p className="text-red-600 text-base">{error}</p>
            </div>
          )}

          {!loading && !error && analysis && (
            <div className="flex gap-12 h-full">
              {/* Left column - Drawing preview */}
              <div className="shrink-0">
                {drawingImageUrl ? (
                  <div className="w-80 h-80 bg-[#d9d9d9] rounded-lg overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                    <img
                      src={drawingImageUrl}
                      alt="Drawing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-80 h-80 bg-[#d9d9d9] rounded-lg flex items-center justify-center text-gray-500">
                    Drawing not available
                  </div>
                )}
              </div>

              {/* Right column - Analysis text */}
              <div className="flex-1 flex flex-col gap-8 justify-center overflow-auto">
                {/* Wellness Analysis */}
                <div>
                  <p
                    className="text-[24px] text-black leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "var(--font-pacifico)" }}
                  >
                    {analysis.wellness_analysis || "No analysis available."}
                  </p>
                </div>

                {/* Inspiring Quote */}
                <div>
                  <p
                    className="text-[24px] text-black italic leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "var(--font-pacifico)" }}
                  >
                    &quot;{analysis.inspiring_quote || "Keep creating and expressing yourself."}&quot;
                  </p>
                </div>

                {/* Actionable Advice */}
                <div>
                  <p
                    className="text-[24px] text-black leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "var(--font-pacifico)" }}
                  >
                    {analysis.actionable_advice || "Take time to care for yourself."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right beige bar */}
        <div className="w-20 shrink-0 bg-[#f7e4ab] border-l-[3px] border-[#4f310a]" />
      </div>

      {/* Bottom beige bar */}
      <div className="h-20 shrink-0 bg-[#f7e4ab] border-t-[3px] border-[#4f310a]" />
    </div>
  );
}
