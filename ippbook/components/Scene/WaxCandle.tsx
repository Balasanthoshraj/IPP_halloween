import React from "react";

interface WaxCandleProps {
  height?: "tall" | "medium" | "short";
  className?: string;
  hasPool?: boolean;
}

export function WaxCandle({ height = "medium", className = "", hasPool = true }: WaxCandleProps) {
  const heightData = {
    tall: { h: "h-32 sm:h-44", viewBox: "0 0 70 180", candleH: 140, flameY: 28 },
    medium: { h: "h-24 sm:h-32", viewBox: "0 0 70 130", candleH: 90, flameY: 28 },
    short: { h: "h-16 sm:h-22", viewBox: "0 0 70 90", candleH: 55, flameY: 24 },
  }[height];

  return (
    <div className={`relative flex flex-col items-center select-none ${heightData.h} w-12 sm:w-16 ${className}`}>
      {/* 1. Contact shadow under candle wax base */}
      <div className="absolute -bottom-1 w-[80%] h-3 bg-black/75 rounded-full blur-sm" />

      {/* 2. Soft Candle Flame Halo Glow */}
      <div
        className="absolute top-2 w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-amber-400/25 blur-xl pointer-events-none animate-candle-flame"
        style={{ transformOrigin: "center bottom" }}
      />

      {/* 3. Detailed Candle SVG Structure */}
      <svg
        viewBox={heightData.viewBox}
        className="w-full h-full relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] overflow-visible"
      >
        <defs>
          {/* Melted Ivory Wax Gradient */}
          <linearGradient id="ivory-wax" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d5caa8" />
            <stop offset="25%" stopColor="#fdfbf5" />
            <stop offset="70%" stopColor="#f3eedc" />
            <stop offset="100%" stopColor="#beb18f" />
          </linearGradient>

          {/* Subsurface Warm Glow inside top wax */}
          <radialGradient id="wax-subsurface" cx="50%" cy="10%" r="60%">
            <stop offset="0%" stopColor="#ffe699" />
            <stop offset="40%" stopColor="#f7ecd0" />
            <stop offset="100%" stopColor="#e2d4af" />
          </radialGradient>

          {/* Candle Flame Teardrop Gradient */}
          <radialGradient id="candle-flame-grad" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="95%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* --- Flame & Wick Group --- */}
        <g className="animate-candle-flame" style={{ transformOrigin: `35px ${heightData.flameY}px` }}>
          {/* Outer Flame Glow Teardrop */}
          <path
            d={`M35 ${heightData.flameY - 24} C39 ${heightData.flameY - 14}, 43 ${heightData.flameY - 4}, 35 ${heightData.flameY} C27 ${heightData.flameY - 4}, 31 ${heightData.flameY - 14}, 35 ${heightData.flameY - 24} Z`}
            fill="url(#candle-flame-grad)"
            filter="drop-shadow(0 0 6px #f59e0b)"
          />
          {/* Inner Intense White Flame */}
          <ellipse cx="35" cy={heightData.flameY - 6} rx="2" ry="5" fill="#ffffff" />

          {/* Black Charred Wick */}
          <path
            d={`M35 ${heightData.flameY - 1} Q37 ${heightData.flameY + 5}, 35 ${heightData.flameY + 10}`}
            fill="none"
            stroke="#1c1917"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Tiny Red Ember at Wick Tip */}
          <circle cx="35" cy={heightData.flameY - 1} r="0.8" fill="#ff4400" />
        </g>

        {/* --- Melted Wax Candle Cylinder Body --- */}
        <g transform={`translate(0, ${heightData.flameY + 8})`}>
          {/* Top Melted Wax Rim Cup */}
          <ellipse cx="35" cy="4" rx="16" ry="5" fill="url(#wax-subsurface)" stroke="#d5caa8" strokeWidth="0.8" />
          <ellipse cx="35" cy="4" rx="8" ry="2.5" fill="#c4b693" opacity="0.6" />

          {/* Main Pillar Body */}
          <path
            d={`M19 4 V${heightData.candleH} C19 ${heightData.candleH + 5}, 51 ${heightData.candleH + 5}, 51 ${heightData.candleH} V4 Z`}
            fill="url(#ivory-wax)"
          />

          {/* Realistic Melted Wax Dripping Ribs Running Down Sides */}
          {/* Left Drip 1 */}
          <path
            d="M20 4 C18 15, 17 28, 20 38 C22 42, 25 40, 24 34 C23 24, 23 12, 25 4 Z"
            fill="url(#ivory-wax)"
            filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.2))"
          />
          {/* Left Drip 2 (Longer) */}
          <path
            d="M26 4 C24 25, 23 50, 26 65 C28 68, 30 66, 29 60 C27 45, 28 20, 30 4 Z"
            fill="url(#ivory-wax)"
            filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.15))"
          />
          {/* Right Drip 1 */}
          <path
            d="M45 4 C48 18, 49 32, 47 44 C45 48, 42 46, 44 38 C46 26, 44 14, 42 4 Z"
            fill="url(#ivory-wax)"
            filter="drop-shadow(-1px 2px 2px rgba(0,0,0,0.2))"
          />

          {/* Pooled Wax at Base */}
          {hasPool && (
            <path
              d={`M12 ${heightData.candleH} C8 ${heightData.candleH + 4}, 18 ${heightData.candleH + 8}, 35 ${heightData.candleH + 8} C52 ${heightData.candleH + 8}, 62 ${heightData.candleH + 4}, 58 ${heightData.candleH} Z`}
              fill="url(#ivory-wax)"
              opacity="0.9"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
