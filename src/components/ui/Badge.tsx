import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  /**
   * `bestseller` and `new` are derived from real data (curated bestseller list,
   * product creation date). There is deliberately no "low stock" or "ending
   * soon" variant — the store has no inventory or offer data to back it up.
   */
  tone?: "bestseller" | "new" | "neutral";
  className?: string;
};

const TONES = {
  bestseller: "bg-ink text-cream",
  new: "bg-ember text-white",
  neutral: "bg-cream-200 text-ink-700",
} as const;

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-[0.625rem] font-semibold tracking-[0.1em] uppercase",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
