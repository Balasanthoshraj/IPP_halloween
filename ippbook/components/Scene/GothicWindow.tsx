import React from "react";

export function GothicWindow() {
  return (
    <div className="absolute left-0 top-0 bottom-[28%] w-[26vw] min-w-[200px] max-w-[340px] pointer-events-none select-none z-10 hidden sm:block">
      {/* Stone Arch & Outer Recess */}
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Night Sky View behind Window */}
        <div className="absolute inset-x-4 top-8 bottom-4 rounded-t-full overflow-hidden bg-gradient-to-b from-[#080d18] via-[#0e1626] to-[#04070d] shadow-inner border-4 border-[#12151c]">
          {/* Pale Blue Moonlight Glow */}
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />

          {/* Full Moon */}
          <div className="absolute top-10 left-8 w-14 h-14 rounded-full bg-gradient-to-tr from-[#cbd5e1] to-[#f8fafc] shadow-[0_0_35px_rgba(203,213,225,0.4)] opacity-70">
            {/* Subtle moon crater mottling */}
            <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-slate-400/25 blur-[1px]" />
            <div className="absolute bottom-3 right-4 w-5 h-3 rounded-full bg-slate-400/20 blur-[1px]" />
          </div>

          {/* Drifting Bats outside window */}
          <div className="absolute top-20 right-6 w-6 h-3 text-slate-900/80 animate-bat-drift">
            <svg viewBox="0 0 40 20" fill="currentColor">
              <path d="M20,12 C24,4 32,2 38,7 C36,12 32,14 26,13 C24,15 22,17 20,19 C18,17 16,15 14,13 C8,14 4,12 2,7 C8,2 16,4 20,12 Z" />
            </svg>
          </div>
          <div
            className="absolute top-36 left-12 w-4 h-2 text-slate-900/70 animate-bat-drift"
            style={{ animationDelay: "3s" }}
          >
            <svg viewBox="0 0 40 20" fill="currentColor">
              <path d="M20,12 C24,4 32,2 38,7 C36,12 32,14 26,13 C24,15 22,17 20,19 C18,17 16,15 14,13 C8,14 4,12 2,7 C8,2 16,4 20,12 Z" />
            </svg>
          </div>

          {/* Intricate Gothic Wrought-Iron Tracery SVG Overlay */}
          <svg className="absolute inset-0 w-full h-full text-[#111317] stroke-current" viewBox="0 0 200 400" fill="none">
            {/* Outer Gothic Pointed Arch */}
            <path
              d="M10 400 V120 C10 40, 90 10, 100 10 C110 10, 190 40, 190 120 V400"
              strokeWidth="10"
            />
            {/* Inner Twin Arches */}
            <path
              d="M10 400 V200 C10 140, 50 120, 55 120 C60 120, 100 140, 100 200 V400"
              strokeWidth="5"
            />
            <path
              d="M100 400 V200 C100 140, 140 120, 145 120 C150 120, 190 140, 190 200 V400"
              strokeWidth="5"
            />
            {/* Central Rose Circle / Trefoil at Peak */}
            <circle cx="100" cy="80" r="28" strokeWidth="5" />
            <circle cx="100" cy="65" r="9" strokeWidth="3" />
            <circle cx="86" cy="88" r="9" strokeWidth="3" />
            <circle cx="114" cy="88" r="9" strokeWidth="3" />

            {/* Horizontal Wrought Iron Bars */}
            <line x1="10" y1="260" x2="190" y2="260" strokeWidth="4" />
            <line x1="10" y1="330" x2="190" y2="330" strokeWidth="4" />

            {/* Diagonal diamond leading pattern in lower panels */}
            <path
              d="M10 210 L55 260 L10 310 M100 210 L55 260 L100 310 M100 210 L145 260 L100 310 M190 210 L145 260 L190 310"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />
          </svg>
        </div>

        {/* Heavy Stone Sill at Bottom of Window */}
        <div className="absolute bottom-0 inset-x-2 h-7 bg-gradient-to-t from-[#0d0f14] via-[#1a1e27] to-[#12161f] rounded border-t border-slate-700/40 shadow-2xl flex items-center justify-center">
          <div className="w-12 h-1 bg-black/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
