import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "plati-online-magazin",
  category: "ecommerce",
  tags: ["plăți online", "procesator plăți", "plata cu cardul", "ramburs", "magazin online"],
  ro: {
    title: "Plăți online pentru magazinul tău: card, ramburs, transfer și cum alegi procesatorul",
    seoTitle: "Plăți online pentru magazin: cum alegi procesatorul",
    description: "Ce metode de plată să oferi într-un magazin online din România, cum funcționează procesatorii de plăți, ce comisioane să compari, ce înseamnă 3-D Secure și cum reduci comenzile abandonate.",
    excerpt: "Metodele de plată decid dacă un client finalizează comanda sau abandonează coșul. Iată ce opțiuni să oferi, cum compari procesatorii și ce detalii fac plata sigură și simplă.",
    content: `**Pe scurt:** un magazin online din România ar trebui să ofere cel puțin plata cu cardul și plata la livrare (ramburs), iar pentru clienții firme, și plata prin transfer bancar pe baza facturii proforme. Plata cu cardul se face printr-un procesator de plăți autorizat, care se ocupă de securitate și de verificarea 3-D Secure. Când alegi procesatorul, compară comisionul pe tranzacție, costurile fixe, termenul în care primești banii, metodele de plată acceptate (inclusiv portofelele digitale), integrarea cu platforma ta și calitatea suportului.

Am integrat plăți online în magazine de toate felurile, de la branduri mici de cosmetice la firme care vând echipamente către alte firme. Întrebarea „ce procesator să aleg?” apare mereu. Răspunsul nu e „cel mai ieftin”, ci cel care se potrivește cu tipul tău de clienți, cu volumul de vânzări și cu platforma pe care e construit magazinul.

## Ce metode de plată să oferi

| Metodă | Avantaje | Dezavantaje |
|---|---|---|
| Card online | rapidă, banii vin sigur, fără retururi de colete neplătite | comision pe tranzacție |
| Ramburs (plata la livrare) | încredere pentru clienții noi, încă foarte folosită în România | colete refuzate, costuri de retur, banii vin mai târziu |
| Transfer bancar / ordin de plată | potrivit pentru firme și sume mari | mai lent, trebuie verificată manual sau automat plata |
| Portofele digitale (Apple Pay, Google Pay) | foarte rapide pe telefon | depind de procesatorul ales |
| Plata în rate | ajută la produse scumpe | condiții și costuri specifice, integrare separată |

Pentru majoritatea magazinelor mici, combinația **card + ramburs** e punctul de pornire. Pe măsură ce crești, adaugi transferul pentru firme, portofelele digitale și, dacă vinzi produse scumpe, plata în rate.

## Cum funcționează plata cu cardul, pe scurt

1. Clientul alege plata cu cardul la finalizarea comenzii.
2. E trimis pe o pagină securizată a procesatorului de plăți (sau vede un formular securizat integrat în magazin).
3. Introduce datele cardului; banca îi poate cere confirmarea prin 3-D Secure (cod sau aprobare în aplicația băncii).
4. Procesatorul confirmă plata, iar magazinul marchează comanda ca plătită.
5. Banii ajung în contul firmei tale după un anumit număr de zile, minus comisionul.

Datele cardului nu trec prin serverul magazinului tău, ceea ce îți simplifică mult partea de securitate.

## Ce înseamnă 3-D Secure și autentificarea strictă

În Uniunea Europeană, directiva privind serviciile de plată ([PSD2](https://eur-lex.europa.eu/eli/dir/2015/2366/oj)) a introdus autentificarea strictă a clienților pentru multe plăți online. În practică, clientul confirmă plata și în aplicația băncii sau cu un cod. Pentru tine, asta înseamnă:

- mai puține fraude cu carduri furate;
- un pas în plus pentru client, care trebuie să fie cât mai simplu;
- nevoia unui procesator care gestionează corect acest pas, mai ales pe telefon.

## Cum alegi procesatorul de plăți

### 1. Comisioanele

Compară:

- **comisionul pe tranzacție** (de obicei un procent din valoarea plății);
- **o sumă fixă pe tranzacție**, dacă există;
- **costuri lunare sau anuale** de abonament;
- **costuri de instalare**;
- **comisioane diferite** pentru carduri emise în afara Uniunii Europene sau carduri business;
- **costul rambursărilor** și al disputelor (chargeback).

Verifică întotdeauna ofertele actuale direct pe site-urile procesatorilor, de exemplu [Netopia Payments](https://netopia-payments.com/) sau [Stripe](https://stripe.com/), pentru că se schimbă în timp.

### 2. În cât timp primești banii

Unii procesatori virează banii zilnic, alții săptămânal. Pentru un magazin mic, la care cash-flow-ul contează, diferența poate fi importantă.

### 3. Metodele acceptate

Carduri Visa și Mastercard, portofele digitale, eventual plata în rate sau alte metode locale. Verifică ce poate fi activat și cu ce costuri.

### 4. Integrarea cu magazinul tău

Procesatorul trebuie să aibă o integrare stabilă cu platforma pe care e construit magazinul: extensie oficială, documentație bună, actualizări regulate. O integrare instabilă înseamnă comenzi marcate greșit și clienți nemulțumiți.

### 5. Experiența pe telefon

Testează plata pe telefon, ca un client. Câte ecrane sunt? Se încarcă repede? Pasul 3-D Secure funcționează fără probleme? Majoritatea comenzilor vin de pe mobil.

### 6. Suportul și documentele

Cât de repede răspund? Ce documente îți cer la înrolare? De obicei, procesatorii cer datele firmei, site-ul funcțional, termenii și condițiile, politica de retur și informațiile despre livrare. De aceea paginile legale trebuie să fie gata înainte de activarea plăților; le-am explicat în ghidul despre [obligațiile legale ale unui magazin online](/blog/obligatii-legale-magazin-online).

## Plata ramburs: cum o gestionezi inteligent

Rambursul rămâne foarte folosit în România, mai ales de clienții care cumpără prima dată de la tine. Dar are costuri ascunse: colete refuzate, transport dus-întors plătit de tine, produse blocate pe drum. Câteva idei:

- **confirmă comenzile ramburs** mari printr-un mesaj sau un apel;
- **taxa de ramburs**, dacă există, trebuie afișată clar înainte de comandă;
- **încurajează plata cu cardul** cu un mic avantaj (de exemplu livrare gratuită de la un prag mai mic), comunicat clar;
- **urmărește clienții** care refuză sistematic coletele.

## Securitatea plăților

Standardul internațional pentru securitatea datelor de card este [PCI DSS](https://www.pcisecuritystandards.org/). Dacă folosești pagina securizată a procesatorului sau formularele lui integrate, mare parte din responsabilitate e preluată de el. Ce rămâne la tine:

- certificat HTTPS pe tot site-ul;
- actualizări regulate ale platformei magazinului și ale extensiilor;
- parole puternice și autentificare în doi pași pentru panoul de administrare;
- acces limitat la contul procesatorului;
- monitorizarea comenzilor suspecte (de exemplu, multe comenzi mari, cu adrese diferite, în scurt timp).

## Cum reduci comenzile abandonate la plată

- **afișează costurile de livrare devreme**, nu abia la final;
- **permite comanda fără cont**;
- **cere doar câmpurile necesare**;
- **arată metodele de plată** încă din coș;
- **pagina de plată să fie rapidă** și adaptată pentru telefon;
- **mesaje clare de eroare**, dacă plata eșuează, și posibilitatea de a reîncerca ușor;
- **emailuri automate** pentru coșurile abandonate, doar cu acordul clientului.

## Plățile și facturarea

Fiecare plată trebuie să ducă la o factură corectă. Ideal, procesul e automat: plata confirmată, factura emisă prin programul de facturare, transmisă în sistemul e-Factura și trimisă clientului. Despre automatizarea facturării am scris în ghidul despre [automatizări pentru afaceri mici](/blog/automatizari-pentru-afaceri-mici).

## Ce primește clientul după plată

Experiența de după plată contează la fel de mult ca plata în sine. Clientul ar trebui să primească:

- o pagină de confirmare clară, cu numărul comenzii;
- un email cu detaliile comenzii, plata și informațiile despre retur;
- factura;
- un email când comanda e expediată, cu numărul de urmărire;
- informații despre cum te contactează, dacă ceva nu e în regulă.

Ca emailurile acestea să nu ajungă în spam, domeniul trebuie configurat corect, așa cum am explicat în ghidul despre [domeniu, găzduire și email profesional](/blog/domeniu-gazduire-email-profesional).

## Plățile pentru clienții firme

Dacă vinzi și către alte firme, ai nevoie de câteva lucruri în plus:

- **câmpuri pentru datele firmei** la finalizarea comenzii: denumire, CUI, număr de la Registrul Comerțului, adresă;
- **factură proformă** generată automat, pentru plata prin ordin de plată;
- **verificarea automată a plății** sau o procedură clară de verificare, ca să nu expediezi înainte de încasare;
- **termene de plată** pentru clienții recurenți, dacă vrei să le oferi;
- **facturi emise corect pe firmă**, transmise în sistemul e-Factura.

Pentru firmele care cumpără des, un cont de client cu istoric și facturi descărcabile economisește timp ambelor părți. Iar dacă vinzi doar către firme, merită să te gândești dacă nu ai nevoie mai degrabă de un portal B2B, cu prețuri și condiții diferite pentru fiecare client.

## Rambursări și dispute: cum le gestionezi

Rambursările fac parte din viața oricărui magazin. Câteva reguli:

- **rambursează prin aceeași metodă** prin care s-a plătit, de obicei direct din contul procesatorului;
- **respectă termenul legal** de rambursare pentru retururi;
- **emite documentele fiscale corecte** pentru rambursare, împreună cu contabilul tău;
- **răspunde repede la dispute** (chargeback): procesatorul îți cere de obicei dovezi, cum ar fi confirmarea livrării și corespondența cu clientul;
- **păstrează dovezile**: numărul de urmărire al coletului, confirmarea de livrare, emailurile.

## Lista de verificare înainte de a activa plățile

1. Paginile legale sunt publicate: termeni, retur, livrare, confidențialitate.
2. Datele firmei sunt corecte pe site.
3. Ai făcut o comandă de test cu cardul și una cu ramburs.
4. Ai testat plata pe telefon, inclusiv pasul 3-D Secure.
5. Facturile se emit corect după plată.
6. Emailurile de confirmare ajung în căsuța principală, nu în spam.
7. Ai acces la contul procesatorului și știi unde vezi tranzacțiile.

## Greșeli frecvente

- **Doar ramburs**, fără plata cu cardul. Pierzi clienții care preferă cardul.
- **Doar card**, fără ramburs, într-un magazin nou. Pierzi clienții care nu te cunosc încă.
- **Alegi procesatorul doar după comision.** O integrare proastă te costă mai mult.
- **Nu testezi plata pe telefon.**
- **Activezi plățile înainte de a avea paginile legale.**
- **Nu verifici rambursările și disputele** în contul procesatorului.

## Exemplu: un magazin mic de produse handmade

Un magazin cu aproximativ 40 de produse, vândute mai ales către persoane fizice:

- **card online**, printr-un procesator cu integrare oficială pentru platforma magazinului, cu Apple Pay și Google Pay activate;
- **ramburs**, cu taxa afișată clar în coș;
- **livrare gratuită** de la un prag puțin mai mic pentru plata cu cardul, comunicată în coș;
- **facturare automată** după plată sau la expediere;
- **emailuri automate** de confirmare, expediere și livrare.

Rezultatul: clienții noi pot alege rambursul, cei care au încredere aleg cardul, iar proprietarul nu mai emite manual nicio factură. După câteva luni, datele din contul procesatorului și din magazin arată clar ce metodă de plată preferă clienții și unde se pierd comenzile, iar deciziile următoare se iau pe cifre reale, nu pe impresii.

## Întrebări frecvente

### Ce metode de plată ar trebui să ofere un magazin online?

Cel puțin plata cu cardul și plata ramburs. Pentru clienții firme, transferul bancar. Pe măsură ce magazinul crește, portofelele digitale și, pentru produse scumpe, plata în rate.

### Cât costă plata cu cardul pentru un magazin?

Procesatorii percep de obicei un comision procentual pe fiecare tranzacție, uneori plus o sumă fixă și eventual un abonament. Valorile diferă de la un procesator la altul și se schimbă în timp, așa că verifică ofertele actuale direct la procesatori.

### Ce documente îmi trebuie ca să activez plata cu cardul?

De obicei, datele firmei, un site funcțional, termenii și condițiile, politica de retur, informațiile despre livrare și datele de contact. Fiecare procesator are lista lui de cerințe.

### Datele cardurilor clienților ajung pe serverul meu?

Nu, dacă folosești pagina securizată sau formularele integrate ale procesatorului. Datele cardului sunt procesate direct de acesta, ceea ce îți reduce mult responsabilitatea privind securitatea.

### Ce este 3-D Secure?

Este un pas suplimentar de verificare la plata cu cardul online, în care clientul confirmă plata în aplicația băncii sau printr-un cod. Reduce fraudele și e cerut pentru multe plăți online în Uniunea Europeană.

## Concluzie

Plățile sunt ultimul pas înainte ca un vizitator să devină client. Oferă cardul și rambursul de la început, alege un procesator cu integrare bună, nu doar cu cel mai mic comision, testează totul pe telefon și automatizează facturarea. Un pas de plată simplu și sigur se vede direct în numărul de comenzi.

Dacă îți construiești magazinul sau vrei să-l îmbunătățești, citește ghidul despre [cât costă un magazin online](/blog/cat-costa-un-magazin-online) și vezi pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri), sau [scrie-ne](/incepe-un-proiect).`,
  },
  en: {
    title: "Online payments for your store: cards, cash on delivery, bank transfer and choosing a processor",
    seoTitle: "Online payments for your store: choosing a payment processor",
    description: "Which payment methods to offer in an online store, how payment processors work, which fees to compare, what 3-D Secure means and how to reduce abandoned orders.",
    excerpt: "Payment methods decide whether a customer completes the order or abandons the cart. Here's which options to offer, how to compare processors and which details make payment safe and simple.",
    content: `**In short:** an online store in Romania should offer at least card payments and payment on delivery (cash on delivery), and for business customers, bank transfer against a pro forma invoice. Card payments go through an authorised payment processor, which handles security and 3-D Secure verification. When choosing a processor, compare the fee per transaction, fixed costs, how soon you receive the money, the payment methods accepted (including digital wallets), integration with your platform and the quality of support.

I've integrated online payments into all kinds of stores, from small cosmetics brands to companies selling equipment to other businesses. The question "which processor should I choose?" always comes up. The answer isn't "the cheapest one", but the one that suits your type of customers, your sales volume and the platform your store is built on.

## Which payment methods to offer

| Method | Advantages | Disadvantages |
|---|---|---|
| Online card payment | fast, guaranteed money, no unpaid parcels coming back | a fee per transaction |
| Cash on delivery | trust for new customers, still very common in Romania | refused parcels, return costs, money arrives later |
| Bank transfer | suits businesses and large amounts | slower, the payment has to be matched manually or automatically |
| Digital wallets (Apple Pay, Google Pay) | very fast on phones | depend on the processor you choose |
| Instalment payments | help with expensive products | specific terms and costs, separate integration |

For most small stores, **card + cash on delivery** is the starting point. As you grow, you add bank transfer for businesses, digital wallets and, if you sell expensive products, instalment payments.

## How card payment works, briefly

1. The customer chooses to pay by card at checkout.
2. They're sent to the payment processor's secure page (or see a secure form embedded in the store).
3. They enter their card details; the bank may ask them to confirm through 3-D Secure (a code or approval in the bank's app).
4. The processor confirms the payment, and the store marks the order as paid.
5. The money reaches your company's account after a certain number of days, minus the fee.

Card details don't pass through your store's server, which greatly simplifies the security side for you.

## What 3-D Secure and strong authentication mean

In the European Union, the Payment Services Directive ([PSD2](https://eur-lex.europa.eu/eli/dir/2015/2366/oj)) introduced strong customer authentication for many online payments. In practice, customers also confirm the payment in their bank's app or with a code. For you, that means:

- fewer frauds with stolen cards;
- an extra step for the customer, which must be as simple as possible;
- the need for a processor that handles this step properly, especially on phones.

## How to choose a payment processor

### 1. Fees

Compare:

- **the fee per transaction** (usually a percentage of the payment);
- **a fixed amount per transaction**, if there is one;
- **monthly or yearly subscription costs**;
- **setup costs**;
- **different fees** for cards issued outside the European Union or business cards;
- **the cost of refunds** and disputes (chargebacks).

Always check current offers directly on the processors' websites, for example [Netopia Payments](https://netopia-payments.com/) or [Stripe](https://stripe.com/), because they change over time.

### 2. How soon you get the money

Some processors pay out daily, others weekly. For a small store where cash flow matters, the difference can be important.

### 3. Accepted methods

Visa and Mastercard, digital wallets, possibly instalments or other local methods. Check what can be enabled and at what cost.

### 4. Integration with your store

The processor needs a stable integration with your store's platform: an official plugin, good documentation, regular updates. An unstable integration means orders marked incorrectly and unhappy customers.

### 5. The mobile experience

Test payment on a phone, as a customer would. How many screens are there? Do they load quickly? Does the 3-D Secure step work smoothly? Most orders come from mobile.

### 6. Support and paperwork

How quickly do they respond? What documents do they ask for at onboarding? Processors usually ask for company details, a working website, terms and conditions, a returns policy and delivery information. That's why your legal pages need to be ready before payments are activated; I explained them in our guide to the [legal requirements for an online store](/blog/obligatii-legale-magazin-online).

## Cash on delivery: how to manage it intelligently

Cash on delivery is still widely used in Romania, especially by customers buying from you for the first time. But it has hidden costs: refused parcels, return shipping you pay for, products stuck in transit. A few ideas:

- **confirm large cash-on-delivery orders** with a message or a call;
- **any cash-on-delivery fee** must be shown clearly before the order;
- **encourage card payment** with a small incentive (for example free delivery from a lower threshold), communicated clearly;
- **keep track of customers** who repeatedly refuse parcels.

## Payment security

The international standard for card data security is [PCI DSS](https://www.pcisecuritystandards.org/). If you use the processor's secure page or its embedded forms, much of the responsibility is taken on by the processor. What stays with you:

- an HTTPS certificate across the whole website;
- regular updates to the store platform and plugins;
- strong passwords and two-factor authentication for the admin panel;
- limited access to the processor account;
- monitoring for suspicious orders (for example, many large orders with different addresses in a short time).

## How to reduce abandoned orders at checkout

- **show delivery costs early**, not only at the end;
- **allow guest checkout**;
- **ask only for the necessary fields**;
- **show payment methods** already in the cart;
- **make the payment page fast** and mobile-friendly;
- **clear error messages** if payment fails, and an easy way to try again;
- **automatic abandoned-cart emails**, only with the customer's consent.

## Payments and invoicing

Every payment must lead to a correct invoice. Ideally the process is automatic: payment confirmed, invoice issued through your invoicing software, submitted to the e-Factura system and sent to the customer. I wrote about automating invoicing in our guide to [automation for small businesses](/blog/automatizari-pentru-afaceri-mici).

## What the customer receives after paying

The experience after payment matters as much as the payment itself. The customer should receive:

- a clear confirmation page with the order number;
- an email with the order details, payment and returns information;
- the invoice;
- an email when the order ships, with the tracking number;
- information on how to contact you if something isn't right.

For these emails not to land in spam, your domain must be configured correctly, as I explained in our guide to [domain, hosting and professional email](/blog/domeniu-gazduire-email-profesional).

## Payments for business customers

If you also sell to other businesses, you need a few extra things:

- **fields for company details** at checkout: company name, tax ID, Trade Register number, address;
- **a pro forma invoice** generated automatically, for payment by bank transfer;
- **automatic payment matching**, or a clear checking procedure, so you don't ship before you've been paid;
- **payment terms** for regular customers, if you want to offer them;
- **invoices issued correctly to the company**, submitted to the e-Factura system.

For businesses that buy often, a customer account with order history and downloadable invoices saves time on both sides.

## Refunds and disputes: how to handle them

Refunds are part of life for any store. A few rules:

- **refund using the same method** that was used to pay, usually directly from the processor account;
- **respect the legal deadline** for refunds on returns;
- **issue the correct tax documents** for the refund, together with your accountant;
- **respond quickly to disputes** (chargebacks): the processor usually asks for evidence, such as proof of delivery and your correspondence with the customer;
- **keep the evidence**: the parcel tracking number, delivery confirmation, emails.

## Checklist before activating payments

1. Your legal pages are published: terms, returns, delivery, privacy.
2. Your company details on the website are correct.
3. You've placed a test order by card and one with cash on delivery.
4. You've tested payment on a phone, including the 3-D Secure step.
5. Invoices are issued correctly after payment.
6. Confirmation emails land in the main inbox, not in spam.
7. You have access to the processor account and know where to see transactions.

## Common mistakes

- **Only cash on delivery**, no card payments. You lose customers who prefer cards.
- **Only card**, no cash on delivery, in a new store. You lose customers who don't know you yet.
- **Choosing a processor on fees alone.** A poor integration costs you more.
- **Not testing payment on a phone.**
- **Activating payments before your legal pages are ready.**
- **Not checking refunds and disputes** in the processor account.

## Example: a small handmade products store

A store with about 40 products, sold mainly to individuals:

- **online card payments**, through a processor with an official integration for the store's platform, with Apple Pay and Google Pay enabled;
- **cash on delivery**, with the fee shown clearly in the cart;
- **free delivery** from a slightly lower threshold for card payments, communicated in the cart;
- **automatic invoicing** after payment or on dispatch;
- **automatic emails** for confirmation, dispatch and delivery.

The result: new customers can choose cash on delivery, those who trust the store choose card, and the owner no longer issues a single invoice by hand.

## Frequently asked questions

### Which payment methods should an online store offer?

At least card payments and cash on delivery. For business customers, bank transfer. As the store grows, digital wallets and, for expensive products, instalment payments.

### How much does card payment cost a store?

Processors usually charge a percentage fee on each transaction, sometimes plus a fixed amount and possibly a subscription. The figures differ between processors and change over time, so check current offers directly with the processors.

### What documents do I need to activate card payments?

Usually your company details, a working website, terms and conditions, a returns policy, delivery information and contact details. Each processor has its own list of requirements.

### Do customers' card details reach my server?

No, if you use the processor's secure page or embedded forms. Card data is processed directly by the processor, which greatly reduces your security responsibility.

### What is 3-D Secure?

It's an extra verification step for online card payments, in which the customer confirms the payment in their bank's app or with a code. It reduces fraud and is required for many online payments in the European Union.

## Conclusion

Payment is the last step before a visitor becomes a customer. Offer card and cash on delivery from the start, choose a processor with a good integration, not just the lowest fee, test everything on a phone and automate invoicing. A simple, secure checkout shows up directly in your number of orders.

If you're building your store or want to improve it, read our guide on [how much an online store costs](/blog/cat-costa-un-magazin-online) and see our [website development](/servicii/dezvoltare-website-uri) page, or [write to us](/incepe-un-proiect).`,
  },
};

export default article;
