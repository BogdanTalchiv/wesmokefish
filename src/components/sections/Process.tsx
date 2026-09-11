import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * "How it's made".
 *
 * Describes the workflow at a level the audit supports — selection, prep,
 * smoking, packing, delivery — and nothing more. No wood species, no
 * temperatures, no curing times: none of that is published anywhere on the
 * current site, so inventing it would be a fabricated production claim.
 * A short note points the owner at where real detail can be added.
 */
export function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="py-20 sm:py-28" aria-labelledby="process-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          sub={t.process.sub}
        />

        <ol className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-4">
          {t.process.steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 80} className="group">
              {/* Hairline that fills on hover — the only motion in the section. */}
              <div className="relative h-px w-full bg-cream-300">
                <span
                  className="absolute inset-y-0 left-0 w-0 bg-ember transition-[width] duration-700 [transition-timing-function:var(--ease-out-soft)] group-hover:w-full"
                  aria-hidden
                />
              </div>

              <p className="mt-4 font-display text-[2.5rem] leading-none text-cream-300 transition-colors duration-500 group-hover:text-ember">
                {step.n}
              </p>

              <h3 className="mt-3 font-sans text-[0.9375rem] font-semibold">{step.title}</h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        {/*
          Visible only to the store owner in the sense that it is honest about
          what we do not know. Remove this line once real process copy exists.
        */}
        <p className="mt-10 max-w-[70ch] border-l-2 border-cream-300 pl-4 text-xs leading-relaxed text-ink-400">
          {t.process.note}
        </p>
      </div>
    </section>
  );
}
