import type { TileColor } from "@/components/ui/icon";
import type { Locale } from "@/lib/i18n";

/**
 * Textele de vânzare folosite pe mai multe pagini: grupele de servicii, „De ce MAVA”,
 * „Pentru cine lucrăm”, întrebări frecvente și „Ce urmează după ce ne scrii”.
 */

export type ServiceGroup = {
  icon: string;
  color: TileColor;
  title: string;
  text: string;
  bullets: string[];
  /** Slug-urile românești ale serviciilor din grupă. */
  services: string[];
};

export type Card = { icon: string; color: TileColor; title: string; text: string };

const RO = {
  groupsTitle: ["Cu ce te ajutăm", "Trei lucruri de care are nevoie orice afacere în online. Le poți lua separat sau pe toate, de la același partener."],
  groups: [
    {
      icon: "monitor",
      color: "blue",
      title: "Site sau magazin online",
      text: "Locul unde clienții te găsesc, află ce oferi și te contactează sau cumpără.",
      bullets: ["Site de prezentare pentru firmă", "Magazin online cu plată cu cardul", "Pagină pentru o campanie sau un produs"],
      services: ["dezvoltare-website-uri"],
    },
    {
      icon: "megaphone",
      color: "purple",
      title: "Conținut și social media",
      text: "Poze, clipuri și postări care îți fac produsele și serviciile să arate bine și să fie văzute.",
      bullets: ["Poze și clipuri de produs fără ședință foto", "Clipuri scurte pentru Reels, TikTok, YouTube", "Postări lunare pe Facebook, Instagram, TikTok, LinkedIn"],
      services: ["foto-video-produs-ai", "editare-video", "administrare-social-media"],
    },
    {
      icon: "settings",
      color: "green",
      title: "Programe pentru afacerea ta",
      text: "Când crești, îți construim aplicația potrivită ca să lucrezi organizat și să pierzi mai puțin timp.",
      bullets: ["Evidența clienților, ofertelor și contractelor", "Facturare și sarcini repetitive făcute automat", "Aplicații web și platforme cu abonament"],
      services: ["crm-automatizari", "platforme-saas"],
    },
  ] as ServiceGroup[],
  why: ["De ce MAVA Studio", "Ce primești în plus față de un freelancer sau o agenție mare."],
  whyItems: [
    { icon: "layers", color: "blue", title: "Un singur partener pentru tot", text: "Site, conținut și social media făcute de aceeași mână, cu același stil. Nu mai alergi după trei colaboratori diferiți." },
    { icon: "users", color: "purple", title: "Vorbești direct cu cel care lucrează", text: "Fără intermediari și fără „revin”. Discuți direct cu Marius, fondatorul studioului, de la ofertă până la lansare." },
    { icon: "eye", color: "green", title: "Vezi tot ce se întâmplă", text: "Ofertă și contract semnate online, plus un portal unde urmărești proiectul, fișierele și facturile." },
    { icon: "card", color: "orange", title: "Prețuri clare de la început", text: "Ai prețurile orientative pe site, iar în ofertă vezi exact ce primești și ce nu e inclus." },
  ] as Card[],
  audience: ["Pentru cine lucrăm", "Afaceri mici și mijlocii care vor să arate profesionist în online și să primească mai multe cereri."],
  audienceItems: [
    { icon: "cart", color: "blue", title: "Magazine și branduri de produse", text: "Magazin online, poze de produs și clipuri pentru reclame." },
    { icon: "heart", color: "pink", title: "Clinici, cabinete și terapeuți", text: "Un site de încredere, programări și informații clare pentru pacienți." },
    { icon: "award", color: "purple", title: "Antrenori, nutriționiști, branduri personale", text: "Site personal, conținut constant și o comunitate care crește." },
    { icon: "calendar", color: "green", title: "Evenimente și servicii locale", text: "Site, galerie și postări care aduc rezervări și cereri de ofertă." },
  ] as Card[],
  testimonials: ["Ce spun clienții", "Păreri de la oamenii cu care am lucrat."],
  faqTitle: ["Întrebări frecvente", "Ce ne întreabă cel mai des clienții înainte să înceapă."],
  faq: [
    ["Cât costă?", "Depinde de ce ai nevoie, dar pe pagina Prețuri găsești prețurile de pornire pentru fiecare serviciu. După o discuție scurtă primești o ofertă exactă, fără costuri ascunse."],
    ["Cât durează?", "Un landing page e gata în 3 zile lucrătoare, un site de prezentare în 7–15 zile lucrătoare, iar un magazin online în 15–30 de zile lucrătoare. Pozele și clipurile cu AI le primești în 7 zile lucrătoare, iar un CRM sau o platformă web durează 30–60 de zile. Termenul exact e scris în ofertă."],
    ["Ce trebuie să pregătesc?", "Ideal: logo, câteva texte despre afacere, poze dacă ai și exemple de site-uri care îți plac. Dacă nu ai nimic din acestea, te ajutăm noi cu textele, pozele și designul."],
    ["Ce se întâmplă după lansare?", "Nu te lăsăm singur. Oferim mentenanță lunară (actualizări, copii de siguranță, mici modificări), iar dacă vrei, ne ocupăm și de conținut și social media."],
    ["Cu cine lucrez efectiv?", "Lucrezi direct cu Marius Ungureanu, fondatorul MAVA Studio. Ai un singur om de contact care cunoaște tot proiectul."],
    ["Pot începe cu ceva mic?", "Da. Mulți clienți încep cu un site sau cu un pachet de social media și adaugă alte servicii pe parcurs."],
  ] as [string, string][],
  next: ["Ce urmează după ce ne scrii", "Simplu și fără obligații."],
  nextSteps: [
    { icon: "send", color: "blue", title: "Ne spui ce ai nevoie", text: "Completezi formularul în 2 minute sau ne scrii direct." },
    { icon: "phone", color: "purple", title: "Te contactăm în 24 de ore", text: "În zilele lucrătoare, pentru o discuție scurtă și gratuită." },
    { icon: "file", color: "pink", title: "Primești oferta", text: "Cu preț, termen și exact ce primești. O semnezi online dacă ești de acord." },
  ] as Card[],
};

const EN: typeof RO = {
  groupsTitle: ["How we help", "Three things every business needs online. Take one or all of them, from the same partner."],
  groups: [
    {
      icon: "monitor",
      color: "blue",
      title: "Website or online store",
      text: "The place where customers find you, learn what you offer and get in touch or buy.",
      bullets: ["Business website", "Online store with card payments", "Landing page for a campaign or product"],
      services: ["dezvoltare-website-uri"],
    },
    {
      icon: "megaphone",
      color: "purple",
      title: "Content and social media",
      text: "Photos, videos and posts that make your products and services look good and get seen.",
      bullets: ["Product photos and videos without a photo shoot", "Short videos for Reels, TikTok, YouTube", "Monthly posts on Facebook, Instagram, TikTok, LinkedIn"],
      services: ["foto-video-produs-ai", "editare-video", "administrare-social-media"],
    },
    {
      icon: "settings",
      color: "green",
      title: "Software for your business",
      text: "As you grow, we build the right app so you can work in an organised way and waste less time.",
      bullets: ["Track clients, proposals and contracts", "Invoicing and repetitive tasks done automatically", "Web apps and subscription platforms"],
      services: ["crm-automatizari", "platforme-saas"],
    },
  ],
  why: ["Why MAVA Studio", "What you get compared with a freelancer or a big agency."],
  whyItems: [
    { icon: "layers", color: "blue", title: "One partner for everything", text: "Website, content and social media made by the same hands, in the same style. No more chasing three different contractors." },
    { icon: "users", color: "purple", title: "Talk directly to the person doing the work", text: "No middlemen. You work directly with Marius, the studio's founder, from proposal to launch." },
    { icon: "eye", color: "green", title: "See everything that's happening", text: "Proposal and contract signed online, plus a portal where you follow the project, files and invoices." },
    { icon: "card", color: "orange", title: "Clear prices from the start", text: "Starting prices are on the website, and the proposal shows exactly what's included and what isn't." },
  ],
  audience: ["Who we work with", "Small and medium businesses that want to look professional online and get more enquiries."],
  audienceItems: [
    { icon: "cart", color: "blue", title: "Shops and product brands", text: "Online store, product photos and videos for ads." },
    { icon: "heart", color: "pink", title: "Clinics, practices and therapists", text: "A trustworthy website, bookings and clear information for patients." },
    { icon: "award", color: "purple", title: "Coaches, nutritionists, personal brands", text: "A personal website, consistent content and a growing community." },
    { icon: "calendar", color: "green", title: "Events and local services", text: "Website, gallery and posts that bring bookings and quote requests." },
  ],
  testimonials: ["What clients say", "Feedback from the people we've worked with."],
  faqTitle: ["Frequently asked questions", "What clients ask us most often before getting started."],
  faq: [
    ["How much does it cost?", "It depends on what you need, but the Pricing page shows starting prices for every service. After a short call you get an exact proposal, with no hidden costs."],
    ["How long does it take?", "A landing page is ready in 3 working days, a business website in 7–15 working days and an online store in 15–30 working days. AI photos and videos are delivered in 7 working days, and a CRM or web platform takes 30–60 days. The exact timeline is in the proposal."],
    ["What do I need to prepare?", "Ideally: your logo, a few lines about your business, photos if you have them and examples of websites you like. If you don't have any of these, we'll help with copy, photos and design."],
    ["What happens after launch?", "You're not on your own. We offer monthly maintenance (updates, backups, small changes), and we can also take care of content and social media."],
    ["Who will I actually work with?", "You work directly with Marius Ungureanu, the founder of MAVA Studio. One point of contact who knows the whole project."],
    ["Can I start small?", "Yes. Many clients start with a website or a social media package and add other services along the way."],
  ],
  next: ["What happens after you get in touch", "Simple and with no obligation."],
  nextSteps: [
    { icon: "send", color: "blue", title: "Tell us what you need", text: "Fill in the form in 2 minutes or write to us directly." },
    { icon: "phone", color: "purple", title: "We reply within 24 hours", text: "On working days, for a short, free call." },
    { icon: "file", color: "pink", title: "You get a proposal", text: "With price, timeline and exactly what's included. Sign it online if you agree." },
  ],
};

export const marketing = (l: Locale) => (l === "en" ? EN : RO);
