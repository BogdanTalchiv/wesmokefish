export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export const CONSENT_STORAGE_KEY = "wsf.consent.v1";
export const CONSENT_EVENT = "wsf:consent-change";

export const DENIED: ConsentState = { necessary: true, analytics: false, marketing: false };
export const GRANTED: ConsentState = { necessary: true, analytics: true, marketing: true };

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Nothing we can do if storage is blocked; treat as session-only consent.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
  pushConsentToGoogle(state);
}

/**
 * Google Consent Mode v2. Defaults are denied and pushed before any tag loads,
 * so GA4/Ads stay in a cookieless state until the visitor opts in.
 */
export function pushConsentToGoogle(state: ConsentState) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  // gtag's consent command must be pushed as an arguments-style array.
  window.dataLayer.push([
    "consent",
    "update",
    {
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: state.marketing ? "granted" : "denied",
      ad_user_data: state.marketing ? "granted" : "denied",
      ad_personalization: state.marketing ? "granted" : "denied",
    },
  ]);
}
