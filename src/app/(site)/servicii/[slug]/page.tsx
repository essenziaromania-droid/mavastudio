import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import { getLocalizedService, type ServiceSection } from "@/content/services";
import { getPortfolio, getSiteSettings } from "@/lib/public-data";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath, type Locale } from "@/lib/i18n";
import { CtaBand, Eyebrow, FeatureCard, HeroButtons, ProcessSteps, SectionHeading, SmallFeature, Stats } from "@/components/site/sections";
import { ServiceHeroVisual } from "@/components/site/hero-visuals";
import { IconTile } from "@/components/ui/icon";
import { Bottle, Laptop, LineChart, ProjectVisual } from "@/components/site/mockups";
import { cn } from "@/lib/utils";

const T = {
  ro: { before: "Înainte", after: "După (AI)", view: "Vezi proiectul" },
  en: { before: "Before", after: "After (AI)", view: "View project" },
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const locale = getLocale();
  const s = getLocalizedService(params.slug, locale);
  if (!s) return {};
  return pageMeta(`/servicii/${s.slug}`, locale, { title: s.menuTitle, description: s.metaDescription });
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const locale = getLocale();
  const s = getLocalizedService(params.slug, locale);
  if (!s) notFound();
  const settings = await getSiteSettings();

  return (
    <>
      <section className="relative overflow-hidden bg-hero-soft">
        <div className="container grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-16">
          <div>
            <Eyebrow parts={s.eyebrow} />
            <h1 className={cn("font-extrabold leading-[1.03]", s.title.before.length < 12 ? "text-5xl md:text-[4.4rem]" : "text-[2.5rem] md:text-[3.5rem]")}>
              {s.title.before}
              {s.title.before.length < 12 ? <br /> : " "}
              <span className="text-gradient">{s.title.highlight}</span>
              {s.title.after}
            </h1>
            <p className={cn("mt-6 max-w-xl leading-relaxed", s.sublead ? "text-xl text-ink-2" : "text-lg text-body")}>{s.lead}</p>
            {s.sublead && <p className="mt-3 max-w-xl text-body">{s.sublead}</p>}
            <HeroButtons secondary={s.secondary.label} secondaryHref={s.secondary.href} locale={locale} />
            {settings.show_stats && <Stats items={s.stats} />}
          </div>
          <ServiceHeroVisual type={s.hero} lang={locale} />
        </div>
      </section>

      {s.sections.map((sec, i) => (
        <Section key={i} sec={sec} first={i === 0} locale={locale} />
      ))}

      <CtaBand title={s.cta.title} text={s.cta.text} button={s.cta.button} locale={locale} />
    </>
  );
}

async function Section({ sec, first, locale }: { sec: ServiceSection; first: boolean; locale: Locale }) {
  const t = T[locale];
  const start = localePath("/incepe-un-proiect", locale);
  const wrap = (children: React.ReactNode, id?: string) => (
    <section id={id} className={cn("section scroll-mt-24", !first && "pt-0")}>
      <div className="container">
        <SectionHeading title={sec.title} sub={sec.sub} />
        {children}
      </div>
    </section>
  );

  switch (sec.type) {
    case "cards":
      return wrap(
        <div className={cn("grid gap-5 sm:grid-cols-2", sec.columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {sec.items.map((c) =>
            sec.style === "small" ? (
              <SmallFeature key={c.title} {...c} />
            ) : (
              <FeatureCard key={c.title} {...c} layout={sec.style === "stack" ? "stack" : "row"} href={start} />
            ),
          )}
        </div>,
        first ? "module" : undefined,
      );

    case "video-examples":
      return wrap(
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sec.items.map((v) => (
            <div key={v.title} className="card group overflow-hidden card-hover">
              <div className={cn("relative aspect-[16/10] bg-gradient-to-br", v.tone)}>
                <div className="absolute inset-x-[28%] bottom-0 top-[16%] rounded-t-full bg-black/20" />
                {v.caption && <span className="absolute left-4 top-4 max-w-[60%] font-display text-lg font-extrabold uppercase leading-tight text-white drop-shadow">{v.caption}</span>}
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition group-hover:scale-110">
                  <Play className="ml-1 h-5 w-5 fill-ink text-ink" />
                </span>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">{v.duration}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-bold">{v.title}</h3>
                  <p className="text-xs text-body">{v.tag}</p>
                </div>
                <span className="arrow-dot"><ArrowRight className="h-4 w-4" /></span>
              </div>
            </div>
          ))}
        </div>,
        "exemple",
      );

    case "before-after":
      return wrap(
        <div className="grid gap-6 md:grid-cols-3">
          {sec.items.map((it) => (
            <div key={it.product} className="grid grid-cols-[0.75fr_1.25fr] overflow-hidden rounded-2xl shadow-card">
              <div className="relative flex h-60 items-center justify-center bg-gradient-to-b from-[#ececec] to-[#d6d6d6] sm:h-72">
                <ProductShape product={it.product} plain />
                <span className="absolute bottom-3 left-3 rounded-md bg-ink/70 px-3 py-1 text-xs font-semibold text-white">{t.before}</span>
              </div>
              <div className="relative flex items-center justify-center bg-gradient-to-br from-[#f3e6d2] via-[#e7d2b4] to-[#b99a6e]">
                <div aria-hidden className="absolute right-3 top-3 h-20 w-12 rotate-12 rounded-full bg-emerald-800/30" />
                <ProductShape product={it.product} />
                <span className="absolute bottom-3 left-3 rounded-md bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">{t.after}</span>
              </div>
            </div>
          ))}
        </div>,
        "exemple",
      );

    case "process":
      return wrap(<ProcessSteps steps={sec.steps} />);

    case "why":
      if (sec.variant === "columns") {
        return wrap(
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
            {sec.items.map((c) => (
              <div key={c.title} className="lg:px-6">
                <IconTile name={c.icon} color={c.color} size="lg" round />
                <h3 className="mt-5 text-lg font-bold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{c.text}</p>
              </div>
            ))}
          </div>,
        );
      }
      return wrap(
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sec.items.map((c) => <SmallFeature key={c.title} {...c} />)}
        </div>,
      );

    case "integrations":
      return wrap(
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {sec.items.map((it) => (
            <div key={it.name} className="card flex flex-col items-center p-5 text-center card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: it.color }}>{it.mark}</div>
              <h3 className="mt-3 text-sm font-bold">{it.name}</h3>
              <p className="mt-1 text-xs text-body">{it.text}</p>
            </div>
          ))}
        </div>,
      );

    case "audience":
      return wrap(
        <div className="grid gap-6 md:grid-cols-3">
          {sec.items.map((a) => (
            <Link key={a.title} href={start} className="card group overflow-hidden card-hover">
              <div className="aspect-[16/9] overflow-hidden border-b border-line"><AudienceScene scene={a.scene} /></div>
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <h3 className="font-bold">{a.title}</h3>
                  <p className="mt-1.5 text-sm text-body">{a.text}</p>
                </div>
                <span className="arrow-dot shrink-0"><ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          ))}
        </div>,
      );

    case "tech":
      return wrap(
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {sec.items.map((x) => (
            <div key={x.name} className="card flex items-center justify-center gap-2 px-3 py-4">
              <span className="text-xl font-black" style={{ color: x.color }}>{x.mark}</span>
              <span className="text-sm font-semibold text-ink">{x.name}</span>
            </div>
          ))}
        </div>,
      );

    case "featured-project": {
      const portfolio = await getPortfolio(locale);
      const p = portfolio.find((x) => x.category === "website" && x.featured) ?? portfolio.find((x) => x.category === "website");
      if (!p) return null;
      return wrap(
        <div className="card grid items-center gap-8 p-6 md:grid-cols-[1fr_1.1fr]">
          <div className="aspect-[16/9] overflow-hidden rounded-xl">
            {p.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover" />
            ) : (
              <ProjectVisual visual={p.visual} title={p.title} lang={locale} />
            )}
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="eyebrow underline underline-offset-4">{p.subtitle}</p>
              <h3 className="mt-2 text-2xl font-extrabold">{p.title}</h3>
              <p className="mt-2 text-sm text-body">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(p.features ?? []).slice(0, 4).map((f) => (
                  <span key={f} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-brand-blue">{f}</span>
                ))}
              </div>
            </div>
            <Link href={localePath(`/proiecte/${p.slug}`, locale)} className="btn-outline shrink-0">{t.view} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>,
      );
    }
  }
}

function ProductShape({ product, plain = false }: { product: "serum" | "sneaker" | "cream"; plain?: boolean }) {
  if (product === "sneaker") {
    return (
      <svg viewBox="0 0 120 60" className={cn("w-[75%]", !plain && "-rotate-12 drop-shadow-xl")}>
        <path d="M6 44 Q8 30 22 28 L48 22 Q60 12 74 20 L96 30 Q114 34 114 44 L114 50 L6 50Z" fill="#fafafa" stroke="#cfcfcf" />
        <path d="M6 48 L114 48" stroke="#d8d8d8" strokeWidth="5" />
        <path d="M40 26 L52 34 M48 23 L60 31 M56 20 L66 28" stroke="#d0d0d0" strokeWidth="2" />
      </svg>
    );
  }
  if (product === "cream") {
    return (
      <div className="flex h-[30%] w-[55%] flex-col">
        <div className={cn("h-[35%] rounded-t-lg", plain ? "bg-gradient-to-r from-[#e8e8e8] via-white to-[#e0e0e0]" : "bg-gradient-to-r from-[#e5dccf] via-[#fffaf2] to-[#ddd2c2]")} />
        <div className={cn("flex flex-1 items-center justify-center rounded-b-lg", plain ? "bg-gradient-to-r from-[#e2e2e2] via-white to-[#dcdcdc]" : "bg-gradient-to-r from-[#e9e1d6] via-white to-[#ddd3c5]")}>
          {!plain && <span className="font-serif text-xs tracking-[0.2em] text-[#4a3f33]">LUMÉ</span>}
        </div>
      </div>
    );
  }
  return plain ? (
    <div className="flex h-[55%] w-[30%] flex-col items-center">
      <div className="h-[20%] w-[60%] rounded-t-md bg-gradient-to-r from-[#e3e3e3] via-white to-[#dadada]" />
      <div className="w-full flex-1 rounded-lg bg-gradient-to-r from-[#e6e6e6] via-white to-[#dddddd]" />
    </div>
  ) : (
    <Bottle className="h-[62%] w-[30%] text-[11px]" cap="dropper" />
  );
}

function AudienceScene({ scene }: { scene: "laptop" | "team" | "charts" }) {
  if (scene === "laptop") {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f2efe9] to-[#e2dccf] p-4">
        <Laptop className="w-[70%]"><div className="h-full p-2"><div className="h-full"><LineChart /></div></div></Laptop>
      </div>
    );
  }
  if (scene === "team") {
    return (
      <div className="flex h-full items-end justify-center gap-3 bg-gradient-to-br from-[#efe9e1] to-[#d8cbb8] px-6">
        {["from-amber-200 to-amber-400", "from-rose-200 to-rose-300", "from-slate-300 to-slate-500"].map((g, i) => (
          <div key={g} className="flex flex-col items-center">
            <div className={cn("rounded-full bg-gradient-to-br", g, i === 1 ? "h-14 w-14" : "h-12 w-12")} />
            <div className={cn("mt-1 rounded-t-[40%] bg-gradient-to-b", i === 2 ? "from-slate-700 to-slate-900" : "from-white to-slate-200", i === 1 ? "h-20 w-24" : "h-16 w-20")} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid h-full grid-cols-3 gap-2 bg-gradient-to-br from-[#f3f4f8] to-[#e4e6ef] p-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-lg bg-white p-2 shadow-sm">
          <div className="flex h-full items-end gap-1">
            {[40, 65, 50, 80, 70].map((h, j) => <div key={j} className="flex-1 rounded-sm bg-gradient-to-t from-blue-400 to-purple-300" style={{ height: `${h - i * 8}%` }} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
