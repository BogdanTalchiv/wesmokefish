import { Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonAnchor } from "@/components/ui/Button";
import { REVIEWS, SOCIAL } from "@/config/business";
import { fill, getDictionary, type Locale } from "@/lib/i18n";

/**
 * Social proof.
 *
 * AUDIT NOTE: the current site prints "4.9/5 recenzii" as static text from its
 * page builder, but the store has no reviews app installed, no review records
 * and no rating data behind that number. Rather than repeat an unverifiable
 * rating, this section is built CMS-ready and switched off: fill in
 * `REVIEWS` in src/config/business.ts (ideally wired to a real review source)
 * and the stars, aggregate rating and testimonial grid all appear — including
 * the AggregateRating structured data, which stays suppressed until then.
 */
export function Reviews({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  if (!REVIEWS.enabled || REVIEWS.items.length === 0) {
    return (
      <section className="py-20 sm:py-28" aria-labelledby="reviews-heading">
        <div className="container-page">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="eyebrow">{t.reviews.eyebrow}</p>
            <h2 id="reviews-heading" className="mt-2.5 text-(length:--text-display-sm) leading-[1.05]">
              {t.reviews.title}
            </h2>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-500">
              {t.reviews.empty.body}
            </p>
            <ButtonAnchor
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="mt-7"
            >
              {t.reviews.empty.cta}
            </ButtonAnchor>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28" aria-labelledby="reviews-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.reviews.eyebrow}
          title={t.reviews.title}
          sub={
            REVIEWS.ratingValue && REVIEWS.reviewCount
              ? `${fill(t.reviews.ratingOutOf, { value: REVIEWS.ratingValue })} · ${fill(
                  t.reviews.basedOn,
                  { count: REVIEWS.reviewCount }
                )}`
              : undefined
          }
        />

        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.items.map((review, i) => (
            <Reveal as="li" key={`${review.author}-${i}`} delay={i * 80}>
              <div className="flex gap-0.5" aria-label={fill(t.reviews.ratingOutOf, { value: review.rating })}>
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star
                    key={star}
                    className={
                      star < review.rating ? "h-3.5 w-3.5 fill-ember text-ember" : "h-3.5 w-3.5 text-cream-300"
                    }
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-[1.0625rem] leading-relaxed">
                {review.body}
              </blockquote>
              <figcaption className="mt-4 text-[0.8125rem] text-ink-400">
                {review.author}
              </figcaption>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
