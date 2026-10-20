import React from "react";
import { VintageDivider, OrnateCorner } from "@/ippbook/components/UI/OrnamentDividers";
import { symposiumData } from "@/ippbook/data/symposiumData";
import { Award, ShieldCheck, FileText, Cpu, Star, Quote } from "lucide-react";

export function ChapterAchievementsPart1() {
  const achievements = symposiumData.achievements;

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER V (PART I)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          HALL OF LAURELS
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          National Trophies, Patents & Breakthroughs
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Achievements Cards */}
      <div className="space-y-2.5 text-xs">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-2.5 rounded bg-amber-950/5 border border-amber-900/25 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[9px] font-heading font-bold px-2 py-0.5 rounded-full bg-amber-900/15 text-amber-900 border border-amber-900/30">
                {ach.badge}
              </span>
              <span className="font-mono text-[10px] text-amber-800/80 font-bold">
                {ach.year}
              </span>
            </div>
            <h4 className="font-heading font-bold text-xs text-amber-950 leading-snug">
              {ach.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-amber-950/80 mt-1 leading-relaxed">
              {ach.description}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page X
      </div>
    </div>
  );
}

export function ChapterAchievementsPart2() {
  const testimonials = [
    {
      name: "Rohan Varma",
      college: "IIT Madras (Cryptosis '25 Overall Winner)",
      quote:
        "The level of algorithmic depth and real-world infrastructure at Cryptosis is unmatched. It feels like entering a competitive crucible engineered by master architects.",
    },
    {
      name: "Ananya Deshmukh",
      college: "BITS Pilani (Hackathon Finalist)",
      quote:
        "From the spooky candlelit ambiance to the intense 24-hour mentoring, this symposium is etched in my university memories forever.",
    },
  ];

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER V (PART II)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          ECHOES & VOICES
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          Delegate Testimonials & Alumni Legacy
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Testimonials */}
      <div className="space-y-3 text-xs leading-relaxed">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="p-3 rounded bg-amber-950/5 border-l-4 border-amber-800 shadow-xs"
          >
            <div className="flex items-center gap-1.5 text-amber-900 mb-1">
              <Quote className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-heading font-bold text-xs text-amber-950">
                {t.name}
              </span>
            </div>
            <p className="italic text-[11px] text-amber-950/85 leading-snug">
              &ldquo;{t.quote}&rdquo;
            </p>
            <span className="text-[9px] text-amber-800/80 font-sans block mt-1.5">
              — {t.college}
            </span>
          </div>
        ))}

        {/* Global Alumni Network Stamp */}
        <div className="p-2.5 rounded bg-amber-900/10 border border-amber-900/20 text-center">
          <span className="font-heading font-bold text-xs text-amber-900 block mb-1">
            Alumni in Global Technology Citadels
          </span>
          <p className="text-[10px] text-amber-950/80 font-sans">
            Google • Microsoft • Apple • Amazon AWS • CrowdStrike • NVIDIA
          </p>
          <span className="text-[9px] text-amber-800/70 italic mt-1 block">
            Leading engineering groups across Seattle, Silicon Valley, Bengaluru & London
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page XI
      </div>
    </div>
  );
}
