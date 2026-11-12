import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "facturare-automata-integrare",
  category: "crm",
  tags: ["facturare automată", "SmartBill", "integrare CRM", "abonamente", "încasări"],
  ro: {
    title: "Facturare automată pentru firme de servicii: avans, abonamente și mementouri de plată",
    seoTitle: "Facturare automată pentru firme de servicii: ghid practic",
    description: "Cum automatizezi facturarea într-o firmă de servicii: factura de avans la semnarea contractului, factura finală la predare, facturi recurente pentru abonamente, mementouri și legătura cu CRM-ul.",
    excerpt: "Facturile emise „când am timp” înseamnă bani încasați mai târziu. Iată cum leagă o firmă de servicii contractele, proiectele și abonamentele de programul de facturare, ca totul să se întâmple la timp.",
    content: `**Pe scurt:** într-o firmă de servicii, facturarea automată înseamnă că facturile pleacă singure la momentele potrivite: factura de avans când clientul semnează contractul, factura finală când lucrarea e predată, facturile recurente pentru abonamente în aceeași zi în fiecare lună, iar mementourile politicoase pentru facturile neplătite după un număr stabilit de zile. Totul se face legând CRM-ul sau sistemul de contracte de programul de facturare, care emite factura, o transmite în e-Factura și o trimite clientului. Tu doar verifici.

În MAVA Studio, factura de avans se emite automat în momentul în care clientul semnează contractul online. Nu e un truc tehnic impresionant, dar a schimbat complet ritmul încasărilor: banii vin mai repede, iar eu nu mai stau seara să emit facturi. În articolul ăsta îți arăt cum poate funcționa la fel și la tine.

Dacă vinzi produse printr-un magazin online, citește și ghidul dedicat [e-Factura pentru magazine online](/blog/e-factura-pentru-magazine-online). Aici mă concentrez pe firmele de servicii.

## De ce facturarea manuală te costă bani

- **facturi emise târziu**: cu cât factura pleacă mai târziu, cu atât banii vin mai târziu;
- **facturi uitate**: o lucrare mică, finalizată într-o vineri aglomerată, rămâne nefacturată;
- **greșeli**: date ale clientului copiate greșit, sume diferite față de contract;
- **urmărire slabă**: nu știi exact cine nu a plătit și de câte zile;
- **timp pierdut**: ore în fiecare lună care ar putea merge spre clienți.

## Cele patru tipuri de facturi pe care le poți automatiza

### 1. Factura de avans

Momentul ideal: imediat după ce clientul semnează contractul. Dacă ai convenit, de exemplu, 50% avans la semnare, sistemul emite automat factura cu suma corectă și i-o trimite clientului împreună cu confirmarea semnării. Despre semnarea online am scris în articolul despre [ofertele și contractele semnate online](/blog/oferte-si-contracte-semnate-online).

### 2. Factura finală

Momentul ideal: când proiectul e marcat ca predat sau când clientul confirmă recepția. Factura finală ține cont de avansul deja facturat și încasat, conform regulilor stabilite cu contabilul.

### 3. Facturile recurente

Pentru abonamente lunare (mentenanță, administrare social media, servicii lunare de orice fel), factura se poate emite automat în aceeași zi a fiecărei luni, cu aceeași sumă și aceeași descriere. Sistemul se oprește singur când abonamentul se încheie.

### 4. Facturile pentru servicii suplimentare

Când clientul cere ceva în plus față de contract (o pagină nouă, un clip în plus), anexa semnată poate genera automat factura corespunzătoare.

## Cum arată fluxul complet

| Moment | Ce se întâmplă automat |
|---|---|
| Clientul semnează contractul | se emite factura de avans și se trimite clientului |
| Avansul e încasat | proiectul trece în „în lucru”, tu primești notificare |
| Proiectul e predat | se emite factura finală |
| Factura nu e plătită la termen | clientul primește un memento politicos |
| Încă o întârziere | primești o alertă ca să suni clientul |
| Început de lună, pentru abonamente | se emit facturile recurente |
| Fiecare factură | e transmisă în e-Factura și arhivată în fișa clientului |

## Legătura cu programul de facturare

Programele de facturare online folosite în România, de exemplu [SmartBill](https://www.smartbill.ro/), [Oblio](https://www.oblio.eu/) sau [FGO](https://www.fgo.ro/), permit legarea cu alte programe, astfel încât factura să fie emisă din CRM sau din sistemul de contracte fără să intri în programul de facturare. Ce trebuie verificat:

- programul de facturare permite emiterea automată din alte sisteme;
- seriile de facturi sunt configurate corect;
- datele clientului (persoană fizică sau firmă) trec complet din CRM;
- setările de TVA sunt corecte pentru firma ta;
- factura emisă se transmite în e-Factura;
- PDF-ul facturii ajunge înapoi în CRM, în fișa clientului.

Dacă programele nu comunică direct, se pot lega printr-o integrare construită special. Am comparat variantele de CRM, inclusiv din acest punct de vedere, în articolul [CRM gata făcut sau personalizat](/blog/crm-gata-facut-sau-personalizat).

## Mementourile de plată: ferm, dar politicos

Mementourile automate rezolvă o mare parte din întârzieri fără nicio discuție neplăcută. Un exemplu de succesiune:

1. **cu 2 zile înainte de scadență**: un email scurt, prietenos, cu factura atașată;
2. **în ziua scadenței**: un memento că termenul e azi, cu datele de plată;
3. **la 7 zile după scadență**: un mesaj politicos, care întreabă dacă a fost vreo problemă;
4. **la 14 zile**: o alertă pentru tine, ca să suni personal.

Textele trebuie să sune omenește, nu amenințător. Majoritatea clienților care întârzie au doar uitat.

## Proformă sau factură direct?

Multe firme de servicii trimit întâi o factură proformă, iar factura fiscală o emit doar după încasare. Altele emit direct factura fiscală. Ambele variante pot fi automatizate, dar diferă:

- **cu proformă**: la semnare pleacă proforma, iar la confirmarea plății se emite automat factura fiscală, transmisă în e-Factura;
- **direct cu factură**: la semnare se emite factura fiscală, iar sistemul urmărește doar încasarea.

Care variantă e potrivită pentru tine, din punct de vedere fiscal și practic, stabilești cu contabilul. Important e ca regula să fie aceeași pentru toți clienții și să fie configurată o singură dată în sistem.

## Legătura cu banca

Pasul care închide cercul e potrivirea încasărilor. Unele programe de facturare pot citi extrasele bancare și pot marca automat facturile ca plătite atunci când găsesc suma și referința potrivită. Dacă nu ai această legătură, cere clienților să menționeze numărul facturii la plată și verifică săptămânal extrasul. Cu cât potrivirea e mai rapidă, cu atât mementourile automate sunt mai precise și nu ajung la clienți care au plătit deja.

## Ce trebuie scris clar în contract

Facturarea automată funcționează bine doar dacă regulile sunt clare de la început. În contract și în ofertă ar trebui să apară:

- **modul de plată**: de exemplu 50% avans la semnare și 50% la predare;
- **termenul de plată** al fiecărei facturi;
- **ce se întâmplă la întârziere**, dacă vrei să prevezi ceva;
- **pentru abonamente**: data facturării, durata minimă, cum se încheie;
- **cum se facturează serviciile suplimentare**.

## Firma neplătitoare de TVA

Dacă firma ta nu e înregistrată în scopuri de TVA, facturile se emit fără TVA, iar ofertele și contractele trebuie să reflecte asta. În CRM, cota de TVA implicită trebuie să fie 0%, ca să nu apară din greșeală TVA pe oferte. Dacă statutul firmei se schimbă, setările se actualizează din prima zi, împreună cu contabilul.

## Ce verifici lunar

1. Toate proiectele predate au factură finală.
2. Toate abonamentele active au factura lunii.
3. Toate facturile au fost transmise și validate în e-Factura.
4. Lista facturilor restante și stadiul mementourilor.
5. Încasările din extrasul bancar se potrivesc cu facturile marcate ca plătite.

Un raport automat lunar, trimis pe email, îți poate arăta toate acestea pe o singură pagină. Despre astfel de rapoarte am scris în ghidul despre [automatizări pentru afaceri mici](/blog/automatizari-pentru-afaceri-mici).

## Greșeli frecvente

- **Facturi emise „când am timp”**, la sfârșit de lună.
- **Avansul uitat** la emiterea facturii finale.
- **Abonamente care continuă** să fie facturate după încheierea colaborării.
- **Mementouri reci sau amenințătoare**, care strică relația.
- **TVA greșit** pe oferte și facturi, mai ales după schimbarea statutului firmei.
- **Date incomplete ale clientului**, care duc la facturi respinse în e-Factura.
- **Nimeni nu verifică** dacă automatizările funcționează.

## Exemplu: un studio mic de servicii

Un studio cu trei oameni, care face site-uri și administrează social media, lucra așa: avansul se factura „după ce clientul semnează și trimite contractul scanat”, factura finală „când ne aducem aminte”, iar abonamentele lunare se emiteau manual, la începutul fiecărei luni. Rezultatul: încasări întârziate și facturi uitate.

După automatizare:

- contractul se semnează online, iar factura de avans pleacă în aceeași clipă;
- la predarea proiectului, un buton „Predat” generează factura finală, cu avansul scăzut;
- abonamentele lunare se facturează automat în prima zi lucrătoare a lunii;
- mementourile se trimit singure, iar după 14 zile apare o alertă în CRM;
- toate facturile apar în fișa fiecărui client și în portalul clientului.

Banii vin mai repede, iar facturarea a dispărut din lista de griji de la final de lună.

## Portalul clientului: transparență în plus

Un pas în plus, pe care îl folosim și noi: un portal online în care clientul își vede ofertele, contractele, fișierele proiectului și facturile, cu statusul fiecăreia. Clientul nu mai cere „îmi retrimiteți factura?”, iar tu nu mai cauți prin emailuri. Transparența asta crește și încrederea, și viteza plăților.

## Cât costă

Automatizarea facturării poate fi:

- **o configurare simplă** a funcțiilor existente din programul tău de facturare;
- **o integrare** între CRM-ul tău și programul de facturare;
- **parte dintr-un CRM personalizat**, cu oferte, contracte, proiecte, facturare și portal pentru clienți, care la MAVA Studio pornește de la 10.000 de lei și se livrează în 30–60 de zile.

Detalii găsești pe pagina [CRM și automatizări](/servicii/crm-automatizari) și pe pagina [Prețuri](/preturi).

## Cum vorbești cu clientul despre plăți

Facturarea automată funcționează cel mai bine când clientul știe ce urmează. Câteva obiceiuri care previn neplăcerile:

- **spune clar, încă din ofertă**, când și cât se plătește: „50% la semnare, 50% la predare”;
- **anunță din timp** factura finală, de exemplu în emailul de predare: „Atașat găsești factura finală, cu termen de plată în 7 zile”;
- **oferă mai multe metode de plată**, dacă se poate: transfer, card, link de plată;
- **mulțumește după plată**, chiar și cu un email automat scurt;
- **discută deschis** cu clienții care întâmpină dificultăți, înainte ca întârzierea să devină o problemă.

Relația bună cu clientul și facturarea automată nu se exclud. Dimpotrivă: când lucrurile administrative merg de la sine, rămâne mai mult timp pentru discuțiile care contează.

## Întrebări frecvente

### Pot emite automat factura de avans când clientul semnează contractul?

Da. Dacă sistemul de contracte sau CRM-ul e legat de programul de facturare, semnarea contractului poate declanșa automat emiterea facturii de avans, transmiterea ei în e-Factura și trimiterea ei clientului.

### Cum automatizez facturile pentru abonamentele lunare?

Prin facturi recurente: programul de facturare sau CRM-ul emite automat factura în aceeași zi a fiecărei luni, cu suma și descrierea stabilite, până la încheierea abonamentului.

### Sunt mementourile automate de plată deranjante pentru clienți?

Nu, dacă sunt scrise politicos și trimise la intervale rezonabile. Majoritatea clienților care întârzie au doar uitat, iar un memento prietenos rezolvă situația fără o discuție neplăcută.

### Facturile emise automat ajung și în e-Factura?

Da, dacă programul de facturare are acces la Spațiul Privat Virtual al firmei. Factura emisă automat e transmisă în sistemul e-Factura la fel ca una emisă manual.

### Ce program de facturare pot lega de CRM?

Programele de facturare online folosite în România, precum SmartBill, Oblio sau FGO, permit legături cu alte sisteme. Verifică ce oferă programul tău și ce integrare e necesară pentru CRM-ul pe care îl folosești.

## Concluzie

Facturarea automată nu e un lux, ci cea mai simplă cale de a fi plătit la timp. Leagă contractele, proiectele și abonamentele de programul de facturare, stabilește reguli clare în contract, lasă mementourile să lucreze pentru tine și verifică totul lunar.

Dacă vrei ca facturarea firmei tale să meargă de la sine, [scrie-ne](/incepe-un-proiect) și îți răspundem în 24 de ore lucrătoare. Dacă abia pornești cu un CRM, citește întâi ghidul [Ce este un CRM](/blog/de-ce-ai-nevoie-de-un-crm).`,
  },
  en: {
    title: "Automatic invoicing for service companies: deposits, subscriptions and payment reminders",
    seoTitle: "Automatic invoicing for service companies: a practical guide",
    description: "How to automate invoicing in a service company: the deposit invoice on contract signing, the final invoice on delivery, recurring invoices for subscriptions, reminders and the CRM connection.",
    excerpt: "Invoices issued \"when I have time\" mean money collected later. Here's how a service company can connect contracts, projects and subscriptions to its invoicing software so everything happens on time.",
    content: `**In short:** in a service company, automatic invoicing means invoices go out on their own at the right moments: the deposit invoice when the client signs the contract, the final invoice when the work is delivered, recurring invoices for subscriptions on the same day every month, and polite reminders for unpaid invoices after a set number of days. It all works by connecting your CRM or contract system to your invoicing software, which issues the invoice, submits it to e-Factura (in Romania) and sends it to the client. You just check.

At MAVA Studio, the deposit invoice is issued automatically the moment a client signs the contract online. It isn't an impressive technical trick, but it completely changed the pace of payments: money comes in faster and I no longer spend evenings issuing invoices. In this article I'll show you how the same can work for you.

If you sell products through an online store, also read our dedicated guide to [e-Factura for online stores](/blog/e-factura-pentru-magazine-online). Here I focus on service companies.

## Why manual invoicing costs you money

- **late invoices**: the later the invoice goes out, the later the money arrives;
- **forgotten invoices**: a small job finished on a busy Friday never gets invoiced;
- **mistakes**: client details copied wrongly, amounts that differ from the contract;
- **poor tracking**: you don't know exactly who hasn't paid, or for how many days;
- **lost time**: hours every month that could go to clients.

## The four types of invoice you can automate

### 1. The deposit invoice

The ideal moment: right after the client signs the contract. If you've agreed, for example, a 50% deposit on signing, the system automatically issues the invoice for the correct amount and sends it to the client along with the signing confirmation. I wrote about online signing in the article on [quotes and contracts signed online](/blog/oferte-si-contracte-semnate-online).

### 2. The final invoice

The ideal moment: when the project is marked as delivered or the client confirms acceptance. The final invoice takes into account the deposit already invoiced and paid, according to the rules agreed with your accountant.

### 3. Recurring invoices

For monthly subscriptions (maintenance, social media management, any monthly service), the invoice can be issued automatically on the same day each month, with the same amount and description. The system stops on its own when the subscription ends.

### 4. Invoices for extra services

When the client asks for something beyond the contract (a new page, an extra video), the signed appendix can automatically generate the corresponding invoice.

## What the complete flow looks like

| Moment | What happens automatically |
|---|---|
| The client signs the contract | the deposit invoice is issued and sent to the client |
| The deposit is paid | the project moves to "in progress" and you get a notification |
| The project is delivered | the final invoice is issued |
| The invoice isn't paid on time | the client gets a polite reminder |
| Still overdue | you get an alert to call the client |
| Start of the month, for subscriptions | recurring invoices are issued |
| Every invoice | is submitted to e-Factura and filed in the client's record |

## The connection to your invoicing software

The online invoicing tools used in Romania, for example [SmartBill](https://www.smartbill.ro/), [Oblio](https://www.oblio.eu/) or [FGO](https://www.fgo.ro/), can connect to other programs so invoices are issued from the CRM or contract system without logging into the invoicing software. What to check:

- the invoicing software allows automatic issuing from other systems;
- invoice series are configured correctly;
- client details (individual or company) come across complete from the CRM;
- VAT settings are correct for your company;
- the issued invoice is submitted to e-Factura;
- the invoice PDF comes back into the CRM, in the client's record.

If the programs don't talk directly, they can be connected through a purpose-built integration. I compared CRM options, including from this angle, in [Off-the-shelf CRM or custom CRM](/blog/crm-gata-facut-sau-personalizat).

## Payment reminders: firm but polite

Automatic reminders resolve most late payments without any awkward conversation. An example sequence:

1. **2 days before the due date**: a short, friendly email with the invoice attached;
2. **on the due date**: a reminder that payment is due today, with the payment details;
3. **7 days after the due date**: a polite message asking whether there's been a problem;
4. **after 14 days**: an alert for you to call personally.

The wording must sound human, not threatening. Most clients who pay late have simply forgotten.

## Pro forma or straight to invoice?

Many service companies first send a pro forma invoice and only issue the tax invoice after payment. Others issue the tax invoice straight away. Both options can be automated, but they differ:

- **with a pro forma**: the pro forma goes out on signing, and when payment is confirmed the tax invoice is issued automatically and submitted to e-Factura;
- **straight to invoice**: the tax invoice is issued on signing, and the system just tracks payment.

Which option suits you, from a tax and practical point of view, is something to agree with your accountant. What matters is that the rule is the same for every client and configured once in the system.

## The connection to your bank

The step that closes the loop is matching payments. Some invoicing tools can read bank statements and automatically mark invoices as paid when they find the matching amount and reference. If you don't have that connection, ask clients to include the invoice number when paying and check your statement weekly. The faster the matching, the more accurate the automatic reminders, and the less likely they are to reach clients who have already paid.

## What the contract must state clearly

Automatic invoicing only works well if the rules are clear from the start. The contract and the proposal should include:

- **payment terms**: for example 50% deposit on signing and 50% on delivery;
- **the payment deadline** for each invoice;
- **what happens if payment is late**, if you want to set anything out;
- **for subscriptions**: the invoicing date, the minimum term, how it ends;
- **how extra services are invoiced**.

## Companies not registered for VAT

If your company isn't VAT-registered, invoices are issued without VAT, and your proposals and contracts must reflect that. In your CRM, the default VAT rate should be 0%, so VAT doesn't appear on quotes by mistake. If the company's status changes, the settings are updated from day one, together with your accountant.

## What to check every month

1. Every delivered project has a final invoice.
2. Every active subscription has this month's invoice.
3. Every invoice has been submitted and validated in e-Factura.
4. The list of overdue invoices and where each reminder sequence stands.
5. Payments on the bank statement match the invoices marked as paid.

An automatic monthly report sent by email can show you all of this on a single page. I wrote about reports like this in our guide to [automation for small businesses](/blog/automatizari-pentru-afaceri-mici).

## Common mistakes

- **Invoices issued "when I have time"**, at the end of the month.
- **Forgetting the deposit** when issuing the final invoice.
- **Subscriptions that keep being invoiced** after the collaboration has ended.
- **Cold or threatening reminders** that damage the relationship.
- **Wrong VAT** on quotes and invoices, especially after a change in the company's status.
- **Incomplete client details**, leading to invoices rejected in e-Factura.
- **Nobody checking** whether the automations work.

## Example: a small service studio

A three-person studio building websites and managing social media worked like this: the deposit was invoiced "after the client signs and sends back the scanned contract", the final invoice "when we remember", and monthly subscriptions were issued by hand at the start of each month. The result: late payments and forgotten invoices.

After automation:

- the contract is signed online, and the deposit invoice goes out the same moment;
- on delivery, a "Delivered" button generates the final invoice, with the deposit deducted;
- monthly subscriptions are invoiced automatically on the first working day of the month;
- reminders go out on their own, and after 14 days an alert appears in the CRM;
- every invoice appears in each client's record and in the client portal.

Money comes in faster, and invoicing has disappeared from the end-of-month worry list.

## The client portal: extra transparency

One extra step, which we use ourselves: an online portal where clients see their quotes, contracts, project files and invoices, with the status of each. Clients no longer ask "could you resend the invoice?", and you no longer dig through emails. This transparency increases both trust and payment speed.

## What it costs

Automating invoicing can be:

- **a simple setup** of the existing features in your invoicing software;
- **an integration** between your CRM and your invoicing software;
- **part of a custom CRM**, with quotes, contracts, projects, invoicing and a client portal, which at MAVA Studio starts at 10,000 lei (about €2,000) and is delivered in 30–60 days.

You'll find details on our [CRM and automation](/servicii/crm-automatizari) page and on the [Pricing](/preturi) page.

## How to talk to clients about payment

Automatic invoicing works best when clients know what's coming. A few habits that prevent awkwardness:

- **say clearly, from the proposal stage**, when and how much is paid: "50% on signing, 50% on delivery";
- **announce the final invoice in advance**, for example in the handover email: "Attached is the final invoice, payable within 7 days";
- **offer several payment methods** if possible: bank transfer, card, payment link;
- **say thank you after payment**, even with a short automatic email;
- **talk openly** with clients who are having difficulties, before a delay becomes a problem.

A good client relationship and automatic invoicing aren't at odds. Quite the opposite: when the admin runs itself, there's more time for the conversations that matter.

## Frequently asked questions

### Can I automatically issue the deposit invoice when the client signs the contract?

Yes. If your contract system or CRM is connected to your invoicing software, signing the contract can automatically trigger issuing the deposit invoice, submitting it to e-Factura and sending it to the client.

### How do I automate invoices for monthly subscriptions?

With recurring invoices: the invoicing software or CRM automatically issues the invoice on the same day each month, with the agreed amount and description, until the subscription ends.

### Are automatic payment reminders annoying for clients?

Not if they're politely worded and sent at reasonable intervals. Most clients who pay late have simply forgotten, and a friendly reminder settles it without an awkward conversation.

### Do automatically issued invoices go to e-Factura too?

Yes, if the invoicing software has access to the company's Private Virtual Space. An automatically issued invoice is submitted to e-Factura just like one issued by hand.

### Which invoicing software can I connect to my CRM?

The online invoicing tools used in Romania, such as SmartBill, Oblio or FGO, allow connections with other systems. Check what your software offers and what integration your CRM needs.

## Conclusion

Automatic invoicing isn't a luxury; it's the simplest way to get paid on time. Connect your contracts, projects and subscriptions to your invoicing software, set clear rules in the contract, let the reminders work for you and check everything monthly.

If you want your company's invoicing to run itself, [write to us](/incepe-un-proiect) and we'll reply within 24 working hours. If you're just starting with a CRM, read our guide [What a CRM is](/blog/de-ce-ai-nevoie-de-un-crm) first.`,
  },
};

export default article;
