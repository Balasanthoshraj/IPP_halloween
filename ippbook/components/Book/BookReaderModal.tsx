"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { sound } from "@/ippbook/utils/soundEffects";
import { ChapterTitlePage } from "@/ippbook/components/Chapters/ChapterTitlePage";
import { ChapterDepartmentPart1, ChapterDepartmentPart2 } from "@/ippbook/components/Chapters/ChapterDepartment";
import { ChapterSymposiumPart1, ChapterSymposiumPart2 } from "@/ippbook/components/Chapters/ChapterSymposium";
import { ChapterEventsTechnical, ChapterEventsNonTechnical } from "@/ippbook/components/Chapters/ChapterEvents";
import { ChapterArchives2025, ChapterArchives2024 } from "@/ippbook/components/Chapters/ChapterArchives";
import { ChapterAchievementsPart1, ChapterAchievementsPart2 } from "@/ippbook/components/Chapters/ChapterAchievements";
import { ChapterNextTimeline, ChapterNextRegistration } from "@/ippbook/components/Chapters/ChapterNextChapter";

interface BookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export function BookReaderModal({ isOpen, onClose, initialPage = 0 }: BookReaderModalProps) {
  const bookContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageFlipInstanceRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleTurnNext = useCallback(() => {
    if (pageFlipInstanceRef.current) {
      pageFlipInstanceRef.current.flipNext();
      sound.playPageFlip();
    }
  }, []);

  const handleTurnPrev = useCallback(() => {
    if (pageFlipInstanceRef.current) {
      pageFlipInstanceRef.current.flipPrev();
      sound.playPageFlip();
    }
  }, []);

  const handleJumpToPage = useCallback((targetPage: number) => {
    if (pageFlipInstanceRef.current) {
      pageFlipInstanceRef.current.turnToPage(targetPage);
      sound.playPageFlip();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleTurnNext();
      } else if (e.key === "ArrowLeft") {
        handleTurnPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleTurnNext, handleTurnPrev, onClose]);

  // Responsive page width & height calculation
  const getBookDimensions = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const mobile = w < 768;
    setIsMobile(mobile);

    if (mobile) {
      const pageW = Math.min(w - 24, 400);
      const pageH = Math.min(h - 40, 580);
      return { width: pageW, height: pageH, portrait: true };
    } else {
      const pageW = Math.min(Math.floor((w - 90) / 2), 480);
      const pageH = Math.min(h - 48, 640);
      return { width: pageW, height: pageH, portrait: false };
    }
  }, []);

  // Initialize PageFlip instance
  useEffect(() => {
    if (!isOpen || !bookContainerRef.current) return;

    let destroyed = false;
    const { width, height, portrait } = getBookDimensions();

    const initFlip = async () => {
      try {
        const { PageFlip } = await import("page-flip");
        if (destroyed || !bookContainerRef.current) return;

        // Clean up previous instance if any
        if (pageFlipInstanceRef.current) {
          try {
            pageFlipInstanceRef.current.destroy();
          } catch {}
          pageFlipInstanceRef.current = null;
        }

        const pageFlip = new PageFlip(bookContainerRef.current, {
          width: width,
          height: height,
          size: "fixed",
          minWidth: 280,
          maxWidth: 550,
          minHeight: 420,
          maxHeight: 720,
          showCover: false,
          usePortrait: portrait,
          startPage: initialPage,
          drawShadow: true,
          flippingTime: 700,
          useMouseEvents: true,
          swipeDistance: 30,
          showPageCorners: true,
          maxShadowOpacity: 0.35,
        });

        const pages = bookContainerRef.current.querySelectorAll(".grimoire-page");
        if (pages.length > 0) {
          pageFlip.loadFromHTML(pages);
          pageFlipInstanceRef.current = pageFlip;

          pageFlip.on("flip", (e: { data: number }) => {
            sound.playPageFlip();
          });
        }
      } catch (err) {
        console.error("Failed to initialize PageFlip:", err);
      }
    };

    initFlip();

    return () => {
      destroyed = true;
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch {}
        pageFlipInstanceRef.current = null;
      }
    };
  }, [isOpen, initialPage, getBookDimensions]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Book pages. Drag page corners or use arrow keys to turn pages. Press Escape to close."
      className="page-only-reader fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden select-none animate-fadeIn cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dark Ambient Halloween Backdrop Lighting */}

      {/* Main Center Open Book Spread */}
      <main className="relative z-20 flex items-center justify-center p-2 sm:p-4 overflow-hidden cursor-default">
        {/* Book Outer Spine & Leather Trim Wrapper */}
        <div className="relative flex items-center justify-center">
          {/* Middle Spine Crease Gutter (Desktop two-page view only) */}
          {!isMobile && <div className="book-gutter-crease" />}

          {/* Book Inner Page Flip Canvas Mounting Element */}
          <div ref={bookContainerRef} className="relative overflow-hidden">
            {/* Page 0: Title & Frontispiece */}
            <div className="grimoire-page bg-parchment-paper page-shadow-left">
              <ChapterTitlePage onJumpToPage={handleJumpToPage} />
            </div>

            {/* Page 1: Chapter 1 - The Department Part 1 */}
            <div className="grimoire-page bg-parchment-paper page-shadow-right">
              <ChapterDepartmentPart1 />
            </div>

            {/* Page 2: Chapter 1 - The Department Part 2 */}
            <div className="grimoire-page bg-parchment-paper page-shadow-left">
              <ChapterDepartmentPart2 />
            </div>

            {/* Page 3: Chapter 2 - The Symposium Part 1 */}
            <div className="grimoire-page bg-parchment-paper page-shadow-right">
              <ChapterSymposiumPart1 />
            </div>

            {/* Page 4: Chapter 2 - The Symposium Part 2 */}
            <div className="grimoire-page bg-parchment-paper page-shadow-left">
              <ChapterSymposiumPart2 />
            </div>

            {/* Page 5: Chapter 3 - Events (Technical) */}
            <div className="grimoire-page bg-parchment-paper page-shadow-right">
              <ChapterEventsTechnical />
            </div>

            {/* Page 6: Chapter 3 - Events (Non-Tech & Esports) */}
            <div className="grimoire-page bg-parchment-paper page-shadow-left">
              <ChapterEventsNonTechnical />
            </div>

            {/* Page 7: Chapter 4 - Archives 2025 */}
            <div className="grimoire-page bg-parchment-paper page-shadow-right">
              <ChapterArchives2025 />
            </div>

            {/* Page 8: Chapter 4 - Archives 2024 */}
            <div className="grimoire-page bg-parchment-paper page-shadow-left">
              <ChapterArchives2024 />
            </div>

            {/* Page 9: Chapter 5 - Laurels & Achievements */}
            <div className="grimoire-page bg-parchment-paper page-shadow-right">
              <ChapterAchievementsPart1 />
            </div>

            {/* Page 10: Chapter 5 - Voices & Testimonials */}
            <div className="grimoire-page bg-parchment-paper page-shadow-left">
              <ChapterAchievementsPart2 />
            </div>

            {/* Page 11: Chapter 6 - Next Chapter Schedule */}
            <div className="grimoire-page bg-parchment-paper page-shadow-right">
              <ChapterNextTimeline />
            </div>

            {/* Page 12: Chapter 6 - Registration & Grand Seal */}
            <div className="grimoire-page bg-parchment-paper page-shadow-left">
              <ChapterNextRegistration />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
