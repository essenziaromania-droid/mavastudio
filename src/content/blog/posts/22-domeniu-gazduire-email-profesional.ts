import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "domeniu-gazduire-email-profesional",
  category: "website",
  tags: ["domeniu", "găzduire", "hosting", "email profesional", "DNS"],
  ro: {
    title: "Domeniu, găzduire și email profesional: ghid simplu pentru afaceri",
    seoTitle: "Domeniu, găzduire și email profesional: ghid pentru firme",
    description: "Cum alegi domeniul site-ului, ce tip de găzduire îți trebuie, cum îți faci un email profesional pe domeniul firmei și ce setări (SPF, DKIM, DMARC) contează ca emailurile să nu ajungă în spam.",
    excerpt: "Domeniul, găzduirea și emailul profesional sunt fundația oricărei prezențe online. Iată cum le alegi corect, pe numele tău, și cum eviți problemele care apar abia peste câțiva ani.",
    content: `**Pe scurt:** domeniul este adresa site-ului (de exemplu firmata.ro) și trebuie înregistrat pe numele tău sau al firmei tale, nu al celui care îți face site-ul. Găzduirea este serverul pe care „locuiește” site-ul; pentru un site de prezentare îți trebuie o găzduire stabilă, cu copii de siguranță și certificat de securitate, iar pentru un magazin, una mai puternică. Emailul profesional (nume@firmata.ro) îți dă credibilitate și, ca să nu ajungă în spam, are nevoie de câteva setări tehnice: SPF, DKIM și DMARC.

Am preluat de multe ori site-uri ale căror domenii erau înregistrate pe numele unui fost colaborator care nu mai răspundea la telefon. Clientul plătise site-ul, dar nu avea controlul adresei. Am văzut și emailuri ale unor firme serioase care ajungeau sistematic în spam la clienți, pentru că nimeni nu configurase setările de bază. Sunt probleme simple, dar scumpe dacă nu le rezolvi de la început.

## Partea 1: domeniul

### Ce este un domeniu

Domeniul e adresa pe care o scriu oamenii ca să ajungă la site-ul tău: firmata.ro, firmata.com. Se plătește anual și se reînnoiește. Dacă uiți să-l reînnoiești, site-ul și emailurile se opresc, iar în timp domeniul poate fi înregistrat de altcineva.

### .ro sau .com?

- **.ro** e alegerea naturală pentru afacerile care lucrează în principal în România. Inspiră încredere clienților români. Domeniile .ro sunt administrate de [ROTLD](https://www.rotld.ro/) și se înregistrează prin registratori autorizați.
- **.com** e potrivit dacă lucrezi internațional sau vrei o adresă neutră.
- **Ambele**, dacă bugetul permite: înregistrezi .ro și .com, iar unul redirecționează spre celălalt. Așa nimeni nu-ți poate „lua” varianta neînregistrată.

### Cum alegi numele

- **scurt** și ușor de scris corect după ce l-ai auzit o dată;
- **fără cratime**, dacă se poate (oamenii le uită);
- **fără cifre** care pot fi scrise și în litere;
- **numele firmei sau al brandului**, nu o înșiruire de cuvinte cheie („cel-mai-bun-dentist-ploiesti.ro” arată neprofesionist);
- **verifică** dacă numele nu e marca înregistrată a altcuiva.

### Pe numele cui se înregistrează

Pe numele tău sau al firmei tale. Întotdeauna. Chiar dacă domeniul e cumpărat de cel care îți face site-ul, cere ca titularul să fie firma ta și să ai acces la contul în care e administrat. E poate cel mai important sfat din acest articol.

## Partea 2: găzduirea (hostingul)

### Ce este găzduirea

Găzduirea e serverul pe care stau fișierele și baza de date ale site-ului. Când cineva intră pe site, serverul îi trimite pagina. O găzduire slabă înseamnă un site lent sau care „pică” din când în când. Despre cât contează viteza am scris în ghidul despre [viteza site-ului](/blog/viteza-site-ului-core-web-vitals).

### Tipuri de găzduire, pe înțeles

| Tip | Pe scurt | Potrivit pentru |
|---|---|---|
| Găzduire partajată | împarți serverul cu multe alte site-uri | site-uri de prezentare mici, cu trafic redus |
| Server virtual (VPS) | o parte dedicată dintr-un server, cu resurse garantate | magazine online, site-uri cu trafic mai mare |
| Găzduire în cloud sau platforme moderne | resurse care se adaptează automat traficului | site-uri moderne, aplicații, magazine în creștere |
| Server dedicat | un server întreg doar pentru tine | proiecte mari, cerințe speciale |

### Ce trebuie să aibă o găzduire bună

- **copii de siguranță automate**, zilnice, păstrate mai multe zile;
- **certificat de securitate (HTTPS)** inclus; multe găzduiri folosesc certificate gratuite de la [Let's Encrypt](https://letsencrypt.org/);
- **servere apropiate** de vizitatorii tăi (în Europa, pentru un public din România);
- **suport tehnic** care răspunde rapid;
- **monitorizare și protecție** de bază împotriva atacurilor;
- **posibilitatea de a crește** resursele când crește site-ul.

### Cât costă

Pentru un site de prezentare, găzduirea costă de obicei câteva sute de lei pe an. Pentru un magazin online cu trafic constant, costul e mai mare, pentru că are nevoie de mai multe resurse. Prețul cel mai mic nu e întotdeauna cea mai bună alegere: un site care pică în ziua campaniei de reclame te costă mult mai mult decât diferența de preț.

## Partea 3: emailul profesional

### De ce contează

Un email de tipul firmata.ploiesti@gmail.com funcționează, dar transmite „afacere mică, poate temporară”. Un email de tipul contact@firmata.ro sau nume@firmata.ro arată profesionist, e legat de site și rămâne al firmei chiar dacă un angajat pleacă.

### Variante pentru emailul pe domeniu

1. **Emailul inclus în găzduire.** Ieftin sau gratuit, suficient pentru volume mici. Dezavantaj: dacă site-ul are o problemă, poate fi afectat și emailul.
2. **Servicii specializate de email** pentru firme (de exemplu suitele de birou ale marilor furnizori). Costă un abonament lunar per utilizator, dar au o fiabilitate foarte bună, filtre de spam bune și aplicații pentru telefon.
3. **Redirecționare.** Adresa nume@firmata.ro trimite mesajele într-o căsuță existentă. Simplu, dar limitat, mai ales la trimitere.

Pentru majoritatea firmelor care se bazează pe email în relația cu clienții, recomand un serviciu specializat de email, separat de găzduirea site-ului.

### SPF, DKIM și DMARC: setările care te scot din spam

Acestea sunt trei setări tehnice adăugate la domeniu, care le spun serviciilor de email că mesajele tale sunt legitime:

- **SPF** spune ce servere au voie să trimită emailuri în numele domeniului tău;
- **DKIM** adaugă o semnătură digitală fiecărui email, care dovedește că nu a fost modificat pe drum;
- **DMARC** spune ce să facă serverul destinatarului cu emailurile care nu trec verificările și îți poate trimite rapoarte.

Marii furnizori de email cer aceste setări din ce în ce mai strict, mai ales pentru cei care trimit multe mesaje. Fără ele, emailurile tale, inclusiv ofertele și facturile, pot ajunge în spam. Atenție: dacă trimiți emailuri și din alte programe (CRM, program de facturare, magazin online, newsletter), fiecare trebuie inclus în aceste setări.

## Partea 4: DNS, legătura dintre toate

DNS-ul e „cartea de telefon” a domeniului: spune unde e site-ul, unde e emailul și ce servicii au voie să trimită mesaje în numele tău. Câteva reguli:

- ai acces la setările DNS ale domeniului tău;
- notează undeva ce înregistrări există și pentru ce sunt;
- nu modifica nimic fără să știi exact ce face, pentru că o greșeală poate opri site-ul sau emailul;
- când schimbi găzduirea sau furnizorul de email, planifică mutarea astfel încât să nu pierzi mesaje.

## Ce trebuie să deții tu, nu furnizorul

Fă o listă și verifică dacă ai acces la toate:

1. contul în care e înregistrat domeniul (titular: tu sau firma ta);
2. contul de găzduire;
3. setările DNS;
4. contul de email profesional (ca administrator);
5. panoul de administrare al site-ului;
6. copiile de siguranță.

Furnizorul poate avea acces ca să lucreze, dar proprietarul trebuie să fii tu. Când schimbi furnizorul, schimbi și parolele.

## Securitatea conturilor: cum le protejezi

Conturile de domeniu, găzduire și email sunt ținte frecvente pentru atacuri, pentru că cine le controlează poate opri site-ul sau poate citi emailurile firmei. Câteva reguli simple:

- **autentificare în doi pași** activată pe toate conturile importante;
- **parole diferite și lungi** pentru fiecare cont, păstrate într-un manager de parole;
- **un email de recuperare** pe care îl controlezi și îl verifici;
- **acces separat pentru colaboratori**, cu conturi proprii, nu cu parola ta;
- **retragerea accesului** imediat ce un colaborator sau un angajat nu mai lucrează cu tine;
- **atenție la emailurile false** care pretind că domeniul expiră și cer plata pe un link necunoscut. Verifică întotdeauna direct în contul tău.

## Greșeli frecvente

- **Domeniul pe numele altcuiva.** Cea mai scumpă greșeală.
- **Reînnoirea uitată.** Activează reînnoirea automată și ține cardul actualizat.
- **Email pe Gmail personal** folosit pentru firmă.
- **Fără SPF, DKIM și DMARC.** Ofertele ajung în spam.
- **Găzduirea cea mai ieftină** pentru un magazin cu trafic mare.
- **Fără copii de siguranță** sau copii păstrate doar pe același server.
- **Parole comune** între domeniu, găzduire și email.

## Cum le rezolvăm când construim un site

Când facem un site la MAVA Studio, te ajutăm să înregistrezi domeniul pe numele firmei, alegem găzduirea potrivită tipului de site, configurăm certificatul de securitate, copiile de siguranță și, dacă vrei, emailul profesional cu SPF, DKIM și DMARC. Toate conturile rămân ale tale. Costurile domeniului și găzduirii sunt separate de prețul site-ului, așa cum am explicat în ghidul despre [cât costă un site de prezentare](/blog/cat-costa-un-website-pentru-afacerea-ta). Detalii pe pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri).

## Exemplu: cum ar trebui să arate configurarea pentru o firmă mică

Pentru o firmă de servicii cu trei angajați, o configurare sănătoasă ar fi:

- domeniul firmata.ro, cu titular firma, reînnoire automată, plus firmata.com redirecționat spre .ro;
- găzduire stabilă pentru site, cu copii de siguranță zilnice și certificat HTTPS;
- email profesional pentru fiecare angajat, plus o adresă comună contact@firmata.ro;
- SPF, DKIM și DMARC configurate pentru serviciul de email, CRM și programul de facturare;
- o listă cu toate conturile și accesul administratorului păstrată în siguranță.

Costul anual total pentru domeniu, găzduire și email e mic comparativ cu valoarea unei singure oferte pierdute în spam.

## Mutarea pe o găzduire nouă fără să pierzi nimic

Dacă vrei să schimbi găzduirea sau furnizorul de email, câțiva pași te feresc de surprize:

1. **fă o copie de siguranță completă** a site-ului și a bazei de date înainte de orice modificare;
2. **pregătește noua găzduire** și testează site-ul acolo înainte de a muta domeniul;
3. **notează toate înregistrările DNS** existente, inclusiv cele pentru email și pentru alte servicii;
4. **alege un moment liniștit** pentru mutare, nu în mijlocul unei campanii;
5. **mută emailul separat**, cu grijă, ca să nu pierzi mesajele din perioada de tranziție;
6. **verifică totul după mutare**: site-ul, formularele, emailurile trimise și primite, certificatul HTTPS.

## Întrebări frecvente

### Cât costă un domeniu .ro?

Un domeniu .ro costă, de obicei, în jur de 50–100 de lei pe an, în funcție de registrator. Prețul pentru primul an poate fi diferit de cel de reînnoire, așa că verifică ambele.

### Pe numele cui trebuie înregistrat domeniul?

Pe numele tău sau al firmei tale. Chiar dacă îl cumpără furnizorul site-ului, titularul trebuie să fii tu și trebuie să ai acces la contul în care e administrat domeniul.

### Am nevoie de email pe domeniul firmei?

E foarte recomandat. Un email de tipul nume@firmata.ro arată mai profesionist, e legat de brand și rămâne al firmei chiar dacă se schimbă angajații.

### Ce sunt SPF, DKIM și DMARC?

Sunt trei setări adăugate domeniului care demonstrează că emailurile tale sunt legitime. Fără ele, mesajele tale au mai multe șanse să ajungă în spam la destinatari.

### Ce găzduire îmi trebuie pentru un site de prezentare?

O găzduire stabilă, cu copii de siguranță automate, certificat HTTPS și servere în Europa e suficientă pentru majoritatea site-urilor de prezentare. Magazinele online cu trafic mare au nevoie de resurse mai mari.

## Concluzie

Domeniul, găzduirea și emailul nu sunt partea spectaculoasă a unui site, dar sunt fundația. Înregistrează domeniul pe numele tău, alege o găzduire stabilă cu copii de siguranță, folosește email pe domeniul firmei și configurează SPF, DKIM și DMARC. Și păstrează lista cu toate conturile.

Dacă vrei ca toate acestea să fie configurate corect de la început, [scrie-ne](/incepe-un-proiect). Pentru partea legală a site-ului, citește și ghidul despre [obligațiile legale ale unui site în România](/blog/obligatii-legale-site-romania).`,
  },
  en: {
    title: "Domain, hosting and professional email: a simple guide for businesses",
    seoTitle: "Domain, hosting and professional email: a guide for businesses",
    description: "How to choose your website's domain, what hosting you need, how to set up professional email on your company domain and which settings (SPF, DKIM, DMARC) keep your emails out of spam.",
    excerpt: "Your domain, hosting and professional email are the foundation of any online presence. Here's how to choose them properly, in your own name, and avoid problems that only show up years later.",
    content: `**In short:** the domain is your website's address (for example yourcompany.com) and must be registered in your name or your company's name, not in the name of whoever builds your website. Hosting is the server your website "lives" on; a business website needs stable hosting with backups and a security certificate, while an online store needs something more powerful. Professional email (name@yourcompany.com) gives you credibility and, to stay out of spam, needs a few technical settings: SPF, DKIM and DMARC.

I've often taken over websites whose domains were registered in the name of a former contractor who no longer answered the phone. The client had paid for the website but didn't control its address. I've also seen emails from perfectly serious companies landing in clients' spam folders every time, because nobody had configured the basic settings. These are simple problems, but expensive if you don't sort them out from the start.

## Part 1: the domain

### What a domain is

The domain is the address people type to reach your website: yourcompany.ro, yourcompany.com. It's paid yearly and renewed. If you forget to renew it, your website and email stop working, and over time someone else may register the domain.

### .ro, a country domain or .com?

- **A country domain** (such as .ro for Romania) is the natural choice for businesses that mainly work in one country. It inspires trust among local customers. Romanian .ro domains are managed by [ROTLD](https://www.rotld.ro/) and registered through accredited registrars.
- **.com** suits you if you work internationally or want a neutral address.
- **Both**, if your budget allows: register both, with one redirecting to the other. That way nobody can "take" the version you didn't register.

### How to choose the name

- **short** and easy to spell correctly after hearing it once;
- **no hyphens**, if possible (people forget them);
- **no numbers** that could also be written as words;
- **your company or brand name**, not a string of keywords ("best-dentist-in-town.com" looks unprofessional);
- **check** that the name isn't someone else's registered trademark.

### Whose name it's registered in

Yours, or your company's. Always. Even if the domain is bought by whoever builds your website, ask for your company to be the registrant and for access to the account where it's managed. It's probably the most important advice in this article.

## Part 2: hosting

### What hosting is

Hosting is the server where your website's files and database live. When someone visits your website, the server sends them the page. Poor hosting means a slow website, or one that goes down now and then. I wrote about why speed matters in our guide to [website speed](/blog/viteza-site-ului-core-web-vitals).

### Types of hosting, in plain language

| Type | In short | Suits |
|---|---|---|
| Shared hosting | you share the server with many other websites | small business websites with low traffic |
| Virtual private server (VPS) | a dedicated part of a server, with guaranteed resources | online stores, higher-traffic websites |
| Cloud hosting or modern platforms | resources that adapt automatically to traffic | modern websites, apps, growing stores |
| Dedicated server | a whole server just for you | large projects, special requirements |

### What good hosting should include

- **automatic daily backups**, kept for several days;
- **a security certificate (HTTPS)** included; many hosts use free certificates from [Let's Encrypt](https://letsencrypt.org/);
- **servers close** to your visitors (in Europe, for a European audience);
- **technical support** that responds quickly;
- **basic monitoring and protection** against attacks;
- **the ability to scale up** resources as your website grows.

### What it costs

For a business website, hosting usually costs a few hundred lei (roughly €50–€100) a year. For an online store with steady traffic, it costs more, because it needs more resources. The lowest price isn't always the best choice: a website that crashes on the day of your ad campaign costs you far more than the price difference.

## Part 3: professional email

### Why it matters

An address like yourcompany.city@gmail.com works, but it signals "small business, maybe temporary". An address like contact@yourcompany.com or name@yourcompany.com looks professional, is tied to your website and stays with the company even if an employee leaves.

### Options for email on your domain

1. **Email included with your hosting.** Cheap or free, enough for low volumes. The downside: if the website has a problem, email can be affected too.
2. **Specialised business email services** (for example the office suites of the big providers). They cost a monthly subscription per user, but offer very good reliability, good spam filters and phone apps.
3. **Forwarding.** The address name@yourcompany.com forwards messages to an existing inbox. Simple, but limited, especially for sending.

For most companies that rely on email with their clients, I recommend a specialised email service, separate from your website hosting.

### SPF, DKIM and DMARC: the settings that keep you out of spam

These are three technical settings added to your domain that tell email services your messages are legitimate:

- **SPF** says which servers are allowed to send email on behalf of your domain;
- **DKIM** adds a digital signature to every email, proving it wasn't altered along the way;
- **DMARC** tells the recipient's server what to do with emails that fail the checks, and can send you reports.

The big email providers are increasingly strict about these settings, especially for those who send a lot of messages. Without them, your emails, including quotes and invoices, can end up in spam. Watch out: if you also send emails from other tools (CRM, invoicing software, online store, newsletter), each of them must be included in these settings.

## Part 4: DNS, the link between everything

DNS is your domain's "phone book": it says where your website is, where your email is and which services may send messages on your behalf. A few rules:

- make sure you have access to your domain's DNS settings;
- write down which records exist and what they're for;
- don't change anything unless you know exactly what it does, because one mistake can take down your website or email;
- when you change hosting or email provider, plan the move so you don't lose messages.

## What you should own, not your provider

Make a list and check that you have access to all of these:

1. the account where the domain is registered (registrant: you or your company);
2. the hosting account;
3. the DNS settings;
4. the professional email account (as administrator);
5. the website's admin panel;
6. the backups.

Your provider can have access to do their work, but you must be the owner. When you change providers, change the passwords too.

## Account security: how to protect your accounts

Domain, hosting and email accounts are common targets for attacks, because whoever controls them can take your website down or read your company's email. A few simple rules:

- **two-factor authentication** turned on for every important account;
- **long, different passwords** for each account, stored in a password manager;
- **a recovery email** that you control and check;
- **separate access for contractors**, with their own accounts, not your password;
- **removing access** as soon as a contractor or employee stops working with you;
- **watch out for fake emails** claiming your domain is expiring and asking you to pay through an unfamiliar link. Always check directly in your own account.

## Common mistakes

- **The domain in someone else's name.** The most expensive mistake.
- **A forgotten renewal.** Turn on auto-renewal and keep your card details up to date.
- **A personal Gmail address** used for the business.
- **No SPF, DKIM or DMARC.** Your quotes end up in spam.
- **The cheapest hosting** for a high-traffic store.
- **No backups**, or backups kept only on the same server.
- **Shared passwords** across domain, hosting and email.

## How we handle it when we build a website

When we build a website at MAVA Studio, we help you register the domain in your company's name, choose hosting suited to the type of website, and set up the security certificate, backups and, if you like, professional email with SPF, DKIM and DMARC. All accounts stay yours. Domain and hosting costs are separate from the website price, as I explained in our guide on [how much a business website costs](/blog/cat-costa-un-website-pentru-afacerea-ta). Details on our [website development](/servicii/dezvoltare-website-uri) page.

## Example: what a small company's setup should look like

For a service company with three employees, a healthy setup would be:

- the domain yourcompany.ro, registered to the company, with auto-renewal, plus yourcompany.com redirecting to the .ro;
- stable hosting for the website, with daily backups and an HTTPS certificate;
- professional email for each employee, plus a shared contact@yourcompany.ro address;
- SPF, DKIM and DMARC configured for the email service, the CRM and the invoicing software;
- a list of all accounts and administrator access, kept somewhere safe.

The total yearly cost of domain, hosting and email is small compared with the value of a single quote lost in spam.

## Moving to new hosting without losing anything

If you want to change hosting or email provider, a few steps save you from surprises:

1. **make a full backup** of the website and database before changing anything;
2. **set up the new hosting** and test the website there before moving the domain;
3. **write down every existing DNS record**, including those for email and other services;
4. **choose a quiet moment** for the move, not the middle of a campaign;
5. **move email separately**, carefully, so you don't lose messages during the transition;
6. **check everything after the move**: the website, the forms, sent and received emails, the HTTPS certificate.

## Frequently asked questions

### How much does a .ro domain cost?

A .ro domain usually costs around 50–100 lei (€10–€20) a year, depending on the registrar. The first-year price can differ from the renewal price, so check both.

### Whose name should the domain be registered in?

Yours, or your company's. Even if your website provider buys it, you must be the registrant and have access to the account where the domain is managed.

### Do I need email on my company's domain?

It's highly recommended. An address like name@yourcompany.com looks more professional, is tied to your brand and stays with the company even if staff change.

### What are SPF, DKIM and DMARC?

They're three settings added to your domain that prove your emails are legitimate. Without them, your messages are more likely to land in recipients' spam folders.

### What hosting do I need for a business website?

Stable hosting with automatic backups, an HTTPS certificate and servers in Europe is enough for most business websites. High-traffic online stores need more resources.

## Conclusion

Your domain, hosting and email aren't the exciting part of a website, but they're the foundation. Register the domain in your own name, choose stable hosting with backups, use email on your company domain and configure SPF, DKIM and DMARC. And keep a list of all your accounts.

If you want all of this set up properly from the start, [write to us](/incepe-un-proiect). For the legal side of your website, also read our guide to the [legal requirements for a website in Romania](/blog/obligatii-legale-site-romania).`,
  },
};

export default article;
