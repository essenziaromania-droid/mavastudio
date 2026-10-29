import { BarChart3, Play, Zap, Heart, MessageCircle, Send } from "lucide-react";
import {
  AIBadge, Bottle, DashboardScreen, EditorToolbar, FloatCard, GrowthBadge, Laptop, Phone, PhoneDashboard, SocialClip,
  VideoEditorScreen, WebsiteScreen,
} from "./mockups";
import { LogoMark } from "@/components/ui/logo";
import type { Locale } from "@/lib/i18n";

const H = {
  ro: {
    web: ["Mai mulți", "clienți din", "mediul online"],
    glow: ["Strălucește", "natural"],
    ads: ["Perfect pentru", "reclame și social media"],
    reel: "Reel nou", carousel: "Carusel", likes: "2.480 aprecieri", scheduled: "programat pentru 18:00",
    social: ["Mai mult", "engagement", "în 90 de zile"],
    calendar: ["Calendar editorial", "aprobat de tine"],
    crm: { title: "Totul sub control.", sub: "Clienți, proiecte, venituri și mai mult, într-un singur loc.", cta: "Accesează CRM" },
    saas: { title: "Proiectele mele", sub: "Platformă SaaS · Aplicație mobilă · Integrare API", cta: "Deschide" },
  },
  en: {
    web: ["More", "customers", "from online"],
    glow: ["Glow", "naturally"],
    ads: ["Perfect for", "ads and social media"],
    reel: "New reel", carousel: "Carousel", likes: "2,480 likes", scheduled: "scheduled for 6:00 PM",
    social: ["More", "engagement", "in 90 days"],
    calendar: ["Content calendar", "approved by you"],
    crm: { title: "Everything under control.", sub: "Clients, projects, revenue and more, all in one place.", cta: "Open CRM" },
    saas: { title: "My projects", sub: "SaaS platform · Mobile app · API integration", cta: "Open" },
  },
};
type L = { lang?: Locale };

function Orbs() {
  return (
    <>
      <div aria-hidden className="absolute left-[18%] top-[2%] h-[78%] w-[78%] rounded-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 opacity-80" />
      <div aria-hidden className="absolute right-[18%] top-[-4%] h-20 w-20 rounded-full bg-gradient-to-br from-cyan-300 via-blue-300 to-purple-300 animate-float" />
      <div aria-hidden className="absolute -right-6 top-[38%] h-36 w-36 rounded-full bg-gradient-to-br from-blue-200 via-indigo-200 to-fuchsia-200 opacity-80" />
      <div aria-hidden className="absolute left-[2%] top-[60%] h-8 w-8 rounded-full bg-gradient-to-br from-cyan-300 to-purple-400" />
    </>
  );
}

export function DashboardHero({ variant = "home", phone, lang = "ro" }: { variant?: "home" | "crm" | "saas"; phone?: { title: string; sub: string; cta: string } } & L) {
  return (
    <div className="relative mx-auto w-full max-w-[640px] pb-6 pt-10">
      <Orbs />
      <Laptop className="relative ml-[12%] w-[88%]"><DashboardScreen variant={variant} lang={lang} /></Laptop>
      <Phone className="absolute bottom-0 left-0 z-10 h-[62%] w-[24%]"><PhoneDashboard lang={lang} {...(phone ?? {})} /></Phone>
      <GrowthBadge className="-right-2 top-0" lang={lang} />
    </div>
  );
}

export function WebsiteHero({ lang = "ro" }: L) {
  return (
    <div className="relative mx-auto w-full max-w-[640px] pb-6 pt-10">
      <Orbs />
      <Laptop className="relative ml-[12%] w-[88%]"><WebsiteScreen lang={lang} /></Laptop>
      <Phone className="absolute bottom-0 left-0 z-10 h-[62%] w-[24%]"><WebsiteScreen compact lang={lang} /></Phone>
      <GrowthBadge className="-right-2 top-0" value="+120%" lines={H[lang].web} />
    </div>
  );
}

export function VideoHero({ lang = "ro" }: L) {
  return (
    <div className="relative mx-auto w-full max-w-[640px] pb-14 pt-10">
      <Orbs />
      <Laptop className="relative ml-[14%] w-[80%]"><VideoEditorScreen lang={lang} /></Laptop>
      <SocialClip className="left-0 top-[34%] h-[52%] w-[22%] rotate-[-4deg]" views="1.2M" platform="tiktok" />
      <SocialClip className="right-[14%] top-0 h-[46%] w-[20%] rotate-[3deg]" views="850K" platform="instagram" tone="cool" />
      <SocialClip className="-right-1 top-[14%] h-[44%] w-[19%] rotate-[4deg]" views="320K" platform="youtube" tone="dark" />
      <EditorToolbar className="bottom-2 right-0" lang={lang} />
    </div>
  );
}

export function AIHero({ lang = "ro" }: L) {
  const t = H[lang];
  return (
    <div className="relative mx-auto w-full max-w-[620px] pb-6 pt-10">
      <Orbs />
      <div className="relative ml-[4%] flex h-[380px] w-[48%] items-end justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#f3e9dc] via-[#ead9c3] to-[#c9b08d] shadow-card sm:h-[440px]">
        <div aria-hidden className="absolute -left-6 top-10 h-40 w-24 rotate-[-25deg] rounded-full bg-emerald-800/30 blur-[1px]" />
        <div aria-hidden className="absolute bottom-0 h-16 w-full bg-gradient-to-t from-[#d9ccb8] to-transparent" />
        <Bottle className="relative mb-10 h-[66%] w-[44%] text-[22px]" cap="dropper" />
      </div>
      <Phone className="absolute right-[18%] top-[18%] z-10 h-[80%] w-[33%]">
        <div className="relative flex h-full items-end justify-center bg-gradient-to-b from-[#f5ecdf] to-[#d8c3a4]">
          <Bottle className="mb-[28%] h-[52%] w-[46%] text-[13px]" cap="dropper" />
          <div className="absolute left-1/2 top-[40%] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white/60 backdrop-blur"><Play className="ml-1 h-5 w-5 fill-white text-white" /></div>
          <div className="absolute bottom-[12%] left-3 font-display text-lg font-bold leading-tight text-white drop-shadow">{t.glow[0]}<br />{t.glow[1]}</div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-[9px] text-white"><div className="h-1 flex-1 rounded-full bg-white/40"><div className="h-full w-1/4 rounded-full bg-purple-400" /></div>0:24</div>
        </div>
      </Phone>
      <div className="absolute right-0 top-[22%] z-10 flex w-[16%] flex-col gap-2">
        {["from-[#efe2cf] to-[#cdb18a]", "from-[#f4ead9] to-[#d9c19c]", "from-[#e8ddcd] to-[#bfa47e]"].map((g, i) => (
          <div key={g} className={`relative flex aspect-square items-end justify-center overflow-hidden rounded-xl bg-gradient-to-br ${g} shadow-card`}>
            {i < 2 ? <Bottle className="mb-1 h-[70%] w-[38%] text-[5px]" cap={i === 0 ? "dropper" : "gold"} /> : <Play className="mb-[35%] h-6 w-6 fill-white text-white" />}
          </div>
        ))}
      </div>
      <FloatCard className="right-[-2%] top-[2%] flex items-center gap-2 rotate-[-4deg]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-brand-blue"><BarChart3 className="h-5 w-5" /></div>
        <span className="text-[11px] font-bold leading-tight text-ink">{t.ads[0]}<br />{t.ads[1]}</span>
      </FloatCard>
      <AIBadge className="bottom-[14%] left-[-2%]" lang={lang} />
    </div>
  );
}

export function SocialHero({ lang = "ro" }: L) {
  const t = H[lang];
  return (
    <div className="relative mx-auto w-full max-w-[600px] pb-6 pt-10">
      <Orbs />
      <div className="relative flex justify-center gap-4">
        {[
          { h: "h-[400px]", rot: "rotate-[-5deg] mt-10", g: "from-[#f1d3b5] via-[#d8a982] to-[#6b4430]", t: t.reel },
          { h: "h-[430px]", rot: "", g: "from-[#e8eefc] via-[#c9d4f5] to-[#7a8fd6]", t: t.carousel },
        ].map((p) => (
          <Phone key={p.t} className={`${p.h} w-[38%] ${p.rot}`}>
            <div className="flex h-full flex-col bg-white pt-6 text-ink">
              <div className="flex items-center gap-2 px-3 py-2"><LogoMark className="h-4" /><span className="text-[10px] font-bold">mavastudio</span></div>
              <div className={`flex flex-1 items-center justify-center bg-gradient-to-br ${p.g}`}><Play className="h-8 w-8 fill-white text-white" /></div>
              <div className="flex gap-3 px-3 py-2 text-ink"><Heart className="h-4 w-4" /><MessageCircle className="h-4 w-4" /><Send className="h-4 w-4" /></div>
              <div className="px-3 pb-4 text-[10px]"><b>{t.likes}</b><br /><span className="text-muted">{p.t} · {t.scheduled}</span></div>
            </div>
          </Phone>
        ))}
      </div>
      <GrowthBadge className="-right-2 top-2" value="+3x" lines={t.social} lang={lang} />
      <FloatCard className="bottom-6 left-0 flex items-center gap-2"><Zap className="h-5 w-5 text-purple-600" /><span className="text-[11px] font-bold leading-tight text-ink">{t.calendar[0]}<br />{t.calendar[1]}</span></FloatCard>
    </div>
  );
}

export function ServiceHeroVisual({ type, lang = "ro" }: { type: string } & L) {
  switch (type) {
    case "video": return <VideoHero lang={lang} />;
    case "ai": return <AIHero lang={lang} />;
    case "website": return <WebsiteHero lang={lang} />;
    case "social": return <SocialHero lang={lang} />;
    case "crm": return <DashboardHero variant="crm" phone={H[lang].crm} lang={lang} />;
    case "saas": return <DashboardHero variant="saas" phone={H[lang].saas} lang={lang} />;
    default: return <DashboardHero lang={lang} />;
  }
}
