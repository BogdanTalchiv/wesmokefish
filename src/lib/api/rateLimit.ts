/**
 * Minimal in-memory rate limiter for the public form routes.
 *
 * Scope and limits of this approach, stated plainly so nobody mistakes it for
 * more than it is: the counters live in the process memory of a single
 * instance. On a serverless or multi-region deployment each instance keeps its
 * own counters, so the effective limit is per instance, and everything resets
 * on cold start.
 *
 * That is deliberate. It costs nothing, needs no extra service, and is enough
 * to stop a naive script from hammering the contact form. If these endpoints
 * ever need a real guarantee, swap the body of `rateLimit` for a shared store
 * (Upstash Redis, Vercel KV) — the signature is designed to stay the same.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Drop expired buckets so the map cannot grow without bound. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the caller may retry. Only meaningful when `ok` is false. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client identifier.
 *
 * `x-forwarded-for` is client-controllable in general, but behind a trusted
 * proxy (Vercel, Cloudflare) the left-most entry is the real client. Since
 * this limiter is a courtesy rather than a security control, that is an
 * acceptable trade-off.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
