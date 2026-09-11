import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  sub?: string;
  /** Optional "view all" style link on the right. */
  action?: { label: string; href: string };
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  /** Heading level — keeps the document outline correct per page. */
  as?: "h2" | "h3";
  /** Set when a parent <section> references this heading via aria-labelledby. */
  headingId?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
  align = "left",
  onDark = false,
  className,
  as: Tag = "h2",
  headingId,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "sm:text-center")}>
        {eyebrow && (
          <p className={cn("eyebrow", onDark && "text-cream/45")}>{eyebrow}</p>
        )}
        <Tag
          id={headingId}
          className={cn(
            "mt-2.5 text-(length:--text-display-sm) leading-[1.05]",
            onDark ? "text-cream" : "text-ink"
          )}
        >
          {title}
        </Tag>
        {sub && (
          <p
            className={cn(
              "mt-3.5 max-w-[46ch] text-[0.9375rem] leading-relaxed",
              onDark ? "text-cream/65" : "text-ink-500"
            )}
          >
            {sub}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 border-b pb-1 text-[0.8125rem] font-medium transition-colors",
            onDark
              ? "border-cream/25 text-cream hover:border-ember hover:text-ember"
              : "border-ink/20 text-ink hover:border-ember hover:text-ember"
          )}
        >
          {action.label}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.75}
            aria-hidden
          />
        </Link>
      )}
    </Reveal>
  );
}
