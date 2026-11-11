import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, Eyebrow, HeroButtons, SectionHeading } from "@/components/site/sections";
import { IconTile } from "@/components/ui/icon";
import { Laptop, Phone, PhoneDashboard, GrowthBadge, Bottle } from "@/components/site/mockups";
import { LogoMark } from "@/components/ui/logo";
import { ServiceGroups, Faq } from "@/components/site/sales-sections";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";

const T = {
  ro: {
    metaTitle: "Servicii",
    metaDescription: "Website-uri, platforme SaaS, CRM & automatizări, foto & video de produs cu AI, editare video și administrare social media.",
    eyebrow: "Tot ce îi trebuie afacerii tale în online",
    title: ["Serviciile", "noastre"],
    lead: "Îți facem site-ul sau magazinul online, pozele și clipurile de produs și postările pe rețelele sociale, iar când ai nevoie, îți construim și programe pentru firmă. Le poți lua separat sau împreună.",
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
    pricing: ["Cât costă?", "Prețurile de pornire pentru fiecare serviciu sunt pe pagina Prețuri. Oferta exactă o primești după o discuție scurtă și gratuită.", "Vezi prețurile"],
    process: ["Cum lucrăm", "Un proces simplu și clar, de la idee la rezultate reale."],
    steps: [
      ["search", "blue", "Discutăm", "Înțelegem obiectivele tale, publicul și cerințele."],
      ["pencil", "purple", "Planificăm", "Creăm strategia și propunem cea mai bună soluție."],
      ["code", "pink", "Construim", "Dezvoltăm și implementăm tot ce este necesar."],
      ["bars", "green", "Lansăm și creștem", "Testăm, optimizăm și te susținem în continuare."],
    ],
    faqTitle: ["Întrebări frecvente", "Răspunsuri la cele mai comune întrebări despre serviciile noastre."],
    faq: [
      ["Cât durează realizarea unui website?", "Un landing page e gata în 3 zile lucrătoare, un site de prezentare în 7–15 zile lucrătoare, iar un magazin online în 15–30 de zile lucrătoare. Termenul exact îl primești în ofertă."],
      ["Lucrați și cu afaceri la început de drum?", "Da. Poți începe cu un site de prezentare sau cu un pachet de social media, apoi adaugi alte servicii pe măsură ce crești."],
      ["Oferiți și mentenanță după lansare?", "Da. Oferim pachete lunare de mentenanță: actualizări, backup, monitorizare, securitate și modificări de conținut."],
      ["Ce informații sunt necesare pentru un proiect?", "Ne ajută să știm obiectivul, publicul țintă, exemple care îți plac, bugetul estimativ și termenul dorit. Dacă nu le ai pe toate, le clarificăm împreună."],
      ["Puteți integra un sistem de plăți?", "Da. Integrăm plăți cu cardul (Stripe, Netopia și alte procesatoare), abonamente recurente și facturare automată."],
      ["Cât costă un proiect?", "Prețurile de pornire sunt pe pagina Prețuri. Pentru o ofertă exactă, programează o consultație gratuită și îți trimitem prețul și termenul în scris."],
    ],
    cta: ["Gata să duci afacerea ta la următorul nivel?", "Hai să discutăm despre proiectul tău și să găsim cea mai bună soluție."],
  },
  en: {
    metaTitle: "Services",
    metaDescription: "Websites, SaaS platforms, CRM & automation, AI product photo & video, video editing and social media management.",
    eyebrow: "Everything your business needs online",
    title: ["Our", "services"],
    lead: "We build your website or online store, create your product photos and videos and run your social media, and when you need it, we build software for your company too. Take them separately or together.",
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
    pricing: ["How much does it cost?", "Starting prices for every service are on the Pricing page. You get an exact proposal after a short, free call.", "See pricing"],
    process: ["How we work", "A simple, clear process, from idea to real results."],
    steps: [
      ["search", "blue", "We talk", "We understand your goals, your audience and your requirements."],
      ["pencil", "purple", "We plan", "We create the strategy and propose the best solution."],
      ["code", "pink", "We build", "We develop and implement everything that's needed."],
      ["bars", "green", "We launch & grow", "We test, optimise and keep supporting you."],
    ],
    faqTitle: ["Frequently asked questions", "Answers to the most common questions about our services."],
    faq: [
      ["How long does it take to build a website?", "A landing page is ready in 3 working days, a business website in 7–15 working days and an online store in 15–30 working days. You get the exact timeline in the proposal."],
      ["Do you work with international clients?", "Yes. We work remotely with clients from all over the world, communicate in English and adapt our schedule to your time zone."],
      ["Do you offer maintenance after launch?", "Yes. We offer monthly maintenance plans: updates, backups, monitoring, security and content changes."],
      ["What information do you need to start a project?", "It helps to know your goal, target audience, examples you like, an estimated budget and your preferred deadline. If you don't have all of these, we'll clarify them together."],
      ["Can you integrate a payment system?", "Yes. We integrate card payments (Stripe and other processors), recurring subscriptions and automatic invoicing."],
      ["How much does a project cost?", "Starting prices are on the Pricing page. For an exact quote, book a free consultation and we'll send you the price and timeline in writing."],
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

      <ServiceGroups locale={locale} />

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
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-gradient-to-br from-[#F5F6FF] to-[#F3EEFF] p-8 md:flex-row md:items-center md:p-12">
            <div className="flex items-start gap-5">
              <IconTile name="card" color="purple" size="lg" round />
              <div>
                <h2 className="text-2xl font-extrabold md:text-3xl">{t.pricing[0]}</h2>
                <p className="mt-2 max-w-2xl text-body">{t.pricing[1]}</p>
              </div>
            </div>
            <Link href={l("/preturi")} className="btn-primary shrink-0 !px-8 !py-4">
              {t.pricing[2]} <ArrowRight className="h-4 w-4" />
            </Link>
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

      <Faq title={t.faqTitle[0]!} sub={t.faqTitle[1]} items={t.faq as [string, string][]} />

      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
