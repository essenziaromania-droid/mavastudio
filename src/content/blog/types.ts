/**
 * Articolele de blog scrise în cod (pe lângă cele adăugate din CRM).
 * Fiecare articol are un fișier în ./posts, cu varianta în română și în engleză.
 *
 * Reguli pentru conținut (Markdown):
 *  - fără backtick-uri și fără „${”, pentru că textul stă într-un template literal;
 *  - linkurile interne se scriu cu adresa românească (/servicii/..., /preturi, /blog/...) în ambele variante;
 *    în engleză sunt transformate automat în /en/services/..., /en/pricing, /en/blog/...;
 *  - un articol trimite doar spre articole publicate ÎNAINTEA lui (cele de mai sus în listă),
 *    ca linkurile să nu ducă la pagini încă nepublicate;
 *  - secțiunea de întrebări frecvente are titlul „## Întrebări frecvente” / „## Frequently asked questions”
 *    și întrebările ca „### ...”; din ea se generează automat datele FAQ pentru Google și motoarele AI.
 */

export type BlogCategory = "website" | "ecommerce" | "seo" | "social" | "video" | "ai" | "crm" | "saas" | "business";

export const BLOG_CATEGORIES: Record<BlogCategory, { ro: string; en: string }> = {
  website: { ro: "Site-uri", en: "Websites" },
  ecommerce: { ro: "Magazine online", en: "Online stores" },
  seo: { ro: "SEO & GEO", en: "SEO & GEO" },
  social: { ro: "Social media", en: "Social media" },
  video: { ro: "Video", en: "Video" },
  ai: { ro: "Conținut AI", en: "AI content" },
  crm: { ro: "CRM & automatizări", en: "CRM & automation" },
  saas: { ro: "Aplicații web", en: "Web apps" },
  business: { ro: "Afaceri online", en: "Online business" },
};

export type ArticleLang = {
  title: string;
  /** Titlul din Google (max ~60 de caractere). */
  seoTitle: string;
  /** Descrierea din Google (max ~155 de caractere). */
  description: string;
  /** Rezumatul afișat sub titlu și în lista de articole. */
  excerpt: string;
  content: string;
};

export type FileArticle = {
  slug: string;
  category: BlogCategory;
  tags: string[];
  ro: ArticleLang;
  en: ArticleLang;
};

export const BLOG_AUTHOR = {
  name: "Marius Ungureanu",
  role: { ro: "Fondator MAVA Studio", en: "Founder, MAVA Studio" },
  photo: "/images/fondator.jpg",
};
