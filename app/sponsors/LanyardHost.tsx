"use client";

import { useEffect, useRef } from "react";
import { SPONSORS } from "./data";

// Builds the lanyard board (and loads three.js for it) only once the section is about to scroll into view. Until then, and
// if WebGL is not available, the section just holds its plain sponsor list.
export default function LanyardHost() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    let board: { dispose: () => void } | null = null;
    let stopped = false;
    const fallback = () => el.closest("section")?.setAttribute("data-fallback", "");

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("./board")
          .then(({ createBoard }) => createBoard(el, SPONSORS))
          .then((b) => {
            if (!b) fallback();
            else if (stopped) b.dispose();
            else board = b;
          })
          .catch(fallback);
      },
      { rootMargin: "60% 0px" }, // a little ahead of the screen, so it is ready on arrival
    );
    io.observe(el);

    return () => {
      stopped = true;
      io.disconnect();
      board?.dispose();
    };
  }, []);

  return <div className="sp-board" ref={host} aria-hidden="true" />;
}
