import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost, getPosts } from "@/lib/public-data";
import { renderMarkdown, readingTime } from "@/lib/markdown";
import { CtaBand } from "@/components/site/sections";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/content/site";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

const T = {
  ro: {
    all: "Toate articolele", minRead: "min de citit", by: "de", team: "Echipa MAVA Studio", more: "Citește și",
    cta: ["Ai nevoie de ajutor cu proiectul tău?", "Scrie-ne și primești o recomandare gratuită de la echipa noastră."],
  },
  en: {
    all: "All articles", minRead: "min read", by: "by", team: "The MAVA Studio team", more: "Read next",
    cta: ["Need help with your project?", "Write to us and get a free recommendation from our team."],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const locale = getLocale();
  const p = await getPost(params.slug, locale);
  if (!p) return {};
  const meta = pageMeta(`/blog/${p.slug}`, locale, { title: p.seo_title || p.title, description: p.seo_description || p.excerpt || undefined });
  // Articolele fără traducere există doar în română: nu anunțăm o variantă în engleză inexistentă.
  const hasEn = !!(await getPost(params.slug, "en"));
  if (!hasEn && meta.alternates) meta.alternates = { canonical: meta.alternates.canonical };
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", images: p.cover_url ? [p.cover_url] : undefined, publishedTime: p.published_at ?? undefined },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const t = T[locale];
  const p = await getPost(params.slug, locale);
  if (!p) notFound();
  const more = (await getPosts(locale)).filter((x) => x.slug !== p.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    inLanguage: locale,
    datePublished: p.published_at,
    author: { "@type": "Organization", name: p.author_name ?? "MAVA Studio" },
    publisher: { "@type": "Organization", name: "MAVA Studio", url: SITE.url },
    image: p.cover_url ?? undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="bg-hero-soft">
          <div className="container max-w-3xl py-14">
            <Link href={localePath("/blog", locale)} className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue"><ArrowLeft className="h-4 w-4" /> {t.all}</Link>
            <p className="eyebrow mt-6">{p.category} · {formatDate(p.published_at, false, locale)} · {readingTime(p.content)} {t.minRead}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">{p.title}</h1>
            {p.excerpt && <p className="mt-4 text-lg text-body">{p.excerpt}</p>}
            <p className="mt-6 text-sm text-muted">{t.by} <b className="text-ink">{p.author_name && !(locale === "en" && p.author_name === "Echipa MAVA Studio") ? p.author_name : t.team}</b></p>
          </div>
        </header>
        {p.cover_url && (
          <div className="container max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover_url} alt={p.title} className="-mt-2 w-full rounded-3xl shadow-card" />
          </div>
        )}
        <div className="container max-w-3xl py-12">
          <div className="prose-mava text-[17px]" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }} />
          {!!p.tags?.length && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
              {p.tags.map((tag) => <span key={tag} className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-body">#{tag}</span>)}
            </div>
          )}
        </div>
      </article>
      {more.length > 0 && (
        <section className="container pb-12">
          <h2 className="mb-6 text-2xl font-extrabold">{t.more}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {more.map((m) => (
              <Link key={m.slug} href={localePath(`/blog/${m.slug}`, locale)} className="card p-6 card-hover">
                <p className="eyebrow">{m.category}</p>
                <h3 className="mt-2 font-bold leading-snug">{m.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
