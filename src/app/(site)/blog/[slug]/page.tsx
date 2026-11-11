import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ListOrdered } from "lucide-react";
import { getPost, getPosts } from "@/lib/public-data";
import { readingTime } from "@/lib/markdown";
import { prepareArticle, wordCount } from "@/lib/article";
import { CtaBand } from "@/components/site/sections";
import { BlogCover } from "@/components/site/blog-cover";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/content/site";
import { BLOG_AUTHOR } from "@/content/blog/types";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

const T = {
  ro: {
    all: "Toate articolele", blog: "Blog", home: "Acasă", minRead: "min de citit", by: "Scris de", toc: "Cuprins", more: "Citește și",
    aboutAuthor: "Despre autor",
    authorBio: "Marius Ungureanu este fondatorul MAVA Studio. Construiește site-uri, magazine online și programe pentru afaceri și se ocupă de conținutul și social media clienților săi. Scrie aici din ce vede zilnic în proiecte reale.",
    authorLink: "Mai multe despre MAVA Studio",
    cta: ["Ai nevoie de ajutor cu proiectul tău?", "Scrie-ne și primești în 24 de ore o recomandare gratuită, cu preț și termen."],
  },
  en: {
    all: "All articles", blog: "Blog", home: "Home", minRead: "min read", by: "Written by", toc: "Contents", more: "Read next",
    aboutAuthor: "About the author",
    authorBio: "Marius Ungureanu is the founder of MAVA Studio. He builds websites, online stores and business software, and runs content and social media for his clients. He writes here about what he sees every day in real projects.",
    authorLink: "More about MAVA Studio",
    cta: ["Need help with your project?", "Write to us and get a free recommendation within 24 hours, with price and timeline."],
  },
};

const ogImage = (slug: string, locale: string) => `${SITE.url}/og/${slug}?lang=${locale}`;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const locale = getLocale();
  const p = await getPost(params.slug, locale);
  if (!p) return {};
  const meta = pageMeta(`/blog/${p.slug}`, locale, { title: p.seo_title || p.title, description: p.seo_description || p.excerpt || undefined });
  // Articolele fără traducere există doar în română: nu anunțăm o variantă în engleză inexistentă.
  const hasEn = !!(await getPost(params.slug, "en"));
  if (!hasEn && meta.alternates) meta.alternates = { canonical: meta.alternates.canonical };
  const image = p.cover_url || ogImage(p.slug, locale);
  return {
    ...meta,
    keywords: p.tags,
    authors: [{ name: p.author_name || BLOG_AUTHOR.name, url: `${SITE.url}${localePath("/despre-noi", locale)}` }],
    openGraph: {
      ...meta.openGraph,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: p.title }],
      publishedTime: p.published_at ?? undefined,
      authors: [p.author_name || BLOG_AUTHOR.name],
      section: p.category ?? undefined,
      tags: p.tags,
    },
    twitter: { card: "summary_large_image", title: p.seo_title || p.title, description: p.seo_description || p.excerpt || undefined, images: [image] },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const t = T[locale];
  const l = (path: string) => localePath(path, locale);
  const p = await getPost(params.slug, locale);
  if (!p) notFound();

  const all = (await getPosts(locale)).filter((x) => x.slug !== p.slug);
  const more = [...all.filter((x) => x.category === p.category), ...all.filter((x) => x.category !== p.category)].slice(0, 3);
  const { html, toc, faq } = prepareArticle(p.content, locale);
  const url = `${SITE.url}${l(`/blog/${p.slug}`)}`;
  const author = p.author_name || BLOG_AUTHOR.name;
  const isMarius = author === BLOG_AUTHOR.name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: p.title,
        description: p.seo_description || p.excerpt || undefined,
        inLanguage: locale === "ro" ? "ro-RO" : "en",
        datePublished: p.published_at,
        dateModified: p.published_at,
        mainEntityOfPage: url,
        url,
        image: p.cover_url || ogImage(p.slug, locale),
        articleSection: p.category ?? undefined,
        keywords: p.tags?.join(", "),
        wordCount: wordCount(p.content),
        author: isMarius
          ? { "@type": "Person", name: author, jobTitle: BLOG_AUTHOR.role[locale], url: `${SITE.url}${l("/despre-noi")}`, worksFor: { "@type": "Organization", name: "MAVA Studio", url: SITE.url } }
          : { "@type": "Organization", name: author },
        publisher: { "@type": "Organization", name: "MAVA Studio", url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/logo-mark.png` } },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.home, item: `${SITE.url}${l("/")}` },
          { "@type": "ListItem", position: 2, name: t.blog, item: `${SITE.url}${l("/blog")}` },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
      ...(faq.length
        ? [{ "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article>
        <header className="bg-hero-soft">
          <div className="container max-w-3xl pb-10 pt-12">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-body">
              <Link href={l("/blog")} className="inline-flex items-center gap-2 font-medium text-brand-blue"><ArrowLeft className="h-4 w-4" /> {t.all}</Link>
            </nav>
            <p className="eyebrow mt-6">{p.category} · {formatDate(p.published_at, false, locale)} · {readingTime(p.content)} {t.minRead}</p>
            <h1 className="mt-3 text-[2.1rem] font-extrabold leading-tight md:text-5xl">{p.title}</h1>
            {p.excerpt && <p className="mt-4 text-lg leading-relaxed text-body">{p.excerpt}</p>}
            <div className="mt-6 flex items-center gap-3">
              {isMarius && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={BLOG_AUTHOR.photo} alt={author} className="h-11 w-11 rounded-full object-cover ring-2 ring-white" />
              )}
              <p className="text-sm text-body">
                {t.by} <b className="text-ink">{author}</b>
                {isMarius && <span className="block text-xs text-muted">{BLOG_AUTHOR.role[locale]}</span>}
              </p>
            </div>
          </div>
        </header>

        <div className="container max-w-4xl">
          {p.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover_url} alt={p.title} className="-mt-2 w-full rounded-3xl shadow-card" />
          ) : (
            <div className="-mt-2 aspect-[1200/630] overflow-hidden rounded-3xl shadow-card">
              <BlogCover title={p.title} category={p.category} size="hero" />
            </div>
          )}
        </div>

        <div className="container max-w-3xl py-12">
          {toc.length > 2 && (
            <nav aria-label={t.toc} className="mb-10 rounded-2xl bg-soft p-6 ring-1 ring-line">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink"><ListOrdered className="h-4 w-4 text-brand-blue" /> {t.toc}</p>
              <ol className="mt-4 space-y-2 text-[15px]">
                {toc.map((h, i) => (
                  <li key={h.id} className="flex gap-3">
                    <span className="w-6 shrink-0 font-semibold text-brand-blue">{i + 1}.</span>
                    <a href={`#${h.id}`} className="text-ink-2 hover:text-brand-blue">{h.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="prose-mava text-[17px] [&_h2]:scroll-mt-24" dangerouslySetInnerHTML={{ __html: html }} />

          {!!p.tags?.length && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
              {p.tags.map((tag) => <span key={tag} className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-body">#{tag}</span>)}
            </div>
          )}

          {isMarius && (
            <aside className="mt-10 flex flex-col gap-5 rounded-2xl bg-gradient-to-r from-[#F2F4FF] to-[#F7EEFF] p-6 sm:flex-row sm:items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BLOG_AUTHOR.photo} alt={author} className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-white" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">{t.aboutAuthor}</p>
                <p className="mt-1 font-bold text-ink">{author} · {BLOG_AUTHOR.role[locale]}</p>
                <p className="mt-1 text-sm leading-relaxed text-body">{t.authorBio}</p>
                <Link href={l("/despre-noi")} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">{t.authorLink} <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </aside>
          )}
        </div>
      </article>

      {more.length > 0 && (
        <section className="container pb-12">
          <h2 className="mb-6 text-2xl font-extrabold">{t.more}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {more.map((m) => (
              <Link key={m.slug} href={l(`/blog/${m.slug}`)} className="card group flex flex-col overflow-hidden card-hover">
                <div className="aspect-[16/9] overflow-hidden">
                  {m.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.cover_url} alt={m.title} className="h-full w-full object-cover" />
                  ) : (
                    <BlogCover title={m.title} category={m.category} />
                  )}
                </div>
                <div className="p-5">
                  <p className="eyebrow">{m.category}</p>
                  <h3 className="mt-2 font-bold leading-snug">{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
