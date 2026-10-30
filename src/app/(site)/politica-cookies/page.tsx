import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getLocale, pageMeta } from "@/lib/i18n-server";

const RO = `
Cookie-urile sunt fișiere mici salvate în browser, care ajută site-ul să funcționeze și ne arată cum este folosit.

## Ce cookie-uri folosim

- **Esențiale** – necesare pentru funcționarea site-ului, pentru a reține limba aleasă (cookie-ul \`mava_lang\`, valabil 1 an) și alegerea ta privind cookie-urile. Nu pot fi dezactivate.
- **De analiză** – Google Analytics 4 (cookie-urile \`_ga\` și \`_ga_*\`, valabile până la 2 ani), furnizat de Google Ireland Limited. Ne arată, în mod agregat, ce pagini sunt vizitate și de unde vin vizitatorii. Cookie-urile de analiză se salvează doar dacă alegi „Accept toate”. Fără acordul tău, folosim modul de consimțământ Google (Consent Mode): nu se salvează cookie-uri, iar Google primește doar semnale tehnice agregate, care nu te identifică.

## Cum îți gestionezi preferințele

Poți schimba oricând alegerea din link-ul **Setări cookies** din subsolul site-ului. Dacă retragi acordul, colectarea se oprește și cookie-urile de analiză sunt șterse. De asemenea, poți bloca cookie-urile din setările browserului.

## Contact

Pentru întrebări: **contact@mavastudio.ro**.
`;

const EN = `
Cookies are small files stored in your browser that help the site work and show us how it is used.

## Which cookies we use

- **Essential** – needed for the site to work, to remember your chosen language (the \`mava_lang\` cookie, valid for 1 year) and your cookie choice. They cannot be switched off.
- **Analytics** – Google Analytics 4 (the \`_ga\` and \`_ga_*\` cookies, valid for up to 2 years), provided by Google Ireland Limited. It shows us, in aggregate, which pages are visited and where visitors come from. Analytics cookies are only stored if you choose "Accept all". Without your consent, we use Google Consent Mode: no cookies are stored and Google only receives aggregated technical signals that do not identify you.

## Managing your preferences

You can change your choice at any time using the **Cookie settings** link in the site footer. If you withdraw consent, collection stops and the analytics cookies are deleted. You can also block cookies in your browser settings.

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
  return <LegalPage title={T[locale].title} updated="30.10.2026" body={T[locale].body} locale={locale} />;
}
