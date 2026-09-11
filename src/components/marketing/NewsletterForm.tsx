"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { trackNewsletterSignup } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

/**
 * Newsletter capture.
 *
 * Deliberately built with native form validation instead of React Hook Form
 * and Zod. This component sits in the footer, which is in the root layout, so
 * whatever it imports is downloaded on every page of the site — and those two
 * libraries cost about 99 KB gzipped to validate a single email field. The
 * contact page, which has four fields and real conditional rules, does use
 * them; it is one route, so the cost is paid only there.
 *
 * The server re-validates with Zod regardless (see /api/newsletter), so this
 * is a convenience layer, not the trust boundary.
 *
 * NEEDS_OWNER_INPUT — no email platform is connected yet. The route forwards
 * to NEWSLETTER_WEBHOOK_URL; until that is set it answers 503 and this form
 * says so, because showing "you're subscribed" over a request that stored
 * nothing would lose real subscribers and fire an analytics event for
 * something that never happened.
 */
export function NewsletterForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Same shape the server enforces: a plausible address, sanely sized.
    const value = email.trim();
    const looksValid = value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (!looksValid) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!response.ok) throw new Error(`Signup failed: ${response.status}`);
      // Only fired once the subscription was actually recorded.
      trackNewsletterSignup();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div>
        <p className="text-[0.8125rem] font-medium text-cream">{t.newsletter.title}</p>
        <p className="mt-2 text-[0.8125rem] text-ember" role="status">
          {t.newsletter.success}
        </p>
      </div>
    );
  }

  const message =
    status === "invalid" ? t.newsletter.error : status === "error" ? t.newsletter.unavailable : null;

  return (
    <div>
      <p className="text-[0.8125rem] font-medium text-cream">{t.newsletter.title}</p>
      <p className="mt-1 text-[0.8125rem] text-cream/55">{t.newsletter.body}</p>

      <form onSubmit={onSubmit} noValidate className="mt-3.5">
        <div className="flex items-center border-b border-cream/25 transition-colors focus-within:border-ember">
          <label htmlFor="newsletter-email" className="sr-only">
            {t.newsletter.placeholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            maxLength={160}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "invalid" || status === "error") setStatus("idle");
            }}
            placeholder={t.newsletter.placeholder}
            aria-invalid={status === "invalid"}
            aria-describedby={message ? "newsletter-message" : undefined}
            className={cn(
              "min-w-0 flex-1 bg-transparent py-2.5 text-sm text-cream outline-none",
              "placeholder:text-cream/35"
            )}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            aria-label={t.newsletter.submit}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-cream/70 transition-colors hover:bg-ember hover:text-white disabled:opacity-50"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        {message && (
          <p id="newsletter-message" role="alert" className="mt-2 text-xs text-ember">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
