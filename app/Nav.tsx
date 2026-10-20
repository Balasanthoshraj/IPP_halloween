"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { LINKS } from "./links";

// Frosted pill. On the landing page Stage reveals it (html[data-nav]) once the title has landed; on every other page it
// is simply there. One highlight glides between the links: to the one under the mouse, otherwise to where you are.
export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const path = usePathname();
  const home = path === "/";

  useEffect(() => {
    const nav = ref.current!;
    nav.toggleAttribute("data-page", !home); // set after hydration, so a page that loads directly gets the entrance too
    const links = [...nav.querySelectorAll("a")];
    const ac = new AbortController();
    const { signal } = ac;
    let active = -2; // nothing placed yet, so the first spy() sets the highlight
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
    const spy = () => {
      let now = LINKS.findIndex((l) => l.href === path);
      if (home) now = (document.getElementById("sponsors")?.getBoundingClientRect().top ?? Infinity) <= innerHeight * 0.45 ? 1 : 0;
      if (now === active) return;
      active = now;
      show();
    };

    if (home) {
      addEventListener("scroll", spy, { passive: true, signal });
      addEventListener("resize", spy, { signal });
    }
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
    spy();
    // glide only after the first placement, so a reload mid-page doesn't slide the highlight in from the left
    requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.add("ready")));

    return () => {
      ac.abort();
      ro.disconnect();
    };
  }, [path, home]);

  return (
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
  );
}
