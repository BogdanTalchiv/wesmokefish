"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { usePresence } from "@/lib/hooks/usePresence";
import { cn } from "@/lib/utils";

type Side = "right" | "left" | "bottom" | "top";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: Side;
  title: string;
  /** Hides the title visually but keeps it for screen readers. */
  hideTitle?: boolean;
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
  /** Rendered pinned to the bottom, outside the scrollable area. */
  footer?: React.ReactNode;
};

/** Off-screen resting position, applied while closed or animating out. */
const OFFSCREEN: Record<Side, string> = {
  right: "translate-x-full",
  left: "-translate-x-full",
  bottom: "translate-y-full",
  top: "-translate-y-full",
};

const PANEL_POSITION: Record<Side, string> = {
  right: "inset-y-0 right-0 h-full w-full max-w-[27rem]",
  left: "inset-y-0 left-0 h-full w-full max-w-[22rem]",
  bottom: "inset-x-0 bottom-0 max-h-[88svh] w-full rounded-t-xl",
  top: "inset-x-0 top-0 w-full",
};

const PANEL_MS = 420;
const BOTTOM_MS = 340;

/**
 * Accessible slide-over panel.
 *
 * Handles: focus trap, focus restore on close, Escape, background scroll lock,
 * `aria-modal` semantics, and reduced-motion.
 *
 * Animated with CSS transitions rather than an animation library. This
 * component is mounted in the root layout (the cart drawer), so anything it
 * imports is paid for on every page load — a slide and a fade are not worth
 * 55 KB of JavaScript. `usePresence` supplies the deferred unmount that
 * AnimatePresence used to, and the `motion-reduce:` variants disable movement
 * for visitors who ask for that.
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  hideTitle,
  closeLabel,
  children,
  className,
  footer,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const durationMs = side === "bottom" ? BOTTOM_MS : PANEL_MS;
  const { mounted, visible } = usePresence(open, durationMs);

  // Lock background scroll while open, compensating for the scrollbar so the
  // page behind does not shift horizontally.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open]);

  // Remember what was focused, move focus into the panel, restore on close.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? panel).focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  // Escape to close, Tab cycles within the panel.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      {/* Scrim. A plain div — clicking it closes the drawer. */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/45 backdrop-blur-[2px]",
          "transition-opacity duration-250 ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{ transitionDuration: `${durationMs}ms` }}
        className={cn(
          "absolute flex flex-col bg-cream shadow-[0_0_60px_rgba(20,17,16,0.22)] outline-none",
          "transition-transform ease-(--ease-out-soft) will-change-transform",
          "motion-reduce:transition-none motion-reduce:transform-none",
          PANEL_POSITION[side],
          visible ? "translate-x-0 translate-y-0" : OFFSCREEN[side],
          className,
        )}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-cream-300 px-5 py-4 sm:px-6">
          <h2
            id={titleId}
            className={cn(
              "font-sans text-[0.8125rem] font-semibold tracking-[0.14em] uppercase",
              hideTitle && "sr-only",
            )}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <X
              className="h-[1.125rem] w-[1.125rem]"
              strokeWidth={1.5}
              aria-hidden
            />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-cream-300">{footer}</div>
        )}
      </div>
    </div>
  );
}
