import type { Metadata } from "next";
import { existsSync } from "fs";
import path from "path";
import { BarChart3, Users } from "lucide-react";
import { CtaBand, Eyebrow, HeroButtons, ProcessSteps, SectionHeading, type Step } from "@/components/site/sections";
import { IconTile, type TileColor } from "@/components/ui/icon";
import { FloatCard } from "@/components/site/mockups";
import { LogoMark } from "@/components/ui/logo";
import { getLocale, pageMeta } from "@/lib/i18n-server";

/** Fotografiile sunt opționale: pune-le în /public/images/... și apar automat. */
function publicImage(rel: string) {
  return existsSync(path.join(process.cwd(), "public", rel)) ? "/" + rel : null;
}

const TEAM_STYLE: { icon: string; color: TileColor; photo: string; tint: string }[] = [
  { icon: "target", color: "blue", photo: "images/echipa/strateg.jpg", tint: "from-blue-50" },
  { icon: "pencil", color: "purple", photo: "images/echipa/designer.jpg", tint: "from-purple-50" },
  { icon: "code", color: "pink", photo: "images/echipa/developer.jpg", tint: "from-rose-50" },
  { icon: "play", color: "green", photo: "images/echipa/video-editor.jpg", tint: "from-emerald-50" },
  { icon: "megaphone", color: "blue", photo: "images/echipa/social-media.jpg", tint: "from-sky-50" },
];

const T = {
  ro: {
    metaTitle: "Despre noi",
    metaDescription: "MAVA Studio este un studio digital condus de fondatorul său: site-uri, conținut și social media pentru afaceri mici și mijlocii, cu un singur om de contact.",
    eyebrow: ["Studio condus de fondator", "Un singur om de contact"],
    title: ["Despre", "noi"],
    lead: "MAVA Studio construiește produse digitale care ajută afacerile să crească.",
    sub: "Lucrezi direct cu fondatorul studioului, de la prima discuție până la lansare. Fără intermediari și fără mesaje pierdute între departamente.",
    story: "Vezi povestea noastră",
    teamAlt: "Fondatorul MAVA Studio",
    float1: ["Idei", "Produse", "Oameni", "Rezultate"],
    float2: ["Lucrezi", "direct cu", "fondatorul"],
    who: "Cine suntem",
    whoTitle: ["Un studio mic, construit în jurul", "clienților"],
    whoText: "MAVA Studio este un studio digital creat din pasiune pentru tehnologie, design și povești de brand. Același om care discută cu tine îți face și site-ul, conținutul și postările, așa că nimic nu se pierde pe drum.",
    believe: ["Credem că orice afacere, indiferent de dimensiune, merită instrumente moderne care să o ajute să crească în online. De aceea, lucrăm aproape de clienții noștri, înțelegem obiectivele lor și construim", "soluții personalizate", ", gândite pentru succes pe termen lung."],
    mission: ["Misiunea noastră", "Să facem digitalul accesibil, eficient și valoros pentru orice afacere care își dorește mai mult."],
    values: ["Valorile noastre", "Principiile care ne ghidează", "Tot ceea ce facem este construit pe o fundație solidă de valori."],
    valueItems: [
      ["bulb", "orange", "Claritate", "Comunicăm deschis și pe înțelesul tuturor. Credem în procese simple și transparente."],
      ["bars", "green", "Performanță", "Ne concentrăm pe rezultate concrete și soluții care aduc valoare reală pentru clienții noștri."],
      ["star", "pink", "Creativitate", "Găsim mereu idei noi și abordări originale pentru a evidenția unicitatea fiecărui brand."],
      ["users", "blue", "Parteneriat", "Tratăm fiecare proiect ca pe o colaborare pe termen lung. Succesul clienților noștri este și succesul nostru."],
    ],
    process: ["Cum gândim proiectele", "De la prima discuție până la rezultate reale, urmăm un proces clar și eficient."],
    steps: [
      { icon: "search", color: "blue", title: "Înțelegem", text: "Analizăm obiectivele tale, piața și publicul țintă." },
      { icon: "pencil", color: "purple", title: "Strategizăm", text: "Definim direcția, creăm planul și alegem cele mai bune soluții." },
      { icon: "code", color: "pink", title: "Construim", text: "Dezvoltăm, designuim și implementăm tot ce este necesar." },
      { icon: "bars", color: "green", title: "Creștem împreună", text: "Testăm, optimizăm și susținem evoluția pe termen lung." },
    ] as Step[],
    team: ["Ce acoperă studioul", "Tot proiectul,", "de la un singur om", "Fondatorul MAVA Studio se ocupă de proiectul tău de la cap la coadă: strategie, design, site, video și social media. Ai un singur om de contact, care cunoaște fiecare detaliu."],
    roles: [
      ["Strategie", "Analiză, plan și obiective clare."],
      ["Design", "Identitate vizuală și aspectul site-ului."],
      ["Site-uri și aplicații", "Site-uri, magazine online și programe."],
      ["Video", "Clipuri pentru produse și rețele sociale."],
      ["Social media", "Postări, calendar și raportare lunară."],
    ],
    cta: ["Hai să ne cunoaștem", "Spune-mi pe scurt ce ai nevoie și îți răspund în 24 de ore lucrătoare."],
  },
  en: {
    metaTitle: "About us",
    metaDescription: "MAVA Studio is a founder-led digital studio: websites, content and social media for small and medium businesses, with one point of contact.",
    eyebrow: ["Founder-led studio", "One point of contact"],
    title: ["About", "us"],
    lead: "MAVA Studio builds digital products that help businesses grow.",
    sub: "You work directly with the studio's founder, from the first call to launch. No middlemen and no messages lost between departments.",
    story: "Read our story",
    teamAlt: "The founder of MAVA Studio",
    float1: ["Ideas", "Products", "People", "Results"],
    float2: ["Work", "directly with", "the founder"],
    who: "Who we are",
    whoTitle: ["A small studio, built around", "its clients"],
    whoText: "MAVA Studio is a digital studio born from a passion for technology, design and brand storytelling. The same person you talk to builds your website, content and posts, so nothing gets lost along the way.",
    believe: ["We believe every business, whatever its size, deserves modern tools that help it grow online. That's why we work closely with our clients, understand their goals and build", "tailor-made solutions", ", designed for long-term success."],
    mission: ["Our mission", "To make digital accessible, efficient and valuable for every business that wants more."],
    values: ["Our values", "The principles that guide us", "Everything we do is built on a solid foundation of values."],
    valueItems: [
      ["bulb", "orange", "Clarity", "We communicate openly and in plain language. We believe in simple, transparent processes."],
      ["bars", "green", "Performance", "We focus on concrete results and solutions that bring real value to our clients."],
      ["star", "pink", "Creativity", "We keep finding new ideas and original approaches to bring out what makes each brand unique."],
      ["users", "blue", "Partnership", "We treat every project as a long-term collaboration. Our clients' success is our success."],
    ],
    process: ["How we approach projects", "From the first conversation to real results, we follow a clear, efficient process."],
    steps: [
      { icon: "search", color: "blue", title: "We understand", text: "We analyse your goals, your market and your target audience." },
      { icon: "pencil", color: "purple", title: "We strategise", text: "We set the direction, create the plan and choose the best solutions." },
      { icon: "code", color: "pink", title: "We build", text: "We develop, design and implement everything that's needed." },
      { icon: "bars", color: "green", title: "We grow together", text: "We test, optimise and support long-term growth." },
    ] as Step[],
    team: ["What the studio covers", "The whole project,", "from one person", "The founder of MAVA Studio handles your project end to end: strategy, design, website, video and social media. One point of contact who knows every detail."],
    roles: [
      ["Strategy", "Analysis, a plan and clear goals."],
      ["Design", "Visual identity and website look."],
      ["Websites and apps", "Websites, online stores and software."],
      ["Video", "Videos for products and social media."],
      ["Social media", "Posts, calendar and monthly reports."],
    ],
    cta: ["Let's get to know each other", "Tell me briefly what you need and I'll reply within 24 working hours."],
  },
};

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/despre-noi", locale, { title: T[locale].metaTitle, description: T[locale].metaDescription });
}

export default function AboutPage() {
  const locale = getLocale();
  const t = T[locale];
  const teamPhoto = publicImage("images/fondator.jpg") ?? publicImage("images/echipa.jpg");
  return (
    <>
      <section className="relative overflow-hidden bg-hero-soft">
        <div className="container grid items-center gap-12 py-14 lg:grid-cols-[1fr_1.1fr] lg:py-16">
          <div>
            <Eyebrow parts={t.eyebrow} />
            <h1 className="text-5xl font-extrabold md:text-[4.2rem]">
              {t.title[0]} <span className="text-gradient">{t.title[1]}</span>
            </h1>
            <p className="mt-6 text-xl font-bold leading-snug text-ink">{t.lead}</p>
            <p className="mt-4 max-w-lg leading-relaxed text-body">{t.sub}</p>
            <HeroButtons secondary={t.story} secondaryHref="#cine-suntem" locale={locale} />
          </div>
          <div className="relative mx-auto w-full max-w-[600px] py-8">
            <div aria-hidden className="absolute -left-4 top-0 h-[90%] w-[90%] rounded-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100" />
            <div aria-hidden className="absolute right-[30%] -top-2 h-16 w-16 animate-float rounded-full bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-300" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-card-hover ring-1 ring-line">
              {teamPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={teamPhoto} alt={t.teamAlt} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#f7f7fb] via-white to-[#eef0fa]">
                  <LogoMark className="h-24" />
                  <span className="mt-2 font-display text-4xl font-extrabold text-ink">MAVA</span>
                  <span className="text-xs font-semibold tracking-[0.6em] text-ink/70">STUDIO</span>
                </div>
              )}
            </div>
            <FloatCard className="-right-2 top-2 flex items-center gap-2 rotate-[4deg]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600"><BarChart3 className="h-5 w-5" /></div>
              <span className="text-[11px] font-bold leading-tight text-ink">{t.float1[0]}<br />{t.float1[1]}<br />{t.float1[2]}<br />{t.float1[3]}</span>
            </FloatCard>
            <FloatCard className="-left-4 bottom-0 flex items-center gap-3 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600"><Users className="h-5 w-5" /></div>
              <span className="text-[12px] font-bold leading-tight text-ink">{t.float2[0]}<br />{t.float2[1]}<br />{t.float2[2]}</span>
            </FloatCard>
          </div>
        </div>
      </section>

      <section id="cine-suntem" className="section scroll-mt-24">
        <div className="container grid gap-12 lg:grid-cols-2 lg:divide-x lg:divide-line">
          <div>
            <p className="eyebrow underline underline-offset-4">{t.who}</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight">
              {t.whoTitle[0]} <span className="text-gradient">{t.whoTitle[1]}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-body">{t.whoText}</p>
          </div>
          <div className="lg:pl-12">
            <p className="leading-relaxed text-body">
              {t.believe[0]} <b className="text-ink">{t.believe[1]}</b>{t.believe[2]}
            </p>
            <div className="mt-6 flex items-center gap-5 rounded-2xl bg-gradient-to-r from-[#F2F4FF] to-[#F7EEFF] p-6">
              <IconTile name="target" color="blue" size="lg" round />
              <div>
                <h3 className="font-bold">{t.mission[0]}</h3>
                <p className="mt-1 text-sm text-body">{t.mission[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading eyebrow={t.values[0]} title={t.values[1]} sub={t.values[2]} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.valueItems.map(([icon, color, title, text]) => (
              <div key={title} className="card p-7">
                <IconTile name={icon!} color={color as TileColor} />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.process[0]} sub={t.process[1]} />
          <ProcessSteps steps={t.steps} />
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow underline underline-offset-4">{t.team[0]}</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight">
                {t.team[1]} <span className="text-gradient">{t.team[2]}</span>
              </h2>
            </div>
            <p className="text-body">{t.team[3]}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TEAM_STYLE.map((m, i) => {
              const [role, text] = t.roles[i]!;
              const photo = publicImage(m.photo);
              return (
                <div key={role} className="card overflow-hidden">
                  <div className={`flex h-40 items-end justify-center bg-gradient-to-b ${m.tint} to-white`}>
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt={role} className="h-full w-full object-cover" />
                    ) : (
                      <div className="mb-4 opacity-80"><IconTile name={m.icon} color={m.color} size="lg" round /></div>
                    )}
                  </div>
                  <div className="flex gap-3 p-4">
                    <IconTile name={m.icon} color={m.color} size="sm" round />
                    <div>
                      <h3 className="text-sm font-bold">{role}</h3>
                      <p className="text-xs text-body">{text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}
