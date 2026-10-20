import React from "react";
import { VintageDivider, OrnateCorner, DropCap } from "@/ippbook/components/UI/OrnamentDividers";
import { symposiumData } from "@/ippbook/data/symposiumData";
import { BrainCircuit, ShieldAlert, CloudLightning, Award, GraduationCap } from "lucide-react";

export function ChapterDepartmentPart1() {
  const dept = symposiumData.department;

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Chapter Heading */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          CHAPTER I
        </span>
        <h2 className="text-xl sm:text-2xl font-decorative font-extrabold text-amber-950 tracking-wide mt-0.5">
          THE CITADEL OF COMPUTING
        </h2>
        <p className="text-[11px] text-amber-900/70 font-heading uppercase tracking-widest mt-0.5">
          {dept.name}
        </p>
        <VintageDivider className="my-2" />
      </div>

      {/* Main Body: Introduction & Vision */}
      <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed">
        <p>
          <DropCap char="F" />
          ounded in {dept.establishedYear}, the {dept.name} stands as an ancient bastion of digital intellect, computational theory, and transformative engineering. Holding {dept.accreditation}, our sanctuaries have cultivated generations of technologists who decipher complex societal challenges and shape the digital frontier.
        </p>

        {/* Head of Department Message */}
        <div className="p-3.5 rounded bg-amber-950/5 border-l-4 border-amber-800 shadow-sm my-2">
          <p className="italic text-xs font-serif text-amber-950/90 leading-snug">
            &ldquo;{dept.hodMessage.quote}&rdquo;
          </p>
          <div className="mt-2 text-right">
            <span className="font-heading font-bold text-xs text-amber-900 block">
              {dept.hodMessage.author}
            </span>
            <span className="text-[10px] text-amber-800/70 block">
              {dept.hodMessage.designation}
            </span>
          </div>
        </div>

        {/* 4 Golden Milestones Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {dept.stats.map((st, i) => (
            <div
              key={i}
              className="p-2 rounded bg-amber-900/5 border border-amber-900/20 text-center flex flex-col items-center justify-center"
            >
              <span className="text-lg font-heading font-black text-amber-900 tracking-tight">
                {st.value}
              </span>
              <span className="text-[10px] font-heading font-bold text-amber-950">
                {st.label}
              </span>
              <span className="text-[9px] text-amber-800/70">{st.subtext}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page II
      </div>
    </div>
  );
}

export function ChapterDepartmentPart2() {
  const dept = symposiumData.department;

  return (
    <div className="relative w-full h-full p-6 sm:p-7 flex flex-col justify-between text-parchment-ink font-book select-none parchment-scroll overflow-y-auto">
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />

      {/* Header */}
      <div className="text-center pt-1">
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-900/70 font-heading font-bold">
          ACADEMIC SANCTUARIES
        </span>
        <h3 className="text-lg sm:text-xl font-decorative font-bold text-amber-950 mt-0.5">
          PILLARS OF MASTERY
        </h3>
        <VintageDivider className="my-2" />
      </div>

      {/* Academic Pillars List */}
      <div className="space-y-2.5 text-xs">
        {dept.academicPillars.map((pillar, idx) => {
          const Icon = idx === 0 ? BrainCircuit : idx === 1 ? ShieldAlert : CloudLightning;
          return (
            <div
              key={idx}
              className="p-2.5 rounded bg-amber-950/5 border border-amber-900/20 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded bg-amber-900/10 text-amber-900">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-xs text-amber-950">
                  {pillar.title}
                </h4>
              </div>
              <p className="text-[11px] text-amber-950/80 leading-relaxed mb-1.5">
                {pillar.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {pillar.specialties.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/10 text-amber-900 font-sans font-medium"
                  >
                    ✦ {spec}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {/* Vision & Mission Summary */}
        <div className="p-2.5 rounded bg-amber-900/5 border border-amber-900/20 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-900 font-heading font-bold text-xs mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Citadel Vision</span>
          </div>
          <p className="italic text-amber-950/80 text-[10px] leading-relaxed">
            {dept.vision}
          </p>
        </div>
      </div>

      {/* Page Footer */}
      <div className="text-center text-[10px] text-amber-900/60 font-mono pt-2 border-t border-amber-900/15">
        Grimoire of CSE • Page III
      </div>
    </div>
  );
}
