"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, localePath, stripLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Minimal RO / RU toggle. Rendered as real links so it works without JS and
 * search engines can follow both language trees. Keeps the visitor on the same
 * page rather than dumping them on the homepage.
 */
export function LanguageSwitcher({
  locale,
  className,
  onDark = false,
}: {
  locale: Locale;
  className?: string;
  onDark?: boolean;
}) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname ?? "/");

  return (
    <div
      className={cn("flex items-center gap-0.5 text-[0.6875rem] font-medium tracking-[0.06em]", className)}
      role="group"
      aria-label="Limba / Язык"
    >
      {LOCALES.map((code: Locale, i) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center">
            {i > 0 && <span className={cn("px-1", onDark ? "text-cream/30" : "text-ink-400/50")}>/</span>}
            <Link
              href={localePath(code, path)}
              hrefLang={code}
              aria-current={active ? "true" : undefined}
              title={LOCALE_LABELS[code]}
              className={cn(
                "rounded px-1 py-0.5 transition-colors",
                active
                  ? onDark
                    ? "text-cream"
                    : "text-ink"
                  : onDark
                    ? "text-cream/50 hover:text-cream"
                    : "text-ink-400 hover:text-ink"
              )}
            >
              {LOCALE_SHORT[code]}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
