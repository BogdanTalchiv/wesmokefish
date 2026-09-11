"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search as SearchIcon, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { SearchDrawer } from "@/components/navigation/SearchDrawer";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { useCart } from "@/lib/cart/CartProvider";
import { getAllCollections } from "@/lib/catalog";
import { CATEGORY_TILES } from "@/data/merchandising";
import { COLLECTION_ORDER, ROUTES, getPrimaryNav } from "@/config/navigation";
import { fill, getDictionary, localePath, stripLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Premium sticky header.
 *
 * Compacts on scroll (shorter bar, hairline border, translucent background)
 * so it stays out of the way on mobile while keeping search and cart within
 * thumb reach at all times.
 */
export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const { itemCount, openCart, hydrated } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nav = getPrimaryNav(t);
  const collections = getAllCollections();
  const ordered = COLLECTION_ORDER.map((slug) => collections.find((c) => c.slug === slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  const { path: currentPath } = stripLocale(pathname ?? "/");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
    Close the dropdown and mobile menu when the route changes.

    Done during render rather than in an effect — React's documented pattern
    for adjusting state when an input changes. It also closes the menu in the
    same commit as the new page, instead of leaving it open for one painted
    frame after navigation.
  */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setProductsOpen(false);
    setMenuOpen(false);
  }

  // Cmd/Ctrl+K opens search — a small nicety for desktop shoppers.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Escape closes the dropdown; clicking outside does too.
  useEffect(() => {
    if (!productsOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setProductsOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) setProductsOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [productsOpen]);

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setProductsOpen(true);
  }
  function scheduleCloseDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setProductsOpen(false), 140);
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[height,background-color,border-color,backdrop-filter] duration-300",
          "[transition-timing-function:var(--ease-out-soft)]",
          scrolled
            ? "h-14 border-b border-cream-300 bg-cream/85 backdrop-blur-xl"
            : "h-[var(--spacing-header)] border-b border-transparent bg-cream"
        )}
      >
        <div className="container-page h-full">
          <div className="flex h-full items-center justify-between gap-4">
            {/* Left: mobile menu + desktop nav */}
            <div className="flex flex-1 items-center gap-1 lg:gap-7">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t.nav.openMenu}
                className="-ml-2.5 grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] lg:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </button>

              <nav aria-label={t.nav.menu} className="hidden items-center gap-7 lg:flex">
                {/* Products, with a category dropdown */}
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={openDropdown}
                  onMouseLeave={scheduleCloseDropdown}
                >
                  <Link
                    href={localePath(locale, ROUTES.products)}
                    aria-expanded={productsOpen}
                    aria-haspopup="true"
                    onFocus={openDropdown}
                    className={cn(
                      "flex items-center gap-1.5 py-2 text-[0.8125rem] font-medium tracking-[0.01em] transition-colors",
                      currentPath.startsWith("/produse") || currentPath.startsWith("/colectii")
                        ? "text-ink"
                        : "text-ink-700 hover:text-ink"
                    )}
                  >
                    {t.nav.products}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        productsOpen && "rotate-180"
                      )}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </Link>

                  {productsOpen && (
                    <div className="absolute top-full left-0 z-50 pt-3 motion-safe:animate-[dropdown-in_180ms_var(--ease-out-soft)]">
                      <div className="w-[38rem] rounded-[4px] border border-cream-300 bg-cream p-3 shadow-[0_20px_60px_-20px_rgba(20,17,16,0.28)]">
                        <div className="grid grid-cols-3 gap-2.5">
                          {ordered.map((collection) => {
                            const tile = CATEGORY_TILES.find(
                              (x) => x.collectionSlug === collection.slug
                            );
                            return (
                              <Link
                                key={collection.slug}
                                href={localePath(locale, ROUTES.collection(collection.slug))}
                                className="group/tile block overflow-hidden rounded-[3px]"
                              >
                                <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                                  {tile && (
                                    <Image
                                      src={tile.image}
                                      alt=""
                                      fill
                                      sizes="200px"
                                      quality={72}
                                      className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-soft)] group-hover/tile:scale-105"
                                    />
                                  )}
                                </div>
                                <div className="pt-2.5 pb-1">
                                  <p className="text-[0.8125rem] font-medium transition-colors group-hover/tile:text-ember">
                                    {
                                      t.categories.names[
                                        collection.slug as keyof typeof t.categories.names
                                      ]
                                    }
                                  </p>
                                  <p className="mt-0.5 text-[0.6875rem] text-ink-400">
                                    {fill(t.categories.productCount, { count: collection.count })}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        <Link
                          href={localePath(locale, ROUTES.products)}
                          className="mt-1 flex h-10 items-center justify-center rounded-[2px] bg-cream-100 text-[0.8125rem] font-medium transition-colors hover:bg-ink hover:text-cream"
                        >
                          {t.nav.allProducts}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {nav.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={localePath(locale, item.href)}
                    className={cn(
                      "py-2 text-[0.8125rem] font-medium tracking-[0.01em] transition-colors",
                      currentPath === item.href ? "text-ink" : "text-ink-700 hover:text-ink"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: wordmark */}
            <div className="flex shrink-0 justify-center">
              <Logo locale={locale} />
            </div>

            {/* Right: language, search, cart */}
            <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
              <LanguageSwitcher locale={locale} className="mr-2 hidden sm:flex" />

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label={t.search.open}
                className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
              >
                <SearchIcon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden />
              </button>

              <button
                type="button"
                onClick={openCart}
                aria-label={
                  itemCount > 0
                    ? `${t.cart.open} — ${fill(t.cart.itemCount, { count: itemCount })}`
                    : t.cart.open
                }
                className="relative -mr-2.5 grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
              >
                <ShoppingBag className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden />
                {/*
                  Rendered only after hydration so the server HTML and the
                  first client render agree, avoiding a hydration mismatch.
                */}
                {hydrated && itemCount > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-ember px-1 text-[0.625rem] font-semibold tabular-nums text-white"
                    aria-hidden
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} locale={locale} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} locale={locale} />
    </>
  );
}
