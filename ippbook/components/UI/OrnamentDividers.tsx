import React from "react";

export function VintageDivider({ className = "my-4" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-amber-800/60 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-800/40 to-amber-900/60" />
      <svg className="w-6 h-6 text-amber-800/80 fill-current" viewBox="0 0 24 24">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        <circle cx="12" cy="12" r="2" fill="#fff" opacity="0.8" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-800/40 to-amber-900/60" />
    </div>
  );
}

export function OrnateCorner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const rotationClass = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2 rotate-90",
    "bottom-right": "bottom-2 right-2 rotate-180",
    "bottom-left": "bottom-2 left-2 -rotate-90",
  }[position];

  return (
    <div className={`absolute pointer-events-none w-8 h-8 text-amber-700/50 ${rotationClass}`}>
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 14V2H14" />
        <path d="M5 8V5H8" />
        <path d="M2 2C8 2 12 6 12 12" strokeDasharray="1 2" />
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        <circle cx="14" cy="2" r="1" fill="currentColor" />
        <circle cx="2" cy="14" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}

export function AntiqueSeal({ text = "EST. 1998", className = "" }: { text?: string; className?: string }) {
  return (
    <div className={`inline-flex flex-col items-center justify-center p-2 rounded-full border-2 border-dashed border-amber-900/50 bg-amber-950/10 text-amber-900/80 ${className}`}>
      <span className="text-[9px] uppercase tracking-widest font-heading font-bold">{text}</span>
    </div>
  );
}

export function DropCap({ char }: { char: string }) {
  return (
    <span className="float-left text-5xl font-decorative leading-none pr-3 pt-1 text-amber-950 font-bold select-none drop-shadow-sm">
      {char}
    </span>
  );
}
