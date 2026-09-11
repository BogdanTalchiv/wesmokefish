/**
 * Social glyphs.
 *
 * Lucide removed brand icons from its set, so these are drawn locally. Keeping
 * them as inline SVG also means zero extra requests and no icon-font payload.
 */

type IconProps = {
  className?: string;
};

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" strokeWidth={2.25} />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.02-2.82h-3.1v12.3a2.59 2.59 0 1 1-1.85-2.48V9.66a5.68 5.68 0 1 0 4.95 5.63V8.9a7.32 7.32 0 0 0 4.27 1.37V7.16a4.25 4.25 0 0 1-3.25-1.34Z" />
    </svg>
  );
}

export function WhatsappIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.45 0 9.89-4.44 9.89-9.9 0-2.64-1.03-5.12-2.9-6.99A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.06-.19-.31a8.17 8.17 0 0 1-1.25-4.35c0-4.54 3.69-8.24 8.22-8.24Zm-2.4 4.1c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.13.16 1.74 2.78 4.31 3.79 2.13.84 2.57.67 3.03.63.46-.04 1.49-.61 1.7-1.2.21-.6.21-1.1.15-1.21-.06-.1-.23-.17-.48-.29-.25-.13-1.49-.74-1.72-.82-.23-.09-.4-.13-.57.12-.17.25-.65.83-.8 1-.14.16-.29.19-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.66-1.25-1.48-1.4-1.73-.14-.25-.01-.39.11-.51.11-.11.25-.29.38-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.37-.77-1.87-.2-.48-.4-.49-.56-.5h-.5Z" />
    </svg>
  );
}
