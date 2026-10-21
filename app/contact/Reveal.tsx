"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type ReactNode } from "react";
import { blob } from "./liquid";

gsap.registerPlugin(useGSAP);

const SPREAD = 1.8; // seconds for a card to open
const STAGGER = 0.16; // between cards that open together

// The list of cards. Each one opens once, like liquid spreading from its middle, when it scrolls into view. The page itself
// scrolls natively; nothing here touches it.
export default function Reveal({ children }: { children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const items = gsap.utils.toArray<HTMLElement>(".tm-item", list.current);
      const done = (item: HTMLElement) => {
        (item.firstElementChild as HTMLElement).style.clipPath = ""; // the card is whole again: no clip left to paint
        item.dataset.reveal = "done";
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        items.forEach(done);
        return;
      }

      const open = contextSafe!((item: HTMLElement, delay: number) => {
        const card = item.firstElementChild as HTMLElement;
        const seed = items.indexOf(item) + 1;
        const at = { p: 0 };
        const tween = gsap.to(at, {
          p: 1,
          duration: SPREAD,
          delay,
          ease: "power2.out",
          onUpdate: () => {
            card.style.clipPath = blob(at.p, tween.time(), seed);
          },
          onComplete: () => done(item),
        });
      });

      let io: IntersectionObserver | undefined;
      let cancelled = false;
      const watch = () => {
        if (cancelled) return;
        io = new IntersectionObserver(
          (entries) => {
            entries
              .filter((e) => e.isIntersecting)
              .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
              .forEach((e, n) => {
                io!.unobserve(e.target);
                open(e.target as HTMLElement, n * STAGGER);
              });
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }, // a card opens once it is properly on screen
        );
        items.forEach((item) => io!.observe(item));
      };

      // Start once the card art is decoded (so the first frame doesn't stall) and the page transition has mostly played.
      const art = list.current!.querySelector("img")!;
      const transition = (document as Document & { activeViewTransition?: { finished: Promise<unknown> } }).activeViewTransition?.finished;
      Promise.all([art.decode().catch(() => {}), transition && Promise.race([transition.catch(() => {}), new Promise((r) => setTimeout(r, 600))])]).then(watch);

      return () => {
        cancelled = true;
        io?.disconnect();
      };
    },
    { scope: list },
  );

  return (
    <ul className="tm-list" ref={list}>
      {children}
    </ul>
  );
}
