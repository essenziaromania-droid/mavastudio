import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPortfolio, getSiteSettings } from "@/lib/public-data";
import { CtaBand, Eyebrow } from "@/components/site/sections";
import { PortfolioGrid } from "@/components/site/portfolio-grid";
import { DashboardScreen, GrowthBadge, Laptop, Phone, WebsiteScreen } from "@/components/site/mockups";
import { IconTile } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

const T = {
  ro: {
    metaTitle: "Proiecte",
    metaDescription: "Portofoliul MAVA Studio: website-uri, platforme SaaS, CRM, conținut AI și social media, cu studii de caz detaliate.",
    eyebrow: ["Portofoliu", "Rezultate reale", "Clienți mulțumiți"],
    title: ["Proiecte", "care transformă ideile", "în", "succes digital."],
    lead: "O selecție din proiectele noastre recente, unde strategia, creativitatea și tehnologia s-au combinat pentru a livra produse digitale cu rezultate reale.",
    growth: ["creștere", "vânzări"],
    caseStudy: "Studiu de caz",
    caseTitle: ["— de la idee", "la o platformă scalabilă"],
    caseCta: "Vezi studiul complet",
    results: ["Rezultate care vorbesc de la sine", "Suntem mândri de impactul pe care îl avem în afacerile clienților noștri."],
    resultItems: [
      ["bars", "green", "+320%", "creștere conversii", "în medie, pentru magazinele online"],
      ["clock", "purple", "70%", "timp redus de lucru", "prin automatizări și platforme personalizate"],
      ["users", "blue", "+250%", "lead-uri crescute", "prin strategii de conținut și campanii sociale"],
      ["star", "purple", "98%", "clienți mulțumiți", "care revin pentru noi proiecte"],
    ],
    cta: ["Gata să construim următorul tău proiect de succes?", "Hai să discutăm despre ideea ta și să o transformăm într-un produs digital puternic."],
  },
  en: {
    metaTitle: "Projects",
    metaDescription: "The MAVA Studio portfolio: websites, SaaS platforms, CRM, AI content and social media, with detailed case studies.",
    eyebrow: ["Portfolio", "Real results", "Happy clients"],
    title: ["Projects", "that turn ideas", "into", "digital success."],
    lead: "A selection of our recent projects, where strategy, creativity and technology came together to deliver digital products with real results.",
    growth: ["sales", "growth"],
    caseStudy: "Case study",
    caseTitle: ["— from idea", "to a scalable platform"],
    caseCta: "Read the full case study",
    results: ["Results that speak for themselves", "We're proud of the impact we have on our clients' businesses."],
    resultItems: [
      ["bars", "green", "+320%", "conversion growth", "on average, for online stores"],
      ["clock", "purple", "70%", "less time spent", "thanks to automation and custom platforms"],
      ["users", "blue", "+250%", "more leads", "through content strategy and social campaigns"],
      ["star", "purple", "98%", "happy clients", "who come back for new projects"],
    ],
    cta: ["Ready to build your next successful project?", "Let's talk about your idea and turn it into a powerful digital product."],
  },
};

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/proiecte", locale, { title: T[locale].metaTitle, description: T[locale].metaDescription });
}

export default async function ProjectsPage() {
  const locale = getLocale();
  const t = T[locale];
  const [items, settings] = await Promise.all([getPortfolio(locale), getSiteSettings()]);
  const caseStudy = items.find((p) => p.category === "saas") ?? items[0];
  const caseMetric = caseStudy?.metrics?.[0];

  return (
    <>
      <section className="relative overflow-hidden bg-hero-soft">
        <div className="container grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-16">
          <div>
            <Eyebrow parts={t.eyebrow} />
            <h1 className="text-[2.6rem] font-extrabold leading-[1.05] md:text-[3.5rem]">
              {t.title[0]}
              <br />
              <span className="text-[0.82em]">{t.title[1]}</span>
              <br />
              <span className="text-[0.82em]">
                {t.title[2]} <span className="text-gradient">{t.title[3]}</span>
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">{t.lead}</p>
          </div>
          <div className="relative mx-auto w-full max-w-[620px] pb-6 pt-10">
            <div aria-hidden className="absolute left-[20%] top-[4%] h-[76%] w-[76%] rounded-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100" />
            <Laptop className="relative ml-[12%] w-[88%]"><WebsiteScreen lang={locale} /></Laptop>
            <Phone className="absolute bottom-0 left-0 z-10 h-[62%] w-[24%]"><WebsiteScreen compact lang={locale} /></Phone>
            <GrowthBadge className="-right-2 top-0" value="+320%" lines={t.growth} />
          </div>
        </div>
      </section>

      <section className="section pt-10">
        <div className="container">
          <PortfolioGrid items={items} />
        </div>
      </section>

      {caseStudy && (
        <section className="container pb-14">
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#F5F6FF] to-[#F3EEFF] p-8 md:p-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow underline underline-offset-4">{t.caseStudy}</p>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                {caseStudy.title} {t.caseTitle[0]}
                <br />
                {t.caseTitle[1]}
              </h2>
              <p className="mt-4 text-body">{caseStudy.results ?? caseStudy.summary}</p>
              <Link href={localePath(`/proiecte/${caseStudy.slug}`, locale)} className="btn-primary mt-7">
                {t.caseCta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-white shadow-card-hover ring-1 ring-line">
                <div className="aspect-[16/9]"><DashboardScreen variant="saas" lang={locale} /></div>
              </div>
              {caseMetric && <GrowthBadge className="-right-2 -top-6" value={caseMetric.value} lines={caseMetric.label.split(" ")} />}
            </div>
          </div>
        </section>
      )}

      {settings.show_stats && (
        <section className="section pt-0">
          <div className="container">
            <h2 className="section-title">{t.results[0]}</h2>
            <p className="section-sub">{t.results[1]}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
              {t.resultItems.map(([icon, color, v, l, d]) => (
                <div key={l} className={cn("flex items-start gap-4 lg:px-6")}>
                  <IconTile name={icon!} color={color as "blue"} round />
                  <div>
                    <div className="font-display text-3xl font-extrabold text-ink">{v}</div>
                    <div className="font-semibold text-ink">{l}</div>
                    <div className="text-sm text-body">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
