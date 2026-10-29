import "server-only";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { LOCALE_HEADER, localePath, type Locale } from "@/lib/i18n";
import { SITE } from "@/content/site";

/** Limba cererii curente (setată de middleware). */
export function getLocale(): Locale {
  return headers().get(LOCALE_HEADER) === "en" ? "en" : "ro";
}

/** Link-uri canonical + hreflang pentru o pagină (adresa românească internă). */
export function alternates(roPath: string, locale: Locale): Metadata["alternates"] {
  const ro = `${SITE.url}${roPath === "/" ? "" : roPath}`;
  const en = `${SITE.url}${localePath(roPath, "en")}`;
  return { canonical: locale === "en" ? en : ro, languages: { ro, en, "x-default": ro } };
}

/** Metadata standard pentru o pagină a site-ului: titlu, descriere, hreflang și locale Open Graph. */
export function pageMeta(roPath: string, locale: Locale, m: { title?: string; description?: string; images?: string[] }): Metadata {
  return {
    title: m.title,
    description: m.description,
    alternates: alternates(roPath, locale),
    openGraph: { locale: locale === "en" ? "en_US" : "ro_RO", images: m.images },
  };
}
