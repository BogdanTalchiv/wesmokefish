import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type Crumb = {
  name: string;
  /** Locale-free path. Omit on the last crumb. */
  path?: string;
};

export function Breadcrumbs({
  items,
  locale,
  className,
}: {
  items: Crumb[];
  locale: Locale;
  className?: string;
}) {
  const t = getDictionary(locale);

  return (
    <nav aria-label={t.common.breadcrumb} className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.75rem] text-ink-400">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
              {item.path && !last ? (
                <Link href={localePath(locale, item.path)} className="transition-colors hover:text-ink">
                  {item.name}
                </Link>
              ) : (
                <span className={last ? "text-ink-700" : undefined} aria-current={last ? "page" : undefined}>
                  {item.name}
                </span>
              )}
              {!last && <ChevronRight className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
