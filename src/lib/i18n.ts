/**
 * Limbile site-ului public.
 *  - Română: adresele existente (/servicii, /proiecte …)
 *  - Engleză: prefix /en și nume de pagini în engleză (/en/services, /en/projects …)
 *
 * Paginile există o singură dată în cod (cele românești). Middleware-ul rescrie /en/... către pagina
 * românească echivalentă și trimite limba în header-ul `x-locale`.
 * Fișierul nu are dependențe de server, ca să poată fi folosit și în middleware și în componente client.
 */
export type Locale = "ro" | "en";

export const LOCALE_HEADER = "x-locale";
export const LOCALE_COOKIE = "mava_lang";

/** Prima parte a adresei: română → engleză. */
const PAGE_MAP: Record<string, string> = {
  servicii: "services",
  proiecte: "projects",
  "despre-noi": "about",
  contact: "contact",
  "incepe-un-proiect": "start-a-project",
  blog: "blog",
  "politica-de-confidentialitate": "privacy-policy",
  "termeni-si-conditii": "terms",
  "politica-cookies": "cookie-policy",
};

/** Paginile de servicii: slug românesc → slug englezesc. */
export const SERVICE_SLUGS: Record<string, string> = {
  "dezvoltare-website-uri": "website-development",
  "platforme-saas": "saas-platforms",
  "crm-automatizari": "crm-automation",
  "foto-video-produs-ai": "ai-product-photo-video",
  "editare-video": "video-editing",
  "administrare-social-media": "social-media-management",
};

const invert = (m: Record<string, string>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k]));
const PAGE_MAP_EN = invert(PAGE_MAP);
const SERVICE_SLUGS_EN = invert(SERVICE_SLUGS);

function splitSuffix(path: string): [string, string] {
  const i = path.search(/[?#]/);
  return i === -1 ? [path, ""] : [path.slice(0, i), path.slice(i)];
}

/**
 * Transformă o adresă românească (cum e scrisă în cod) în adresa pentru limba cerută.
 * Adresele care nu au variantă în engleză (ex. /oferta/...) rămân neschimbate.
 */
export function localePath(path: string, locale: Locale): string {
  if (locale === "ro" || !path.startsWith("/")) return path;
  const [base, suffix] = splitSuffix(path);
  if (base === "/" || base === "") return "/en" + suffix;
  const [first, second, ...rest] = base.slice(1).split("/");
  const enFirst = PAGE_MAP[first!];
  if (!enFirst) return path;
  const parts = [enFirst];
  if (second) parts.push(first === "servicii" ? SERVICE_SLUGS[second] ?? second : second);
  parts.push(...rest);
  return "/en/" + parts.join("/") + suffix;
}

/** Adresa /en/... → adresa românească internă. `null` dacă pagina nu există. */
export function internalPath(enPath: string): string | null {
  const base = enPath.replace(/^\/en/, "") || "/";
  if (base === "/") return "/";
  const [first, second, ...rest] = base.slice(1).split("/");
  const roFirst = PAGE_MAP_EN[first!];
  if (!roFirst) return null;
  const parts = [roFirst];
  if (second) parts.push(roFirst === "servicii" ? SERVICE_SLUGS_EN[second] ?? second : second);
  parts.push(...rest);
  return "/" + parts.join("/");
}

export const isEnglishPath = (p: string) => p === "/en" || p.startsWith("/en/");

/** Adresa aceleiași pagini în cealaltă limbă (pentru butonul RO / EN). */
export function counterpartPath(currentPath: string, target: Locale): string {
  if (isEnglishPath(currentPath)) return target === "en" ? currentPath : internalPath(currentPath) ?? "/";
  return target === "ro" ? currentPath : localePath(currentPath, "en");
}

/** Paginile site-ului public care au și variantă în engleză (folosit de middleware). */
export function hasEnglishVersion(roPath: string) {
  return roPath === "/" || localePath(roPath, "en") !== roPath;
}

/** Țările pentru care afișăm româna; restul lumii primește engleza. */
export const ROMANIAN_COUNTRIES = ["RO", "MD"];
