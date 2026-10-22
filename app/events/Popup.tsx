/* eslint-disable @next/next/no-img-element -- one pre-sized webp card in public/art/events */
"use client";

import { useEffect, useRef } from "react";
import type { EventInfo } from "./data";
import { Back, Calendar, Clock, Phone, Pin, Trophy, Users } from "./icons";

// The event's page: its poster on the left, the description on the right. A native <dialog>, so focus, Esc and the inert page
// behind it come with the browser. `event` stays set after closing so the content is still there while the dialog fades out.
export default function Popup({ event, open, onClose }: { event: EventInfo | null; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);

  useEffect(() => {
    const d = ref.current!;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      className="ev-pop"
      ref={ref}
      aria-labelledby="ev-pop-title"
      onClose={onClose}
      // a click that starts in the text and ends on the backdrop (selecting) is not a click on the backdrop
      onPointerDown={(e) => (pressedBackdrop.current = e.target === e.currentTarget)}
      onClick={(e) => pressedBackdrop.current && e.target === e.currentTarget && ref.current!.close()}
    >
      {event && (
        <>
          <button className="ev-back" aria-label="Back to events" onClick={() => ref.current!.close()}>
            <Back />
          </button>
          <div className="ev-sheet" key={event.slug} style={{ "--a": event.accent } as React.CSSProperties}>
            <div className="ev-poster">
              <img src={event.art?.poster ?? `/art/events/${event.slug}.webp`} alt="" width={853} height={1200} decoding="async" />
              <div className="ev-poster-top" aria-hidden="true">
                <span className="ev-brand">ISTA presents i++ 26</span>
                <strong>{event.title}</strong>
                <span className="ev-tag">{event.tagline}</span>
              </div>
              <ul className="ev-facts">
                <li>
                  <Calendar />
                  {event.date ?? "Date to be announced"}
                </li>
                <li>
                  <Users />
                  {event.team}
                </li>
                <li>
                  <Pin />
                  {event.venue ?? "Venue to be announced"}
                </li>
                {event.prize && (
                  <li>
                    <Trophy />
                    {event.prize}
                  </li>
                )}
                <li className="wide">
                  <Clock />
                  {event.time}
                </li>
                {event.contacts?.map(({ name, phone }) => (
                  <li className="wide" key={name}>
                    <Phone />
                    <a href={`tel:${phone.replace(/\s/g, "")}`}>
                      {name} · {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ev-text">
              <h2 id="ev-pop-title">{event.title}</h2>
              {event.sections.map(({ heading, lines }, i) => (
                <section key={i}>
                  {heading && <h3>{heading}</h3>}
                  {lines.map(({ label, text }, j) => (
                    <p key={j}>
                      {label && <b>{label}: </b>}
                      {text}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
