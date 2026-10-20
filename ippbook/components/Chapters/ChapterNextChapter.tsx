"use client";

import React, { useState } from "react";
import { VintageDivider, OrnateCorner, AntiqueSeal } from "@/ippbook/components/UI/OrnamentDividers";
import { symposiumData } from "@/ippbook/data/symposiumData";
import { Calendar, MapPin, Mail, Phone, ExternalLink, CheckCircle, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/ippbook/utils/soundEffects";

export function ChapterNextTimeline() {
  const nextCh = symposiumData.nextChapter;

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER VI (PART I)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          THE CONCLAVE TIMELINE
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          Schedule of Rituals & Trials
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Schedule Timeline */}
      <div className="space-y-2.5 text-xs">
        {/* Day 1 */}
        <div className="p-2.5 rounded bg-amber-950/5 border border-amber-900/25">
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading font-bold text-xs text-amber-950 uppercase">
              Day 1 • October 30, 2026
            </span>
            <span className="text-[10px] text-amber-900/80 font-mono">08:30 AM - 08:00 PM</span>
          </div>
          <ul className="space-y-1 text-[11px] text-amber-950/80">
            <li>✦ <strong>08:30 AM:</strong> Delegate Assembly & Grimoire Badge Distribution</li>
            <li>✦ <strong>10:00 AM:</strong> Inaugural Keynote beneath Grand Chandelier</li>
            <li>✦ <strong>11:30 AM:</strong> Code in the Crypt (Round 1 Gauntlet)</li>
            <li>✦ <strong>01:30 PM:</strong> 24-Hour AI Necromancy Hackathon Commences</li>
            <li>✦ <strong>03:30 PM:</strong> Campus-wide Witch-Hunt Cryptic Hunt</li>
          </ul>
        </div>

        {/* Day 2 */}
        <div className="p-2.5 rounded bg-amber-950/5 border border-amber-900/25">
          <div className="flex items-center justify-between mb-1">
            <span className="font-heading font-bold text-xs text-amber-950 uppercase">
              Day 2 • October 31, 2026 (Halloween Night)
            </span>
            <span className="text-[10px] text-amber-900/80 font-mono">09:00 AM - 09:30 PM</span>
          </div>
          <ul className="space-y-1 text-[11px] text-amber-950/80">
            <li>✦ <strong>09:30 AM:</strong> Bug Bounty Séance CTF Showdown</li>
            <li>✦ <strong>11:00 AM:</strong> Lan-o&apos;-Lantern Esports Grand Finals</li>
            <li>✦ <strong>02:00 PM:</strong> Hackathon Project Demos to Venture Jury</li>
            <li>✦ <strong>06:00 PM:</strong> Grand Valedictory & Pumpkin Trophy Handover</li>
            <li>✦ <strong>07:30 PM:</strong> Nocturnal Banquet & DJ Celebration</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page XII
      </div>
    </div>
  );
}

export function ChapterNextRegistration() {
  const nextCh = symposiumData.nextChapter;
  const [registered, setRegistered] = useState(false);

  const handleRegisterClick = () => {
    sound.playChime();
    setRegistered(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d97706", "#ea580c", "#fbbf24", "#78350f"],
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER VI (PART II)
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wider mt-0.5">
          ANSWER THE SUMMONS
        </h2>
        <p className="text-[11px] text-amber-900/80 font-heading uppercase tracking-widest mt-0.5">
          Enlist for Cryptosis &apos;26
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Call to Action Box */}
      <div className="space-y-3 text-xs leading-relaxed">
        <div className="p-3.5 rounded-lg bg-gradient-to-b from-amber-900/10 to-amber-950/20 border-2 border-amber-800/40 text-center shadow-md">
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-amber-900 block mb-1">
            REGISTRATION DEADLINE
          </span>
          <span className="text-xs sm:text-sm font-sans font-bold text-amber-950 block">
            {nextCh.registrationDeadline}
          </span>

          <div className="my-3">
            <button
              onClick={handleRegisterClick}
              className="px-6 py-2.5 rounded-full font-heading font-bold text-xs uppercase tracking-widest text-amber-100 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-amber-900 border border-amber-600/50 shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 inline-flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              <span>{registered ? "Invitation Dispatched! ✓" : "Register Thy Delegation"}</span>
            </button>
          </div>

          <p className="text-[10px] text-amber-900/80 italic">
            Single Entry Pass: ₹250 / Delegate (Full Arena Access, Swag & Meals)
          </p>
        </div>

        {/* Council Contact & Dispatch */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-amber-950/5 border border-amber-900/20 text-[11px]">
          <div>
            <span className="font-heading font-bold text-[10px] uppercase text-amber-900 block">
              Inquiries & Dispatch
            </span>
            <span className="text-amber-950/80 block mt-0.5">{nextCh.email}</span>
            <span className="text-amber-950/80 block">{nextCh.phone}</span>
          </div>
          <div>
            <span className="font-heading font-bold text-[10px] uppercase text-amber-900 block">
              Sanctuary Coordinates
            </span>
            <span className="text-amber-950/80 block mt-0.5">{nextCh.venueAddress}</span>
          </div>
        </div>

        {/* Final Seal */}
        <div className="flex justify-center pt-1">
          <AntiqueSeal text="OFFICIAL SYMPOSIUM SEAL • 2026" className="scale-90" />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page XIII (Finis)
      </div>
    </div>
  );
}
