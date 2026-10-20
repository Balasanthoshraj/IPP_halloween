import React from "react";

interface BrassLanternProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrassLantern({ className = "", size = "md" }: BrassLanternProps) {
  const sizeClasses = {
    sm: "w-20 h-32 sm:w-24 sm:h-36",
    md: "w-28 h-44 sm:w-32 sm:h-52 md:w-36 md:h-60",
    lg: "w-36 h-56 sm:w-40 sm:h-64 md:w-44 md:h-72",
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {/* 1. Cast Contact Shadow on Table */}
      <div className="absolute -bottom-1.5 w-[75%] h-5 bg-black/85 rounded-full blur-md" />

      {/* 2. Big Amber Volumetric Glow Blooming from Glass */}
      <div className="absolute top-[32%] w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-amber-500/30 blur-3xl pointer-events-none animate-flame" />

      {/* 3. Detailed Brass Lantern SVG Structure */}
      <svg
        viewBox="0 0 160 260"
        className="w-full h-full relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] overflow-visible"
      >
        <defs>
          {/* Burnished Brass Gradient */}
          <linearGradient id="brass-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a3714" />
            <stop offset="25%" stopColor="#8a6726" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="65%" stopColor="#ffd700" />
            <stop offset="85%" stopColor="#8a6726" />
            <stop offset="100%" stopColor="#36270c" />
          </linearGradient>

          {/* Dark Antique Iron / Patina Gradient for Wire Cage */}
          <linearGradient id="iron-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1c1e" />
            <stop offset="50%" stopColor="#40454d" />
            <stop offset="100%" stopColor="#111314" />
          </linearGradient>

          {/* Glass Globe Gradient with Amber Reflection */}
          <radialGradient id="glass-reflection" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff8e7" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#b45309" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="0.5" />
          </radialGradient>

          {/* Lantern Wick Flame Gradient */}
          <radialGradient id="lantern-flame" cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="95%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* 1. Wire Hanging Bail (Handle arched over top) */}
        <path
          d="M32 90 C15 50, 40 10, 80 10 C120 10, 145 50, 128 90"
          fill="none"
          stroke="url(#iron-grad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 2. Top Brass Ring Cap & Hood */}
        <ellipse cx="80" cy="22" rx="14" ry="5" fill="url(#brass-grad)" />
        <path d="M72 22 V35 H88 V22 Z" fill="url(#brass-grad)" />
        {/* Tiered Domed Vented Cap */}
        <path
          d="M52 50 C52 35, 108 35, 108 50 Z"
          fill="url(#brass-grad)"
          stroke="#261b0a"
          strokeWidth="1"
        />
        <rect x="58" y="50" width="44" height="6" rx="2" fill="#241708" />
        <ellipse cx="80" cy="56" rx="30" ry="7" fill="url(#brass-grad)" />

        {/* 3. Glass Globe Chimney Body */}
        <path
          d="M50 63 C36 80, 36 120, 50 145 H110 C124 120, 124 80, 110 63 Z"
          fill="url(#glass-reflection)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />

        {/* Glass Specular Curved Reflection Highlight */}
        <path
          d="M55 75 C45 95, 45 115, 55 135"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* 4. Inside Glass: Dancing Oil Flame on Wick */}
        <g className="animate-flame">
          <ellipse cx="80" cy="118" rx="8" ry="16" fill="url(#lantern-flame)" filter="drop-shadow(0 0 10px #f59e0b)" />
          {/* Flame Core White Hot Tear */}
          <ellipse cx="80" cy="122" rx="3.5" ry="8" fill="#ffffff" />
          {/* Brass Wick Burner Base */}
          <rect x="73" y="132" width="14" height="8" rx="1" fill="#4d3714" />
        </g>

        {/* 5. Outer Protective Wire Cage Bars */}
        <path d="M50 63 V145" stroke="url(#iron-grad)" strokeWidth="3" />
        <path d="M110 63 V145" stroke="url(#iron-grad)" strokeWidth="3" />
        <path d="M70 63 C65 95, 65 115, 70 145" stroke="url(#iron-grad)" strokeWidth="2.5" fill="none" />
        <path d="M90 63 C95 95, 95 115, 90 145" stroke="url(#iron-grad)" strokeWidth="2.5" fill="none" />
        <ellipse cx="80" cy="100" rx="36" ry="6" fill="none" stroke="url(#iron-grad)" strokeWidth="2" />

        {/* 6. Lower Brass Reservoir Fuel Tank */}
        <ellipse cx="80" cy="148" rx="34" ry="8" fill="url(#brass-grad)" />
        <path
          d="M46 148 C42 165, 34 185, 30 210 H130 C126 185, 118 165, 114 148 Z"
          fill="url(#brass-grad)"
          stroke="#261b0a"
          strokeWidth="1.5"
        />

        {/* Fuel Tank Rim Bands */}
        <line x1="38" y1="175" x2="122" y2="175" stroke="#261a06" strokeWidth="2" />
        <line x1="33" y1="195" x2="127" y2="195" stroke="#ffe066" strokeWidth="1" opacity="0.6" />

        {/* Broad Brass Weighted Base */}
        <ellipse cx="80" cy="210" rx="50" ry="12" fill="url(#brass-grad)" />
        <path d="M30 210 V218 C30 225, 130 225, 130 218 V210 Z" fill="#2d1e08" />
        <ellipse cx="80" cy="218" rx="50" ry="12" fill="url(#brass-grad)" />

        {/* Wick Adjustment Knob on side */}
        <ellipse cx="120" cy="155" rx="4" ry="6" fill="url(#brass-grad)" stroke="#1a1205" strokeWidth="1" />
      </svg>
    </div>
  );
}
