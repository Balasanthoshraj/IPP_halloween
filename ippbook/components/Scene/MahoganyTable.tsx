import React from "react";

export function MahoganyTable() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[42vh] min-h-[300px] pointer-events-none select-none z-10 overflow-hidden">
      {/* 1. Main 3D Tilted Table Surface */}
      <div
        className="relative w-full h-[78%] bg-gradient-to-b from-[#180a05] via-[#240e07] to-[#120703] border-t border-amber-900/40 shadow-[inset_0_20px_50px_rgba(0,0,0,0.9)]"
        style={{
          transform: "perspective(1000px) rotateX(12deg)",
          transformOrigin: "bottom center",
        }}
      >
        {/* Wood Plank Grooves (Vertical/Horizontal antique plank seams) */}
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_220px,rgba(0,0,0,0.8)_221px,transparent_222px)]" />

        {/* Fine Wood Grain Lines */}
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,200,120,0.05)_4px)]" />

        {/* Polished Lacquer Specular Candlelight Highlights across Tabletop */}
        {/* Left Lantern Pool */}
        <div className="absolute left-[18%] top-[25%] w-56 h-32 rounded-full bg-amber-600/15 blur-2xl transform -rotate-6" />
        {/* Center Book Aura */}
        <div className="absolute left-[38%] top-[30%] w-80 h-36 rounded-full bg-orange-600/15 blur-3xl" />
        {/* Right Lantern Pool */}
        <div className="absolute right-[16%] top-[20%] w-60 h-36 rounded-full bg-amber-500/20 blur-2xl transform rotate-6" />

        {/* Vignette Shadow on Far Back Edge of Table */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 to-transparent" />
      </div>

      {/* 2. Beveled Mahogany Table Edge Lip */}
      <div className="relative w-full h-4 bg-gradient-to-b from-[#4d2312] via-[#2d1208] to-[#160703] border-t border-amber-700/50 shadow-md flex items-center">
        {/* Top edge highlight catching candle fire light */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      </div>

      {/* 3. Front Apron & Deep Shadow below Table */}
      <div className="relative w-full h-[22%] bg-gradient-to-b from-[#120603] via-[#0a0301] to-[#040101] shadow-2xl flex flex-col justify-end">
        {/* Subtle antique carved beading on table apron */}
        <div className="w-full h-2 border-b border-amber-950/60 bg-[#1e0a05]/60" />
      </div>
    </div>
  );
}
