"use client";
/* eslint-disable @next/next/no-img-element -- transparent, layered reference artwork */

import { useRef, type CSSProperties, type PointerEvent } from "react";
import styles from "./contact.module.css";

const art = "/art/contact/";
const notices = [
  { name: "email", text: "ista@auist.in", label: "Email ISTA at ista@auist.in", href: "mailto:ista@auist.in" },
  { name: "instagram", text: "@ista_ceg ↗", label: "ISTA CEG on Instagram", href: "https://www.instagram.com/ista_ceg/" },
  { name: "linkedin", text: "ISTA CEG ↗", label: "ISTA CEG on LinkedIn", href: "https://www.linkedin.com/company/ista-ceg/" },
];

function Artwork({ name, className }: { name: string; className?: string }) {
  return <img className={className} src={`${art}${name}.png`} alt="" draggable={false} />;
}

export default function ContactScene() {
  const scene = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty("--mx", `${((event.clientX - bounds.left) / bounds.width - .5) * 2}`);
    scene.current?.style.setProperty("--my", `${((event.clientY - bounds.top) / bounds.height - .5) * 2}`);
  }
  function reset() {
    scene.current?.style.setProperty("--mx", "0");
    scene.current?.style.setProperty("--my", "0");
  }
  return (
    <main className={styles.contact} onPointerMove={move} onPointerLeave={reset}>
      <h1 className={styles.srOnly}>Reach us · ISTA</h1>
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.haze} aria-hidden="true" />
      <div ref={scene} className={styles.scene}>
        <div className={styles.terrace} aria-hidden="true" />
        <div className={styles.ground} aria-hidden="true" />
        <div className={styles.supports} aria-hidden="true"><span /><span /></div>
        <div className={styles.board} aria-hidden="true">
          <Artwork name="board" className={styles.boardBase} />
          <Artwork name="board" className={styles.boardFrame} />
          <Artwork name="board" className={styles.boardTitle} />
        </div>
        {["left", "right"].map(side => (
          <div key={side} className={`${styles.lamp} ${styles[side]}`} aria-hidden="true">
            <span className={styles.halo} />
            <Artwork name="lamp" className={styles.pillar} />
            <Artwork name="lamp" className={styles.lantern} />
            <span className={styles.flame} />
          </div>
        ))}
        <div className={styles.notices}>
          {notices.map((notice, index) => (
            <a key={notice.name} href={notice.href} aria-label={notice.label} title={notice.label}
              target={notice.name === "email" ? undefined : "_blank"}
              rel={notice.name === "email" ? undefined : "noopener noreferrer"}
              className={`${styles.notice} ${styles[notice.name]}`}
              style={{ "--angle": `${[-5, 2, -2][index]}deg`, "--depth": `${36 + index * 14}px` } as CSSProperties}>
              <Artwork name={notice.name} className={styles.paper} />
              <Artwork name={notice.name} className={styles.pin} />
              <span className={styles.linkLabel}>{notice.text}</span>
            </a>
          ))}
        </div>
        <p className={styles.caption}>A message away. Even after midnight.</p>
      </div>
    </main>
  );
}
