import React from "react";

interface CarvedPumpkinProps {
  size?: "sm" | "md" | "lg";
  faceStyle?: "grin" | "wicked" | "classic";
  className?: string;
  glowIntensity?: "normal" | "bright";
}

export function CarvedPumpkin({
  size = "md",
  faceStyle = "grin",
  className = "",
  glowIntensity = "normal",
}: CarvedPumpkinProps) {
  const sizeClasses = {
    sm: "w-20 h-16 sm:w-24 sm:h-20",
    md: "w-36 h-28 sm:w-44 sm:h-36 md:w-52 md:h-40",
    lg: "w-48 h-36 sm:w-60 sm:h-44 md:w-72 md:h-52",
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {/* 1. Cast Contact Shadow on Table Surface */}
      <div className="absolute -bottom-2 w-[85%] h-6 bg-black/80 rounded-full blur-md" />

      {/* 2. Soft Amber Inner Light Cast onto Surrounding Area */}
      <div
        className={`absolute inset-0 rounded-full bg-orange-600/30 blur-xl pointer-events-none ${
          glowIntensity === "bright" ? "animate-pumpkin-glow" : "animate-flame-slow"
        }`}
      />

      {/* 3. Pure 3D Sculpted Pumpkin SVG Object */}
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] overflow-visible"
      >
        <defs>
          {/* Radial Gradient for 3D Spherical Pumpkin Flesh */}
          <radialGradient id="pumpkin-body" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ff8533" />
            <stop offset="40%" stopColor="#e65c00" />
            <stop offset="85%" stopColor="#993d00" />
            <stop offset="100%" stopColor="#521f00" />
          </radialGradient>

          {/* Rib Shadow Gradient */}
          <linearGradient id="rib-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3d1800" stopOpacity="0.8" />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor="#3d1800" stopOpacity="0.8" />
          </linearGradient>

          {/* Inner Jack-o'-Lantern Fire Glow */}
          <radialGradient id="inner-fire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff5cc" />
            <stop offset="35%" stopColor="#ffb733" />
            <stop offset="75%" stopColor="#e65100" />
            <stop offset="100%" stopColor="#802000" />
          </radialGradient>

          {/* Stem Gradient */}
          <linearGradient id="stem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7a8b38" />
            <stop offset="50%" stopColor="#445318" />
            <stop offset="100%" stopColor="#252e0a" />
          </linearGradient>

          {/* Inner Light Filter */}
          <filter id="flame-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stem (Top Behind or Sprouting) */}
        <path
          d="M95 38 C90 20, 102 10, 115 5 C118 7, 112 18, 106 36 Z"
          fill="url(#stem-grad)"
          stroke="#1c2406"
          strokeWidth="1.5"
        />

        {/* Outer Left Rib */}
        <ellipse cx="50" cy="95" rx="36" ry="50" fill="url(#pumpkin-body)" />
        <ellipse cx="50" cy="95" rx="36" ry="50" fill="url(#rib-shadow)" />

        {/* Outer Right Rib */}
        <ellipse cx="150" cy="95" rx="36" ry="50" fill="url(#pumpkin-body)" />
        <ellipse cx="150" cy="95" rx="36" ry="50" fill="url(#rib-shadow)" />

        {/* Mid Left Rib */}
        <ellipse cx="75" cy="95" rx="36" ry="54" fill="url(#pumpkin-body)" />
        <ellipse cx="75" cy="95" rx="36" ry="54" fill="url(#rib-shadow)" />

        {/* Mid Right Rib */}
        <ellipse cx="125" cy="95" rx="36" ry="54" fill="url(#pumpkin-body)" />
        <ellipse cx="125" cy="95" rx="36" ry="54" fill="url(#rib-shadow)" />

        {/* Center Main Front Rib */}
        <ellipse cx="100" cy="96" rx="38" ry="56" fill="url(#pumpkin-body)" />

        {/* Highlights across top shoulders of pumpkin */}
        <path
          d="M50 60 C80 50, 120 50, 150 60"
          stroke="#ffa366"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
          fill="none"
        />

        {/* Carved Glowing Features Group */}
        <g filter="url(#flame-glow)" className="animate-candle-flame">
          {faceStyle === "grin" && (
            <>
              {/* Left Eye */}
              <polygon points="62,75 80,75 70,58" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="2" />
              {/* Right Eye */}
              <polygon points="120,75 138,75 128,58" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="2" />
              {/* Nose */}
              <polygon points="100,78 93,89 107,89" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="1.5" />
              {/* Jagged Grinning Mouth */}
              <path
                d="M52 104 L68 114 L78 103 L88 116 L100 102 L112 116 L122 103 L132 114 L148 104 L138 124 L122 120 L112 130 L100 120 L88 130 L78 120 L62 124 Z"
                fill="url(#inner-fire)"
                stroke="#4d1a00"
                strokeWidth="2.5"
              />
            </>
          )}

          {faceStyle === "wicked" && (
            <>
              {/* Angular Wicked Slanted Eyes */}
              <polygon points="56,66 84,78 72,56" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="2" />
              <polygon points="144,66 116,78 128,56" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="2" />
              {/* Nose */}
              <polygon points="100,74 92,86 108,86" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="1.5" />
              {/* Wide Wicked Tooth Grin */}
              <path
                d="M48 98 L64 116 L76 102 L92 118 L100 102 L108 118 L124 102 L136 116 L152 98 L142 128 L120 122 L108 134 L100 122 L92 134 L80 122 L58 128 Z"
                fill="url(#inner-fire)"
                stroke="#4d1a00"
                strokeWidth="2.5"
              />
            </>
          )}

          {faceStyle === "classic" && (
            <>
              {/* Classic Triangle Eyes */}
              <polygon points="65,74 85,74 75,60" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="2" />
              <polygon points="115,74 135,74 125,60" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="2" />
              {/* Classic Inverted Triangle Nose */}
              <polygon points="94,80 106,80 100,90" fill="url(#inner-fire)" stroke="#4d1a00" strokeWidth="1.5" />
              {/* Classic Tooth Gap Mouth */}
              <path
                d="M60 106 C75 125, 125 125, 140 106 C130 115, 124 108, 120 116 C115 110, 105 110, 100 118 C95 110, 85 110, 80 116 C76 108, 70 115, 60 106 Z"
                fill="url(#inner-fire)"
                stroke="#4d1a00"
                strokeWidth="2.5"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
