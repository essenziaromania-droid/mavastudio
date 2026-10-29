import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { IconTile, type TileColor } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { localePath, type Locale } from "@/lib/i18n";

export function SectionHeading({ title, sub, eyebrow, className }: { title: React.ReactNode; sub?: React.ReactNode; eyebrow?: string; className?: string }) {
  return (
    <div className={cn("mx-auto mb-10 max-w-3xl text-center", className)}>
      {eyebrow && <p className="eyebrow mb-2 underline decoration-brand-blue/40 underline-offset-4">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

export function Blobs({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -right-24 top-6 h-[420px] w-[560px] rounded-full bg-gradient-to-br from-blue-100/80 via-indigo-50 to-transparent blur-2xl" />
      <div className="absolute right-[24%] top-6 h-20 w-20 animate-float rounded-full bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-300 opacity-90" />
      <div className="absolute -right-12 top-[40%] h-40 w-40 rounded-full bg-gradient-to-br from-blue-200 via-indigo-200 to-fuchsia-200 opacity-70" />
      <div className="absolute left-[46%] top-[66%] h-9 w-9 rounded-full bg-gradient-to-br from-cyan-300 to-purple-400 opacity-80" />
    </div>
  );
}

const SECTION_T = {
  ro: { start: "Pornește un proiect", portfolio: "Vezi portofoliul" },
  en: { start: "Start a project", portfolio: "View portfolio" },
};

export function CtaBand({
  title,
  text,
  button,
  href = "/incepe-un-proiect",
  locale = "ro",
}: {
  title: string;
  text: string;
  button?: string;
  href?: string;
  locale?: Locale;
}) {
  button ??= SECTION_T[locale].start;
  href = localePath(href, locale);
  return (
    <section className="container pb-12 pt-6">
      <div className="relative overflow-hidden rounded-[28px] bg-cta-band px-6 py-10 md:px-16 md:py-9">
        <div aria-hidden className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-gradient-to-br from-cyan-300 via-blue-300 to-fuchsia-300 opacity-80" />
        <div aria-hidden className="absolute -right-4 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:pl-20">
          <div>
            <h2 className="text-2xl font-extrabold md:text-[1.75rem]">{title}</h2>
            <p className="mt-1 text-body">{text}</p>
          </div>
          <Link href={href} className="btn-primary shrink-0 !px-8 !py-4">
            {button} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export type Step = { icon: string; color: TileColor; title: string; text: string };

export function ProcessSteps({ steps, numbered = true }: { steps: Step[]; numbered?: boolean }) {
  return (
    <div className={cn("grid gap-10 sm:grid-cols-2", steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
      {steps.map((s, i) => (
        <div key={s.title} className="relative">
          {i < steps.length - 1 && (
            <div aria-hidden className="absolute left-[104px] right-2 top-8 hidden h-px bg-gradient-to-r from-blue-200 to-purple-200 lg:block" />
          )}
          <div className="relative ml-6">
            <IconTile name={s.icon} color={s.color} size="lg" round />
          </div>
          <h3 className="mt-5 text-[17px] font-bold">
            {numbered && <span className="mr-2">{String(i + 1).padStart(2, "0")}.</span>}
            {s.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-body">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export function FeatureCard({
  icon,
  color,
  title,
  text,
  href,
  layout = "row",
}: {
  icon: string;
  color: TileColor;
  title: string;
  text: string;
  href?: string;
  layout?: "row" | "stack";
}) {
  const inner = (
    <>
      <div className={cn("flex gap-5", layout === "stack" && "flex-col gap-4")}>
        <IconTile name={icon} color={color} />
        <div className="flex-1">
          <h3 className={cn("font-bold text-ink", layout === "stack" ? "text-xl" : "text-[17px]")}>{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-body">{text}</p>
        </div>
      </div>
      {href && (
        <div className="-mt-2 flex justify-end">
          <span className="arrow-dot">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      )}
    </>
  );
  const cls = "card group block p-6 card-hover";
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="mt-10 flex flex-wrap gap-y-6">
      {items.map((s, i) => (
        <div key={s.label} className={cn("pr-6 sm:pr-8", i > 0 && "border-l border-line pl-6 sm:pl-8")}>
          <div className="font-display text-[1.9rem] font-extrabold text-ink">{s.value}</div>
          <div className="text-sm text-body">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function HeroButtons({ secondary, secondaryHref = "/proiecte", locale = "ro" }: { secondary?: string; secondaryHref?: string; locale?: Locale }) {
  const t = SECTION_T[locale];
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Link href={localePath("/incepe-un-proiect", locale)} className="btn-primary !px-7 !py-4">
        {t.start} <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href={localePath(secondaryHref, locale)} className="btn-outline !px-6 !py-[14px]">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-blue">
          <Play className="ml-0.5 h-3 w-3 fill-brand-blue" />
        </span>
        {secondary ?? t.portfolio}
      </Link>
    </div>
  );
}

export function Eyebrow({ parts }: { parts: string[] }) {
  return (
    <p className="eyebrow mb-4">
      {parts.map((p, i) => (
        <span key={p}>
          {i > 0 && <span className="mx-2 text-brand-blue">•</span>}
          <span className={i === 0 ? "underline decoration-ink/40 underline-offset-4" : ""}>{p}</span>
        </span>
      ))}
    </p>
  );
}

export function SmallFeature({ icon, color, title, text }: { icon: string; color: TileColor; title: string; text: string }) {
  return (
    <div className="card flex gap-4 p-5">
      <IconTile name={icon} color={color} size="sm" />
      <div>
        <h3 className="text-[15px] font-bold">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-body">{text}</p>
      </div>
    </div>
  );
}

/** Titlu de hero cu partea finală în gradient albastru → mov. */
export function HeroTitle({ before, highlight, after, size = "lg" }: { before: React.ReactNode; highlight?: string; after?: string; size?: "lg" | "xl" }) {
  return (
    <h1 className={cn("font-extrabold leading-[1.02] tracking-tight", size === "xl" ? "text-5xl md:text-[4.5rem]" : "text-[2.6rem] md:text-[3.6rem]")}>
      {before}
      {highlight && <span className="text-gradient"> {highlight}</span>}
      {after}
    </h1>
  );
}
