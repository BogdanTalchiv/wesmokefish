export const LOCALES = ["ro", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ro";

/** Maps our locale codes to full BCP-47 tags for <html lang> and hreflang. */
export const LOCALE_TAGS: Record<Locale, string> = {
  ro: "ro-MD",
  ru: "ru-MD",
};

export const LOCALE_LABELS: Record<Locale, string> = {
  ro: "Română",
  ru: "Русский",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  ro: "RO",
  ru: "RU",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Builds a locale-aware path. The default locale is served without a prefix,
 * so `/produse` stays `/produse` in Romanian and becomes `/ru/produse`.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean || "/";
  return `/${locale}${clean}`;
}

/** Strips a locale prefix from a pathname, returning the locale-free path. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    return { locale: segments[0], path: `/${segments.slice(1).join("/")}` };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}
