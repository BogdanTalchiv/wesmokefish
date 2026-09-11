import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Plus } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * FAQ.
 *
 * Built on native <details>/<summary>, so it works without JavaScript, is
 * keyboard accessible for free, and its content is in the HTML for crawlers —
 * which matters because this section also feeds the FAQPage structured data.
 *
 * Every answer restates verified information (threshold, delivery windows,
 * address, guest checkout, approximate weights) and nothing else.
 */
export function Faq({
  locale,
  items,
  eyebrow,
  title,
  /**
   * Drop the section heading when the page already has one — the FAQ page
   * itself uses its <h1> as the label, so repeating it would put two
   * identical headings in the outline.
   */
  hideHeading = false,
}: {
  locale: Locale;
  items?: ReadonlyArray<{ q: string; a: string }>;
  eyebrow?: string;
  title?: string;
  hideHeading?: boolean;
}) {
  const t = getDictionary(locale);
  const questions = items ?? t.faq.items;
  const heading = title ?? t.faq.title;

  return (
    <section
      className="py-20 sm:py-28"
      {...(hideHeading ? { "aria-label": heading } : { "aria-labelledby": "faq-heading" })}
    >
      <div className="container-page">
        <div
          className={
            hideHeading
              ? "max-w-3xl"
              : "grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16"
          }
        >
          {!hideHeading && (
            <SectionHeading
              headingId="faq-heading"
              eyebrow={eyebrow ?? t.faq.eyebrow}
              title={heading}
              className="lg:sticky lg:top-28 lg:self-start"
            />
          )}

          <div>
            <dl className="divide-y divide-cream-300 border-t border-cream-300">
              {questions.map((item, i) => (
                <Reveal key={item.q} delay={i * 50}>
                  <details className="group">
                    <summary
                      className="flex cursor-pointer list-none items-start justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden"
                    >
                      <dt className="font-sans text-[0.9375rem] leading-snug font-medium transition-colors group-hover:text-ember">
                        {item.q}
                      </dt>
                      <span
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center text-ink-400 transition-transform duration-300 group-open:rotate-45"
                        aria-hidden
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    </summary>
                    <dd className="max-w-[62ch] pr-10 pb-5 text-[0.875rem] leading-relaxed text-ink-500">
                      {item.a}
                    </dd>
                  </details>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
