import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";

/**
 * Contact form endpoint.
 *
 * Design notes:
 *
 * - Input is re-validated server-side with the same Zod schema the form uses.
 *   Nothing from the request body is trusted.
 * - The destination is a webhook URL read from a server-only environment
 *   variable (CONTACT_WEBHOOK_URL). It is never referenced in client code and
 *   is not prefixed with NEXT_PUBLIC_, so it cannot leak into the bundle.
 * - If no destination is configured the route returns 503 rather than
 *   pretending the message was delivered. A form that silently swallows
 *   enquiries loses real orders; the UI falls back to showing the phone
 *   number and email address instead.
 * - Validation failures return a generic message. Field-level detail is
 *   already provided by the client, and echoing server errors back only helps
 *   someone probing the endpoint.
 */

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request, "contact"), { limit: 5, windowMs: 60_000 });
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

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 422 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[contact] CONTACT_WEBHOOK_URL is not set — the contact form cannot deliver messages. See README."
    );
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "wesmokefish.md/contact",
        receivedAt: new Date().toISOString(),
        ...parsed.data,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } catch (error) {
    // Log server-side for debugging; never return the upstream detail.
    console.error("[contact] delivery failed:", error);
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
