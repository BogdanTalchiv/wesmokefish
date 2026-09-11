"use client";

import { InstagramIcon, TikTokIcon } from "./SocialIcons";
import { SOCIAL } from "@/config/business";
import { trackClickInstagram, trackClickTiktok } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

/**
 * Social links with click tracking.
 *
 * A client component so any server-rendered page can include tracked social
 * icons. Only the accounts that actually exist in SOCIAL are rendered —
 * Facebook is null there, so no dead icon appears.
 */
export function SocialLinks({
  className,
  tone = "light",
  location,
}: {
  className?: string;
  /** `light` for dark backgrounds, `dark` for the cream background. */
  tone?: "light" | "dark";
  /** Where the click happened, e.g. "footer". */
  location: string;
}) {
  const links = [
    {
      href: SOCIAL.instagram,
      label: "Instagram",
      Icon: InstagramIcon,
      onClick: () => trackClickInstagram(location),
    },
    {
      href: SOCIAL.tiktok,
      label: "TikTok",
      Icon: TikTokIcon,
      onClick: () => trackClickTiktok(location),
    },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {links.map(({ href, label, Icon, onClick }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={onClick}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full border transition-colors",
            tone === "light"
              ? "border-cream/15 text-cream/75 hover:border-ember hover:bg-ember hover:text-white"
              : "border-cream-300 text-ink-500 hover:border-ember hover:bg-ember hover:text-white"
          )}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
