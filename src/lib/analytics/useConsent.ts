"use client";

import { useSyncExternalStore } from "react";
import {
  CONSENT_EVENT,
  CONSENT_STORAGE_KEY,
  DENIED,
  readConsent,
  type ConsentState,
} from "./consent";

/**
 * Subscribes to the visitor's cookie-consent choice.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: consent lives
 * in localStorage, which is an external store, and this is the hook React
 * provides for exactly that. It also guarantees the server snapshot is
 * "denied", so the first paint never assumes consent that has not been given.
 *
 * The snapshot is cached against the raw stored string because
 * `useSyncExternalStore` compares snapshots by identity — returning a freshly
 * parsed object on every call would loop forever.
 */

let cachedRaw: string | null = null;
let cachedSnapshot: ConsentState = DENIED;

function getSnapshot(): ConsentState {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    // Storage blocked — stay denied.
    return DENIED;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = readConsent() ?? DENIED;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): ConsentState {
  return DENIED;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  // Keeps other tabs in sync if the visitor changes their mind elsewhere.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
