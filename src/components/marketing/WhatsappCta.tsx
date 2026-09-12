"use client";

import { ButtonAnchor } from "@/components/ui/Button";
import { CONTACT } from "@/config/business";
import { trackClickWhatsapp } from "@/lib/analytics/events";
import { getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * WhatsApp CTA with click tracking.
 *
 * The number is the same verified shop phone. The event is `click_whatsapp`
 * so Meta/GA can tell a WhatsApp tap from a regular call.
 */
export function WhatsappCta({
  location,
  locale,
  variant = "outline",
  size = "md",
  className,
}: {
  location: string;
  locale: Locale;
  variant?: "primary" | "accent" | "outline" | "light" | "onDark" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const t = getDictionary(locale);

  return (
    <ButtonAnchor
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => trackClickWhatsapp(location)}
    >
      {t.contact.whatsapp}
    </ButtonAnchor>
  );
}
