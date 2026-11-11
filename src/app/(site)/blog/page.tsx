import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/public-data";
import { CtaBand, Eyebrow } from "@/components/site/sections";
import { formatDate } from "@/lib/utils";
import { readingTime } from "@/lib/markdown";
import { BlogCover } from "@/components/site/blog-cover";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

const T = {
  ro: {
    metaDescription: "Ghiduri practice despre site-uri, magazine online, SEO, social media, video, conținut AI și CRM pentru afaceri mici și mijlocii, scrise de Marius Ungureanu, MAVA Studio.",
    eyebrow: ["Blog", "Idei", "Ghiduri"],
    lead: "Ghiduri practice, pe înțelesul oricui, despre site-uri, magazine online, SEO, social media, video, conținut AI și programe pentru afaceri.",
    empty: "În curând publicăm primele articole.",
    readArticle: "Citește articolul", read: "Citește",
    cta: ["Ai o idee de proiect?", "Scrie-ne și primești în 24 de ore o recomandare gratuită, cu preț și termen."],
  },
  en: {
    metaDescription: "Practical guides on websites, online stores, SEO, social media, video, AI content and CRM for small and medium businesses, by Marius Ungureanu, MAVA Studio.",
    eyebrow: ["Blog", "Ideas", "Guides"],
    lead: "Practical, plain-language guides on websites, online stores, SEO, social media, video, AI content and business software.",
    empty: "Articles coming soon.",
    readArticle: "Read the article", read: "Read",
    cta: ["Have a project idea?", "Write to us and get a free recommendation within 24 hours, with price and timeline."],
  },
};

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/blog", locale, { title: "Blog", description: T[locale].metaDescription });
}

function Cover({ src, title, category, feature }: { src?: string | null; title: string; category?: string | null; feature?: boolean }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />;
  }
  return <BlogCover title={title} category={category} size={feature ? "feature" : "card"} className="transition duration-500 group-hover:scale-[1.02]" />;
}

export default async function BlogPage() {
  const locale = getLocale();
  const t = T[locale];
  const l = (p: string) => localePath(p, locale);
  const posts = await getPosts(locale);
  const [first, ...rest] = posts;
  return (
    <>
      <section className="bg-hero-soft">
        <div className="container py-14">
          <Eyebrow parts={t.eyebrow} />
          <h1 className="text-5xl font-extrabold md:text-6xl">
            Blog <span className="text-gradient">MAVA Studio</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-body">{t.lead}</p>
        </div>
      </section>

      <section className="section pt-10">
        <div className="container">
          {!first && <p className="py-20 text-center text-body">{t.empty}</p>}
          {first && (
            <Link href={l(`/blog/${first.slug}`)} className="card group mb-10 grid overflow-hidden card-hover md:grid-cols-2">
              <div className="aspect-[16/10] overflow-hidden md:aspect-auto"><Cover src={first.cover_url} title={first.title} category={first.category} feature /></div>
              <div className="flex flex-col justify-center p-8">
                <p className="eyebrow">{first.category} · {formatDate(first.published_at, false, locale)} · {readingTime(first.content)} min</p>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight">{first.title}</h2>
                <p className="mt-3 text-body">{first.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-blue">{t.readArticle} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link key={p.slug} href={l(`/blog/${p.slug}`)} className="card group flex flex-col overflow-hidden card-hover">
                <div className="aspect-[16/9] overflow-hidden border-b border-line"><Cover src={p.cover_url} title={p.title} category={p.category} /></div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow">{p.category} · {formatDate(p.published_at, false, locale)}</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-body">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">{t.read} <ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
