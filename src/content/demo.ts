// Conținut demonstrativ afișat cât timp nu există date publicate în admin.
// Imediat ce publici un proiect / articol din CRM → Website, acesta înlocuiește automat conținutul demo.

export type PortfolioItem = {
  id?: string;
  slug: string;
  title: string;
  client_name?: string | null;
  category: "website" | "saas" | "crm" | "ai" | "social" | "video";
  subtitle?: string | null;
  summary?: string | null;
  cover_url?: string | null;
  gallery?: string[];
  problem?: string | null;
  solution?: string | null;
  technologies?: string[];
  features?: string[];
  results?: string | null;
  metrics?: { value: string; label: string }[];
  live_url?: string | null;
  featured?: boolean;
  /** Vizual generat din cod pentru proiectele demo (când nu există cover_url). */
  visual?: "lume" | "flowr" | "velora" | "autolux" | "clinica" | "green";
  /** Textele în engleză (completate din CRM → Website). Câmpurile lipsă folosesc varianta română. */
  translations?: { en?: PortfolioTranslation } | null;
};

export type PortfolioTranslation = Partial<
  Pick<PortfolioItem, "title" | "subtitle" | "summary" | "problem" | "solution" | "features" | "results" | "metrics">
>;

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  cover_url?: string | null;
  category?: string | null;
  tags?: string[];
  author_name?: string | null;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  /** Varianta în engleză. Articolele fără traducere nu apar pe site-ul în engleză. */
  translations?: { en?: PostTranslation } | null;
};

export type PostTranslation = Partial<Pick<BlogPost, "title" | "excerpt" | "content" | "category" | "seo_title" | "seo_description">>;

export const CATEGORY_LABELS: Record<PortfolioItem["category"], string> = {
  website: "Website-uri",
  saas: "SaaS",
  crm: "CRM",
  ai: "AI Content",
  social: "Social Media",
  video: "Video",
};

export const CATEGORY_LABELS_EN: Record<PortfolioItem["category"], string> = {
  website: "Websites",
  saas: "SaaS",
  crm: "CRM",
  ai: "AI Content",
  social: "Social Media",
  video: "Video",
};

export const DEMO_PORTFOLIO: PortfolioItem[] = [
  {
    slug: "lume",
    title: "Lumé",
    client_name: "Lumé Skincare",
    category: "website",
    subtitle: "Website · eCommerce",
    summary: "Magazin online pentru produse cosmetice naturale, cu un design modern și o experiență de cumpărare optimizată.",
    visual: "lume",
    featured: true,
    problem:
      "Brandul vindea doar prin rețele sociale și mesaje private. Comenzile se pierdeau, iar stocurile erau gestionate manual, într-un fișier Excel.",
    solution:
      "Am construit un magazin online rapid, cu un design elegant în ton cu identitatea brandului, plăți cu cardul, integrare curierat și facturare automată.",
    technologies: ["Next.js", "TypeScript", "Stripe", "SmartBill", "Vercel"],
    features: ["Catalog produse cu filtre", "Checkout în 2 pași", "Plăți cu cardul", "Facturare automată", "Integrare curierat", "Blog & SEO"],
    results: "Comenzile online au devenit principalul canal de vânzare, iar timpul petrecut cu administrarea comenzilor a scăzut semnificativ.",
    metrics: [
      { value: "+320%", label: "creștere vânzări" },
      { value: "1,2s", label: "timp de încărcare" },
    ],
  },
  {
    slug: "flowr",
    title: "Flowr",
    client_name: "FlowPro",
    category: "saas",
    subtitle: "Platformă SaaS",
    summary: "Platformă completă pentru managementul afacerii, cu facturare, clienți și rapoarte avansate.",
    visual: "flowr",
    featured: true,
    problem: "Echipa folosea cinci aplicații diferite pentru clienți, proiecte și facturare. Datele nu comunicau între ele.",
    solution:
      "Am proiectat și dezvoltat o platformă SaaS unitară: dashboard, clienți, proiecte, automatizări, rapoarte și abonamente lunare prin Stripe.",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    features: ["Dashboard în timp real", "Roluri și permisiuni", "Abonamente Stripe", "Automatizări", "Rapoarte exportabile", "API public"],
    results: "Platforma este folosită astăzi de peste 1.000 de companii pentru a-și gestiona afacerea mai eficient.",
    metrics: [
      { value: "+290%", label: "creștere lead-uri" },
      { value: "1.000+", label: "companii active" },
    ],
  },
  {
    slug: "velora",
    title: "Velora",
    client_name: "Velora",
    category: "ai",
    subtitle: "Conținut & Social Media",
    summary: "Strategie de conținut, fotografie de produs și campanii sociale care au crescut semnificativ vizibilitatea brandului.",
    visual: "velora",
    featured: true,
    problem: "Produsele nu aveau fotografii profesionale, iar o ședință foto clasică depășea bugetul lansării.",
    solution: "Am creat imagini și clipuri de produs cu AI, apoi le-am folosit într-un calendar editorial lunar pentru Instagram și TikTok.",
    technologies: ["Fotografie AI", "Video AI", "Meta Business Suite", "CapCut"],
    features: ["40+ vizualuri de produs", "Reels & TikTok", "Calendar editorial", "Campanii plătite", "Raport lunar"],
    results: "Costurile de producție vizuală au scăzut, iar comunitatea a crescut constant de la lună la lună.",
    metrics: [{ value: "+250%", label: "engagement" }],
  },
  {
    slug: "autolux",
    title: "AutoLux",
    client_name: "AutoLux",
    category: "website",
    subtitle: "Website · Prezentare",
    summary: "Site de prezentare modern pentru un dealership auto premium, cu design elegant și performanță ridicată.",
    visual: "autolux",
    problem: "Vechiul site era lent și nu permitea actualizarea rapidă a stocului de mașini.",
    solution: "Un website rapid, cu catalog administrabil, filtre și formular de programare test-drive conectat la CRM.",
    technologies: ["Next.js", "Supabase", "Vercel"],
    features: ["Catalog auto administrabil", "Filtre avansate", "Programare test-drive", "Integrare CRM"],
    results: "Cererile de test-drive vin acum direct în CRM, cu sursa și campania din care provin.",
  },
  {
    slug: "clinica-sana",
    title: "Clinica Sana",
    client_name: "Clinica Sana",
    category: "website",
    subtitle: "Website · Domeniul Medical",
    summary: "Site pentru clinică medicală, cu programări online, prezentarea serviciilor și o experiență prietenoasă pentru pacienți.",
    visual: "clinica",
    problem: "Programările se făceau exclusiv telefonic, iar recepția era suprasolicitată.",
    solution: "Website cu programări online, pagini dedicate pentru fiecare specialitate și notificări automate pe email.",
    technologies: ["Next.js", "PostgreSQL", "Google Calendar"],
    features: ["Programări online", "Pagini specialități", "Notificări automate", "Design accesibil"],
    results: "O parte importantă din programări se fac acum online, fără apeluri telefonice.",
  },
  {
    slug: "green-energy",
    title: "Green Energy",
    client_name: "Green Energy",
    category: "website",
    subtitle: "Website · Prezentare",
    summary: "Site de prezentare pentru o companie de energie regenerabilă, cu focus pe încredere, claritate și generare de lead-uri.",
    visual: "green",
    problem: "Compania primea puține cereri de ofertă din mediul online.",
    solution: "Un website orientat spre conversie, cu calculator de economii și formular de ofertă conectat la CRM.",
    technologies: ["Next.js", "Tailwind CSS", "Vercel"],
    features: ["Calculator economii", "Formular ofertă", "SEO local", "Studii de caz"],
    results: "Numărul cererilor de ofertă a crescut constant după lansare.",
  },
];

export const DEMO_POSTS: BlogPost[] = [
  {
    slug: "cat-costa-un-website-pentru-afacerea-ta",
    title: "Cât costă un website pentru afacerea ta în 2026?",
    excerpt: "Ce influențează prețul unui website, ce tipuri de site-uri există și cum alegi varianta potrivită pentru bugetul tău.",
    category: "Website-uri",
    tags: ["website", "buget"],
    author_name: "Echipa MAVA Studio",
    published_at: "2026-10-01T09:00:00.000Z",
    content: `Prețul unui website depinde de trei lucruri: **cât de complex este**, **cât conținut are** și **ce trebuie să facă pentru afacerea ta**.

## Tipuri de website-uri

- **Landing page** – o singură pagină, gândită pentru o campanie sau un produs.
- **Website de prezentare** – câteva pagini despre firmă, servicii și contact.
- **Magazin online** – catalog de produse, coș, plăți și livrare.
- **Website custom** – funcționalități unice, integrări cu CRM, facturare sau alte sisteme.

## Ce influențează prețul

1. Numărul de pagini și de șabloane diferite.
2. Designul: personalizat sau pornind de la o temă.
3. Integrările: plăți, curierat, facturare, CRM.
4. Conținutul: texte, fotografii, video.
5. SEO tehnic și viteza de încărcare.

## Sfatul nostru

Pornește de la obiectiv, nu de la buget. Un website care aduce clienți se plătește singur. Dacă nu știi de unde să începi, [scrie-ne](/incepe-un-proiect) și îți facem o recomandare gratuită.`,
  },
  {
    slug: "fotografie-de-produs-cu-ai",
    title: "Fotografia de produs cu AI: când merită și când nu",
    excerpt: "Imaginile generate cu AI pot înlocui o parte din ședințele foto. Iată când funcționează cel mai bine.",
    category: "AI Content",
    tags: ["ai", "foto", "ecommerce"],
    author_name: "Echipa MAVA Studio",
    published_at: "2026-09-18T09:00:00.000Z",
    content: `Inteligența artificială a schimbat felul în care se creează vizualurile de produs. Pornind de la o fotografie simplă, putem crea scene lifestyle, bannere și imagini pentru reclame.

## Când merită

- Ai multe produse și buget limitat pentru ședințe foto.
- Ai nevoie rapid de vizualuri pentru campanii.
- Vrei să testezi mai multe concepte înainte de o ședință foto clasică.

## Când nu este suficient

- Produse unde textura și detaliile fine sunt esențiale.
- Campanii cu persoane reale și ambasadori de brand.

## Cum lucrăm

Pornim de la fotografiile tale, definim stilul vizual al brandului și livrăm imagini consistente, gata de folosit pe site, marketplace și social media.`,
  },
  {
    slug: "de-ce-ai-nevoie-de-un-crm",
    title: "De ce are nevoie o agenție sau o firmă mică de un CRM",
    excerpt: "Lead-uri pierdute, oferte uitate și facturi restante. Un CRM bine configurat rezolvă toate trei.",
    category: "CRM & Automatizări",
    tags: ["crm", "automatizari"],
    author_name: "Echipa MAVA Studio",
    published_at: "2026-09-02T09:00:00.000Z",
    content: `Majoritatea firmelor mici își gestionează clienții în email, WhatsApp și Excel. Funcționează – până când nu mai funcționează.

## Semne că ai nevoie de un CRM

- Uiți să revii la clienții care au cerut o ofertă.
- Nu știi ce serviciu îți aduce cei mai mulți bani.
- Facturile restante se descoperă prea târziu.

## Ce face un CRM bun

Centralizează lead-urile, ofertele, contractele, proiectele și facturile într-un singur loc. Automatizările preiau sarcinile repetitive: notificări, task-uri, remindere.

## Integrare cu facturarea

Un CRM nu trebuie să înlocuiască SmartBill, Oblio sau FGO. Trebuie să comunice cu ele, astfel încât factura să plece direct din fișa clientului.`,
  },
];

/* ---------- Traducerile în engleză ale conținutului demo ---------- */

const PORTFOLIO_EN: Record<string, PortfolioTranslation> = {
  lume: {
    subtitle: "Website · eCommerce",
    summary: "An online store for natural cosmetics, with a modern design and an optimised shopping experience.",
    problem: "The brand sold only through social media and private messages. Orders got lost and stock was tracked manually in an Excel file.",
    solution: "We built a fast online store with an elegant design true to the brand identity, card payments, courier integration and automatic invoicing.",
    features: ["Product catalogue with filters", "2-step checkout", "Card payments", "Automatic invoicing", "Courier integration", "Blog & SEO"],
    results: "Online orders became the main sales channel, and the time spent managing orders dropped significantly.",
    metrics: [
      { value: "+320%", label: "sales growth" },
      { value: "1.2s", label: "load time" },
    ],
  },
  flowr: {
    subtitle: "SaaS platform",
    summary: "A complete business management platform with invoicing, clients and advanced reporting.",
    problem: "The team used five different apps for clients, projects and invoicing. None of the data was connected.",
    solution: "We designed and built a unified SaaS platform: dashboard, clients, projects, automations, reports and monthly Stripe subscriptions.",
    features: ["Real-time dashboard", "Roles & permissions", "Stripe subscriptions", "Automations", "Exportable reports", "Public API"],
    results: "Today the platform is used by more than 1,000 companies to run their business more efficiently.",
    metrics: [
      { value: "+290%", label: "lead growth" },
      { value: "1,000+", label: "active companies" },
    ],
  },
  velora: {
    subtitle: "Content & Social Media",
    summary: "Content strategy, product photography and social campaigns that significantly increased brand visibility.",
    problem: "The products had no professional photos, and a traditional photo shoot was over the launch budget.",
    solution: "We created AI product images and clips, then used them in a monthly content calendar for Instagram and TikTok.",
    features: ["40+ product visuals", "Reels & TikTok", "Content calendar", "Paid campaigns", "Monthly report"],
    results: "Visual production costs went down, and the community grew steadily month after month.",
    metrics: [{ value: "+250%", label: "engagement" }],
  },
  autolux: {
    subtitle: "Website · Business",
    summary: "A modern website for a premium car dealership, with an elegant design and high performance.",
    problem: "The old site was slow and made it hard to keep the car inventory up to date.",
    solution: "A fast website with a manageable catalogue, filters and a test-drive booking form connected to the CRM.",
    features: ["Manageable car catalogue", "Advanced filters", "Test-drive booking", "CRM integration"],
    results: "Test-drive requests now go straight into the CRM, together with their source and campaign.",
  },
  "clinica-sana": {
    subtitle: "Website · Healthcare",
    summary: "A website for a medical clinic, with online booking, service pages and a patient-friendly experience.",
    problem: "Appointments could only be made by phone, and the front desk was overloaded.",
    solution: "A website with online booking, dedicated pages for each specialty and automatic email notifications.",
    features: ["Online booking", "Specialty pages", "Automatic notifications", "Accessible design"],
    results: "A significant share of appointments are now booked online, without phone calls.",
  },
  "green-energy": {
    subtitle: "Website · Business",
    summary: "A website for a renewable energy company, focused on trust, clarity and lead generation.",
    problem: "The company was getting very few quote requests online.",
    solution: "A conversion-focused website with a savings calculator and a quote form connected to the CRM.",
    features: ["Savings calculator", "Quote form", "Local SEO", "Case studies"],
    results: "The number of quote requests has grown steadily since launch.",
  },
};

const POSTS_EN: Record<string, PostTranslation> = {
  "cat-costa-un-website-pentru-afacerea-ta": {
    title: "How much does a website for your business cost in 2026?",
    excerpt: "What drives the price of a website, which types of sites exist and how to choose the right option for your budget.",
    category: "Websites",
    content: `The price of a website depends on three things: **how complex it is**, **how much content it has** and **what it needs to do for your business**.

## Types of websites

- **Landing page** – a single page, built for one campaign or product.
- **Business website** – a few pages about your company, services and contact details.
- **Online store** – product catalogue, cart, payments and shipping.
- **Custom website** – unique features and integrations with your CRM, invoicing or other systems.

## What affects the price

1. The number of pages and distinct templates.
2. The design: fully custom or based on a theme.
3. Integrations: payments, shipping, invoicing, CRM.
4. Content: copy, photos, video.
5. Technical SEO and loading speed.

## Our advice

Start from the goal, not the budget. A website that brings in customers pays for itself. If you're not sure where to start, [get in touch](/en/start-a-project) and we'll give you a free recommendation.`,
  },
  "fotografie-de-produs-cu-ai": {
    title: "AI product photography: when it's worth it and when it isn't",
    excerpt: "AI-generated images can replace part of your photo shoots. Here's when they work best.",
    category: "AI Content",
    content: `Artificial intelligence has changed the way product visuals are made. Starting from a simple photo, we can create lifestyle scenes, banners and ad creatives.

## When it's worth it

- You have many products and a limited budget for photo shoots.
- You need visuals for campaigns, fast.
- You want to test several concepts before a traditional shoot.

## When it isn't enough

- Products where texture and fine detail are essential.
- Campaigns featuring real people and brand ambassadors.

## How we work

We start from your photos, define your brand's visual style and deliver consistent images, ready to use on your website, marketplaces and social media.`,
  },
  "de-ce-ai-nevoie-de-un-crm": {
    title: "Why an agency or small business needs a CRM",
    excerpt: "Lost leads, forgotten proposals and overdue invoices. A well-configured CRM solves all three.",
    category: "CRM & Automation",
    content: `Most small businesses manage their clients through email, WhatsApp and Excel. It works – until it doesn't.

## Signs you need a CRM

- You forget to follow up with clients who asked for a quote.
- You don't know which service brings in the most revenue.
- Overdue invoices are discovered too late.

## What a good CRM does

It brings leads, proposals, contracts, projects and invoices together in one place. Automations take over repetitive work: notifications, tasks and reminders.

## Invoicing integration

A CRM doesn't need to replace your invoicing software. It needs to talk to it, so that invoices go out straight from the client record.`,
  },
};

for (const p of DEMO_PORTFOLIO) p.translations = { en: PORTFOLIO_EN[p.slug] };
for (const p of DEMO_POSTS) p.translations = { en: POSTS_EN[p.slug] };
