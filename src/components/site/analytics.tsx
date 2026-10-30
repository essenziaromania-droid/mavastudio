"use client";
import { useEffect } from "react";
import { CONSENT_EVENT, CONSENT_KEY, OPEN_CONSENT_EVENT } from "@/lib/consent";

/**
 * Actualizează acordul în Google Analytics (Consent Mode v2) când vizitatorul alege în bannerul de cookies.
 * Eticheta propriu-zisă e în HTML (ga-tag.tsx), cu stocarea dezactivată implicit.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function granted() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "all";
  } catch {
    return false;
  }
}

/** La retragerea acordului: oprește stocarea și șterge cookie-urile Google Analytics. */
function clearGaCookies() {
  const domain = location.hostname.replace(/^www\./, "");
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]!.trim();
    if (name.startsWith("_ga")) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  });
}

export function Analytics() {
  useEffect(() => {
    const onChange = () => {
      const ok = granted();
      window.gtag?.("consent", "update", { analytics_storage: ok ? "granted" : "denied" });
      if (!ok) clearGaCookies();
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);
  return null;
}

/** Link din subsol: redeschide bannerul de cookies, ca vizitatorul să-și schimbe alegerea. */
export function CookieSettingsLink({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      {label}
    </button>
  );
}
