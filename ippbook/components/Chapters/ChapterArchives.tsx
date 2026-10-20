import React from "react";
import { VintageDivider, OrnateCorner } from "@/ippbook/components/UI/OrnamentDividers";
import { symposiumData } from "@/ippbook/data/symposiumData";
import { History, Trophy, Users, Award, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export function ChapterArchives2025() {
  const archive2025 = symposiumData.archives[0];

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER IV (PART I)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          THE 2025 CHRONICLE
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          {archive2025.editionName}
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* 2025 Stats and Summary */}
      <div className="space-y-3 text-xs leading-relaxed">
        {/* Quick metrics banner */}
        <div className="grid grid-cols-3 gap-2 p-2 rounded bg-amber-900/10 border border-amber-900/20 text-center">
          <div>
            <span className="text-xs sm:text-sm font-heading font-bold text-amber-950 block">
              {archive2025.delegates}
            </span>
            <span className="text-[9px] text-amber-800/80 uppercase">Turnout</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-heading font-bold text-amber-950 block">
              {archive2025.colleges}
            </span>
            <span className="text-[9px] text-amber-800/80 uppercase">Universities</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-heading font-bold text-amber-950 block">
              {archive2025.cashPrize}
            </span>
            <span className="text-[9px] text-amber-800/80 uppercase">Disbursed</span>
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-amber-950/90 italic">
          &ldquo;{archive2025.summary}&rdquo;
        </p>

        {/* Overall Champion Seal */}
        <div className="p-2.5 rounded bg-amber-950/5 border-l-4 border-amber-800 flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-amber-800 shrink-0" />
          <div>
            <span className="text-[9px] font-heading uppercase font-bold text-amber-900 block">
              Overall Symposium Champion 2025
            </span>
            <span className="font-heading font-bold text-xs text-amber-950">
              {archive2025.overallChampion}
            </span>
          </div>
        </div>

        {/* Highlights List */}
        <div className="bg-amber-900/5 p-2.5 rounded border border-amber-900/15">
          <span className="font-heading font-bold text-[10px] uppercase text-amber-900 block mb-1">
            Historic Milestones:
          </span>
          <ul className="list-disc list-inside space-y-1 text-[10px] sm:text-[11px] text-amber-950/80">
            {archive2025.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page VIII
      </div>
    </div>
  );
}

export function ChapterArchives2024() {
  const archive2024 = symposiumData.archives[1];

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER IV (PART II)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          THE 2024 CHRONICLE
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          {archive2024.editionName}
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* 2024 Content & Photographs */}
      <div className="space-y-3 text-xs leading-relaxed">
        {/* Quick metrics banner */}
        <div className="grid grid-cols-3 gap-2 p-2 rounded bg-amber-900/10 border border-amber-900/20 text-center">
          <div>
            <span className="text-xs sm:text-sm font-heading font-bold text-amber-950 block">
              {archive2024.delegates}
            </span>
            <span className="text-[9px] text-amber-800/80 uppercase">Turnout</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-heading font-bold text-amber-950 block">
              {archive2024.colleges}
            </span>
            <span className="text-[9px] text-amber-800/80 uppercase">Universities</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-heading font-bold text-amber-950 block">
              {archive2024.cashPrize}
            </span>
            <span className="text-[9px] text-amber-800/80 uppercase">Disbursed</span>
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-amber-950/90 italic">
          &ldquo;{archive2024.summary}&rdquo;
        </p>

        {/* 2024 Champion */}
        <div className="p-2.5 rounded bg-amber-950/5 border-l-4 border-amber-800 flex items-center gap-2.5">
          <Trophy className="w-5 h-5 text-amber-800 shrink-0" />
          <div>
            <span className="text-[9px] font-heading uppercase font-bold text-amber-900 block">
              Overall Symposium Champion 2024
            </span>
            <span className="font-heading font-bold text-xs text-amber-950">
              {archive2024.overallChampion}
            </span>
          </div>
        </div>

        {/* Highlights List */}
        <div className="bg-amber-900/5 p-2.5 rounded border border-amber-900/15">
          <span className="font-heading font-bold text-[10px] uppercase text-amber-900 block mb-1">
            Key Accomplishments:
          </span>
          <ul className="list-disc list-inside space-y-1 text-[10px] sm:text-[11px] text-amber-950/80">
            {archive2024.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page IX
      </div>
    </div>
  );
}
