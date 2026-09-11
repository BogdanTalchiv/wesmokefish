# WeSmokeFish storefront

A rebuilt storefront for [wesmokefish.md](https://wesmokefish.md) — smoked fish
and seafood, Chișinău. Next.js App Router, TypeScript, Tailwind v4.

**Shopify remains the commerce engine.** This repo is the storefront only. It
does not process payments, does not store card data, and does not hold any
Shopify credentials.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment variables are needed to run, build, or complete a purchase.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (119 static pages) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run catalog` | Re-sync the product catalogue from Shopify, then verify it |
| `node scripts/qa-html.mjs` | Audit the built HTML for SEO/structured-data regressions (run after `build`) |

---

## How checkout works, and why

The cart lives in this app. When the shopper clicks **Finalizează comanda**,
they are handed to Shopify through a
[cart permalink](https://shopify.dev/docs/api/liquid/objects/cart):

```
https://wesmokefish.md/cart/44012345678:2,44012345679:1?locale=ro
```

Shopify then owns the entire checkout. That means:

- **Prices, stock and discounts come from Shopify at checkout time.** If a
  price changes in Shopify admin, the shopper pays the Shopify price. A stale
  snapshot in this repo cannot cause an incorrect charge.
- **Orders, inventory, customers, taxes, shipping rates and every installed
  Shopify app keep working exactly as they do today.** Nothing about the
  existing back office changes.
- **No secrets.** The storefront needs zero credentials, so there is nothing to
  leak.
- **No PCI surface.** Card details are never seen by this application.

There is an optional upgrade path in `src/lib/shopify/storefront.ts` that uses
the Storefront API `cartCreate` mutation instead (cleaner checkout URL,
programmatic discount codes). It activates only when both
`NEXT_PUBLIC_SHOPIFY_*` variables are set, and falls back to the permalink
otherwise. Use a **Storefront** access token — never an Admin token.

`purchase` and `add_payment_info` are deliberately **not** tracked in this app.
Those events belong to Shopify's own GA4/Meta integration on the hosted
checkout; firing them here too would double-count revenue.

---

## Where the content lives

Nothing about products is hardcoded in components.

| What | File | Edited by |
| --- | --- | --- |
| Products, prices, variants, images | `src/data/catalog.json` | Generated — run `npm run catalog` |
| Product descriptions | Shopify admin, else `src/data/product-content.ts` | Owner |
| Bestsellers, products of the week, category tiles, cross-sell rules, campaign product sets | `src/data/merchandising.ts` | Owner (slugs only) |
| Phone, email, address, delivery rules, socials, analytics IDs | `src/config/business.ts` | Owner |
| All UI text, Romanian | `src/lib/i18n/dictionaries/ro.ts` | Owner |
| All UI text, Russian | `src/lib/i18n/dictionaries/ru.ts` | Owner |
| Routes and navigation | `src/config/navigation.ts` | Developer |

### Product descriptions

A Shopify description always wins. Only 1 of 39 products currently has one, so
`src/data/product-content.ts` supplies written fallbacks for the rest. Add a
description in Shopify admin and it overrides the fallback immediately — no
code change.

### Updating the catalogue

```bash
npm run catalog
```

This pulls from the store's public `products.json` and `collections.json`,
normalises it, and then verifies the result: it asserts the computed
price-per-kg matches the figures on the live site, and fails on slug
collisions, unparsed weights or orphaned products.

Product URLs are derived from product **titles**, not Shopify handles, because
several handles are stale (`scrumbie-slab-sarata-copy`). The old handles are
preserved and `next.config.ts` generates a permanent redirect for every one, so
no indexed URL breaks.

---

## Things the owner must supply

These are deliberately incomplete. Each one renders an honest fallback rather
than an invented value — see the reasoning in each file.

### 1. Customer reviews — `src/config/business.ts` → `REVIEWS`

**The current site displays "4.9/5" but there is no data behind it.** The audit
found no reviews app, no review records and no rating data anywhere in the
store; the figure is static text baked into the page-builder template.

So the new site does not display it. The reviews section ships with a CMS-ready
empty state, and `AggregateRating` structured data is suppressed. Publishing an
unverifiable rating as Product schema is also a Google structured-data policy
violation that can earn a manual action.

To switch it on, set real values:

```ts
export const REVIEWS = {
  enabled: true,
  ratingValue: 4.9,
  reviewCount: 127,
  source: "Judge.me",
  items: [ /* real reviews */ ],
};
```

### 2. Delivery cost and zone — `src/config/business.ts` → `DELIVERY`

`standardFee` and `zone` are `null` because the live site never states them. The
site currently says the cost is confirmed by phone, which is accurate. Set them
and the copy switches to exact figures automatically:

```ts
standardFee: 60,
zone: "Chișinău și suburbii",
```

The free-delivery threshold (**1.200 MDL**) and both delivery windows **are**
verified from the live site and are already in use.

### 3. Ingredients, storage and shelf life — `src/data/product-content.ts` → `PRODUCT_FACTS`

Empty. No ingredient, allergen or shelf-life information exists on the current
site, and this is food — guessing is not acceptable. Product pages show a short
note instead of a specification table until this is filled in. The expected
shape is documented in the file.

### 4. Legal documents — the four pages under `src/app/[locale]/`

`politica-de-confidentialitate`, `termeni-si-conditii`, `politica-de-retur`,
`politica-cookie` all render a marked placeholder and the real contact details.

No legal text was generated. These documents make binding statements about data
retention, processors, refund windows and consumer rights under Moldovan law.
Generated text would read convincingly while committing the business to terms
nobody checked. They are `noindex` and excluded from the sitemap while they are
placeholders.

### 5. Brand story — `ro.ts` / `ru.ts` → `about.placeholderNote`

The About page states only what is verifiable. Founding year, team, and the
smokehouse story are marked as owner input.

### 6. Russian product names

Product titles and descriptions come from Shopify and are Romanian. The Russian
site falls back to them. Add Russian titles in Shopify (via a translation app or
metafields) to complete `/ru`.

---

## Optional integrations

All off by default. See `.env.example`.

**Analytics** — GTM, GA4, Meta Pixel and Microsoft Clarity each load only when
their ID is set **and** the visitor has consented. Google Consent Mode v2
defaults to denied in an inline `<head>` script before any tag can read it, so
no analytics or advertising cookie is written before opt-in.

**Forms** — `/api/contact` and `/api/newsletter` validate with Zod (the same
schema the client uses), rate-limit per IP, and forward to a webhook URL held
in a server-only variable. Until a URL is set they return 503 and the form
shows the phone number and email instead of falsely reporting success.

---

## Architecture notes

- **Locales.** Romanian is served unprefixed; `src/proxy.ts` rewrites `/produse`
  to `/ro/produse` internally. Russian is at `/ru/*`.
- **The root layout is `src/app/[locale]/layout.tsx`.** There is no
  `src/app/layout.tsx`. Putting the root layout inside `[locale]` makes `locale`
  available synchronously, so `<html lang>` is server-rendered correctly while
  every page stays static.
- **Dictionary typing.** `ro.ts` is `as const`; a `DeepWiden` mapped type widens
  literals so other locales can supply their own strings while a missing or
  misspelled key is still a type error. Adding a key to `ro.ts` breaks the build
  until `ru.ts` has it too.
- **Cart state** is React Context + `useReducer` + localStorage. No Redux. Lines
  are re-resolved against the catalogue on load, so a variant deleted in Shopify
  is dropped rather than carried into checkout.
- **All 119 pages are statically prerendered**, including every product and
  collection. `?q=` is read client-side via `useUrlQueryParam` specifically to
  keep it that way — `useSearchParams` would force a Suspense boundary and strip
  the product grid out of the prerendered HTML.

---

## Before going live

1. `npm run catalog` — refresh prices and stock.
2. `npm run build && node scripts/qa-html.mjs` — verify SEO and structured data.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin.
4. Fill in the analytics IDs you actually use.
5. Supply the legal documents (section 4 above) and remove `noIndex` from those
   four pages.
6. **Set `NEXT_PUBLIC_SHOPIFY_DOMAIN`** — see the warning below. This is the
   one step that will silently break every checkout if skipped.
7. Submit `/sitemap.xml` in Google Search Console.

### ⚠ The domain cutover

Cart permalinks are resolved by **Shopify**, not by this app. Today
`wesmokefish.md` *is* the Shopify storefront, so the default works and checkout
functions with no configuration.

The moment this app is deployed to `wesmokefish.md`, that domain stops reaching
Shopify: `/cart/...` hits Next.js, returns 404, and **every checkout breaks.**

So at cutover, keep Shopify reachable on some domain and point the variable at
it:

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=shop.wesmokefish.md
```

Verify by opening `https://shop.wesmokefish.md/cart` — it must render a Shopify
cart page. A subdomain kept on Shopify is safer than the `myshopify.com`
domain, which usually redirects to the store's primary domain.

Alternatively, set the two `NEXT_PUBLIC_SHOPIFY_STOREFRONT_*` variables and the
app will use the Storefront API, which returns a checkout URL on Shopify's own
domain and sidesteps the issue entirely.
