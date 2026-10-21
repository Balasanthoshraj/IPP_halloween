/* eslint-disable @next/next/no-img-element -- one pre-sized logo in public/art */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { LINKS } from "./links";

// Frosted pill, there from the top of every page (it arrives with a short entrance once the page has hydrated). One highlight
// glides between the links: to the one under the mouse, otherwise to where you are.
export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const path = usePathname();
  const home = path === "/";

  useEffect(() => {
    const nav = ref.current!;
    nav.setAttribute("data-page", ""); // set after hydration, so a page that loads directly gets the entrance too
    const links = [...nav.querySelectorAll("a")];
    const ac = new AbortController();
    const { signal } = ac;
    const active = home ? 0 : LINKS.findIndex((l) => l.href === path); // the landing page is Home
    let hover: HTMLAnchorElement | null = null;

    const show = () => {
      const lit = hover ?? links[active];
      nav.toggleAttribute("data-idle", !lit); // an unknown page: no highlight
      if (lit) {
        const li = lit.parentElement!; // measure the li: its offsetParent is always the ul, whatever the entrance transform is doing
        nav.style.setProperty("--x", `${li.offsetLeft}px`);
        nav.style.setProperty("--w", `${li.offsetWidth}px`);
      }
      links.forEach((a, i) => {
        a.toggleAttribute("data-lit", a === lit);
        if (i === active) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    };

    nav.addEventListener(
      "pointerover",
      (e) => {
        const a = e.pointerType === "mouse" ? (e.target as Element).closest("a") : null; // touch has no hover
        if (a === hover) return;
        hover = a;
        show();
      },
      { signal },
    );
    nav.addEventListener(
      "pointerleave",
      () => {
        hover = null;
        show();
      },
      { signal },
    );
    // on the landing page its own links scroll (smoothly) instead of navigating
    nav.addEventListener(
      "click",
      (e) => {
        const a = (e.target as Element).closest("a");
        const id = home && a && new URL(a.href).pathname === "/" ? new URL(a.href).hash.slice(1) : "";
        if (!id) return;
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      },
      { signal },
    );
    const ro = new ResizeObserver(show); // also re-fits the highlight when the font swaps in
    ro.observe(nav);
    show();
    // glide only after the first placement, so a reload mid-page doesn't slide the highlight in from the left
    requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.add("ready")));

    return () => {
      ac.abort();
      ro.disconnect();
    };
  }, [path, home]);

  return (
    <>
      <nav className="nav" aria-label="Primary" ref={ref}>
        <span className="nav-pill" aria-hidden="true" />
        <ul>
          {LINKS.map(({ href, label }, i) => (
            <li key={href} style={{ "--i": i } as CSSProperties}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* the landing page has its own logos in the scene; the nav's data-page lets this one arrive with the pill (see .brand) */}
      {!home && (
        <Link className="brand" href="/" aria-label="ISTA i++26, home">
          <img src="/art/logoBrand.webp" width={420} height={168} alt="" />
        </Link>
      )}
    </>
  );
}
