import type { Metadata } from "next";
import { siteCopy } from "@/content/site";
import { getLocalizedSettings, getPortfolio } from "@/lib/public-data";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { CtaBand, Eyebrow, HeroButtons, ProcessSteps, SectionHeading, Stats, type Step } from "@/components/site/sections";
import { Audience, HomeFaq, NextSteps, ServiceGroups, Testimonials, WhyUs } from "@/components/site/sales-sections";
import { DashboardHero } from "@/components/site/hero-visuals";
import { ProjectCard } from "@/components/site/project-card";

const T = {
  ro: {
    eyebrow: "Studio digital pentru afaceri mici și mijlocii",
    title: "Site-uri, conținut și social media care îți aduc",
    highlight: "clienți.",
    lead: "Îți facem site-ul sau magazinul online, pozele și clipurile de produs și postările pe rețelele sociale. Iar când afacerea crește, îți construim și programele interne, totul de la un singur partener.",
    projects: ["Proiecte reale", "Câteva dintre site-urile și proiectele pe care le-am construit pentru clienții noștri."],
    process: ["Cum lucrăm", "Un proces simplu și clar, de la idee la rezultate reale."],
    steps: [
      { icon: "search", color: "blue", title: "Analiză și planificare", text: "Înțelegem obiectivele tale, publicul și cerințele." },
      { icon: "pencil", color: "purple", title: "Strategie și design", text: "Creăm o strategie clară și un design care se potrivește brandului tău." },
      { icon: "code", color: "pink", title: "Dezvoltare și conținut", text: "Construim, creăm și integrăm toate elementele necesare." },
      { icon: "bars", color: "green", title: "Lansare și creștere", text: "Testăm, optimizăm și te susținem în continuare pentru rezultate mai bune." },
    ] as Step[],
    cta: { title: "Hai să vedem ce ți se potrivește", text: "O discuție scurtă și gratuită, apoi primești o ofertă clară, cu preț și termen.", button: "Programează o consultație gratuită" },
  },
  en: {
    eyebrow: "Digital studio for small and medium businesses",
    title: "Websites, content and social media that bring you",
    highlight: "customers.",
    lead: "We build your website or online store, create your product photos and videos and run your social media. And as your business grows, we build your internal software too, all from one partner.",
    projects: ["Real projects", "Some of the websites and projects we've built for our clients."],
    process: ["How we work", "A simple, clear process, from idea to real results."],
    steps: [
      { icon: "search", color: "blue", title: "Discovery & planning", text: "We understand your goals, your audience and your requirements." },
      { icon: "pencil", color: "purple", title: "Strategy & design", text: "We create a clear strategy and a design that fits your brand." },
      { icon: "code", color: "pink", title: "Development & content", text: "We build, create and integrate everything that's needed." },
      { icon: "bars", color: "green", title: "Launch & growth", text: "We test, optimise and keep supporting you for better results." },
    ] as Step[],
    cta: { title: "Let's see what fits you", text: "A short, free call, then you get a clear proposal with price and timeline.", button: "Book a free consultation" },
  },
};

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return { ...pageMeta("/", locale, { description: siteCopy(locale).description }), title: { absolute: siteCopy(locale).defaultTitle } };
}

export default async function HomePage() {
  const locale = getLocale();
  const t = T[locale];
  const [settings, portfolio] = await Promise.all([getLocalizedSettings(locale), getPortfolio(locale)]);
  const featured = (portfolio.filter((p) => p.featured).length ? portfolio.filter((p) => p.featured) : portfolio).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-hero-soft">
        <div className="container grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-20">
          <div>
            <Eyebrow parts={[t.eyebrow]} />
            <h1 className="text-[2.5rem] font-extrabold leading-[1.05] md:text-[3.3rem]">
              {t.title} <span className="text-gradient">{t.highlight}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">{t.lead}</p>
            <HeroButtons locale={locale} />
            {settings.show_stats && <Stats items={settings.stats} />}
          </div>
          <DashboardHero lang={locale} />
        </div>
      </section>

      <ServiceGroups locale={locale} />
      <WhyUs locale={locale} />
      <Audience locale={locale} />

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.projects[0]} sub={t.projects[1]} />
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((p) => <ProjectCard key={p.slug} p={p} locale={locale} />)}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.process[0]} sub={t.process[1]} />
          <ProcessSteps steps={t.steps} />
        </div>
      </section>

      <Testimonials locale={locale} />
      <HomeFaq locale={locale} />
      <NextSteps locale={locale} />

      <CtaBand title={t.cta.title} text={t.cta.text} button={t.cta.button} locale={locale} />
    </>
  );
}
