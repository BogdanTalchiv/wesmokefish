import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { BRAND, CONTACT } from "@/config/business";
import { getFooterNav } from "@/config/navigation";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const nav = getFooterNav(t);
  const year = new Date().getFullYear();

  const columns = [
    { title: t.footer.shop, items: nav.shop },
    { title: t.footer.info, items: nav.info },
    { title: t.footer.legal, items: nav.legal },
  ];

  return (
    <footer className="grain mt-24 bg-ink text-cream sm:mt-32">
      <div className="container-page relative z-10">
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.4fr_2fr_1.3fr] lg:gap-16">
          {/* Brand + newsletter */}
          <div>
            <Logo locale={locale} onDark />
            <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-cream/60">
              {t.footer.statement}
            </p>

            <div className="mt-8">
              <NewsletterForm locale={locale} />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
                  {column.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={localePath(locale, item.href)}
                        className="text-[0.8125rem] text-cream/75 transition-colors hover:text-ember"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
              {t.footer.contactTitle}
            </h2>

            <ul className="mt-4 space-y-3.5 text-[0.8125rem]">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="group flex items-start gap-2.5 text-cream/75 transition-colors hover:text-ember"
                >
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cream/40" strokeWidth={1.5} aria-hidden />
                  <span className="tabular-nums">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-start gap-2.5 break-all text-cream/75 transition-colors hover:text-ember"
                >
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cream/40" strokeWidth={1.5} aria-hidden />
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-cream/75">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cream/40" strokeWidth={1.5} aria-hidden />
                <span>
                  {CONTACT.address.street}
                  <br />
                  {CONTACT.address.city}, {CONTACT.address.countryName}
                </span>
              </li>
            </ul>

            <h2 className="mt-8 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-cream/40">
              {t.footer.followUs}
            </h2>
            <SocialLinks className="mt-3.5" tone="light" location="footer" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-cream/10 py-6 text-[0.6875rem] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. {t.footer.rights}
          </p>
          <p>{t.footer.paymentNote}</p>
        </div>
      </div>
    </footer>
  );
}
