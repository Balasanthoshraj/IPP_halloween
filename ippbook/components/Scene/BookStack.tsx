import React from "react";

interface BookStackProps {
  className?: string;
  children?: React.ReactNode;
}

export function BookStack({ className = "", children }: BookStackProps) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Top mounted item (e.g. Carved Pumpkin sitting on top) */}
      {children && <div className="relative z-20 mb-[-12px] sm:mb-[-18px]">{children}</div>}

      {/* Stack of 3 Antique Leather Volumes */}
      <div className="relative w-44 sm:w-56 md:w-64 h-16 sm:h-20 flex flex-col justify-end z-10 drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]">
        {/* Book 1 (Top Book - Dark Burgundy Leather) */}
        <div className="relative w-[92%] mx-auto h-5 sm:h-6 rounded-sm bg-gradient-to-r from-[#2a0e0e] via-[#4a1c1c] to-[#1c0808] border-b border-amber-900/60 shadow-md flex items-center px-3 justify-between">
          {/* Spine Ribs & Gold Lettering */}
          <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-1 h-3 bg-amber-500/50 rounded-xs" />
            <span className="text-[8px] font-heading uppercase tracking-widest text-amber-300/80 font-bold">
              TOMVS I • ALGORITHMS
            </span>
          </div>
          {/* Gilded Page Edges on Right */}
          <div className="w-6 h-full bg-gradient-to-r from-amber-800 via-amber-200/60 to-amber-900 rounded-r shadow-inner" />
        </div>

        {/* Book 2 (Middle Book - Dark Brown Tooled Leather) */}
        <div className="relative w-[97%] mx-auto h-5 sm:h-6 rounded-sm bg-gradient-to-r from-[#1c1109] via-[#361e0e] to-[#160b05] border-b border-black shadow-md flex items-center px-3 justify-between">
          <div className="flex items-center gap-1.5 opacity-80">
            <div className="w-1 h-3 bg-amber-500/50 rounded-xs" />
            <span className="text-[8px] font-heading uppercase tracking-widest text-amber-300/80 font-bold">
              TOMVS II • CRYPTOGRAPHIA
            </span>
          </div>
          <div className="w-7 h-full bg-gradient-to-r from-amber-800 via-amber-200/60 to-amber-900 rounded-r shadow-inner" />
        </div>

        {/* Book 3 (Bottom Book - Thick Black/Charcoal Volume) */}
        <div className="relative w-full h-6 sm:h-7 rounded-sm bg-gradient-to-r from-[#0d0f12] via-[#1a1f26] to-[#08090b] border-t border-slate-700/30 shadow-lg flex items-center px-3 justify-between">
          <div className="flex items-center gap-1.5 opacity-85">
            <div className="w-1 h-3.5 bg-amber-500/60 rounded-xs" />
            <span className="text-[8px] sm:text-[9px] font-heading uppercase tracking-widest text-amber-300/90 font-bold">
              HISTORIA COMPUTATRICIS
            </span>
          </div>
          <div className="w-8 h-full bg-gradient-to-r from-amber-800 via-amber-200/70 to-amber-900 rounded-r shadow-inner" />
        </div>
      </div>
    </div>
  );
}
