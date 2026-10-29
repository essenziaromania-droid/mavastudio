import { BarChart3, Bell, Play, Search, TrendingUp, Zap, Scissors, Type, Sparkles, Music2, Square, Instagram, Youtube } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { TikTokIcon } from "@/components/ui/brand-icons";
import type { Locale } from "@/lib/i18n";

/* Texte decorative din mockup-uri, în ambele limbi. */
const M = {
  ro: {
    growth: ["Creștem", "împreună", "brandul tău"],
    menuCrm: ["Dashboard", "Lead-uri", "Clienți", "Oferte", "Contracte", "Proiecte", "Task-uri", "Financiar", "Fișiere", "Angajați", "Rapoarte"],
    menuSaas: ["Dashboard", "Proiecte", "Echipe", "Facturare", "Rapoarte", "Setări"],
    menuHome: ["Dashboard", "Proiecte", "Facturi", "Automatizări", "Rapoarte"],
    kpiCrm: [["Lead-uri noi", "48", "+12%"], ["Oferte active", "24", "+8%"], ["Proiecte în derulare", "18", "+22%"], ["Venituri lunare", "24.580 lei", "+16%"]],
    kpiSaas: [["Utilizatori activi", "12.480", "+12%"], ["Venituri recurente", "24.580 lei", "+10%"], ["Proiecte active", "32", "+6%"]],
    kpiHome: [["Venituri totale", "24.580 lei", "+12%"], ["Proiecte active", "32", "+6%"], ["Clienți", "18", "+4%"]],
    hello: "Bună dimineața! 👋",
    crmSub: "O privire de ansamblu asupra afacerii tale.",
    homeSub: "Iată o privire de ansamblu asupra activității tale.",
    actCrm: ["Contactare lead nou", "Trimitere ofertă", "Follow-up client"],
    actSaas: ["Utilizator nou", "Plată procesată", "Proiect actualizat"],
    actHome: ["Website finalizat", "Conținut video publicat", "Proiect nou"],
    search: "Caută...",
    revenue: "Evoluția veniturilor",
    months: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun"],
    recent: "Activitate recentă",
    ago: (n: number) => `Acum ${n} ore`,
    phone: { title: "Produse digitale pentru afaceri moderne", sub: "Website-uri, SaaS, CRM. Conținut creativ.", cta: "Hai să discutăm" },
    shopNav: ["Acasă", "Produse", "Despre", "Contact"],
    shopTitle: "Frumusețe naturală, rezultate reale",
    shopText: "Produse premium pentru o rutină simplă și eficientă de îngrijire.",
    shopCta: "Vezi produsele →",
    editor: ["Media", "Text", "Tranziții", "Efecte", "Audio", "Subtitrări"],
    tools: ["Tăiere", "Text", "Efecte", "Audio", "Tranziții"],
    flowrMenu: ["Dashboard", "Clienți", "Proiecte", "Automatizări", "Rapoarte", "Setări"],
    flowrKpi: [["Clienți", "12.480"], ["Venituri", "24.580 lei"], ["Proiecte", "32"]],
    velora: ["Produse care îți fac zilele mai frumoase", "Vezi colecția"],
    autolux: ["Acasă · Mașini · Servicii · Contact", "Mașini premium pentru experiențe extraordinare", "Vezi mașinile"],
    clinica: ["Acasă · Servicii · Echipa · Contact", "Sănătatea ta este prioritatea noastră", "Servicii medicale moderne pentru o viață mai bună.", "Programează o consultație"],
    clinicaItems: ["Consultații", "Analize", "Tratamente", "Monitorizare"],
    green: ["Acasă · Despre · Servicii · Contact", "Energie curată pentru un viitor mai bun", "Solicită ofertă"],
    ai: ["Generate cu AI", "în câteva minute"],
  },
  en: {
    growth: ["Growing", "your brand", "together"],
    menuCrm: ["Dashboard", "Leads", "Clients", "Proposals", "Contracts", "Projects", "Tasks", "Finance", "Files", "Team", "Reports"],
    menuSaas: ["Dashboard", "Projects", "Teams", "Billing", "Reports", "Settings"],
    menuHome: ["Dashboard", "Projects", "Invoices", "Automations", "Reports"],
    kpiCrm: [["New leads", "48", "+12%"], ["Active proposals", "24", "+8%"], ["Ongoing projects", "18", "+22%"], ["Monthly revenue", "€24,580", "+16%"]],
    kpiSaas: [["Active users", "12,480", "+12%"], ["Recurring revenue", "€24,580", "+10%"], ["Active projects", "32", "+6%"]],
    kpiHome: [["Total revenue", "€24,580", "+12%"], ["Active projects", "32", "+6%"], ["Clients", "18", "+4%"]],
    hello: "Good morning! 👋",
    crmSub: "An overview of your business.",
    homeSub: "Here is an overview of your activity.",
    actCrm: ["Contact new lead", "Send proposal", "Client follow-up"],
    actSaas: ["New user", "Payment processed", "Project updated"],
    actHome: ["Website completed", "Video content published", "New project"],
    search: "Search...",
    revenue: "Revenue growth",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    recent: "Recent activity",
    ago: (n: number) => `${n} hours ago`,
    phone: { title: "Digital products for modern businesses", sub: "Websites, SaaS, CRM. Creative content.", cta: "Let's talk" },
    shopNav: ["Home", "Products", "About", "Contact"],
    shopTitle: "Natural beauty, real results",
    shopText: "Premium products for a simple, effective skincare routine.",
    shopCta: "Shop now →",
    editor: ["Media", "Text", "Transitions", "Effects", "Audio", "Captions"],
    tools: ["Cut", "Text", "Effects", "Audio", "Transitions"],
    flowrMenu: ["Dashboard", "Clients", "Projects", "Automations", "Reports", "Settings"],
    flowrKpi: [["Clients", "12,480"], ["Revenue", "€24,580"], ["Projects", "32"]],
    velora: ["Products that make your days brighter", "View collection"],
    autolux: ["Home · Cars · Services · Contact", "Premium cars for extraordinary experiences", "View cars"],
    clinica: ["Home · Services · Team · Contact", "Your health is our priority", "Modern medical care for a better life.", "Book an appointment"],
    clinicaItems: ["Consultations", "Lab tests", "Treatments", "Monitoring"],
    green: ["Home · About · Services · Contact", "Clean energy for a better future", "Request a quote"],
    ai: ["Generated with AI", "in minutes"],
  },
};

/* ───────── Frames ───────── */

export function Laptop({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="rounded-[18px] bg-[#1b1d2a] p-[10px] shadow-[0_40px_80px_-30px_rgba(16,24,64,.45)] ring-1 ring-black/10">
        <div className="aspect-[16/10] overflow-hidden rounded-[8px] bg-white">{children}</div>
      </div>
      <div className="relative mx-[-6%] h-4 rounded-b-[14px] bg-gradient-to-b from-[#d9dbe4] to-[#a9adbb]">
        <div className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-md bg-[#8d91a0]" />
      </div>
    </div>
  );
}

export function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative rounded-[26px] bg-[#14151f] p-[6px] shadow-[0_30px_60px_-20px_rgba(16,24,64,.5)]", className)}>
      <div className="relative h-full overflow-hidden rounded-[21px] bg-white">
        <div className="absolute left-1/2 top-1.5 z-10 h-3.5 w-16 -translate-x-1/2 rounded-full bg-[#14151f]" />
        {children}
      </div>
    </div>
  );
}

export function FloatCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("absolute z-20 rounded-2xl bg-white/95 p-3 shadow-[0_16px_40px_-12px_rgba(43,76,245,.30)] ring-1 ring-line backdrop-blur", className)}>{children}</div>;
}

export function GrowthBadge({ value = "+28%", lines, className, lang = "ro" }: { value?: string; lines?: string[]; className?: string; lang?: Locale }) {
  lines ??= M[lang].growth;
  return (
    <FloatCard className={cn("w-40 rotate-[-4deg] p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600"><BarChart3 className="h-5 w-5" /></div>
        <span className="flex items-center gap-0.5 text-xs font-bold text-brand-blue">{value}<TrendingUp className="h-3.5 w-3.5 text-emerald-500" /></span>
      </div>
      <p className="mt-2 text-[12px] font-bold leading-tight text-ink">{lines.map((l) => <span key={l} className="block">{l}</span>)}</p>
      <svg viewBox="0 0 120 30" className="mt-1 h-6 w-full"><path d="M0 28 C30 26 50 22 70 14 S105 4 120 2" fill="none" stroke="#9b5cf6" strokeWidth="2" /></svg>
    </FloatCard>
  );
}

/* ───────── Charts ───────── */

export function LineChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 110" className={cn("h-full w-full", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d5cf6" stopOpacity=".25" />
          <stop offset="1" stopColor="#6d5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lc-line" x1="0" x2="1">
          <stop offset="0" stopColor="#2B6BF7" />
          <stop offset="1" stopColor="#B23CF0" />
        </linearGradient>
      </defs>
      {[20, 50, 80].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#EEF0F8" strokeWidth="1" />)}
      <path d="M0 90 L30 70 L55 80 L85 55 L110 72 L140 50 L165 62 L195 40 L225 52 L255 25 L300 18 L300 110 L0 110Z" fill="url(#lc-fill)" />
      <path d="M0 90 L30 70 L55 80 L85 55 L110 72 L140 50 L165 62 L195 40 L225 52 L255 25 L300 18" fill="none" stroke="url(#lc-line)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="255" cy="25" r="4" fill="#fff" stroke="#6d5cf6" strokeWidth="2" />
    </svg>
  );
}

/* ───────── Screens ───────── */

type DashVariant = "home" | "crm" | "saas";

export function DashboardScreen({ variant = "home", lang = "ro" }: { variant?: DashVariant; lang?: Locale }) {
  const t = M[lang];
  const menu = variant === "crm" ? t.menuCrm : variant === "saas" ? t.menuSaas : t.menuHome;
  const kpis = variant === "crm" ? t.kpiCrm : variant === "saas" ? t.kpiSaas : t.kpiHome;
  const title = variant === "crm" ? "Dashboard" : t.hello;
  const sub = variant === "crm" ? t.crmSub : t.homeSub;
  const activity = variant === "crm" ? t.actCrm : variant === "saas" ? t.actSaas : t.actHome;
  return (
    <div className="flex h-full text-[7px] text-ink sm:text-[8px]">
      <div className="w-[22%] border-r border-line bg-[#FAFBFF] p-2">
        <div className="mb-3 flex items-center gap-1"><LogoMark className="h-3.5" /><span className="text-[8px] font-extrabold">MAVA</span></div>
        {menu.map((m, i) => (
          <div key={m} className={cn("mb-0.5 truncate rounded px-1.5 py-[3px]", i === 0 ? "bg-blue-100/70 font-semibold text-brand-blue" : "text-muted")}>{m}</div>
        ))}
      </div>
      <div className="flex-1 p-2.5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex h-4 w-1/2 items-center gap-1 rounded bg-soft px-1.5 text-muted"><Search className="h-2 w-2" /> {t.search}</div>
          <div className="flex items-center gap-1.5"><Bell className="h-2.5 w-2.5 text-muted" /><div className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-amber-200 to-rose-300" /></div>
        </div>
        <div className="text-[11px] font-extrabold sm:text-[12px]">{title}</div>
        <div className="mb-2 text-muted">{sub}</div>
        <div className={cn("mb-2 grid gap-1.5", kpis.length === 4 ? "grid-cols-4" : "grid-cols-3")}>
          {kpis.map(([l, v, d]) => (
            <div key={l} className="rounded-md border border-line p-1.5">
              <div className="truncate text-muted">{l}</div>
              <div className="text-[10px] font-extrabold sm:text-[11px]">{v}</div>
              <div className="font-semibold text-emerald-500">{d}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1.6fr_1fr] gap-1.5">
          <div className="rounded-md border border-line p-1.5">
            <div className="flex justify-between font-bold"><span>{t.revenue}</span><span className="rounded bg-brand-blue px-1 text-white">+28%</span></div>
            <div className="h-14 sm:h-16"><LineChart /></div>
            <div className="flex justify-between text-muted">{t.months.map((m) => <span key={m}>{m}</span>)}</div>
          </div>
          <div className="rounded-md border border-line p-1.5">
            <div className="mb-1 font-bold">{t.recent}</div>
            {activity.map((a, i) => (
              <div key={a} className="mb-1 flex items-center gap-1">
                <span className={cn("h-2.5 w-2.5 rounded", ["bg-blue-200", "bg-orange-200", "bg-purple-200"][i])} />
                <div><div className="font-semibold">{a}</div><div className="text-muted">{t.ago(i + 2)}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneDashboard({ title, sub, cta, lang = "ro" }: { title?: string; sub?: string; cta?: string; lang?: Locale }) {
  title ??= M[lang].phone.title;
  sub ??= M[lang].phone.sub;
  cta ??= M[lang].phone.cta;
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-[#F2F1FF] p-3 pt-6 text-ink">
      <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-1"><LogoMark className="h-3" /><span className="text-[7px] font-extrabold">MAVA</span></div><div className="space-y-0.5"><div className="h-[1.5px] w-2.5 bg-ink" /><div className="h-[1.5px] w-2.5 bg-ink" /></div></div>
      <div className="text-[11px] font-extrabold leading-tight">{title}</div>
      <div className="mt-1 text-[6.5px] text-muted">{sub}</div>
      <div className="mt-2 w-fit rounded bg-brand-blue px-2 py-1 text-[6.5px] font-semibold text-white">{cta} →</div>
      <div className="mt-auto h-16 rounded-t-[40%] bg-gradient-to-tr from-blue-500 via-indigo-400 to-fuchsia-400 opacity-90" />
    </div>
  );
}

export function Bottle({ className, label = "LUMÉ", cap = "gold", tall = true }: { className?: string; label?: string; cap?: "gold" | "white" | "dropper"; tall?: boolean }) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {cap === "dropper" ? (
        <>
          <div className="h-[18%] w-[30%] rounded-t-full bg-gradient-to-b from-white to-[#e9e4dc] shadow-inner" />
          <div className="h-[9%] w-[42%] bg-gradient-to-r from-[#b8862f] via-[#f3d48a] to-[#a8792a]" />
        </>
      ) : (
        <div className={cn("h-[16%] w-[46%] rounded-t-md", cap === "gold" ? "bg-gradient-to-r from-[#b8862f] via-[#f3d48a] to-[#a8792a]" : "bg-gradient-to-r from-[#e9e5df] via-white to-[#e2ddd6]")} />
      )}
      <div className={cn("flex w-full flex-1 flex-col items-center justify-center rounded-[12%] bg-gradient-to-r from-[#e7e1d8] via-[#fffdf9] to-[#ddd6cb] shadow-[inset_0_-6px_10px_rgba(0,0,0,.06)]", !tall && "rounded-[18%]")}>
        <span className="font-serif text-[0.7em] tracking-[0.2em] text-[#4a3f33]">{label}</span>
        <span className="mt-0.5 text-[0.32em] uppercase tracking-widest text-[#8a7d6d]">Radiant glow</span>
      </div>
    </div>
  );
}

export function WebsiteScreen({ compact = false, lang = "ro" }: { compact?: boolean; lang?: Locale }) {
  const t = M[lang];
  return (
    <div className="relative flex h-full flex-col bg-gradient-to-br from-[#f6efe6] via-[#f3ebe1] to-[#e8dccd] text-[#2b2118]">
      <div className="flex items-center justify-between px-[5%] py-[3%] text-[7px] sm:text-[8px]">
        <span className="font-serif text-[10px] font-semibold sm:text-[12px]">Lumé</span>
        {!compact && <div className="flex gap-3 text-[#6b5d4f]">{t.shopNav.map((x) => <span key={x}>{x}</span>)}</div>}
        {compact && <div className="space-y-0.5"><div className="h-[1.5px] w-2.5 bg-[#2b2118]" /><div className="h-[1.5px] w-2.5 bg-[#2b2118]" /></div>}
      </div>
      <div className={cn("flex flex-1 items-center px-[6%]", compact && "flex-col items-start pt-2")}>
        <div className={compact ? "" : "w-1/2"}>
          <div className={cn("font-serif font-semibold leading-[1.1]", compact ? "text-[13px]" : "text-[16px] sm:text-[22px]")}>{t.shopTitle}</div>
          <p className="mt-1.5 text-[6px] text-[#6b5d4f] sm:text-[7px]">{t.shopText}</p>
          <span className="mt-2 inline-block rounded-full bg-[#1f1a16] px-2.5 py-1 text-[6px] text-white sm:text-[7px]">{t.shopCta}</span>
        </div>
        <div className={cn("relative flex items-end justify-center gap-[4%]", compact ? "mt-auto h-[45%] w-full" : "h-[78%] w-1/2")}>
          <div className="absolute bottom-0 right-[2%] h-[85%] w-[14%] rounded-t-full bg-gradient-to-t from-emerald-900/30 to-emerald-700/10" />
          <Bottle className="h-[62%] w-[18%] text-[9px]" cap="white" tall />
          <Bottle className="h-[82%] w-[22%] text-[10px]" cap="gold" />
          <Bottle className="h-[48%] w-[20%] text-[8px]" cap="white" tall={false} />
        </div>
      </div>
    </div>
  );
}

export function VideoEditorScreen({ lang = "ro" }: { lang?: Locale }) {
  return (
    <div className="flex h-full bg-[#11152b] text-[7px] text-white/80">
      <div className="w-[16%] space-y-1.5 border-r border-white/10 p-2">
        {M[lang].editor.map((m, i) => (
          <div key={m} className={cn("rounded px-1.5 py-1", i === 0 && "bg-white/10 font-semibold text-white")}>{m}</div>
        ))}
      </div>
      <div className="flex flex-1 flex-col p-2">
        <div className="relative flex-1 overflow-hidden rounded-md bg-gradient-to-br from-[#e8c7a8] via-[#d9a77f] to-[#7a4f37]">
          <div className="absolute inset-x-[30%] bottom-0 top-[12%] rounded-t-full bg-gradient-to-b from-[#5a3a28] to-[#3a2418] opacity-80" />
          <div className="absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"><Play className="ml-0.5 h-3 w-3 fill-ink text-ink" /></div>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-white/60"><span>00:00 / 00:30</span><span>▶ ▷ ◁</span></div>
        <div className="mt-1 space-y-1">
          <div className="flex gap-0.5">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-5 flex-1 rounded-sm bg-gradient-to-br from-[#e2b48e] to-[#8a5a3e]" />)}</div>
          <div className="h-2 w-[70%] rounded-sm bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="h-2 w-[85%] rounded-sm bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>
      </div>
    </div>
  );
}

export function EditorToolbar({ className, lang = "ro" }: { className?: string; lang?: Locale }) {
  const icons = [Scissors, Type, Sparkles, Music2, Square] as const;
  const tools = M[lang].tools.map((l, i) => [l, icons[i]!] as const);
  return (
    <FloatCard className={cn("flex gap-4 px-5 py-3", className)}>
      {tools.map(([l, I]) => (
        <div key={l} className="flex flex-col items-center gap-1 text-[10px] text-body"><I className="h-5 w-5 text-ink" strokeWidth={1.6} />{l}</div>
      ))}
    </FloatCard>
  );
}

export function SocialClip({ className, views, platform, tone = "warm" }: { className?: string; views: string; platform: "instagram" | "tiktok" | "youtube"; tone?: "warm" | "cool" | "dark" }) {
  const bg = tone === "warm" ? "from-[#f1d3b5] via-[#d8a982] to-[#6b4430]" : tone === "cool" ? "from-[#e6dccf] via-[#cbb79f] to-[#5d4a3a]" : "from-[#4a3a30] via-[#2d2420] to-[#17120f]";
  const badge =
    platform === "instagram" ? <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white"><Instagram className="h-4 w-4" /></span>
    : platform === "youtube" ? <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white"><Youtube className="h-4 w-4" /></span>
    : <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white"><TikTokIcon className="h-4 w-4" /></span>;
  return (
    <div className={cn("absolute z-20 rounded-2xl bg-white p-1.5 shadow-[0_20px_40px_-12px_rgba(16,24,64,.35)]", className)}>
      <div className={cn("relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-b", bg)}>
        <div className="absolute inset-x-[25%] bottom-0 top-[18%] rounded-t-full bg-black/25" />
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"><Play className="ml-0.5 h-3.5 w-3.5 fill-ink text-ink" /></div>
        <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold text-white"><Play className="h-2.5 w-2.5 fill-white" /> {views}</span>
      </div>
      <div className="absolute -right-2 -top-2">{badge}</div>
    </div>
  );
}

/* ───────── Project visuals (portfolio demo) ───────── */

export function ProjectVisual({ visual, title, lang = "ro" }: { visual?: string; title: string; lang?: Locale }) {
  const t = M[lang];
  switch (visual) {
    case "lume":
      return (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#efe7dc] to-[#d9cbb8] p-5">
          <Laptop className="w-[88%]"><WebsiteScreen lang={lang} /></Laptop>
        </div>
      );
    case "flowr":
      return (
        <div className="flex h-full bg-white">
          <div className="w-[26%] bg-navy p-3 text-[8px] text-white/70">
            <div className="mb-3 flex items-center gap-1 text-[10px] font-bold text-white"><span className="h-2.5 w-2.5 rounded-full border-2 border-white" />Flowr</div>
            {t.flowrMenu.map((m, i) => <div key={m} className={cn("mb-1 rounded px-1.5 py-1", i === 0 && "bg-white/10 text-white")}>{m}</div>)}
          </div>
          <div className="flex-1 p-3 text-[8px] text-ink">
            <div className="mb-2 text-[11px] font-extrabold">{t.hello}</div>
            <div className="mb-2 grid grid-cols-3 gap-1.5">
              {t.flowrKpi.map(([l, v]) => (
                <div key={l} className="rounded border border-line p-1.5"><div className="text-muted">{l}</div><div className="text-[10px] font-extrabold">{v}</div><div className="text-emerald-500">+12%</div></div>
              ))}
            </div>
            <div className="h-[45%] rounded border border-line p-1.5"><div className="font-bold">{t.revenue}</div><div className="h-[80%]"><LineChart /></div></div>
          </div>
        </div>
      );
    case "velora":
      return (
        <div className="grid h-full grid-cols-2 gap-1.5 bg-[#f4efe8] p-3">
          <div className="row-span-2 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#e9e2d7] to-[#cfc3b2]">
            <Phone className="h-[92%] w-[62%]">
              <div className="flex h-full flex-col justify-center bg-[#f3ede5] p-3">
                <div className="text-[7px] font-semibold">Velora</div>
                <div className="mt-2 font-serif text-[11px] leading-tight text-[#2b2118]">{t.velora[0]}</div>
                <span className="mt-2 w-fit rounded-full bg-[#1f1a16] px-2 py-0.5 text-[6px] text-white">{t.velora[1]}</span>
              </div>
            </Phone>
          </div>
          <div className="flex items-end justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-300/60 p-2"><Bottle className="h-[70%] w-[28%] text-[6px]" cap="dropper" /></div>
          <div className="flex items-end justify-center rounded-xl bg-gradient-to-br from-[#efe4d4] to-[#d8c3a5] p-2"><Bottle className="h-[60%] w-[30%] text-[6px]" cap="gold" /></div>
        </div>
      );
    case "autolux":
      return (
        <div className="relative h-full overflow-hidden bg-gradient-to-br from-[#0b0b0f] via-[#16171d] to-[#2a2b33] p-5 text-white">
          <div className="flex justify-between text-[9px]"><span className="text-[12px] font-bold">AutoLux</span><span className="text-white/60">{t.autolux[0]}</span></div>
          <div className="mt-6 max-w-[55%] font-serif text-[18px] leading-tight">{t.autolux[1]}</div>
          <span className="mt-3 inline-block rounded bg-white px-2.5 py-1 text-[8px] font-semibold text-black">{t.autolux[2]}</span>
          <svg viewBox="0 0 200 70" className="absolute -right-4 bottom-3 w-[62%]">
            <path d="M10 50 Q20 30 60 26 L95 12 Q120 6 150 18 L180 30 Q195 34 195 48 L195 54 L10 54Z" fill="#1d1e24" stroke="#4a4c57" />
            <path d="M70 26 L98 15 Q120 10 142 20 L150 26Z" fill="#3b3e4a" />
            <circle cx="50" cy="54" r="12" fill="#0d0d10" stroke="#777" strokeWidth="3" />
            <circle cx="160" cy="54" r="12" fill="#0d0d10" stroke="#777" strokeWidth="3" />
            <path d="M180 36 L194 38" stroke="#e8f0ff" strokeWidth="2" />
          </svg>
        </div>
      );
    case "clinica":
      return (
        <div className="h-full bg-white p-5 text-ink">
          <div className="flex justify-between text-[9px]"><span className="font-bold text-sky-700">✚ ClinicaSana</span><span className="text-muted">{t.clinica[0]}</span></div>
          <div className="mt-4 flex gap-3">
            <div className="flex-1">
              <div className="text-[17px] font-extrabold leading-tight text-sky-800">{t.clinica[1]}</div>
              <p className="mt-2 text-[8px] text-muted">{t.clinica[2]}</p>
              <span className="mt-2 inline-block rounded bg-sky-600 px-2 py-1 text-[8px] text-white">{t.clinica[3]}</span>
            </div>
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[7px] text-sky-700">{t.clinicaItems.map((x) => <div key={x} className="rounded-lg bg-sky-50 py-2">{x}</div>)}</div>
        </div>
      );
    case "green":
      return (
        <div className="relative h-full overflow-hidden bg-white p-5 text-ink">
          <div className="flex justify-between text-[9px]"><span className="font-bold text-emerald-700">❖ GreenEnergy</span><span className="text-muted">{t.green[0]}</span></div>
          <div className="mt-4 max-w-[50%] text-[16px] font-extrabold leading-tight">{t.green[1]}</div>
          <span className="mt-2 inline-block rounded bg-emerald-600 px-2 py-1 text-[8px] text-white">{t.green[2]}</span>
          <div className="absolute bottom-0 right-0 h-[70%] w-[52%] bg-gradient-to-t from-emerald-200 to-sky-100">
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-1 skew-x-[-12deg]">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-4 bg-gradient-to-br from-slate-700 to-blue-900" />)}</div>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-fuchsia-50">
          <span className="font-display text-2xl font-extrabold text-gradient">{title}</span>
        </div>
      );
  }
}

export function AIBadge({ className, lang = "ro" }: { className?: string; lang?: Locale }) {
  return (
    <FloatCard className={cn("flex items-center gap-2 rotate-[-6deg]", className)}>
      <Zap className="h-5 w-5 text-purple-600" />
      <span className="text-[11px] font-bold leading-tight text-ink">{M[lang].ai[0]}<br />{M[lang].ai[1]}</span>
    </FloatCard>
  );
}
