import type { TileColor } from "@/components/ui/icon";
import type { Step } from "@/components/site/sections";
import { SERVICES_EN } from "./services.en";

type Card = { icon: string; color: TileColor; title: string; text: string };

export type ServiceSection =
  | { type: "cards"; title: string; sub: string; columns: 3 | 4; items: Card[]; style?: "row" | "stack" | "small" }
  | { type: "video-examples"; title: string; sub: string; items: { title: string; tag: string; duration: string; tone: string; caption?: string }[] }
  | { type: "before-after"; title: string; sub: string; items: { product: "serum" | "sneaker" | "cream" }[] }
  | { type: "process"; title: string; sub: string; steps: Step[] }
  | { type: "why"; title: string; sub: string; items: Card[]; variant?: "cards" | "columns" }
  | { type: "integrations"; title: string; sub: string; items: { name: string; text: string; mark: string; color: string }[] }
  | { type: "audience"; title: string; sub: string; items: { title: string; text: string; scene: "laptop" | "team" | "charts" }[] }
  | { type: "tech"; title: string; sub: string; items: { name: string; mark: string; color: string }[] }
  | { type: "featured-project"; title: string; sub: string };

export type Service = {
  slug: string;
  category: string;
  menuTitle: string;
  icon: string;
  color: TileColor;
  short: string;
  eyebrow: string[];
  title: { before: string; highlight: string; after?: string };
  lead: string;
  sublead?: string;
  secondary: { label: string; href: string };
  stats: { value: string; label: string }[];
  hero: "video" | "ai" | "crm" | "saas" | "website" | "social";
  sections: ServiceSection[];
  cta: { title: string; text: string; button: string };
  metaDescription: string;
};

const STD_PROCESS_TITLE = "Cum lucrăm";

export const SERVICES: Service[] = [
  {
    slug: "dezvoltare-website-uri",
    category: "website",
    menuTitle: "Dezvoltare website-uri",
    icon: "globe",
    color: "blue",
    short: "Website-uri moderne, rapide și optimizate, care transformă vizitatorii în clienți.",
    eyebrow: ["Servicii", "Dezvoltare website-uri"],
    title: { before: "Dezvoltare website-uri moderne care aduc", highlight: "rezultate." },
    lead: "Construim website-uri moderne, rapide și orientate spre conversie, care îți pun brandul în valoare și transformă vizitatorii în clienți.",
    secondary: { label: "Vezi portofoliul", href: "/proiecte" },
    stats: [
      { value: "50+", label: "Website-uri livrate" },
      { value: "98%", label: "Clienți mulțumiți" },
      { value: "3–6 săpt.", label: "Timp mediu de livrare" },
    ],
    hero: "website",
    metaDescription: "Website-uri de prezentare, landing page-uri, magazine online și website-uri custom, rapide și optimizate SEO.",
    sections: [
      {
        type: "cards",
        title: "Ce realizăm",
        sub: "Tipuri de website-uri adaptate nevoilor afacerii tale.",
        columns: 4,
        style: "stack",
        items: [
          { icon: "monitor", color: "blue", title: "Website de prezentare", text: "Un site modern pentru a-ți prezenta compania, serviciile și valorile într-un mod profesionist." },
          { icon: "target", color: "purple", title: "Landing page", text: "Pagini optimizate pentru campanii de promovare, create să convertească vizitatorii în clienți." },
          { icon: "cart", color: "red", title: "Magazin online", text: "Platforme eCommerce complete, ușor de administrat, pregătite pentru vânzări și scalare." },
          { icon: "settings", color: "green", title: "Website custom", text: "Soluții web personalizate pentru funcționalități unice și integrări complexe, adaptate perfect afacerii tale." },
        ],
      },
      {
        type: "cards",
        title: "Ce include",
        sub: "Tot ce ai nevoie pentru un website modern, performant și pregătit de creștere.",
        columns: 4,
        style: "small",
        items: [
          { icon: "layers", color: "blue", title: "Structură și planificare", text: "Analizăm obiectivele tale și creăm o structură clară, orientată spre conversie." },
          { icon: "pencil", color: "purple", title: "Design UI/UX modern", text: "Interfețe intuitive și atractive, create pentru o experiență excelentă a utilizatorilor." },
          { icon: "code", color: "green", title: "Dezvoltare performantă", text: "Cod curat, tehnologii moderne și funcționalități adaptate nevoilor tale." },
          { icon: "monitor", color: "blue", title: "Design responsive", text: "Website optimizat pentru toate dispozitivele: desktop, tabletă și mobil." },
          { icon: "search", color: "red", title: "SEO tehnic", text: "Structură optimizată, viteză ridicată și bune practici SEO pentru vizibilitate în Google." },
          { icon: "file", color: "purple", title: "Formulare și integrări", text: "Formulare de contact, newsletter și integrări cu tool-urile tale preferate (CRM, email etc.)." },
          { icon: "gauge", color: "cyan", title: "Optimizare viteză", text: "Website rapid, cu timp de încărcare redus și performanță excelentă." },
          { icon: "shield", color: "green", title: "Securitate și mentenanță", text: "Implementăm măsuri de securitate și oferim suport pentru actualizări și mentenanță." },
        ],
      },
      {
        type: "process",
        title: STD_PROCESS_TITLE,
        sub: "Un proces simplu și clar, de la idee la lansare.",
        steps: [
          { icon: "search", color: "blue", title: "Analiză și planificare", text: "Înțelegem obiectivele tale, publicul țintă și cerințele proiectului." },
          { icon: "pencil", color: "purple", title: "Strategie și design", text: "Creăm structura site-ului și un design modern, adaptat brandului tău." },
          { icon: "code", color: "pink", title: "Dezvoltare și testare", text: "Transformăm designul în realitate și testăm totul pentru o funcționare impecabilă." },
          { icon: "bars", color: "green", title: "Lansare și creștere", text: "Publicăm site-ul și oferim suport pentru optimizare și dezvoltare ulterioară." },
        ],
      },
      { type: "featured-project", title: "Proiecte selectate", sub: "Website-uri reale, construite pentru branduri care cresc." },
    ],
    cta: { title: "Hai să construim site-ul tău", text: "Transformă-ți ideile într-un website modern, rapid și orientat spre rezultate.", button: "Programează o consultație gratuită" },
  },
  {
    slug: "platforme-saas",
    category: "saas",
    menuTitle: "Platforme SaaS",
    icon: "database",
    color: "purple",
    short: "Platforme personalizate, scalabile și ușor de utilizat pentru creșterea afacerii tale.",
    eyebrow: ["Soluții digitale", "Platforme SaaS"],
    title: { before: "Platforme SaaS care cresc odată cu", highlight: "afacerea ta." },
    lead: "Dezvoltăm platforme SaaS personalizate, scalabile și sigure, care transformă ideile tale în produse digitale de succes.",
    secondary: { label: "Vezi demo", href: "/proiecte/flowr" },
    stats: [
      { value: "50+", label: "Platforme dezvoltate" },
      { value: "98%", label: "Clienți mulțumiți" },
      { value: "6+", label: "Ani experiență" },
    ],
    hero: "saas",
    metaDescription: "Dezvoltare platforme SaaS: autentificare, dashboard, roluri, abonamente Stripe, API și rapoarte.",
    sections: [
      {
        type: "cards",
        title: "Ce putem construi",
        sub: "Toate funcționalitățile de care ai nevoie într-o platformă SaaS modernă.",
        columns: 3,
        items: [
          { icon: "dashboard", color: "blue", title: "Dashboard personalizat", text: "Interfețe intuitive cu statistici relevante și date în timp real pentru utilizatorii tăi." },
          { icon: "lock", color: "purple", title: "Autentificare și securitate", text: "Sisteme de autentificare sigure, SSO, 2FA și protecția datelor utilizatorilor." },
          { icon: "users", color: "blue", title: "Roluri și permisiuni", text: "Gestionarea utilizatorilor, echipelor și a permisiunilor pe mai multe niveluri." },
          { icon: "card", color: "purple", title: "Sistem de abonamente", text: "Plăți online, planuri flexibile, facturare automată și integrare cu Stripe sau alte servicii." },
          { icon: "bars", color: "pink", title: "Rapoarte și analize", text: "Rapoarte detaliate, grafice interactive și export de date pentru decizii mai bune." },
          { icon: "plug", color: "green", title: "Integrări și API", text: "Conectare cu servicii terțe precum Stripe, HubSpot, Slack, Google Workspace și multe altele." },
        ],
      },
      {
        type: "audience",
        title: "Pentru cine este potrivit",
        sub: "Platformele SaaS sunt soluția ideală pentru afaceri care vor să scaleze și să automatizeze.",
        items: [
          { title: "Startup-uri și produse digitale", text: "Transformă o idee într-o platformă scalabilă, gata să atragă clienți și investiții.", scene: "laptop" },
          { title: "Companii care vor să digitalizeze", text: "Automatizează procesele interne și oferă clienților o experiență mai bună.", scene: "team" },
          { title: "Afaceri cu model de abonament", text: "Produse și servicii cu venituri recurente, gestionate eficient și în siguranță.", scene: "charts" },
        ],
      },
      {
        type: "process",
        title: "Etapele dezvoltării",
        sub: "Un proces clar și transparent, de la idee la lansarea platformei tale.",
        steps: [
          { icon: "search", color: "blue", title: "Analiză și planificare", text: "Înțelegem obiectivele tale, publicul și cerințele tehnice." },
          { icon: "pencil", color: "purple", title: "Design și prototipare", text: "Creăm interfețe intuitive și prototipuri interactive pentru validare rapidă." },
          { icon: "code", color: "pink", title: "Dezvoltare și testare", text: "Construim platforma cu tehnologii moderne și o testăm riguros." },
          { icon: "bars", color: "green", title: "Lansare și mentenanță", text: "Publicăm platforma și oferim suport continuu pentru creșterea ei." },
        ],
      },
      {
        type: "tech",
        title: "Tehnologii moderne. Rezultate reale.",
        sub: "Folosim cele mai bune tehnologii pentru platforme rapide, sigure și scalabile.",
        items: [
          { name: "React", mark: "⚛", color: "#149ECA" },
          { name: "Next.js", mark: "N", color: "#000000" },
          { name: "Node.js", mark: "⬢", color: "#3C873A" },
          { name: "PostgreSQL", mark: "🐘", color: "#336791" },
          { name: "Stripe", mark: "S", color: "#635BFF" },
          { name: "AWS", mark: "aws", color: "#FF9900" },
          { name: "Docker", mark: "🐳", color: "#2496ED" },
          { name: "Vercel", mark: "▲", color: "#000000" },
        ],
      },
    ],
    cta: { title: "Gata să construim platforma ta SaaS?", text: "Transformă-ți ideea într-un produs digital de succes.", button: "Programează o consultație gratuită" },
  },
  {
    slug: "crm-automatizari",
    category: "crm",
    menuTitle: "CRM & Automatizări",
    icon: "users",
    color: "blue",
    short: "Sisteme CRM și automatizări inteligente pentru eficiență și vânzări mai mari.",
    eyebrow: ["Soluții digitale", "CRM", "Automatizări"],
    title: { before: "CRM &", highlight: "Automatizări" },
    lead: "Sisteme interne inteligente pentru agenții și afaceri care vor să lucreze mai organizat, mai eficient și să crească mai rapid.",
    sublead: "Implementăm soluții CRM personalizate și automatizări care simplifică procesele, elimină sarcinile repetitive și îți oferă control total asupra afacerii.",
    secondary: { label: "Vezi cum funcționează", href: "#module" },
    stats: [
      { value: "50+", label: "Sisteme implementate" },
      { value: "98%", label: "Clienți mulțumiți" },
      { value: "100%", label: "Soluții personalizate" },
    ],
    hero: "crm",
    metaDescription: "CRM personalizat: lead-uri, clienți, oferte, contracte, proiecte, facturare SmartBill/Oblio/FGO și automatizări.",
    sections: [
      {
        type: "cards",
        title: "Module principale",
        sub: "Toate instrumentele de care ai nevoie, într-un singur sistem, adaptat afacerii tale.",
        columns: 4,
        items: [
          { icon: "filter", color: "purple", title: "Lead-uri", text: "Gestionează și urmărește toate oportunitățile de vânzare." },
          { icon: "users", color: "blue", title: "Clienți", text: "Bază de date completă cu istoricul interacțiunilor." },
          { icon: "file", color: "blue", title: "Oferte", text: "Creează și trimite oferte personalizate, cu status și urmărire." },
          { icon: "pen", color: "purple", title: "Contracte", text: "Gestionează contracte direct în CRM, cu notificări automate." },
          { icon: "folder", color: "green", title: "Proiecte", text: "Planifică, urmărește evoluția și livrează proiecte mai eficient." },
          { icon: "clipboard", color: "purple", title: "Task-uri", text: "Organizează echipa și urmărește sarcinile zilnice." },
          { icon: "bars", color: "green", title: "Financiar", text: "Urmărește încasări, plăți și generează rapoarte financiare." },
          { icon: "cloud", color: "blue", title: "Fișiere", text: "Stochează și organizează toate documentele într-un singur loc." },
          { icon: "usercog", color: "blue", title: "Angajați", text: "Gestionează echipa, rolurile și permisiunile de acces." },
          { icon: "pie", color: "purple", title: "Rapoarte", text: "Obține rapoarte clare despre vânzări, proiecte și performanță." },
        ],
      },
      {
        type: "integrations",
        title: "Integrări",
        sub: "Conectăm CRM-ul tău cu instrumentele pe care le folosești deja.",
        items: [
          { name: "SmartBill", text: "Facturare și contabilitate", mark: "S", color: "#1F6FB5" },
          { name: "Oblio", text: "Facturare și gestiune", mark: "O", color: "#E5542A" },
          { name: "FGO", text: "Facturi și e-Factura", mark: "FGO", color: "#1D4ED8" },
          { name: "Google Drive", text: "Stocare fișiere și documente", mark: "▲", color: "#1FA463" },
          { name: "Google Calendar", text: "Programări și evenimente", mark: "31", color: "#4285F4" },
          { name: "Email", text: "Comunicare automată", mark: "✉", color: "#2563EB" },
          { name: "WhatsApp", text: "Notificări și mesaje", mark: "✆", color: "#25D366" },
        ],
      },
      {
        type: "why",
        title: "Beneficii",
        sub: "Mai mult control, mai puțin haos, mai mult timp pentru ceea ce contează.",
        items: [
          { icon: "zap", color: "purple", title: "Automatizare", text: "Elimină sarcinile repetitive și economisește timp prețios." },
          { icon: "database", color: "purple", title: "Centralizare", text: "Toate informațiile într-un singur loc, accesibile oricând." },
          { icon: "bars", color: "green", title: "Productivitate", text: "Echipe mai eficiente și procese mai clare." },
          { icon: "eye", color: "blue", title: "Vizibilitate", text: "Rapoarte și statistici reale pentru decizii mai bune." },
        ],
      },
      {
        type: "process",
        title: STD_PROCESS_TITLE,
        sub: "Un proces simplu și clar, de la analiză la rezultate reale.",
        steps: [
          { icon: "search", color: "blue", title: "Analiză și planificare", text: "Înțelegem procesele tale și obiectivele de business." },
          { icon: "pencil", color: "purple", title: "Design și configurare", text: "Construim și personalizăm CRM-ul în funcție de nevoile tale." },
          { icon: "code", color: "pink", title: "Integrări și testare", text: "Conectăm instrumentele dorite și testăm totul împreună." },
          { icon: "bars", color: "green", title: "Lansare și suport", text: "Punem sistemul în producție și oferim suport continuu." },
        ],
      },
    ],
    cta: { title: "Gata să-ți organizezi afacerea mai bine?", text: "Construiește un sistem CRM adaptat perfect nevoilor tale.", button: "Programează o consultație gratuită" },
  },
  {
    slug: "foto-video-produs-ai",
    category: "ai",
    menuTitle: "Foto & video de produs cu AI",
    icon: "sparkles",
    color: "purple",
    short: "Imagini și clipuri de produs spectaculoase, create cu AI, care pun brandul tău în evidență.",
    eyebrow: ["Servicii", "Foto & video de produs cu AI"],
    title: { before: "Foto & video de produs", highlight: "cu AI" },
    lead: "Creăm vizualuri și clipuri video de produs cu ajutorul inteligenței artificiale, perfecte pentru website-uri, reclame și social media. Imagini de impact, fără ședințe foto costisitoare, într-un timp record.",
    secondary: { label: "Vezi exemple", href: "#exemple" },
    stats: [
      { value: "100+", label: "Produse vizualizate" },
      { value: "3x", label: "mai rapid" },
      { value: "90%", label: "costuri reduse" },
    ],
    hero: "ai",
    metaDescription: "Fotografie și video de produs create cu AI: imagini lifestyle, bannere, vizualuri pentru reclame și marketplace.",
    sections: [
      {
        type: "cards",
        title: "Ce realizăm",
        sub: "Tot ce ai nevoie pentru a-ți pune produsele în valoare, într-un singur loc.",
        columns: 3,
        items: [
          { icon: "camera", color: "purple", title: "Fotografie de produs", text: "Imagini curate și profesionale de produs, pe fundal simplu sau personalizat." },
          { icon: "image", color: "blue", title: "Lifestyle și scenarii de utilizare", text: "Vizualuri realiste în contexte reale, care arată produsul în acțiune." },
          { icon: "megaphone", color: "purple", title: "Vizualuri pentru reclame", text: "Imagini optimizate pentru Facebook, Instagram, Google Ads și alte platforme." },
          { icon: "play", color: "red", title: "Video de produs", text: "Clipuri scurte și dinamice care evidențiază beneficiile produsului tău." },
          { icon: "hash", color: "green", title: "Conținut pentru social media", text: "Reels, stories și postări creative adaptate pentru fiecare platformă." },
          { icon: "layers", color: "blue", title: "Bannere și materiale grafice", text: "Vizualuri pentru homepage, campanii sau newslettere, în stilul brandului tău." },
        ],
      },
      { type: "before-after", title: "Exemple de rezultate", sub: "Vezi cum transformăm produse obișnuite în materiale vizuale de impact.", items: [{ product: "serum" }, { product: "sneaker" }, { product: "cream" }] },
      {
        type: "why",
        variant: "columns",
        title: "De ce să alegi foto & video cu AI?",
        sub: "Vizualuri profesioniste, rezultate rapide și costuri mai mici pentru un impact mai mare.",
        items: [
          { icon: "zap", color: "blue", title: "Viteză maximă", text: "Primești vizualuri profesionale în câteva zile, nu săptămâni." },
          { icon: "database", color: "purple", title: "Consistență de brand", text: "Vizualuri unitare, în același stil și ton, pentru toate produsele tale." },
          { icon: "gem", color: "pink", title: "Impact vizual", text: "Imagini și video care atrag atenția și cresc rata de conversie." },
          { icon: "bars", color: "green", title: "Eficiență în costuri", text: "Obții rezultate premium fără ședințe foto costisitoare și logistică complicată." },
        ],
      },
    ],
    cta: { title: "Gata să-ți pui produsele în lumina potrivită?", text: "Transformă-ți produsele în imagini și clipuri care vând.", button: "Programează o consultație gratuită" },
  },
  {
    slug: "editare-video",
    category: "video",
    menuTitle: "Editare video",
    icon: "play",
    color: "red",
    short: "Clipuri video moderne pentru brandul tău, produse și rețele sociale.",
    eyebrow: ["Servicii", "Editare video", "Conținut care convertește"],
    title: { before: "Editare", highlight: "video" },
    lead: "Transformăm materialele tale în videoclipuri captivante pentru reels, TikTok, shorts, clipuri de produs și reclame care atrag atenția și generează rezultate.",
    secondary: { label: "Vezi exemplele", href: "#exemple" },
    stats: [
      { value: "500+", label: "Clipuri editate" },
      { value: "98%", label: "Clienți mulțumiți" },
      { value: "3x", label: "Mai mult engagement" },
    ],
    hero: "video",
    metaDescription: "Editare video pentru Reels, TikTok, YouTube Shorts, reclame și clipuri de produs. Subtitrări, motion graphics, color correction.",
    sections: [
      {
        type: "cards",
        title: "Ce edităm",
        sub: "Creăm videoclipuri adaptate fiecărei platforme și fiecărui obiectiv de business.",
        columns: 3,
        items: [
          { icon: "instagram", color: "pink", title: "Reels pentru Instagram", text: "Clipuri scurte, dinamice și captivante, optimizate pentru mai mult reach și engagement." },
          { icon: "megaphone", color: "red", title: "Reclame video", text: "Video ads care atrag atenția și generează conversii pentru brandul tău." },
          { icon: "box", color: "blue", title: "Clipuri de produs", text: "Prezentări clare și atractive pentru magazinul tău online sau rețelele sociale." },
          { icon: "music", color: "violet", title: "TikTok & YouTube Shorts", text: "Conținut vertical, adaptat tendințelor, care te ajută să crești rapid." },
          { icon: "captions", color: "blue", title: "Subtitrări profesionale", text: "Subtitrări animate, moderne, pentru un mesaj clar și accesibil tuturor." },
          { icon: "sparkles", color: "purple", title: "Motion graphics", text: "Elemente grafice animate pentru un look profesionist și memorabil." },
        ],
      },
      {
        type: "video-examples",
        title: "Exemple de videoclipuri",
        sub: "O selecție de proiecte video create pentru branduri din industrii diferite.",
        items: [
          { title: "Reels de produs", tag: "Cosmetică & Beauty", duration: "0:28", tone: "from-[#f1d3b5] via-[#d8a982] to-[#6b4430]" },
          { title: "Reclamă video", tag: "Ecommerce", duration: "0:22", tone: "from-[#3b4250] via-[#6b7280] to-[#1f2937]", caption: "CONFORT ÎN FIECARE PAS" },
          { title: "TikTok / Shorts", tag: "HoReCa", duration: "0:18", tone: "from-[#c89b6d] via-[#7b4a2a] to-[#2b170c]" },
          { title: "Clip de produs", tag: "Mobilier & Home Decor", duration: "0:25", tone: "from-[#efe6da] via-[#d9c7ae] to-[#a98a62]", caption: "Design modern pentru casa ta" },
        ],
      },
      {
        type: "process",
        title: STD_PROCESS_TITLE,
        sub: "Un proces simplu și clar, de la idee la rezultatul final.",
        steps: [
          { icon: "file", color: "blue", title: "Brief & obiective", text: "Înțelegem nevoile tale, publicul țintă și scopul videoclipurilor." },
          { icon: "upload", color: "blue", title: "Materiale", text: "Ne trimiți filmările, pozele și alte resurse relevante." },
          { icon: "scissors", color: "pink", title: "Montaj & editare", text: "Edităm profesionist, adăugăm efecte, text, subtitrări și muzică." },
          { icon: "chat", color: "purple", title: "Review & feedback", text: "Primești varianta pentru revizuire și îți implementăm feedback-ul." },
          { icon: "send", color: "green", title: "Livrare finală", text: "Primești fișierele în formatele potrivite pentru toate platformele." },
        ],
      },
      {
        type: "why",
        title: "De ce să alegi editare video cu MAVA Studio?",
        sub: "Videoclipuri care nu doar arată bine, ci aduc rezultate reale.",
        items: [
          { icon: "zap", color: "red", title: "Mai mult engagement", text: "Clipuri dinamice care opresc derularea și captează atenția." },
          { icon: "bars", color: "blue", title: "Mesaj clar și eficient", text: "Transmitem ideea ta rapid și memorabil, prin storytelling vizual." },
          { icon: "sparkles", color: "purple", title: "Consecvență de brand", text: "Un stil unitar, adaptat identității vizuale a brandului tău." },
          { icon: "trending", color: "green", title: "Mai multe conversii", text: "Video care inspiră încredere și transformă spectatorii în clienți." },
        ],
      },
    ],
    cta: { title: "Gata să transformăm ideile tale în videoclipuri captivante?", text: "Scrie-ne și hai să discutăm despre următorul tău proiect video.", button: "Pornește un proiect" },
  },
  {
    slug: "administrare-social-media",
    category: "social",
    menuTitle: "Administrare social media",
    icon: "megaphone",
    color: "green",
    short: "Strategie, conținut și promovare pentru creșterea prezenței tale online.",
    eyebrow: ["Servicii", "Administrare social media"],
    title: { before: "Social media care", highlight: "crește brandul tău." },
    lead: "Ne ocupăm de strategie, conținut, publicare și raportare pe Facebook, Instagram, TikTok și LinkedIn, ca tu să te poți concentra pe afacere.",
    secondary: { label: "Vezi portofoliul", href: "/proiecte" },
    stats: [
      { value: "30+", label: "Branduri administrate" },
      { value: "98%", label: "Clienți mulțumiți" },
      { value: "3x", label: "Mai mult engagement" },
    ],
    hero: "social",
    metaDescription: "Administrare social media: strategie, calendar editorial, copywriting, design, Reels, publicare și raportare lunară.",
    sections: [
      {
        type: "cards",
        title: "Ce include",
        sub: "Tot ce ține de prezența ta în social media, gestionat de o singură echipă.",
        columns: 3,
        items: [
          { icon: "target", color: "blue", title: "Strategie de conținut", text: "Definim obiectivele, publicul și pilonii de conținut potriviți brandului tău." },
          { icon: "calendar", color: "purple", title: "Calendar editorial", text: "Planificăm lunar postările, Reels-urile și campaniile, cu aprobarea ta." },
          { icon: "type", color: "pink", title: "Copywriting", text: "Texte clare, pe tonul brandului, care invită la interacțiune." },
          { icon: "palette", color: "blue", title: "Design & Reels", text: "Postări, carusele, stories și Reels create special pentru fiecare platformă." },
          { icon: "send", color: "green", title: "Publicare & comunitate", text: "Programăm conținutul și răspundem comunității în timp util." },
          { icon: "pie", color: "purple", title: "Raportare & analiză", text: "Raport lunar cu rezultate, concluzii și recomandări pentru luna următoare." },
        ],
      },
      {
        type: "process",
        title: STD_PROCESS_TITLE,
        sub: "Un flux clar, cu aprobarea ta la fiecare pas important.",
        steps: [
          { icon: "bulb", color: "blue", title: "Idee & strategie", text: "Stabilim direcția, temele și formatele pentru luna următoare." },
          { icon: "pencil", color: "purple", title: "Copy & design", text: "Scriem textele și creăm vizualurile și clipurile." },
          { icon: "check", color: "pink", title: "Review & aprobare", text: "Verificăm intern, apoi tu aprobi conținutul înainte de publicare." },
          { icon: "bars", color: "green", title: "Publicare & raport", text: "Publicăm conform calendarului și măsurăm rezultatele." },
        ],
      },
      {
        type: "why",
        title: "De ce să lucrezi cu MAVA Studio?",
        sub: "Conținut consecvent, creat de o echipă care face și video, și design, și strategie.",
        items: [
          { icon: "repeat", color: "blue", title: "Consecvență", text: "Postări regulate, fără pauze și fără stres pentru tine." },
          { icon: "film", color: "red", title: "Video in-house", text: "Reels și TikTok editate de echipa noastră de video." },
          { icon: "sparkles", color: "purple", title: "Vizualuri cu AI", text: "Imagini de produs create rapid, fără ședințe foto costisitoare." },
          { icon: "trending", color: "green", title: "Rezultate măsurabile", text: "Raportăm lunar ce funcționează și optimizăm continuu." },
        ],
      },
    ],
    cta: { title: "Gata să crești în social media?", text: "Hai să construim împreună o prezență online consecventă și memorabilă.", button: "Programează o consultație gratuită" },
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

/** Serviciile în limba cerută (slug-ul rămâne cel intern, în română). */
export function getServices(locale: "ro" | "en" = "ro"): Service[] {
  return locale === "en" ? SERVICES_EN : SERVICES;
}
export function getLocalizedService(slug: string, locale: "ro" | "en" = "ro") {
  return getServices(locale).find((s) => s.slug === slug) ?? null;
}
