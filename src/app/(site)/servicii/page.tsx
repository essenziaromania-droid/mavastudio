import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { getServices } from "@/content/services";
import { CtaBand, Eyebrow, HeroButtons, SectionHeading } from "@/components/site/sections";
import { IconTile } from "@/components/ui/icon";
import { Laptop, Phone, PhoneDashboard, GrowthBadge, Bottle } from "@/components/site/mockups";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

type Pkg = { name: string; icon: string; badge: string; popular?: boolean; text: string; items: string[] };

const T = {
  ro: {
    metaTitle: "Servicii",
    metaDescription: "Website-uri, platforme SaaS, CRM & automatizări, foto & video de produs cu AI, editare video și administrare social media.",
    eyebrow: "Soluții digitale pentru orice etapă de creștere",
    title: ["Serviciile", "noastre"],
    lead: "MAVA Studio oferă soluții digitale complete pentru afaceri care vor să crească. De la website-uri și platforme personalizate, la conținut vizual, automatizări și social media — totul într-un singur partener.",
    mock: { title: ["Idei. Strategie.", "Rezultate reale."], sub: "Partenerul tău pentru creștere digitală.", cta: "Pornește un proiect →", phone: "Soluții digitale pentru afaceri moderne.", phoneCta: "Pornește un proiect", growth: ["Branduri", "care cresc", "online"] },
    services: ["Serviciile noastre", "Soluții digitale complete, adaptate nevoilor afacerii tale."],
    more: "Află mai mult",
    collab: { title: "Ce include colaborarea", sub: <>Mai mult <b className="text-ink">decât execuție.</b> Un parteneriat complet pentru rezultate reale.</> },
    collabItems: [
      ["target", "blue", "Strategie", "Analizăm obiectivele tale și creăm un plan personalizat."],
      ["pencil", "purple", "Design", "Creăm interfețe moderne și o identitate vizuală puternică."],
      ["code", "pink", "Dezvoltare", "Construim soluții rapide, scalabile și sigure."],
      ["file", "blue", "Conținut", "Ne ocupăm de texte, imagini și materiale video."],
      ["headphones", "blue", "Suport", "Îți suntem alături și după lansare, cu suport continuu."],
    ],
    packages: ["Pachete adaptate nevoilor tale", "Fie că ești la început sau vrei să scalezi, avem soluția potrivită."],
    pkgs: [
      { name: "Start", icon: "box", badge: "Ideal pentru început", text: "Tot ce ai nevoie pentru a avea o prezență online profesionistă.", items: ["Website modern (până la 5 pagini)", "Design personalizat", "Optimizare SEO de bază", "Suport 30 de zile"] },
      { name: "Business", icon: "diamond", badge: "Cel mai popular", popular: true, text: "Soluții complete pentru afaceri care vor să crească.", items: ["Website / Platformă personalizată", "Funcționalități avansate", "Integrare CRM și automatizări", "Suport 3 luni"] },
      { name: "Enterprise", icon: "crown", badge: "Pentru scalare", text: "Soluții custom pentru proiecte complexe și creștere accelerată.", items: ["Platformă SaaS personalizată", "Integrări avansate și automatizări", "Conținut foto & video inclus", "Suport dedicat pe termen lung"] },
    ] as Pkg[],
    process: ["Cum lucrăm", "Un proces simplu și clar, de la idee la rezultate reale."],
    steps: [
      ["search", "blue", "Discutăm", "Înțelegem obiectivele tale, publicul și cerințele."],
      ["pencil", "purple", "Planificăm", "Creăm strategia și propunem cea mai bună soluție."],
      ["code", "pink", "Construim", "Dezvoltăm și implementăm tot ce este necesar."],
      ["bars", "green", "Lansăm și creștem", "Testăm, optimizăm și te susținem în continuare."],
    ],
    faqTitle: ["Întrebări frecvente", "Răspunsuri la cele mai comune întrebări despre serviciile noastre."],
    faq: [
      ["Cât durează realizarea unui website?", "Un website de prezentare durează de obicei 3–6 săptămâni, în funcție de numărul de pagini, conținut și integrări. Îți comunicăm un termen exact în ofertă."],
      ["Lucrați și cu afaceri la început de drum?", "Da. Pachetul Start este gândit exact pentru afacerile care au nevoie de o prezență online profesionistă, fără costuri mari."],
      ["Oferiți și mentenanță după lansare?", "Da. Oferim pachete lunare de mentenanță: actualizări, backup, monitorizare, securitate și modificări de conținut."],
      ["Ce informații sunt necesare pentru un proiect?", "Ne ajută să știm obiectivul, publicul țintă, exemple care îți plac, bugetul estimativ și termenul dorit. Dacă nu le ai pe toate, le clarificăm împreună."],
      ["Puteți integra un sistem de plăți?", "Da. Integrăm plăți cu cardul (Stripe, Netopia și alte procesatoare), abonamente recurente și facturare automată."],
      ["Putem discuta o soluție personalizată?", "Desigur. Majoritatea proiectelor noastre sunt personalizate. Programează o consultație gratuită și găsim împreună soluția potrivită."],
    ],
    cta: ["Gata să duci afacerea ta la următorul nivel?", "Hai să discutăm despre proiectul tău și să găsim cea mai bună soluție."],
  },
  en: {
    metaTitle: "Services",
    metaDescription: "Websites, SaaS platforms, CRM & automation, AI product photo & video, video editing and social media management.",
    eyebrow: "Digital solutions for every stage of growth",
    title: ["Our", "services"],
    lead: "MAVA Studio offers complete digital solutions for businesses that want to grow. From websites and custom platforms to visual content, automation and social media — all with one partner.",
    mock: { title: ["Ideas. Strategy.", "Real results."], sub: "Your partner for digital growth.", cta: "Start a project →", phone: "Digital solutions for modern businesses.", phoneCta: "Start a project", growth: ["Brands", "growing", "online"] },
    services: ["Our services", "Complete digital solutions, tailored to your business needs."],
    more: "Learn more",
    collab: { title: "What working with us includes", sub: <>More <b className="text-ink">than execution.</b> A complete partnership for real results.</> },
    collabItems: [
      ["target", "blue", "Strategy", "We analyse your goals and create a tailored plan."],
      ["pencil", "purple", "Design", "We create modern interfaces and a strong visual identity."],
      ["code", "pink", "Development", "We build fast, scalable and secure solutions."],
      ["file", "blue", "Content", "We take care of copy, images and video."],
      ["headphones", "blue", "Support", "We stay by your side after launch, with ongoing support."],
    ],
    packages: ["Packages tailored to your needs", "Whether you're just starting out or ready to scale, we have the right solution."],
    pkgs: [
      { name: "Start", icon: "box", badge: "Ideal to get started", text: "Everything you need for a professional online presence.", items: ["Modern website (up to 5 pages)", "Custom design", "Basic SEO optimisation", "30 days of support"] },
      { name: "Business", icon: "diamond", badge: "Most popular", popular: true, text: "Complete solutions for businesses that want to grow.", items: ["Custom website / platform", "Advanced features", "CRM integration & automation", "3 months of support"] },
      { name: "Enterprise", icon: "crown", badge: "Built to scale", text: "Custom solutions for complex projects and accelerated growth.", items: ["Custom SaaS platform", "Advanced integrations & automation", "Photo & video content included", "Dedicated long-term support"] },
    ] as Pkg[],
    process: ["How we work", "A simple, clear process, from idea to real results."],
    steps: [
      ["search", "blue", "We talk", "We understand your goals, your audience and your requirements."],
      ["pencil", "purple", "We plan", "We create the strategy and propose the best solution."],
      ["code", "pink", "We build", "We develop and implement everything that's needed."],
      ["bars", "green", "We launch & grow", "We test, optimise and keep supporting you."],
    ],
    faqTitle: ["Frequently asked questions", "Answers to the most common questions about our services."],
    faq: [
      ["How long does it take to build a website?", "A business website usually takes 3–6 weeks, depending on the number of pages, content and integrations. We give you an exact timeline in our proposal."],
      ["Do you work with international clients?", "Yes. We work remotely with clients from all over the world, communicate in English and adapt our schedule to your time zone."],
      ["Do you offer maintenance after launch?", "Yes. We offer monthly maintenance plans: updates, backups, monitoring, security and content changes."],
      ["What information do you need to start a project?", "It helps to know your goal, target audience, examples you like, an estimated budget and your preferred deadline. If you don't have all of these, we'll clarify them together."],
      ["Can you integrate a payment system?", "Yes. We integrate card payments (Stripe and other processors), recurring subscriptions and automatic invoicing."],
      ["Can we discuss a custom solution?", "Of course. Most of our projects are custom. Book a free consultation and we'll find the right solution together."],
    ],
    cta: ["Ready to take your business to the next level?", "Let's talk about your project and find the best solution."],
  },
};

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/servicii", locale, { title: T[locale].metaTitle, description: T[locale].metaDescription });
}

export default function ServicesPage() {
  const locale = getLocale();
  const t = T[locale];
  const l = (p: string) => localePath(p, locale);
  return (
    <>
      <section className="relative overflow-hidden bg-hero-soft">
        <div className="container grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-16">
          <div>
            <Eyebrow parts={[t.eyebrow]} />
            <h1 className="text-[2.7rem] font-extrabold leading-[1.05] md:text-[3.6rem]">
              {t.title[0]} <span className="text-gradient">{t.title[1]}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-body">{t.lead}</p>
            <HeroButtons locale={locale} />
          </div>
          <div className="relative mx-auto w-full max-w-[620px] pb-6 pt-10">
            <div aria-hidden className="absolute left-[20%] top-[4%] h-[76%] w-[76%] rounded-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100" />
            <div aria-hidden className="absolute right-[22%] top-0 h-16 w-16 animate-float rounded-full bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-300" />
            <Laptop className="relative ml-[12%] w-[88%]">
              <div className="flex h-full flex-col bg-gradient-to-br from-[#faf8f5] to-[#efeae3] p-[5%]">
                <div className="flex items-center gap-1"><LogoMark className="h-3.5" /><span className="text-[9px] font-extrabold text-ink">MAVA</span></div>
                <div className="flex flex-1 items-center">
                  <div className="w-1/2 flex justify-center"><Bottle className="h-24 w-10 text-[6px]" cap="white" /></div>
                  <div className="w-1/2">
                    <div className="text-[15px] font-extrabold leading-tight text-ink sm:text-[18px]">{t.mock.title[0]}<br />{t.mock.title[1]}</div>
                    <p className="mt-1 text-[7px] text-muted">{t.mock.sub}</p>
                    <span className="mt-2 inline-block rounded bg-brand-gradient px-2 py-1 text-[7px] font-semibold text-white">{t.mock.cta}</span>
                  </div>
                </div>
              </div>
            </Laptop>
            <Phone className="absolute bottom-0 left-0 z-10 h-[62%] w-[24%]"><PhoneDashboard title={t.mock.phone} sub="" cta={t.mock.phoneCta} /></Phone>
            <GrowthBadge className="-right-2 top-0" lines={t.mock.growth} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title={t.services[0]} sub={t.services[1]} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {getServices(locale).map((s) => (
              <Link key={s.slug} href={l(`/servicii/${s.slug}`)} className="card group flex gap-5 p-6 card-hover">
                <IconTile name={s.icon} color={s.color} />
                <div>
                  <h3 className="text-[17px] font-bold">{s.menuTitle}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{s.short}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                    {t.more} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.collab.title} sub={t.collab.sub} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {t.collabItems.map(([icon, color, title, text], i, arr) => (
              <div key={title} className="relative text-center">
                {i < arr.length - 1 && <div aria-hidden className="absolute left-[62%] right-[-38%] top-7 hidden h-px bg-gradient-to-r from-blue-200 to-purple-200 lg:block" />}
                <div className="flex justify-center"><IconTile name={icon!} color={color as "blue"} round /></div>
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-1 text-sm text-body">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.packages[0]} sub={t.packages[1]} />
          <div className="grid gap-6 lg:grid-cols-3">
            {t.pkgs.map((p) => (
              <div key={p.name} className={cn("card flex flex-col p-7", p.popular && "border-brand-blue/30 shadow-card-hover")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconTile name={p.icon} color={p.name === "Enterprise" ? "orange" : p.popular ? "purple" : "blue"} size="sm" />
                    <h3 className="text-xl font-extrabold">{p.name}</h3>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", p.popular ? "bg-brand-gradient text-white" : "bg-blue-50 text-brand-blue")}>{p.badge}</span>
                </div>
                <p className="mt-4 text-sm text-body">{p.text}</p>
                <ul className="mt-5 flex-1 space-y-3">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-sm text-ink-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>
                      {it}
                    </li>
                  ))}
                </ul>
                <Link href={l(`/incepe-un-proiect?pachet=${p.name.toLowerCase()}`)} className={cn("mt-7 w-full", p.popular ? "btn-primary" : "btn-outline")}>
                  {t.more} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.process[0]} sub={t.process[1]} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map(([icon, color, title, text], i) => (
              <div key={title} className="relative text-center">
                {i < 3 && <ArrowRight aria-hidden className="absolute -right-6 top-6 hidden h-5 w-5 text-brand-blue/50 lg:block" />}
                <div className="flex justify-center"><IconTile name={icon!} color={color as "blue"} size="lg" round /></div>
                <h3 className="mt-4 font-bold">{String(i + 1).padStart(2, "0")}. {title}</h3>
                <p className="mt-1 text-sm text-body">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.faqTitle[0]} sub={t.faqTitle[1]} />
          <div className="grid gap-x-6 gap-y-3 md:grid-cols-2">
            {t.faq.map(([q, a]) => (
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

      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
