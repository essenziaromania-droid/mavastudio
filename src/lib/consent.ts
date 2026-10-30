/** Constante comune pentru acordul de cookies și Google Analytics (folosite pe server și în browser). */

export const CONSENT_KEY = "mava-cookie-consent";
export const CONSENT_EVENT = "mava-consent-change";
export const OPEN_CONSENT_EVENT = "mava-open-consent";

// ID-ul de măsurare nu este secret (apare oricum în codul paginii). Poate fi suprascris din Vercel.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-J0RES2TDBH";
