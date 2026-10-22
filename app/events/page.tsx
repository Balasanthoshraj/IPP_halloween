/* eslint-disable @next/next/no-img-element -- two pre-sized webp plates in public/art/events */
import type { Metadata } from "next";
import { preload } from "react-dom";
import Transition from "../Transition";
import Explorer from "./Explorer";
import { chakra, pirata, teko } from "./fonts";
import "./events.css";

export const metadata: Metadata = {
  title: "Events · ISTA presents i++26",
  description:
    "Explore the technical and non-technical events at ISTA presents i++26, including competitions, games, and online chess on 23 and 24 October.",
};

const BG = "/art/events/bg.webp";
const BLUR = "/art/events/bg-blur.webp";

export default function Events() {
  preload(BG, { as: "image", fetchPriority: "high" });
  preload(BLUR, { as: "image" });

  return (
    <Transition>
      <main className={`page ev ${teko.variable} ${chakra.variable} ${pirata.variable}`}>
        <img className="ev-bg" src={BG} alt="" decoding="async" fetchPriority="high" />
        <img className="ev-blur" src={BLUR} alt="" decoding="async" />
        <div className="ev-glass" aria-hidden="true" />
        <Explorer />
      </main>
    </Transition>
  );
}
