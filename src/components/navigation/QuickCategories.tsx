import Link from "next/link";
import { QUICK_CATEGORIES } from "@/data/merchandising";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * Thumb-reach category chips. Mobile-only by default — desktop already has
 * the header mega-nav and the homepage tiles.
 */
export function QuickCategories({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const t = getDictionary(locale);

  return (
    <nav aria-label={t.quickCategories.label} className={className}>
      <ul className="snap-rail gap-2">
        {QUICK_CATEGORIES.map((chip) => (
          <li key={chip.id}>
            <Link
              href={localePath(locale, chip.href)}
              className="flex h-10 items-center rounded-full border border-cream-300 bg-cream px-4 text-[0.8125rem] font-medium whitespace-nowrap transition-colors hover:border-ink hover:bg-ink hover:text-cream"
            >
              {t.quickCategories.names[chip.id]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
