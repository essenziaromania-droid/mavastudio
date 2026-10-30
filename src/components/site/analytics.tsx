"use client";
import { useEffect } from "react";

/**
 * Google Analytics 4, încărcat DOAR după ce vizitatorul acceptă cookie-urile de analiză
 * („Accept toate” în bannerul de cookies). ID-ul se setează în Vercel: NEXT_PUBLIC_GA_ID (G-XXXXXXX).
 * GA4 înregistrează singur schimbările de pagină din site (navigarea fără reîncărcare).
 */

export const CONSENT_KEY = "mava-cookie-consent";
export const CONSENT_EVENT = "mava-consent-change";
export const OPEN_CONSENT_EVENT = "mava-open-consent";

// ID-ul de măsurare nu este secret (apare oricum în codul paginii). Poate fi suprascris din Vercel.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-J0RES2TDBH";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function consented() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "all";
  } catch {
    return false;
  }
}

function load() {
  if (!GA_ID || document.getElementById("ga4")) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const s = document.createElement("script");
  s.id = "ga4";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Retrage acordul: oprește colectarea și șterge cookie-urile Google Analytics. */
function unload() {
  if (!GA_ID) return;
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
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
    if (consented()) load();
    const onChange = () => (consented() ? load() : unload());
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
