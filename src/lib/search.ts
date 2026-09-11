import { getAllProducts } from "@/lib/catalog";
import { getProductCopy } from "@/lib/catalog/content";
import type { Product } from "@/lib/catalog/types";
import { normalizeForSearch } from "@/lib/utils";

/**
 * Search synonyms.
 *
 * Product names in Shopify are Romanian only, so a Russian-speaking shopper
 * searching "лосось" or someone typing the English "salmon" would otherwise
 * get nothing. Each key maps to extra terms appended to a product's search
 * text when the product name contains that word.
 */
const SYNONYMS: Record<string, string[]> = {
  somon: ["losos", "лосось", "salmon", "sômon"],
  pastrav: ["forel", "форель", "trout", "pstruv"],
  creveti: ["krevetki", "креветки", "shrimp", "prawn", "crevete"],
  midii: ["midii", "мидии", "mussels", "scoici"],
  ton: ["tunets", "тунец", "tuna"],
  scrumbie: ["skumbriya", "скумбрия", "селёдка", "mackerel", "hering"],
  crap: ["karp", "карп", "carp"],
  dorado: ["dorada", "дорадо", "dorada"],
  marlin: ["марлин"],
  escolar: ["эсколар"],
  vomer: ["вомер"],
  novac: ["tolstolob", "толстолоб", "тolstolobik"],
  "sea bass": ["sibas", "сибас", "lavrak", "seabass"],
  yucola: ["iukola", "юкола", "ucola"],
  rulada: ["rulet", "рулет", "roll"],
  bere: ["pivo", "пиво", "beer"],
  afumat: ["kopchenyi", "копчёный", "копченый", "smoked", "afumata", "afumate"],
  "slab sarat": ["slabosolenyi", "слабосолёный", "слабосоленый", "lightly salted"],
  marinat: ["marinovannyi", "маринованный", "marinated"],
  steak: ["stek", "стейк"],
  frigarui: ["shashlyk", "шашлык", "skewers"],
};

export type SearchResult = {
  product: Product;
  score: number;
};

type IndexEntry = {
  product: Product;
  /** Normalised product name — matches here score highest. */
  name: string;
  /** Normalised name + description + synonyms + category. */
  haystack: string;
};

let index: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  return getAllProducts().map((product) => {
    const name = normalizeForSearch(product.title);
    const copy = getProductCopy(product);

    const extras: string[] = [];
    for (const [term, synonyms] of Object.entries(SYNONYMS)) {
      if (name.includes(normalizeForSearch(term))) extras.push(...synonyms);
    }

    const haystack = normalizeForSearch(
      [product.title, copy.short, ...product.collections, ...product.tags, ...extras].join(" ")
    );

    return { product, name, haystack };
  });
}

function getIndex(): IndexEntry[] {
  index ??= buildIndex();
  return index;
}

/**
 * Scores products against a query. Every whitespace-separated token must match
 * somewhere (AND semantics), so "somon afumat" does not return every salmon.
 */
export function searchProducts(query: string, limit = 8): SearchResult[] {
  const normalized = normalizeForSearch(query);
  if (normalized.length < 2) return [];

  const tokens = normalized.split(" ").filter(Boolean);
  const results: SearchResult[] = [];

  for (const entry of getIndex()) {
    let score = 0;
    let matchedAll = true;

    for (const token of tokens) {
      if (entry.name.startsWith(token)) {
        score += 12;
      } else if (entry.name.includes(token)) {
        score += 8;
      } else if (entry.haystack.includes(token)) {
        score += 3;
      } else {
        matchedAll = false;
        break;
      }
    }

    if (!matchedAll) continue;

    // Nudge exact full-name matches and in-stock products to the top.
    if (entry.name === normalized) score += 20;
    if (entry.product.available) score += 1;

    results.push({ product: entry.product, score });
  }

  return results
    .sort((a, b) => b.score - a.score || a.product.priceMin - b.product.priceMin)
    .slice(0, limit);
}
