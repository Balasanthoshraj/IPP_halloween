import React from "react";

export function GothicWallpaper() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Base deep midnight-blue / charcoal gothic wall gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080d] via-[#090d15] to-[#040608]" />

      {/* Repeating Antique Gothic Damask & Floral Pattern via SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-20 mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gothic-damask" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Damask Leaf & Acanthus Curves */}
            <path
              d="M60 10 C50 30, 20 35, 30 60 C35 75, 50 80, 60 110 C70 80, 85 75, 90 60 C100 35, 70 30, 60 10 Z"
              fill="none"
              stroke="#b8860b"
              strokeWidth="0.8"
              opacity="0.6"
            />
            <path
              d="M60 25 C54 40, 36 45, 42 60 C46 70, 54 75, 60 95 C66 75, 74 70, 78 60 C84 45, 66 40, 60 25 Z"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.6"
              opacity="0.5"
            />
            {/* Central Fleur-de-lis */}
            <path
              d="M60 45 C58 52, 52 55, 50 60 C53 62, 57 60, 60 68 C63 60, 67 62, 70 60 C68 55, 62 52, 60 45 Z"
              fill="#d4af37"
              opacity="0.3"
            />
            {/* Side Scroll Ornaments */}
            <path
              d="M0 60 C15 50, 20 20, 10 0 M120 60 C105 50, 100 20, 110 0"
              fill="none"
              stroke="#b8860b"
              strokeWidth="0.7"
              opacity="0.5"
            />
            <path
              d="M0 60 C15 70, 20 100, 10 120 M120 60 C105 70, 100 100, 110 120"
              fill="none"
              stroke="#b8860b"
              strokeWidth="0.7"
              opacity="0.5"
            />
            {/* Subtle Bat silhouette watermark within wallpaper pattern */}
            <path
              d="M60 112 C64 106, 72 104, 78 108 C76 112, 72 113, 68 112 C66 114, 64 116, 60 118 C56 116, 54 114, 52 112 C48 113, 44 112, 42 108 C48 104, 56 106, 60 112 Z"
              fill="#7a5c1e"
              opacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gothic-damask)" />
      </svg>

      {/* Ambient shadow gradient from top and sides */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/75 pointer-events-none" />

      {/* Wall Picture Frame (Top Right) with Glowing Jack-o'-Lantern Portrait */}
      <div className="absolute top-6 right-10 sm:right-24 w-20 sm:w-28 h-28 sm:h-36 rounded-lg p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.9)] border-2 border-amber-900/60 bg-gradient-to-b from-[#22150c] via-[#150c06] to-[#0d0703] hidden md:block">
        {/* Antique Baroque Carved Border */}
        <div className="w-full h-full rounded border border-amber-500/40 p-2 flex flex-col items-center justify-center bg-black/60 relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/20 via-transparent to-black" />
          {/* Framed Pumpkin Glow */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_#ea580c]">
              <path
                d="M50 18 C30 18, 15 32, 15 55 C15 78, 30 88, 50 88 C70 88, 85 78, 85 55 C85 32, 70 18, 50 18 Z"
                fill="#ea580c"
              />
              {/* Pumpkin Stem */}
              <path d="M48 18 C47 10, 52 6, 56 4 C57 10, 54 15, 52 18 Z" fill="#4a5d23" />
              {/* Eyes & Mouth */}
              <polygon points="34,42 42,42 38,34" fill="#ffdd66" />
              <polygon points="58,42 66,42 62,34" fill="#ffdd66" />
              <polygon points="50,48 46,54 54,54" fill="#ffdd66" />
              <path d="M30 62 L38 66 L44 60 L50 67 L56 60 L62 66 L70 62 L66 74 L50 78 L34 74 Z" fill="#ffdd66" />
            </svg>
          </div>
          <span className="text-[7px] text-amber-400/60 font-heading tracking-widest mt-1 uppercase">
            MCMXCVIII
          </span>
        </div>
      </div>
    </div>
  );
}
