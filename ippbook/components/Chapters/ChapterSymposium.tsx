import React from "react";
import { VintageDivider, OrnateCorner, DropCap } from "@/ippbook/components/UI/OrnamentDividers";
import { symposiumData } from "@/ippbook/data/symposiumData";
import { Flame, Trophy, Calendar, MapPin, Sparkles } from "lucide-react";

export function ChapterSymposiumPart1() {
  const sym = symposiumData.symposium;

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER II
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          {sym.title}
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          {sym.edition}
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Theme & Identity */}
      <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed">
        <div className="text-center py-1">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-900/10 border border-amber-900/30 text-amber-950 font-heading font-bold text-xs tracking-wider">
            ⚔ {sym.themeTitle} ⚔
          </span>
        </div>

        <p>
          <DropCap char="W" />
          {sym.themeDescription}
        </p>

        {/* Date & Location Plaque */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded bg-amber-950/5 border border-amber-900/25">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-heading font-bold uppercase text-amber-900 block">
                Conclave Dates
              </span>
              <span className="text-[11px] font-sans font-semibold text-amber-950">
                {sym.dates}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-heading font-bold uppercase text-amber-900 block">
                Grand Arena
              </span>
              <span className="text-[11px] font-sans font-semibold text-amber-950">
                {sym.venue}
              </span>
            </div>
          </div>
        </div>

        {/* Total Bounty Highlight */}
        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-amber-900/10 via-amber-800/15 to-amber-900/10 border border-amber-800/30 shadow-xs">
          <span className="text-[10px] uppercase font-heading font-bold text-amber-900 tracking-widest block">
            CUMULATIVE BOUNTY & REWARDS
          </span>
          <span className="text-2xl font-heading font-black text-amber-950 tracking-tight block">
            {sym.totalPrizePool}
          </span>
          <span className="text-[10px] text-amber-900/70 italic">
            + Cast Bronze Pumpkin Trophy & Direct Incubation Tracks
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page IV
      </div>
    </div>
  );
}

export function ChapterSymposiumPart2() {
  const sym = symposiumData.symposium;

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          SYMPOSIUM ETHOS
        </span>
        <h3 className="text-lg sm:text-xl font-decorative font-bold text-amber-950 mt-0.5">
          THE THREE COVENANTS
        </h3>
        <VintageDivider className="my-2" />
      </div>

      {/* The 3 Pillars of Symposium */}
      <div className="space-y-3 text-xs">
        {sym.pillars.map((pil, idx) => (
          <div
            key={idx}
            className="p-3 rounded bg-amber-950/5 border border-amber-900/20 shadow-xs flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-amber-900/15 border border-amber-900/40 flex items-center justify-center shrink-0 text-amber-900 font-heading font-bold text-xs">
              {idx + 1}
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs text-amber-950 mb-0.5">
                {pil.title}
              </h4>
              <p className="text-[11px] text-amber-950/80 leading-relaxed">
                {pil.desc}
              </p>
            </div>
          </div>
        ))}

        {/* The Pumpkin Trophy Lore */}
        <div className="p-3 rounded bg-amber-900/10 border border-amber-900/30 flex items-center gap-3">
          <div className="p-2 rounded bg-amber-900/20 text-amber-900 shrink-0">
            <Trophy className="w-5 h-5 text-amber-900" />
          </div>
          <div>
            <h5 className="font-heading font-bold text-xs text-amber-950">
              The Legend of the Bronze Pumpkin
            </h5>
            <p className="text-[10px] text-amber-950/80 italic mt-0.5">
              Awarded solely to the institution that secures the highest collective points across all technical and cryptic arenas. Held in reverence for 18 consecutive years.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page V
      </div>
    </div>
  );
}
