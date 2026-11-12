import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "securitate-site",
  category: "website",
  tags: ["securitate site", "HTTPS", "parole", "copii de siguranță", "atacuri"],
  ro: {
    title: "Securitatea site-ului pentru o afacere mică: 15 măsuri care te protejează",
    seoTitle: "Securitatea site-ului: 15 măsuri pentru o afacere mică",
    description: "Cum îți protejezi site-ul firmei de atacuri: HTTPS, actualizări, parole și autentificare în doi pași, copii de siguranță, formulare protejate, acces limitat, monitorizare și ce faci dacă ești atacat.",
    excerpt: "Majoritatea atacurilor asupra site-urilor mici sunt automate și profită de greșeli simple. Iată 15 măsuri practice, pe înțelesul oricui, care îți protejează site-ul, datele clienților și reputația.",
    content: `**Pe scurt:** majoritatea atacurilor asupra site-urilor firmelor mici nu sunt personale, ci automate: programe care caută versiuni vechi de software, parole slabe și formulare neprotejate. Cele mai importante măsuri sunt: certificat HTTPS, actualizări regulate, parole puternice și autentificare în doi pași, cât mai puține extensii și conturi, copii de siguranță automate păstrate separat, formulare protejate împotriva spamului, acces limitat la panoul de administrare și monitorizare. Cu acestea, riscul scade foarte mult, iar dacă se întâmplă ceva, site-ul poate fi refăcut repede.

Mulți proprietari de afaceri cred că „nimeni nu are de ce să-mi atace site-ul, sunt o firmă mică”. Din păcate, atacatorii nu aleg firme, aleg site-uri vulnerabile. Programele lor scanează automat milioane de site-uri pe zi. Vestea bună: aceleași greșeli simple care fac un site vulnerabil se pot repara simplu. Iată lista completă.

## De ce ar fi atacat un site mic

- **pentru a trimite spam** din numele tău, prin formulare sau prin server;
- **pentru a pune linkuri ascunse** spre alte site-uri, ca să le crească pozițiile în Google;
- **pentru a redirecționa vizitatorii** spre site-uri înșelătoare;
- **pentru a fura date**: emailuri, telefoane, date de comandă;
- **pentru a folosi serverul** în alte atacuri;
- **pentru a cere bani** (blocarea site-ului sau a datelor).

Consecințele pentru tine: avertismente de securitate în browser, căderea din Google, pierderea încrederii clienților și, dacă sunt expuse date personale, obligații legale.

## 15 măsuri care te protejează

### 1. Certificat HTTPS pe tot site-ul

Toate paginile trebuie să se încarce prin HTTPS. Certificatele de bază sunt gratuite, de exemplu prin [Let's Encrypt](https://letsencrypt.org/), și sunt incluse în majoritatea găzduirilor. Fără HTTPS, browserele afișează „Nesigur”.

### 2. Actualizări regulate

Platforma site-ului, tema, extensiile și bibliotecile folosite primesc actualizări de securitate. Aplică-le regulat, după testare. Versiunile vechi, cu vulnerabilități cunoscute, sunt ținta principală a atacurilor automate.

### 3. Cât mai puține extensii

Fiecare extensie e cod scris de altcineva, care poate avea probleme. Păstrează doar ce folosești efectiv și alege extensii întreținute activ. Am comparat platformele și din acest punct de vedere în articolul [WordPress, Shopify sau site personalizat](/blog/wordpress-shopify-sau-site-personalizat).

### 4. Parole puternice și unice

- parole lungi, diferite pentru fiecare cont;
- un manager de parole, ca să nu le ții minte sau pe hârtie;
- niciodată aceeași parolă pentru site, email și găzduire.

### 5. Autentificare în doi pași

Activeaz-o pentru panoul site-ului, găzduire, domeniu, email și contul procesatorului de plăți. Chiar dacă parola e furată, contul rămâne protejat.

### 6. Conturi separate pentru fiecare om

Fiecare angajat sau colaborator are contul lui, cu drepturile de care are nevoie, nu mai mult. Niciodată un cont comun cu parola trimisă pe WhatsApp.

### 7. Revocarea accesului

Când un colaborator nu mai lucrează cu tine, îi ștergi contul sau îi schimbi drepturile în aceeași zi. Fă o verificare de două ori pe an: cine mai are acces și de ce?

### 8. Copii de siguranță automate, păstrate separat

Copiile trebuie să fie automate, regulate și păstrate în alt loc decât serverul site-ului. Testează din când în când restaurarea. Am explicat detaliile în ghidul despre [mentenanța site-ului](/blog/mentenanta-site).

### 9. Formulare protejate

Formularele de contact sunt ținta preferată a roboților de spam. Protejează-le cu:

- o verificare invizibilă sau un test simplu pentru roboți;
- limitarea numărului de trimiteri de pe aceeași adresă;
- verificarea datelor introduse;
- doar câmpurile necesare.

### 10. Încărcarea fișierelor, cu grijă

Dacă site-ul permite încărcarea de fișiere (CV-uri, documente, poze), limitează tipurile și mărimea și stochează-le într-un loc privat, nu accesibil public.

### 11. Panoul de administrare protejat

- adresă de conectare care nu e cea implicită, unde se poate;
- limitarea încercărilor de conectare;
- notificări la conectări din locații noi.

### 12. Găzduire de încredere

O găzduire bună are protecție de bază la nivel de server, actualizează sistemul și separă site-urile între ele. Despre cum alegi găzduirea am scris în ghidul despre [domeniu, găzduire și email profesional](/blog/domeniu-gazduire-email-profesional).

### 13. Monitorizare

Alerte când site-ul cade, când apar fișiere modificate neașteptat sau când Google detectează probleme. Google Search Console îți trimite notificări de securitate dacă găsește probleme pe site.

### 14. Mai puține date colectate

Datele pe care nu le colectezi nu pot fi furate. Cere în formulare doar ce îți trebuie și șterge periodic datele de care nu mai ai nevoie. E și o cerință GDPR, explicată în ghidul despre [obligațiile legale ale unui site](/blog/obligatii-legale-site-romania).

### 15. Atenție la emailurile false

Multe atacuri încep cu un email care pare de la găzduire, de la registratorul domeniului sau de la o bancă și cere „confirmarea contului” pe un link. Verifică întotdeauna direct în contul tău, nu prin linkul din email.

## Un plan de securitate pe un an

Ca să nu uiți nimic, împarte măsurile pe un calendar simplu:

- **săptămânal**: verifică actualizările disponibile și alertele de monitorizare;
- **lunar**: aplică actualizările după testare, verifică formularele, uită-te în Google Search Console;
- **la fiecare trei luni**: testează restaurarea unei copii de siguranță, verifică lista de extensii și elimină ce nu folosești;
- **de două ori pe an**: verifică cine are acces la site, găzduire, domeniu și email și revocă ce nu mai e necesar; schimbă parolele importante;
- **anual**: verifică data de expirare a domeniului, contractul de găzduire și paginile legale.

Dacă ai un contract de mentenanță, majoritatea acestor pași sunt făcuți de furnizor, iar tu primești doar raportul.

## Cât costă securitatea

Partea bună: cele mai multe măsuri de bază costă foarte puțin sau nimic. Certificatul HTTPS e de obicei gratuit, autentificarea în doi pași e gratuită, un manager de parole are variante accesibile, iar copiile de siguranță automate sunt incluse în multe găzduiri. Ce costă, de fapt, e timpul cuiva care să se ocupe constant. De aceea securitatea face parte din pachetul de mentenanță, care la MAVA Studio pornește de la 500 de lei pe lună, așa cum găsești pe pagina [Prețuri](/preturi).

## Securitatea plăților

Dacă primești plăți online, folosește pagina securizată sau formularele procesatorului de plăți, ca datele cardurilor să nu treacă prin serverul tău. Am explicat cum funcționează în ghidul despre [plățile online pentru magazin](/blog/plati-online-magazin).

## Ce faci dacă site-ul a fost atacat

1. **păstrează-ți calmul** și nu șterge nimic în grabă;
2. **schimbă imediat parolele** pentru site, găzduire, domeniu și email;
3. **anunță furnizorul** de mentenanță sau găzduirea;
4. **restaurează site-ul** dintr-o copie de siguranță curată;
5. **aplică actualizările** care lipseau și închide breșa;
6. **verifică Google Search Console** și cere reverificarea, dacă site-ul a fost marcat ca periculos;
7. **verifică dacă au fost expuse date personale**: dacă da, GDPR îți cere, în anumite condiții, să notifici autoritatea de supraveghere (în România, [ANSPDCP](https://www.dataprotection.ro/)) în cel mult 72 de ore de la momentul în care afli și, uneori, să informezi persoanele afectate. Cere sfatul unui jurist.

## Lista de verificare rapidă

| Măsură | O ai? |
|---|---|
| HTTPS pe toate paginile | |
| Actualizări aplicate în ultima lună | |
| Autentificare în doi pași pe conturile importante | |
| Conturi separate, fără parole comune | |
| Copii de siguranță automate, păstrate separat | |
| Formulare protejate împotriva spamului | |
| Doar extensiile necesare | |
| Monitorizare și alerte | |
| Știi cine are acces la site acum | |

Fiecare „nu” e un punct pe care merită să-l rezolvi săptămâna asta.

## Securitatea, ghidurile de referință

Pentru cei care vor să meargă mai departe, proiectul [OWASP Top 10](https://owasp.org/www-project-top-ten/) descrie cele mai frecvente categorii de vulnerabilități ale aplicațiilor web. E un ghid tehnic, util mai ales pentru cei care dezvoltă site-uri și aplicații, dar arată bine logica: majoritatea problemelor vin din câteva greșeli repetate.

## Greșeli frecvente

- **„Sunt prea mic ca să fiu atacat.”**
- **aceeași parolă peste tot**;
- **actualizări amânate luni întregi**;
- **zeci de extensii**, multe nefolosite;
- **copii de siguranță doar pe același server**;
- **acces păstrat de foști colaboratori**;
- **formulare fără protecție**, care trimit sute de mesaje spam;
- **dai click pe linkuri din emailuri** care cer „confirmarea contului”.

## Exemplu: un site mic, protejat în o după-amiază

Un site de prezentare al unei firme de servicii, construit cu câțiva ani în urmă, avea: extensii neactualizate de mult, un singur cont de administrator folosit de trei oameni, nicio copie de siguranță și un formular care primea zeci de mesaje spam pe zi. Într-o după-amiază:

1. am făcut o copie de siguranță completă, păstrată separat;
2. am actualizat platforma și extensiile, după testare, și am eliminat extensiile nefolosite;
3. am creat conturi separate pentru fiecare om, cu autentificare în doi pași;
4. am protejat formularul împotriva roboților;
5. am activat copii de siguranță automate zilnice și monitorizarea.

Spamul a dispărut aproape complet, iar riscul unui atac reușit a scăzut foarte mult.

## Securitatea și angajații

O mare parte dintre incidente pornesc de la o greșeală umană, nu de la un atac sofisticat. Câteva obiceiuri care merită împărtășite cu toți cei care au acces la site și la conturile firmei:

- **nu împărtăși parolele** pe chat sau pe email, nici măcar cu colegii;
- **blochează calculatorul** când pleci de la birou;
- **nu folosi rețele Wi-Fi publice** pentru a intra în panoul site-ului fără o conexiune securizată;
- **raportează imediat** orice email sau mesaj suspect, în loc să-l ignori;
- **nu instala extensii sau programe** pe site fără acordul celui care se ocupă de mentenanță;
- **folosește doar dispozitive actualizate** pentru accesul la conturile importante.

O scurtă discuție de 15 minute cu echipa, o dată pe an, previne multe probleme. Fă-o practică: arată un exemplu real de email fals, explică cum verifici un link înainte să-l deschizi și stabiliți clar cui îi spune fiecare când ceva pare suspect.

## Întrebări frecvente

### De ce ar ataca cineva site-ul unei firme mici?

Majoritatea atacurilor sunt automate și caută site-uri vulnerabile, indiferent de mărimea firmei. Site-urile atacate sunt folosite pentru spam, linkuri ascunse, redirecționări înșelătoare sau furt de date.

### Care e cea mai importantă măsură de securitate pentru un site?

Nu există una singură, dar combinația dintre actualizări regulate, parole puternice cu autentificare în doi pași și copii de siguranță automate păstrate separat protejează împotriva majorității problemelor.

### Este suficient certificatul HTTPS?

Nu. HTTPS protejează datele în timpul transferului dintre vizitator și site, dar nu protejează site-ul de vulnerabilități în software, parole slabe sau extensii vechi. E o măsură necesară, dar nu suficientă.

### Ce fac dacă site-ul meu a fost atacat?

Schimbă imediat parolele, anunță-ți furnizorul de mentenanță sau găzduirea, restaurează site-ul dintr-o copie de siguranță curată, aplică actualizările lipsă și verifică dacă au fost expuse date personale. Dacă da, verifică obligațiile de notificare prevăzute de GDPR.

### Cât de des trebuie actualizat un site?

Actualizările de securitate trebuie aplicate cât mai repede după apariție, după o testare rapidă. În practică, o verificare săptămânală sau cel puțin lunară a actualizărilor disponibile e un ritm bun pentru majoritatea site-urilor.

## Concluzie

Securitatea unui site mic nu cere un departament IT, ci câteva obiceiuri bune, făcute constant: actualizări, parole bune cu autentificare în doi pași, cât mai puține extensii și conturi, copii de siguranță păstrate separat și formulare protejate. Ele previn majoritatea atacurilor și fac orice problemă ușor de reparat.

Dacă vrei să-ți verificăm site-ul sau să ne ocupăm de mentenanța și securitatea lui, [scrie-ne](/incepe-un-proiect) și îți răspundem în 24 de ore lucrătoare. Pentru un site nou, construit sigur de la început, vezi pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri).`,
  },
  en: {
    title: "Website security for a small business: 15 measures that protect you",
    seoTitle: "Website security: 15 measures for a small business",
    description: "How to protect your company website from attacks: HTTPS, updates, passwords and two-factor authentication, backups, protected forms, limited access, monitoring and what to do if you're hacked.",
    excerpt: "Most attacks on small websites are automated and exploit simple mistakes. Here are 15 practical measures, in plain language, that protect your website, your customers' data and your reputation.",
    content: `**In short:** most attacks on small business websites aren't personal; they're automated: programs looking for old software versions, weak passwords and unprotected forms. The most important measures are: an HTTPS certificate, regular updates, strong passwords and two-factor authentication, as few plugins and accounts as possible, automatic backups stored separately, spam-protected forms, limited access to the admin panel and monitoring. With these in place, the risk drops dramatically, and if something does happen, the website can be restored quickly.

Many business owners think "nobody would bother attacking my website, I'm a small company". Unfortunately, attackers don't pick companies; they pick vulnerable websites. Their programs automatically scan millions of websites a day. The good news: the same simple mistakes that make a website vulnerable can be fixed simply. Here's the full list.

## Why a small website would be attacked

- **to send spam** in your name, through forms or the server;
- **to plant hidden links** to other websites, to boost their Google rankings;
- **to redirect visitors** to scam websites;
- **to steal data**: emails, phone numbers, order details;
- **to use the server** in other attacks;
- **to demand money** (locking the website or the data).

The consequences for you: security warnings in browsers, dropping out of Google, losing customers' trust and, if personal data is exposed, legal obligations.

## 15 measures that protect you

### 1. HTTPS across the whole website

Every page must load over HTTPS. Basic certificates are free, for example through [Let's Encrypt](https://letsencrypt.org/), and are included with most hosting. Without HTTPS, browsers show "Not secure".

### 2. Regular updates

Your website's platform, theme, plugins and libraries receive security updates. Apply them regularly, after testing. Old versions with known vulnerabilities are the main target of automated attacks.

### 3. As few plugins as possible

Every plugin is code written by someone else, and it may have problems. Keep only what you actually use and choose actively maintained plugins. I compared platforms from this angle too in [WordPress, Shopify or a custom website](/blog/wordpress-shopify-sau-site-personalizat).

### 4. Strong, unique passwords

- long passwords, different for each account;
- a password manager, so you don't have to remember them or write them down;
- never the same password for your website, email and hosting.

### 5. Two-factor authentication

Turn it on for your website panel, hosting, domain, email and payment processor account. Even if a password is stolen, the account stays protected.

### 6. Separate accounts for each person

Each employee or contractor has their own account, with the permissions they need and no more. Never a shared account with the password sent over WhatsApp.

### 7. Revoking access

When a contractor stops working with you, delete their account or change their permissions the same day. Check twice a year: who still has access, and why?

### 8. Automatic backups, stored separately

Backups must be automatic, regular and stored somewhere other than the website's server. Test a restore now and then. I explained the details in our guide to [website maintenance](/blog/mentenanta-site).

### 9. Protected forms

Contact forms are spam bots' favourite target. Protect them with:

- an invisible check or a simple bot test;
- a limit on submissions from the same address;
- validation of the data entered;
- only the necessary fields.

### 10. File uploads, handled carefully

If your website lets people upload files (CVs, documents, photos), limit the types and sizes and store them somewhere private, not publicly accessible.

### 11. A protected admin panel

- a non-default login address, where possible;
- limited login attempts;
- notifications for logins from new locations.

### 12. Trustworthy hosting

Good hosting has basic server-level protection, keeps its systems updated and separates websites from each other. I wrote about choosing hosting in our guide to [domain, hosting and professional email](/blog/domeniu-gazduire-email-profesional).

### 13. Monitoring

Alerts when the site goes down, when files change unexpectedly or when Google detects problems. Google Search Console sends you security notifications if it finds issues on your site.

### 14. Collecting less data

Data you don't collect can't be stolen. Ask only for what you need in forms, and regularly delete data you no longer need. It's also a GDPR requirement, explained in our guide to the [legal requirements for a website](/blog/obligatii-legale-site-romania).

### 15. Watch out for fake emails

Many attacks start with an email that seems to come from your host, domain registrar or bank, asking you to "confirm your account" via a link. Always check directly in your own account, not through the link in the email.

## A one-year security plan

So nothing gets forgotten, spread the measures over a simple calendar:

- **weekly**: check for available updates and monitoring alerts;
- **monthly**: apply updates after testing, check the forms, look at Google Search Console;
- **every three months**: test restoring a backup, review the plugin list and remove what you don't use;
- **twice a year**: check who has access to the website, hosting, domain and email and revoke what's no longer needed; change important passwords;
- **yearly**: check the domain expiry date, the hosting contract and the legal pages.

If you have a maintenance contract, most of these steps are done by the provider, and you just receive the report.

## What security costs

The good news: most basic measures cost very little or nothing. The HTTPS certificate is usually free, two-factor authentication is free, password managers come in affordable versions and automatic backups are included with many hosting plans. What actually costs money is someone's time to look after it consistently. That's why security is part of the maintenance package, which at MAVA Studio starts at 500 lei (about €100) a month, as shown on our [Pricing](/preturi) page.

## Payment security

If you take online payments, use the payment processor's secure page or forms, so card details never pass through your server. I explained how this works in our guide to [online payments for your store](/blog/plati-online-magazin).

## What to do if your website has been hacked

1. **stay calm** and don't delete anything in a hurry;
2. **change your passwords immediately** for the website, hosting, domain and email;
3. **tell your maintenance provider** or your host;
4. **restore the website** from a clean backup;
5. **apply the missing updates** and close the gap;
6. **check Google Search Console** and request a review if the site was flagged as dangerous;
7. **check whether personal data was exposed**: if so, GDPR requires you, under certain conditions, to notify the supervisory authority (in Romania, [ANSPDCP](https://www.dataprotection.ro/)) within 72 hours of becoming aware and, sometimes, to inform the people affected. Seek a lawyer's advice.

## Quick checklist

| Measure | Do you have it? |
|---|---|
| HTTPS on every page | |
| Updates applied in the last month | |
| Two-factor authentication on important accounts | |
| Separate accounts, no shared passwords | |
| Automatic backups, stored separately | |
| Spam-protected forms | |
| Only the plugins you need | |
| Monitoring and alerts | |
| You know who currently has access to the site | |

Every "no" is something worth fixing this week.

## Security reference guides

For those who want to go further, the [OWASP Top 10](https://owasp.org/www-project-top-ten/) project describes the most common categories of web application vulnerabilities. It's a technical guide, mainly useful for people who build websites and apps, but it shows the logic well: most problems come from a few repeated mistakes.

## Common mistakes

- **"I'm too small to be attacked."**
- **the same password everywhere**;
- **updates put off for months**;
- **dozens of plugins**, many unused;
- **backups only on the same server**;
- **former contractors still having access**;
- **unprotected forms** sending hundreds of spam messages;
- **clicking links in emails** asking you to "confirm your account".

## Example: a small website secured in an afternoon

A service company's business website, built a few years earlier, had: long-outdated plugins, a single admin account used by three people, no backups and a form receiving dozens of spam messages a day. In one afternoon:

1. we made a full backup, stored separately;
2. we updated the platform and plugins, after testing, and removed unused plugins;
3. we created separate accounts for each person, with two-factor authentication;
4. we protected the form against bots;
5. we enabled daily automatic backups and monitoring.

The spam almost completely disappeared, and the risk of a successful attack dropped dramatically.

## Security and your staff

Many incidents start with human error, not a sophisticated attack. A few habits worth sharing with everyone who has access to the website and company accounts:

- **don't share passwords** in chat or by email, not even with colleagues;
- **lock your computer** when you leave your desk;
- **don't use public Wi-Fi** to log into the website panel without a secure connection;
- **report any suspicious email** or message straight away, instead of ignoring it;
- **don't install plugins or software** on the website without the agreement of whoever handles maintenance;
- **use only up-to-date devices** to access important accounts.

A short 15-minute conversation with the team once a year prevents a lot of problems. Make it practical: show a real example of a fake email, explain how to check a link before clicking it, and agree on exactly who to tell when something looks suspicious. People who know what to look for become your first line of defence, rather than the weakest link.

## Frequently asked questions

### Why would anyone attack a small company's website?

Most attacks are automated and look for vulnerable websites, regardless of company size. Hacked websites are used for spam, hidden links, scam redirects or data theft.

### What's the most important security measure for a website?

There isn't just one, but the combination of regular updates, strong passwords with two-factor authentication and automatic backups stored separately protects against most problems.

### Is an HTTPS certificate enough?

No. HTTPS protects data in transit between the visitor and the website, but it doesn't protect the website from software vulnerabilities, weak passwords or old plugins. It's a necessary measure, but not a sufficient one.

### What do I do if my website has been hacked?

Change your passwords immediately, tell your maintenance provider or host, restore the website from a clean backup, apply the missing updates and check whether personal data was exposed. If it was, check your notification obligations under GDPR.

### How often should a website be updated?

Security updates should be applied as soon as possible after release, following a quick test. In practice, checking for available updates weekly, or at least monthly, is a good rhythm for most websites.

## Conclusion

Securing a small website doesn't take an IT department, just a few good habits kept up consistently: updates, good passwords with two-factor authentication, as few plugins and accounts as possible, backups stored separately and protected forms. They prevent most attacks and make any problem easy to fix.

If you'd like us to check your website, or to handle its maintenance and security, [write to us](/incepe-un-proiect) and we'll reply within 24 working hours. For a new website built securely from the start, see our [website development](/servicii/dezvoltare-website-uri) page.`,
  },
};

export default article;
