import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { getPortfolio, getPortfolioItem } from "@/lib/public-data";
import { CtaBand } from "@/components/site/sections";
import { ProjectVisual } from "@/components/site/mockups";
import { ProjectCard } from "@/components/site/project-card";
import { IconTile } from "@/components/ui/icon";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

const T = {
  ro: {
    caseStudy: "Studiu de caz", all: "Toate proiectele", client: "Client", live: "Vezi site-ul live",
    problem: "Problema", solution: "Soluția", result: "Rezultatul", features: "Funcționalități", tech: "Tehnologii",
    gallery: "Galerie", others: "Alte proiecte", seeAll: "Vezi toate",
    cta: ["Vrei un proiect asemănător?", "Spune-ne ce ai în minte și revenim cu o propunere personalizată."],
  },
  en: {
    caseStudy: "Case study", all: "All projects", client: "Client", live: "View live site",
    problem: "The problem", solution: "The solution", result: "The result", features: "Features", tech: "Technologies",
    gallery: "Gallery", others: "More projects", seeAll: "View all",
    cta: ["Want a similar project?", "Tell us what you have in mind and we'll get back to you with a tailored proposal."],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const locale = getLocale();
  const p = await getPortfolioItem(params.slug, locale);
  if (!p) return {};
  return pageMeta(`/proiecte/${p.slug}`, locale, {
    title: `${p.title} – ${T[locale].caseStudy}`,
    description: p.summary ?? undefined,
    images: p.cover_url ? [p.cover_url] : undefined,
  });
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const t = T[locale];
  const p = await getPortfolioItem(params.slug, locale);
  if (!p) notFound();
  const others = (await getPortfolio(locale)).filter((x) => x.slug !== p.slug).slice(0, 3);

  const blocks = [
    { key: t.problem, icon: "target", color: "red" as const, text: p.problem },
    { key: t.solution, icon: "bulb", color: "blue" as const, text: p.solution },
    { key: t.result, icon: "trending", color: "green" as const, text: p.results },
  ].filter((b) => b.text);

  return (
    <>
      <section className="bg-hero-soft">
        <div className="container py-12 lg:py-16">
          <Link href={localePath("/proiecte", locale)} className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue">
            <ArrowLeft className="h-4 w-4" /> {t.all}
          </Link>
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow">{t.caseStudy} · {p.subtitle}</p>
              <h1 className="mt-3 text-5xl font-extrabold md:text-6xl">{p.title}</h1>
              {p.client_name && <p className="mt-2 text-body">{t.client}: <b className="text-ink">{p.client_name}</b></p>}
              <p className="mt-5 text-lg leading-relaxed text-body">{p.summary}</p>
              {!!p.metrics?.length && (
                <div className="mt-8 flex flex-wrap gap-8">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-display text-3xl font-extrabold text-gradient">{m.value}</div>
                      <div className="text-sm text-body">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {p.live_url && (
                <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn-outline mt-8">
                  {t.live} <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="aspect-[16/10] overflow-hidden rounded-3xl shadow-card-hover ring-1 ring-line">
              {p.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover" />
              ) : (
                <ProjectVisual visual={p.visual} title={p.title} lang={locale} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {blocks.map((b) => (
              <div key={b.key} className="card flex gap-5 p-7">
                <IconTile name={b.icon} color={b.color} />
                <div>
                  <h2 className="text-xl font-bold">{b.key}</h2>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-body">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
          <aside className="space-y-6">
            {!!p.features?.length && (
              <div className="card p-7">
                <h3 className="text-lg font-bold">{t.features}</h3>
                <ul className="mt-4 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!!p.technologies?.length && (
              <div className="card p-7">
                <h3 className="text-lg font-bold">{t.tech}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.technologies.map((x) => (
                    <span key={x} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand-blue">{x}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {!!p.gallery?.length && (
        <section className="section pt-0">
          <div className="container">
            <h2 className="mb-8 text-3xl font-extrabold">{t.gallery}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {p.gallery.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt={p.title} className="w-full rounded-2xl border border-line object-cover shadow-card" loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section pt-0">
          <div className="container">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-3xl font-extrabold">{t.others}</h2>
              <Link href={localePath("/proiecte", locale)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">{t.seeAll} <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">{others.map((o) => <ProjectCard key={o.slug} p={o} locale={locale} />)}</div>
          </div>
        </section>
      )}

      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
