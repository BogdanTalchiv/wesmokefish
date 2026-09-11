import ro, { type Dictionary } from "./dictionaries/ro";
import ru from "./dictionaries/ru";
import { DEFAULT_LOCALE, type Locale } from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { ro, ru };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export type { Dictionary };
export * from "./config";

/**
 * Replaces {token} placeholders in a copy string.
 *
 *   t("Mai adaugă {amount} …", { amount: "300 MDL" })
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match
  );
}
