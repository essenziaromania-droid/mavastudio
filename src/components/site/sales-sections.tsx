import Link from "next/link";
import { ArrowRight, Check, Plus, Quote } from "lucide-react";
import { IconTile } from "@/components/ui/icon";
import { getServices } from "@/content/services";
import { marketing } from "@/content/marketing";
import { TESTIMONIALS } from "@/content/testimonials";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./sections";

/** Serviciile grupate în 3 direcții, pe limba clientului. */
export function ServiceGroups({ locale }: { locale: Locale }) {
  const m = marketing(locale);
  const services = getServices(locale);
  return (
    <section className="section">
      <div className="container">
        <SectionHeading title={m.groupsTitle[0]} sub={m.groupsTitle[1]} />
        <div className="grid gap-6 lg:grid-cols-3">
          {m.groups.map((g) => (
            <div key={g.title} className="card flex flex-col p-7">
              <IconTile name={g.icon} color={g.color} />
              <h3 className="mt-5 text-xl font-extrabold">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{g.text}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {g.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-ink-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-1 border-t border-line pt-5">
                {g.services.map((slug) => {
                  const s = services.find((x) => x.slug === slug);
                  if (!s) return null;
                  return (
                    <Link key={slug} href={localePath(`/servicii/${slug}`, locale)} className="group flex items-center justify-between rounded-lg py-1.5 text-sm font-semibold text-brand-blue">
                      {s.menuTitle}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardGrid({ title, sub, items, cols = 4 }: { title: string; sub: string; items: ReturnType<typeof marketing>["whyItems"]; cols?: 3 | 4 }) {
  return (
    <section className="section pt-0">
      <div className="container">
        <SectionHeading title={title} sub={sub} />
        <div className={cn("grid gap-5 sm:grid-cols-2", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {items.map((c) => (
            <div key={c.title} className="card p-6">
              <IconTile name={c.icon} color={c.color} />
              <h3 className="mt-4 text-[17px] font-bold">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-body">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs({ locale }: { locale: Locale }) {
  const m = marketing(locale);
  return <CardGrid title={m.why[0]!} sub={m.why[1]!} items={m.whyItems} />;
}

export function Audience({ locale }: { locale: Locale }) {
  const m = marketing(locale);
  return <CardGrid title={m.audience[0]!} sub={m.audience[1]!} items={m.audienceItems} />;
}

/** Apare doar când există recenzii în content/testimonials.ts. */
export function Testimonials({ locale }: { locale: Locale }) {
  if (TESTIMONIALS.length === 0) return null;
  const m = marketing(locale);
  return (
    <section className="section pt-0">
      <div className="container">
        <SectionHeading title={m.testimonials[0]} sub={m.testimonials[1]} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((r) => (
            <figure key={r.name} className="card flex flex-col p-7">
              <Quote className="h-7 w-7 text-brand-blue/40" />
              <blockquote className="mt-3 flex-1 leading-relaxed text-ink-2">{locale === "en" && r.quoteEn ? r.quoteEn : r.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {r.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.photo} alt={r.name} className="h-11 w-11 rounded-full object-cover" />
                )}
                <div>
                  <div className="text-sm font-bold text-ink">{r.name}</div>
                  {(r.role || r.company) && <div className="text-xs text-body">{[r.role, r.company].filter(Boolean).join(", ")}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({ title, sub, items }: { title: string; sub?: string; items: [string, string][] }) {
  return (
    <section className="section pt-0">
      <div className="container">
        <SectionHeading title={title} sub={sub} />
        <div className="grid gap-x-6 gap-y-3 md:grid-cols-2">
          {items.map(([q, a]) => (
            <details key={q} className="card group px-5 py-3.5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink">
                {q}
                <Plus className="h-4 w-4 shrink-0 transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-body">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFaq({ locale }: { locale: Locale }) {
  const m = marketing(locale);
  return <Faq title={m.faqTitle[0]!} sub={m.faqTitle[1]} items={m.faq} />;
}

/** Cei 3 pași de după trimiterea formularului. */
export function NextSteps({ locale, className }: { locale: Locale; className?: string }) {
  const m = marketing(locale);
  return (
    <section className={cn("section pt-0", className)}>
      <div className="container">
        <SectionHeading title={m.next[0]} sub={m.next[1]} />
        <div className="grid gap-8 sm:grid-cols-3">
          {m.nextSteps.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="flex justify-center"><IconTile name={s.icon} color={s.color} size="lg" round /></div>
              <h3 className="mt-4 font-bold">{String(i + 1).padStart(2, "0")}. {s.title}</h3>
              <p className="mt-1 text-sm text-body">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
