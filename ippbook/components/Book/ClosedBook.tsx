"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { sound } from "@/ippbook/utils/soundEffects";

interface ClosedBookProps {
  onOpenBook: () => void;
}

export function ClosedBook({ onOpenBook }: ClosedBookProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    sound.playBookOpen();
    onOpenBook();
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      {/* Ambient mystical table glow beneath book */}
      <div
        className={`absolute -bottom-8 w-80 md:w-96 h-28 bg-gradient-to-t from-amber-600/25 via-orange-500/15 to-transparent blur-2xl rounded-full transition-opacity duration-700 pointer-events-none ${
          isHovered ? "opacity-100 scale-110" : "opacity-60 scale-100"
        }`}
      />

      {/* Main interactive 3D Closed Book */}
      <div
        onClick={handleOpen}
        onMouseEnter={() => {
          setIsHovered(true);
          sound.playChime();
        }}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleOpen();
          }
        }}
        aria-label="Open The Chronicles Grimoire"
        className="relative cursor-pointer transition-all duration-500 ease-out transform group-hover:-translate-y-3 group-hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500/60 rounded-lg"
      >
        {/* Antique Book Spine & Thickness Base (stacked pages effect) */}
        <div className="relative w-72 sm:w-80 md:w-96 h-48 sm:h-52 md:h-60 rounded-lg p-2 leather-cover shadow-book-heavy border border-amber-900/60 overflow-hidden">
          {/* Subtle leather texture grain */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-black/60 pointer-events-none" />

          {/* Golden embossed decorative borders */}
          <div className="relative w-full h-full rounded border-2 border-amber-500/40 p-3 flex flex-col justify-between items-center bg-gradient-to-br from-amber-950/20 via-transparent to-black/40">
            {/* Brass Filigree Corners */}
            <div className="absolute top-1 left-1 w-6 h-6 brass-corner-tl" />
            <div className="absolute top-1 right-1 w-6 h-6 brass-corner-tr" />
            <div className="absolute bottom-1 left-1 w-6 h-6 brass-corner-bl" />
            <div className="absolute bottom-1 right-1 w-6 h-6 brass-corner-br" />

            {/* Top Ornamental Header */}
            <div className="text-center pt-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-amber-400/75 font-heading font-semibold">
                — DEPARTMENT CHRONICLE —
              </span>
            </div>

            {/* Centerpiece Crest & Title */}
            <div className="flex flex-col items-center justify-center my-auto text-center px-4">
              {/* Embossed Arcane Seal */}
              <div className="relative mb-2 w-14 h-14 rounded-full border border-amber-400/40 flex items-center justify-center bg-gradient-to-b from-amber-500/10 to-amber-950/40 shadow-inner">
                <svg
                  className={`w-8 h-8 text-amber-400/90 transition-transform duration-700 ${
                    isHovered ? "rotate-90 scale-110" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
                  <polygon points="12 3 20 18 4 18" />
                  <polygon points="12 21 4 6 20 6" opacity="0.6" />
                  <circle cx="12" cy="12" r="2.5" fill="#f59e0b" />
                </svg>
              </div>

              {/* Title Text */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-decorative font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                THE CHRONICLES
              </h2>

              <p className="text-[11px] sm:text-xs text-amber-200/80 font-heading tracking-wider mt-1 font-medium">
                Cryptosis &apos;26 • Department of CSE
              </p>
            </div>

            {/* Bottom Instruction */}
            <div className="pb-2 text-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-amber-300/80 font-sans tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                Click to uncover our story
              </span>
            </div>
          </div>

          {/* Book edge gilded pages simulation along bottom right */}
          <div className="absolute right-0 top-3 bottom-3 w-3 bg-gradient-to-r from-amber-900 via-amber-100/70 to-amber-800 rounded-r shadow-inner opacity-80" />
        </div>

        {/* Floating Aura glow on hover */}
        <div
          className={`absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-600/30 filter blur-md transition-opacity duration-500 -z-10 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Elegant CTA Interaction Button below book */}
      <div className="mt-5 flex flex-col items-center">
        <button
          onClick={handleOpen}
          className="relative group/btn px-6 py-2.5 rounded-full overflow-hidden border border-amber-500/60 bg-gradient-to-r from-stone-950 via-amber-950/70 to-stone-950 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all duration-300 hover:border-amber-400 active:scale-95"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />

          <div className="relative flex items-center gap-2.5 text-xs sm:text-sm font-heading font-semibold tracking-widest uppercase">
            <BookOpen className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover/btn:scale-110" />
            <span>Open The Chronicle</span>
          </div>
        </button>

        <span className="text-[10px] text-amber-300/60 font-sans mt-1.5 tracking-wider uppercase">
          An Interactive Department Experience
        </span>
      </div>
    </div>
  );
}
