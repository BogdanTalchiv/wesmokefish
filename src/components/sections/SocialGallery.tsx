import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { SOCIAL } from "@/config/business";
import { getProductsBySlugs } from "@/lib/catalog";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * Social / lifestyle gallery.
 *
 * Uses the brand's own product photography from the Shopify CDN rather than
 * stock imagery. It is not a live Instagram embed: the store has no Instagram
 * feed app, and an unofficial scrape would break. Swap this for a real feed
 * (Behold, EmbedSocial, Instagram Basic Display) when one is connected — the
 * grid and aspect ratios stay the same.
 */
const GALLERY_SLUGS = [
  "creveti-afumati-cu-parmezan",
  "pastrav-intreg-afumat",
  "midii-afumate",
  "frigarui-afumate-ton-somon-peste-spada",
  "rulada-sah",
  "dorado-afumata",
] as const;

export function SocialGallery({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const products = getProductsBySlugs(GALLERY_SLUGS);

  if (products.length === 0) return null;

  return (
    <section className="py-20 sm:py-28" aria-labelledby="social-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.ugc.eyebrow}
          title={t.ugc.title}
          sub={t.ugc.sub}
          action={{ label: t.ugc.instagram, href: SOCIAL.instagram }}
        />
      </div>

      {/* Full-bleed strip: snap rail on mobile, six-up grid on desktop. */}
      <div className="mt-10 sm:mt-12">
        <div className="snap-rail gap-2 px-5 sm:hidden">
          {products.map((product) => (
            <a
              key={product.slug}
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square w-[42vw] overflow-hidden rounded-[2px] bg-cream-100"
              aria-label={`${t.ugc.instagram} — ${product.title}`}
            >
              <Image
                src={product.images[0].url}
                alt=""
                fill
                sizes="42vw"
                quality={72}
                className="object-cover"
              />
            </a>
          ))}
        </div>

        <div className="hidden grid-cols-6 gap-2 px-2 sm:grid">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 60}>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-[2px] bg-cream-100"
                aria-label={`${t.ugc.instagram} — ${product.title}`}
              >
                <Image
                  src={product.images[0].url}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 33vw, 17vw"
                  quality={74}
                  className="object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-105"
                />
                <span
                  className="absolute inset-0 grid place-items-center bg-ink/0 text-cream opacity-0 transition-[background-color,opacity] duration-300 group-hover:bg-ink/45 group-hover:opacity-100"
                  aria-hidden
                >
                  <InstagramIcon className="h-5 w-5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container-page mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2 text-[0.8125rem] transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            <InstagramIcon className="h-4 w-4" />
            {t.ugc.instagram}
          </a>
          <a
            href={SOCIAL.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2 text-[0.8125rem] transition-colors hover:border-ink hover:bg-ink hover:text-cream"
          >
            <TikTokIcon className="h-4 w-4" />
            {t.ugc.tiktok}
          </a>
        </div>
      </div>
    </section>
  );
}
