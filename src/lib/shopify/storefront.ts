import { SHOPIFY } from "@/config/business";

/**
 * Shopify Storefront API client — optional upgrade path.
 *
 * The storefront works without any credentials: the catalog comes from the
 * synced snapshot and checkout is a cart permalink. Setting the two env vars
 * below turns on live cart creation, which additionally gives you Shopify
 * abandoned-cart recovery and server-resolved pricing inside the cart drawer.
 *
 *   SHOPIFY_STORE_DOMAIN=xxxxx.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_... (public storefront token)
 *
 * Never put an Admin API token here — this module is server-only and even so,
 * only the public Storefront token is appropriate.
 */

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export function isStorefrontApiConfigured(): boolean {
  return Boolean(STORE_DOMAIN && ACCESS_TOKEN);
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!isStorefrontApiConfigured()) {
    throw new Error("Shopify Storefront API is not configured.");
  }

  const res = await fetch(
    `https://${STORE_DOMAIN}/api/${SHOPIFY.storefrontApiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error(`Storefront API error: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Storefront API error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) {
    throw new Error("Storefront API returned no data.");
  }

  return json.data;
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  subtotal: number;
  currency: string;
};

/**
 * Creates a real Shopify cart and returns its hosted checkout URL.
 * Callers should fall back to `buildCartPermalink` if this throws.
 */
export async function createStorefrontCart(
  lines: Array<{ variantGid: string; quantity: number }>
): Promise<StorefrontCart> {
  type Result = {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        cost: { subtotalAmount: { amount: string; currencyCode: string } };
      } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  };

  const data = await storefrontFetch<Result>(CART_CREATE, {
    lines: lines.map((line) => ({ merchandiseId: line.variantGid, quantity: line.quantity })),
  });

  const { cart, userErrors } = data.cartCreate;

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join("; "));
  }
  if (!cart) {
    throw new Error("Shopify did not return a cart.");
  }

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    subtotal: Number(cart.cost.subtotalAmount.amount),
    currency: cart.cost.subtotalAmount.currencyCode,
  };
}
