import { fill, type Dictionary } from "@/lib/i18n";

/** Within this remaining amount, the copy tightens — "încă puțin". */
export const FREE_SHIPPING_CLOSE_MDL = 300;

export function freeShippingMessage(
  remaining: number,
  unlocked: boolean,
  t: Dictionary,
  formatAmount: (amount: number) => string
): string {
  if (unlocked || remaining <= 0) return t.cart.freeShippingReached;
  if (remaining <= FREE_SHIPPING_CLOSE_MDL) {
    return fill(t.cart.freeShippingClose, { amount: formatAmount(remaining) });
  }
  return fill(t.cart.freeShippingProgress, { amount: formatAmount(remaining) });
}
