/* eslint-disable @next/next/no-img-element -- one pre-sized webp plate in public/art/sponsors */
import type { Metadata } from "next";
import { preload } from "react-dom";
import { pirata } from "./fonts";
import Sponsors from "./Sponsors";

export const metadata: Metadata = {
  title: "Sponsors · ISTA presents i++26",
};

const BG = "/art/sponsors/bg.webp";

// The sponsors' own page: four lanyards hanging in a cave whose arch already carries the title (on a phone, four cards in a
// column instead). Not wrapped in <Transition>, since on a tall screen the page scrolls (see sponsors.css).
export default function SponsorsPage() {
  preload(BG, { as: "image", fetchPriority: "high" });

  return (
    <main className={`sp-page ${pirata.variable}`}>
      <img className="sp-bg" src={BG} alt="" decoding="async" fetchPriority="high" />
      <Sponsors />
    </main>
  );
}
