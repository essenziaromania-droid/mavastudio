import type { FileArticle } from "../types";

const article: FileArticle = {
  slug: "viteza-site-ului-core-web-vitals",
  category: "website",
  tags: ["viteză site", "Core Web Vitals", "PageSpeed", "optimizare", "SEO tehnic"],
  ro: {
    title: "Viteza site-ului: de ce contează, cum o măsori și cum o îmbunătățești",
    seoTitle: "Viteza site-ului și Core Web Vitals: ghid pe înțeles",
    description: "De ce contează viteza site-ului pentru clienți și Google, ce sunt Core Web Vitals (LCP, INP, CLS), cum le măsori gratuit și ce poți face concret ca site-ul să se încarce repede.",
    excerpt: "Un site lent pierde clienți înainte ca aceștia să vadă ce oferi. Iată, pe înțelesul oricui, cum măsori viteza, ce înseamnă scorurile și ce schimbări fac cea mai mare diferență.",
    content: `**Pe scurt:** viteza site-ului contează pentru că oamenii pleacă de pe paginile care se încarcă greu, mai ales pe telefon, și pentru că Google folosește experiența paginii, inclusiv indicatorii Core Web Vitals, printre semnalele de clasare. Cele trei măsurători principale sunt LCP (cât de repede apare conținutul principal, ideal sub 2,5 secunde), INP (cât de repede reacționează pagina la un click, ideal sub 200 de milisecunde) și CLS (cât de stabilă e pagina, fără elemente care sar, ideal sub 0,1). Cele mai frecvente cauze ale unui site lent sunt imaginile prea mari, temele și extensiile încărcate, scripturile externe și găzduirea slabă.

Când analizez un site care „nu aduce clienți”, viteza e printre primele lucruri pe care le verific. De multe ori găsesc imagini de 5 MB pe prima pagină, zece scripturi de urmărire și o temă cumpărată care încarcă funcții pe care site-ul nici nu le folosește. Vestea bună: majoritatea problemelor de viteză se rezolvă clar și măsurabil.

## De ce contează viteza

### Pentru clienți

Oamenii au răbdare puțină, mai ales pe telefon și pe o conexiune mobilă. Dacă pagina se încarcă greu, apasă „înapoi” și aleg următorul rezultat. Pentru un magazin online, fiecare secundă în plus la încărcare înseamnă mai puține comenzi. Pentru un site de prezentare, înseamnă mai puține cereri.

### Pentru Google

Google a explicat că folosește semnale legate de experiența paginii, inclusiv Core Web Vitals, în sistemele de clasare. Viteza singură nu te duce pe primul loc dacă pagina nu e relevantă, dar, între două pagini la fel de bune, cea mai rapidă și mai stabilă are un avantaj. Detalii găsești pe [web.dev, ghidul Google despre Core Web Vitals](https://web.dev/articles/vitals).

### Pentru motoarele de căutare cu AI

Paginile care se încarcă repede și au conținutul principal în text, nu ascuns în scripturi grele, sunt mai ușor de citit și de roboții motoarelor AI. Despre asta am scris în ghidul despre [GEO](/blog/geo-cum-apari-in-chatgpt-si-google-ai).

## Ce sunt Core Web Vitals, pe înțeles

| Indicator | Ce măsoară | Valoare bună |
|---|---|---|
| LCP (Largest Contentful Paint) | cât durează până apare elementul principal al paginii (de obicei o imagine mare sau titlul) | sub 2,5 secunde |
| INP (Interaction to Next Paint) | cât de repede reacționează pagina când apeși un buton sau un link | sub 200 de milisecunde |
| CLS (Cumulative Layout Shift) | cât de mult „sar” elementele în timp ce pagina se încarcă | sub 0,1 |

**LCP** e momentul în care omul simte că pagina „s-a încărcat”. **INP** e senzația că site-ul răspunde sau că „se blochează”. **CLS** e momentul enervant în care vrei să apeși pe un buton și, exact atunci, se încarcă o imagine și butonul se mută.

## Cum măsori gratuit viteza site-ului

### PageSpeed Insights

Intră pe [PageSpeed Insights](https://pagespeed.web.dev/), pune adresa paginii și apasă „Analizează”. Primești:

- **datele din teren**, dacă site-ul are suficient trafic: cum au experimentat site-ul vizitatorii reali în ultimele săptămâni;
- **analiza de laborator**: un test simulat, cu un scor de la 0 la 100 și o listă de recomandări.

Uită-te întâi la rezultatele pentru **telefon**, nu pentru desktop. Acolo apar de obicei problemele.

### Google Search Console

În [Search Console](https://search.google.com/search-console/about), raportul despre Core Web Vitals îți arată ce pagini ale site-ului au probleme, grupate pe tipuri. E util pentru site-uri cu multe pagini, cum sunt magazinele online.

### Testul simplu

Deschide site-ul pe telefonul tău, pe date mobile, nu pe Wi-Fi. Numără cât durează până vezi ceva util. Dacă ai timp să te plictisești, e prea lent.

## Cele mai frecvente cauze ale unui site lent

1. **Imagini prea mari.** O fotografie direct din aparat sau telefon poate avea câțiva MB. Pe site, aceeași imagine poate avea de zeci de ori mai puțin fără diferență vizibilă.
2. **Formate vechi de imagine.** Formatele moderne, precum WebP sau AVIF, sunt mult mai mici decât JPG sau PNG la aceeași calitate.
3. **Teme încărcate.** Temele „care fac de toate” încarcă cod pentru funcții pe care nu le folosești.
4. **Prea multe extensii (pluginuri).** Fiecare adaugă cod și cereri suplimentare.
5. **Scripturi externe.** Chat-uri, pixeli de reclame, widgeturi sociale, hărți, fonturi externe. Fiecare are un cost.
6. **Găzduire slabă.** Un server lent sau supraîncărcat întârzie totul, înainte ca pagina să înceapă să se încarce.
7. **Lipsa cache-ului.** Paginile sunt generate de la zero la fiecare vizită.
8. **Clipuri video încărcate direct pe pagină**, fără să fie optimizate.

## Ce poți face concret, în ordinea impactului

### 1. Optimizează imaginile

- redimensionează-le la dimensiunea la care sunt afișate efectiv;
- comprimă-le și folosește formate moderne (WebP sau AVIF);
- folosește încărcarea întârziată (lazy loading) pentru imaginile care nu sunt vizibile la început;
- **nu** încărca întârziat imaginea principală de sus, pentru că asta înrăutățește LCP.

Doar acest pas rezolvă, de multe ori, cea mai mare parte a problemelor.

### 2. Elimină ce nu folosești

Fă o listă cu toate extensiile, scripturile și widgeturile de pe site. Pentru fiecare întreabă: „Aduce ceva concret?” Dacă nu, scoate-l.

### 3. Încarcă scripturile externe inteligent

Pixelii de reclame, instrumentele de analiză și chat-urile pot fi încărcate după ce pagina e afișată sau doar după ce vizitatorul își dă acordul pentru cookie-uri. Ultimul aspect e și o cerință legală, explicată în ghidul despre [obligațiile legale ale unui site](/blog/obligatii-legale-site-romania).

### 4. Rezervă spațiu pentru imagini și reclame

Ca să reduci CLS, fiecare imagine și fiecare element care se încarcă mai târziu trebuie să aibă spațiul rezervat în pagină. Așa, restul conținutului nu se mai mută.

### 5. Fonturile

Folosește cât mai puține fonturi și grosimi. Ideal, găzduite pe site-ul tău, nu încărcate de pe alt server la fiecare vizită.

### 6. Găzduirea și cache-ul

O găzduire bună, cu servere aproape de vizitatorii tăi și cu cache activat, poate reduce semnificativ timpul de încărcare. Pentru magazinele online, unde trafic mare și multe pagini se combină, diferența e și mai mare. Am vorbit despre costurile găzduirii în ghidul despre [cât costă un magazin online](/blog/cat-costa-un-magazin-online).

### 7. Videoclipurile

Nu încărca un clip video mare direct pe prima pagină. Folosește o imagine de previzualizare și încarcă videoclipul doar când omul apasă „play”, sau găzduiește-l pe o platformă specializată.

## Cum citești un raport PageSpeed fără să te sperii

Raportul are multe recomandări în engleză și termeni tehnici, dar le poți ordona ușor:

- **începe cu datele din teren**, dacă există: ele arată experiența reală a vizitatorilor, nu un test simulat;
- **uită-te la cele trei culori**: verde înseamnă bine, portocaliu înseamnă că poate fi îmbunătățit, roșu înseamnă că e o problemă;
- **citește recomandările de sus**: sunt ordonate după cât timp ar economisi;
- **caută cuvintele „image”, „unused” și „third-party”**: de obicei arată spre imagini mari, cod nefolosit și scripturi externe, adică exact cauzele cele mai frecvente.

Nu e nevoie să rezolvi toate recomandările. Primele 3–4 aduc, de cele mai multe ori, cea mai mare parte a îmbunătățirii.

## Cât de rapid trebuie să fie site-ul

Ținta practică: toți cei trei indicatori Core Web Vitals în zona „bună” pentru majoritatea vizitatorilor, pe telefon. Scorul de la 0 la 100 din PageSpeed Insights e util ca reper, dar nu e un scop în sine. Un site cu scor 85, care se simte rapid și convertește bine, e mai valoros decât unul cu scor 100 fără conținut util.

## Site construit de la zero vs. site reparat

Dacă site-ul are deja o temă foarte încărcată și zeci de extensii, uneori optimizările au o limită. Poți ajunge la un punct în care fiecare îmbunătățire mică cere mult timp. În acel moment, merită să compari costul reparațiilor cu costul unui site construit corect de la început. Când construim un site la MAVA Studio, viteza e gândită de la primul rând de cod: imagini optimizate automat, fără teme încărcate, fără scripturi inutile, cu cache și găzduire potrivite. Detalii pe pagina de [dezvoltare website-uri](/servicii/dezvoltare-website-uri).

## Greșeli frecvente

- **Te uiți doar la scorul de pe desktop.** Majoritatea vizitatorilor sunt pe telefon.
- **Instalezi o extensie de „optimizare”** peste alte zece extensii. Rezolvi un simptom, nu cauza.
- **Încarci imaginea principală întârziat.** Înrăutățești exact indicatorul principal.
- **Adaugi un script nou la fiecare campanie** și nu-l mai scoți niciodată.
- **Alegi găzduirea cea mai ieftină** pentru un magazin cu trafic mare.
- **Testezi o singură dată.** Viteza se schimbă cu fiecare imagine, extensie sau script nou.

## Exemplu: un site de prezentare de la lent la rapid

Un site de prezentare pentru o firmă de construcții avea pe prima pagină un slider cu cinci imagini mari, un clip video care pornea automat, trei fonturi diferite și scripturi de la patru servicii externe. Pe telefon, conținutul principal apărea foarte greu. Ce am schimbat:

1. am înlocuit sliderul cu o singură imagine bine optimizată;
2. clipul video a primit o imagine de previzualizare și se încarcă doar la apăsare;
3. am redus fonturile la unul singur, în două grosimi, găzduit pe site;
4. am eliminat două scripturi nefolosite și am amânat încărcarea celorlalte până după consimțământ;
5. am comprimat și convertit toate imaginile în format modern.

Site-ul a arătat la fel de bine, dar s-a încărcat mult mai repede pe telefon, iar indicatorii Core Web Vitals au intrat în zona bună.

## Cât de des verifici viteza

Recomand o verificare rapidă lunară și una mai atentă de fiecare dată când:

- adaugi o secțiune nouă cu imagini sau clipuri;
- instalezi o extensie sau un script nou (chat, pixel, widget);
- schimbi tema, găzduirea sau designul;
- pornești o campanie de reclame care va aduce mult trafic.

O verificare durează câteva minute și te scutește de surpriza unei campanii plătite care trimite oameni pe un site prea lent.

## Întrebări frecvente

### Ce sunt Core Web Vitals?

Core Web Vitals sunt trei indicatori definiți de Google pentru experiența paginii: LCP, care măsoară cât de repede apare conținutul principal, INP, care măsoară cât de repede reacționează pagina la interacțiuni, și CLS, care măsoară cât de stabilă rămâne pagina în timpul încărcării.

### Cât de repede ar trebui să se încarce un site?

Ca reper, conținutul principal ar trebui să apară în mai puțin de 2,5 secunde pentru majoritatea vizitatorilor, inclusiv pe telefon. Pagina trebuie să reacționeze la click în mai puțin de 200 de milisecunde și să nu aibă elemente care sar.

### Influențează viteza poziția în Google?

Da, experiența paginii, inclusiv Core Web Vitals, face parte din semnalele folosite de Google. Viteza nu compensează lipsa de relevanță, dar între pagini la fel de bune, cea mai rapidă are un avantaj, iar vizitatorii rămân mai mult pe ea.

### Cum îmi testez gratuit viteza site-ului?

Cu PageSpeed Insights, unde introduci adresa paginii și primești un raport pentru telefon și desktop, și cu raportul Core Web Vitals din Google Search Console, care arată problemele pe tot site-ul.

### Care e cea mai rapidă îmbunătățire pe care o pot face?

De cele mai multe ori, optimizarea imaginilor: redimensionarea, comprimarea și folosirea formatelor moderne. Apoi eliminarea extensiilor și scripturilor nefolosite.

## Concluzie

Viteza nu e un detaliu tehnic, ci prima impresie a site-ului tău. Măsoar-o pe telefon, începe cu imaginile, elimină ce nu folosești și încarcă scripturile externe cu cap. Un site rapid ține oamenii pe pagină, convinge mai ușor și e preferat și de Google.

Dacă vrei să știi cât de rapid e site-ul tău și ce l-ar face mai rapid, [scrie-ne](/incepe-un-proiect). Iar dacă îți faci un site nou, citește și ghidul despre [ce trebuie să conțină un site de prezentare](/blog/ce-trebuie-sa-contina-un-site-de-prezentare).`,
  },
  en: {
    title: "Website speed: why it matters, how to measure it and how to improve it",
    seoTitle: "Website speed and Core Web Vitals: a plain-language guide",
    description: "Why website speed matters to customers and Google, what Core Web Vitals (LCP, INP, CLS) are, how to measure them for free and what you can do to make your site load fast.",
    excerpt: "A slow website loses customers before they see what you offer. Here's, in plain language, how to measure speed, what the scores mean and which changes make the biggest difference.",
    content: `**In short:** website speed matters because people leave pages that load slowly, especially on phones, and because Google uses page experience, including Core Web Vitals, among its ranking signals. The three main metrics are LCP (how quickly the main content appears, ideally under 2.5 seconds), INP (how quickly the page responds to a click, ideally under 200 milliseconds) and CLS (how stable the page is, with nothing jumping around, ideally under 0.1). The most common causes of a slow website are oversized images, heavy themes and plugins, external scripts and poor hosting.

When I review a website that "doesn't bring in customers", speed is one of the first things I check. I often find 5 MB images on the home page, ten tracking scripts and a bought theme loading features the site doesn't even use. The good news: most speed problems can be fixed in a clear, measurable way.

## Why speed matters

### For customers

People have little patience, especially on phones and mobile connections. If a page loads slowly, they tap "back" and pick the next result. For an online store, every extra second of loading means fewer orders. For a business website, it means fewer enquiries.

### For Google

Google has explained that it uses page experience signals, including Core Web Vitals, in its ranking systems. Speed alone won't put you first if the page isn't relevant, but between two equally good pages, the faster and more stable one has an advantage. You'll find details on [web.dev, Google's guide to Core Web Vitals](https://web.dev/articles/vitals).

### For AI search engines

Pages that load quickly and have their main content as text, not hidden behind heavy scripts, are also easier for AI engines' bots to read. I wrote about this in our guide to [GEO](/blog/geo-cum-apari-in-chatgpt-si-google-ai).

## What Core Web Vitals are, in plain language

| Metric | What it measures | Good value |
|---|---|---|
| LCP (Largest Contentful Paint) | how long until the page's main element appears (usually a large image or the headline) | under 2.5 seconds |
| INP (Interaction to Next Paint) | how quickly the page responds when you tap a button or link | under 200 milliseconds |
| CLS (Cumulative Layout Shift) | how much elements "jump" while the page loads | under 0.1 |

**LCP** is the moment a person feels the page "has loaded". **INP** is the feeling that the site responds, or that it "freezes". **CLS** is that annoying moment when you're about to tap a button and, right then, an image loads and the button moves.

## How to measure your website's speed for free

### PageSpeed Insights

Go to [PageSpeed Insights](https://pagespeed.web.dev/), enter the page address and click "Analyse". You get:

- **field data**, if the site has enough traffic: how real visitors experienced the site over recent weeks;
- **lab analysis**: a simulated test, with a score from 0 to 100 and a list of recommendations.

Look at the **mobile** results first, not desktop. That's where problems usually show up.

### Google Search Console

In [Search Console](https://search.google.com/search-console/about), the Core Web Vitals report shows which pages on your site have problems, grouped by type. It's useful for sites with many pages, such as online stores.

### The simple test

Open your website on your phone, on mobile data, not Wi-Fi. Count how long it takes before you see something useful. If you have time to get bored, it's too slow.

## The most common causes of a slow website

1. **Oversized images.** A photo straight from a camera or phone can be several MB. On a website, the same image can be dozens of times smaller with no visible difference.
2. **Old image formats.** Modern formats such as WebP or AVIF are much smaller than JPG or PNG at the same quality.
3. **Heavy themes.** "Do-everything" themes load code for features you don't use.
4. **Too many plugins.** Each one adds code and extra requests.
5. **External scripts.** Chats, ad pixels, social widgets, maps, external fonts. Each has a cost.
6. **Poor hosting.** A slow or overloaded server delays everything before the page even starts loading.
7. **No caching.** Pages are built from scratch on every visit.
8. **Videos loaded directly on the page** without being optimised.

## What you can do, in order of impact

### 1. Optimise your images

- resize them to the size they're actually displayed at;
- compress them and use modern formats (WebP or AVIF);
- use lazy loading for images that aren't visible at first;
- **don't** lazy-load the main image at the top, because that makes LCP worse.

This step alone often solves most of the problem.

### 2. Remove what you don't use

List every plugin, script and widget on your website. For each, ask: "Does this bring anything concrete?" If not, remove it.

### 3. Load external scripts intelligently

Ad pixels, analytics tools and chats can be loaded after the page is displayed, or only after the visitor consents to cookies. The latter is also a legal requirement in the EU, explained in our guide to the [legal requirements for a website](/blog/obligatii-legale-site-romania).

### 4. Reserve space for images and ads

To reduce CLS, every image and every element that loads later must have its space reserved on the page. That way the rest of the content no longer moves.

### 5. Fonts

Use as few fonts and weights as possible. Ideally, host them on your own website rather than loading them from another server on every visit.

### 6. Hosting and caching

Good hosting, with servers close to your visitors and caching enabled, can significantly reduce load time. For online stores, where high traffic meets many pages, the difference is even bigger. I talked about hosting costs in our guide on [how much an online store costs](/blog/cat-costa-un-magazin-online).

### 7. Videos

Don't load a large video directly on the home page. Use a preview image and load the video only when the person presses "play", or host it on a specialised platform.

## How to read a PageSpeed report without panicking

The report has lots of recommendations and technical terms, but you can sort them easily:

- **start with the field data**, if there is any: it shows the real experience of visitors, not a simulated test;
- **look at the three colours**: green means good, orange means it can be improved, red means there's a problem;
- **read the recommendations from the top**: they're ordered by how much time they would save;
- **look for the words "image", "unused" and "third-party"**: they usually point to large images, unused code and external scripts, which are exactly the most common causes.

You don't have to fix every recommendation. The first 3–4 usually bring most of the improvement.

## How fast your website needs to be

The practical target: all three Core Web Vitals in the "good" range for most visitors, on mobile. The 0–100 score in PageSpeed Insights is useful as a reference, but it isn't a goal in itself. A site scoring 85 that feels fast and converts well is worth more than a site scoring 100 with no useful content.

## Building from scratch vs. fixing an existing site

If your website already has a very heavy theme and dozens of plugins, optimisation sometimes hits a limit. You can reach a point where every small improvement takes a lot of time. At that point, it's worth comparing the cost of fixes with the cost of a website built properly from the start. When we build a website at MAVA Studio, speed is considered from the very first line of code: images optimised automatically, no heavy themes, no unnecessary scripts, with suitable caching and hosting. Details on our [website development](/servicii/dezvoltare-website-uri) page.

## Common mistakes

- **Looking only at the desktop score.** Most visitors are on phones.
- **Installing an "optimisation" plugin** on top of ten other plugins. You treat a symptom, not the cause.
- **Lazy-loading the main image.** You make the main metric worse.
- **Adding a new script for every campaign** and never removing it.
- **Choosing the cheapest hosting** for a high-traffic store.
- **Testing only once.** Speed changes with every new image, plugin or script.

## Example: a business website from slow to fast

A business website for a construction company had a slider with five large images on the home page, an auto-playing video, three different fonts and scripts from four external services. On phones, the main content took a very long time to appear. What we changed:

1. replaced the slider with a single, well-optimised image;
2. gave the video a preview image so it loads only when tapped;
3. cut the fonts down to one, in two weights, hosted on the site;
4. removed two unused scripts and delayed loading the others until after consent;
5. compressed all images and converted them to a modern format.

The website looked just as good, but loaded much faster on phones, and its Core Web Vitals moved into the good range.

## How often to check speed

I recommend a quick check every month and a more thorough one whenever you:

- add a new section with images or videos;
- install a new plugin or script (chat, pixel, widget);
- change the theme, hosting or design;
- launch an ad campaign that will bring a lot of traffic.

A check takes a few minutes and saves you from the unpleasant surprise of a paid campaign sending people to a website that's too slow.

## Frequently asked questions

### What are Core Web Vitals?

Core Web Vitals are three metrics defined by Google for page experience: LCP, which measures how quickly the main content appears; INP, which measures how quickly the page responds to interactions; and CLS, which measures how stable the page stays while loading.

### How fast should a website load?

As a benchmark, the main content should appear in under 2.5 seconds for most visitors, including on phones. The page should respond to a click in under 200 milliseconds and have no elements that jump around.

### Does speed affect Google rankings?

Yes, page experience, including Core Web Vitals, is among the signals Google uses. Speed doesn't make up for a lack of relevance, but between equally good pages, the faster one has an advantage, and visitors stay on it longer.

### How do I test my website's speed for free?

With PageSpeed Insights, where you enter the page address and get a report for mobile and desktop, and with the Core Web Vitals report in Google Search Console, which shows problems across your whole site.

### What's the quickest improvement I can make?

Most of the time, optimising images: resizing, compressing and using modern formats. Then removing unused plugins and scripts.

## Conclusion

Speed isn't a technical detail; it's your website's first impression. Measure it on mobile, start with the images, remove what you don't use and load external scripts sensibly. A fast website keeps people on the page, persuades more easily and is favoured by Google too.

If you want to know how fast your website is and what would make it faster, [write to us](/incepe-un-proiect). And if you're building a new website, also read our guide to [what a business website must include](/blog/ce-trebuie-sa-contina-un-site-de-prezentare).`,
  },
};

export default article;
