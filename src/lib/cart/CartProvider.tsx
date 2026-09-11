"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { CartAction, CartLine, CartState } from "./types";
import { getProductBySlug, getVariantById } from "@/lib/catalog";
import type { Product, ProductVariant } from "@/lib/catalog/types";
import { DELIVERY } from "@/config/business";
import {
  toAnalyticsItem,
  trackAddToCart,
  trackRemoveFromCart,
  trackViewCart,
} from "@/lib/analytics/events";

const STORAGE_KEY = "wsf.cart.v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };

    case "add": {
      const existing = state.lines.find((l) => l.variantId === action.variantId);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.variantId === action.variantId
              ? { ...l, quantity: l.quantity + action.quantity }
              : l
          ),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            variantId: action.variantId,
            productSlug: action.productSlug,
            quantity: action.quantity,
          },
        ],
      };
    }

    case "setQuantity": {
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.variantId !== action.variantId) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.variantId === action.variantId ? { ...l, quantity: action.quantity } : l
        ),
      };
    }

    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.variantId !== action.variantId) };

    case "clear":
      return { ...state, lines: [] };

    default:
      return state;
  }
}

/** A cart line joined with its live catalog data. */
export type ResolvedCartLine = {
  variantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
  lineTotal: number;
};

type CartContextValue = {
  lines: ResolvedCartLine[];
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  /** Remaining amount needed to unlock free delivery; 0 when already unlocked. */
  amountToFreeShipping: number;
  freeShippingUnlocked: boolean;
  freeShippingProgress: number;
  isOpen: boolean;
  /** Variant id of the most recent add, for the "added" confirmation state. */
  lastAdded: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, productSlug: string, quantity?: number, options?: { open?: boolean }) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read the persisted cart once on mount.
  useEffect(() => {
    let lines: CartLine[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        // Drop any line whose variant no longer exists in the catalog.
        lines = parsed.filter(
          (l) =>
            l &&
            typeof l.variantId === "string" &&
            typeof l.quantity === "number" &&
            l.quantity > 0 &&
            Boolean(getVariantById(l.variantId))
        );
      }
    } catch {
      lines = [];
    }
    dispatch({ type: "hydrate", lines });
  }, []);

  // Persist on change, once hydrated.
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage can be unavailable (private mode, quota). The cart still works
      // for this session, so failing silently is the right behaviour here.
    }
  }, [state.lines, state.hydrated]);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const lines = useMemo<ResolvedCartLine[]>(() => {
    return state.lines.flatMap((line) => {
      const resolved = getVariantById(line.variantId);
      if (!resolved) return [];
      const product = getProductBySlug(resolved.product.slug) ?? resolved.product;
      return [
        {
          variantId: line.variantId,
          quantity: line.quantity,
          product,
          variant: resolved.variant,
          lineTotal: Math.round(resolved.variant.price * line.quantity * 100) / 100,
        },
      ];
    });
  }, [state.lines]);

  const subtotal = useMemo(
    () => Math.round(lines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100,
    [lines]
  );

  const itemCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);

  const threshold = DELIVERY.freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, Math.round((threshold - subtotal) * 100) / 100);
  const freeShippingUnlocked = subtotal >= threshold;
  const freeShippingProgress = Math.min(1, threshold > 0 ? subtotal / threshold : 0);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  /*
    Fire view_cart once per drawer opening.

    The guard ref is reset on close, so re-opening reports again but changing
    quantities while the drawer is open does not — GA4 would otherwise see a
    view_cart for every increment and the funnel numbers would be nonsense.
  */
  const viewCartReported = useRef(false);
  useEffect(() => {
    if (!isOpen) {
      viewCartReported.current = false;
      return;
    }
    if (viewCartReported.current || lines.length === 0) return;
    viewCartReported.current = true;
    trackViewCart(lines.map((l) => toAnalyticsItem(l.product, l.variant, l.quantity)));
  }, [isOpen, lines]);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (variantId, productSlug, quantity = 1, options) => {
      const resolved = getVariantById(variantId);
      if (!resolved) return;

      dispatch({ type: "add", variantId, productSlug, quantity });

      trackAddToCart([toAnalyticsItem(resolved.product, resolved.variant, quantity)]);

      setLastAdded(variantId);
      if (addedTimer.current) clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setLastAdded(null), 2000);

      if (options?.open !== false) setIsOpen(true);
    },
    []
  );

  const setQuantity = useCallback<CartContextValue["setQuantity"]>((variantId, quantity) => {
    dispatch({ type: "setQuantity", variantId, quantity });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>(
    (variantId) => {
      const resolved = getVariantById(variantId);
      // remove_from_cart must report the quantity actually removed, so the
      // line is looked up before dispatching.
      const line = lines.find((l) => l.variantId === variantId);
      if (resolved && line) {
        trackRemoveFromCart([toAnalyticsItem(resolved.product, resolved.variant, line.quantity)]);
      }
      dispatch({ type: "remove", variantId });
    },
    [lines]
  );

  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      hydrated: state.hydrated,
      itemCount,
      subtotal,
      amountToFreeShipping,
      freeShippingUnlocked,
      freeShippingProgress,
      isOpen,
      lastAdded,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [
      lines,
      state.hydrated,
      itemCount,
      subtotal,
      amountToFreeShipping,
      freeShippingUnlocked,
      freeShippingProgress,
      isOpen,
      lastAdded,
      openCart,
      closeCart,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>.");
  return ctx;
}
