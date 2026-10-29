import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getLocale, pageMeta } from "@/lib/i18n-server";

const RO = `
Cookie-urile sunt fișiere mici salvate în browser, care ajută site-ul să funcționeze și ne arată cum este folosit.

## Ce cookie-uri folosim

- **Esențiale** – necesare pentru funcționarea site-ului, pentru a reține limba aleasă (cookie-ul \`mava_lang\`, valabil 1 an) și alegerea ta privind cookie-urile. Nu pot fi dezactivate.
- **De analiză** – ne ajută să înțelegem ce pagini sunt vizitate, în mod agregat. Sunt activate doar cu acordul tău.

## Cum îți gestionezi preferințele

Poți schimba oricând alegerea ștergând datele site-ului din browser; bannerul de cookie-uri va apărea din nou. De asemenea, poți bloca cookie-urile din setările browserului.

## Contact

Pentru întrebări: **contact@mavastudio.ro**.
`;

const EN = `
Cookies are small files stored in your browser that help the site work and show us how it is used.

## Which cookies we use

- **Essential** – needed for the site to work, to remember your chosen language (the \`mava_lang\` cookie, valid for 1 year) and your cookie choice. They cannot be switched off.
- **Analytics** – help us understand which pages are visited, in aggregate. They are only enabled with your consent.

## Managing your preferences

You can change your choice at any time by clearing this site's data in your browser; the cookie banner will appear again. You can also block cookies in your browser settings.

## Contact

For questions: **contact@mavastudio.ro**.
`;

const T = { ro: { title: "Politica de cookies", body: RO }, en: { title: "Cookie policy", body: EN } };

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/politica-cookies", locale, { title: T[locale].title });
}

export default function Page() {
  const locale = getLocale();
  return <LegalPage title={T[locale].title} updated="28.10.2026" body={T[locale].body} locale={locale} />;
}
