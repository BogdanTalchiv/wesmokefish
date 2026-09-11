"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { trackContact } from "@/lib/analytics/events";
import { CONTACT } from "@/config/business";
import { fill, getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Contact form.
 *
 * Validated on the client with the same Zod schema the API route uses, so the
 * rules can never drift apart. The server re-validates regardless — client
 * validation is a convenience, never a trust boundary.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contact.form;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(values: ContactInput) {
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Request failed");
      trackContact("form", "contact_page");
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[3px] bg-cream-100 p-7 text-center" role="status">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-success/12 text-success">
          <Check className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <p className="mt-4 font-display text-lg">{t.successTitle}</p>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-500">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field
        id="contact-name"
        label={t.name}
        placeholder={t.namePlaceholder}
        autoComplete="name"
        error={errors.name && t.errors.nameMin}
        {...register("name")}
      />
      <Field
        id="contact-email"
        type="email"
        label={t.email}
        placeholder={t.emailPlaceholder}
        autoComplete="email"
        error={errors.email && t.errors.emailInvalid}
        {...register("email")}
      />
      <Field
        id="contact-phone"
        type="tel"
        label={`${t.phone} (${t.optional})`}
        placeholder={t.phonePlaceholder}
        autoComplete="tel"
        error={errors.phone && t.errors.phoneInvalid}
        {...register("phone")}
      />

      <div>
        <label htmlFor="contact-message" className="block text-[0.8125rem] font-medium text-ink-700">
          {t.message}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder={t.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(
            "mt-1.5 w-full resize-y rounded-[2px] border bg-cream px-3.5 py-2.5 text-[0.9375rem] outline-none transition-colors placeholder:text-ink-400",
            errors.message ? "border-ember focus:border-ember" : "border-cream-300 focus:border-ink"
          )}
          {...register("message")}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-xs text-ember-600">
            {t.errors.messageMin}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={status === "sending"} className="w-full">
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
            {t.submitting}
          </>
        ) : (
          t.submit
        )}
      </Button>

      {/*
        On failure we hand the shopper the phone number and email instead of a
        dead end, because a lost enquiry is a lost order.
      */}
      {status === "error" && (
        <p role="alert" className="text-[0.8125rem] leading-relaxed text-ember-600">
          {fill(t.errorBody, { phone: CONTACT.phone, email: CONTACT.email })}
        </p>
      )}

      <p className="text-xs leading-relaxed text-ink-400">{t.privacyNote}</p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.8125rem] font-medium text-ink-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-1.5 h-11 w-full rounded-[2px] border bg-cream px-3.5 text-[0.9375rem] outline-none transition-colors placeholder:text-ink-400",
          error ? "border-ember focus:border-ember" : "border-cream-300 focus:border-ink"
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-ember-600">
          {error}
        </p>
      )}
    </div>
  );
}
