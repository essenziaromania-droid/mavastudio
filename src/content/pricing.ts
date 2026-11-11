import type { TileColor } from "@/components/ui/icon";
import type { Locale } from "@/lib/i18n";

/**
 * Prețurile de pornire afișate pe pagina /preturi.
 * Româna în lei, engleza în euro. Schimbă sumele aici și se actualizează pagina.
 */

export type PriceItem = {
  name: string;
  /** Tipul de proiect preselectat în formular (vezi PROJECT_TYPES). */
  type: string;
  price: string;
  unit?: string;
  text: string;
  items: string[];
  popular?: boolean;
};

export type PriceGroup = {
  icon: string;
  color: TileColor;
  title: string;
  sub: string;
  /** Pagina serviciului (slug românesc) pentru „Detalii”. */
  service?: string;
  items: PriceItem[];
};

const RO = {
  metaTitle: "Prețuri",
  metaDescription: "Prețuri de pornire pentru site-uri, magazine online, administrare social media, poze și clipuri de produs, editare video și CRM.",
  eyebrow: ["Prețuri clare", "Fără costuri ascunse"],
  title: ["Cât", "costă?"],
  lead: "Aici găsești prețurile de pornire pentru fiecare serviciu. După o discuție scurtă și gratuită primești o ofertă exactă, cu preț, termen și tot ce include.",
  from: "de la",
  popular: "Cel mai ales",
  choose: "Cere ofertă",
  details: "Detalii despre serviciu",
  note: "Prețurile sunt finale: firma nu este plătitoare de TVA, deci nu se adaugă TVA. Sunt prețuri de pornire, orientative. Prețul final depinde de ce ai nevoie și îl primești în scris, în ofertă, înainte de orice plată. Bugetul pentru reclame plătite (Facebook, Google, TikTok) nu e inclus și se plătește separat, direct platformei.",
  groups: [
    {
      icon: "monitor",
      color: "blue",
      title: "Site-uri și magazine online",
      sub: "Plată o singură dată. Domeniul și găzduirea se plătesc separat.",
      service: "dezvoltare-website-uri",
      items: [
        { name: "Landing page", type: "website", price: "1.000 lei", text: "O singură pagină pentru o campanie, un produs sau un eveniment.", items: ["Design personalizat", "Formular de contact", "Adaptat pentru telefon", "Livrare în 3 zile lucrătoare"] },
        { name: "Site de prezentare", type: "website", price: "3.000 lei", popular: true, text: "Site complet pentru firmă: cine ești, ce oferi și cum te contactează clienții.", items: ["Până la 6 pagini", "Design personalizat", "Optimizare de bază pentru Google", "Formulare, hartă, rețele sociale", "Suport 30 de zile după lansare", "Livrare în 7–15 zile lucrătoare"] },
        { name: "Magazin online", type: "ecommerce", price: "6.000 lei", text: "Magazin gata de vânzare, ușor de administrat de tine.", items: ["Produse, categorii și filtre", "Plată cu cardul și ramburs", "Integrare curierat și facturare", "Instruire pentru administrare", "Suport 60 de zile după lansare", "Livrare în 15–30 de zile lucrătoare"] },
      ],
    },
    {
      icon: "megaphone",
      color: "purple",
      title: "Administrare social media",
      sub: "Abonament lunar, cu o perioadă minimă de 3 luni. După aceea continui de la lună la lună.",
      service: "administrare-social-media",
      items: [
        { name: "Start", type: "social", price: "1.500 lei", unit: "/ lună", text: "Prezență constantă pentru afaceri la început.", items: ["2 rețele sociale", "8 postări pe lună", "Calendar aprobat de tine", "Raport lunar"] },
        { name: "Creștere", type: "social", price: "2.500 lei", unit: "/ lună", popular: true, text: "Pentru afaceri care vor mai multă vizibilitate.", items: ["3 rețele sociale", "12 postări + 4 clipuri scurte pe lună", "Răspunsuri la comentarii", "Raport lunar cu recomandări"] },
        { name: "Complet", type: "social", price: "4.000 lei", unit: "/ lună", text: "Ne ocupăm de tot, inclusiv de reclame.", items: ["Până la 4 rețele sociale", "20 de postări + 8 clipuri scurte pe lună", "Administrare reclame plătite", "Raport lunar și discuție de strategie"] },
      ],
    },
    {
      icon: "camera",
      color: "pink",
      title: "Poze, clipuri și editare video",
      sub: "Pe proiect sau ca pachet lunar.",
      service: "foto-video-produs-ai",
      items: [
        { name: "Poze de produs cu AI", type: "ai", price: "600 lei", text: "Imagini de prezentare și lifestyle, fără ședință foto.", items: ["10 imagini pentru un produs", "Pentru site, magazin și reclame", "2 runde de modificări", "Livrare în 7 zile lucrătoare"] },
        { name: "Clip de produs cu AI", type: "ai", price: "150 lei", unit: "/ clip", text: "Clip de produs pentru reclame și rețele sociale.", items: ["15–30 de secunde sau mai lung, la cerere", "Format vertical și orizontal", "Muzică și text pe ecran", "Livrare în 7 zile lucrătoare"] },
        { name: "Editare video", type: "video", price: "25 lei", unit: "/ minut", text: "Din materialele tale facem clipuri pentru Reels, TikTok, Shorts și YouTube.", items: ["Preț pe minut de video final", "Subtitrări și text pe ecran", "Muzică, tranziții și corecție de culoare"] },
      ],
    },
    {
      icon: "settings",
      color: "green",
      title: "Programe pentru afacerea ta",
      sub: "Construite pe măsură. Prețul depinde de ce trebuie să facă programul.",
      items: [
        { name: "CRM și automatizări", type: "crm", price: "10.000 lei", text: "Clienți, oferte, contracte, proiecte și facturare într-un singur loc.", items: ["Construit pe procesele tale", "Facturare SmartBill, Oblio sau FGO", "Sarcini repetitive făcute automat", "Livrare în 30–60 de zile"] },
        { name: "Platformă sau aplicație web", type: "saas", price: "25.000 lei", text: "Platforme cu conturi de utilizator, abonamente și plăți online.", items: ["Analiză și prototip înainte de dezvoltare", "Plăți și abonamente online", "Dezvoltare pe etape", "Livrare în 30–60 de zile"] },
        { name: "Mentenanță site", type: "website", price: "500 lei", unit: "/ lună", text: "Site-ul tău rămâne rapid, sigur și actualizat.", items: ["Actualizări și copii de siguranță", "Monitorizare și securitate", "Mici modificări de conținut"] },
      ],
    },
  ] as PriceGroup[],
  faqTitle: ["Întrebări despre prețuri", "Ce trebuie să știi înainte să ceri o ofertă."],
  faq: [
    ["De ce scrie „de la”?", "Fiecare afacere are nevoi diferite. Prețul de pornire e pentru varianta de bază, iar în ofertă vezi exact cât costă ce îți trebuie ție."],
    ["Cum se face plata?", "La proiecte plătești un avans de 50% la semnarea contractului și restul de 50% la livrare. Abonamentele se plătesc lunar, pe factură."],
    ["Sunt costuri ascunse?", "Nu. Tot ce e inclus și ce nu e inclus e scris în ofertă. Costurile separate (domeniu, găzduire, buget de reclame) sunt anunțate de la început."],
    ["Pot combina mai multe servicii?", "Da, și de obicei iese mai avantajos. De exemplu, un site plus administrare social media sau un magazin online plus poze de produs."],
  ] as [string, string][],
  cta: ["Nu știi ce ți se potrivește?", "Spune-ne pe scurt ce ai nevoie și îți recomandăm varianta potrivită pentru bugetul tău."],
};

const EN: typeof RO = {
  metaTitle: "Pricing",
  metaDescription: "Starting prices for websites, online stores, social media management, product photos and videos, video editing and CRM.",
  eyebrow: ["Clear pricing", "No hidden costs"],
  title: ["How much does it", "cost?"],
  lead: "Here are the starting prices for every service. After a short, free call you get an exact proposal with price, timeline and everything that's included.",
  from: "from",
  popular: "Most chosen",
  choose: "Get a quote",
  details: "Service details",
  note: "Prices are final: the company is not VAT-registered, so no VAT is added. They are indicative starting prices. The final price depends on what you need, and you get it in writing, in the proposal, before any payment. Paid ad budgets (Facebook, Google, TikTok) are not included and are paid separately, directly to the platform.",
  groups: [
    {
      icon: "monitor",
      color: "blue",
      title: "Websites and online stores",
      sub: "One-time payment. Domain and hosting are paid separately.",
      service: "dezvoltare-website-uri",
      items: [
        { name: "Landing page", type: "website", price: "€200", text: "A single page for a campaign, product or event.", items: ["Custom design", "Contact form", "Mobile-friendly", "Delivered in 3 working days"] },
        { name: "Business website", type: "website", price: "€600", popular: true, text: "A complete company website: who you are, what you offer and how customers reach you.", items: ["Up to 6 pages", "Custom design", "Basic Google optimisation", "Forms, map, social links", "30 days of support after launch", "Delivered in 7–15 working days"] },
        { name: "Online store", type: "ecommerce", price: "€1,200", text: "A store ready to sell, easy for you to manage.", items: ["Products, categories and filters", "Card and cash-on-delivery payments", "Courier and invoicing integration", "Training to manage it", "60 days of support after launch", "Delivered in 15–30 working days"] },
      ],
    },
    {
      icon: "megaphone",
      color: "purple",
      title: "Social media management",
      sub: "Monthly plan with a 3-month minimum. After that, you continue month to month.",
      service: "administrare-social-media",
      items: [
        { name: "Start", type: "social", price: "€300", unit: "/ month", text: "Consistent presence for businesses getting started.", items: ["2 social networks", "8 posts per month", "Calendar approved by you", "Monthly report"] },
        { name: "Growth", type: "social", price: "€500", unit: "/ month", popular: true, text: "For businesses that want more visibility.", items: ["3 social networks", "12 posts + 4 short videos per month", "Replies to comments", "Monthly report with recommendations"] },
        { name: "Complete", type: "social", price: "€800", unit: "/ month", text: "We take care of everything, including ads.", items: ["Up to 4 social networks", "20 posts + 8 short videos per month", "Paid ads management", "Monthly report and strategy call"] },
      ],
    },
    {
      icon: "camera",
      color: "pink",
      title: "Photos, videos and video editing",
      sub: "Per project or as a monthly package.",
      service: "foto-video-produs-ai",
      items: [
        { name: "AI product photos", type: "ai", price: "€120", text: "Product and lifestyle images, without a photo shoot.", items: ["10 images for one product", "For website, store and ads", "2 rounds of changes", "Delivered in 7 working days"] },
        { name: "AI product video", type: "ai", price: "€30", unit: "/ video", text: "A product video for ads and social media.", items: ["15–30 seconds, or longer on request", "Vertical and horizontal format", "Music and on-screen text", "Delivered in 7 working days"] },
        { name: "Video editing", type: "video", price: "€5", unit: "/ minute", text: "We turn your footage into videos for Reels, TikTok, Shorts and YouTube.", items: ["Price per minute of final video", "Subtitles and on-screen text", "Music, transitions and colour correction"] },
      ],
    },
    {
      icon: "settings",
      color: "green",
      title: "Software for your business",
      sub: "Built to measure. The price depends on what the software needs to do.",
      items: [
        { name: "CRM and automation", type: "crm", price: "€2,000", text: "Clients, proposals, contracts, projects and invoicing in one place.", items: ["Built around your processes", "Invoicing integrations", "Repetitive tasks done automatically", "Delivered in 30–60 days"] },
        { name: "Web platform or app", type: "saas", price: "€5,000", text: "Platforms with user accounts, subscriptions and online payments.", items: ["Analysis and prototype before development", "Online payments and subscriptions", "Built in stages", "Delivered in 30–60 days"] },
        { name: "Website maintenance", type: "website", price: "€100", unit: "/ month", text: "Your website stays fast, secure and up to date.", items: ["Updates and backups", "Monitoring and security", "Small content changes"] },
      ],
    },
  ],
  faqTitle: ["Pricing questions", "What to know before asking for a quote."],
  faq: [
    ["Why does it say “from”?", "Every business needs something different. The starting price is for the basic version, and the proposal shows exactly what you need costs."],
    ["How does payment work?", "For projects, you pay a 50% deposit when signing the contract and the remaining 50% on delivery. Monthly plans are invoiced monthly."],
    ["Are there hidden costs?", "No. Everything included and not included is written in the proposal. Separate costs (domain, hosting, ad budget) are stated upfront."],
    ["Can I combine several services?", "Yes, and it's usually better value. For example, a website plus social media management, or an online store plus product photos."],
  ],
  cta: ["Not sure what fits you?", "Tell us briefly what you need and we'll recommend the right option for your budget."],
};

export const pricing = (l: Locale) => (l === "en" ? EN : RO);
