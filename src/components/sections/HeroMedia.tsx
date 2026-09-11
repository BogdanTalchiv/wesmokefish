"use client";

import { useEffect, useRef } from "react";

/**
 * Very slow parallax drift for the hero photograph.
 *
 * Deliberately restrained: a small translate plus a fixed scale, driven by a
 * single rAF-throttled scroll listener and applied as a GPU-only transform.
 * No animation library, no layout work, and it disables itself entirely when
 * the visitor prefers reduced motion.
 */
export function HeroMedia({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Reduced motion: leave the static transform from the initial render.
    if (query.matches) return;

    let frame = 0;

    function update() {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      // Drift at ~12% of scroll distance, capped so it never detaches.
      const offset = Math.min(window.scrollY * 0.12, 80);
      node.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /*
    The initial transform is a plain slight scale, which is also the final
    state under reduced motion. When parallax is active the effect overwrites
    `style.transform` imperatively; no state changes, so React never re-renders
    this element and never clobbers that value.
  */
  return (
    <div
      ref={ref}
      className="absolute inset-0 will-change-transform"
      style={{ transform: "scale(1.02)" }}
    >
      {children}
    </div>
  );
}
