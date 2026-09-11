import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "./i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INTL_LOCALE: Record<Locale, string> = {
  ro: "ro-MD",
  ru: "ru-MD",
};

/**
 * Formats an MDL amount the way a local customer expects to read it:
 * whole amounts lose the decimals (270 MDL), fractional ones keep two
 * (34,80 MDL), thousands get a separator (1.080 MDL).
 */
export function formatMoney(amount: number, locale: Locale = "ro"): string {
  const hasFraction = Math.round(amount * 100) % 100 !== 0;
  const value = new Intl.NumberFormat(INTL_LOCALE[locale], {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  }).format(amount);
  return `${value} MDL`;
}

/** Compact weight label, e.g. 1200 -> "1,2 kg", 300 -> "300 g". */
export function formatWeight(grams: number, locale: Locale = "ro"): string {
  const kgUnit = locale === "ru" ? "кг" : "kg";
  const gUnit = locale === "ru" ? "г" : "g";
  if (grams >= 1000) {
    const kg = grams / 1000;
    const formatted = new Intl.NumberFormat(INTL_LOCALE[locale], {
      maximumFractionDigits: 1,
    }).format(kg);
    return `${formatted} ${kgUnit}`;
  }
  return `${grams} ${gUnit}`;
}

/**
 * Normalises text for search: lowercases and strips Romanian/Russian
 * diacritics so "pastrav" matches "păstrăv" and "creveti" matches "creveți".
 */
export function normalizeForSearch(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ț/g, "t")
    .replace(/ș/g, "s")
    .replace(/ă|â/g, "a")
    .replace(/î/g, "i")
    .replace(/ё/g, "е")
    .replace(/[^a-z0-9а-я\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Builds an optimised Shopify CDN image URL at a given width. */
export function shopifyImage(url: string, width: number): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("width", String(width));
    return parsed.toString();
  } catch {
    return url;
  }
}
