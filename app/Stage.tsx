"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { LAYERS, camera, layerPose, poseCss } from "./scene/camera";
import { createRenderer } from "./scene/render";
import { clamp, smoothstep } from "./scene/util";

const titleDef = LAYERS.find((l) => l.id === "title")!;

// Tall scroller with a sticky stage. Scroll drives the camera, the mouse nudges it, and the scene
// (one canvas) is redrawn every frame; the title is plain HTML on top.
export default function Stage({ children }: { children: ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scroller.current!;
    const stage = root.firstElementChild as HTMLElement;
    const canvas = stage.querySelector("canvas")!;
    const title = stage.querySelector<HTMLElement>("[data-layer=title]")!;
    const ttl = stage.querySelector<HTMLElement>(".ttl")!;
    const hint = stage.querySelector<HTMLElement>(".hint")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: Awaited<ReturnType<typeof createRenderer>> | undefined;
    let alive = true;
    let target = 1;
    let p = 1;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let last = 0;
    let busyUntil = 0;
    let half = false;
    let quality = 1;
    let avg = 1 / 60;
    let counted = 0;
    let navOn = false;
    let onScreen = true; // the loop sleeps while the stage is scrolled out of view (the sponsors are below it)

    const fit = () => renderer?.resize(stage.clientWidth, stage.clientHeight, quality);
    const measure = () => {
      const span = root.offsetHeight - innerHeight;
      target = still || span <= 0 ? 1 : clamp(-root.getBoundingClientRect().top / span);
    };
    // the nav follows the last title line (fully in at 0.92); the gap keeps it from flickering at the edge
    const land = (at: number) => {
      const landed = at > (navOn ? 0.9 : 0.925);
      if (landed !== navOn) {
        navOn = landed;
        document.documentElement.toggleAttribute("data-nav", navOn);
      }
    };
    const paint = (now: number) => {
      renderer!.draw({ t: still ? 0 : now / 1000, p, mx, my, hand: smoothstep(0.52, 0.8, p) });
      title.style.transform = poseCss(layerPose(titleDef, camera(p), mx, my));
      ttl.style.setProperty("--t1", smoothstep(0.7, 0.8, p).toFixed(3));
      ttl.style.setProperty("--t2", smoothstep(0.75, 0.85, p).toFixed(3));
      ttl.style.setProperty("--t3", smoothstep(0.8, 0.92, p).toFixed(3));
      hint.style.setProperty("--hint", (1 - smoothstep(0, 0.06, p)).toFixed(3));
      land(p);
    };
    const tick = (now: number) => {
      raf = onScreen ? requestAnimationFrame(tick) : 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      p += (target - p) * (1 - Math.exp(-dt * 7));
      mx += (tx - mx) * (1 - Math.exp(-dt * 4));
      my += (ty - my) * (1 - Math.exp(-dt * 4));
      const moving = Math.abs(target - p) + Math.abs(tx - mx) + Math.abs(ty - my) > 0.0006;
      if (moving) busyUntil = now + 1500;
      else if (now > busyUntil && (half = !half)) return; // idle: ambient motion at half rate
      paint(now);
      if (moving) {
        // too slow? shrink the canvas rather than drop frames
        avg += (dt - avg) * 0.08;
        if (++counted > 90 && avg > 0.03 && quality > 0.55) {
          quality *= 0.8;
          fit();
          counted = 0;
          avg = 1 / 60;
        }
      }
    };
    const onScroll = () => measure();
    const onResize = () => {
      fit();
      measure();
      if (still && renderer) {
        p = target;
        paint(0);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (still) return;
      tx = (e.clientX / innerWidth - 0.5) * 2;
      ty = (e.clientY / innerHeight - 0.5) * 2;
    };

    measure();
    land(target); // arriving at the finished title (Home from another page): the nav is there before the scene has loaded

    createRenderer(canvas).then((r) => {
      if (!alive) return;
      renderer = r;
      fit();
      measure();
      p = target; // start where the page was restored, no sweep
      paint(performance.now());
      stage.classList.add("ready");
      if (!still) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    // (isIntersecting stays true while the stage's edge merely touches the screen, which is exactly where the page ends)
    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.intersectionRatio > 0;
        if (onScreen && renderer && !still && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: [0, 0.001] },
    );
    visibility.observe(stage);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      alive = false;
      visibility.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeAttribute("data-nav");
    };
  }, []);

  return (
    <div className="scroller" ref={scroller}>
      <div className="stage">
        <canvas className="art" aria-hidden="true" />
        <div className="world">{children}</div>
        <div className="vignette" />
        <p className="hint" aria-hidden="true">
          Scroll
        </p>
        <noscript>
          <style>{".art{opacity:1}"}</style>
        </noscript>
      </div>
      <span id="home" className="home-anchor" />
    </div>
  );
}
