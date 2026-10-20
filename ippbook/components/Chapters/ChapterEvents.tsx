"use client";

import React, { useState } from "react";
import { VintageDivider, OrnateCorner } from "@/ippbook/components/UI/OrnamentDividers";
import { symposiumData, SymposiumEvent } from "@/ippbook/data/symposiumData";
import { Terminal, Users, Clock, MapPin, Award, ChevronDown, ChevronUp } from "lucide-react";

export function ChapterEventsTechnical() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const techEvents = symposiumData.events.filter((e) => e.category === "Technical");

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER III (PART I)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          THE TECHNICAL TRIALS
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          Code, Cryptanalysis & Machine Lore
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Technical Events List */}
      <div className="space-y-2.5 text-xs">
        {techEvents.map((ev) => {
          const isOpen = selectedEvent === ev.id;
          return (
            <div
              key={ev.id}
              className="p-2.5 rounded bg-amber-950/5 border border-amber-900/25 transition-all shadow-xs"
            >
              <div
                onClick={() => setSelectedEvent(isOpen ? null : ev.id)}
                className="cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-900/20 text-amber-900 font-bold uppercase">
                      Bounty: {ev.prizePool}
                    </span>
                    <span className="text-[10px] text-amber-800/80 font-sans">
                      {ev.teamSize}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-amber-950 mt-1">
                    {ev.title}
                  </h3>
                </div>
                <div className="text-amber-900/70">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              <p className="text-[11px] text-amber-950/80 mt-1 leading-snug">
                {ev.tagline}
              </p>

              {/* Expanded event rules & coordinator details */}
              {isOpen && (
                <div className="mt-2.5 pt-2 border-t border-amber-900/20 text-[11px] space-y-2 animate-fadeIn">
                  <p className="text-amber-900/90 leading-relaxed">{ev.description}</p>

                  <div className="bg-amber-900/5 p-2 rounded">
                    <span className="font-heading font-bold text-[10px] uppercase text-amber-900 block mb-1">
                      Trial Decrees:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-950/80">
                      {ev.rules.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-amber-900/70 pt-1">
                    <span>Arena: {ev.venue}</span>
                    <span>Timing: {ev.time}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page VI
      </div>
    </div>
  );
}

export function ChapterEventsNonTechnical() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const otherEvents = symposiumData.events.filter(
    (e) => e.category === "Non-Technical" || e.category === "Gaming"
  );

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER III (PART II)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          SPECTACLES & ESPORTS
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          Physical Escapes, Cryptic Hunts & Lan Warfare
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Non-Technical & Gaming Events List */}
      <div className="space-y-2.5 text-xs">
        {otherEvents.map((ev) => {
          const isOpen = selectedEvent === ev.id;
          return (
            <div
              key={ev.id}
              className="p-2.5 rounded bg-amber-950/5 border border-amber-900/25 transition-all shadow-xs"
            >
              <div
                onClick={() => setSelectedEvent(isOpen ? null : ev.id)}
                className="cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-900/20 text-amber-900 font-bold uppercase">
                      Bounty: {ev.prizePool}
                    </span>
                    <span className="text-[10px] text-amber-800/80 font-sans">
                      {ev.category} • {ev.teamSize}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-amber-950 mt-1">
                    {ev.title}
                  </h3>
                </div>
                <div className="text-amber-900/70">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              <p className="text-[11px] text-amber-950/80 mt-1 leading-snug">
                {ev.tagline}
              </p>

              {isOpen && (
                <div className="mt-2.5 pt-2 border-t border-amber-900/20 text-[11px] space-y-2 animate-fadeIn">
                  <p className="text-amber-900/90 leading-relaxed">{ev.description}</p>

                  <div className="bg-amber-900/5 p-2 rounded">
                    <span className="font-heading font-bold text-[10px] uppercase text-amber-900 block mb-1">
                      Event Rules:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-950/80">
                      {ev.rules.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-amber-900/70 pt-1">
                    <span>Arena: {ev.venue}</span>
                    <span>Timing: {ev.time}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page VII
      </div>
    </div>
  );
}
