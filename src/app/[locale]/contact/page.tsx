import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { ContactForm } from "@/components/marketing/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/seo/structuredData";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CONTACT, DELIVERY } from "@/config/business";
import { ROUTES } from "@/config/navigation";
import { fill, getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { formatMoney } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "ro") as Locale;
  const t = getDictionary(locale);

  return buildPageMetadata({
    locale,
    path: ROUTES.contact,
    title: t.meta.contact.title,
    description: t.meta.contact.description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  const crumbs = [{ name: t.nav.home, path: ROUTES.home }, { name: t.nav.contact }];

  const channels = [
    {
      icon: Phone,
      label: t.contact.callUs,
      value: CONTACT.phone,
      href: CONTACT.phoneHref,
    },
    {
      icon: Mail,
      label: t.contact.writeUs,
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      icon: MapPin,
      label: t.contact.visitUs,
      value: `${CONTACT.address.street}, ${CONTACT.address.city}`,
      // Opens the address in whichever maps app the visitor uses.
      href: `https://maps.google.com/?q=${encodeURIComponent(
        `${CONTACT.address.street}, ${CONTACT.address.city}, ${CONTACT.address.countryName}`
      )}`,
    },
  ];

  return (
    <>
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema(
          crumbs.map((c) => ({ name: c.name, path: c.path ?? ROUTES.contact })),
          locale
        )}
      />
      <JsonLd id="ld-localbusiness" data={localBusinessSchema()} />

      <PageHeader
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        lede={t.contact.sub}
        crumbs={crumbs}
        locale={locale}
      />

      <div className="container-page pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Direct channels first: most people would rather call than type. */}
          <div>
            <ul className="divide-y divide-cream-300 border-y border-cream-300">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    {...(channel.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-start gap-4 py-5 transition-colors hover:text-ember"
                  >
                    <channel.icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-ember"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span>
                      <span className="block text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-400">
                        {channel.label}
                      </span>
                      <span className="mt-1 block text-[1.0625rem] leading-snug font-medium">
                        {channel.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="eyebrow">{t.footer.followUs}</p>
              <SocialLinks className="mt-3" tone="dark" location="contact_page" />
            </div>

            {/* Restate delivery here — it is the second-most-asked question. */}
            <div className="mt-8 rounded-[3px] bg-cream-100 p-5">
              <p className="text-[0.8125rem] leading-relaxed text-ink-700">
                {fill(t.delivery.freeBody, {
                  amount: formatMoney(DELIVERY.freeShippingThreshold, locale),
                })}
              </p>
              {DELIVERY.windows.map((w) => (
                <p
                  key={`${w.orderFrom}-${w.orderTo}`}
                  className="mt-2 text-[0.8125rem] leading-relaxed text-ink-500"
                >
                  {fill(w.sameDay ? t.delivery.windowSameDay : t.delivery.windowNextDay, {
                    from: w.orderFrom,
                    to: w.orderTo,
                    dFrom: w.deliverFrom,
                    dTo: w.deliverTo,
                  })}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl">{t.contact.form.title}</h2>
            <div className="mt-5">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
