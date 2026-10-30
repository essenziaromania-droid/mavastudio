import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { LEGAL, companyBlock } from "@/content/legal";

const RO = `
Această politică explică modul în care **${LEGAL.legalName}** (${LEGAL.tradeName}) colectează și folosește datele cu caracter personal prin site-ul **${LEGAL.website}**, prin formularele de contact și în relația cu clienții, conform Regulamentului (UE) 2016/679 („GDPR”) și legislației române aplicabile.

## 1. Cine suntem (operatorul datelor)

${companyBlock("ro")}

Pentru orice întrebare legată de datele tale personale ne poți scrie la **${LEGAL.email}**. Nu am desemnat un responsabil cu protecția datelor (DPO), nefiind obligați conform art. 37 GDPR; solicitările sunt tratate direct de conducerea firmei.

## 2. Ce date prelucrăm, în ce scop și pe ce temei

**a) Când ne contactezi sau ceri o ofertă** (formularele „Contact” și „Începe un proiect”, emailul)
- Date: nume, companie, adresă de email, telefon, serviciile de interes, bugetul și termenul estimativ, descrierea proiectului, fișierele pe care alegi să le atașezi, precum și conținutul emailurilor schimbate cu noi.
- Date tehnice înregistrate la trimitere: adresa IP, pagina de pe care ai trimis formularul, sursa vizitei (parametri UTM), data și ora, ca dovadă a consimțământului și pentru prevenirea abuzurilor.
- Scop: să îți răspundem și să îți trimitem o ofertă.
- Temei: demersuri făcute la cererea ta înainte de încheierea unui contract (art. 6 alin. (1) lit. b) GDPR) și interesul nostru legitim de a preveni abuzurile (art. 6 alin. (1) lit. f)).

**b) Când devii client** (oferte, contracte, proiecte, facturi, portalul clientului)
- Date: datele de identificare și de contact ale firmei tale și ale persoanelor de contact, datele din contract și din facturi, semnătura electronică (numele, imaginea semnăturii, data, ora și adresa IP de la semnare), materialele și comentariile din portalul clientului, istoricul comunicărilor.
- Scop: încheierea și executarea contractului, facturarea, comunicarea pe parcursul proiectului.
- Temei: executarea contractului (art. 6 alin. (1) lit. b)), îndeplinirea obligațiilor legale fiscale și contabile (art. 6 alin. (1) lit. c)) și interesul legitim de a putea dovedi încheierea contractului și de a ne apăra drepturile (art. 6 alin. (1) lit. f)).

**c) Statistici de vizitare a site-ului** (Google Analytics 4)
- Date: paginile vizitate, sursa vizitei, tipul de dispozitiv și browser, țara/orașul aproximativ, identificatori online (cookie-uri).
- Scop: să înțelegem, în mod agregat, cum este folosit site-ul și să îl îmbunătățim.
- Temei: consimțământul tău (art. 6 alin. (1) lit. a)), dat prin butonul „Accept toate” din bannerul de cookies. Fără acord, folosim modul de consimțământ Google: nu se salvează cookie-uri, iar Google primește doar semnale tehnice agregate, fără identificatori. Îți poți retrage oricând acordul din link-ul **Setări cookies** din subsolul site-ului. Detalii în [Politica de cookies](/politica-cookies).

**d) Funcționarea și securitatea site-ului**
- Date: adresa IP, tipul de browser, jurnale tehnice ale serverului, preferința de limbă.
- Scop: afișarea site-ului în limba potrivită, securitatea și prevenirea atacurilor.
- Temei: interesul nostru legitim (art. 6 alin. (1) lit. f)).

Nu folosim datele tale pentru decizii automate sau profilare cu efecte juridice asupra ta. Nu îți trimitem newslettere sau mesaje de marketing fără un acord separat și nu vindem datele nimănui.

## 3. Cât timp păstrăm datele

- **Solicitările care nu devin colaborare** (formulare, emailuri, oferte neacceptate): cel mult 24 de luni de la ultimul contact.
- **Datele clienților și contractele:** pe durata colaborării și ulterior pe durata termenului general de prescripție (3 ani) de la încheierea ei, pentru a ne putea apăra drepturile.
- **Facturile și documentele financiar-contabile:** pe durata prevăzută de Legea contabilității nr. 82/1991 (în prezent, 5 sau 10 ani, în funcție de tipul documentului).
- **Statisticile Google Analytics:** cel mult 14 luni.
- **Jurnalele tehnice ale serverului:** cel mult 90 de zile.

După aceste termene, datele sunt șterse sau anonimizate.

## 4. Cui transmitem datele

Datele sunt accesibile doar echipei ${LEGAL.tradeName}, pe baza nevoii de a le cunoaște, și furnizorilor care ne ajută să operăm serviciile, în calitate de persoane împuternicite, pe baza unor contracte care îi obligă să protejeze datele:

- **Vercel Inc.** – găzduirea site-ului și a aplicației;
- **Supabase Inc.** – baza de date și stocarea fișierelor (servere în Uniunea Europeană);
- **Resend Inc.** – trimiterea emailurilor (confirmări, oferte, contracte, facturi);
- **Hostico** – găzduirea căsuței de email a firmei (România);
- **Google Ireland Ltd. / Google LLC** – Google Analytics (doar cu acordul tău), Google Drive și Google Calendar (stocarea documentelor și programărilor clienților);
- **SmartBill (Intelligent IT SRL)** – emiterea facturilor (România).

De asemenea, putem transmite date autorităților publice, atunci când legea ne obligă (de exemplu, ANAF).

## 5. Transferuri în afara Spațiului Economic European

Unii furnizori (Vercel, Resend, Google) pot prelucra date în Statele Unite. Aceste transferuri au loc doar cu garanțiile prevăzute de GDPR: decizia de adecvare a Comisiei Europene pentru Cadrul UE-SUA privind protecția datelor (pentru companiile certificate) și/sau clauzele contractuale standard aprobate de Comisia Europeană. Poți solicita la ${LEGAL.email} informații despre aceste garanții.

## 6. Drepturile tale

Conform GDPR, ai următoarele drepturi:

- **dreptul de acces** – să afli ce date prelucrăm despre tine și să primești o copie;
- **dreptul la rectificare** – să corectăm datele inexacte sau incomplete;
- **dreptul la ștergere** – să ștergem datele, atunci când nu mai există un temei pentru prelucrare;
- **dreptul la restricționarea prelucrării**;
- **dreptul la portabilitate** – să primești datele într-un format structurat sau să le transmitem altui operator;
- **dreptul la opoziție** – față de prelucrările bazate pe interesul nostru legitim;
- **dreptul de a-ți retrage consimțământul** oricând, fără a afecta legalitatea prelucrării anterioare;
- **dreptul de a depune o plângere** la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP): B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1, București, anspdcp@dataprotection.ro, www.dataprotection.ro.

Pentru exercitarea drepturilor, scrie-ne la **${LEGAL.email}**. Îți răspundem în cel mult o lună de la primirea cererii (termen care poate fi prelungit cu încă două luni pentru cereri complexe, caz în care te anunțăm). Putem cere informații suplimentare pentru a-ți confirma identitatea.

## 7. Securitatea datelor

Folosim conexiuni criptate (HTTPS), acces pe bază de cont și roluri pentru echipă, autentificare în doi pași, stocare privată a fișierelor și copii de siguranță. Linkurile personale (portalul clientului, ofertele și contractele) sunt unice și greu de ghicit; te rugăm să nu le distribui altor persoane.

## 8. Minori

Serviciile noastre se adresează firmelor și persoanelor adulte. Nu colectăm în mod intenționat date despre persoane sub 16 ani.

## 9. Modificări

Putem actualiza această politică atunci când se schimbă serviciile sau legislația. Versiunea în vigoare este întotdeauna cea publicată pe această pagină, cu data ultimei actualizări.
`;

const EN = `
This policy explains how **${LEGAL.legalName}** (${LEGAL.tradeName}) collects and uses personal data through **${LEGAL.website}**, our contact forms and our client relationships, in accordance with Regulation (EU) 2016/679 ("GDPR") and applicable Romanian law.

## 1. Who we are (data controller)

${companyBlock("en")}

For any question about your personal data, write to us at **${LEGAL.email}**. We have not appointed a Data Protection Officer, as we are not required to under Art. 37 GDPR; requests are handled directly by the company's management.

## 2. What data we process, why and on what legal basis

**a) When you contact us or request a proposal** (the "Contact" and "Start a project" forms, email)
- Data: name, company, email address, phone number, services of interest, estimated budget and timeline, project description, files you choose to attach, and the content of emails exchanged with us.
- Technical data recorded on submission: IP address, the page the form was sent from, traffic source (UTM parameters), date and time, as proof of consent and to prevent abuse.
- Purpose: to reply and send you a proposal.
- Legal basis: steps taken at your request before entering into a contract (Art. 6(1)(b) GDPR) and our legitimate interest in preventing abuse (Art. 6(1)(f)).

**b) When you become a client** (proposals, contracts, projects, invoices, client portal)
- Data: identification and contact details of your company and contact persons, contract and invoice data, electronic signature (name, signature image, date, time and IP address at signing), materials and comments in the client portal, communication history.
- Purpose: concluding and performing the contract, invoicing, communication during the project.
- Legal basis: performance of the contract (Art. 6(1)(b)), compliance with tax and accounting obligations (Art. 6(1)(c)), and our legitimate interest in being able to prove the contract and defend our rights (Art. 6(1)(f)).

**c) Website statistics** (Google Analytics 4)
- Data: pages visited, traffic source, device and browser type, approximate country/city, online identifiers (cookies).
- Purpose: to understand, in aggregate, how the site is used and improve it.
- Legal basis: your consent (Art. 6(1)(a)), given through the "Accept all" button in the cookie banner. Without consent we use Google Consent Mode: no cookies are stored and Google only receives aggregated technical signals without identifiers. You can withdraw consent at any time via the **Cookie settings** link in the site footer. Details in our [Cookie policy](/en/cookie-policy).

**d) Website operation and security**
- Data: IP address, browser type, technical server logs, language preference.
- Purpose: showing the site in the right language, security and attack prevention.
- Legal basis: our legitimate interest (Art. 6(1)(f)).

We do not use your data for automated decisions or profiling with legal effects on you. We do not send newsletters or marketing messages without separate consent, and we never sell your data.

## 3. How long we keep data

- **Enquiries that do not lead to a collaboration** (forms, emails, unaccepted proposals): up to 24 months from the last contact.
- **Client data and contracts:** for the duration of the collaboration and afterwards for the general limitation period (3 years) from its end, so that we can defend our rights.
- **Invoices and accounting documents:** for the period required by Romanian Accounting Law no. 82/1991 (currently 5 or 10 years, depending on the document).
- **Google Analytics statistics:** up to 14 months.
- **Technical server logs:** up to 90 days.

After these periods, data is deleted or anonymised.

## 4. Who we share data with

Data is only accessible to the ${LEGAL.tradeName} team on a need-to-know basis, and to providers that help us run our services as processors, under contracts that require them to protect the data:

- **Vercel Inc.** – website and application hosting;
- **Supabase Inc.** – database and file storage (servers in the European Union);
- **Resend Inc.** – sending emails (confirmations, proposals, contracts, invoices);
- **Hostico** – hosting of the company mailbox (Romania);
- **Google Ireland Ltd. / Google LLC** – Google Analytics (only with your consent), Google Drive and Google Calendar (storage of client documents and appointments);
- **SmartBill (Intelligent IT SRL)** – issuing invoices (Romania).

We may also disclose data to public authorities where required by law (for example, the Romanian tax authority).

## 5. Transfers outside the European Economic Area

Some providers (Vercel, Resend, Google) may process data in the United States. These transfers only take place with the safeguards provided by the GDPR: the European Commission's adequacy decision for the EU-US Data Privacy Framework (for certified companies) and/or the Standard Contractual Clauses approved by the European Commission. You can request information about these safeguards at ${LEGAL.email}.

## 6. Your rights

Under the GDPR you have the right:

- **of access** – to know what data we process about you and receive a copy;
- **to rectification** – to have inaccurate or incomplete data corrected;
- **to erasure** – to have data deleted where there is no longer a basis for processing;
- **to restriction of processing**;
- **to data portability** – to receive data in a structured format or have it sent to another controller;
- **to object** – to processing based on our legitimate interest;
- **to withdraw consent** at any time, without affecting the lawfulness of earlier processing;
- **to lodge a complaint** with the Romanian supervisory authority (ANSPDCP): 28-30 G-ral. Gheorghe Magheru Blvd., Sector 1, Bucharest, anspdcp@dataprotection.ro, www.dataprotection.ro, or with the supervisory authority in your country of residence.

To exercise your rights, write to **${LEGAL.email}**. We reply within one month of receiving your request (extendable by two further months for complex requests, in which case we will let you know). We may ask for additional information to confirm your identity.

## 7. Data security

We use encrypted connections (HTTPS), account- and role-based access for our team, two-factor authentication, private file storage and backups. Personal links (client portal, proposals and contracts) are unique and hard to guess; please do not share them with others.

## 8. Children

Our services are aimed at businesses and adults. We do not knowingly collect data about persons under 16.

## 9. Changes

We may update this policy when our services or the law change. The version in force is always the one published on this page, with the date of the last update.
`;

const T = { ro: { title: "Politica de confidențialitate", body: RO }, en: { title: "Privacy policy", body: EN } };

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/politica-de-confidentialitate", locale, { title: T[locale].title });
}

export default function Page() {
  const locale = getLocale();
  return <LegalPage title={T[locale].title} updated={LEGAL.updated} body={T[locale].body} locale={locale} />;
}
