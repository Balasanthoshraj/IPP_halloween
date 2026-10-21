"use client";
/* eslint-disable @next/next/no-img-element -- fixed, pre-sized art in public/art/about; next/image would only re-encode it */

import { useEffect, useRef, useState } from "react";
import { CLOSED, GLOWS, OPEN, PAGE, REST, SCENE, SRC, TEXT } from "./art";
import "./about.css";

// The About page: a closed spell book on a lectern in the castle. Click it and it lifts, swings open and the cover and a leaf turn
// to the first spread, ISTA; the arrows turn the next leaf over to the second, I++. Each section's text runs across the two pages
// of its spread. Click anywhere outside the book and it closes again.
// One clock `u` (0 closed .. 1 open) drives the opening, and another, `v` (0 .. 1), the turn of the second leaf, so the animation
// can be reversed or interrupted at any frame.

type Phase = "closed" | "opening" | "open" | "closing";

const ISTA = [
  "Department of Information Science and Technology is one of the youngest and fastest growing departments of Anna University.",
  "Under this department, we, ISTA, are a staff-student run body striving to work hard for the betterment of our department, host various technical symposiums and represent IST in various activities.",
  "We also aim at guiding students across all years with a variety of matters, for a better tomorrow.",
];
const IPP = [
  "Held every year in the odd semester, I++ is the intra-college symposium held by ISTA.",
  "With a footfall of about 800 odd students every year, we strive hard to do our part in bringing together the student community of not just our department, but the entire community at the College of Engineering, Guindy.",
];
const ISTA_URL = "https://istaceg.in/";

const LEAF_W = 645; // a turning leaf spans from the hinge to the right edge of the right page
const OPEN_MS = 2600;
const CLOSE_MS = 1500;
const TURN_MS = 1000; // the second leaf turning over
const READY_MS = 2500; // the book and its hint are shown by this long after the page mounts, whatever is still decoding or warming up
const GAP = 80; // between a section's two columns (only the width of the strip they are laid out in)

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (u: number, a: number, b: number) => clamp01((u - a) / (b - a));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// CSS-style cubic-bezier easing
const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t: number) => ((ax * t + bx) * t + cx) * t;
  const Y = (t: number) => ((ay * t + by) * t + cy) * t;
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = X(t) - x;
      const d = dX(t);
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return Y(clamp01(t));
  };
};
const lift = bezier(0.32, 0.72, 0, 1); // Apple's "sheet" curve
const swing = bezier(0.5, 0.05, 0.4, 1);
const turn = bezier(0.45, 0.05, 0.35, 1);
const soft = bezier(0.4, 0, 0.2, 1);

// open-book units -> a length that scales with the book (--px is set on .gr-book)
const px = (n: number) => `calc(${n} * var(--px))`;

// One page's window onto a section's text. The text is laid out once in two balanced columns, and the page on the left of the
// spread shows the first column, the page on the right the second (each page draws the whole text and clips to its column).
// `spread` and `side` tell the reveal in apply() when to fade it in.
function Flow({ spread, side, x, w, h, title, paras, link }: { spread: 0 | 1; side: 0 | 1; x: number; w: number; h: number; title: string; paras: string[]; link?: string }) {
  return (
    <div className="gr-flow" aria-hidden="true" data-s={spread} data-side={side} style={{ left: px(x), top: px(TEXT.left.y), width: px(w), height: px(h) }}>
      <div className="gr-cols" style={{ left: px(-side * (w + GAP)), width: px(2 * w + GAP), columnGap: px(GAP) }}>
        <h2 className="gr-h">{title}</h2>
        {paras.map((t, i) => (
          <p className="gr-p" key={i}>
            {t}
          </p>
        ))}
        {link && (
          <p className="gr-p gr-link">
            <a href={link} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
              {link}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

const sprite = (s: { x: number; y: number; w: number; h: number }, left: number) => ({ left: px(left), top: px(s.y), width: px(s.w), height: px(s.h) });

export default function Grimoire() {
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("closed");
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(0); // the page in view, 0..3: a phone steps through all four, a wide screen shows a spread at a time (0 or 2)
  const [lastPage, setLastPage] = useState(2);
  const ctl = useRef<{ open(): void; close(): void; step(d: number): void }>({ open() {}, close() {}, step() {} });

  useEffect(() => {
    const el = root.current!;
    const q = (sel: string) => el.querySelector<HTMLElement>(sel)!;
    const book = q(".gr-book"), dim = q(".gr-dim"), base = q(".gr-base"), hit = q(".gr-hit");
    const flips = [q(".gr-cover"), q(".gr-leaf1"), q(".gr-leaf2")];
    const faces = flips.map((f) => [...f.querySelectorAll<HTMLElement>(".gr-face")]);
    const reveal = [...el.querySelectorAll<HTMLElement>("[data-s]")].map((n) => ({ n, spread: Number(n.dataset.s), side: Number(n.dataset.side) }));
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ac = new AbortController();
    const { signal } = ac;

    const g = { vw: 0, vh: 0, S: 1, ox: 0, oy: 0, k: 1, phone: false };
    let u = 0, target = 0, v = 0, vTo = 0, hover = 0, hoverTo = 0, pan = 0, panTo = 0, raf = 0, last = 0, cur = 0;
    let state: Phase = "closed";
    let warming = false;
    let cancelled = false;
    let shown = false;
    const settle = (p: Phase) => { state = p; setPhase(p); };

    const measure = () => {
      g.vw = el.clientWidth;
      g.vh = el.clientHeight;
      g.S = Math.max(g.vw / SCENE.w, g.vh / SCENE.h);
      g.ox = (g.vw - SCENE.w * g.S) / 2;
      g.oy = (g.vh - SCENE.h * g.S) / 2;
      g.phone = g.vw < 800 || g.vw / g.vh < 1.1;
      // k = css pixels per open-book unit when fully open; phones fit one page across the screen
      g.k = g.phone ? Math.min((0.96 * g.vw) / 640, (0.86 * g.vh) / 860) : Math.min((0.94 * g.vw) / 1524, (0.82 * g.vh) / 1002); // 0.82: room below for "Tap to close"
      book.style.setProperty("--k", String(g.k));
    };

    // centre of the closed book inside the group, in open-book units
    const cc = { x: OPEN.hinge + (-CLOSED.hinge + CLOSED.w / 2) * CLOSED.k, y: 18 + (-CLOSED.top + CLOSED.bodyH / 2) * CLOSED.k };
    const closedW = CLOSED.w * CLOSED.k;
    const closedH = CLOSED.bodyH * CLOSED.k;

    const apply = () => {
      const { vw, vh, k, S } = g;
      // key poses: translate (x, y) in css px and scale s (relative to the group's open size)
      const restW = Math.min(REST.width * S, 0.8 * vw);
      const s0 = restW / (closedW * k);
      const k0 = { x: g.ox + REST.x * S - cc.x * k * s0, y: g.oy + REST.y * S - cc.y * k * s0, s: s0 };
      const s1 = Math.min((0.58 * vh) / (closedH * k), (0.8 * vw) / (closedW * k));
      const k1 = { x: vw / 2 - cc.x * k * s1, y: vh / 2 - cc.y * k * s1, s: s1 };
      const pageX = (p: number) => (p ? PAGE.right.x + PAGE.right.w / 2 : PAGE.left.x + PAGE.left.w / 2);
      const ax = g.phone ? mix(pageX(0), pageX(1), pan) : OPEN.hinge;
      const ay = g.phone ? PAGE.left.y + PAGE.left.h / 2 : OPEN.h / 2;
      const k2 = { x: vw / 2 - ax * k, y: vh / 2 - ay * k, s: 1 };

      const tLift = lift(seg(u, 0, 0.28));
      const tShift = swing(seg(u, 0.2, 0.54));
      const tCover = swing(seg(u, 0.22, 0.52));
      const tL1 = turn(seg(u, 0.48, 0.68));
      const tL2 = turn(v); // the second leaf is turned by the arrows, not by opening the book

      const rest = 1 - tLift;
      const hv = hover * rest;
      const x = warming ? k2.x : mix(mix(k0.x, k1.x, tLift), k2.x, tShift);
      const y = warming ? k2.y : mix(mix(k0.y, k1.y, tLift), k2.y, tShift) - 10 * hv;
      const s = warming ? 1 : mix(mix(k0.s, k1.s, tLift), k2.s, tShift) * (1 + 0.03 * hv);
      // lying on the lectern the book is tilted with strong perspective; the tilt unwinds as it lifts
      const tilt = rest > 0.002 && !warming
        ? ` translate(${cc.x * k}px, ${cc.y * k}px) perspective(${REST.persp / s}px) rotateX(${REST.tilt * rest}deg) scaleY(${1 + (REST.stretch - 1) * rest}) translate(${-cc.x * k}px, ${-cc.y * k}px)`
        : "";
      book.style.transform = `translate3d(${x}px, ${y}px, 0) scale3d(${s}, ${s}, ${s})${tilt}`;

      dim.style.opacity = String(soft(seg(u, 0, 0.32)));
      base.style.opacity = String(seg(u, 0.215, 0.27));

      // the cover and two leaves turn about the hinge; each is a hair above the one below so they stack like paper
      [[tCover, 6], [tL1, 4], [tL2, 2]].forEach(([t, z], i) => {
        const a = 180 * t;
        flips[i].style.transform = `rotateY(${-a}deg) translateZ(${z}px)`;
        const b = (1 - 0.5 * Math.sin((a * Math.PI) / 180)).toFixed(3);
        faces[i].forEach((f) => (f.style.filter = a > 0.01 && a < 179.99 ? `brightness(${b})` : ""));
        // only the face that shows is drawn and hit-tested (the closed book's picture is wider than the spread)
        faces[i][0].style.visibility = a > 90 ? "hidden" : "visible";
        faces[i][1].style.visibility = a < 90 ? "hidden" : "visible";
      });

      // the first spread's text arrives as the book finishes opening, the second's as its leaf lands; the left page a beat ahead
      reveal.forEach(({ n, spread, side }) => {
        const t = spread === 0 ? soft(seg(u, 0.75 + side * 0.04, 0.88 + side * 0.04)) : soft(seg(v, 0.55 + side * 0.08, 0.8 + side * 0.08));
        n.style.opacity = String(t);
        n.style.transform = `translateY(${(1 - t) * 8}px)`;
      });
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      v = vTo > v ? Math.min(vTo, v + (dt * 1000) / TURN_MS) : Math.max(vTo, v - (dt * 1000) / TURN_MS);
      if (!(target < u && v > 0)) {
        // (a leaf turned onto the left is put back first, before the book closes)
        const rate = target > u ? 1000 / OPEN_MS : 1000 / CLOSE_MS;
        u = target > u ? Math.min(target, u + rate * dt) : Math.max(target, u - rate * dt);
      }
      hover += (hoverTo - hover) * (1 - Math.exp(-dt * 9));
      pan += (panTo - pan) * (1 - Math.exp(-dt * 7));
      if (u === target && state !== (target ? "open" : "closed")) settle(target ? "open" : "closed");
      if (u === target && v === vTo && Math.abs(hoverTo - hover) < 0.002 && Math.abs(panTo - pan) < 0.002) {
        hover = hoverTo;
        pan = panTo;
        cancelAnimationFrame(raf);
        raf = 0;
      }
      apply();
    };
    const run = () => {
      if (still) {
        u = target;
        v = vTo;
        pan = panTo;
        apply();
        settle(target ? "open" : "closed");
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    // ends the invisible warm-up (the book is wanted now) and puts the closed book back
    const endWarm = () => {
      if (!warming) return;
      warming = false;
      if (state === "closed") u = v = 0;
      apply();
      delete el.dataset.warm;
    };
    // fades the book and its hint in and lets it be opened
    const show = () => {
      if (shown || cancelled) return;
      shown = true;
      endWarm();
      setReady(true);
    };

    // the page in view, 0..3: the second leaf has turned for 2 and 3, and on a phone the left page is 0 and 2, the right 1 and 3
    const go = (p: number) => {
      cur = p;
      setPage(p);
      vTo = p >= 2 ? 1 : 0;
      panTo = p % 2;
      run();
    };
    ctl.current = {
      open() { if (state === "closed" || state === "closing") { show(); target = 1; cur = 0; vTo = 0; panTo = 0; setPage(0); setLastPage(g.phone ? 3 : 2); settle("opening"); run(); } },
      close() { if (state === "open" || state === "opening") { target = 0; vTo = 0; settle("closing"); run(); } },
      step(d) {
        if (state !== "open") return;
        const to = Math.min(g.phone ? 3 : 2, Math.max(0, g.phone ? cur + d : (cur >> 1) * 2 + 2 * d)); // a spread at a time, unless only a page fits
        if (to !== cur) go(to);
      },
    };

    const over = (on: boolean) => { hoverTo = on ? 1 : 0; if (u === 0) run(); };
    hit.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") over(true); }, { signal });
    hit.addEventListener("pointerleave", () => over(false), { signal });
    hit.addEventListener("focus", () => over(true), { signal });
    hit.addEventListener("blur", () => over(false), { signal });
    addEventListener(
      "resize",
      () => {
        measure();
        apply();
        setLastPage(g.phone ? 3 : 2);
        if (state === "open" && !g.phone && cur % 2) go(cur - 1); // a screen that shows spreads has no half-way page
      },
      { signal },
    );
    addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") ctl.current.close();
        else if (e.key === "ArrowRight") ctl.current.step(1);
        else if (e.key === "ArrowLeft") ctl.current.step(-1);
      },
      { signal },
    );
    // swiping turns pages on phones
    let sx = 0, sy = 0;
    el.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; }, { signal });
    el.addEventListener("pointerup", (e) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (g.phone && state === "open" && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) ctl.current.step(dx < 0 ? 1 : -1);
    }, { signal });

    // Paint every layer once, at full size and invisibly, before the book is shown: otherwise each picture is decoded,
    // uploaded and rasterised the first time it appears, in the middle of the animation.
    const frame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const warm = async () => {
      el.dataset.warm = "";
      warming = true;
      for (const at of [0.26, 1]) {
        if (!warming || cancelled) break; // cut short by endWarm
        u = at;
        v = at; // the second leaf too, turned over on the last frame
        apply();
        await frame();
      }
      endWarm();
    };

    measure();
    apply();
    // Each wait below is capped, and the timer shows the book regardless: on a slow machine the decoding, the page transition and
    // the warm-up together can take many seconds, and until then the book is invisible and the hint absent.
    const within = (p: Promise<unknown> | undefined, ms: number) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
    const timer = setTimeout(show, READY_MS);
    within(Promise.all(Object.values(SRC).map((src) => { const im = new Image(); im.src = src; return im.decode().catch(() => {}); })), 1500)
      .then(() => (still || shown ? undefined : within((document as Document & { activeViewTransition?: { finished: Promise<unknown> } }).activeViewTransition?.finished.catch(() => {}), 1200))) // let the page transition finish first
      .then(() => (still || shown ? undefined : warm()))
      .then(show);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      ac.abort();
    };
  }, []);

  const hitBox = { left: ((REST.x - 330) / SCENE.w) * 100, top: ((REST.y - 260) / SCENE.h) * 100, width: (660 / SCENE.w) * 100, height: (560 / SCENE.h) * 100 };
  const backLeft = PAGE.left.x - (OPEN.hinge - LEAF_W); // the back of a leaf is mirrored, so its content sits `hinge - LEAF_W` to the left
  const textLeft = TEXT.left.x - (OPEN.hinge - LEAF_W);
  const { w: tw, h: th } = TEXT.left;

  return (
    <section ref={root} className="gr" data-phase={phase} data-ready={ready || undefined}>
      <h1 className="sr-only">About ISTA</h1>
      <article className="sr-only">
        <h2>ISTA</h2>
        <p>{ISTA.join(" ")}</p>
        <p>
          <a href={ISTA_URL} target="_blank" rel="noopener noreferrer">
            {ISTA_URL}
          </a>
        </p>
        <h2>I++</h2>
        <p>{IPP.join(" ")}</p>
      </article>

      <div className="gr-stage" aria-hidden="true">
        <img className="gr-scene" src={SRC.scene} alt="" decoding="async" />
        {GLOWS.map((gl, i) => (
          <span
            key={i}
            className="gr-glow"
            style={{ left: `${(gl.x / SCENE.w) * 100}%`, top: `${(gl.y / SCENE.h) * 100}%`, width: `${((gl.r * 2) / SCENE.w) * 100}%`, animationDelay: `${-i * 0.7}s`, animationDuration: `${2.4 + (i % 3) * 0.7}s` }}
          />
        ))}
        <img className="gr-dim" src={SRC.dim} alt="" decoding="async" />
      </div>

      <div className="gr-backdrop" onClick={() => ctl.current.close()} />

      <div className="gr-cam" aria-hidden="true">
        <div className="gr-book">
          {/* the second spread's right page (and the right cover) */}
          <div className="gr-base">
            <img className="gr-img" src={SRC.open} alt="" style={{ left: 0, top: 0, width: px(OPEN.w), height: px(OPEN.h) }} />
            <Flow spread={1} side={1} x={TEXT.right.x} w={tw} h={th} title="I++" paras={IPP} />
          </div>

          {/* the second leaf: the first spread's right page, and on its back the second spread's left */}
          <div className="gr-flip gr-leaf2" style={{ left: px(OPEN.hinge), width: px(LEAF_W) }}>
            <div className="gr-face">
              <img className="gr-img" src={SRC.pageR} alt="" style={sprite(PAGE.right, PAGE.right.x - OPEN.hinge)} />
              <Flow spread={0} side={1} x={TEXT.right.x - OPEN.hinge} w={tw} h={th} title="ISTA" paras={ISTA} link={ISTA_URL} />
            </div>
            <div className="gr-face gr-back">
              <img className="gr-img" src={SRC.pageL} alt="" style={sprite(PAGE.left, backLeft)} />
              <Flow spread={1} side={0} x={textLeft} w={tw} h={th} title="I++" paras={IPP} />
            </div>
          </div>

          {/* the first leaf: turned with the cover when the book opens; its back is the first spread's left page */}
          <div className="gr-flip gr-leaf1" style={{ left: px(OPEN.hinge), width: px(LEAF_W) }}>
            <div className="gr-face">
              <img className="gr-img" src={SRC.leafArt} alt="" style={sprite(PAGE.right, PAGE.right.x - OPEN.hinge)} />
            </div>
            <div className="gr-face gr-back">
              <img className="gr-img" src={SRC.pageL} alt="" style={sprite(PAGE.left, backLeft)} />
              <Flow spread={0} side={0} x={textLeft} w={tw} h={th} title="ISTA" paras={ISTA} link={ISTA_URL} />
            </div>
          </div>

          <div className="gr-flip gr-cover" style={{ left: px(OPEN.hinge), width: px(OPEN.hinge) }}>
            <div className="gr-face">
              <img
                className="gr-img"
                src={SRC.closed}
                alt=""
                style={{ left: px(-CLOSED.hinge * CLOSED.k), top: px(18 - CLOSED.top * CLOSED.k), width: px(CLOSED.w * CLOSED.k), height: px(CLOSED.h * CLOSED.k) }}
              />
            </div>
            <div className="gr-face gr-back">
              <img className="gr-img" src={SRC.coverBack} alt="" style={{ left: 0, top: 0, width: px(OPEN.hinge), height: px(OPEN.h) }} />
            </div>
          </div>
        </div>
      </div>

      <div className="gr-stage gr-ui">
        <button
          type="button"
          className="gr-hit"
          aria-label="Open the book about ISTA"
          aria-expanded={phase !== "closed"}
          style={{ left: `${hitBox.left}%`, top: `${hitBox.top}%`, width: `${hitBox.width}%`, height: `${hitBox.height}%` }}
          onClick={() => ctl.current.open()}
        />
      </div>

      <p className="gr-hint" aria-hidden="true">
        Tap on the book
      </p>

      {/* while the book is open: "Tap to close", with an arrow either side to turn the page */}
      <div className="gr-bar" data-show={phase === "opening" || phase === "open" || undefined}>
        <button type="button" className="gr-arrow" aria-label="Previous page" aria-disabled={phase !== "open" || page === 0} onClick={() => ctl.current.step(-1)}>
          ‹
        </button>
        <button
          type="button"
          className="gr-close"
          onClick={() => {
            ctl.current.close();
            root.current?.querySelector<HTMLElement>(".gr-hit")?.focus({ preventScroll: true }); // this button is about to hide
          }}
        >
          Tap to close
        </button>
        <button type="button" className="gr-arrow" aria-label="Next page" aria-disabled={phase !== "open" || page >= lastPage} onClick={() => ctl.current.step(1)}>
          ›
        </button>
      </div>
    </section>
  );
}
