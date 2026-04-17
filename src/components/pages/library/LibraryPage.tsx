"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useLibrary } from "./useLibrary";

const MOOD_EMOJI_MAP: Record<string, string> = {
  happy: "/icons/happy-emoji.png",
  pleased: "/icons/good-emoji.png",
  normal: "/icons/neutral-emoji.png",
  sad: "/icons/sad-emoji.png",
  downmood: "/icons/cry-emoji.png",
  angry: "/icons/angry-emoji.png",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function LibraryPage() {
  const {
    drawings,
    page,
    totalPages,
    isLoading,
    error,
    goToPage,
    showFavoriteOnly,
    toggleFavoriteOnly,
    t,
  } = useLibrary();

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="h-screen w-screen bg-[#f7e4ab] flex flex-col overflow-hidden">
      {/* Top beige bar with title + back button */}
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
          {t.title}
        </h1>
      </header>

      {/* Middle row: left bar | white content | right bar */}
      <div className="flex flex-1 min-h-0">
        {/* Left beige bar */}
        <div className="w-20 shrink-0 bg-[#f7e4ab] border-r-[3px] border-[#4f310a]" />

        {/* White center content */}
        <main className="flex-1 bg-white flex flex-col px-20 pt-7 pb-4 overflow-auto">
          {/* Loading */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <p
                className="text-black text-lg"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                {t.loading}
              </p>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <p className="text-red-600 text-base">{error}</p>
              <button
                onClick={() => goToPage(page)}
                className="px-5 py-2 rounded-4xl bg-[#dbb27d] border-2 border-[#4f310a] text-black text-sm hover:brightness-110 transition-all"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                {t.next === "Next" ? "Retry" : "Thử lại"}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && drawings.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                <ImageIcon className="h-10 w-10 text-slate-300" />
              </div>
              <p
                className="text-[#4f310a] text-lg"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                {t.empty}
              </p>
            </div>
          )}

          {/* 3x3 Grid + Bottom bar */}
          {!isLoading && !error && drawings.length > 0 && (
            <>
              <div className="grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-1 flex-1 min-h-0">
                {drawings.map((drawing) => (
                  <div
                    key={drawing.drawing_id}
                    className="flex flex-col items-center min-h-0 pt-6"
                  >
                    {/* Card — A4 landscape ratio, height-constrained to fit grid */}
                    <Link
                      href={`/thu-vien/${drawing.drawing_id}`}
                      className="group relative aspect-3508/2480 max-w-full max-h-full overflow-visible"
                      style={{ flex: "1 1 0", minHeight: 0 }}
                    >
                      <div className="w-full h-full bg-[#d9d9d9] overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                        {drawing.image_url ? (
                          <img
                            src={drawing.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-[#bbb]" />
                          </div>
                        )}
                      </div>

                      {/* Mood emoji */}
                      {drawing.daily_mood &&
                        MOOD_EMOJI_MAP[drawing.daily_mood] && (
                          <div className="absolute -top-5.5 left-1/2 -translate-x-1/2 w-10.75 h-10.75 z-10">
                            <Image
                              src={MOOD_EMOJI_MAP[drawing.daily_mood]}
                              alt={drawing.daily_mood}
                              width={43}
                              height={43}
                            />
                          </div>
                        )}

                      {/* Favorite heart */}
                      {drawing.favorited && (
                        <div className="absolute -top-1.5 -right-3.5 w-6.75 h-6.75 z-10">
                          <Image
                            src="/icons/empty-heart.png"
                            alt="Favorited"
                            width={27}
                            height={27}
                          />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {/* Date */}
                    <p
                      className="shrink-0 mt-1 text-[14px] text-black leading-tight"
                      style={{ fontFamily: "var(--font-pacifico)" }}
                    >
                      {formatDate(drawing.created_at)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="mt-auto relative flex items-center justify-center pt-2 shrink-0">
                <button
                  onClick={toggleFavoriteOnly}
                  className={`absolute left-0 flex items-center gap-2 transition-opacity ${showFavoriteOnly ? "opacity-100" : "hover:opacity-80"}`}
                >
                  <Image
                    src="/icons/heart.png"
                    alt=""
                    width={40}
                    height={40}
                  />
                  <span
                    className={`text-[16px] text-black ${showFavoriteOnly ? "underline" : ""}`}
                    style={{ fontFamily: "var(--font-pacifico)" }}
                  >
                    {t.showFavoriteOnly}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="w-7.5 h-7.5 flex items-center justify-center disabled:opacity-30 hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/icons/arrow-left.png"
                      alt="Previous"
                      width={30}
                      height={30}
                    />
                  </button>

                  {pageNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => goToPage(num)}
                      className={`min-w-6 text-center transition-all ${
                        num === page
                          ? "text-[30px] underline text-black"
                          : "text-[20px] text-black hover:underline"
                      }`}
                      style={{ fontFamily: "var(--font-pacifico)" }}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="w-7.5 h-7.5 flex items-center justify-center disabled:opacity-30 hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/icons/arrow-right.png"
                      alt="Next"
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </div>
            </>
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
