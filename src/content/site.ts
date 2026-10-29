import type { Locale } from "@/lib/i18n";

export const SITE = {
  name: "MAVA Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mavastudio.ro",
  email: "contact@mavastudio.ro",
  tagline: "Construim produse digitale care ajută afacerile să crească.",
  description:
    "MAVA Studio – website-uri, platforme SaaS, sisteme CRM, foto & video de produs cu AI, editare video și administrare social media. Totul într-un singur studio.",
};

const COPY = {
  ro: {
    defaultTitle: "MAVA Studio – Soluții digitale pentru afaceri moderne",
    tagline: SITE.tagline,
    description: SITE.description,
  },
  en: {
    defaultTitle: "MAVA Studio – Digital solutions for modern businesses",
    tagline: "We build digital products that help businesses grow.",
    description:
      "MAVA Studio – websites, SaaS platforms, CRM systems, AI product photo & video, video editing and social media management. All in one studio.",
  },
};
export const siteCopy = (l: Locale) => COPY[l];

/** Adresele sunt cele românești; se traduc în engleză cu localePath(). */
const NAV_LABELS = {
  ro: { "/": "Acasă", "/servicii": "Servicii", "/proiecte": "Proiecte", "/despre-noi": "Despre noi", "/contact": "Contact", "/blog": "Blog" },
  en: { "/": "Home", "/servicii": "Services", "/proiecte": "Projects", "/despre-noi": "About us", "/contact": "Contact", "/blog": "Blog" },
} as const;

export function nav(l: Locale) {
  const labels = NAV_LABELS[l];
  return (["/", "/servicii", "/proiecte", "/despre-noi", "/contact"] as const).map((href) => ({ href, label: labels[href] }));
}
export const blogLabel = (l: Locale) => NAV_LABELS[l]["/blog"];

/** Compatibilitate: meniul în română. */
export const NAV = nav("ro");

export const PROJECT_TYPES = [
  { value: "website", label: "Website", labelEn: "Website", icon: "globe" },
  { value: "ecommerce", label: "Magazin online", labelEn: "Online store", icon: "cart" },
  { value: "saas", label: "Platformă SaaS", labelEn: "SaaS platform", icon: "database" },
  { value: "crm", label: "CRM & Automatizări", labelEn: "CRM & Automation", icon: "users" },
  { value: "ai", label: "Foto & Video AI", labelEn: "AI Photo & Video", icon: "sparkles" },
  { value: "video", label: "Editare Video", labelEn: "Video Editing", icon: "play" },
  { value: "social", label: "Social Media", labelEn: "Social Media", icon: "megaphone" },
  { value: "altul", label: "Alt serviciu", labelEn: "Something else", icon: "bulb" },
] as const;

export const BUDGETS = ["Sub 2.500 lei", "2.500 – 5.000 lei", "5.000 – 10.000 lei", "10.000 – 25.000 lei", "25.000 – 50.000 lei", "Peste 50.000 lei", "Nu știu încă"];
export const DEADLINES = ["Cât mai repede", "În 2–4 săptămâni", "În 1–2 luni", "În 3 luni sau mai mult", "Flexibil"];

/** Clienții internaționali văd bugetele în euro. */
export const BUDGETS_EN = ["Under €500", "€500 – €1,000", "€1,000 – €2,000", "€2,000 – €5,000", "€5,000 – €10,000", "Over €10,000", "Not sure yet"];
export const DEADLINES_EN = ["As soon as possible", "In 2–4 weeks", "In 1–2 months", "In 3 months or more", "Flexible"];

export const budgets = (l: Locale) => (l === "en" ? BUDGETS_EN : BUDGETS);
export const deadlines = (l: Locale) => (l === "en" ? DEADLINES_EN : DEADLINES);
export const projectTypeLabel = (t: (typeof PROJECT_TYPES)[number], l: Locale) => (l === "en" ? t.labelEn : t.label);
