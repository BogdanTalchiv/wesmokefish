import { ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/config/navigation";
import { DEFAULT_LOCALE, getDictionary, localePath } from "@/lib/i18n";

/**
 * 404.
 *
 * Uses the default locale: a not-found response has no matched route, so
 * there is no reliable `locale` param to read. Romanian is the primary market
 * language, so it is the right fallback.
 *
 * Rather than a dead end, this offers the two paths that recover a lost
 * visitor — the catalogue and the homepage.
 */
export default function NotFound() {
  const locale = DEFAULT_LOCALE;
  const t = getDictionary(locale);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-(length:--text-display-sm) leading-[1.05]">
        {t.common.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-500">
        {t.common.notFoundBody}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={localePath(locale, ROUTES.products)} variant="primary" size="lg">
          {t.common.notFoundCta}
        </ButtonLink>
        <ButtonLink href={localePath(locale, ROUTES.home)} variant="outline" size="lg">
          {t.nav.home}
        </ButtonLink>
      </div>
    </div>
  );
}
