import type { BlogPost } from "@/content/demo";
import { BLOG_AUTHOR, BLOG_CATEGORIES, type FileArticle } from "./types";

/**
 * Programul de publicare: primul articol pe 11.11.2026, apoi luni, miercuri și vineri,
 * la 08:00 ora României. Ordinea din listă este ordinea de publicare.
 */
const START = Date.UTC(2026, 10, 11, 6, 0, 0); // miercuri, 11 noiembrie 2026, 08:00 (UTC+2)
const DAY = 24 * 60 * 60 * 1000;
const PUBLISH_DAYS = new Set([1, 3, 5]); // luni, miercuri, vineri

export function publishDates(count: number): string[] {
  const out: string[] = [];
  for (let t = START; out.length < count; t += DAY) {
    if (PUBLISH_DAYS.has(new Date(t).getUTCDay())) out.push(new Date(t).toISOString());
  }
  return out;
}

/** Transformă articolele din fișiere în formatul folosit de blog (inclusiv cele programate). */
export function toBlogPosts(articles: FileArticle[]): BlogPost[] {
  const dates = publishDates(articles.length);
  return articles.map((a, i) => ({
    id: `file:${a.slug}`,
    slug: a.slug,
    title: a.ro.title,
    excerpt: a.ro.excerpt,
    content: a.ro.content,
    cover_url: null,
    category: BLOG_CATEGORIES[a.category].ro,
    tags: a.tags,
    author_name: BLOG_AUTHOR.name,
    published_at: dates[i]!,
    seo_title: a.ro.seoTitle,
    seo_description: a.ro.description,
    translations: {
      en: {
        title: a.en.title,
        excerpt: a.en.excerpt,
        content: a.en.content,
        category: BLOG_CATEGORIES[a.category].en,
        seo_title: a.en.seoTitle,
        seo_description: a.en.description,
      },
    },
  }));
}
