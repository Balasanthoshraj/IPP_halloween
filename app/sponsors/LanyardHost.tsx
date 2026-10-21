"use client";

import { useEffect, useRef } from "react";
import { SPONSORS } from "./data";

// A phone gets the cards instead of the lanyards, so no board is built for it. This is the query sponsors.css switches on too.
const PHONE = "(max-width: 759px)";

// Builds the lanyard board (and loads three.js for it) only once the section is about to scroll into view, and not at all on a
// phone (a window that is resized across that width drops or builds it). Until then, and if WebGL is not available, the section
// just holds its plain sponsor list.
export default function LanyardHost() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const section = el.closest("section");
    const phone = matchMedia(PHONE);
    let stop: (() => void) | null = null;

    const start = () => {
      stop?.();
      stop = null;
      section?.removeAttribute("data-fallback");
      if (phone.matches) return;

      let board: { dispose: () => void } | null = null;
      let stopped = false;
      const fallback = () => section?.setAttribute("data-fallback", "");

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
      stop = () => {
        stopped = true;
        io.disconnect();
        board?.dispose();
      };
    };

    start();
    phone.addEventListener("change", start);
    return () => {
      phone.removeEventListener("change", start);
      stop?.();
    };
  }, []);

  return <div className="sp-board" ref={host} aria-hidden="true" />;
}
