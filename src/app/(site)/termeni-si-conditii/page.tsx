import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { LEGAL, companyBlock } from "@/content/legal";

const RO = `
Acești termeni reglementează folosirea site-ului **${LEGAL.website}** („Site-ul”). Prin accesarea și utilizarea Site-ului ești de acord cu ei. Dacă nu ești de acord, te rugăm să nu folosești Site-ul.

## 1. Cine suntem

Site-ul este operat de:

${companyBlock("ro")}

## 2. Serviciile prezentate

Prin Site, ${LEGAL.tradeName} își prezintă serviciile: dezvoltare de website-uri și magazine online, platforme SaaS, sisteme CRM și automatizări, fotografie și video de produs realizate cu ajutorul inteligenței artificiale, editare video și administrare social media.

Informațiile de pe Site au caracter general și de prezentare. **Nu constituie o ofertă fermă.** Prețurile, termenele, conținutul exact al serviciilor și condițiile colaborării se stabilesc doar prin oferta personalizată și contractul transmise individual fiecărui client. Cifrele, rezultatele și exemplele din portofoliu ilustrează proiecte anterioare și nu garantează rezultate identice.

## 3. Solicitări prin formulare

Când ne trimiți o solicitare prin formularele de pe Site, te rugăm să furnizezi date corecte și complete. Trimiterea unei solicitări nu creează obligații contractuale pentru niciuna dintre părți. Răspundem, de regulă, în cel mult 24 de ore lucrătoare. Datele transmise sunt prelucrate conform [Politicii de confidențialitate](/politica-de-confidentialitate).

## 4. Oferte, contracte și semnare electronică

Ofertele și contractele pot fi consultate, acceptate și semnate electronic prin linkurile personale transmise pe email. Acceptarea unei oferte sau semnarea unui contract se face doar de persoana îndreptățită să reprezinte clientul. Semnătura electronică aplicată prin platforma noastră, împreună cu datele înregistrate la semnare (nume, semnătură, dată, oră, adresă IP), constituie dovada acordului, conform Regulamentului (UE) nr. 910/2014 (eIDAS) și Legii nr. 455/2001. Relația contractuală este guvernată de contractul semnat.

## 5. Portalul clientului

Clienții pot primi acces la un portal personal, printr-un link unic, unde pot urmări proiectele, aproba materiale, lăsa comentarii și consulta documente. Linkul este confidențial și nu trebuie distribuit persoanelor neautorizate. Clientul răspunde pentru acțiunile efectuate prin linkul său. La cerere sau în caz de suspiciune, linkul poate fi înlocuit oricând de ${LEGAL.tradeName}.

## 6. Proprietate intelectuală

Conținutul Site-ului (texte, elemente grafice, logo-uri, imagini, structura și codul) aparține ${LEGAL.legalName} sau este folosit cu acordul titularilor și este protejat de Legea nr. 8/1996 privind dreptul de autor. Nu poate fi copiat, reprodus, distribuit sau folosit în scop comercial fără acordul nostru scris. Proiectele din portofoliu sunt prezentate cu acordul clienților; mărcile acestora aparțin titularilor lor.

## 7. Utilizarea corectă a Site-ului

Te angajezi să nu folosești Site-ul în scopuri ilegale, să nu încerci să accesezi zone neautorizate (inclusiv zona privată a echipei), să nu transmiți conținut ilicit, programe dăunătoare sau mesaje nesolicitate în masă prin formulare.

## 8. Limitarea răspunderii

Depunem toate eforturile ca Site-ul să funcționeze corect, să fie sigur și să conțină informații actuale. Nu putem garanta însă funcționarea neîntreruptă sau lipsa totală a erorilor și nu răspundem pentru prejudicii indirecte rezultate din folosirea Site-ului sau din imposibilitatea de a-l folosi. Site-ul poate conține linkuri către site-uri externe, pentru al căror conținut nu răspundem.

## 9. Protecția consumatorilor

Dacă ești consumator (persoană fizică ce acționează în afara activității sale profesionale), beneficiezi de drepturile prevăzute de legislația privind protecția consumatorilor. Pentru reclamații ne poți scrie la **${LEGAL.email}**. Te poți adresa și Autorității Naționale pentru Protecția Consumatorilor (ANPC) – www.anpc.ro – sau poți apela la soluționarea alternativă a litigiilor (SAL): https://anpc.ro/ce-este-sal/.

## 10. Legea aplicabilă și litigii

Acești termeni sunt guvernați de legea română. Orice neînțelegere se soluționează, pe cât posibil, pe cale amiabilă. În caz contrar, litigiile sunt de competența instanțelor române, cu respectarea drepturilor consumatorilor de a se adresa instanței de la domiciliul lor.

## 11. Modificări

Putem actualiza acești termeni oricând. Versiunea în vigoare este cea publicată pe această pagină, cu data ultimei actualizări. Pentru întrebări: **${LEGAL.email}**.
`;

const EN = `
These terms govern the use of **${LEGAL.website}** (the "Site"). By accessing and using the Site you agree to them. If you do not agree, please do not use the Site.

## 1. Who we are

The Site is operated by:

${companyBlock("en")}

## 2. Services presented

Through the Site, ${LEGAL.tradeName} presents its services: website and online store development, SaaS platforms, CRM systems and automation, AI-assisted product photo and video, video editing and social media management.

The information on the Site is general and for presentation purposes. **It does not constitute a binding offer.** Prices, timelines, the exact scope of services and the terms of collaboration are set only through the personalised proposal and contract sent individually to each client. Figures, results and portfolio examples illustrate previous projects and do not guarantee identical results.

## 3. Enquiries via forms

When you send an enquiry through the forms on the Site, please provide accurate and complete information. Sending an enquiry does not create contractual obligations for either party. We usually reply within 24 business hours. The data you send is processed in accordance with our [Privacy policy](/en/privacy-policy).

## 4. Proposals, contracts and electronic signature

Proposals and contracts can be viewed, accepted and signed electronically through the personal links sent by email. Accepting a proposal or signing a contract may only be done by a person entitled to represent the client. The electronic signature applied through our platform, together with the data recorded at signing (name, signature, date, time, IP address), constitutes proof of agreement under Regulation (EU) No 910/2014 (eIDAS) and Romanian Law no. 455/2001. The contractual relationship is governed by the signed contract.

## 5. Client portal

Clients may receive access to a personal portal through a unique link, where they can follow projects, approve materials, leave comments and view documents. The link is confidential and must not be shared with unauthorised persons. The client is responsible for actions taken through their link. On request or in case of suspicion, ${LEGAL.tradeName} may replace the link at any time.

## 6. Intellectual property

The content of the Site (text, graphics, logos, images, structure and code) belongs to ${LEGAL.legalName} or is used with the owners' permission and is protected by Romanian copyright law (Law no. 8/1996). It may not be copied, reproduced, distributed or used commercially without our written consent. Portfolio projects are presented with our clients' permission; their trademarks belong to their respective owners.

## 7. Proper use of the Site

You agree not to use the Site for unlawful purposes, not to attempt to access unauthorised areas (including the team's private area), and not to send unlawful content, malicious software or bulk unsolicited messages through the forms.

## 8. Limitation of liability

We make every effort to keep the Site working correctly, secure and up to date. However, we cannot guarantee uninterrupted operation or the complete absence of errors, and we are not liable for indirect damage resulting from the use of, or inability to use, the Site. The Site may contain links to external websites, for whose content we are not responsible.

## 9. Consumer protection

If you are a consumer (an individual acting outside their professional activity), you benefit from the rights provided by consumer protection law. You can send complaints to **${LEGAL.email}**. You may also contact the Romanian National Authority for Consumer Protection (ANPC) – www.anpc.ro – or use alternative dispute resolution (ADR): https://anpc.ro/ce-este-sal/.

## 10. Governing law and disputes

These terms are governed by Romanian law. Any disagreement shall be settled amicably wherever possible. Otherwise, disputes fall under the jurisdiction of the Romanian courts, without prejudice to consumers' right to bring proceedings before the courts of their place of residence.

## 11. Changes

We may update these terms at any time. The version in force is the one published on this page, with the date of the last update. Questions: **${LEGAL.email}**.
`;

const T = { ro: { title: "Termeni și condiții", body: RO }, en: { title: "Terms and conditions", body: EN } };

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/termeni-si-conditii", locale, { title: T[locale].title });
}

export default function Page() {
  const locale = getLocale();
  return <LegalPage title={T[locale].title} updated={LEGAL.updated} body={T[locale].body} locale={locale} />;
}
