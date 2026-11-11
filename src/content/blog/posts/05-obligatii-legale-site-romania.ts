import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "obligatii-legale-site-romania",
  category: "website",
  tags: ["GDPR", "cookie-uri", "ANPC", "legislație site", "politică de confidențialitate"],
  ro: {
    title: "Obligațiile legale ale unui site în România: GDPR, cookie-uri, ANPC și datele firmei",
    seoTitle: "Obligații legale pentru site-uri în România: ghid 2026",
    description: "Ce trebuie să conțină legal un site de firmă în România: datele de identificare, politica de confidențialitate, cookie-uri, termeni, ANPC SAL și accesibilitate.",
    excerpt: "Un ghid practic, fără limbaj juridic greoi, despre ce informații și pagini legale trebuie să aibă site-ul firmei tale în România și ce greșeli pot aduce amenzi.",
    content: `**Pe scurt:** un site de firmă în România trebuie să afișeze datele de identificare ale firmei (denumire, CUI, număr de la Registrul Comerțului, sediu, contact), să aibă o politică de confidențialitate conformă GDPR, să ceară consimțământul pentru cookie-urile care nu sunt strict necesare și, dacă vinde sau prestează servicii către consumatori, să aibă termeni și condiții și informarea despre soluționarea alternativă a litigiilor (ANPC SAL). Magazinele online au obligații în plus, despre care scriu într-un ghid separat.

Înainte de toate, o precizare: nu sunt avocat. Construiesc site-uri de ani buni și am pus în practică aceste cerințe pe zeci de pagini, inclusiv pe site-ul MAVA Studio. Articolul te ajută să înțelegi ce trebuie să ai și să pui întrebările potrivite. Pentru situații speciale (date medicale, minori, activități reglementate), consultă un jurist.

## De ce contează partea legală a site-ului

Mulți antreprenori lasă paginile legale „pentru mai târziu” sau copiază textele de pe alt site. E o greșeală din trei motive:

1. **Amenzi.** Autoritățile pot sancționa lipsa informațiilor obligatorii sau prelucrarea datelor fără temei legal.
2. **Încredere.** Un client atent verifică cine e în spatele site-ului înainte să lase datele sau să plătească.
3. **Protecție.** Termenii bine scriși te protejează pe tine în caz de dispută.

Vestea bună: pentru un site de prezentare, cerințele sunt clare și se rezolvă o singură dată, la construcție.

## 1. Datele de identificare ale firmei

Legea nr. 365/2002 privind comerțul electronic cere ca furnizorii de servicii online să ofere informații de identificare ușor accesibile, permanent și direct. În practică, pe site trebuie să apară:

- denumirea firmei (de exemplu „Exemplu S.R.L.”);
- codul unic de înregistrare (CUI);
- numărul de ordine din Registrul Comerțului;
- adresa sediului social;
- datele de contact: email și, ideal, telefon;
- codul de TVA, dacă firma e plătitoare de TVA;
- autorizațiile și organismul profesional, dacă activitatea e reglementată (de exemplu medici, avocați, arhitecți).

Unde le pui? Cel mai simplu e într-o pagină dedicată sau în paginile legale, cu link din subsolul site-ului. Nu e obligatoriu să apară pe prima pagină, dar trebuie să poată fi găsite ușor. Textul legii îl găsești pe [portalul legislativ](https://legislatie.just.ro/).

## 2. Politica de confidențialitate (GDPR)

Dacă site-ul colectează orice date personale, chiar și doar un nume și un email printr-un formular de contact, ai nevoie de o politică de confidențialitate. [Regulamentul General privind Protecția Datelor](https://eur-lex.europa.eu/eli/reg/2016/679/oj) cere să informezi oamenii, clar și pe înțeles, despre:

- cine prelucrează datele (firma ta, cu datele de contact);
- ce date colectezi (nume, email, telefon, mesajul trimis, date de navigare);
- de ce le colectezi și pe ce temei legal (de exemplu, pentru a răspunde la o cerere sau pentru executarea unui contract);
- cât timp le păstrezi;
- cui le transmiți (furnizorul de găzduire, serviciul de email, programul de facturare, platformele de analiză);
- dacă datele ajung în afara Uniunii Europene;
- ce drepturi au oamenii: acces, rectificare, ștergere, opoziție, portabilitate;
- dreptul de a face plângere la [Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)](https://www.dataprotection.ro/).

O politică de confidențialitate copiată de pe alt site e aproape întotdeauna greșită, pentru că descrie alte formulare, alte servicii și alte scopuri. Trebuie să descrie exact ce face site-ul tău.

## 3. Formularele de contact

Fiecare formular de pe site ar trebui să aibă:

- doar câmpurile de care ai nevoie efectiv (nu cere CNP-ul pentru o cerere de ofertă);
- un text scurt lângă butonul de trimitere, cu link spre politica de confidențialitate;
- o bifă separată, nebifată implicit, dacă vrei să trimiți și newslettere sau oferte comerciale.

Consimțământul pentru marketing nu se „ascunde” în acordul pentru a fi contactat. Sunt două lucruri diferite.

## 4. Cookie-urile și bannerul de consimțământ

Legea nr. 506/2004, care transpune directiva europeană privind viața privată în comunicațiile electronice, cere consimțământul vizitatorului înainte de a stoca cookie-uri care nu sunt strict necesare funcționării site-ului. În practică:

- **cookie-urile strict necesare** (de exemplu cele care țin minte alegerea despre cookie-uri sau coșul de cumpărături) pot fi folosite fără consimțământ;
- **cookie-urile de analiză și de marketing** (Google Analytics, Meta Pixel, TikTok Pixel) au nevoie de consimțământ înainte să fie activate;
- bannerul trebuie să ofere o alegere reală: „Accept” și „Refuz” la fel de vizibile, plus posibilitatea de a alege pe categorii;
- vizitatorul trebuie să-și poată schimba decizia ulterior, de exemplu dintr-un link „Setări cookies” din subsol.

Un banner care spune doar „Folosim cookie-uri. OK” nu e suficient dacă site-ul încarcă instrumente de analiză sau de reclame înainte de alegere.

## 5. Politica de cookie-uri

Pe lângă banner, ai nevoie de o pagină care explică:

- ce cookie-uri folosește site-ul, pe categorii;
- cine le setează (site-ul tău sau terți, precum Google sau Meta);
- cât timp rămân stocate;
- cum își poate retrage vizitatorul consimțământul.

Lista trebuie actualizată ori de câte ori adaugi un instrument nou pe site.

## 6. Termenii și condițiile

Termenii și condițiile stabilesc regulile de folosire a site-ului și, dacă vinzi sau prestezi servicii, condițiile comerciale. Pentru un site de prezentare, ele includ de obicei:

- cine deține site-ul și cum poate fi contactat;
- faptul că informațiile au caracter general și nu constituie o ofertă fermă (dacă e cazul);
- drepturile de autor asupra conținutului;
- limitarea răspunderii;
- legea aplicabilă și instanțele competente.

Pe site-ul nostru, de exemplu, termenii precizează că prețurile de pe pagina [Prețuri](/preturi) sunt prețuri de pornire și că relația contractuală se stabilește prin oferta și contractul semnate.

## 7. Informarea ANPC despre soluționarea litigiilor (SAL)

Comercianții care vând produse sau servicii către consumatori trebuie să informeze despre posibilitatea soluționării alternative a litigiilor. În România, Ordinul ANPC nr. 449/2022 cere ca site-urile comercianților să afișeze, vizibil, informarea și linkul către [platforma SAL a ANPC](https://reclamatiisal.anpc.ro/). Cel mai des, linkul e pus în subsolul site-ului, alături de linkul către [ANPC](https://www.anpc.ro/).

O precizare utilă: platforma europeană de soluționare online a litigiilor (SOL / ODR) a fost închisă în 2025, odată cu abrogarea regulamentului european care o crease. Dacă site-ul tău încă trimite către ea, merită actualizat. Verifică, oricum, cu un jurist cerințele la zi pentru domeniul tău.

## 8. Accesibilitatea

Legea nr. 232/2022, care transpune Actul european privind accesibilitatea, a introdus cerințe de accesibilitate pentru anumite produse și servicii, inclusiv comerțul electronic, aplicabile din iunie 2025. Microîntreprinderile care prestează servicii sunt, în general, exceptate, dar asta nu înseamnă că accesibilitatea nu contează.

Un site accesibil înseamnă: text suficient de mare și contrastant, imagini cu descriere alternativă, butoane care pot fi folosite și de la tastatură, formulare cu etichete clare. Ghidul internațional de referință este [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/). Pe lângă partea legală, un site accesibil e mai ușor de folosit pentru toată lumea și e mai bine înțeles de Google și de motoarele AI.

## 9. Prețurile afișate

Dacă afișezi prețuri, ele trebuie să fie clare, iar pentru consumatori prețul afișat trebuie să fie cel final. Dacă firma e plătitoare de TVA, prețul pentru consumatori include TVA. Dacă nu e plătitoare, e bine să precizezi asta, ca să nu existe confuzii. Costurile suplimentare (livrare, montaj, deplasare) trebuie anunțate înainte de comandă.

## 10. Drepturile de autor asupra conținutului

Pozele, textele și fonturile de pe site trebuie să fie ale tale sau folosite cu licență. Pozele „luate de pe Google” pot aduce notificări și cereri de despăgubire de la autori. Folosește fotografii proprii, imagini cumpărate cu licență sau imagini create special pentru tine.

## Lista de verificare rapidă

| Element | Site de prezentare | Magazin online |
|---|---|---|
| Datele firmei (denumire, CUI, Reg. Com., sediu) | Da | Da |
| Politica de confidențialitate | Da, dacă ai formulare sau analiză | Da |
| Banner cookie-uri cu alegere reală | Da, dacă ai cookie-uri neesențiale | Da |
| Politica de cookie-uri | Da | Da |
| Termeni și condiții | Recomandat | Da, obligatoriu în practică |
| Link ANPC și ANPC SAL | Da, dacă te adresezi consumatorilor | Da |
| Politica de retur și livrare | Nu | Da |
| Accesibilitate | Recomandat | Obligatoriu pentru unele firme |

## Greșeli frecvente

- **Copiezi paginile legale de pe alt site.** Descriu alte servicii, alte formulare și alte firme.
- **Pui Google Analytics sau Meta Pixel înainte de consimțământ.** E una dintre cele mai frecvente probleme.
- **Ai datele unei firme vechi.** Dacă ți-ai schimbat firma sau sediul, actualizează toate paginile legale.
- **Ceri prea multe date în formulare.** Fiecare câmp în plus e o dată personală în plus de protejat.
- **Uiți de actualizări.** Când adaugi un serviciu nou pe site (chat, programări, newsletter), politica de confidențialitate trebuie actualizată.

## Cât de des verifici partea legală a site-ului

Recomand o verificare rapidă de cel puțin două ori pe an și, obligatoriu, de fiecare dată când:

- schimbi datele firmei, sediul sau forma de organizare;
- adaugi pe site un instrument nou: chat, programări online, newsletter, pixel de reclame, hartă interactivă;
- începi să vinzi online sau să primești plăți;
- schimbi furnizorul de găzduire, de email sau de facturare;
- apar modificări în legislație pentru domeniul tău.

Verificarea durează puțin dacă ai o listă clară: deschizi fiecare formular, verifici ce instrumente se încarcă înainte de consimțământ, citești din nou politica de confidențialitate și compari cu ce face site-ul acum. Data ultimei actualizări ar trebui să apară în fiecare pagină legală.

## Cum le rezolvăm la MAVA Studio

Când construim un site, paginile legale fac parte din proiect: politica de confidențialitate, termenii, politica de cookie-uri, bannerul de consimțământ care blochează instrumentele de analiză până la alegerea vizitatorului și linkurile ANPC. Textele pornesc de la ce face concret site-ul tău, nu de la un șablon generic. Găsești detalii pe pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri), iar dacă vrei să știi ce costă un site complet, citește ghidul despre [prețul unui site de prezentare](/blog/cat-costa-un-website-pentru-afacerea-ta). Pentru datele clienților din spatele site-ului, un [CRM bine configurat](/blog/de-ce-ai-nevoie-de-un-crm) te ajută să respecți GDPR mult mai ușor decât un Excel.

## Întrebări frecvente

### Este obligatorie politica de confidențialitate pe un site de prezentare?

Da, dacă site-ul colectează date personale, de exemplu printr-un formular de contact, sau folosește instrumente de analiză și marketing. GDPR cere să informezi vizitatorii despre ce date colectezi, de ce, cât timp le păstrezi și ce drepturi au.

### Ce date ale firmei trebuie să apară pe site?

Denumirea firmei, codul unic de înregistrare (CUI), numărul de la Registrul Comerțului, sediul social și datele de contact, conform Legii nr. 365/2002. Dacă firma e plătitoare de TVA și dacă activitatea e reglementată, se adaugă codul de TVA și informațiile despre autorizații.

### Am nevoie de banner de cookie-uri?

Da, dacă site-ul folosește cookie-uri care nu sunt strict necesare, cum sunt cele de analiză sau de reclame. Bannerul trebuie să ceară consimțământul înainte de activarea lor și să ofere o alegere reală între acceptare și refuz.

### Trebuie să pun linkul ANPC SAL pe site?

Dacă vinzi produse sau servicii către consumatori, da. Ordinul ANPC nr. 449/2022 cere afișarea informării și a linkului către platforma SAL a ANPC, de obicei în subsolul site-ului.

### Pot folosi textele legale de pe alt site?

Nu e recomandat. Pe lângă problema drepturilor de autor, textele descriu de obicei alte formulare, alte servicii și alte prelucrări de date, deci nu te protejează corect.

## Concluzie

Partea legală a unui site nu e complicată, dar trebuie făcută corect, o singură dată, și actualizată când se schimbă ceva. Datele firmei, politica de confidențialitate, cookie-urile cu consimțământ real, termenii și linkurile ANPC sunt minimul pentru orice site serios din România.

Dacă vrei un site care pornește corect și din punct de vedere legal, [scrie-ne](/incepe-un-proiect) și îți răspundem în 24 de ore lucrătoare.`,
  },
  en: {
    title: "Legal requirements for a business website in Romania: GDPR, cookies, ANPC and company details",
    seoTitle: "Legal requirements for websites in Romania: 2026 guide",
    description: "What a business website in Romania must legally include: company identification, privacy policy, cookies, terms, ANPC dispute resolution links and accessibility.",
    excerpt: "A practical guide, without heavy legal jargon, to the information and legal pages your company website in Romania needs, and the mistakes that can lead to fines.",
    content: `**In short:** a company website in Romania must show the company's identification details (name, tax ID, Trade Register number, registered office, contact details), have a GDPR-compliant privacy policy, ask for consent for cookies that aren't strictly necessary and, if it sells products or services to consumers, have terms and conditions and information about alternative dispute resolution (ANPC SAL). Online stores have extra obligations, which I cover in a separate guide.

First, a clarification: I'm not a lawyer. I've been building websites for years and I've put these requirements into practice on dozens of pages, including the MAVA Studio website. This article helps you understand what you need and ask the right questions. For special situations (medical data, minors, regulated professions), consult a lawyer.

The article focuses on Romanian law, but most of it (GDPR, cookie consent, accessibility) applies across the European Union.

## Why the legal side of your website matters

Many business owners leave the legal pages "for later" or copy text from another website. That's a mistake for three reasons:

1. **Fines.** Authorities can penalise missing mandatory information or processing data without a legal basis.
2. **Trust.** A careful customer checks who is behind a website before leaving their details or paying.
3. **Protection.** Well-written terms protect you in a dispute.

The good news: for a business website, the requirements are clear and are sorted out once, when the site is built.

## 1. Company identification details

Romanian Law no. 365/2002 on electronic commerce requires online service providers to make identification information easily, directly and permanently accessible. In practice, your website must show:

- the company name (for example "Example S.R.L.");
- the unique registration code (CUI, the Romanian tax ID);
- the Trade Register number;
- the registered office address;
- contact details: email and, ideally, phone;
- the VAT number, if the company is VAT-registered;
- licences and the professional body, if the activity is regulated (for example doctors, lawyers, architects).

Where do you put them? The simplest option is a dedicated page or the legal pages, linked from the website footer. They don't have to appear on the home page, but they must be easy to find. You can read the law on the official Romanian [legislation portal](https://legislatie.just.ro/).

## 2. The privacy policy (GDPR)

If your website collects any personal data, even just a name and email through a contact form, you need a privacy policy. The [General Data Protection Regulation](https://eur-lex.europa.eu/eli/reg/2016/679/oj) requires you to tell people, clearly and in plain language:

- who processes the data (your company, with contact details);
- what data you collect (name, email, phone, the message sent, browsing data);
- why you collect it and on what legal basis (for example, to answer an enquiry or to perform a contract);
- how long you keep it;
- who you share it with (hosting provider, email service, invoicing software, analytics platforms);
- whether data leaves the European Union;
- what rights people have: access, rectification, erasure, objection, portability;
- the right to complain to the supervisory authority, which in Romania is [ANSPDCP](https://www.dataprotection.ro/).

A privacy policy copied from another website is almost always wrong, because it describes other forms, other services and other purposes. It has to describe exactly what your website does.

## 3. Contact forms

Every form on your website should have:

- only the fields you actually need (don't ask for a national ID number for a quote request);
- a short note next to the submit button, linking to the privacy policy;
- a separate checkbox, unticked by default, if you also want to send newsletters or commercial offers.

Consent for marketing can't be "hidden" inside consent to be contacted. They are two different things.

## 4. Cookies and the consent banner

Romanian Law no. 506/2004, which transposes the EU ePrivacy Directive, requires visitors' consent before storing cookies that aren't strictly necessary for the website to work. In practice:

- **strictly necessary cookies** (for example those that remember the cookie choice or the shopping cart) can be used without consent;
- **analytics and marketing cookies** (Google Analytics, Meta Pixel, TikTok Pixel) need consent before they are activated;
- the banner must offer a real choice: "Accept" and "Reject" equally visible, plus the option to choose by category;
- visitors must be able to change their decision later, for example from a "Cookie settings" link in the footer.

A banner that just says "We use cookies. OK" isn't enough if the website loads analytics or ad tools before the visitor chooses.

## 5. The cookie policy

Alongside the banner, you need a page that explains:

- which cookies the website uses, by category;
- who sets them (your website or third parties such as Google or Meta);
- how long they are stored;
- how visitors can withdraw their consent.

The list has to be updated whenever you add a new tool to your website.

## 6. Terms and conditions

Terms and conditions set the rules for using the website and, if you sell products or services, the commercial conditions. For a business website they usually cover:

- who owns the website and how to contact them;
- that the information is general and isn't a binding offer (where that applies);
- copyright over the content;
- limitation of liability;
- the governing law and competent courts.

On our own website, for example, the terms state that the prices on the [Pricing](/preturi) page are starting prices and that the contractual relationship is set by the signed proposal and contract.

## 7. The ANPC dispute resolution notice (SAL)

Businesses selling products or services to consumers must inform them about alternative dispute resolution. In Romania, ANPC Order no. 449/2022 requires merchants' websites to display the notice and a visible link to the [ANPC SAL platform](https://reclamatiisal.anpc.ro/). Most often the link sits in the website footer, next to a link to [ANPC](https://www.anpc.ro/), the national consumer protection authority.

A useful update: the European online dispute resolution platform (ODR) was closed in 2025, when the EU regulation that created it was repealed. If your website still links to it, it's worth updating. In any case, check the current requirements for your sector with a lawyer.

## 8. Accessibility

Romanian Law no. 232/2022, which transposes the European Accessibility Act, introduced accessibility requirements for certain products and services, including e-commerce, applicable from June 2025. Micro-enterprises providing services are generally exempt, but that doesn't mean accessibility doesn't matter.

An accessible website means: text that is large and contrasting enough, images with alternative descriptions, buttons that work from the keyboard, forms with clear labels. The international reference guideline is [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/). Beyond the legal side, an accessible website is easier for everyone to use and better understood by Google and AI search engines.

## 9. Displayed prices

If you show prices, they must be clear, and for consumers the displayed price must be the final price. If your company is VAT-registered, consumer prices include VAT. If it isn't, it's good practice to say so, to avoid confusion. Extra costs (delivery, installation, travel) must be stated before the order is placed.

## 10. Copyright over content

The photos, copy and fonts on your website must be yours or used under licence. Photos "taken from Google" can lead to notices and compensation claims from their authors. Use your own photographs, images bought with a licence or images created specifically for you.

## Quick checklist

| Item | Business website | Online store |
|---|---|---|
| Company details (name, tax ID, Trade Register no., office) | Yes | Yes |
| Privacy policy | Yes, if you have forms or analytics | Yes |
| Cookie banner with a real choice | Yes, if you use non-essential cookies | Yes |
| Cookie policy | Yes | Yes |
| Terms and conditions | Recommended | Yes, in practice mandatory |
| ANPC and ANPC SAL links | Yes, if you serve consumers | Yes |
| Returns and delivery policy | No | Yes |
| Accessibility | Recommended | Mandatory for some businesses |

## Common mistakes

- **Copying legal pages from another website.** They describe other services, other forms and other companies.
- **Loading Google Analytics or Meta Pixel before consent.** One of the most common problems.
- **Showing an old company's details.** If you changed company or registered office, update every legal page.
- **Asking for too much data in forms.** Every extra field is one more piece of personal data to protect.
- **Forgetting updates.** When you add a new service to your website (chat, bookings, newsletter), the privacy policy has to be updated.

## How often to review the legal side of your website

I recommend a quick review at least twice a year and, without fail, every time you:

- change your company details, registered office or legal form;
- add a new tool to your website: chat, online bookings, a newsletter, an ad pixel, an interactive map;
- start selling online or taking payments;
- change your hosting, email or invoicing provider;
- see changes in the legislation for your sector.

The review is quick if you have a clear checklist: open every form, check which tools load before consent, reread the privacy policy and compare it with what the website does now. The date of the last update should appear on every legal page.

## How we handle it at MAVA Studio

When we build a website, the legal pages are part of the project: privacy policy, terms, cookie policy, a consent banner that blocks analytics tools until the visitor chooses, and the ANPC links. The text starts from what your website actually does, not from a generic template. You'll find details on the [website development](/servicii/dezvoltare-website-uri) page, and if you want to know what a complete website costs, read our guide on [business website prices](/blog/cat-costa-un-website-pentru-afacerea-ta). For the client data behind your website, a [well-configured CRM](/blog/de-ce-ai-nevoie-de-un-crm) makes GDPR compliance much easier than a spreadsheet.

## Frequently asked questions

### Is a privacy policy mandatory on a business website?

Yes, if the website collects personal data, for example through a contact form, or uses analytics and marketing tools. GDPR requires you to tell visitors what data you collect, why, how long you keep it and what rights they have.

### Which company details must appear on a Romanian website?

The company name, the unique registration code (CUI), the Trade Register number, the registered office and contact details, under Law no. 365/2002. If the company is VAT-registered or the activity is regulated, the VAT number and licence information are added.

### Do I need a cookie banner?

Yes, if your website uses cookies that aren't strictly necessary, such as analytics or advertising cookies. The banner must ask for consent before they are activated and offer a real choice between accepting and rejecting.

### Do I have to add the ANPC SAL link to my website?

If you sell products or services to consumers in Romania, yes. ANPC Order no. 449/2022 requires the notice and the link to the ANPC SAL platform to be displayed, usually in the website footer.

### Can I reuse legal text from another website?

It isn't recommended. Besides the copyright issue, the text usually describes other forms, other services and other data processing, so it doesn't protect you properly.

## Conclusion

The legal side of a website isn't complicated, but it has to be done properly, once, and updated whenever something changes. Company details, a privacy policy, cookies with real consent, terms and the ANPC links are the minimum for any serious website in Romania.

If you want a website that starts off right legally as well, [write to us](/incepe-un-proiect) and we'll reply within 24 working hours.`,
  },
};

export default article;
