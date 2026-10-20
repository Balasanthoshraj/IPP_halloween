/* eslint-disable @next/next/no-img-element -- pre-sized webp cards in public/art/events */
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { EventInfo } from "./data";
import { Calendar, Chevron, Pin } from "./icons";

// DiMaac's ExpandablePanel (npx dimaac add ExpandablePanel), ported from Tailwind to this site's plain CSS (events.css): a row of
// panels where the clicked one opens wide and the others narrow to strips, and a press outside folds it back. Here the panels are
// event cards, and a second click on the open one opens the event itself.
export default function ExpandablePanel({
  events,
  paused,
  onOpen,
}: {
  events: readonly EventInfo[];
  paused: boolean; // the event popup is up, so presses on it are not "outside"
  onOpen: (event: EventInfo) => void;
}) {
  const [open, setOpen] = useState(-1);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (paused) return;
    const fold = (e: PointerEvent) => {
      if (!ref.current!.contains(e.target as Node)) setOpen(-1);
    };
    document.addEventListener("pointerdown", fold);
    return () => document.removeEventListener("pointerdown", fold);
  }, [paused]);

  return (
    <ul className="ev-list" ref={ref} style={{ "--n": events.length } as CSSProperties}>
      {events.map((e, i) => {
        const on = i === open;
        return (
          <li className="ev-slot" key={e.slug} data-open={on || undefined} style={{ "--i": i, "--a": e.accent } as CSSProperties}>
            <button className="ev-card" aria-expanded={on} aria-haspopup={on ? "dialog" : undefined} onClick={() => (on ? onOpen(e) : setOpen(i))}>
              <img className="ev-art" src={`/art/events/${e.slug}.webp`} alt="" width={853} height={1200} decoding="async" />
              <span className="ev-fold">{e.title}</span>
              <span className="ev-info">
                <span className="ev-title">{e.title}</span>
                <span className="ev-rule" aria-hidden="true">
                  <i />
                </span>
                <span className="ev-row">
                  <Calendar />
                  {e.date ?? "Date to be announced"}
                </span>
                <span className="ev-row">
                  <Pin />
                  {e.venue ?? "Venue to be announced"}
                </span>
                <span className="ev-go" aria-hidden="true">
                  <Chevron />
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
