"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger in milliseconds, for revealing a list one item after another. */
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "header";
};

/**
 * Reveals its children once on scroll-in.
 *
 * Uses IntersectionObserver and a CSS transition rather than a JS animation
 * library, so it costs almost nothing and respects `prefers-reduced-motion`
 * via the `reveal` utility in globals.css.
 *
 * Content is visible unless the document carries `data-js="true"`, which the
 * bootstrap script in the root layout sets only when IntersectionObserver
 * exists. So there is no need for a support check here: without an observer
 * the CSS never hides anything in the first place.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error -- ref type varies with the chosen tag
      ref={ref}
      data-revealed={revealed}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
