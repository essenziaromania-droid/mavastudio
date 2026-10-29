import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getLocale, pageMeta } from "@/lib/i18n-server";

const RO = `
Această politică explică ce date personale colectează MAVA Studio prin site-ul **mavastudio.ro**, de ce le colectăm și ce drepturi ai, conform Regulamentului (UE) 2016/679 (GDPR).

## Ce date colectăm

Prin formularele de contact și „Începe un proiect” colectăm: nume, companie, email, telefon, serviciile de interes, bugetul și termenul estimativ, descrierea proiectului și, opțional, fișierele atașate. Tehnic, înregistrăm și adresa IP, pagina de pe care ai trimis formularul și parametrii de campanie (UTM), ca dovadă a consimțământului și pentru a ști de unde vin solicitările.

## De ce le folosim

- pentru a răspunde solicitării tale și a-ți trimite o ofertă (temei: demersuri precontractuale, art. 6(1)(b) GDPR);
- pentru a administra relația contractuală, dacă devii client (art. 6(1)(b) și (c));
- pentru securitatea site-ului și prevenirea abuzurilor (interes legitim, art. 6(1)(f)).

Nu vindem și nu închiriem datele tale. Nu îți trimitem newslettere fără acordul tău separat.

## Cât timp le păstrăm

Datele unei solicitări care nu devine colaborare sunt păstrate maximum 24 de luni. Datele clienților sunt păstrate pe durata contractului și ulterior pe perioada impusă de legislația financiar-contabilă.

## Cui le transmitem

Folosim furnizori care ne ajută să operăm serviciile (găzduire, bază de date, email, facturare), cu care avem acorduri de prelucrare a datelor. Unele servicii pot stoca date în afara Spațiului Economic European, cu garanțiile prevăzute de GDPR (clauze contractuale standard).

## Drepturile tale

Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție, precum și dreptul de a-ți retrage consimțământul oricând. Pentru orice solicitare, scrie-ne la **contact@mavastudio.ro**. Ai, de asemenea, dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (www.dataprotection.ro).

## Operatorul datelor

Datele de identificare ale operatorului pot fi solicitate oricând la **contact@mavastudio.ro**.
`;

const EN = `
This policy explains what personal data MAVA Studio collects through **mavastudio.ro**, why we collect it and what rights you have under Regulation (EU) 2016/679 (GDPR).

## What data we collect

Through the contact and "Start a project" forms we collect: name, company, email, phone, the services you're interested in, your estimated budget and timeline, the project description and, optionally, attached files. We also record your IP address, the page you submitted the form from and campaign parameters (UTM), as proof of consent and to understand where enquiries come from.

## Why we use it

- to reply to your enquiry and send you a proposal (legal basis: pre-contractual steps, Art. 6(1)(b) GDPR);
- to manage the contractual relationship if you become a client (Art. 6(1)(b) and (c));
- for website security and abuse prevention (legitimate interest, Art. 6(1)(f)).

We do not sell or rent your data. We do not send you newsletters without your separate consent.

## How long we keep it

Data from an enquiry that does not lead to a collaboration is kept for a maximum of 24 months. Client data is kept for the duration of the contract and afterwards for the period required by accounting and tax law.

## Who we share it with

We use providers that help us run our services (hosting, database, email, invoicing), with whom we have data processing agreements. Some services may store data outside the European Economic Area, with the safeguards provided by the GDPR (standard contractual clauses).

## Your rights

You have the right of access, rectification, erasure, restriction, portability and objection, as well as the right to withdraw your consent at any time. For any request, write to us at **contact@mavastudio.ro**. You also have the right to lodge a complaint with the Romanian data protection authority (www.dataprotection.ro) or with the supervisory authority in your country.

## Data controller

The controller's identification details can be requested at any time at **contact@mavastudio.ro**.
`;

const T = { ro: { title: "Politica de confidențialitate", body: RO }, en: { title: "Privacy policy", body: EN } };

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/politica-de-confidentialitate", locale, { title: T[locale].title });
}

export default function Page() {
  const locale = getLocale();
  return <LegalPage title={T[locale].title} updated="28.10.2026" body={T[locale].body} locale={locale} />;
}
