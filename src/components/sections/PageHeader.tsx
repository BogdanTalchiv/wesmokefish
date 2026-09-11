import { Breadcrumbs, type Crumb } from "@/components/navigation/Breadcrumbs";
import type { Locale } from "@/lib/i18n";

/** Shared header for the content pages: breadcrumbs, eyebrow, h1, lede. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  crumbs,
  locale,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  crumbs: Crumb[];
  locale: Locale;
}) {
  return (
    <header className="container-page">
      <Breadcrumbs items={crumbs} locale={locale} className="py-5" />
      <div className="max-w-[52ch] pb-10 sm:pb-12">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 text-(length:--text-display-sm) leading-[1.05]">{title}</h1>
        {lede && (
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-500">{lede}</p>
        )}
      </div>
    </header>
  );
}
