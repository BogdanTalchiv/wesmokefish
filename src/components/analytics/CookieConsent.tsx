"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePresence } from "@/lib/hooks/usePresence";
import { ANALYTICS } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import {
  DENIED,
  GRANTED,
  pushConsentToGoogle,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/analytics/consent";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Cookie consent bar.
 *
 * Deliberately not a full-screen blocker: it sits at the bottom, never covers
 * the sticky mobile add-to-cart bar, and offers a real "only necessary" choice
 * with equal visual weight to accepting — no dark patterns.
 *
 * If no analytics IDs are configured there is nothing to consent to, so the
 * banner does not render at all.
 */
export function CookieConsent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<ConsentState>({
    necessary: true,
    analytics: true,
    marketing: true,
  });

  const hasTags = Boolean(
    ANALYTICS.gtmId ||
    ANALYTICS.ga4Id ||
    ANALYTICS.metaPixelId ||
    ANALYTICS.clarityId,
  );

  useEffect(() => {
    if (!hasTags) return;
    const stored = readConsent();
    if (stored) {
      pushConsentToGoogle(stored);
      return;
    }
    // Let the page paint first — this must never compete with the hero.
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [hasTags]);

  if (!hasTags) return null;

  function decide(state: ConsentState) {
    writeConsent(state);
    setVisible(false);
  }

  return (
    <ConsentBar visible={visible} label={t.cookies.title}>
      <div className="container-page py-4">
        {!expanded ? (
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-[0.8125rem] leading-relaxed text-cream/70">
              {t.cookies.body}{" "}
              <Link
                href={localePath(locale, ROUTES.cookies)}
                className="underline underline-offset-2 transition-colors hover:text-ember"
              >
                {t.cookies.more}
              </Link>
            </p>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="h-10 px-3 text-[0.8125rem] text-cream/60 transition-colors hover:text-cream"
              >
                {t.cookies.settings}
              </button>
              <button
                type="button"
                onClick={() => decide(DENIED)}
                className="h-10 rounded-[2px] border border-cream/25 px-4 text-[0.8125rem] font-medium transition-colors hover:bg-cream hover:text-ink"
              >
                {t.cookies.reject}
              </button>
              <button
                type="button"
                onClick={() => decide(GRANTED)}
                className="h-10 rounded-[2px] bg-cream px-4 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-ember hover:text-white"
              >
                {t.cookies.accept}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <Toggle
                label={t.cookies.necessary}
                body={t.cookies.necessaryBody}
                checked
                disabled
              />
              <Toggle
                label={t.cookies.analytics}
                body={t.cookies.analyticsBody}
                checked={draft.analytics}
                onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
              />
              <Toggle
                label={t.cookies.marketing}
                body={t.cookies.marketingBody}
                checked={draft.marketing}
                onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => decide(draft)}
                className="h-10 rounded-[2px] bg-cream px-4 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-ember hover:text-white"
              >
                {t.cookies.save}
              </button>
              <button
                type="button"
                onClick={() => decide(DENIED)}
                className="h-10 rounded-[2px] border border-cream/25 px-4 text-[0.8125rem] font-medium transition-colors hover:bg-cream hover:text-ink"
              >
                {t.cookies.reject}
              </button>
            </div>
          </div>
        )}
      </div>
    </ConsentBar>
  );
}

/**
 * The sliding container for the consent bar.
 *
 * Split out so `usePresence` keeps it mounted through its exit transition.
 * Uses a CSS transform rather than an animation library — the cart drawer and
 * this bar are both in the root layout, so their dependencies are paid for on
 * every page.
 */
function ConsentBar({
  visible,
  label,
  children,
}: {
  visible: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const { mounted, visible: shown } = usePresence(visible, 400);
  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={label}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[60] border-t border-cream/10 bg-ink text-cream",
        "transition-transform duration-400 ease-(--ease-out-soft) will-change-transform",
        "motion-reduce:transition-none motion-reduce:transform-none",
        shown ? "translate-y-0" : "translate-y-full",
      )}
    >
      {children}
    </div>
  );
}

function Toggle({
  label,
  body,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-3",
        disabled ? "cursor-default opacity-60" : "cursor-pointer",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-ember)]"
      />
      <span>
        <span className="block text-[0.8125rem] font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-cream/55">{body}</span>
      </span>
    </label>
  );
}
