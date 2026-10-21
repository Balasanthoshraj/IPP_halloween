/* eslint-disable @next/next/no-img-element -- two pre-sized webp files in public/art/contact */
import type { Metadata } from "next";
import { preload } from "react-dom";
import { REACH, TEAM } from "./data";
import { chakra, mono, pirata } from "./fonts";
import Reveal from "./Reveal";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact · ISTA presents i++26",
};

const BG = "/art/contact/bg.webp";
const CARD = "/art/contact/card.webp";

// 9876543210 -> "98765 43210", the way the card shows it
const shown = (phone: string) => `${phone.slice(0, 5)} ${phone.slice(5)}`;

export default function Contact() {
  preload(BG, { as: "image", fetchPriority: "high" });
  preload(CARD, { as: "image", fetchPriority: "high" });

  return (
    <main className={`tm ${pirata.variable} ${chakra.variable} ${mono.variable}`}>
      <img className="tm-bg" src={BG} alt="" decoding="async" fetchPriority="high" />
      <header className="tm-head">
        <h1>Contact</h1>
        <div className="tm-rule" aria-hidden="true">
          <i />
        </div>
        <p>&quot;Join the loop. Be part of infinity.&quot;</p>
      </header>
      <Reveal>
        {TEAM.map(({ name, role, phone }) => (
          <li className="tm-item" data-reveal="pending" key={name}>
            <div className="tm-card">
              <img className="tm-frame" src={CARD} alt="" width={1548} height={412} decoding="async" />
              <h2 className="tm-name">{name}</h2>
              <p className="tm-role">{role}</p>
              <a className="tm-tel" href={`tel:+91${phone}`} aria-label={`Call ${name} on ${shown(phone)}`}>
                {shown(phone)}
              </a>
            </div>
          </li>
        ))}
        <li className="tm-item tm-sign" data-reveal="pending">
          <div className="tm-card">
            <img className="tm-frame" src={REACH.src} alt="Reach us" width={REACH.width} height={REACH.height} loading="lazy" decoding="async" />
            {REACH.notes.map(({ name, href, box: [left, top, width, height] }) => {
              const web = href.startsWith("http");
              return (
                <a
                  className="tm-note"
                  key={href}
                  href={href}
                  aria-label={web ? `${name} (opens in a new tab)` : name}
                  {...(web && { target: "_blank", rel: "noopener noreferrer" })}
                  style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                />
              );
            })}
          </div>
        </li>
      </Reveal>
      <noscript>
        <style>{`.tm-item[data-reveal] .tm-card{clip-path:none}`}</style>
      </noscript>
    </main>
  );
}
