import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { blogLabel, nav, siteCopy } from "@/content/site";
import { getSiteSettings } from "@/lib/public-data";
import { TikTokIcon } from "@/components/ui/brand-icons";
import { localePath, type Locale } from "@/lib/i18n";

const T = {
  ro: { rights: "Toate drepturile rezervate.", privacy: "Confidențialitate", terms: "Termeni", cookies: "Cookies", motto: ["Soluții digitale", "Conținut", "Creștere"] },
  en: { rights: "All rights reserved.", privacy: "Privacy", terms: "Terms", cookies: "Cookies", motto: ["Digital solutions", "Content", "Growth"] },
};

export async function Footer({ locale }: { locale: Locale }) {
  const s = await getSiteSettings();
  const t = T[locale];
  const l = (p: string) => localePath(p, locale);
  const socials = [
    { key: "Instagram", href: s.socials.instagram, el: <Icon name="instagram" className="h-4 w-4" /> },
    { key: "LinkedIn", href: s.socials.linkedin, el: <Icon name="linkedin" className="h-4 w-4" /> },
    { key: "YouTube", href: s.socials.youtube, el: <Icon name="youtube" className="h-4 w-4" /> },
    { key: "TikTok", href: s.socials.tiktok, el: <TikTokIcon /> },
  ].filter((x) => x.href);
  return (
    <footer className="bg-white">
      <div className="container border-b border-line pb-8 pt-4">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Logo href={l("/")} />
            <p className="mt-2 text-xs text-muted">{siteCopy(locale).tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-medium text-ink-2">
            {[...nav(locale), { href: "/blog", label: blogLabel(locale) }].map((n) => (
              <Link key={n.href} href={l(n.href)} className="hover:text-brand-blue">
                {n.label}
              </Link>
            ))}
          </nav>
          {socials.length > 0 && <div className="flex gap-3">
            {socials.map((x) => (
              <a
                key={x.key}
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={x.key}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-2 transition hover:border-brand-blue hover:text-brand-blue"
              >
                {x.el}
              </a>
            ))}
          </div>}
        </div>
      </div>
      <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted md:flex-row">
        <p>© {new Date().getFullYear()} MAVA Studio. {t.rights}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href={l("/politica-de-confidentialitate")} className="hover:text-brand-blue">{t.privacy}</Link>
          <Link href={l("/termeni-si-conditii")} className="hover:text-brand-blue">{t.terms}</Link>
          <Link href={l("/politica-cookies")} className="hover:text-brand-blue">{t.cookies}</Link>
          <span className="hidden text-line md:inline">|</span>
          <span>
            {t.motto[0]} <span className="mx-1.5">•</span> {t.motto[1]} <span className="mx-1.5">•</span> {t.motto[2]}
          </span>
        </div>
      </div>
    </footer>
  );
}
