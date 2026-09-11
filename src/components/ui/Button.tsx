import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  [
    "relative inline-flex items-center justify-center gap-2 select-none",
    "font-sans font-medium whitespace-nowrap",
    "transition-[background-color,color,border-color,transform,opacity] duration-200",
    "[transition-timing-function:var(--ease-out-soft)]",
    "active:scale-[0.985]",
    "disabled:pointer-events-none disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        primary: "bg-ink text-cream hover:bg-ink-800",
        accent: "bg-ember text-white hover:bg-ember-600",
        outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-cream",
        ghost: "text-ink hover:bg-ink/[0.06]",
        light: "bg-cream text-ink hover:bg-cream-200",
        onDark: "border border-cream/25 text-cream hover:bg-cream hover:text-ink",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem] rounded-[2px]",
        md: "h-11 px-6 text-sm rounded-[2px]",
        lg: "h-[3.25rem] px-8 text-[0.9375rem] rounded-[2px]",
        icon: "h-10 w-10 rounded-full",
      },
      full: {
        true: "w-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, full, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(button({ variant, size, full }), className)}
      {...props}
    />
  );
});

type ButtonLinkProps = React.ComponentPropsWithoutRef<typeof Link> & ButtonVariants;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { className, variant, size, full, ...props },
  ref
) {
  return (
    <Link ref={ref} className={cn(button({ variant, size, full }), className)} {...props} />
  );
});

/** For external destinations (tel:, mailto:, social) where Link is wrong. */
export function ButtonAnchor({
  className,
  variant,
  size,
  full,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & ButtonVariants) {
  return <a className={cn(button({ variant, size, full }), className)} {...props} />;
}

export { button as buttonStyles };
