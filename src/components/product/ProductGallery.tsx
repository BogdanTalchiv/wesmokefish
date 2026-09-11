"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/catalog/types";
import { fill, getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Product gallery.
 *
 * Every product in the store currently has exactly one photograph, so the
 * single-image case is the primary design rather than an afterthought: no
 * empty thumbnail strip, no dead arrows. Thumbnails and keyboard navigation
 * appear automatically as soon as a product has more than one image in
 * Shopify, so richer photography drops straight in.
 */
export function ProductGallery({
  images,
  title,
  locale,
}: {
  images: ProductImage[];
  title: string;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="photo-well aspect-[4/5] w-full rounded-[3px]" aria-hidden />
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="photo-well relative aspect-[4/5] overflow-hidden rounded-[3px]">
        <Image
          key={current.url}
          src={current.url}
          alt={title}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1023px) 100vw, 46vw"
          quality={85}
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label={t.product.description}
        >
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={fill(t.product.imageOf, { index: i + 1, total: images.length })}
              onClick={() => setActive(i)}
              className={cn(
                "photo-well relative h-16 w-14 shrink-0 overflow-hidden rounded-[2px] transition-opacity",
                i === active ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"
              )}
            >
              <Image src={image.url} alt="" fill sizes="56px" quality={65} className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
