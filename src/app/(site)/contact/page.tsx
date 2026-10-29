import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Rocket } from "lucide-react";
import { getLocalizedSettings } from "@/lib/public-data";
import { getLocale, pageMeta } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n";
import { CtaBand, Eyebrow, SectionHeading } from "@/components/site/sections";
import { ContactForm } from "@/components/site/lead-forms";
import { Icon as IconOnly, IconTile, type TileColor } from "@/components/ui/icon";
import { FloatCard, Laptop } from "@/components/site/mockups";
import { LogoMark } from "@/components/ui/logo";

const T = {
  ro: {
    metaDescription: "Ai o idee pentru un proiect? Scrie-ne și echipa MAVA Studio te contactează în cel mai scurt timp cu o propunere personalizată.",
    faq: [
      ["chat", "În cât timp primesc un răspuns?", "Îți răspundem în maximum 24 de ore, în zilele lucrătoare, cu o confirmare și următorii pași.", "blue"],
      ["file", "Este gratuită consultanța inițială?", "Da, prima discuție este complet gratuită. Analizăm proiectul tău și îți oferim recomandări personalizate.", "purple"],
      ["settings", "Trebuie să am toate detaliile pregătite?", "Nu este necesar. Poți să ne scrii chiar și cu o idee generală. Te ajutăm noi să clarificăm și să definim împreună proiectul.", "purple"],
      ["world", "Lucrați doar cu clienți din România?", "Nu. Colaborăm cu clienți din toată lumea, lucrăm remote și avem experiență în proiecte internaționale.", "blue"],
    ] as [string, string, string, TileColor][],
    emailLine: "Scrie-ne oricând, răspundem rapid.",
    phone: "Telefon",
    location: ["Locație", "Lucrăm remote, în toată România și pentru clienți internaționali."],
    schedule: ["Program", "Răspundem în maximum 24h."],
    eyebrow: ["Soluții digitale", "Hai să discutăm"],
    lead: "Ai o idee pentru un proiect? Suntem aici să te ascultăm și să o transformăm în realitate.",
    sub: "Scrie-ne câteva detalii despre ceea ce ai în minte, iar echipa MAVA Studio te va contacta în cel mai scurt timp cu o propunere personalizată.",
    note: "Hai să construim ceva extraordinar împreună!",
    float: ["Idei", "Proiecte", "Rezultate reale"],
    form: ["Trimite-ne un mesaj", "Completează formularul de mai jos și îți vom răspunde în cel mai scurt timp."],
    call: ["Preferi o discuție directă?", "Programează un call gratuit de 30 de minute pentru a discuta despre proiectul tău.", "Programează un apel gratuit"],
    steps: ["Cum decurge primul pas", "Un proces simplu și transparent, de la primul mesaj la o colaborare de succes."],
    stepItems: [
      ["chat", "blue", "Ne spui despre proiect", "Completezi formularul cu detaliile tale și ne povestești ce îți dorești."],
      ["file", "purple", "Analizăm și revenim", "Îți răspundem în maximum 24 de ore cu întrebări suplimentare și o propunere inițială."],
      ["users", "pink", "Discutăm detaliile", "Stabilim împreună obiectivele, soluțiile potrivite și timeline-ul proiectului."],
      ["rocket", "green", "Pornim la drum", "După ce agreăm toate detaliile, începem dezvoltarea și te ținem la curent în fiecare etapă."],
    ],
    faqTitle: ["Întrebări frecvente", "Tot ce trebuie să știi despre primul contact cu MAVA Studio."],
    cta: ["Gata să construim ceva extraordinar?", "Transformă-ți ideile în produse digitale puternice."],
  },
  en: {
    metaDescription: "Have an idea for a project? Write to us and the MAVA Studio team will get back to you shortly with a tailored proposal.",
    faq: [
      ["chat", "How soon will I get a reply?", "We reply within 24 hours on business days, with a confirmation and the next steps.", "blue"],
      ["file", "Is the initial consultation free?", "Yes, the first conversation is completely free. We look at your project and give you tailored recommendations.", "purple"],
      ["settings", "Do I need to have all the details ready?", "Not at all. You can write to us with just a general idea. We'll help you clarify and define the project together.", "purple"],
      ["world", "Do you work with clients outside Romania?", "Yes. We work with clients from all over the world, fully remote, and have experience with international projects.", "blue"],
    ] as [string, string, string, TileColor][],
    emailLine: "Write to us anytime, we reply quickly.",
    phone: "Phone",
    location: ["Location", "We work remotely, with clients in Romania and internationally."],
    schedule: ["Hours", "We reply within 24 hours."],
    eyebrow: ["Digital solutions", "Let's talk"],
    lead: "Have an idea for a project? We're here to listen and help turn it into reality.",
    sub: "Tell us a few details about what you have in mind, and the MAVA Studio team will get back to you shortly with a tailored proposal.",
    note: "Let's build something extraordinary together!",
    float: ["Ideas", "Projects", "Real results"],
    form: ["Send us a message", "Fill in the form below and we'll get back to you as soon as possible."],
    call: ["Prefer a direct conversation?", "Book a free 30-minute call to talk about your project.", "Book a free call"],
    steps: ["How the first step works", "A simple, transparent process, from your first message to a successful collaboration."],
    stepItems: [
      ["chat", "blue", "Tell us about your project", "Fill in the form with your details and tell us what you'd like to achieve."],
      ["file", "purple", "We review and reply", "We get back to you within 24 hours with follow-up questions and an initial proposal."],
      ["users", "pink", "We discuss the details", "Together we set the goals, the right solutions and the project timeline."],
      ["rocket", "green", "We get started", "Once everything is agreed, we start building and keep you updated at every stage."],
    ],
    faqTitle: ["Frequently asked questions", "Everything you need to know about getting in touch with MAVA Studio."],
    cta: ["Ready to build something extraordinary?", "Turn your ideas into powerful digital products."],
  },
};

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/contact", locale, { title: "Contact", description: T[locale].metaDescription });
}

export default async function ContactPage() {
  const locale = getLocale();
  const t = T[locale];
  const s = await getLocalizedSettings(locale);
  const cards: { icon: string; color: TileColor; title: string; lines: React.ReactNode; href?: string }[] = [
    { icon: "mail", color: "blue", title: "Email", lines: <><span>{t.emailLine}</span><b className="block text-ink">{s.email}</b></>, href: `mailto:${s.email}` },
    ...(s.show_phone && s.phone
      ? [{ icon: "phone", color: "blue" as TileColor, title: t.phone, lines: <><span>{s.schedule}</span><b className="block text-brand-blue">{s.phone}</b></>, href: `tel:${s.phone.replace(/\s/g, "")}` }]
      : []),
    { icon: "pin", color: "purple", title: t.location[0]!, lines: <span>{t.location[1]}</span> },
    { icon: "clock", color: "green", title: t.schedule[0]!, lines: <><span>{s.schedule}</span><span className="block">{t.schedule[1]}</span></> },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-hero-soft">
        <div className="container grid items-center gap-10 pb-8 pt-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow parts={t.eyebrow} />
            <h1 className="text-5xl font-extrabold md:text-[4.4rem]">Contact</h1>
            <p className="mt-4 max-w-xl text-xl leading-snug text-ink-2">{t.lead}</p>
            <p className="mt-3 max-w-xl text-body">{t.sub}</p>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[460px] py-6 lg:block">
            <div aria-hidden className="absolute left-[10%] top-0 h-[90%] w-[90%] rounded-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100" />
            <div aria-hidden className="absolute right-[34%] -top-4 h-20 w-20 animate-float rounded-full bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-300" />
            <div aria-hidden className="absolute bottom-2 left-0 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-300 to-purple-300" />
            <Laptop className="relative ml-[22%] w-[72%] rotate-[-8deg]">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-white to-[#eef0ff]"><LogoMark className="h-16" /></div>
            </Laptop>
            <p className="absolute left-0 top-8 max-w-[160px] rotate-[-12deg] font-serif text-sm italic text-brand-blue">{t.note}</p>
            <FloatCard className="-right-2 top-0 flex items-center gap-2 rotate-[-6deg]">
              <span className="text-[11px] font-bold leading-tight text-ink">{t.float[0]}<br />{t.float[1]}<br />{t.float[2]}</span>
              <Rocket className="h-5 w-5 text-purple-600" />
            </FloatCard>
          </div>
        </div>
      </section>

      <section className="container grid gap-6 pb-14 lg:grid-cols-[1.55fr_1fr]">
        <div className="card p-6 md:p-8">
          <h2 className="text-3xl font-extrabold">{t.form[0]}</h2>
          <p className="mb-7 mt-1 text-body">{t.form[1]}</p>
          <ContactForm />
        </div>
        <div className="space-y-4">
          {cards.map((c) => {
            const inner = (
              <>
                <IconTile name={c.icon} color={c.color} />
                <div className="flex-1 text-sm text-body">
                  <h3 className="text-lg font-bold text-ink">{c.title}</h3>
                  {c.lines}
                </div>
                <span className="arrow-dot shrink-0"><ArrowRight className="h-4 w-4" /></span>
              </>
            );
            return c.href ? (
              <a key={c.title} href={c.href} className="card group flex items-center gap-5 p-6 card-hover">{inner}</a>
            ) : (
              <div key={c.title} className="card group flex items-center gap-5 p-6">{inner}</div>
            );
          })}
          <div className="rounded-2xl bg-gradient-to-br from-[#F2F4FF] to-[#F5EEFF] p-6">
            <div className="flex gap-5">
              <IconTile name="chat" color="purple" />
              <div>
                <h3 className="text-lg font-bold">{t.call[0]}</h3>
                <p className="mt-1 text-sm text-body">{t.call[1]}</p>
                <Link href={localePath("/incepe-un-proiect", locale)} className="btn-outline btn-sm mt-4 !py-2.5">
                  <Calendar className="h-4 w-4" /> {t.call[2]} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.steps[0]} sub={t.steps[1]} />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.stepItems.map(([icon, color, title, text], i) => (
              <div key={title} className="relative">
                {i < 3 && <div aria-hidden className="absolute left-[120px] right-4 top-10 hidden h-px bg-gradient-to-r from-blue-200 to-purple-200 lg:block" />}
                <div className="relative ml-8 w-fit">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${color === "blue" ? "bg-blue-50 text-brand-blue" : color === "purple" ? "bg-purple-50 text-purple-600" : color === "pink" ? "bg-pink-50 text-pink-600" : "bg-emerald-50 text-emerald-500"}`}>
                    <IconTileGlyph name={icon!} />
                  </div>
                  <span className="absolute -right-3 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-blue shadow-card">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title={t.faqTitle[0]} sub={t.faqTitle[1]} />
          <div className="grid gap-5 md:grid-cols-2">
            {t.faq.map(([icon, q, a, color]) => (
              <div key={q} className="card flex gap-5 p-6">
                <IconTile name={icon} color={color} size="sm" />
                <div>
                  <h3 className="font-bold">{q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={t.cta[0]!} text={t.cta[1]!} locale={locale} />
    </>
  );
}

function IconTileGlyph({ name }: { name: string }) {
  // Iconiță mare, fără fundal propriu (fundalul vine din cercul părinte)
  return <span className="[&_svg]:h-9 [&_svg]:w-9"><IconOnly name={name} /></span>;
}

