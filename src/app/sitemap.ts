import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";
import { getPortfolio, getPosts } from "@/lib/public-data";
import { localePath } from "@/lib/i18n";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, postsEn] = await Promise.all([getPortfolio(), getPosts(), getPosts("en")]);
  const enSlugs = new Set(postsEn.map((p) => p.slug));
  const u = (p: string) => `${SITE.url}${p}`;

  /** O pagină în ambele limbi, cu link-urile hreflang între ele. */
  const both = (roPath: string, extra: Omit<Entry, "url" | "alternates">): Entry[] => {
    const ro = u(roPath === "/" ? "" : roPath);
    const en = u(localePath(roPath, "en"));
    const alternates = { languages: { ro, en, "x-default": ro } };
    return [{ url: ro, alternates, ...extra }, { url: en, alternates, ...extra }];
  };

  return [
    ...["/", "/servicii", "/proiecte", "/despre-noi", "/contact", "/incepe-un-proiect", "/blog"].flatMap((p) =>
      both(p, { changeFrequency: "weekly", priority: p === "/" ? 1 : 0.8 }),
    ),
    ...SERVICES.flatMap((s) => both(`/servicii/${s.slug}`, { changeFrequency: "monthly", priority: 0.8 })),
    ...projects.flatMap((p) => both(`/proiecte/${p.slug}`, { changeFrequency: "monthly", priority: 0.6 })),
    ...posts.flatMap((p) => {
      const extra = { lastModified: p.published_at ?? undefined, changeFrequency: "monthly" as const, priority: 0.6 };
      return enSlugs.has(p.slug) ? both(`/blog/${p.slug}`, extra) : [{ url: u(`/blog/${p.slug}`), ...extra }];
    }),
  ];
}
