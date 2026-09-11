import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation/contact";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";

/**
 * Newsletter signup endpoint.
 *
 * Same posture as the contact route: server-side re-validation, rate
 * limiting, a server-only destination env var, and an honest 503 when no
 * destination is configured rather than a fake success.
 *
 * NEWSLETTER_WEBHOOK_URL should point at whichever list the owner actually
 * uses (Mailchimp, Brevo, a Google Sheet via Zapier). Keeping it as a webhook
 * means no provider SDK and no provider API key in this codebase.
 */

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "newsletter"), { limit: 5, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 422 });
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[newsletter] NEWSLETTER_WEBHOOK_URL is not set — signups cannot be stored. See README."
    );
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "wesmokefish.md/newsletter",
        subscribedAt: new Date().toISOString(),
        email: parsed.data.email,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } catch (error) {
    console.error("[newsletter] delivery failed:", error);
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
