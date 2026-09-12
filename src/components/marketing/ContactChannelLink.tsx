"use client";

import { trackClickPhone, trackClickWhatsapp } from "@/lib/analytics/events";

/**
 * Contact row that fires the matching analytics event. Phone and WhatsApp
 * are the two that need a named event; email and maps are ordinary clicks.
 */
export function ContactChannelLink({
  href,
  method,
  location,
  children,
  className,
}: {
  href: string;
  method?: "phone" | "whatsapp";
  location: string;
  children: React.ReactNode;
  className?: string;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => {
        if (method === "phone") trackClickPhone(location);
        if (method === "whatsapp") trackClickWhatsapp(location);
      }}
    >
      {children}
    </a>
  );
}
