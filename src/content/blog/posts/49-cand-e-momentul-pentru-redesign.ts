import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "cand-e-momentul-pentru-redesign",
  category: "website",
  tags: ["redesign site", "site nou", "refacere site", "migrare", "SEO"],
  ro: {
    title: "Când e momentul pentru un site nou? 10 semne și cum faci redesignul fără să pierzi clienți",
    seoTitle: "Când refaci site-ul? 10 semne și redesign fără pierderi",
    description: "10 semne că site-ul tău are nevoie de redesign, cum decizi între reparare și refacere, cum păstrezi pozițiile din Google la mutare și pașii unui redesign făcut corect.",
    excerpt: "Un site vechi te poate costa clienți în fiecare zi, dar un redesign făcut în grabă te poate costa și mai mult. Iată semnele că e momentul și pașii prin care schimbi site-ul fără să pierzi ce ai construit.",
    content: `**Pe scurt:** e momentul pentru un site nou când cel actual nu mai reflectă afacerea, arată sau funcționează prost pe telefon, e lent din cauza tehnologiei pe care e construit, e greu sau imposibil de actualizat, are probleme de securitate repetate sau nu aduce cereri deși are vizitatori. Înainte să refaci totul, verifică dacă problemele pot fi reparate. Dacă decizi să refaci, cel mai important e să păstrezi ce funcționează: conținutul bun, adresele paginilor importante (sau redirecționări corecte), titlurile SEO și datele de contact, ca să nu pierzi pozițiile din Google și clienții care te găsesc acum.

Am refăcut multe site-uri și am văzut ambele extreme: firme care țin un site de zece ani, care le alungă clienții, și firme care își refac site-ul la fiecare doi ani, pierzând de fiecare dată pozițiile din Google pentru că nimeni nu s-a gândit la redirecționări. În articolul ăsta îți arăt cum recunoști momentul potrivit și cum faci trecerea fără pierderi.

## 10 semne că site-ul tău are nevoie de redesign

1. **Arată sau funcționează prost pe telefon.** Text mic, butoane înghesuite, meniuri care nu se deschid. Majoritatea vizitatorilor sunt pe mobil.
2. **E lent, iar cauza e tehnologia.** Teme încărcate, zeci de extensii, cod vechi care nu mai poate fi optimizat. Am explicat cum măsori viteza în ghidul despre [viteza site-ului](/blog/viteza-site-ului-core-web-vitals).
3. **Nu mai reflectă afacerea.** Servicii pe care nu le mai oferi, lipsesc cele noi, prețuri vechi, poze cu o echipă care nu mai există.
4. **Nu-l poți actualiza singur.** Fiecare modificare mică cere un programator sau nimeni nu mai știe cum se face.
5. **Are probleme de securitate repetate.** Atacuri, spam, avertismente în browser, platformă care nu mai primește actualizări.
6. **Ai vizitatori, dar nu primești cereri.** Am explicat cauzele posibile în articolul [De ce site-ul tău nu aduce clienți](/blog/de-ce-site-ul-nu-aduce-clienti).
7. **Arată învechit față de concurență.** Clienții compară. Un site care pare abandonat transmite o firmă neglijentă.
8. **Nu are funcțiile de care ai nevoie acum**: programări online, plăți, magazin, legătură cu CRM-ul, mai multe limbi.
9. **Partea legală e depășită**: lipsesc paginile legale, bannerul de cookie-uri, datele firmei actuale.
10. **Nu știi exact ce e în spatele lui**: cine are acces, pe ce e construit, pe numele cui e domeniul.

Dacă te regăsești în trei sau mai multe, merită o analiză serioasă.

## Reparare sau refacere?

Nu orice problemă cere un site nou. O regulă practică:

| Situație | Recomandare |
|---|---|
| Baza tehnică e bună, problemele sunt de conținut, mesaj, prețuri, dovezi | **reparare** |
| Site lent din cauza imaginilor și a câtorva extensii | **reparare** |
| Lipsesc câteva pagini sau o funcție simplă | **reparare / extindere** |
| Site lent din cauza temei și a platformei vechi | **refacere** |
| Nu funcționează corect pe telefon și nu poate fi adaptat ușor | **refacere** |
| Platformă care nu mai primește actualizări de securitate | **refacere** |
| Afacerea s-a schimbat complet (servicii, public, brand) | **refacere** |

Repararea e mai rapidă și mai ieftină. Refacerea are sens când fiecare reparație devine tot mai scumpă decât un site nou construit corect.

## Ce trebuie păstrat la un redesign

Un redesign făcut bine nu șterge tot ce ai construit. Fă întâi un inventar:

- **paginile care aduc vizitatori din Google**: le vezi în Search Console; ele trebuie păstrate sau redirecționate corect;
- **conținutul bun**: texte, întrebări frecvente, articole de blog care funcționează;
- **titlurile și descrierile SEO** care aduc clicuri;
- **linkurile primite de la alte site-uri** spre paginile tale;
- **formularele și integrările** care funcționează (CRM, email, facturare);
- **datele de contact**, identice cu cele din profilul Google;
- **recenziile, proiectele și dovezile de încredere**.

## Redirecționările: cel mai important pas tehnic

Când se schimbă adresele paginilor (de exemplu, din „/servicii-ale-noastre/albire” în „/servicii/albire-dentara”), fiecare adresă veche trebuie redirecționată permanent spre cea nouă. Fără asta:

- oamenii care au salvat sau primit linkurile vechi ajung pe o pagină de eroare;
- Google pierde legătura dintre paginile vechi, care aveau poziții, și cele noi;
- linkurile primite de la alte site-uri nu mai duc nicăieri.

Rezultatul: o scădere bruscă a vizitatorilor din Google, uneori pentru luni întregi. Cu redirecționări corecte, trecerea e de obicei lină. Google explică principiile în [ghidul despre mutarea site-urilor](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## Pașii unui redesign făcut corect

1. **Analiza**: ce funcționează, ce nu, ce vor clienții, ce face concurența, ce pagini aduc trafic.
2. **Brief-ul**: obiective, pagini, funcții, materiale, buget, termen. Am explicat cum îl faci în ghidul despre [brief-ul pentru site](/blog/brief-pentru-site).
3. **Structura și textele**: pornind de la ce caută clienții și de la conținutul bun existent.
4. **Designul**: nou, dar păstrând elementele recognoscibile ale brandului.
5. **Dezvoltarea** pe o adresă de test, nu direct peste site-ul actual.
6. **Harta de redirecționări**: fiecare adresă veche importantă, cu adresa nouă corespunzătoare.
7. **Testarea**: telefon, viteză, formulare, linkuri, redirecționări, paginile legale.
8. **Lansarea**, într-un moment liniștit, nu în mijlocul unei campanii.
9. **Urmărirea**: Search Console, erori, vizitatori, cereri, în primele săptămâni.

## Lista de verificare din ziua lansării

În ziua în care noul site devine public, verifică, în ordine:

1. site-ul se deschide pe adresa principală, cu și fără „www”, și doar prin HTTPS;
2. câteva adrese vechi importante redirecționează corect spre paginile noi;
3. formularele trimit mesaje, iar mesajele ajung unde trebuie;
4. telefonul și emailul de pe site sunt corecte și se pot apăsa pe mobil;
5. harta site-ului nouă e trimisă în Google Search Console;
6. instrumentele de analiză și de reclame funcționează, cu consimțământ;
7. paginile legale sunt actualizate;
8. viteza pe telefon e bună.

O jumătate de oră de verificări în ziua lansării te scutește de săptămâni de clienți pierduți fără să știi de ce.

## Ce se întâmplă cu pozițiile din Google

Chiar și cu un redesign făcut corect, pot apărea mici fluctuații în primele săptămâni, cât timp Google reindexează site-ul. Dacă redirecționările sunt corecte și conținutul important s-a păstrat sau s-a îmbunătățit, pozițiile revin de obicei repede și, de multe ori, cresc după aceea, mai ales dacă noul site e mai rapid și mai bine structurat.

## Cât costă un redesign

Un redesign costă, în general, cam cât un site nou de același tip, pentru că se construiește de la zero, plus munca de analiză și de migrare a conținutului și a redirecționărilor. La MAVA Studio, un site de prezentare pornește de la 3.000 de lei, iar un magazin online de la 6.000 de lei. Detalii găsești pe pagina [Prețuri](/preturi) și pe pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri). Pentru context despre ce influențează prețul, citește ghidul [Cât costă un site de prezentare](/blog/cat-costa-un-website-pentru-afacerea-ta).

## Cât de des ar trebui refăcut un site?

Nu există un termen fix. Un site bine construit, întreținut constant și actualizat cu conținut nou poate funcționa foarte bine mulți ani. Mai important decât vârsta e dacă își face treaba. Mentenanța regulată, despre care am scris în ghidul despre [mentenanța site-ului](/blog/mentenanta-site), amână mult momentul în care ai nevoie de un site nou.

## Greșeli frecvente la redesign

- **refaci doar designul**, fără să schimbi mesajul și structura;
- **ștergi conținutul vechi** care aducea vizitatori;
- **schimbi adresele paginilor fără redirecționări**;
- **lansezi fără testare** pe telefon și fără verificarea formularelor;
- **lansezi în mijlocul sezonului** sau al unei campanii;
- **uiți de integrări**: formularul nu mai trimite în CRM, pixelul de reclame nu mai funcționează;
- **nu te uiți în Search Console** după lansare;
- **schimbi complet identitatea vizuală** fără motiv, iar clienții nu te mai recunosc.

## Exemplu: un redesign fără pierderi

O firmă de construcții avea un site de opt ani: lent, greu de folosit pe telefon, cu servicii vechi și fără prețuri, dar cu câteva pagini care aduceau constant vizitatori din Google. Am procedat așa:

1. am extras din Search Console paginile și căutările care aduceau trafic;
2. am păstrat și îmbunătățit textele acelor pagini, adăugând prețuri orientative și întrebări frecvente;
3. am construit noul site pe o adresă de test, cu pagini separate pentru fiecare serviciu;
4. am făcut harta de redirecționări pentru toate adresele vechi;
5. am lansat într-o perioadă mai liniștită și am urmărit zilnic erorile în primele două săptămâni.

Vizitatorii din Google nu au scăzut, iar cererile au crescut, pentru că noul site era rapid pe telefon și spunea clar ce face firma și cât costă.

## Cum comunici lansarea noului site

Un site nou e un motiv bun de a reveni în atenția clienților, nu doar o schimbare tehnică. Câteva idei:

- **anunță lansarea** pe rețelele sociale, cu câteva imagini din noul site și ce s-a îmbunătățit pentru client (programare online, prețuri, pagini noi);
- **trimite un email scurt** clienților existenți, cu linkul și una-două noutăți utile;
- **actualizează linkul** în profilul Google, pe rețelele sociale, în semnătura de email și pe materialele tipărite, dacă s-au schimbat adresele;
- **cere feedback** de la câțiva clienți fideli în primele săptămâni: ce le place, ce le lipsește, unde se blochează;
- **notează întrebările noi** primite după lansare; ele îți arată ce mai trebuie clarificat pe site.

Feedbackul din primele săptămâni e cel mai valoros, pentru că vine de la oameni care văd site-ul cu ochi proaspeți.

## Întrebări frecvente

### Când trebuie să-mi refac site-ul?

Când nu mai reflectă afacerea, funcționează prost pe telefon, e lent din cauza tehnologiei, nu poate fi actualizat ușor, are probleme de securitate repetate sau nu aduce cereri deși are vizitatori. Dacă problemele sunt doar de conținut, uneori o reparare e suficientă.

### Pierd pozițiile din Google dacă îmi refac site-ul?

Nu, dacă redesignul e făcut corect: păstrezi conținutul important, faci redirecționări permanente de la adresele vechi la cele noi și urmărești Search Console după lansare. Pot apărea mici fluctuații temporare, care de obicei se stabilizează repede.

### Ce sunt redirecționările și de ce contează?

O redirecționare trimite automat vizitatorii și motoarele de căutare de la o adresă veche la una nouă. Fără ea, linkurile vechi duc la pagini de eroare, iar Google pierde legătura dintre paginile vechi și cele noi, ceea ce poate duce la scăderea pozițiilor.

### Cât durează un redesign?

Un site de prezentare refăcut durează, de obicei, 7–15 zile lucrătoare pentru dezvoltare, plus analiza, textele și migrarea. Un magazin online durează mai mult, în funcție de numărul de produse și de integrări.

### Pot păstra textele de pe site-ul vechi?

Da, și e chiar recomandat pentru paginile care aduc vizitatori. Ideal, le îmbunătățești: adaugi prețuri, întrebări frecvente, exemple, și le adaptezi la structura noului site.

## Concluzie

Un site nou nu e un scop în sine, ci o soluție atunci când cel vechi nu-și mai face treaba și nu mai poate fi reparat rezonabil. Recunoaște semnele, alege între reparare și refacere cu cifrele în față și, dacă refaci, păstrează tot ce funcționează: conținutul bun, adresele sau redirecționările, datele de contact și dovezile de încredere.

Dacă vrei o analiză sinceră a site-ului tău, cu recomandarea „reparăm” sau „refacem”, [scrie-ne](/incepe-un-proiect) și îți răspundem în 24 de ore lucrătoare. Pentru partea de securitate, citește și ghidul despre [securitatea site-ului](/blog/securitate-site).`,
  },
  en: {
    title: "When is it time for a new website? 10 signs, and how to redesign without losing customers",
    seoTitle: "When to redo your website: 10 signs and a lossless redesign",
    description: "10 signs your website needs a redesign, how to decide between fixing and rebuilding, how to keep your Google rankings when moving, and the steps of a properly done redesign.",
    excerpt: "An old website can cost you customers every day, but a rushed redesign can cost you even more. Here are the signs it's time, and the steps for changing your website without losing what you've built.",
    content: `**In short:** it's time for a new website when the current one no longer reflects your business, looks or works badly on phones, is slow because of the technology it's built on, is hard or impossible to update, has repeated security problems or doesn't bring enquiries despite having visitors. Before rebuilding everything, check whether the problems can be fixed. If you do decide to rebuild, the most important thing is to keep what works: good content, the addresses of important pages (or correct redirects), SEO titles and contact details, so you don't lose your Google rankings and the customers who find you now.

I've rebuilt many websites and I've seen both extremes: companies keeping a ten-year-old website that drives customers away, and companies rebuilding every two years and losing their Google rankings each time because nobody thought about redirects. In this article I'll show you how to recognise the right moment and how to make the switch without losses.

## 10 signs your website needs a redesign

1. **It looks or works badly on phones.** Tiny text, cramped buttons, menus that won't open. Most visitors are on mobile.
2. **It's slow, and the cause is the technology.** Heavy themes, dozens of plugins, old code that can't be optimised any further. I explained how to measure speed in our guide to [website speed](/blog/viteza-site-ului-core-web-vitals).
3. **It no longer reflects the business.** Services you no longer offer, new ones missing, old prices, photos of a team that no longer exists.
4. **You can't update it yourself.** Every small change needs a developer, or nobody knows how any more.
5. **It has repeated security problems.** Hacks, spam, browser warnings, a platform that no longer receives updates.
6. **You get visitors but no enquiries.** I explained the possible causes in [Why your website isn't bringing in customers](/blog/de-ce-site-ul-nu-aduce-clienti).
7. **It looks dated next to competitors.** Customers compare. A website that looks abandoned suggests a careless company.
8. **It lacks features you need now**: online booking, payments, a store, a CRM connection, several languages.
9. **The legal side is out of date**: missing legal pages, no cookie banner, outdated company details.
10. **You don't know exactly what's behind it**: who has access, what it's built on, whose name the domain is in.

If three or more sound familiar, a serious review is worth it.

## Fix or rebuild?

Not every problem needs a new website. A practical rule:

| Situation | Recommendation |
|---|---|
| The technical foundation is good; the problems are content, message, prices, proof | **fix** |
| Slow because of images and a few plugins | **fix** |
| A few pages or a simple feature are missing | **fix / extend** |
| Slow because of the theme and an old platform | **rebuild** |
| Doesn't work properly on phones and can't easily be adapted | **rebuild** |
| A platform that no longer receives security updates | **rebuild** |
| The business has changed completely (services, audience, brand) | **rebuild** |

Fixing is faster and cheaper. Rebuilding makes sense when each repair costs more and more compared with a new, properly built website.

## What to keep in a redesign

A good redesign doesn't wipe out everything you've built. Start with an inventory:

- **pages that bring visitors from Google**: you can see them in Search Console; they must be kept or redirected correctly;
- **good content**: copy, FAQs, blog articles that work;
- **SEO titles and descriptions** that bring clicks;
- **links from other websites** to your pages;
- **forms and integrations** that work (CRM, email, invoicing);
- **contact details**, identical to those on your Google profile;
- **reviews, projects and trust signals**.

## Redirects: the most important technical step

When page addresses change (for example from "/our-services/whitening" to "/services/teeth-whitening"), every old address must be permanently redirected to the new one. Without that:

- people who saved or received the old links land on an error page;
- Google loses the connection between the old pages, which had rankings, and the new ones;
- links from other websites no longer lead anywhere.

The result: a sudden drop in visitors from Google, sometimes for months. With correct redirects, the transition is usually smooth. Google explains the principles in its [guide to moving a site](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## The steps of a properly done redesign

1. **Analysis**: what works, what doesn't, what customers want, what competitors do, which pages bring traffic.
2. **The brief**: goals, pages, features, materials, budget, timeline. I explained how to write one in our guide to the [website brief](/blog/brief-pentru-site).
3. **Structure and copy**: starting from what customers search for and the good existing content.
4. **Design**: new, but keeping the brand's recognisable elements.
5. **Development** on a test address, not directly over the current site.
6. **The redirect map**: every important old address, with its matching new address.
7. **Testing**: mobile, speed, forms, links, redirects, legal pages.
8. **Launch**, at a quiet moment, not in the middle of a campaign.
9. **Monitoring**: Search Console, errors, visitors, enquiries, in the first weeks.

## The launch-day checklist

On the day the new site goes live, check, in order:

1. the site opens on the main address, with and without "www", and only over HTTPS;
2. a few important old addresses redirect correctly to the new pages;
3. forms send messages, and the messages arrive where they should;
4. the phone number and email on the site are correct and tappable on mobile;
5. the new sitemap has been submitted to Google Search Console;
6. analytics and ad tools work, with consent;
7. the legal pages are up to date;
8. mobile speed is good.

Half an hour of checks on launch day saves you weeks of losing customers without knowing why.

## What happens to your Google rankings

Even with a properly done redesign, there can be small fluctuations in the first weeks while Google re-indexes the site. If the redirects are correct and the important content has been kept or improved, rankings usually recover quickly and often rise afterwards, especially if the new site is faster and better structured.

## What a redesign costs

A redesign generally costs about as much as a new website of the same type, because it's built from scratch, plus the work of analysis and migrating content and redirects. At MAVA Studio, a business website starts at 3,000 lei (about €600) and an online store at 6,000 lei (about €1,200). You'll find details on our [Pricing](/preturi) page and our [website development](/servicii/dezvoltare-website-uri) page. For context on what drives the price, read our guide on [how much a business website costs](/blog/cat-costa-un-website-pentru-afacerea-ta).

## How often should a website be rebuilt?

There's no fixed term. A well-built website, maintained consistently and updated with new content, can work very well for many years. More important than its age is whether it does its job. Regular maintenance, which I wrote about in our guide to [website maintenance](/blog/mentenanta-site), greatly delays the moment you need a new website.

## Common redesign mistakes

- **changing only the design**, without changing the message and structure;
- **deleting old content** that brought visitors;
- **changing page addresses without redirects**;
- **launching without testing** on phones or checking the forms;
- **launching mid-season** or in the middle of a campaign;
- **forgetting integrations**: the form no longer sends to the CRM, the ad pixel stops working;
- **not checking Search Console** after launch;
- **completely changing the visual identity** for no reason, so customers no longer recognise you.

## Example: a redesign with no losses

A construction company had an eight-year-old website: slow, hard to use on phones, with outdated services and no prices, but with a few pages that brought steady visitors from Google. Here's what we did:

1. extracted from Search Console the pages and searches that brought traffic;
2. kept and improved the copy on those pages, adding indicative prices and FAQs;
3. built the new site on a test address, with a separate page for each service;
4. created the redirect map for every old address;
5. launched during a quieter period and checked for errors daily in the first two weeks.

Visitors from Google didn't drop, and enquiries rose, because the new website was fast on phones and said clearly what the company does and what it costs.

## How to announce the new website

A new website is a good reason to get back in front of customers, not just a technical change. A few ideas:

- **announce the launch** on social media, with a few images of the new site and what's improved for customers (online booking, prices, new pages);
- **send a short email** to existing customers, with the link and one or two useful updates;
- **update the link** on your Google profile, social media, email signature and printed materials, if addresses have changed;
- **ask for feedback** from a few loyal customers in the first weeks: what they like, what's missing, where they get stuck;
- **note any new questions** that come in after launch; they show you what still needs clarifying on the site.

Feedback from the first weeks is the most valuable, because it comes from people seeing the website with fresh eyes.

## Frequently asked questions

### When should I rebuild my website?

When it no longer reflects your business, works badly on phones, is slow because of its technology, can't be updated easily, has repeated security problems or doesn't bring enquiries despite having visitors. If the problems are only about content, a fix is sometimes enough.

### Will I lose my Google rankings if I rebuild my website?

Not if the redesign is done properly: keep the important content, set up permanent redirects from old addresses to new ones and monitor Search Console after launch. Small temporary fluctuations can occur, which usually settle quickly.

### What are redirects and why do they matter?

A redirect automatically sends visitors and search engines from an old address to a new one. Without it, old links lead to error pages and Google loses the connection between old and new pages, which can lead to falling rankings.

### How long does a redesign take?

A rebuilt business website usually takes 7–15 working days of development, plus analysis, copy and migration. An online store takes longer, depending on the number of products and integrations.

### Can I keep the copy from my old website?

Yes, and it's actually recommended for pages that bring visitors. Ideally, improve it: add prices, FAQs and examples, and adapt it to the new site's structure.

## Conclusion

A new website isn't a goal in itself; it's the solution when the old one no longer does its job and can't reasonably be fixed. Recognise the signs, choose between fixing and rebuilding with the numbers in front of you and, if you rebuild, keep everything that works: good content, addresses or redirects, contact details and trust signals.

If you'd like an honest review of your website, with a "fix it" or "rebuild it" recommendation, [write to us](/incepe-un-proiect) and we'll reply within 24 working hours. For the security side, also read our guide to [website security](/blog/securitate-site).`,
  },
};

export default article;
