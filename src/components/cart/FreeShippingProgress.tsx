"use client";

import { Check, Truck } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { freeShippingMessage } from "@/lib/cart/freeShippingCopy";
import { cn, formatMoney } from "@/lib/utils";

/**
 * Free-delivery progress.
 *
 * The 1.200 MDL threshold is verified on wesmokefish.md/pages/livrare, so this
 * is a real, honest incentive rather than invented urgency.
 */
export function FreeShippingProgress({
  subtotal,
  amountRemaining,
  progress,
  unlocked,
  locale,
  className,
}: {
  subtotal: number;
  amountRemaining: number;
  progress: number;
  unlocked: boolean;
  locale: Locale;
  className?: string;
}) {
  const t = getDictionary(locale);

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "flex items-center gap-2 text-[0.8125rem] font-medium",
          unlocked ? "text-success" : "text-ink-700"
        )}
        aria-live="polite"
      >
        {unlocked ? (
          <Check className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
        ) : (
          <Truck className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={1.5} aria-hidden />
        )}
        {freeShippingMessage(amountRemaining, unlocked, t, (amount) =>
          formatMoney(amount, locale)
        )}
      </p>

      <div
        className="h-1 overflow-hidden rounded-full bg-cream-300"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t.cart.freeShippingReached}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 [transition-timing-function:var(--ease-out-soft)]",
            unlocked ? "bg-success" : "bg-ember"
          )}
          style={{ width: `${Math.max(progress * 100, subtotal > 0 ? 4 : 0)}%` }}
        />
      </div>
    </div>
  );
}
