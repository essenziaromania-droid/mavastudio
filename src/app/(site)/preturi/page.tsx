import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { pricing } from "@/content/pricing";
import { CtaBand, Eyebrow } from "@/components/site/sections";
import { Faq, NextSteps } from "@/components/site/sales-sections";
import { IconTile } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

export function generateMetadata(): Metadata {
  const locale = getLocale();
  const t = pricing(locale);
  return pageMeta("/preturi", locale, { title: t.metaTitle, description: t.metaDescription });
}

export default function PricingPage() {
  const locale = getLocale();
  const t = pricing(locale);
  const l = (p: string) => localePath(p, locale);

  return (
    <>
      <section className="relative overflow-hidden bg-hero-soft">
        <div className="container py-14 text-center lg:py-16">
          <div className="flex justify-center"><Eyebrow parts={t.eyebrow} /></div>
          <h1 className="text-[2.7rem] font-extrabold leading-[1.05] md:text-[3.6rem]">
            {t.title[0]} <span className="text-gradient">{t.title[1]}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-body">{t.lead}</p>
        </div>
      </section>

      {t.groups.map((g) => (
        <section key={g.title} className="section pb-0">
          <div className="container">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="flex items-center gap-4">
                <IconTile name={g.icon} color={g.color} />
                <div>
                  <h2 className="text-2xl font-extrabold md:text-3xl">{g.title}</h2>
                  <p className="mt-1 text-sm text-body">{g.sub}</p>
                </div>
              </div>
              {g.service && (
                <Link href={l(`/servicii/${g.service}`)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                  {t.details} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {g.items.map((p) => (
                <div key={p.name} className={cn("card relative flex flex-col p-7", p.popular && "border-brand-blue/30 shadow-card-hover")}>
                  {p.popular && (
                    <span className="absolute -top-3 left-7 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold text-white">{t.popular}</span>
                  )}
                  <h3 className="text-xl font-extrabold">{p.name}</h3>
                  <p className="mt-2 text-sm text-body">{p.text}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-sm text-body">{t.from}</span>
                    <span className="font-display text-3xl font-extrabold text-ink">{p.price}</span>
                    {p.unit && <span className="text-sm text-body">{p.unit}</span>}
                  </div>
                  <ul className="mt-5 flex-1 space-y-3">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-sm text-ink-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={l(`/incepe-un-proiect?serviciu=${p.type}&pachet=${encodeURIComponent(p.name)}`)}
                    className={cn("mt-7 w-full", p.popular ? "btn-primary" : "btn-outline")}
                  >
                    {t.choose} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section pb-0">
        <div className="container">
          <div className="flex items-start gap-3 rounded-2xl bg-blue-50/60 p-5 text-sm leading-relaxed text-body ring-1 ring-line">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
            <p>{t.note}</p>
          </div>
        </div>
      </section>

      <div className="h-14" />
      <Faq title={t.faqTitle[0]!} sub={t.faqTitle[1]} items={t.faq} />
      <NextSteps locale={locale} />
      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
