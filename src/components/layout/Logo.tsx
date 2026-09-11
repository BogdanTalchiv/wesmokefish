import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/navigation";

/**
 * Wordmark. Set as type rather than the current bitmap logo so it stays sharp
 * at every size and adds no image request to the critical path. Swap in the
 * brand's vector logo here when one is available.
 */
export function Logo({
  locale,
  className,
  onDark = false,
}: {
  locale: Locale;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href={localePath(locale, ROUTES.home)}
      aria-label="WeSmokeFish"
      className={cn(
        "font-display text-[1.0625rem] leading-none font-semibold tracking-[-0.02em] transition-opacity hover:opacity-70 sm:text-[1.1875rem]",
        onDark ? "text-cream" : "text-ink",
        className
      )}
    >
      WeSmoke
      <span className={onDark ? "text-ember" : "text-ember"}>Fish</span>
    </Link>
  );
}
