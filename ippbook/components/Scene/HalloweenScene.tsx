"use client";

import React, { useState } from "react";
import { GothicWallpaper } from "./GothicWallpaper";
import { GothicWindow } from "./GothicWindow";
import { MahoganyTable } from "./MahoganyTable";
import { CarvedPumpkin } from "./CarvedPumpkin";
import { BrassLantern } from "./BrassLantern";
import { WaxCandle } from "./WaxCandle";
import { BookStack } from "./BookStack";
import { Candelabra } from "./Candelabra";
import { Realistic3DBook } from "@/ippbook/components/Book/Realistic3DBook";
import { Volume2, VolumeX, Maximize2, Minimize2, Sparkles, Compass } from "lucide-react";
import { sound } from "@/ippbook/utils/soundEffects";

export function HalloweenScene() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedInitialPage, setSelectedInitialPage] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const newState = sound.toggleAmbient();
    setIsAudioActive(newState);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleOpenBook = (page: number = 0) => {
    setSelectedInitialPage(page);
    setIsBookOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#05070b] overflow-hidden flex flex-col justify-between select-none">
      {/* 1. Realistic Gothic Wallpaper with Damask Pattern & Ambient Lighting */}
      <GothicWallpaper />

      {/* 2. Gothic Arched Wrought-Iron Window with Moonlit Sky & Bats (Left) */}
      <GothicWindow />

      {/* 3. Realistic 3D Mahogany Table spanning lower portion */}
      <MahoganyTable />

      {/* 4. Realistic 2D/3D Objects Arranged on the Table matching Reference Composition */}
      <div className="absolute inset-x-0 bottom-0 h-[42vh] min-h-[300px] pointer-events-none z-15 flex items-end justify-between px-3 sm:px-8 pb-4">
        {/* Left Table Cluster */}
        <div className="flex items-end gap-2 sm:gap-4 ml-2 sm:ml-8 transform translate-y-[-10px] sm:translate-y-[-15px]">
          {/* Small Pumpkin near window */}
          <CarvedPumpkin size="sm" faceStyle="classic" className="hidden lg:flex" />

          {/* Left Hurricane Brass Lantern */}
          <BrassLantern size="md" />

          {/* Left Tall Melted Ivory Candle */}
          <WaxCandle height="tall" className="transform translate-y-[-5px]" />

          {/* Center-Left Antique Book Stack with Medium Carved Pumpkin on top */}
          <BookStack className="hidden sm:flex">
            <CarvedPumpkin size="md" faceStyle="grin" glowIntensity="bright" />
          </BookStack>
        </div>

        {/* Center Accent: Melted candle between book & pumpkin */}
        <div className="hidden xl:flex items-end mb-6">
          <WaxCandle height="medium" />
        </div>

        {/* Right Table Cluster */}
        <div className="flex items-end gap-2 sm:gap-4 mr-2 sm:mr-8 transform translate-y-[-10px] sm:translate-y-[-15px]">
          {/* Center-Right Large Wide Carved Pumpkin */}
          <CarvedPumpkin size="lg" faceStyle="wicked" glowIntensity="bright" className="hidden md:flex" />

          {/* Right Melted Ivory Candle */}
          <WaxCandle height="medium" className="transform translate-y-[-5px]" />

          {/* Right Hurricane Brass Lantern */}
          <BrassLantern size="md" />

          {/* Far Right Tall Antique Candelabra with 2 Taper Candles */}
          <Candelabra className="hidden lg:flex" />
        </div>
      </div>

      {/* 5. Top Header Navigation & Controls */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        {/* Emblem & Festival Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/50 bg-black/70 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-heading font-bold text-amber-200 tracking-wider flex items-center gap-2">
              CRYPTOSIS &apos;26
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-sans border border-amber-500/30">
                OCT 30-31
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-amber-300/60 font-sans tracking-wide">
              Dept. of Computer Science & Engineering
            </p>
          </div>
        </div>

        {/* Audio & Fullscreen Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={toggleSound}
            aria-label={isAudioActive ? "Mute ambient atmosphere" : "Play ambient atmosphere"}
            className={`px-3 py-2 rounded-full border text-xs font-sans tracking-wide flex items-center gap-2 backdrop-blur-md transition-all duration-300 ${
              isAudioActive
                ? "border-amber-400/80 bg-amber-950/70 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "border-stone-700/60 bg-black/60 text-stone-300 hover:text-amber-200 hover:border-amber-600/50"
            }`}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Atmosphere On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="hidden sm:inline">Play Atmosphere</span>
              </>
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-2.5 rounded-full border border-stone-700/60 bg-black/60 hover:bg-black/80 text-stone-300 hover:text-amber-200 hover:border-amber-600/50 backdrop-blur-md transition-all duration-300"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 6. Main Center Stage: Title Watermark & Centerpiece 3D Book */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-end pb-8 sm:pb-12 px-4 pointer-events-auto">
        <div className="text-center mb-3 sm:mb-5 max-w-xl mx-auto pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-amber-900/50 backdrop-blur-sm text-amber-300/80 text-[11px] font-heading tracking-widest uppercase mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            The Department Symposium Chronicles
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-decorative font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            ABOUT OUR CITADEL
          </h2>
        </div>

        {/* Centerpiece Realistic 3D Book */}
        <div className="w-full max-w-lg flex justify-center pointer-events-auto">
          <Realistic3DBook
            isOpen={isBookOpen}
            onOpen={() => handleOpenBook(0)}
            onClose={() => setIsBookOpen(false)}
            initialPage={selectedInitialPage}
          />
        </div>
      </main>

      {/* 7. Bottom Chapter Navigation Footer */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-300/70 border-t border-amber-900/30">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Haunted Royal Library • Chapter Navigation</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {[
            { label: "Contents", idx: 0 },
            { label: "I. Department", idx: 1 },
            { label: "II. Symposium", idx: 3 },
            { label: "III. Events", idx: 5 },
            { label: "IV. Archives", idx: 7 },
            { label: "V. Laurels", idx: 9 },
            { label: "VI. Next Chapter", idx: 11 },
          ].map((ch) => (
            <button
              key={ch.idx}
              data-scene-chapter={ch.label}
              onClick={() => handleOpenBook(ch.idx)}
              className="px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-heading tracking-wider bg-black/60 hover:bg-amber-950/70 border border-amber-900/50 hover:border-amber-500/70 text-amber-200/90 transition-all duration-200"
            >
              {ch.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
