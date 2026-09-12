"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { Drawer } from "@/components/ui/Drawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CONTACT, SOCIAL } from "@/config/business";
import { COLLECTION_ORDER, ROUTES, getPrimaryNav } from "@/config/navigation";
import { getAllCollections } from "@/lib/catalog";
import { CATEGORY_TILES, OCCASIONS } from "@/data/merchandising";
import { fill, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { trackClickInstagram, trackClickPhone } from "@/lib/analytics/events";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  locale: Locale;
};

export function MobileMenu({ open, onClose, locale }: MobileMenuProps) {
  const t = getDictionary(locale);
  const collections = getAllCollections();
  const nav = getPrimaryNav(t);

  const ordered = COLLECTION_ORDER.map((slug) => collections.find((c) => c.slug === slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      title={t.nav.menu}
      closeLabel={t.nav.closeMenu}
    >
      <nav aria-label={t.nav.menu} className="flex flex-col px-5 py-6">
        {/* Categories first — this is what a shopper came for. */}
        <p className="eyebrow">{t.nav.categories}</p>
        <ul className="mt-3 space-y-2">
          {ordered.map((collection) => {
            const tile = CATEGORY_TILES.find((x) => x.collectionSlug === collection.slug);
            return (
              <li key={collection.slug}>
                <Link
                  href={localePath(locale, ROUTES.collection(collection.slug))}
                  onClick={onClose}
                  className="group flex items-center gap-3.5 rounded-[3px] bg-cream-100 p-2.5 transition-colors hover:bg-cream-200"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[2px] bg-cream-200">
                    {tile && (
                      <Image
                        src={tile.image}
                        alt=""
                        fill
                        sizes="56px"
                        quality={70}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[1.0625rem] leading-tight">
                      {t.categories.names[collection.slug as keyof typeof t.categories.names]}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {fill(t.categories.productCount, { count: collection.count })}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href={localePath(locale, ROUTES.products)}
          onClick={onClose}
          className="mt-4 flex h-11 items-center justify-center rounded-[2px] bg-ink text-sm font-medium text-cream transition-colors hover:bg-ember"
        >
          {t.nav.allProducts}
        </Link>

        <p className="eyebrow mt-8">{t.occasions.eyebrow}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {OCCASIONS.map((occasion) => (
            <li key={occasion.slug}>
              <Link
                href={localePath(locale, ROUTES.occasion(occasion.slug))}
                onClick={onClose}
                className="flex h-10 items-center rounded-full border border-cream-300 px-3.5 text-[0.8125rem] transition-colors hover:border-ink hover:bg-ink hover:text-cream"
              >
                {t.occasions.names[occasion.slug]}
              </Link>
            </li>
          ))}
        </ul>

        <hr className="my-6 border-cream-300" />

        <ul className="space-y-1">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={localePath(locale, item.href)}
                onClick={onClose}
                className="-mx-2 flex items-center rounded-[2px] px-2 py-2.5 font-display text-lg transition-colors hover:text-ember"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={localePath(locale, ROUTES.faq)}
              onClick={onClose}
              className="-mx-2 flex items-center rounded-[2px] px-2 py-2.5 font-display text-lg transition-colors hover:text-ember"
            >
              {t.nav.faq}
            </Link>
          </li>
        </ul>

        <hr className="my-6 border-cream-300" />

        <div className="space-y-3 text-sm">
          <a
            href={CONTACT.phoneHref}
            onClick={() => trackClickPhone("mobile_menu")}
            className="flex items-center gap-3 text-ink-700 transition-colors hover:text-ember"
          >
            <Phone className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={1.5} aria-hidden />
            <span className="tabular-nums">{CONTACT.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-3 text-ink-700 transition-colors hover:text-ember"
          >
            <Mail className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={1.5} aria-hidden />
            {CONTACT.email}
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClickInstagram("mobile_menu")}
            className="flex items-center gap-3 text-ink-700 transition-colors hover:text-ember"
          >
            <InstagramIcon className="h-4 w-4 shrink-0 text-ink-400" />
            @wesmokefishmd
          </a>
        </div>

        <div className="mt-6">
          <LanguageSwitcher locale={locale} />
        </div>
      </nav>
    </Drawer>
  );
}
