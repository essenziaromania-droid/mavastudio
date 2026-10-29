import type { Metadata } from "next";
import { getServices } from "@/content/services";
import { siteCopy } from "@/content/site";
import { getLocalizedSettings, getPortfolio } from "@/lib/public-data";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";
import { CtaBand, Eyebrow, FeatureCard, HeroButtons, ProcessSteps, SectionHeading, Stats, type Step } from "@/components/site/sections";
import { DashboardHero } from "@/components/site/hero-visuals";
import { ProjectCard } from "@/components/site/project-card";

const T = {
  ro: {
    eyebrow: "Soluții digitale pentru afaceri moderne",
    title: "Idei puternice transformate în produse digitale",
    highlight: "de succes.",
    lead: "Website-uri, platforme SaaS, sisteme CRM, conținut vizual cu AI, editare video și administrare social media — totul într-un singur studio.",
    services: ["Serviciile noastre", "Soluții digitale complete pentru afaceri care vor să se dezvolte."],
    projects: ["Proiecte selectate", "O privire asupra a ceea ce am construit pentru branduri extraordinare."],
    process: ["Cum lucrăm", "Un proces simplu și clar, de la idee la rezultate reale."],
    steps: [
      { icon: "search", color: "blue", title: "Analiză și planificare", text: "Înțelegem obiectivele tale, publicul și cerințele." },
      { icon: "pencil", color: "purple", title: "Strategie și design", text: "Creăm o strategie clară și un design care se potrivește brandului tău." },
      { icon: "code", color: "pink", title: "Dezvoltare și conținut", text: "Construim, creăm și integrăm toate elementele necesare." },
      { icon: "bars", color: "green", title: "Lansare și creștere", text: "Testăm, optimizăm și te susținem în continuare pentru rezultate mai bune." },
    ] as Step[],
    cta: { title: "Gata să construim ceva extraordinar?", text: "Transformă-ți ideile în produse digitale puternice.", button: "Programează o consultație gratuită" },
  },
  en: {
    eyebrow: "Digital solutions for modern businesses",
    title: "Powerful ideas turned into",
    highlight: "successful digital products.",
    lead: "Websites, SaaS platforms, CRM systems, AI visual content, video editing and social media management — all in one studio.",
    services: ["Our services", "Complete digital solutions for businesses that want to grow."],
    projects: ["Selected projects", "A look at what we've built for extraordinary brands."],
    process: ["How we work", "A simple, clear process, from idea to real results."],
    steps: [
      { icon: "search", color: "blue", title: "Discovery & planning", text: "We understand your goals, your audience and your requirements." },
      { icon: "pencil", color: "purple", title: "Strategy & design", text: "We create a clear strategy and a design that fits your brand." },
      { icon: "code", color: "pink", title: "Development & content", text: "We build, create and integrate everything that's needed." },
      { icon: "bars", color: "green", title: "Launch & growth", text: "We test, optimise and keep supporting you for better results." },
    ] as Step[],
    cta: { title: "Ready to build something extraordinary?", text: "Turn your ideas into powerful digital products.", button: "Book a free consultation" },
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
            <h1 className="text-[2.7rem] font-extrabold leading-[1.02] md:text-[3.7rem]">
              {t.title} <span className="text-gradient">{t.highlight}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">{t.lead}</p>
            <HeroButtons locale={locale} />
            {settings.show_stats && <Stats items={settings.stats} />}
          </div>
          <DashboardHero lang={locale} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title={t.services[0]} sub={t.services[1]} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {getServices(locale).map((s) => (
              <FeatureCard key={s.slug} icon={s.icon} color={s.color} title={s.menuTitle} text={s.short} href={localePath(`/servicii/${s.slug}`, locale)} />
            ))}
          </div>
        </div>
      </section>

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

      <CtaBand title={t.cta.title} text={t.cta.text} button={t.cta.button} locale={locale} />
    </>
  );
}
