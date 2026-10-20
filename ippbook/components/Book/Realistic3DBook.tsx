"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Bookmark,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { sound } from "@/ippbook/utils/soundEffects";
import { ChapterTitlePage } from "@/ippbook/components/Chapters/ChapterTitlePage";
import { ChapterDepartmentPart1, ChapterDepartmentPart2 } from "@/ippbook/components/Chapters/ChapterDepartment";
import { ChapterSymposiumPart1, ChapterSymposiumPart2 } from "@/ippbook/components/Chapters/ChapterSymposium";
import { ChapterEventsTechnical, ChapterEventsNonTechnical } from "@/ippbook/components/Chapters/ChapterEvents";
import { ChapterArchives2025, ChapterArchives2024 } from "@/ippbook/components/Chapters/ChapterArchives";
import { ChapterAchievementsPart1, ChapterAchievementsPart2 } from "@/ippbook/components/Chapters/ChapterAchievements";
import { ChapterNextTimeline, ChapterNextRegistration } from "@/ippbook/components/Chapters/ChapterNextChapter";

interface Realistic3DBookProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  initialPage?: number;
}

export function Realistic3DBook({
  isOpen,
  onOpen,
  onClose,
  initialPage = 0,
}: Realistic3DBookProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const leftPageRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync initial page
  useEffect(() => {
    if (initialPage !== undefined) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Page definitions (13 total pages)
  const pages = [
    { id: 0, title: "Title & Contents", component: <ChapterTitlePage onJumpToPage={(p) => goToPage(p)} /> },
    { id: 1, title: "Chapter I: The Department", component: <ChapterDepartmentPart1 /> },
    { id: 2, title: "Chapter I: Pillars of Mastery", component: <ChapterDepartmentPart2 /> },
    { id: 3, title: "Chapter II: The Symposium", component: <ChapterSymposiumPart1 /> },
    { id: 4, title: "Chapter II: Three Covenants", component: <ChapterSymposiumPart2 /> },
    { id: 5, title: "Chapter III: Technical Trials", component: <ChapterEventsTechnical /> },
    { id: 6, title: "Chapter III: Non-Tech & Gaming", component: <ChapterEventsNonTechnical /> },
    { id: 7, title: "Chapter IV: 2025 Chronicle", component: <ChapterArchives2025 /> },
    { id: 8, title: "Chapter IV: 2024 Chronicle", component: <ChapterArchives2024 /> },
    { id: 9, title: "Chapter V: Hall of Laurels", component: <ChapterAchievementsPart1 /> },
    { id: 10, title: "Chapter V: Echoes & Voices", component: <ChapterAchievementsPart2 /> },
    { id: 11, title: "Chapter VI: Conclave Timeline", component: <ChapterNextTimeline /> },
    { id: 12, title: "Chapter VI: Answer the Summons", component: <ChapterNextRegistration /> },
  ];

  const totalPages = pages.length;

  // Chapter bookmark indexes
  const chapters = [
    { title: "Contents", page: 0 },
    { title: "I. Department", page: 1 },
    { title: "II. Symposium", page: 3 },
    { title: "III. Events", page: 5 },
    { title: "IV. Archives", page: 7 },
    { title: "V. Laurels", page: 9 },
    { title: "VI. Next", page: 11 },
  ];

  const handleOpenBook = () => {
    sound.playBookOpen();
    onOpen();
  };

  const goToPage = (pageIdx: number) => {
    if (pageIdx === currentPage || isFlipping) return;
    const direction = pageIdx > currentPage ? "next" : "prev";
    setFlipDirection(direction);
    setIsFlipping(true);
    sound.playPageFlip();

    setTimeout(() => {
      // In desktop dual-page spread, align to even/odd pairs
      if (!isMobile && pageIdx > 0 && pageIdx % 2 === 0) {
        setCurrentPage(pageIdx - 1);
      } else {
        setCurrentPage(pageIdx);
      }
      setIsFlipping(false);
      // Reset scroll positions of reader pages
      if (leftPageRef.current) leftPageRef.current.scrollTop = 0;
      if (rightPageRef.current) rightPageRef.current.scrollTop = 0;
    }, 450);
  };

  const handleNextPage = () => {
    if (isFlipping) return;
    const step = isMobile ? 1 : (currentPage === 0 ? 1 : 2);
    if (currentPage + step < totalPages) {
      goToPage(currentPage + step);
    }
  };

  const handlePrevPage = () => {
    if (isFlipping) return;
    const step = isMobile ? 1 : (currentPage <= 2 ? 1 : 2);
    if (currentPage - step >= 0) {
      goToPage(currentPage - step);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      } else if (e.key === "ArrowLeft") {
        handlePrevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // ==========================================
  // 1. CLOSED 3D BOOK (Resting on Table)
  // ==========================================
  if (!isOpen) {
    return (
      <div className="relative flex flex-col items-center justify-center select-none group perspective-1000">
        {/* Contact table shadow */}
        <div
          className={`absolute -bottom-6 w-80 md:w-96 h-20 bg-black/90 rounded-full blur-xl transition-all duration-500 ${
            isHovered ? "scale-110 opacity-90" : "scale-100 opacity-70"
          }`}
        />

        {/* Ambient warm table aura */}
        <div
          className={`absolute -bottom-4 w-72 md:w-88 h-24 bg-amber-500/20 rounded-full blur-2xl transition-opacity duration-700 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-40"
          }`}
        />

        {/* The 3D Book Object */}
        <div
          onClick={handleOpenBook}
          onMouseEnter={() => {
            setIsHovered(true);
            sound.playChime();
          }}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpenBook();
          }}
          aria-label="Open The Chronicles 3D Grimoire"
          className="relative cursor-pointer transition-all duration-500 ease-out transform group-hover:-translate-y-4 group-hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-amber-500/60 rounded-lg"
          style={{
            transformStyle: "preserve-3d",
            transform: isHovered
              ? "perspective(1000px) rotateX(16deg) rotateY(-2deg) translateZ(10px)"
              : "perspective(1000px) rotateX(20deg) rotateY(-1deg)",
          }}
        >
          {/* Main Leather Cover (Front) */}
          <div className="relative w-72 sm:w-84 md:w-96 h-48 sm:h-56 md:h-60 rounded-lg p-3 leather-cover shadow-book-heavy border-2 border-amber-900/80 overflow-hidden">
            {/* Leather grain texture & lighting highlights */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-amber-500/10 pointer-events-none" />

            {/* Brass Filigree Corners */}
            <div className="absolute top-2 left-2 w-7 h-7 brass-corner-tl" />
            <div className="absolute top-2 right-2 w-7 h-7 brass-corner-tr" />
            <div className="absolute bottom-2 left-2 w-7 h-7 brass-corner-bl" />
            <div className="absolute bottom-2 right-2 w-7 h-7 brass-corner-br" />

            {/* Embossed Gold Border */}
            <div className="relative w-full h-full rounded border-2 border-amber-500/50 p-3 flex flex-col justify-between items-center bg-gradient-to-br from-amber-950/30 via-transparent to-black/60 shadow-inner">
              {/* Header */}
              <div className="text-center pt-1">
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-amber-400/80 font-heading font-semibold">
                  — DEPT. OF COMPUTER SCIENCE & ENG. —
                </span>
              </div>

              {/* Center Seal & Title */}
              <div className="flex flex-col items-center justify-center my-auto text-center px-4">
                {/* Arcane Crest */}
                <div className="relative mb-2 w-14 h-14 rounded-full border border-amber-400/50 flex items-center justify-center bg-gradient-to-b from-amber-500/15 to-amber-950/50 shadow-inner">
                  <svg
                    className={`w-8 h-8 text-amber-400/90 transition-transform duration-700 ${
                      isHovered ? "rotate-90 scale-110" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  >
                    <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
                    <polygon points="12 3 20 18 4 18" />
                    <polygon points="12 21 4 6 20 6" opacity="0.6" />
                    <circle cx="12" cy="12" r="2.5" fill="#f59e0b" />
                  </svg>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-decorative font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  THE CHRONICLES
                </h2>

                <p className="text-[11px] sm:text-xs text-amber-200/90 font-heading tracking-wider mt-0.5 font-medium">
                  CRYPTOSIS &apos;26 • ANNUAL CONCLAVE
                </p>
              </div>

              {/* Bottom Instruction */}
              <div className="pb-1 text-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-amber-300 font-sans tracking-wide">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  Click to uncover our story
                </span>
              </div>
            </div>

            {/* 3D Gilded Page Block Edge along Right & Bottom */}
            <div
              className="absolute right-0 top-2 bottom-2 w-3.5 bg-gradient-to-r from-amber-950 via-amber-200/80 to-amber-900 shadow-inner rounded-r"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, #d4af37 0px, #d4af37 1px, #78350f 1px, #78350f 2px)",
              }}
            />
          </div>

          {/* 3D Lower Page Thickness Layer */}
          <div
            className="absolute left-2 right-2 -bottom-2.5 h-3 bg-gradient-to-b from-[#2a170b] via-[#e5c57b] to-[#1a0e06] rounded-b shadow-lg border-t border-amber-900/60"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 1px, #78350f 1px, #78350f 2px)",
            }}
          />

          {/* Hover Pulsing Aura */}
          <div
            className={`absolute -inset-2 rounded-xl bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-amber-600/25 filter blur-lg transition-opacity duration-500 -z-10 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* CTA Button */}
        <div className="mt-5 flex flex-col items-center">
          <button
            onClick={handleOpenBook}
            className="relative group/btn px-7 py-2.5 rounded-full overflow-hidden border border-amber-500/70 bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] transition-all duration-300 hover:border-amber-400 active:scale-95"
          >
            <div className="relative flex items-center gap-2.5 text-xs sm:text-sm font-heading font-bold tracking-widest uppercase">
              <BookOpen className="w-4 h-4 text-amber-400 group-hover/btn:scale-110 transition-transform" />
              <span>Open The Chronicle</span>
            </div>
          </button>
          <span className="text-[10px] text-amber-300/60 font-sans mt-1.5 tracking-wider uppercase">
            3D Interactive Department Experience
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. OPEN 3D GRIMOIRE READER
  // ==========================================
  // Determine left and right page indexes
  const leftPageIdx = isMobile ? currentPage : (currentPage === 0 ? 0 : (currentPage % 2 === 1 ? currentPage : currentPage - 1));
  const rightPageIdx = isMobile ? null : (currentPage === 0 ? 1 : leftPageIdx + 1);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/85 backdrop-blur-md overflow-hidden select-none animate-fadeIn">
      {/* Dark Ambient Halloween Backdrop Lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.1)_0%,_transparent_70%)]" />

      {/* 1. Header Ribbon: Chapter Quick-Navigation & Close */}
      <header className="relative z-30 w-full px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between bg-stone-950/90 border-b border-amber-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-500" />
          <span className="font-heading font-bold text-xs sm:text-sm text-amber-200 tracking-wider hidden sm:inline">
            THE CHRONICLES OF COMPUTATION
          </span>
          <span className="font-heading font-bold text-xs text-amber-200 sm:hidden">
            CHRONICLES
          </span>
        </div>

        {/* Chapter Ribbon Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[55vw] py-1 px-1 parchment-scroll">
          {chapters.map((ch) => {
            const isActive =
              isMobile
                ? currentPage === ch.page
                : currentPage === ch.page || currentPage === ch.page + 1;
            return (
              <button
                key={ch.page}
                data-nav-chapter={ch.title}
                onClick={() => goToPage(ch.page)}
                className={`px-2.5 py-1 rounded text-[10px] sm:text-xs font-heading tracking-wider whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-amber-600/30 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)] font-bold"
                    : "text-amber-200/60 hover:text-amber-200 hover:bg-stone-900/60"
                }`}
              >
                {ch.title}
              </button>
            );
          })}
        </nav>

        {/* Sound & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              sound.setMuted(nextMute);
            }}
            aria-label="Toggle Mute"
            className="p-1.5 sm:p-2 rounded-full border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-amber-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            aria-label="Close Book"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-800/70 bg-gradient-to-r from-amber-950 to-stone-950 text-amber-200 hover:text-amber-100 hover:border-amber-500 shadow-sm transition-all"
          >
            <X className="w-4 h-4" />
            <span className="text-[11px] font-heading font-semibold hidden sm:inline">
              Close Grimoire
            </span>
          </button>
        </div>
      </header>

      {/* 2. Main Center 3D Book Spread */}
      <main className="relative z-20 flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden perspective-1200">
        {/* Physical 3D Book Outer Container */}
        <div
          className="relative max-w-5xl w-full h-[76vh] max-h-[680px] p-2 sm:p-3 rounded-2xl leather-cover shadow-book-heavy border-4 border-amber-900/80 flex items-stretch transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(4deg)",
          }}
        >
          {/* Middle Spine Gutter Depression (Desktop dual-page view) */}
          {!isMobile && <div className="book-gutter-crease" />}

          {/* Left Page (Desktop Spread) or Single Page (Mobile) */}
          <div
            ref={leftPageRef}
            className={`relative flex-1 h-full bg-parchment-paper rounded-l-lg overflow-y-auto parchment-scroll shadow-inner ${
              isMobile ? "rounded-lg" : "page-shadow-left"
            }`}
          >
            {/* Page Content */}
            <div
              className={`w-full h-full transition-opacity duration-300 ${
                isFlipping ? "opacity-30" : "opacity-100"
              }`}
            >
              {pages[leftPageIdx]?.component}
            </div>
          </div>

          {/* Right Page (Desktop Spread only) */}
          {!isMobile && (
            <div
              ref={rightPageRef}
              className="relative flex-1 h-full bg-parchment-paper rounded-r-lg overflow-y-auto parchment-scroll shadow-inner page-shadow-right"
            >
              {/* Page Content */}
              <div
                className={`w-full h-full transition-opacity duration-300 ${
                  isFlipping ? "opacity-30" : "opacity-100"
                }`}
              >
                {rightPageIdx !== null && rightPageIdx < totalPages
                  ? pages[rightPageIdx]?.component
                  : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-amber-900/40 p-8 text-center font-book">
                      <Sparkles className="w-10 h-10 mb-2 opacity-50" />
                      <span className="font-decorative text-lg">Finis Grimoire</span>
                      <p className="text-xs font-heading mt-1">End of Current Chronicles</p>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* 3D Physical Book Page Stack Edges (Gilded Deckle Edge Thickness) */}
          {!isMobile && (
            <>
              {/* Left Page Stack Thickness */}
              <div
                className="absolute -left-2.5 top-3 bottom-3 w-2.5 rounded-l shadow-md"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #d4af37 0px, #d4af37 1px, #78350f 1px, #78350f 2px)",
                }}
              />
              {/* Right Page Stack Thickness */}
              <div
                className="absolute -right-2.5 top-3 bottom-3 w-2.5 rounded-r shadow-md"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #d4af37 0px, #d4af37 1px, #78350f 1px, #78350f 2px)",
                }}
              />
            </>
          )}
        </div>
      </main>

      {/* 3. Footer Navigation: Prev/Next & Page Numbers */}
      <footer className="relative z-30 w-full px-4 py-2.5 sm:py-3 bg-stone-950/90 border-t border-amber-900/50 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          aria-label="Previous Page"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-900/70 bg-stone-900 text-amber-200 hover:text-amber-100 hover:border-amber-500 disabled:opacity-40 disabled:pointer-events-none transition-all text-xs font-heading font-semibold"
        >
          <ChevronLeft className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Previous Page</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-heading font-bold text-xs sm:text-sm text-amber-200 tracking-wider">
            {isMobile
              ? `Page ${currentPage + 1} of ${totalPages}`
              : `Pages ${leftPageIdx + 1} & ${Math.min((rightPageIdx ?? leftPageIdx) + 1, totalPages)} of ${totalPages}`}
          </span>
          <span className="text-[10px] text-amber-300/60 font-sans hidden sm:inline">
            Scroll inside pages to read • Use arrow keys ← → or buttons to turn pages
          </span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={
            (isMobile ? currentPage >= totalPages - 1 : (rightPageIdx ?? currentPage) >= totalPages - 1) ||
            isFlipping
          }
          aria-label="Next Page"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-900/70 bg-stone-900 text-amber-200 hover:text-amber-100 hover:border-amber-500 disabled:opacity-40 disabled:pointer-events-none transition-all text-xs font-heading font-semibold"
        >
          <span className="hidden sm:inline">Next Page</span>
          <ChevronRight className="w-4 h-4 text-amber-400" />
        </button>
      </footer>
    </div>
  );
}
