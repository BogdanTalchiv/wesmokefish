import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WHATS_NEW } from "@/data/merchandising";
import { getProductBySlug } from "@/lib/catalog";
import { ROUTES } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

/**
 * "Ce a ieșit din afumătoare".
 *
 * Off until the owner fills `WHATS_NEW` in merchandising.ts. The layout is
 * ready — do not invent a weekly special to fill it.
 */
export function WhatsNew({ locale }: { locale: Locale }) {
  if (!WHATS_NEW.enabled || WHATS_NEW.items.length === 0) return null;

  const t = getDictionary(locale);

  return (
    <section className="py-20 sm:py-28" aria-labelledby="whats-new-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.whatsNew.eyebrow}
          title={t.whatsNew.title}
          headingId="whats-new-heading"
        />

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHATS_NEW.items.map((item, i) => {
            const product = item.productSlug ? getProductBySlug(item.productSlug) : undefined;
            const image = item.image ?? product?.images[0]?.url;
            const href = product
              ? localePath(locale, ROUTES.product(product.slug))
              : undefined;

            const card = (
              <>
                {image && (
                  <div className="photo-well relative mb-4 aspect-[4/3] overflow-hidden rounded-[3px]">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 639px) 100vw, 33vw"
                      quality={76}
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-display text-[1.375rem] leading-tight">{item.title}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-500">{item.body}</p>
              </>
            );

            return (
              <Reveal as="li" key={item.id} delay={i * 70}>
                {href ? (
                  <Link href={href} className="block transition-colors hover:text-ember">
                    {card}
                  </Link>
                ) : (
                  <article>{card}</article>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
