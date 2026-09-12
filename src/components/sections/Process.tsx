import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * "How it's made" — craftsmanship, not a corporate timeline.
 *
 * Copy stays at the level the audit supports. Technical smoking details are
 * not published on the current site, so they are not invented here.
 */
export function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="bg-ink text-cream" aria-labelledby="process-heading">
      <div className="container-page py-20 sm:py-28">
        <SectionHeading
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          sub={t.process.sub}
          onDark
          headingId="process-heading"
        />

        <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
          {t.process.steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 80}>
              <p className="font-display text-[3.25rem] leading-none text-cream/20 sm:text-[3.75rem]">
                {step.n}
              </p>
              <h3 className="mt-4 font-sans text-[0.9375rem] font-semibold tracking-[0.02em]">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-cream/55">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
