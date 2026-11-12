import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "oferte-si-contracte-semnate-online",
  category: "crm",
  tags: ["semnătură electronică", "contracte online", "oferte online", "eIDAS", "digitalizare"],
  ro: {
    title: "Oferte și contracte semnate online: cum funcționează și ce valoare au",
    seoTitle: "Oferte și contracte semnate online: ghid pentru firme",
    description: "Cum trimiți oferte și contracte pe care clienții le semnează online, ce tipuri de semnătură electronică există conform eIDAS, ce valoare au și cum organizezi procesul.",
    excerpt: "Ofertele în PDF trimise pe email și contractele printate, semnate și scanate îți fură zile întregi. Iată cum funcționează semnarea online, ce tip de semnătură îți trebuie și cum o implementezi.",
    content: `**Pe scurt:** o ofertă sau un contract semnat online înseamnă că documentul ajunge la client printr-un link, clientul îl citește, îl acceptă și îl semnează electronic, iar tu primești pe loc documentul semnat și o notificare. În Uniunea Europeană, regulamentul eIDAS recunoaște trei niveluri de semnătură electronică: simplă, avansată și calificată. Pentru majoritatea contractelor obișnuite de servicii între firme sau cu clienți, o semnătură electronică simplă sau avansată, însoțită de dovezi clare (cine, când, de pe ce adresă), e o soluție practică. Pentru documentele pentru care legea cere formă specială, poate fi necesară semnătura calificată sau altă formă prevăzută de lege.

În firma mea, ofertele și contractele se semnează online din primul an. Clientul primește un link, vede oferta frumos prezentată, cu serviciile și prețurile, o acceptă, apoi semnează contractul direct pe telefon. Eu primesc notificarea, iar factura de avans se emite automat. Am construit sistemul ăsta pentru că diferența de timp față de PDF-urile trimise pe email era uriașă. În articolul ăsta îți explic cum funcționează și ce trebuie să știi înainte.

Precizare: nu sunt avocat. Pentru contractele importante sau cu cerințe speciale de formă, consultă un jurist.

## Cum arată procesul clasic și unde pierzi timp

1. Faci oferta în Word sau Excel.
2. O exporți în PDF și o trimiți pe email.
3. Clientul o citește (sau nu), pune întrebări, ceri modificări.
4. Trimiți o variantă nouă. Uneori se încurcă versiunile.
5. Clientul acceptă pe email.
6. Faci contractul, completând de mână datele clientului.
7. Clientul îl printează, îl semnează, îl scanează și ți-l trimite înapoi (sau uită).
8. Emiți factura de avans.

Fiecare pas e un loc în care se poate bloca totul câteva zile.

## Cum arată procesul online

1. Creezi oferta din șabloane: alegi serviciile, prețurile se completează singure.
2. Clientul primește un link și vede oferta pe orice dispozitiv.
3. Tu vezi când a deschis oferta.
4. Clientul o acceptă cu un click.
5. Contractul se generează automat, cu datele clientului deja completate.
6. Clientul îl semnează online, pe telefon sau pe calculator.
7. Amândoi primiți documentul semnat.
8. Factura de avans se poate emite automat.

Totul se poate întâmpla în aceeași zi, uneori în aceeași oră.

## Ce spune legea: eIDAS, pe înțeles

[Regulamentul (UE) nr. 910/2014 (eIDAS)](https://eur-lex.europa.eu/eli/reg/2014/910/oj) stabilește cadrul pentru semnăturile electronice în Uniunea Europeană. Principiul de bază: unei semnături electronice nu i se poate refuza efectul juridic și admisibilitatea ca probă în instanță doar pentru că e în format electronic.

Regulamentul definește trei niveluri:

| Tip de semnătură | Ce înseamnă | Unde e potrivită, de obicei |
|---|---|---|
| Semnătură electronică simplă | orice formă electronică prin care cineva își exprimă acordul (de exemplu semnătura desenată pe ecran, bifa de acceptare însoțită de date de identificare) | oferte, comenzi, contracte obișnuite de servicii, acorduri interne |
| Semnătură electronică avansată | legată unic de semnatar, permite identificarea lui și detectarea oricărei modificări ulterioare a documentului | contracte cu valoare mai mare, unde vrei dovezi mai puternice |
| Semnătură electronică calificată | semnătură avansată bazată pe un certificat calificat, emis de un prestator de încredere; are efectul unei semnături olografe | documente pentru care legea cere forma scrisă cu semnătură, relații cu instituții, situații sensibile |

Pe lângă eIDAS, există și legislația națională care reglementează folosirea semnăturii electronice. Pentru documentele pentru care legea cere o anumită formă (de exemplu formă autentică notarială), semnătura electronică simplă nu e suficientă.

## Ce face o semnătură electronică simplă să fie o dovadă bună

O semnătură simplă e cu atât mai solidă ca dovadă cu cât sistemul înregistrează mai multe informații. Un sistem bun păstrează:

- numele semnatarului și, ideal, emailul la care a primit linkul;
- data și ora exacte ale semnării;
- adresa IP și, eventual, dispozitivul;
- versiunea exactă a documentului semnat, care nu mai poate fi modificată;
- un istoric al acțiunilor: când a fost trimis, deschis, acceptat, semnat;
- o copie a documentului semnat, trimisă ambelor părți.

Pe site-ul și în CRM-ul nostru, de exemplu, la semnare se înregistrează numele, semnătura, data, ora și adresa IP, iar documentul semnat rămâne arhivat.

## Ce trebuie să conțină o ofertă bună

Indiferent dacă e semnată online sau nu, o ofertă care convinge are:

- datele ambelor părți;
- descrierea clară a ce primește clientul;
- ce nu e inclus;
- prețul, cu precizarea privind TVA-ul;
- termenul de livrare;
- modul de plată (de exemplu 50% avans la semnare, 50% la livrare);
- valabilitatea ofertei;
- pașii următori.

O ofertă online are un avantaj în plus: poate fi mult mai ușor de citit decât un PDF, cu secțiuni clare, liste „Ce include” și un buton vizibil de acceptare.

## Ce trebuie să conțină contractul

Contractul ar trebui să preia automat din ofertă: părțile, obiectul, prețul, termenele și condițiile de plată. Pe lângă acestea, de obicei:

- drepturile și obligațiile fiecărei părți;
- modul de predare și acceptare a lucrării;
- numărul de runde de modificări incluse;
- drepturile de proprietate intelectuală (al cui e site-ul, designul, codul după plată);
- confidențialitatea și protecția datelor;
- încetarea contractului;
- legea aplicabilă și soluționarea disputelor.

Pentru proiectele cu etape sau servicii suplimentare, anexele pot fi semnate tot online, pe parcurs.

## Cum alegi un instrument de semnare online

Există două variante:

1. **Platforme dedicate de semnătură electronică.** Încarci documentul, setezi unde semnează fiecare parte și trimiți linkul. Bune pentru documente diverse, cu un abonament lunar.
2. **Semnarea integrată în CRM.** Oferta, contractul, anexele și facturarea sunt legate între ele, iar semnarea e un pas firesc al procesului. Am comparat variantele de CRM în articolul [CRM gata făcut sau personalizat](/blog/crm-gata-facut-sau-personalizat).

Întrebări de pus înainte să alegi:

- ce tip de semnătură oferă (simplă, avansată, calificată)?
- ce dovezi înregistrează la semnare?
- unde sunt stocate documentele și cât timp?
- poate semna clientul de pe telefon, fără să-și facă un cont?
- se leagă cu programul tău de facturare?

## Cum prezinți oferta ca să fie acceptată

O ofertă online nu e doar un document, e o pagină de vânzare. Câteva lucruri care cresc mult șansele de acceptare:

- **un rezumat la început**: ce primește clientul, în cât timp și cât costă, în trei rânduri;
- **liste „Ce include” clare** pentru fiecare serviciu, ca să nu existe întrebări;
- **exemple vizuale**: poze sau linkuri spre proiecte asemănătoare;
- **pașii de după acceptare**: ce se întâmplă în prima săptămână;
- **un buton de acceptare vizibil**, nu ascuns la final, după zece pagini;
- **un termen de valabilitate** rezonabil, care încurajează decizia fără presiune;
- **datele tale de contact**, pentru întrebări înainte de semnare.

Dacă un client deschide oferta de mai multe ori, dar nu o acceptă, e un semn că are o întrebare. Un telefon scurt în acel moment rezolvă adesea situația.

## Protecția datelor

Documentele semnate conțin date personale (nume, emailuri, adrese IP, semnături). Ai nevoie de:

- informarea clientului, în politica de confidențialitate, despre aceste date și scopul lor;
- stocare sigură, cu acces limitat;
- linkuri unice, greu de ghicit, pentru oferte și contracte;
- o perioadă clară de păstrare.

Am detaliat partea de GDPR în ghidul despre [obligațiile legale ale unui site](/blog/obligatii-legale-site-romania).

## Greșeli frecvente

- **Trimiți oferta fără termen de valabilitate.** Clientul o acceptă peste șase luni, la prețurile vechi.
- **Nu precizezi ce nu e inclus.** Apar discuții la final.
- **Modifici documentul după semnare.** Orice modificare trebuie să fie un document nou sau o anexă.
- **Folosești semnătura simplă pentru documente care cer altă formă.** Verifică cu un jurist.
- **Nu păstrezi dovezile semnării**, doar un PDF cu o semnătură desenată.
- **Linkuri publice, ușor de ghicit**, către documente cu date personale.

## Exemplu: o firmă de servicii care a trecut la semnare online

O firmă care face amenajări trimitea oferte în PDF și contracte printate. Între oferta acceptată și contractul semnat treceau, de obicei, câteva zile, uneori o săptămână, iar unii clienți se răzgândeau între timp. După trecerea la oferte și contracte online:

- oferta se face în câteva minute din șabloane;
- clientul o vede pe telefon, cu poze din lucrări similare și lista clară a ce include;
- acceptarea și semnarea contractului se fac în aceeași sesiune;
- factura de avans pleacă automat la semnare;
- toate documentele stau în fișa clientului din CRM.

Timpul dintre „da” și începerea lucrării s-a scurtat vizibil, iar firma arată mult mai profesionist în fața clienților. Am descris și alte automatizări de acest tip în articolul despre [automatizări pentru afaceri mici](/blog/automatizari-pentru-afaceri-mici).

## Cum îi explici clientului procesul

Unii clienți, mai ales cei mai în vârstă sau cei care semnează pentru prima dată online, au nevoie de o explicație scurtă. Ce funcționează:

- **un mesaj simplu** înainte de trimitere: „Îți trimit oferta pe email; o poți citi pe telefon și, dacă ești de acord, o accepți cu un click”;
- **instrucțiuni clare pe pagină**, la fiecare pas: unde citește, unde bifează, unde semnează;
- **posibilitatea de a descărca documentul** înainte și după semnare;
- **un telefon sau un email** la care poate întreba dacă se blochează;
- **o confirmare imediată**, cu documentul semnat atașat.

Odată ce au semnat o dată, aproape toți clienții preferă varianta online pentru documentele următoare.

## Întrebări frecvente

### Are valoare legală un contract semnat online?

În Uniunea Europeană, regulamentul eIDAS prevede că unei semnături electronice nu i se poate refuza efectul juridic doar pentru că e electronică. Forța ei ca probă depinde de tipul semnăturii și de dovezile păstrate. Pentru documentele pentru care legea cere o formă specială, verifică cu un jurist ce tip de semnătură e necesar.

### Care e diferența dintre semnătura simplă, avansată și calificată?

Semnătura simplă e orice formă electronică de acord. Cea avansată e legată unic de semnatar și arată dacă documentul a fost modificat. Cea calificată e o semnătură avansată bazată pe un certificat calificat emis de un prestator de încredere și are efectul unei semnături olografe.

### Trebuie ca și clientul să aibă semnătură electronică calificată?

Nu, pentru majoritatea contractelor obișnuite de servicii, o semnătură electronică simplă sau avansată, cu dovezi clare, e suficientă. Semnătura calificată e necesară doar în situațiile în care legea sau părțile o cer.

### Ce dovezi trebuie păstrate la semnarea online?

Numele semnatarului, emailul, data și ora semnării, adresa IP, versiunea exactă a documentului semnat și istoricul acțiunilor. Documentul semnat trebuie să nu mai poată fi modificat și să fie trimis ambelor părți.

### Pot semna online și anexele la contract?

Da. Anexele pentru servicii suplimentare sau etape noi pot fi generate și semnate online, la fel ca și contractul inițial.

## Concluzie

Ofertele și contractele semnate online nu sunt doar mai moderne, ci și mai rapide, mai clare și mai ușor de urmărit. Alege tipul de semnătură potrivit documentului, păstrează dovezile semnării și leagă procesul de restul activității: CRM, proiecte, facturare.

Dacă vrei un sistem de oferte și contracte online construit pe procesul tău, vezi pagina [CRM și automatizări](/servicii/crm-automatizari) sau [scrie-ne](/incepe-un-proiect). Dacă abia pornești, citește întâi ghidul [Ce este un CRM](/blog/de-ce-ai-nevoie-de-un-crm).`,
  },
  en: {
    title: "Quotes and contracts signed online: how it works and what legal value it has",
    seoTitle: "Quotes and contracts signed online: a guide for businesses",
    description: "How to send quotes and contracts that clients sign online, what types of electronic signature exist under eIDAS, what legal value they have and how to organise the process.",
    excerpt: "PDF quotes sent by email and contracts printed, signed and scanned steal whole days. Here's how online signing works, which type of signature you need and how to set it up.",
    content: `**In short:** a quote or contract signed online means the document reaches the client through a link, the client reads it, accepts it and signs it electronically, and you immediately receive the signed document and a notification. In the European Union, the eIDAS Regulation recognises three levels of electronic signature: simple, advanced and qualified. For most ordinary service contracts between businesses or with clients, a simple or advanced electronic signature backed by clear evidence (who, when, from which address) is a practical solution. For documents where the law requires a special form, a qualified signature or another legally prescribed form may be needed.

In my business, quotes and contracts have been signed online since the first year. The client receives a link, sees a nicely presented quote with the services and prices, accepts it, then signs the contract right on their phone. I get a notification, and the deposit invoice is issued automatically. I built this system because the time difference compared with PDFs sent by email was enormous. In this article I explain how it works and what you need to know first.

A clarification: I'm not a lawyer. For important contracts or those with special formal requirements, consult a lawyer.

## What the traditional process looks like, and where you lose time

1. You make the quote in Word or Excel.
2. You export it to PDF and email it.
3. The client reads it (or doesn't), asks questions, you're asked for changes.
4. You send a new version. Sometimes versions get mixed up.
5. The client accepts by email.
6. You prepare the contract, filling in the client's details by hand.
7. The client prints it, signs it, scans it and sends it back (or forgets).
8. You issue the deposit invoice.

Every step is a place where everything can get stuck for a few days.

## What the online process looks like

1. You create the quote from templates: pick the services, prices fill in automatically.
2. The client receives a link and sees the quote on any device.
3. You see when they opened it.
4. The client accepts it with one click.
5. The contract is generated automatically, with the client's details already filled in.
6. The client signs it online, on a phone or computer.
7. You both receive the signed document.
8. The deposit invoice can be issued automatically.

All of this can happen on the same day, sometimes within the same hour.

## What the law says: eIDAS in plain language

[Regulation (EU) No 910/2014 (eIDAS)](https://eur-lex.europa.eu/eli/reg/2014/910/oj) sets the framework for electronic signatures in the European Union. The basic principle: an electronic signature cannot be denied legal effect and admissibility as evidence in court solely because it is in electronic form.

The regulation defines three levels:

| Type of signature | What it means | Where it usually fits |
|---|---|---|
| Simple electronic signature | any electronic form in which someone expresses agreement (for example a signature drawn on screen, or a tick box backed by identification data) | quotes, orders, ordinary service contracts, internal agreements |
| Advanced electronic signature | uniquely linked to the signatory, allows them to be identified and any later change to the document to be detected | higher-value contracts, where you want stronger evidence |
| Qualified electronic signature | an advanced signature based on a qualified certificate issued by a trust service provider; it has the effect of a handwritten signature | documents where the law requires written form with a signature, dealings with public institutions, sensitive situations |

Alongside eIDAS, national legislation also governs the use of electronic signatures. For documents where the law requires a specific form (for example a notarised deed), a simple electronic signature isn't enough.

## What makes a simple electronic signature good evidence

A simple signature is stronger as evidence the more information the system records. A good system keeps:

- the signatory's name and, ideally, the email address the link was sent to;
- the exact date and time of signing;
- the IP address and possibly the device;
- the exact version of the signed document, which can no longer be changed;
- a history of actions: when it was sent, opened, accepted, signed;
- a copy of the signed document sent to both parties.

On our own website and CRM, for example, signing records the name, signature, date, time and IP address, and the signed document stays archived.

## What a good quote should contain

Whether or not it's signed online, a quote that persuades includes:

- both parties' details;
- a clear description of what the client gets;
- what isn't included;
- the price, with a note on VAT;
- the delivery timeline;
- the payment terms (for example 50% deposit on signing, 50% on delivery);
- how long the quote is valid;
- the next steps.

An online quote has an extra advantage: it can be much easier to read than a PDF, with clear sections, "What's included" lists and a visible accept button.

## What the contract should contain

The contract should automatically take from the quote: the parties, the subject, the price, the timelines and the payment terms. On top of that, usually:

- each party's rights and obligations;
- how the work is delivered and accepted;
- the number of rounds of changes included;
- intellectual property rights (who owns the website, design and code after payment);
- confidentiality and data protection;
- termination of the contract;
- governing law and dispute resolution.

For projects with stages or extra services, appendices can also be signed online along the way.

## How to choose an online signing tool

There are two options:

1. **Dedicated e-signature platforms.** You upload the document, set where each party signs and send the link. Good for all kinds of documents, with a monthly subscription.
2. **Signing built into your CRM.** Quote, contract, appendices and invoicing are connected, and signing is a natural step in the process. I compared CRM options in [Off-the-shelf CRM or custom CRM](/blog/crm-gata-facut-sau-personalizat).

Questions to ask before you choose:

- which type of signature does it offer (simple, advanced, qualified)?
- what evidence does it record at signing?
- where are documents stored, and for how long?
- can the client sign on a phone without creating an account?
- does it connect to your invoicing software?

## How to present a quote so it gets accepted

An online quote isn't just a document; it's a sales page. A few things greatly increase the chance of acceptance:

- **a summary at the top**: what the client gets, how long it takes and what it costs, in three lines;
- **clear "What's included" lists** for each service, so there are no questions;
- **visual examples**: photos or links to similar projects;
- **the steps after acceptance**: what happens in the first week;
- **a visible accept button**, not hidden at the end after ten pages;
- **a reasonable validity date** that encourages a decision without pressure;
- **your contact details**, for questions before signing.

If a client opens the quote several times but doesn't accept it, it's a sign they have a question. A short phone call at that moment often settles it.

## Data protection

Signed documents contain personal data (names, emails, IP addresses, signatures). You need:

- to inform the client, in your privacy policy, about this data and its purpose;
- secure storage with limited access;
- unique, hard-to-guess links for quotes and contracts;
- a clear retention period.

I covered the GDPR side in detail in our guide to the [legal requirements for a website](/blog/obligatii-legale-site-romania).

## Common mistakes

- **Sending a quote with no validity date.** The client accepts it six months later, at the old prices.
- **Not stating what isn't included.** Arguments follow at the end.
- **Changing the document after signing.** Any change must be a new document or an appendix.
- **Using a simple signature for documents that require another form.** Check with a lawyer.
- **Not keeping evidence of signing**, just a PDF with a drawn signature.
- **Public, easy-to-guess links** to documents containing personal data.

## Example: a service company that moved to online signing

A company doing interior fit-outs used to send PDF quotes and printed contracts. Between an accepted quote and a signed contract, a few days usually passed, sometimes a week, and some clients changed their minds in the meantime. After switching to online quotes and contracts:

- quotes take a few minutes to build from templates;
- the client sees them on their phone, with photos of similar jobs and a clear list of what's included;
- accepting the quote and signing the contract happen in the same session;
- the deposit invoice goes out automatically on signing;
- all documents sit in the client's record in the CRM.

The time between "yes" and starting the work shrank noticeably, and the company looks far more professional to its clients. I described other automations of this kind in the article on [automation for small businesses](/blog/automatizari-pentru-afaceri-mici).

## How to explain the process to the client

Some clients, especially older ones or those signing online for the first time, need a short explanation. What works:

- **a simple message** before sending: "I'm emailing you the quote; you can read it on your phone and, if you agree, accept it with one click";
- **clear on-page instructions** at every step: where to read, where to tick, where to sign;
- **the option to download the document** before and after signing;
- **a phone number or email** they can use if they get stuck;
- **an immediate confirmation** with the signed document attached.

Once they've signed online once, almost all clients prefer the online option for later documents.

## Frequently asked questions

### Is a contract signed online legally valid?

In the European Union, the eIDAS Regulation states that an electronic signature cannot be denied legal effect solely because it is electronic. Its strength as evidence depends on the type of signature and the evidence kept. For documents where the law requires a special form, check with a lawyer which type of signature is needed.

### What's the difference between simple, advanced and qualified signatures?

A simple signature is any electronic form of agreement. An advanced signature is uniquely linked to the signatory and shows whether the document has been changed. A qualified signature is an advanced signature based on a qualified certificate issued by a trust service provider, and it has the effect of a handwritten signature.

### Does the client need a qualified electronic signature too?

No. For most ordinary service contracts, a simple or advanced electronic signature with clear evidence is enough. A qualified signature is only needed where the law or the parties require it.

### What evidence should be kept when signing online?

The signatory's name, email, the date and time of signing, the IP address, the exact version of the signed document and the history of actions. The signed document must no longer be editable and must be sent to both parties.

### Can contract appendices be signed online too?

Yes. Appendices for extra services or new stages can be generated and signed online, just like the original contract.

## Conclusion

Quotes and contracts signed online aren't just more modern; they're faster, clearer and easier to track. Choose the type of signature that fits the document, keep evidence of signing and connect the process to the rest of your work: CRM, projects, invoicing.

If you'd like an online quote and contract system built around your process, see our [CRM and automation](/servicii/crm-automatizari) page or [write to us](/incepe-un-proiect). If you're just starting, read our guide [What a CRM is](/blog/de-ce-ai-nevoie-de-un-crm) first.`,
  },
};

export default article;
