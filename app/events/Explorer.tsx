/* eslint-disable @next/next/no-img-element -- three pre-sized webp frames in public/art/events */
"use client";

import { useState } from "react";
import { EVENTS, TABS, type EventInfo, type TabId } from "./data";
import ExpandablePanel from "./ExpandablePanel";
import Popup from "./Popup";

// The glass panel: the three categories on the left, that category's events on the right, and the event popup.
export default function Explorer() {
  const [tab, setTab] = useState<TabId>("all");
  const [popup, setPopup] = useState<{ event: EventInfo; open: boolean } | null>(null);
  const events = tab === "all" ? EVENTS : EVENTS.filter((e) => e.category === tab);

  return (
    <>
      <div className="ev-shell">
        <div className="ev-tabs" role="group" aria-label="Event categories">
          {TABS.map(({ id, label, frame }) => (
            <button className="ev-tab" key={id} aria-pressed={id === tab} aria-label={label} onClick={() => setTab(id)}>
              <img src={frame} alt="" width={560} height={258} decoding="async" />
            </button>
          ))}
        </div>
        <section className="ev-main">
          <header className="ev-head">
            <h1>{TABS.find((t) => t.id === tab)!.heading}</h1>
            <div className="ev-rule" aria-hidden="true">
              <i />
            </div>
          </header>
          <ExpandablePanel key={tab} events={events} paused={!!popup?.open} onOpen={(event) => setPopup({ event, open: true })} />
        </section>
      </div>
      <Popup event={popup?.event ?? null} open={!!popup?.open} onClose={() => setPopup((p) => p && { ...p, open: false })} />
    </>
  );
}
