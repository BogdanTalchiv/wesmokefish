"use client";

import { Phone } from "lucide-react";
import { ButtonAnchor } from "@/components/ui/Button";
import { CONTACT } from "@/config/business";
import { trackClickPhone } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

/**
 * Phone CTA with click tracking.
 *
 * Exists as a client component so server-rendered pages can drop in a
 * tracked call button without becoming client components themselves.
 */
export function PhoneCta({
  location,
  variant = "primary",
  size = "md",
  className,
  label,
}: {
  /** Where the click happened, e.g. "delivery_page". */
  location: string;
  variant?: "primary" | "accent" | "outline" | "light" | "onDark" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  return (
    <ButtonAnchor
      href={CONTACT.phoneHref}
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => trackClickPhone(location)}
    >
      <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      {label ?? CONTACT.phone}
    </ButtonAnchor>
  );
}
