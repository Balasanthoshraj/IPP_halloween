import React from "react";
import { WaxCandle } from "./WaxCandle";

export function Candelabra({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Contact Shadow */}
      <div className="absolute -bottom-2 w-28 h-6 bg-black/85 rounded-full blur-md" />

      {/* Two Mounted Taper Candles */}
      <div className="relative z-20 flex justify-between w-28 mb-[-14px]">
        <WaxCandle height="tall" className="transform -translate-x-1" />
        <WaxCandle height="tall" className="transform translate-x-1" />
      </div>

      {/* Antique Brass Candelabra SVG Stand */}
      <svg
        viewBox="0 0 140 180"
        className="w-32 h-44 relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] overflow-visible"
      >
        <defs>
          <linearGradient id="candelabra-brass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3d2c0e" />
            <stop offset="25%" stopColor="#7a5b1e" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="75%" stopColor="#ffdb4d" />
            <stop offset="90%" stopColor="#7a5b1e" />
            <stop offset="100%" stopColor="#2e1f08" />
          </linearGradient>
        </defs>

        {/* Left Candle Drip Pan Cup */}
        <ellipse cx="28" cy="18" rx="14" ry="4" fill="url(#candelabra-brass)" stroke="#261b0a" strokeWidth="1" />
        <path d="M22 18 V26 C22 30, 34 30, 34 26 V18 Z" fill="url(#candelabra-brass)" />

        {/* Right Candle Drip Pan Cup */}
        <ellipse cx="112" cy="18" rx="14" ry="4" fill="url(#candelabra-brass)" stroke="#261b0a" strokeWidth="1" />
        <path d="M106 18 V26 C106 30, 118 30, 118 26 V18 Z" fill="url(#candelabra-brass)" />

        {/* Curving Acanthus Scroll Arms */}
        {/* Left Arm */}
        <path
          d="M28 26 C28 65, 65 75, 70 85"
          fill="none"
          stroke="url(#candelabra-brass)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Right Arm */}
        <path
          d="M112 26 C112 65, 75 75, 70 85"
          fill="none"
          stroke="url(#candelabra-brass)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Central Finial Spike at Center */}
        <path d="M70 12 L74 38 H66 Z" fill="url(#candelabra-brass)" />
        <circle cx="70" cy="10" r="3.5" fill="#ffd700" />

        {/* Central Turned Brass Column */}
        <path
          d="M66 40 H74 V75 C78 78, 78 85, 74 90 V130 H66 V90 C62 85, 62 78, 66 75 Z"
          fill="url(#candelabra-brass)"
          stroke="#261b0a"
          strokeWidth="1"
        />

        {/* Baluster Bulbs on Column */}
        <ellipse cx="70" cy="60" rx="7" ry="4" fill="url(#candelabra-brass)" />
        <ellipse cx="70" cy="105" rx="8" ry="5" fill="url(#candelabra-brass)" />

        {/* Fluted Baroque Weighted Base */}
        <path
          d="M55 130 C50 148, 30 158, 20 168 H120 C110 158, 90 148, 85 130 Z"
          fill="url(#candelabra-brass)"
          stroke="#261b0a"
          strokeWidth="1.5"
        />
        <ellipse cx="70" cy="168" rx="52" ry="10" fill="url(#candelabra-brass)" />
      </svg>
    </div>
  );
}
