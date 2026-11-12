import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "e-factura-pentru-magazine-online",
  category: "ecommerce",
  tags: ["e-Factura", "facturare", "magazin online", "ANAF", "SPV"],
  ro: {
    title: "e-Factura și magazinul online: ce trebuie să știi și cum automatizezi totul",
    seoTitle: "e-Factura pentru magazine online: ghid practic de automatizare",
    description: "Ce înseamnă sistemul RO e-Factura pentru un magazin online, cum legi magazinul de programul de facturare, ce date trebuie colectate la comandă și cum eviți greșelile frecvente.",
    excerpt: "Facturile emise de mână, la final de lună, nu mai funcționează pentru un magazin online. Iată, pe înțeles, ce presupune e-Factura și cum îți automatizezi facturarea de la comandă până la ANAF.",
    content: `**Pe scurt:** RO e-Factura este sistemul național prin care facturile emise de firmele din România sunt transmise electronic către ANAF, într-un format standard. În ultimii ani, obligația s-a extins de la relațiile cu statul la tranzacțiile între firme și, din 2025, și la facturile emise către persoane fizice, cu reguli specifice. Pentru un magazin online, soluția practică e simplă: magazinul se leagă de un program de facturare care emite automat factura la plată sau la expediere și o transmite în sistemul e-Factura. Regulile de detaliu (termene, excepții, date obligatorii) se schimbă, așa că verifică-le mereu cu contabilul tău și pe site-ul ANAF.

O precizare importantă înainte de orice: nu sunt contabil și nici consultant fiscal. Construiesc magazine online și le leg de programele de facturare, deci cunosc partea practică. Pentru obligațiile fiscale exacte ale firmei tale, discută întotdeauna cu contabilul. Articolul te ajută să înțelegi ce trebuie să ceri de la magazin și de la programul de facturare.

## Ce este, pe înțeles, RO e-Factura

Până de curând, o factură era un document trimis clientului: pe hârtie, în PDF sau pe email. Cu RO e-Factura, factura are și o variantă electronică, într-un format standard (un fișier XML structurat), care e transmisă prin sistemul ANAF. Practic:

1. emiți factura în programul de facturare;
2. programul o transformă în formatul standard;
3. o transmite în sistemul e-Factura, prin Spațiul Privat Virtual (SPV) al firmei;
4. sistemul o validează și o înregistrează.

Programele de facturare moderne fac pașii 2–4 automat, după ce le dai acces la SPV. Informațiile oficiale și actualizările le găsești pe [site-ul ANAF](https://www.anaf.ro/).

## De ce contează pentru un magazin online

Un magazin are, de obicei, multe facturi de valoare mică. Dacă le emiți de mână, apar trei probleme:

- **timp pierdut**: fiecare comandă înseamnă câteva minute de copiat date;
- **greșeli**: un CNP, un nume sau o adresă introduse greșit;
- **întârzieri**: facturile transmise după termenul legal pot aduce sancțiuni.

Automatizarea elimină toate trei.

## Cum arată fluxul automatizat

| Pas | Cine îl face |
|---|---|
| Clientul plasează comanda și plătește | magazinul online + procesatorul de plăți |
| Comanda e marcată ca plătită sau expediată | magazinul online |
| Factura e emisă cu datele din comandă | programul de facturare, automat |
| Factura e transmisă în e-Factura | programul de facturare, automat |
| Clientul primește factura pe email | magazinul sau programul de facturare |
| Contabilul vede facturile | în programul de facturare și în SPV |

Momentul în care se emite factura (la plată, la expediere, la livrare) se stabilește împreună cu contabilul, în funcție de modul de plată și de regulile aplicabile.

## Ce program de facturare alegi

În România, cele mai folosite programe de facturare online, precum [SmartBill](https://www.smartbill.ro/), [Oblio](https://www.oblio.eu/) sau [FGO](https://www.fgo.ro/), au funcții pentru e-Factura și integrări cu platformele de magazin. Când alegi, verifică:

- dacă are integrare oficială sau stabilă cu platforma magazinului tău;
- dacă emite automat facturi la comandă, la plată sau la expediere;
- dacă transmite automat în e-Factura și îți arată statusul fiecărei facturi;
- cum gestionează stornările și facturile de rambursare pentru retururi;
- dacă trimite automat factura clientului;
- ce costă abonamentul pentru volumul tău de facturi;
- dacă are acces pentru contabil.

## Ce date trebuie colectate la comandă

Ca factura să fie corectă, magazinul trebuie să colecteze datele necesare. De obicei:

- **pentru persoane fizice**: nume, adresă de facturare și alte date de identificare cerute de regulile în vigoare;
- **pentru firme**: denumire, CUI, număr de la Registrul Comerțului, sediu;
- **o opțiune clară** în coș: „Persoană fizică” sau „Firmă”, cu câmpurile potrivite pentru fiecare.

Ce date exacte sunt obligatorii pentru persoanele fizice în e-Factura s-a schimbat de câteva ori. Configurează formularul de comandă împreună cu contabilul și programul de facturare, ca să ceri doar ce trebuie și nimic în plus. Orice dată personală colectată trebuie să apară și în politica de confidențialitate, așa cum am explicat în ghidul despre [obligațiile legale ale unui magazin online](/blog/obligatii-legale-magazin-online).

## Retururi, rambursări și stornări

Retururile sunt partea în care se fac cele mai multe greșeli. Când un client returnează un produs:

- banii se rambursează, de obicei, prin aceeași metodă de plată;
- factura inițială se stornează integral sau parțial, printr-un document fiscal corect;
- documentul de stornare se transmite și el în e-Factura;
- stocul se actualizează în magazin.

Un program de facturare bine legat de magazin poate face o mare parte din acești pași automat. Despre rambursări am vorbit și în ghidul despre [plățile online pentru magazin](/blog/plati-online-magazin).

## Accesul la SPV și securitatea

Spațiul Privat Virtual (SPV) e contul firmei în relația cu ANAF, deci accesul la el trebuie tratat cu grijă:

- **programul de facturare** primește de obicei acces printr-o autorizare specifică, nu prin parola ta;
- **autorizarea are o perioadă de valabilitate**; notează când expiră și reînnoiește-o din timp, altfel facturile nu se mai transmit automat;
- **contabilul** poate avea acces separat, în nume propriu;
- **colaboratorii care pleacă** trebuie să-și piardă imediat accesul;
- **certificatul digital** folosit pentru SPV se păstrează în siguranță și nu se trimite pe email.

Un exemplu clasic de problemă: autorizarea programului de facturare expiră, nimeni nu observă, iar timp de câteva zile facturile se emit, dar nu ajung în sistem. O alertă în calendar cu o săptămână înainte de expirare rezolvă situația.

## Livrarea, reducerile și cupoanele pe factură

Câteva detalii care apar des în magazine și trebuie configurate corect:

- **costul livrării** apare de obicei ca linie separată pe factură, nu ascuns în prețul produsului;
- **reducerile și cupoanele** trebuie reflectate corect, fie ca preț redus, fie ca linie de discount, după cum stabilești cu contabilul;
- **produsele cadou** sau mostrele gratuite au regulile lor fiscale;
- **comenzile parțial livrate** pot avea nevoie de facturi separate.

## Firma neplătitoare de TVA

Dacă firma ta nu e înregistrată în scopuri de TVA, facturile se emit fără TVA, iar acest lucru trebuie configurat corect în programul de facturare și în magazin. E bine să menționezi pe site că prețurile sunt finale. Dacă firma devine plătitoare de TVA, prețurile, facturile și setările magazinului trebuie actualizate din prima zi, cu ajutorul contabilului.

## Ce verifici săptămânal

Chiar și cu totul automatizat, o verificare rapidă săptămânală te scutește de surprize:

1. toate comenzile plătite au factură;
2. toate facturile au fost transmise și validate în e-Factura;
3. facturile respinse au fost corectate și retransmise;
4. retururile au documentele fiscale corespunzătoare;
5. contabilul are acces la tot ce îi trebuie.

Majoritatea programelor de facturare îți arată statusul fiecărei facturi într-o listă, deci verificarea durează câteva minute.

## Greșeli frecvente

- **Facturi emise manual, la final de lună**, transmise cu întârziere.
- **Formular de comandă fără opțiunea „Firmă”**, iar firmele primesc facturi pe persoană fizică.
- **Date incomplete** pentru persoane fizice sau firme, care duc la facturi respinse.
- **Retururi fără stornare** sau stornări netransmise.
- **Setări greșite de TVA**, mai ales după schimbarea statutului firmei.
- **Nimeni nu verifică** facturile respinse de sistem.
- **Accesul la SPV** dat unor colaboratori care nu mai lucrează cu firma.

## Cum legăm magazinul de facturare

Când construim un magazin online, legarea de programul de facturare face parte din proiect: alegem împreună momentul emiterii facturii, configurăm câmpurile pentru persoane fizice și firme, setările de TVA, emailurile cu factura și fluxul pentru retururi. Dacă ai deja un magazin, putem adăuga această legătură separat. Pentru firme de servicii, aceeași logică se aplică și ofertelor, contractelor și facturilor din CRM; am scris despre asta în ghidul despre [automatizări pentru afaceri mici](/blog/automatizari-pentru-afaceri-mici). Detalii despre costuri găsești în ghidul despre [cât costă un magazin online](/blog/cat-costa-un-magazin-online) și pe pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri).

## Exemplu: un magazin mic care a renunțat la facturarea manuală

Un magazin cu câteva zeci de comenzi pe săptămână emitea facturile manual, în fiecare seară, copiind datele din comenzi. Pe lângă timpul pierdut, apăreau des greșeli de nume și adresă, iar uneori facturile ajungeau târziu în sistem. Am făcut următoarele:

- am adăugat în coș alegerea „Persoană fizică / Firmă”, cu câmpurile potrivite;
- am legat magazinul de programul de facturare deja folosit;
- factura se emite automat la confirmarea plății cu cardul și la expedierea comenzilor ramburs;
- factura se transmite automat în e-Factura și ajunge pe email la client;
- returnările generează automat documentul de stornare, verificat apoi de contabil.

Facturarea zilnică a dispărut din programul proprietarului, iar greșelile de date s-au redus aproape la zero.

## Ce să întrebi contabilul înainte de automatizare

Ca să configurezi totul corect de la început, merită o discuție scurtă cu contabilul. Întrebările utile:

1. În ce moment se emite factura pentru fiecare metodă de plată (card, ramburs, transfer)?
2. Ce date sunt obligatorii acum pentru facturile către persoane fizice?
3. Cum tratăm retururile și rambursările, din punct de vedere fiscal?
4. Ce serie de facturi folosim pentru magazin?
5. Cum tratăm livrarea în factură: ca produs separat sau inclusă?
6. Avem obligații speciale pentru produsele pe care le vindem?
7. Cine verifică facturile respinse și cât de des?

Notează răspunsurile și dă-le celui care configurează magazinul și programul de facturare.

## Întrebări frecvente

### Ce este RO e-Factura?

RO e-Factura este sistemul național prin care facturile emise de firmele din România sunt transmise electronic către ANAF, într-un format standard, prin Spațiul Privat Virtual al firmei. Programele de facturare moderne fac această transmitere automat.

### Trebuie să trimit în e-Factura și facturile către persoane fizice?

Din 2025, sistemul se aplică și facturilor emise către persoane fizice, cu reguli specifice. Detaliile s-au schimbat de câteva ori, așa că verifică regulile la zi cu contabilul tău și pe site-ul ANAF.

### Pot automatiza complet facturarea magazinului online?

Da. Prin legarea magazinului de un program de facturare, factura se poate emite automat la plată sau la expediere, se transmite în e-Factura și ajunge pe email la client. Rămâne doar verificarea periodică a statusului facturilor.

### Ce program de facturare să folosesc pentru magazin?

Un program care are integrare stabilă cu platforma magazinului tău, transmite automat în e-Factura, gestionează stornările pentru retururi și oferă acces contabilului. În România, printre cele mai folosite sunt SmartBill, Oblio și FGO.

### Ce se întâmplă dacă o factură e respinsă de sistem?

Programul de facturare îți arată eroarea. De obicei e vorba de date lipsă sau greșite. Factura se corectează și se retransmite. De aceea e important ca cineva să verifice periodic lista facturilor respinse.

## Concluzie

e-Factura nu trebuie să fie o povară pentru un magazin online. Cu magazinul legat de un program de facturare, cu datele potrivite colectate la comandă și cu o verificare rapidă săptămânală, facturarea devine un proces automat, corect și la timp.

Dacă vrei să-ți legăm magazinul de programul de facturare sau să construim un magazin cu facturarea automatizată de la început, [scrie-ne](/incepe-un-proiect) și îți răspundem în 24 de ore lucrătoare.`,
  },
  en: {
    title: "e-Factura and your online store: what you need to know and how to automate it all",
    seoTitle: "e-Factura for online stores in Romania: a practical guide",
    description: "What Romania's RO e-Factura system means for an online store, how to connect your store to invoicing software, what data to collect at checkout and how to avoid common mistakes.",
    excerpt: "Invoices issued by hand at the end of the month no longer work for an online store. Here's, in plain language, what e-Factura involves and how to automate invoicing from order to tax authority.",
    content: `**In short:** RO e-Factura is Romania's national system through which invoices issued by Romanian companies are sent electronically to ANAF, the national tax authority, in a standard format. Over recent years the obligation has expanded from dealings with the state to business-to-business transactions and, from 2025, to invoices issued to individuals, with specific rules. For an online store, the practical solution is simple: connect the store to invoicing software that automatically issues the invoice on payment or dispatch and submits it to the e-Factura system. The detailed rules (deadlines, exceptions, mandatory data) change, so always check them with your accountant and on the ANAF website.

An important note before anything else: I'm not an accountant or tax adviser. I build online stores and connect them to invoicing software, so I know the practical side. For your company's exact tax obligations, always talk to your accountant. This article helps you understand what to ask of your store and your invoicing software.

This article applies specifically to companies registered in Romania; other EU countries are introducing similar e-invoicing systems with their own rules.

## What RO e-Factura is, in plain language

Until recently, an invoice was a document sent to the customer: on paper, as a PDF or by email. With RO e-Factura, the invoice also has an electronic version in a standard format (a structured XML file), submitted through the ANAF system. In practice:

1. you issue the invoice in your invoicing software;
2. the software converts it into the standard format;
3. it submits it to the e-Factura system through the company's Private Virtual Space (SPV);
4. the system validates and records it.

Modern invoicing software does steps 2–4 automatically once you give it access to the SPV. You'll find official information and updates on the [ANAF website](https://www.anaf.ro/).

## Why it matters for an online store

A store usually has many low-value invoices. If you issue them by hand, three problems appear:

- **lost time**: every order means a few minutes of copying data;
- **mistakes**: a personal ID number, name or address entered wrongly;
- **delays**: invoices submitted after the legal deadline can lead to penalties.

Automation removes all three.

## What the automated flow looks like

| Step | Who does it |
|---|---|
| The customer places the order and pays | the online store + the payment processor |
| The order is marked as paid or shipped | the online store |
| The invoice is issued with the order data | the invoicing software, automatically |
| The invoice is submitted to e-Factura | the invoicing software, automatically |
| The customer receives the invoice by email | the store or the invoicing software |
| The accountant sees the invoices | in the invoicing software and in the SPV |

The moment the invoice is issued (on payment, dispatch or delivery) is agreed with your accountant, depending on the payment method and the applicable rules.

## Which invoicing software to choose

In Romania, the most widely used online invoicing tools, such as [SmartBill](https://www.smartbill.ro/), [Oblio](https://www.oblio.eu/) or [FGO](https://www.fgo.ro/), have e-Factura features and integrations with store platforms. When choosing, check:

- whether it has an official or stable integration with your store's platform;
- whether it issues invoices automatically on order, payment or dispatch;
- whether it submits to e-Factura automatically and shows you each invoice's status;
- how it handles credit notes and refund invoices for returns;
- whether it sends the invoice to the customer automatically;
- what the subscription costs for your volume of invoices;
- whether it offers access for your accountant.

## What data to collect at checkout

For the invoice to be correct, the store has to collect the necessary data. Usually:

- **for individuals**: name, billing address and any other identification data required by the current rules;
- **for companies**: company name, tax ID (CUI), Trade Register number, registered office;
- **a clear option** in the cart: "Individual" or "Company", with the right fields for each.

Exactly which data is mandatory for individuals under e-Factura has changed several times. Set up the checkout form together with your accountant and invoicing software, so you ask only for what's needed and nothing more. Any personal data collected must also appear in your privacy policy, as I explained in our guide to the [legal requirements for an online store](/blog/obligatii-legale-magazin-online).

## Returns, refunds and credit notes

Returns are where most mistakes happen. When a customer returns a product:

- the money is usually refunded through the same payment method;
- the original invoice is reversed in full or in part through a correct tax document;
- the reversal document is also submitted to e-Factura;
- stock is updated in the store.

Invoicing software that's well connected to your store can handle many of these steps automatically. I also discussed refunds in our guide to [online payments for your store](/blog/plati-online-magazin).

## SPV access and security

The Private Virtual Space (SPV) is the company's account with ANAF, so access to it must be handled carefully:

- **the invoicing software** usually gets access through a specific authorisation, not your password;
- **the authorisation has a validity period**; note when it expires and renew it in time, otherwise invoices stop being submitted automatically;
- **your accountant** can have separate access in their own name;
- **contractors who leave** must lose access immediately;
- **the digital certificate** used for the SPV is kept safe and never sent by email.

A classic problem: the invoicing software's authorisation expires, nobody notices, and for a few days invoices are issued but never reach the system. A calendar alert a week before expiry solves it.

## Delivery, discounts and coupons on the invoice

A few details that come up often in stores and must be set up correctly:

- **the delivery cost** usually appears as a separate line on the invoice, not hidden in the product price;
- **discounts and coupons** must be reflected correctly, either as a reduced price or as a discount line, as agreed with your accountant;
- **free gifts** or samples have their own tax rules;
- **partially shipped orders** may need separate invoices.

## Companies not registered for VAT

If your company isn't registered for VAT, invoices are issued without VAT, and this has to be set up correctly in both the invoicing software and the store. It's good practice to state on your website that prices are final. If the company becomes VAT-registered, prices, invoices and store settings must be updated from day one, with your accountant's help.

## What to check every week

Even with everything automated, a quick weekly check saves you from surprises:

1. every paid order has an invoice;
2. every invoice has been submitted and validated in e-Factura;
3. rejected invoices have been corrected and resubmitted;
4. returns have the corresponding tax documents;
5. your accountant has access to everything they need.

Most invoicing software shows each invoice's status in a list, so the check takes a few minutes.

## Common mistakes

- **Invoices issued manually at the end of the month**, submitted late.
- **A checkout form with no "Company" option**, so businesses receive invoices made out to individuals.
- **Incomplete data** for individuals or companies, leading to rejected invoices.
- **Returns without credit notes**, or credit notes never submitted.
- **Wrong VAT settings**, especially after a change in the company's status.
- **Nobody checking** invoices rejected by the system.
- **SPV access** still held by contractors who no longer work with the company.

## How we connect the store to invoicing

When we build an online store, connecting it to invoicing software is part of the project: together we choose when invoices are issued, set up the fields for individuals and companies, the VAT settings, the invoice emails and the returns flow. If you already have a store, we can add this connection separately. For service companies, the same logic applies to quotes, contracts and invoices in a CRM; I wrote about that in our guide to [automation for small businesses](/blog/automatizari-pentru-afaceri-mici). You'll find cost details in our guide on [how much an online store costs](/blog/cat-costa-un-magazin-online) and on our [website development](/servicii/dezvoltare-website-uri) page.

## Example: a small store that stopped invoicing by hand

A store with a few dozen orders a week issued invoices by hand every evening, copying data from the orders. Besides the time lost, there were frequent mistakes in names and addresses, and invoices sometimes reached the system late. We did the following:

- added an "Individual / Company" choice to the cart, with the right fields;
- connected the store to the invoicing software it already used;
- invoices are now issued automatically when a card payment is confirmed and when cash-on-delivery orders are shipped;
- invoices are submitted automatically to e-Factura and emailed to the customer;
- returns automatically generate the reversal document, which the accountant then checks.

Daily invoicing disappeared from the owner's schedule, and data errors dropped to almost zero.

## What to ask your accountant before automating

To set everything up correctly from the start, a short conversation with your accountant is worth it. Useful questions:

1. At what point is the invoice issued for each payment method (card, cash on delivery, transfer)?
2. What data is currently mandatory for invoices to individuals?
3. How do we handle returns and refunds from a tax point of view?
4. Which invoice series do we use for the store?
5. How do we show delivery on the invoice: as a separate item or included?
6. Do we have special obligations for the products we sell?
7. Who checks rejected invoices, and how often?

Write down the answers and give them to whoever sets up the store and the invoicing software.

## Frequently asked questions

### What is RO e-Factura?

RO e-Factura is Romania's national system through which invoices issued by Romanian companies are sent electronically to ANAF in a standard format, through the company's Private Virtual Space. Modern invoicing software submits them automatically.

### Do invoices to individuals also have to go through e-Factura?

From 2025, the system also applies to invoices issued to individuals, with specific rules. The details have changed several times, so check the current rules with your accountant and on the ANAF website.

### Can I fully automate my online store's invoicing?

Yes. By connecting the store to invoicing software, invoices can be issued automatically on payment or dispatch, submitted to e-Factura and emailed to the customer. All that's left is a regular check of invoice statuses.

### Which invoicing software should I use for my store?

Software with a stable integration with your store platform, automatic e-Factura submission, credit-note handling for returns and access for your accountant. In Romania, SmartBill, Oblio and FGO are among the most widely used.

### What happens if an invoice is rejected by the system?

The invoicing software shows you the error. It's usually missing or incorrect data. The invoice is corrected and resubmitted. That's why it matters that someone checks the list of rejected invoices regularly.

## Conclusion

e-Factura doesn't have to be a burden for an online store. With the store connected to invoicing software, the right data collected at checkout and a quick weekly check, invoicing becomes an automatic, accurate and on-time process.

If you'd like us to connect your store to your invoicing software, or to build a store with automated invoicing from the start, [write to us](/incepe-un-proiect) and we'll reply within 24 working hours.`,
  },
};

export default article;
