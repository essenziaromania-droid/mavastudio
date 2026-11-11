import "server-only";
import { cache } from "react";
import { hasSupabase } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import { DEMO_PORTFOLIO, DEMO_POSTS, type BlogPost, type PortfolioItem } from "@/content/demo";
import { FILE_POSTS } from "@/content/blog";
import type { Locale } from "@/lib/i18n";

export type SiteSettings = {
  email: string;
  phone: string;
  show_phone: boolean;
  schedule: string;
  /** Programul afișat pe site-ul în engleză. */
  schedule_en?: string;
  show_stats: boolean;
  stats: { value: string; label: string }[];
  /** Etichetele statisticilor în engleză (aceleași valori). */
  stats_en?: { value: string; label: string }[];
  socials: Partial<Record<"instagram" | "linkedin" | "youtube" | "tiktok" | "facebook", string>>;
};

export const DEFAULT_SITE: SiteSettings = {
  email: "contact@mavastudio.ro",
  phone: "",
  show_phone: false,
  schedule: "Luni – Vineri: 09:00 – 18:00",
  schedule_en: "Monday – Friday: 09:00 – 18:00 (EET)",
  show_stats: false,
  stats: [
    { value: "50+", label: "Proiecte livrate" },
    { value: "98%", label: "Clienți mulțumiți" },
    { value: "6", label: "Servicii principale" },
  ],
  stats_en: [
    { value: "50+", label: "Projects delivered" },
    { value: "98%", label: "Happy clients" },
    { value: "6", label: "Core services" },
  ],
  socials: {
    instagram: "https://www.instagram.com/mavastudioproduction?obrf=MW0zajNkNnBpaG9tcg==",
    linkedin: "https://www.linkedin.com/company/145406052",
    facebook: "https://www.facebook.com/profile.php?id=61596430070424",
  },
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!hasSupabase) return DEFAULT_SITE;
  try {
    const { data } = await createPublicClient().from("settings").select("value").eq("key", "site").maybeSingle();
    const stored = (data?.value as Partial<SiteSettings>) ?? {};
    return {
      ...DEFAULT_SITE,
      ...stored,
      socials: {
        ...stored.socials,
        instagram: stored.socials?.instagram || DEFAULT_SITE.socials.instagram,
        linkedin: stored.socials?.linkedin || DEFAULT_SITE.socials.linkedin,
        facebook: stored.socials?.facebook || DEFAULT_SITE.socials.facebook,
      },
    };
  } catch {
    return DEFAULT_SITE;
  }
});

/** Setările site-ului cu programul și statisticile în limba cerută. */
export async function getLocalizedSettings(locale: Locale): Promise<SiteSettings> {
  const s = await getSiteSettings();
  if (locale === "ro") return s;
  const stats = s.stats.map((x, i) => ({ value: x.value, label: s.stats_en?.[i]?.label || DEFAULT_SITE.stats_en?.[i]?.label || x.label }));
  return { ...s, schedule: s.schedule_en || DEFAULT_SITE.schedule_en!, stats };
}

/** Aplică traducerea în engleză peste un proiect; câmpurile goale rămân în română. */
function localizeProject(p: PortfolioItem, locale: Locale): PortfolioItem {
  const en = locale === "en" ? p.translations?.en : undefined;
  if (!en) return p;
  const pick = <T,>(v: T | null | undefined, fallback: T) => (v == null || v === "" || (Array.isArray(v) && !v.length) ? fallback : v);
  return {
    ...p,
    title: pick(en.title, p.title),
    subtitle: pick(en.subtitle, p.subtitle ?? null),
    summary: pick(en.summary, p.summary ?? null),
    problem: pick(en.problem, p.problem ?? null),
    solution: pick(en.solution, p.solution ?? null),
    results: pick(en.results, p.results ?? null),
    features: pick(en.features, p.features ?? []),
    metrics: pick(en.metrics, p.metrics ?? []),
  };
}

/** Articolul în engleză, sau null dacă nu are traducere. */
function localizePost(p: BlogPost, locale: Locale): BlogPost | null {
  if (locale === "ro") return p;
  const en = p.translations?.en;
  if (!en?.title || !en.content) return null;
  return {
    ...p,
    title: en.title,
    content: en.content,
    excerpt: en.excerpt || null,
    category: en.category || p.category,
    seo_title: en.seo_title || null,
    seo_description: en.seo_description || en.excerpt || null,
  };
}

const getPortfolioRaw = cache(async (): Promise<PortfolioItem[]> => {
  if (!hasSupabase) return DEMO_PORTFOLIO;
  try {
    const { data } = await createPublicClient()
      .from("portfolio_projects")
      .select("*")
      .eq("published", true)
      .order("sort")
      .order("created_at", { ascending: false });
    return data && data.length ? (data as PortfolioItem[]) : DEMO_PORTFOLIO;
  } catch {
    return DEMO_PORTFOLIO;
  }
});

export async function getPortfolio(locale: Locale = "ro"): Promise<PortfolioItem[]> {
  return (await getPortfolioRaw()).map((p) => localizeProject(p, locale));
}

export async function getPortfolioItem(slug: string, locale: Locale = "ro") {
  const all = await getPortfolio(locale);
  return all.find((p) => p.slug === slug) ?? null;
}

/** Articolele din CRM (baza de date). */
const getDbPosts = cache(async (): Promise<BlogPost[]> => {
  if (!hasSupabase) return [];
  try {
    const { data } = await createPublicClient()
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    return (data as BlogPost[] | null) ?? [];
  } catch {
    return [];
  }
});

/**
 * Articolele publicate: cele din CRM + cele scrise în cod (src/content/blog), doar cele cu data
 * de publicare trecută. La același slug câștigă varianta din CRM.
 */
const getPostsRaw = cache(async (): Promise<BlogPost[]> => {
  const now = Date.now();
  const db = await getDbPosts();
  const dbSlugs = new Set(db.map((p) => p.slug));
  const files = FILE_POSTS.filter((p) => !dbSlugs.has(p.slug) && new Date(p.published_at!).getTime() <= now);
  const all = [...db, ...files].sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());
  return all.length ? all : DEMO_POSTS;
});

/** Articolele publicate; în engleză doar cele traduse. */
export async function getPosts(locale: Locale = "ro"): Promise<BlogPost[]> {
  return (await getPostsRaw()).flatMap((p) => localizePost(p, locale) ?? []);
}

export async function getPost(slug: string, locale: Locale = "ro") {
  const all = await getPosts(locale);
  return all.find((p) => p.slug === slug) ?? null;
}
