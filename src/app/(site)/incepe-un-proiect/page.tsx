import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/site/sections";
import { ProjectWizard } from "@/components/site/lead-forms";
import { PROJECT_TYPES } from "@/content/site";
import { getLocale, pageMeta } from "@/lib/i18n-server";

const T = {
  ro: {
    metaTitle: "Începe un proiect",
    metaDescription: "Spune-ne ce vrei să construim. Primești o propunere personalizată de la echipa MAVA Studio în maximum 24 de ore.",
    eyebrow: "Începe un proiect",
    title: ["Hai să construim", "ceva extraordinar."],
    lead: "Răspunde la câteva întrebări simple. Durează mai puțin de 2 minute.",
    points: [
      ["Răspuns în maximum 24h", "Revenim cu întrebări și o propunere inițială."],
      ["Consultanță gratuită", "Prima discuție este fără niciun cost."],
      ["Datele tale sunt în siguranță", "Le folosim doar pentru a-ți răspunde."],
    ],
  },
  en: {
    metaTitle: "Start a project",
    metaDescription: "Tell us what you'd like us to build. You'll receive a tailored proposal from the MAVA Studio team within 24 hours.",
    eyebrow: "Start a project",
    title: ["Let's build", "something extraordinary."],
    lead: "Answer a few simple questions. It takes less than 2 minutes.",
    points: [
      ["Reply within 24 hours", "We'll get back to you with questions and an initial proposal."],
      ["Free consultation", "The first conversation is completely free."],
      ["Your data is safe", "We only use it to reply to you."],
    ],
  },
};

const ICONS = [Clock, MessageCircle, ShieldCheck];

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/incepe-un-proiect", locale, { title: T[locale].metaTitle, description: T[locale].metaDescription });
}

export default function StartProjectPage({ searchParams }: { searchParams: { serviciu?: string; pachet?: string } }) {
  const t = T[getLocale()];
  const service = PROJECT_TYPES.some((x) => x.value === searchParams.serviciu) ? searchParams.serviciu : undefined;
  const pkg = ["start", "business", "enterprise"].includes(searchParams.pachet ?? "") ? searchParams.pachet : undefined;
  return (
    <section className="bg-hero-soft">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1fr_2fr] lg:py-20">
        <div>
          <Eyebrow parts={[t.eyebrow]} />
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            {t.title[0]} <span className="text-gradient">{t.title[1]}</span>
          </h1>
          <p className="mt-5 text-lg text-body">{t.lead}</p>
          <ul className="mt-8 space-y-5">
            {t.points.map(([title, text], i) => {
              const Ico = ICONS[i]!;
              return (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-blue shadow-card"><Ico className="h-5 w-5" /></span>
                  <div>
                    <p className="font-bold text-ink">{title}</p>
                    <p className="text-sm text-body">{text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card p-6 md:p-10">
          <ProjectWizard initialService={service} initialPackage={pkg} />
        </div>
      </div>
    </section>
  );
}
