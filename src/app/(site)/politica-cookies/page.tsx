import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { LEGAL, companyBlock } from "@/content/legal";

const RO = `
Această politică explică ce cookie-uri și tehnologii similare folosește site-ul **${LEGAL.website}**, operat de **${LEGAL.legalName}** (${LEGAL.tradeName}), conform Legii nr. 506/2004 și Regulamentului (UE) 2016/679 (GDPR).

## Ce sunt cookie-urile

Cookie-urile sunt fișiere mici salvate de browser pe dispozitivul tău. Unele sunt necesare pentru ca site-ul să funcționeze, altele ne ajută să înțelegem cum este folosit. Pe lângă cookie-uri, folosim și spațiul de stocare local al browserului („localStorage”) pentru a reține alegerea ta privind cookie-urile.

## Cookie-uri strict necesare (nu necesită acord)

- **mava_lang** – reține limba aleasă (română sau engleză). Durată: 1 an. Furnizor: ${LEGAL.tradeName}.
- **mava-cookie-consent** (localStorage) – reține alegerea ta din bannerul de cookies, ca să nu te întrebăm la fiecare vizită. Durată: până o ștergi. Furnizor: ${LEGAL.tradeName}.
- **sb-…-auth-token** – menține autentificarea în zona privată (CRM), folosită doar de echipa ${LEGAL.tradeName}. Nu se setează pentru vizitatorii site-ului. Durată: sesiune / până la deconectare.

Aceste cookie-uri sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate din banner. Le poți bloca din setările browserului, dar unele funcții ale site-ului pot să nu mai meargă corect.

## Cookie-uri de analiză (doar cu acordul tău)

- **_ga** – deosebește vizitatorii unici, pentru statistici agregate. Durată: 2 ani. Furnizor: Google Ireland Ltd. (Google Analytics 4).
- **_ga_J0RES2TDBH** – păstrează starea sesiunii pentru statistici. Durată: 2 ani. Furnizor: Google Ireland Ltd.

Aceste cookie-uri se salvează **doar dacă alegi „Accept toate”**. Fără acordul tău, folosim modul de consimțământ Google (Consent Mode): nu se salvează cookie-uri de analiză, iar Google primește doar semnale tehnice agregate, care nu te identifică. Datele de analiză pot fi transferate în afara Spațiului Economic European, cu garanțiile descrise în [Politica de confidențialitate](/politica-de-confidentialitate).

Nu folosim cookie-uri de publicitate sau de urmărire în scop de marketing.

## Cum îți gestionezi preferințele

- Poți schimba oricând alegerea din link-ul **Setări cookies** din subsolul site-ului. Dacă retragi acordul, colectarea se oprește și cookie-urile de analiză sunt șterse.
- Poți șterge sau bloca cookie-urile din setările browserului (de regulă în secțiunea „Confidențialitate” sau „Securitate”).

## Cine răspunde

${companyBlock("ro")}

Pentru întrebări despre cookie-uri sau datele tale, scrie-ne la **${LEGAL.email}**.
`;

const EN = `
This policy explains which cookies and similar technologies are used on **${LEGAL.website}**, operated by **${LEGAL.legalName}** (${LEGAL.tradeName}), in accordance with Romanian Law no. 506/2004 and Regulation (EU) 2016/679 (GDPR).

## What cookies are

Cookies are small files stored by your browser on your device. Some are needed for the site to work, others help us understand how it is used. Besides cookies, we also use the browser's local storage ("localStorage") to remember your cookie choice.

## Strictly necessary cookies (no consent required)

- **mava_lang** – remembers your chosen language (Romanian or English). Duration: 1 year. Provider: ${LEGAL.tradeName}.
- **mava-cookie-consent** (localStorage) – remembers your choice in the cookie banner, so we don't ask on every visit. Duration: until you delete it. Provider: ${LEGAL.tradeName}.
- **sb-…-auth-token** – keeps you signed in to the private area (CRM), used only by the ${LEGAL.tradeName} team. It is not set for website visitors. Duration: session / until sign-out.

These cookies are essential for the site to work and cannot be switched off from the banner. You can block them in your browser settings, but some features of the site may then not work correctly.

## Analytics cookies (only with your consent)

- **_ga** – distinguishes unique visitors, for aggregated statistics. Duration: 2 years. Provider: Google Ireland Ltd. (Google Analytics 4).
- **_ga_J0RES2TDBH** – keeps the session state for statistics. Duration: 2 years. Provider: Google Ireland Ltd.

These cookies are only stored **if you choose "Accept all"**. Without your consent, we use Google Consent Mode: no analytics cookies are stored and Google only receives aggregated technical signals that do not identify you. Analytics data may be transferred outside the European Economic Area, with the safeguards described in our [Privacy policy](/en/privacy-policy).

We do not use advertising or marketing tracking cookies.

## Managing your preferences

- You can change your choice at any time using the **Cookie settings** link in the site footer. If you withdraw consent, collection stops and the analytics cookies are deleted.
- You can delete or block cookies in your browser settings (usually under "Privacy" or "Security").

## Who is responsible

${companyBlock("en")}

For questions about cookies or your data, write to us at **${LEGAL.email}**.
`;

const T = { ro: { title: "Politica de cookies", body: RO }, en: { title: "Cookie policy", body: EN } };

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/politica-cookies", locale, { title: T[locale].title });
}

export default function Page() {
  const locale = getLocale();
  return <LegalPage title={T[locale].title} updated={LEGAL.updated} body={T[locale].body} locale={locale} />;
}
