import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/public-data";
import { CtaBand, Eyebrow } from "@/components/site/sections";
import { formatDate } from "@/lib/utils";
import { readingTime } from "@/lib/markdown";
import { LogoMark } from "@/components/ui/logo";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

const T = {
  ro: {
    metaDescription: "Articole despre website-uri, SaaS, CRM, conținut AI, video și social media, de la echipa MAVA Studio.",
    eyebrow: ["Blog", "Idei", "Ghiduri"],
    lead: "Idei, ghiduri și noutăți despre website-uri, platforme SaaS, CRM, conținut AI, video și social media.",
    empty: "În curând publicăm primele articole.",
    readArticle: "Citește articolul", read: "Citește",
    cta: ["Ai o idee de proiect?", "Hai să discutăm cum o putem transforma într-un produs digital de succes."],
  },
  en: {
    metaDescription: "Articles about websites, SaaS, CRM, AI content, video and social media from the MAVA Studio team.",
    eyebrow: ["Blog", "Ideas", "Guides"],
    lead: "Ideas, guides and news about websites, SaaS platforms, CRM, AI content, video and social media.",
    empty: "Articles coming soon.",
    readArticle: "Read the article", read: "Read",
    cta: ["Have a project idea?", "Let's talk about how we can turn it into a successful digital product."],
  },
};

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/blog", locale, { title: "Blog", description: T[locale].metaDescription });
}

function Cover({ src, title, category }: { src?: string | null; title: string; category?: string | null }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />;
  }
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-fuchsia-50">
      <div aria-hidden className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-200 to-purple-200" />
      <div className="relative flex flex-col items-center gap-2">
        <LogoMark className="h-10" />
        {category && <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-blue shadow-sm">{category}</span>}
      </div>
    </div>
  );
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
              <div className="aspect-[16/10] overflow-hidden md:aspect-auto"><Cover src={first.cover_url} title={first.title} category={first.category} /></div>
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
