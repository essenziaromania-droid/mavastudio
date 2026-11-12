import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "seo-pentru-afaceri-mici-ghid",
  category: "seo",
  tags: ["SEO", "Google", "optimizare site", "afaceri mici", "Search Console"],
  ro: {
    title: "SEO pentru afaceri mici: ghid pe înțelesul tuturor ca să apari în Google",
    seoTitle: "SEO pentru afaceri mici: ghid simplu ca să apari în Google",
    description: "Ghid SEO pentru afaceri mici, fără jargon: cum funcționează Google, ce optimizezi pe site, cum scrii conținut util, cum obții linkuri și cum măsori rezultatele.",
    excerpt: "SEO nu e magie și nici un truc tehnic. E munca de a-i arăta lui Google, clar, că pagina ta e cel mai bun răspuns. Iată ce poți face chiar tu, pas cu pas.",
    content: `**Pe scurt:** SEO (optimizarea pentru motoarele de căutare) înseamnă să faci în așa fel încât site-ul tău să apară cât mai sus în Google când oamenii caută ce oferi. Pentru o afacere mică, contează cinci lucruri: un site rapid și bine structurat tehnic, câte o pagină clară pentru fiecare serviciu sau categorie de produse, conținut care răspunde cu adevărat la întrebările clienților, linkuri și mențiuni de pe alte site-uri și, pentru afacerile locale, un profil Google complet. Rezultatele apar de obicei în 3–6 luni, dar durează ani.

De fiecare dată când explic SEO unui client, încep cu o frază simplă: Google vrea să-i arate omului care caută cel mai bun răspuns posibil. Tot ce facem în SEO e să demonstrăm, clar, că pagina noastră e acel răspuns. Restul sunt detalii, iar în articolul ăsta le iau pe rând.

## Cum funcționează Google, pe scurt

Google face trei lucruri:

1. **Descoperă și citește paginile** (procesul se numește „crawling”). Roboții Google urmăresc linkuri și citesc conținutul.
2. **Le pune în index**, un fel de bibliotecă uriașă. O pagină care nu e în index nu poate apărea în rezultate.
3. **Le ordonează** pentru fiecare căutare, în funcție de sute de semnale: cât de relevantă e pagina, cât de utilă, cât de de încredere e site-ul, cât de bine merge pe telefon și multe altele.

Google descrie tot procesul în [ghidul oficial SEO pentru începători](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). Merită citit, chiar dacă lucrezi cu cineva.

## Partea 1: SEO tehnic (fundația)

Fără o fundație tehnică bună, restul muncii se pierde. Verifică:

- **Site-ul e indexat.** Caută în Google „site:domeniultau.ro”. Dacă nu apare nimic, e o problemă.
- **Ai un certificat de securitate (HTTPS).** Fără el, browserele afișează avertismente.
- **Site-ul merge bine pe telefon.** Google evaluează în primul rând varianta pentru mobil.
- **Site-ul e rapid.** Testează-l gratuit cu [PageSpeed Insights](https://pagespeed.web.dev/). Voi scrie un ghid separat despre viteză.
- **Ai o hartă a site-ului (sitemap)** trimisă în Google Search Console.
- **Adresele sunt clare.** „/servicii/albire-dentara” e mai bine decât „/page?id=123”.
- **Nu ai pagini duplicate** sau pagini goale indexate.

## Partea 2: o pagină pentru fiecare lucru important

Una dintre cele mai frecvente greșeli: un singur „Servicii” cu zece servicii înșirate pe o pagină. Google nu are cum să te pună sus pentru fiecare dintre ele. Regula:

- **un serviciu important = o pagină**;
- **o categorie de produse = o pagină**, cu text propriu, nu doar o listă de produse;
- **o întrebare importantă a clienților = o secțiune sau un articol**.

Fiecare pagină are un singur subiect principal și răspunde complet la el.

## Partea 3: titlurile și descrierile

Fiecare pagină are:

- **un titlu SEO** (ce apare albastru în Google): ideal sub ~60 de caractere, cu subiectul principal la început și, dacă e cazul, orașul;
- **o descriere** (textul gri de sub titlu): ideal sub ~155 de caractere, care convinge omul să dea click;
- **un titlu principal pe pagină (H1)**, unul singur, clar;
- **subtitluri (H2, H3)** care împart conținutul logic.

Exemplu pentru o clinică:

- titlu SEO: „Albire dentară în Ploiești | Clinica Exemplu”
- descriere: „Albire dentară profesională în Ploiești, în 1–2 ședințe, fără sensibilitate. Vezi prețuri, cum decurge și programează-te online.”

## Partea 4: conținutul care răspunde la întrebări

Google insistă, în [ghidul despre conținut util](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), pe conținut scris pentru oameni, nu pentru motoarele de căutare. În practică:

- **răspunde direct** la întrebare, la început, apoi detaliază;
- **folosește cuvintele clienților**, nu jargonul tău;
- **arată experiența**: exemple reale, poze reale, situații concrete;
- **fii complet**: preț, durată, pași, avantaje, dezavantaje, întrebări frecvente;
- **actualizează** paginile când se schimbă ceva.

Un exemplu bun e chiar acest blog: fiecare articol începe cu răspunsul pe scurt, apoi intră în detalii, ca în ghidul despre [cât costă un site de prezentare](/blog/cat-costa-un-website-pentru-afacerea-ta).

## Partea 5: cuvintele cheie, fără obsesie

Cuvintele cheie sunt expresiile pe care oamenii le scriu în Google. Nu trebuie să le repeți de zeci de ori. Trebuie doar:

- să știi ce caută clienții tăi (întreabă-i, uită-te în Search Console, folosește sugestiile din Google);
- să folosești expresia principală în titlu, în primul paragraf și natural în text;
- să acoperi și variantele și întrebările legate („preț”, „cât durează”, „doare?”).

Voi scrie un articol separat despre cum alegi cuvintele cheie.

## Partea 6: linkurile interne

Linkurile dintre paginile tale îi arată lui Google ce e important și îi ajută pe oameni să găsească informații. Câteva reguli:

- leagă articolele de blog de paginile de servicii relevante;
- leagă paginile de servicii între ele, acolo unde au legătură;
- folosește texte de link descriptive („vezi prețurile pentru albire dentară”), nu „click aici”.

## Partea 7: linkurile de pe alte site-uri

Când alte site-uri de încredere te menționează și pun un link spre tine, Google interpretează asta ca pe un vot de încredere. Pentru o afacere mică, linkurile bune vin din:

- presa locală și site-urile de știri din domeniul tău;
- parteneri, furnizori, clienți B2B;
- asociații profesionale și directoare relevante;
- evenimente la care participi sau pe care le sponsorizezi;
- articole invitate pe bloguri din domeniu.

Evită pachetele de linkuri cumpărate. Pot face mai mult rău decât bine.

## Partea 8: SEO local, dacă ai clienți în zona ta

Pentru afacerile locale, profilul Google Business Profile e la fel de important ca site-ul. Am scris un ghid complet despre [SEO local și Google Maps](/blog/seo-local-google-business-profile).

## Partea 9: datele structurate

Datele structurate sunt informații adăugate în codul paginii, care îi spun lui Google exact ce conține: o firmă, un produs cu preț, un articol, întrebări frecvente. Ele pot face ca rezultatele tale să apară mai bogat în Google și ajută și motoarele de căutare cu AI să înțeleagă pagina. Vocabularul folosit e cel de pe [schema.org](https://schema.org/). Pe un site bine construit, se adaugă automat.

## Partea 10: măsurarea

Folosește gratuit [Google Search Console](https://search.google.com/search-console/about). Îți arată:

- pentru ce căutări apari;
- pe ce poziție, în medie;
- câte afișări și câte clicuri primești;
- ce pagini au probleme de indexare.

Uită-te lunar. Caută paginile care apar des, dar primesc puține clicuri: de multe ori, un titlu și o descriere mai bune rezolvă problema.

## Cât durează până vezi rezultate

| Situație | Când apar, de obicei, primele rezultate |
|---|---|
| Probleme tehnice reparate | câteva săptămâni |
| Pagini noi de servicii | 1 – 3 luni |
| Articole de blog | 3 – 6 luni |
| Linkuri și mențiuni noi | 3 – 6 luni |
| Domeniu foarte competitiv | 6 – 12 luni sau mai mult |

SEO e o investiție pe termen lung. Spre deosebire de reclame, efectul nu se oprește când oprești plata.

## Ce poți face singur în prima lună

1. Creează-ți cont în Google Search Console și trimite harta site-ului.
2. Verifică viteza cu PageSpeed Insights pe telefon.
3. Scrie titluri și descrieri clare pentru fiecare pagină.
4. Asigură-te că fiecare serviciu important are pagina lui.
5. Completează profilul Google Business Profile, dacă ai clienți locali.
6. Scrie răspunsuri la cele mai frecvente 5 întrebări ale clienților, pe site.
7. Cere 3–5 recenzii de la clienți mulțumiți.

## Greșeli frecvente în SEO

- **Repeți cuvântul cheie de 30 de ori.** Textul devine greu de citit și nu ajută.
- **Copiezi texte de pe alte site-uri.** Google nu are motiv să te pună primul.
- **Ai un singur „Servicii” pentru tot.** Fiecare serviciu merită pagina lui.
- **Schimbi adresele paginilor fără redirecționări.** Pierzi poziții câștigate în ani.
- **Aștepți rezultate în două săptămâni.** SEO are nevoie de timp.
- **Cumperi linkuri.** Riscul e mai mare decât câștigul.
- **Ignori telefonul.** Majoritatea căutărilor vin de pe mobil.

## Exemplu: cum arată o pagină de serviciu optimizată

Să luăm o firmă de curățenie din Ploiești și pagina ei pentru „curățenie după constructor”. O pagină bine făcută ar avea:

1. **Titlul principal**: „Curățenie după constructor în Ploiești și împrejurimi”.
2. **Primul paragraf**: răspunsul direct: ce include, în cât timp, de la ce preț.
3. **Ce include serviciul**: o listă clară (praf de construcție, geamuri, gresie, faianță, evacuarea resturilor mici).
4. **Cum decurge**: pașii, de la evaluare la predare.
5. **Prețul**: un preț orientativ pe metru pătrat sau un interval, plus ce îl influențează.
6. **Zona deservită**: Ploiești și localitățile din jur, menționate natural.
7. **Poze reale**: înainte și după, din lucrări proprii.
8. **Recenzii** de la clienți care au folosit exact acest serviciu.
9. **Întrebări frecvente**: cât durează, trebuie să fiu acasă, aduceți voi produsele.
10. **Un buton clar**: „Cere o ofertă în 24 de ore”.

O astfel de pagină răspunde complet la ce caută omul, deci are toate șansele să fie considerată de Google cel mai bun rezultat.

## Cum alegi pe cineva care să-ți facă SEO

Dacă decizi să lucrezi cu un specialist, fii atent la câteva semnale:

- **promite poziția 1 în Google în două săptămâni**: nimeni nu poate garanta asta;
- **nu-ți explică ce face**: ar trebui să primești un plan clar și rapoarte pe înțelesul tău;
- **vorbește doar de linkuri**: SEO-ul bun începe cu site-ul și conținutul;
- **nu-ți cere acces la Search Console**: fără date, lucrează pe ghicite.

Un specialist serios îți spune ce poate face, în cât timp, cum măsurați împreună și ce depinde de tine.

## SEO și motoarele de căutare cu AI

Tot mai mulți oameni pun întrebări direct în ChatGPT, Gemini, Perplexity sau în rezumatele cu AI din Google. Vestea bună: aceleași lucruri care ajută SEO-ul clasic ajută și aici. Conținut clar, cu răspunsuri directe, bine structurat, cu date structurate și semnale de încredere (autor real, date de contact, recenzii) are mai multe șanse să fie citat. Voi scrie un ghid separat despre optimizarea pentru motoarele AI (GEO).

## Întrebări frecvente

### Ce înseamnă SEO?

SEO vine de la „Search Engine Optimization”, adică optimizarea pentru motoarele de căutare. Înseamnă toate acțiunile prin care faci un site să apară mai sus în rezultatele Google pentru căutările relevante pentru afacerea ta, fără să plătești pentru fiecare click.

### În cât timp dă rezultate SEO-ul?

Primele rezultate apar, de obicei, în 3–6 luni pentru o afacere mică, în funcție de concurență și de starea site-ului. Reparațiile tehnice pot avea efect în câteva săptămâni, iar domeniile foarte competitive pot avea nevoie de un an sau mai mult.

### Pot face SEO singur?

Da, partea de bază: titluri și descrieri, câte o pagină pentru fiecare serviciu, conținut util, profil Google și recenzii. Pentru partea tehnică, viteză și strategie de conținut pe termen lung, ajutorul unui specialist economisește timp.

### Merită să am blog pentru SEO?

Da, dacă scrii articole utile care răspund la întrebările reale ale clienților tăi. Un blog bun aduce vizitatori din Google, construiește încredere și te ajută să apari și în răspunsurile motoarelor de căutare cu AI.

### Care e diferența dintre SEO și reclamele Google?

Reclamele Google îți aduc vizitatori imediat, dar plătești pentru fiecare click și efectul se oprește când oprești bugetul. SEO durează mai mult, dar rezultatele rămân și se acumulează în timp. Ideal, cele două se completează.

## Concluzie

SEO pentru o afacere mică nu e o știință secretă. E un site tehnic sănătos, pagini clare pentru fiecare serviciu, conținut care răspunde cu adevărat la întrebări, câteva linkuri bune și răbdare. Fă-le pe rând, măsoară lunar și îmbunătățește constant.

Dacă vrei un site construit de la început pentru Google, cu structură, viteză și date structurate corecte, vezi pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri) sau [trimite-ne o cerere](/incepe-un-proiect). Pentru o ofertă rapidă, alege varianta potrivită din ghidul [landing page sau site de prezentare](/blog/landing-page-sau-site-de-prezentare).`,
  },
  en: {
    title: "SEO for small businesses: a plain-language guide to showing up on Google",
    seoTitle: "SEO for small businesses: a simple guide to ranking on Google",
    description: "An SEO guide for small businesses, without jargon: how Google works, what to optimise on your website, how to write useful content, earn links and measure results.",
    excerpt: "SEO isn't magic or a technical trick. It's the work of showing Google, clearly, that your page is the best answer. Here's what you can do yourself, step by step.",
    content: `**In short:** SEO (search engine optimisation) means making your website appear as high as possible on Google when people search for what you offer. For a small business, five things matter: a fast website with a sound technical structure, a clear page for each service or product category, content that genuinely answers customers' questions, links and mentions from other websites and, for local businesses, a complete Google profile. Results usually appear in 3–6 months, but they last for years.

Whenever I explain SEO to a client, I start with one simple sentence: Google wants to show the person searching the best possible answer. Everything we do in SEO is to demonstrate, clearly, that our page is that answer. The rest is detail, and in this article I go through it piece by piece.

## How Google works, briefly

Google does three things:

1. **It discovers and reads pages** (a process called "crawling"). Google's bots follow links and read content.
2. **It adds them to its index**, a kind of huge library. A page that isn't in the index can't appear in results.
3. **It ranks them** for each search, based on hundreds of signals: how relevant the page is, how useful, how trustworthy the website is, how well it works on phones, and much more.

Google describes the whole process in its [official SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide). It's worth reading, even if you work with someone.

## Part 1: technical SEO (the foundation)

Without a good technical foundation, the rest of the work is wasted. Check that:

- **Your website is indexed.** Search Google for "site:yourdomain.com". If nothing comes up, there's a problem.
- **You have a security certificate (HTTPS).** Without it, browsers show warnings.
- **The website works well on phones.** Google primarily evaluates the mobile version.
- **The website is fast.** Test it for free with [PageSpeed Insights](https://pagespeed.web.dev/). I'll write a separate guide on speed.
- **You have a sitemap** submitted in Google Search Console.
- **Your URLs are clear.** "/services/teeth-whitening" is better than "/page?id=123".
- **You have no duplicate pages** or empty pages in the index.

## Part 2: one page for every important thing

One of the most common mistakes: a single "Services" page listing ten services. Google has no way to rank you highly for each of them. The rule:

- **one important service = one page**;
- **one product category = one page**, with its own copy, not just a product list;
- **one important customer question = one section or one article**.

Each page has a single main topic and answers it completely.

## Part 3: titles and descriptions

Every page has:

- **an SEO title** (the blue text on Google): ideally under ~60 characters, with the main topic at the start and, where relevant, the city;
- **a description** (the grey text under the title): ideally under ~155 characters, persuading people to click;
- **one main heading on the page (H1)**, just one, and clear;
- **subheadings (H2, H3)** that split the content logically.

An example for a clinic:

- SEO title: "Teeth whitening in Ploiești | Example Clinic"
- description: "Professional teeth whitening in Ploiești, in 1–2 sessions, without sensitivity. See prices and how it works, and book online."

## Part 4: content that answers questions

Google stresses, in its [guide to helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), that content should be written for people, not for search engines. In practice:

- **answer the question directly**, at the start, then go into detail;
- **use your customers' words**, not your jargon;
- **show experience**: real examples, real photos, concrete situations;
- **be complete**: price, duration, steps, pros, cons, FAQs;
- **update** pages when something changes.

This blog is an example: every article starts with the short answer, then goes into detail, as in our guide on [how much a business website costs](/blog/cat-costa-un-website-pentru-afacerea-ta).

## Part 5: keywords, without the obsession

Keywords are the phrases people type into Google. You don't need to repeat them dozens of times. You just need to:

- know what your customers search for (ask them, look in Search Console, use Google's suggestions);
- use the main phrase in the title, in the first paragraph and naturally in the text;
- also cover related variations and questions ("price", "how long does it take", "does it hurt?").

I'll write a separate article on how to choose keywords.

## Part 6: internal links

Links between your own pages show Google what's important and help people find information. A few rules:

- link blog articles to the relevant service pages;
- link service pages to each other where they're related;
- use descriptive link text ("see prices for teeth whitening"), not "click here".

## Part 7: links from other websites

When other trustworthy websites mention you and link to you, Google treats it as a vote of confidence. For a small business, good links come from:

- local press and news sites in your industry;
- partners, suppliers, B2B clients;
- professional associations and relevant directories;
- events you attend or sponsor;
- guest articles on blogs in your field.

Avoid bought link packages. They can do more harm than good.

## Part 8: local SEO, if your customers are nearby

For local businesses, your Google Business Profile matters as much as your website. I wrote a full guide to [local SEO and Google Maps](/blog/seo-local-google-business-profile).

## Part 9: structured data

Structured data is information added to a page's code that tells Google exactly what it contains: a business, a product with a price, an article, FAQs. It can make your results appear richer on Google and also helps AI search engines understand the page. The vocabulary used comes from [schema.org](https://schema.org/). On a well-built website, it's added automatically.

## Part 10: measurement

Use the free [Google Search Console](https://search.google.com/search-console/about). It shows you:

- which searches you appear for;
- your average position;
- how many impressions and clicks you get;
- which pages have indexing problems.

Check it monthly. Look for pages that appear often but get few clicks: often a better title and description solves the problem.

## How long until you see results

| Situation | When the first results usually appear |
|---|---|
| Technical problems fixed | a few weeks |
| New service pages | 1 – 3 months |
| Blog articles | 3 – 6 months |
| New links and mentions | 3 – 6 months |
| Highly competitive market | 6 – 12 months or more |

SEO is a long-term investment. Unlike ads, the effect doesn't stop when you stop paying.

## What you can do yourself in the first month

1. Create a Google Search Console account and submit your sitemap.
2. Check your speed on mobile with PageSpeed Insights.
3. Write clear titles and descriptions for every page.
4. Make sure every important service has its own page.
5. Complete your Google Business Profile, if you have local customers.
6. Write answers to your customers' 5 most frequent questions on your website.
7. Ask 3–5 happy customers for reviews.

## Common SEO mistakes

- **Repeating the keyword 30 times.** The copy becomes hard to read and it doesn't help.
- **Copying text from other websites.** Google has no reason to rank you first.
- **One "Services" page for everything.** Each service deserves its own page.
- **Changing page URLs without redirects.** You lose rankings built up over years.
- **Expecting results in two weeks.** SEO takes time.
- **Buying links.** The risk outweighs the gain.
- **Ignoring mobile.** Most searches come from phones.

## Example: what an optimised service page looks like

Take a cleaning company in Ploiești and its page for "post-construction cleaning". A well-built page would have:

1. **The main heading**: "Post-construction cleaning in Ploiești and surrounding areas".
2. **The first paragraph**: the direct answer: what's included, how long it takes, the starting price.
3. **What the service includes**: a clear list (construction dust, windows, tiles, removing small debris).
4. **How it works**: the steps, from assessment to handover.
5. **The price**: an indicative price per square metre or a range, plus what affects it.
6. **The service area**: Ploiești and nearby towns, mentioned naturally.
7. **Real photos**: before and after, from their own jobs.
8. **Reviews** from customers who used exactly this service.
9. **FAQs**: how long it takes, whether you need to be home, whether they bring the products.
10. **A clear button**: "Get a quote within 24 hours".

A page like this fully answers what the person is looking for, so it has every chance of being seen by Google as the best result.

## How to choose someone to do your SEO

If you decide to work with a specialist, watch out for a few signals:

- **they promise the top spot on Google within two weeks**: nobody can guarantee that;
- **they don't explain what they do**: you should get a clear plan and reports you understand;
- **they only talk about links**: good SEO starts with the website and the content;
- **they don't ask for access to Search Console**: without data, they're guessing.

A serious specialist tells you what they can do, in what timeframe, how you'll measure it together and what depends on you.

## SEO and AI search engines

More and more people ask questions directly in ChatGPT, Gemini, Perplexity or Google's AI summaries. The good news: the same things that help classic SEO help here too. Clear, well-structured content with direct answers, structured data and trust signals (a real author, contact details, reviews) is more likely to be cited. I'll write a separate guide on optimising for AI search engines (GEO).

## Frequently asked questions

### What does SEO mean?

SEO stands for "search engine optimisation". It covers everything you do to make a website appear higher in Google results for searches relevant to your business, without paying for each click.

### How long does SEO take to work?

For a small business, the first results usually appear in 3–6 months, depending on the competition and the state of the website. Technical fixes can have an effect within weeks, while highly competitive markets may need a year or more.

### Can I do SEO myself?

Yes, the basics: titles and descriptions, one page per service, useful content, your Google profile and reviews. For the technical side, speed and a long-term content strategy, a specialist saves you time.

### Is a blog worth it for SEO?

Yes, if you write useful articles that answer your customers' real questions. A good blog brings visitors from Google, builds trust and helps you appear in the answers of AI search engines too.

### What's the difference between SEO and Google Ads?

Google Ads bring you visitors immediately, but you pay for every click and the effect stops when you stop the budget. SEO takes longer, but the results last and build up over time. Ideally, the two complement each other.

## Conclusion

SEO for a small business isn't a secret science. It's a technically healthy website, clear pages for each service, content that genuinely answers questions, a few good links and patience. Do them one at a time, measure monthly and keep improving.

If you want a website built for Google from the start, with the right structure, speed and structured data, see our [website development](/servicii/dezvoltare-website-uri) page or [send us a request](/incepe-un-proiect). For a quick decision on format, read our guide to [landing pages vs. business websites](/blog/landing-page-sau-site-de-prezentare).`,
  },
};

export default article;
