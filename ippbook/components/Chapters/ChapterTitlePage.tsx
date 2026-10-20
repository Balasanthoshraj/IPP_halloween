import React from "react";
import { VintageDivider, OrnateCorner, AntiqueSeal } from "@/ippbook/components/UI/OrnamentDividers";
import { symposiumData } from "@/ippbook/data/symposiumData";
import { BookOpen, Sparkles } from "lucide-react";

interface ChapterTitlePageProps {
  onJumpToPage: (pageIndex: number) => void;
}

export function ChapterTitlePage({ onJumpToPage }: ChapterTitlePageProps) {
  const chapters = [
    { title: "Chapter I: The Department", page: 1, desc: "Foundations & Academic Pillars" },
    { title: "Chapter II: The Symposium", page: 3, desc: "Theme, Legend & Total Bounty" },
    { title: "Chapter III: The Trials (Events)", page: 5, desc: "Technical & Non-Tech Quests" },
    { title: "Chapter IV: Grimoires of Past", page: 7, desc: "2024–2025 Legacy & Gallery" },
    { title: "Chapter V: Hall of Laurels", page: 9, desc: "Patents, SIH & Achievements" },
    { title: "Chapter VI: Answer the Summons", page: 11, desc: "Timeline, Registration & Seal" },
  ];

  return (
    <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between text-parchment-ink select-none font-book">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />
      <OrnateCorner position="bottom-left" />
      <OrnateCorner position="bottom-right" />

      {/* Header */}
      <div className="text-center pt-2">
        <span className="text-[10px] tracking-[0.3em] uppercase text-amber-900/70 font-heading font-bold">
          {symposiumData.department.institution}
        </span>
        <h1 className="text-2xl sm:text-3xl font-decorative font-extrabold text-amber-950 mt-1 tracking-wider">
          THE CHRONICLES
        </h1>
        <p className="text-xs italic text-amber-900/80 font-serif mt-0.5">
          &ldquo;Ex Umbra in Lucem per Algorithmos&rdquo;
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Seal & Centerpiece */}
      <div className="my-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-2 border-amber-900/60 p-1 flex items-center justify-center bg-amber-900/5 shadow-inner mb-3">
          <Sparkles className="w-8 h-8 text-amber-800" />
        </div>
        <AntiqueSeal text={`FOUNDED ${symposiumData.department.establishedYear}`} className="mb-4" />

        {/* Table of Contents */}
        <div className="w-full max-w-sm bg-amber-950/5 border border-amber-900/20 rounded-md p-3.5 shadow-sm">
          <h2 className="text-center font-heading text-xs tracking-widest uppercase font-bold text-amber-900 border-b border-amber-900/20 pb-1.5 mb-2 flex items-center justify-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Table of Contents
          </h2>
          <div className="space-y-1.5 text-xs">
            {chapters.map((ch) => (
              <button
                key={ch.page}
                onClick={() => onJumpToPage(ch.page)}
                className="w-full flex items-center justify-between text-left group hover:bg-amber-900/10 px-2 py-1 rounded transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-[11px] text-amber-950 group-hover:text-amber-800">
                    {ch.title}
                  </span>
                  <span className="text-[9px] text-amber-900/60">{ch.desc}</span>
                </div>
                <span className="font-mono text-[10px] text-amber-800/80 font-bold ml-2">
                  p. {ch.page + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-sans border-t border-amber-900/20 pt-2">
        <span>Click page corners or navigation arrows to turn pages</span>
      </div>
    </div>
  );
}
