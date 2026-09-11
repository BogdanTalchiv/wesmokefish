"use client";

import { useEffect, useState } from "react";

/**
 * Keeps a component mounted while it animates out.
 *
 * Replaces what framer-motion's `AnimatePresence` was doing for the drawer and
 * the cookie bar. Those three components were the only reason framer-motion was
 * in the bundle, and because the cart drawer lives in the root layout it was
 * costing every page roughly 55 KB gzipped for a slide and a fade — work CSS
 * does natively. This hook is the missing piece: the unmount delay.
 *
 * Returns:
 *  - `mounted` — render the element at all.
 *  - `visible` — apply the "in" classes. False for one frame after mount and
 *    immediately on close, so the CSS transition has two states to move
 *    between.
 *
 * Honours `prefers-reduced-motion` by collapsing the exit delay to zero.
 */
export function usePresence(open: boolean, durationMs: number) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  /*
    React to the `open` flag during render rather than in an effect — React's
    documented pattern for adjusting state when an input changes. Opening must
    mount in the same commit, otherwise the drawer would lag one painted frame
    behind the click.
  */
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setMounted(true);
    else setVisible(false);
  }

  // Delay unmount until the exit transition has finished.
  useEffect(() => {
    if (open || !mounted) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setMounted(false), reduced ? 0 : durationMs);
    return () => clearTimeout(timer);
  }, [open, mounted, durationMs]);

  // Flip to visible on the frame after mounting, so the browser has painted
  // the "out" state and will animate the change rather than jumping to it.
  useEffect(() => {
    if (!mounted || !open) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [mounted, open]);

  return { mounted, visible };
}
