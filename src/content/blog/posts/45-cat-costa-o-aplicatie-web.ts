import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "cat-costa-o-aplicatie-web",
  category: "saas",
  tags: ["preț aplicație web", "dezvoltare software", "platformă web", "buget IT", "MVP"],
  ro: {
    title: "Cât costă o aplicație web în 2026: ce influențează prețul și cum îți faci bugetul",
    seoTitle: "Cât costă o aplicație web în 2026 | Buget și factori",
    description: "Cât costă dezvoltarea unei aplicații web sau a unei platforme în 2026: factorii care influențează prețul, intervale orientative, costuri lunare după lansare, modele de plată și cum reduci bugetul.",
    excerpt: "„Cât costă o aplicație?” e ca „cât costă o casă?”. Depinde de mărime, funcții și finisaje. Iată ce influențează prețul, intervale realiste și cum îți construiești un buget fără surprize.",
    content: `**Pe scurt:** costul unei aplicații web depinde de numărul de funcții și de complexitatea lor, de numărul de tipuri de utilizatori, de integrările cu alte programe, de design, de cerințele de securitate și de timpul de dezvoltare. Ca reper, la MAVA Studio un CRM personalizat pornește de la 10.000 de lei, iar o platformă sau aplicație web pornește de la 25.000 de lei, cu livrare de obicei în 30–60 de zile pentru prima versiune. Pe lângă dezvoltare, bugetează costurile lunare: găzduire, servicii externe și mentenanță. Cel mai sigur mod de a ține costul sub control e să începi cu o primă versiune minimă și să construiești în etape.

„Cât costă o aplicație?” e întrebarea cea mai grea la care să răspund fără detalii, la fel cum un constructor nu-ți poate spune cât costă „o casă” fără să știe câte camere are, unde e și ce finisaje vrei. Dar pot să-ți explic din ce e format prețul, ca să înțelegi ofertele și să-ți faci un buget realist. Asta fac în articolul de față.

Dacă abia ai ideea și nu știi exact ce vrei să construiești, citește întâi ghidul [Cum construiești o platformă SaaS](/blog/cum-construiesti-o-platforma-saas).

## Ce înțelegem prin „aplicație web”

O aplicație web e un program folosit din browser (și, de obicei, adaptat pentru telefon), cu conturi de utilizator și date care se salvează. Exemple:

- un CRM sau un program intern pentru firmă;
- o platformă de programări;
- un portal pentru clienți;
- o platformă SaaS cu abonament;
- un sistem de gestiune pentru un anumit domeniu (flote, stocuri, proiecte, producție);
- o platformă de cursuri online.

Diferența față de un site: un site prezintă informații, o aplicație lucrează cu date și face ceva pentru utilizator.

## Ce influențează prețul

### 1. Numărul și complexitatea funcțiilor

O funcție simplă (o listă de clienți cu căutare) costă mult mai puțin decât una complexă (un calendar cu mai mulți specialiști, reguli de disponibilitate, mementouri și plăți). Cel mai mare impact asupra prețului îl are lista de funcții.

### 2. Tipurile de utilizatori și permisiunile

O aplicație folosită doar de tine e mai simplă decât una cu administratori, angajați, clienți și parteneri, fiecare cu alte drepturi și alte ecrane.

### 3. Integrările

Legăturile cu alte programe: plăți online, facturare, email, calendar, curierat, contabilitate, hărți, alte platforme. Fiecare integrare înseamnă timp de dezvoltare și testare.

### 4. Designul

Un design simplu și funcțional costă mai puțin decât un design foarte personalizat, cu animații și multe ecrane speciale. Pentru aplicații, claritatea contează mai mult decât efectele.

### 5. Securitatea și datele sensibile

Aplicațiile care lucrează cu date medicale, financiare sau cu date ale mai multor firme separate au nevoie de măsuri suplimentare de securitate și testare.

### 6. Importul datelor existente

Mutarea datelor dintr-un Excel sau dintr-un program vechi poate fi simplă sau poate cere multă muncă de curățare și potrivire.

### 7. Aplicația mobilă

O aplicație web bine adaptată pentru telefon e suficientă în majoritatea cazurilor. O aplicație nativă separată, pentru magazinele de aplicații, adaugă un cost semnificativ.

## Intervale orientative

| Tip de aplicație | Ce include, de obicei | Preț de pornire la MAVA Studio | Termen obișnuit |
|---|---|---|---|
| CRM sau program intern simplu | clienți, oferte, proiecte, câteva rapoarte | de la 10.000 lei | 30 – 60 de zile |
| Portal pentru clienți | conturi, documente, statusuri, mesaje | în funcție de module | 30 – 60 de zile |
| Platformă web / SaaS (MVP) | conturi, funcțiile principale, abonamente, plăți | de la 25.000 lei | 30 – 60 de zile pentru prima versiune |
| Platformă complexă | multe module, integrări, mai multe tipuri de utilizatori | ofertă după analiză | construită pe etape |

Prețurile de pornire și condițiile sunt pe pagina [Prețuri](/preturi). Pentru orice aplicație, oferta finală se face după o analiză a cerințelor.

## Costurile de după lansare

O aplicație are costuri recurente, pe care trebuie să le pui în buget de la început:

- **găzduirea**: servere, baze de date, stocare de fișiere;
- **servicii externe**: trimiterea emailurilor, procesatorul de plăți, hărți, SMS-uri;
- **mentenanța**: actualizări de securitate, copii de siguranță, monitorizare, mici reparații;
- **dezvoltarea continuă**: funcții noi cerute de utilizatori;
- **suportul**: timpul tău sau al echipei pentru întrebările utilizatorilor.

Despre ce înseamnă mentenanța am scris în ghidul despre [mentenanța unui site](/blog/mentenanta-site); pentru aplicații, logica e aceeași, doar cu mai multe componente.

## Modele de plată

- **preț fix pe proiect**: potrivit când cerințele sunt clare și bine definite. La noi, plata se face de obicei 50% la semnare și 50% la livrare;
- **plată pe etape**: pentru proiectele mari, fiecare etapă are obiectivele, termenul și prețul ei;
- **cost lunar pentru dezvoltare continuă**: după lansare, pentru îmbunătățiri regulate.

Prețul fix îți dă siguranță, dar are nevoie de cerințe clare. De aceea, pentru aplicații, prima etapă e aproape întotdeauna o analiză și un prototip.

## Cum reduci costul fără să pierzi calitate

1. **Pornește cu o primă versiune minimă (MVP).** 3–5 funcții esențiale, nu 30.
2. **Amână aplicația mobilă nativă.** O aplicație web bine adaptată pentru telefon e suficientă la început.
3. **Folosește servicii existente** pentru plăți (de exemplu [Stripe](https://stripe.com/)), email, hărți, în loc să le construiești de la zero.
4. **Simplifică rolurile** la lansare: câte tipuri de utilizatori sunt cu adevărat necesare acum?
5. **Pregătește bine cerințele**: un document clar scurtează analiza și reduce modificările.
6. **Construiește pe etape**, cu feedback real de la utilizatori între ele.

Despre cum pregătești cerințele, ghidul despre [brief-ul pentru site](/blog/brief-pentru-site) e un bun punct de plecare; pentru aplicații adaugi procesele, utilizatorii și integrările.

## Analiza și prototipul: de ce merită plătite separat

Pentru aplicațiile mai complexe, recomand ca prima etapă să fie o analiză și un prototip, chiar dacă le plătești separat. În această etapă:

- se discută procesele tale în detaliu, cu oamenii care vor folosi aplicația;
- se stabilesc funcțiile pentru prima versiune și ce vine mai târziu;
- se desenează ecranele principale, sub forma unui prototip pe care poți da click;
- se identifică integrările și riscurile tehnice;
- rezultă o estimare precisă de preț și termen pentru dezvoltare.

Avantajul: decizia mare, de a construi aplicația, o iei știind exact ce primești. Iar dacă ajungi la concluzia că un program gata făcut ți se potrivește mai bine, ai cheltuit puțin ca să afli asta.

## Bugetul pe primul an: un model simplu

Ca să nu ai surprize, gândește bugetul pe 12 luni, nu doar pe dezvoltare:

1. **analiză și prototip**, dacă proiectul o cere;
2. **dezvoltarea primei versiuni**;
3. **găzduirea și serviciile externe**, lunar;
4. **mentenanța**, lunar;
5. **o rezervă pentru îmbunătățiri** cerute de utilizatori în primele luni;
6. **marketingul**, dacă aplicația e un produs pe care îl vinzi.

Rezerva de la punctul 5 e cea uitată cel mai des, deși primele luni de folosire aduc aproape întotdeauna cereri noi.

## Aplicație personalizată sau program gata făcut?

Înainte să construiești, întreabă-te: există deja un program cu abonament care rezolvă 80% din problemă? Dacă da, poate fi mai ieftin să pornești cu el. O aplicație personalizată merită când:

- procesul tău e specific și programele existente nu se potrivesc;
- costurile abonamentelor cresc odată cu numărul de utilizatori;
- ai nevoie de integrări pe care programele standard nu le oferă;
- aplicația e chiar produsul pe care vrei să-l vinzi (un SaaS).

Am comparat cele două variante pentru CRM-uri în articolul [CRM gata făcut sau personalizat](/blog/crm-gata-facut-sau-personalizat).

## Ce trebuie să conțină o ofertă corectă

- lista detaliată a funcțiilor incluse;
- ce **nu** e inclus;
- etapele, cu termene;
- prețul și modul de plată;
- ce se întâmplă cu modificările cerute pe parcurs;
- costurile lunare estimate după lansare;
- garanția și perioada de suport după lansare;
- dreptul de proprietate asupra codului și accesul la conturile tehnice.

## Greșeli frecvente

- **ceri o ofertă fără să descrii funcțiile**;
- **compari oferte** care conțin lucruri diferite;
- **alegi cea mai ieftină ofertă** fără să verifici ce include;
- **pui toate funcțiile în prima versiune**;
- **uiți costurile lunare** de după lansare;
- **nu ceri accesul la cod** și la conturile tehnice;
- **schimbi cerințele des** pe parcursul dezvoltării, fără să accepți că asta schimbă și prețul și termenul.

## Exemplu: același proiect, două variante de buget

O firmă de curățenie vrea o aplicație pentru gestionarea echipelor și a programărilor.

**Varianta „totul de la început”:** aplicație mobilă nativă pentru angajați, portal pentru clienți cu plăți online, rapoarte avansate, integrare cu contabilitatea, mai multe orașe, mai multe limbi. Cost mare, termen lung, risc mare.

**Varianta pe etape:**

1. **etapa 1**: aplicație web adaptată pentru telefon, cu programări, alocarea echipelor, lista lucrărilor zilei pentru fiecare angajat și notificări;
2. **etapa 2**, după câteva luni de folosire: portal pentru clienți și facturare automată;
3. **etapa 3**: rapoarte și extinderea în alte orașe.

A doua variantă începe mai ieftin, aduce rezultate mai repede și permite ca fiecare etapă să fie construită pe baza experienței reale.

## Cum compari ofertele pentru o aplicație

Pentru aplicații, ofertele pot varia mult mai mult decât pentru site-uri, așa că merită o comparație atentă:

- **verifică lista de funcții, punct cu punct**: o ofertă mai ieftină poate conține jumătate din funcții;
- **întreabă cum a fost estimat timpul**: o estimare serioasă e împărțită pe module, nu e o cifră aruncată;
- **cere exemple de proiecte asemănătoare**, cu ce s-a livrat efectiv;
- **verifică cine va lucra concret** la proiect și cum comunicați pe parcurs;
- **întreabă despre testare**: cum se verifică aplicația înainte de lansare;
- **compară și costurile de după lansare**, nu doar prețul dezvoltării.

O ofertă puțin mai scumpă, dar clară, cu etape și responsabilități bine definite, e de obicei mai ieftină pe termen lung decât una vagă.

## Întrebări frecvente

### Cât costă o aplicație web?

Depinde de funcții, utilizatori, integrări, design și securitate. La MAVA Studio, un CRM personalizat pornește de la 10.000 de lei, iar o platformă sau aplicație web pornește de la 25.000 de lei. Prețul exact se stabilește după o analiză a cerințelor.

### Cât durează dezvoltarea unei aplicații web?

O primă versiune durează, de obicei, 30–60 de zile, în funcție de complexitate. Aplicațiile mari se construiesc în etape, fiecare cu termenul ei.

### Ce costuri am după lansarea aplicației?

Găzduirea, serviciile externe (email, plăți, stocare), mentenanța și dezvoltarea funcțiilor noi. Acestea trebuie estimate de la început, ca să nu apară surprize.

### Am nevoie de aplicație mobilă separată?

De cele mai multe ori nu, cel puțin la început. O aplicație web bine adaptată pentru telefon acoperă majoritatea nevoilor. Aplicația nativă poate fi adăugată mai târziu, dacă utilizatorii o cer.

### Cum pot reduce costul unei aplicații?

Pornind cu o primă versiune minimă, cu 3–5 funcții esențiale, folosind servicii existente pentru plăți și email, simplificând rolurile la lansare și construind restul pe etape, pe baza feedbackului real.

## Concluzie

Prețul unei aplicații web nu e un mister, ci suma funcțiilor, utilizatorilor, integrărilor și cerințelor ei. Definește clar ce îți trebuie, pornește cu o primă versiune minimă, cere oferte detaliate și comparabile și ține cont de costurile de după lansare. Construită pe etape, o aplicație devine o investiție controlabilă.

Dacă vrei o estimare pentru aplicația ta, [descrie-ne pe scurt ce vrei să construiești](/incepe-un-proiect) și îți răspundem în 24 de ore lucrătoare. Detalii despre serviciu găsești pe pagina [Platforme SaaS](/servicii/platforme-saas). Dacă ai nevoie de un program intern simplu, citește și ghidul [Ce este un CRM](/blog/de-ce-ai-nevoie-de-un-crm).`,
  },
  en: {
    title: "How much does a web app cost in 2026? What drives the price and how to budget",
    seoTitle: "How much does a web app cost in 2026? Budget and factors",
    description: "What it costs to develop a web application or platform in 2026: the factors that drive the price, indicative ranges, monthly costs after launch, payment models and how to reduce the budget.",
    excerpt: "\"How much does an app cost?\" is like \"how much does a house cost?\". It depends on size, features and finishes. Here's what drives the price, realistic ranges and how to build a budget with no surprises.",
    content: `**In short:** the cost of a web application depends on the number and complexity of its features, the number of user types, integrations with other software, design, security requirements and development time. As a benchmark, at MAVA Studio a custom CRM starts at 10,000 lei (about €2,000) and a web platform or app starts at 25,000 lei (about €5,000), with the first version usually delivered in 30–60 days. On top of development, budget for monthly costs: hosting, external services and maintenance. The surest way to keep costs under control is to start with a minimal first version and build in stages.

"How much does an app cost?" is the hardest question to answer without details, just as a builder can't tell you what "a house" costs without knowing how many rooms it has, where it is and what finishes you want. But I can explain what the price is made of, so you understand quotes and can build a realistic budget. That's what this article does.

If you only have the idea and don't yet know exactly what you want to build, start with our guide [How to build a SaaS platform](/blog/cum-construiesti-o-platforma-saas).

## What we mean by "web app"

A web app is a program used in the browser (and usually adapted for phones), with user accounts and data that gets saved. Examples:

- a CRM or internal tool for a company;
- a booking platform;
- a client portal;
- a subscription SaaS platform;
- a management system for a specific industry (fleets, stock, projects, production);
- an online course platform.

The difference from a website: a website presents information; an app works with data and does something for the user.

## What drives the price

### 1. The number and complexity of features

A simple feature (a searchable client list) costs much less than a complex one (a calendar with several specialists, availability rules, reminders and payments). The feature list has the biggest impact on price.

### 2. User types and permissions

An app used only by you is simpler than one with administrators, employees, customers and partners, each with different rights and different screens.

### 3. Integrations

Connections to other software: online payments, invoicing, email, calendars, couriers, accounting, maps, other platforms. Each integration means development and testing time.

### 4. Design

A simple, functional design costs less than a highly customised one with animations and many special screens. For apps, clarity matters more than effects.

### 5. Security and sensitive data

Apps handling medical or financial data, or data from several separate companies, need extra security measures and testing.

### 6. Importing existing data

Moving data from a spreadsheet or an old system can be simple, or it can require a lot of cleaning and matching.

### 7. A mobile app

A web app that works well on phones is enough in most cases. A separate native app for the app stores adds significant cost.

## Indicative ranges

| Type of app | Usually includes | Starting price at MAVA Studio | Usual timeline |
|---|---|---|---|
| Simple CRM or internal tool | clients, quotes, projects, a few reports | from 10,000 lei (about €2,000) | 30 – 60 days |
| Client portal | accounts, documents, statuses, messages | depending on modules | 30 – 60 days |
| Web / SaaS platform (MVP) | accounts, core features, subscriptions, payments | from 25,000 lei (about €5,000) | 30 – 60 days for the first version |
| Complex platform | many modules, integrations, several user types | quoted after analysis | built in stages |

Starting prices and terms are on our [Pricing](/preturi) page. For any app, the final quote is made after analysing the requirements.

## Costs after launch

An app has recurring costs that must be in the budget from the start:

- **hosting**: servers, databases, file storage;
- **external services**: sending email, the payment processor, maps, SMS;
- **maintenance**: security updates, backups, monitoring, small fixes;
- **ongoing development**: new features users ask for;
- **support**: your time, or your team's, for users' questions.

I wrote about what maintenance means in our guide to [website maintenance](/blog/mentenanta-site); for apps the logic is the same, just with more components.

## Payment models

- **a fixed project price**: suitable when requirements are clear and well defined. With us, payment is usually 50% on signing and 50% on delivery;
- **staged payments**: for large projects, each stage has its own goals, deadline and price;
- **a monthly cost for ongoing development**: after launch, for regular improvements.

A fixed price gives you certainty but needs clear requirements. That's why, for apps, the first stage is almost always an analysis and a prototype.

## How to reduce the cost without losing quality

1. **Start with a minimal first version (MVP).** 3–5 essential features, not 30.
2. **Postpone a native mobile app.** A web app that works well on phones is enough at the start.
3. **Use existing services** for payments (for example [Stripe](https://stripe.com/)), email and maps instead of building them from scratch.
4. **Simplify roles** at launch: how many user types are really needed right now?
5. **Prepare your requirements well**: a clear document shortens the analysis and reduces changes.
6. **Build in stages**, with real user feedback in between.

For preparing requirements, our guide to the [website brief](/blog/brief-pentru-site) is a good starting point; for apps you add processes, users and integrations.

## Analysis and prototype: why they're worth paying for separately

For more complex apps, I recommend that the first stage be an analysis and a prototype, even if you pay for them separately. In this stage:

- your processes are discussed in detail, with the people who will use the app;
- the features for the first version are agreed, along with what comes later;
- the main screens are designed as a clickable prototype;
- integrations and technical risks are identified;
- the result is an accurate price and timeline estimate for development.

The advantage: you make the big decision, to build the app, knowing exactly what you'll get. And if you conclude that off-the-shelf software suits you better, you've spent little to find that out.

## A first-year budget: a simple model

To avoid surprises, plan your budget over 12 months, not just development:

1. **analysis and prototype**, if the project needs it;
2. **developing the first version**;
3. **hosting and external services**, monthly;
4. **maintenance**, monthly;
5. **a reserve for improvements** users ask for in the first months;
6. **marketing**, if the app is a product you sell.

The reserve in point 5 is the one most often forgotten, even though the first months of use almost always bring new requests.

## Custom app or off-the-shelf software?

Before you build, ask yourself: is there already a subscription tool that solves 80% of the problem? If so, starting with it may be cheaper. A custom app is worth it when:

- your process is specific and existing tools don't fit;
- subscription costs keep growing with the number of users;
- you need integrations standard tools don't offer;
- the app is itself the product you want to sell (a SaaS).

I compared the two options for CRMs in [Off-the-shelf CRM or custom CRM](/blog/crm-gata-facut-sau-personalizat).

## What a fair quote should contain

- a detailed list of the features included;
- what **isn't** included;
- the stages, with deadlines;
- the price and payment terms;
- what happens with changes requested along the way;
- estimated monthly costs after launch;
- the warranty and support period after launch;
- ownership of the code and access to technical accounts.

## Common mistakes

- **asking for a quote without describing the features**;
- **comparing quotes** that contain different things;
- **choosing the cheapest quote** without checking what it includes;
- **putting every feature into the first version**;
- **forgetting the monthly costs** after launch;
- **not asking for access to the code** and technical accounts;
- **changing requirements often** during development, without accepting that this changes both price and timeline.

## Example: the same project, two budget options

A cleaning company wants an app to manage its teams and bookings.

**The "everything at once" option:** a native mobile app for employees, a client portal with online payments, advanced reports, accounting integration, several cities, several languages. High cost, long timeline, high risk.

**The staged option:**

1. **stage 1**: a phone-friendly web app with bookings, team allocation, each employee's job list for the day, and notifications;
2. **stage 2**, after a few months of use: a client portal and automatic invoicing;
3. **stage 3**: reports and expansion to other cities.

The second option starts cheaper, brings results sooner and lets each stage be built on real experience.

## How to compare quotes for an app

For apps, quotes can vary far more than for websites, so a careful comparison is worth it:

- **check the feature list point by point**: a cheaper quote may contain half the features;
- **ask how the time was estimated**: a serious estimate is broken down by module, not a number plucked from the air;
- **ask for examples of similar projects**, with what was actually delivered;
- **check who will actually work** on the project and how you'll communicate along the way;
- **ask about testing**: how the app is checked before launch;
- **compare post-launch costs too**, not just the development price.

A slightly more expensive but clear quote, with well-defined stages and responsibilities, is usually cheaper in the long run than a vague one.

## Frequently asked questions

### How much does a web app cost?

It depends on features, users, integrations, design and security. At MAVA Studio, a custom CRM starts at 10,000 lei (about €2,000), and a web platform or app starts at 25,000 lei (about €5,000). The exact price is set after analysing the requirements.

### How long does it take to develop a web app?

A first version usually takes 30–60 days, depending on complexity. Large apps are built in stages, each with its own timeline.

### What costs will I have after the app launches?

Hosting, external services (email, payments, storage), maintenance and the development of new features. These should be estimated from the start to avoid surprises.

### Do I need a separate mobile app?

Most of the time, no, at least not at first. A web app that works well on phones covers most needs. A native app can be added later if users ask for it.

### How can I reduce the cost of an app?

By starting with a minimal first version with 3–5 essential features, using existing services for payments and email, simplifying roles at launch and building the rest in stages, based on real feedback.

## Conclusion

The price of a web app isn't a mystery; it's the sum of its features, users, integrations and requirements. Define clearly what you need, start with a minimal first version, ask for detailed, comparable quotes and account for post-launch costs. Built in stages, an app becomes a controllable investment.

If you'd like an estimate for your app, [describe briefly what you want to build](/incepe-un-proiect) and we'll reply within 24 working hours. You'll find details on our [SaaS platforms](/servicii/platforme-saas) page. If you need a simple internal tool, also read our guide [What a CRM is](/blog/de-ce-ai-nevoie-de-un-crm).`,
  },
};

export default article;
