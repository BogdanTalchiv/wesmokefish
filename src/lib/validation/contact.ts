import { z } from "zod";

/**
 * Shared validation schemas for the public forms.
 *
 * Imported by both the client component and the API route so the rules can
 * never drift apart. The server always re-validates: client-side checks are
 * there to give fast feedback, not to be trusted.
 */

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  // Optional, but if given it must look like a phone number. Moldovan numbers
  // get written many ways (+373…, 0…, with spaces), so this stays permissive
  // about formatting and strict only about length and character set.
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+\d][\d\s().-]{5,}$/, "invalid_phone")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(160),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
