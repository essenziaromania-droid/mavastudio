"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { blogLabel, nav } from "@/content/site";
import { counterpartPath, hasEnglishVersion, isEnglishPath, localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLocale } from "./locale-provider";

const T = {
  ro: { cta: "Pornește un proiect", menu: "Meniu", switchTo: "Switch to English" },
  en: { cta: "Start a project", menu: "Menu", switchTo: "Schimbă în română" },
};

/** Comutator RO / EN. Link complet (nu navigare client) ca middleware-ul să salveze alegerea. */
export function LanguageSwitch({ className }: { className?: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const href = (l: Locale) => `${counterpartPath(pathname, l)}?setlang=${l}`;
  // Ofertele și contractele trimise clienților există doar în română.
  if (!isEnglishPath(pathname) && !hasEnglishVersion(pathname)) return null;
  return (
    <div className={cn("flex items-center rounded-full border border-line bg-white p-0.5 text-xs font-semibold", className)} aria-label={T[locale].switchTo}>
      {(["ro", "en"] as const).map((l) => (
        <a
          key={l}
          href={href(l)}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn("rounded-full px-2.5 py-1 uppercase transition", l === locale ? "bg-brand-gradient text-white" : "text-ink-2 hover:text-brand-blue")}
        >
          {l}
        </a>
      ))}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = T[locale];
  const items = nav(locale).map((n) => ({ ...n, href: localePath(n.href, locale) }));
  const home = localePath("/", locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === home ? pathname === home : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/85 shadow-[0_6px_24px_-16px_rgba(16,24,64,.25)] backdrop-blur-lg" : "bg-white",
      )}
    >
      <div className="container flex h-[76px] items-center justify-between">
        <Logo href={home} />
        <nav className="hidden items-center gap-10 md:flex">
          {items.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "relative py-2 text-sm font-medium transition-colors hover:text-brand-blue",
                isActive(n.href)
                  ? "text-brand-blue after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand-blue"
                  : "text-ink-2",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitch className="hidden sm:flex" />
          <Link href={localePath("/incepe-un-proiect", locale)} className="btn-primary hidden !py-2.5 sm:inline-flex">
            {t.cta} <ArrowRight className="h-4 w-4" />
          </Link>
          <button className="rounded-lg p-2 text-ink md:hidden" onClick={() => setOpen((o) => !o)} aria-label={t.menu}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <nav className="container flex flex-col py-4">
            {items.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn("rounded-lg px-3 py-3 font-medium", isActive(n.href) ? "bg-soft text-brand-blue" : "text-ink")}
              >
                {n.label}
              </Link>
            ))}
            <Link href={localePath("/blog", locale)} className="rounded-lg px-3 py-3 font-medium text-ink">
              {blogLabel(locale)}
            </Link>
            <LanguageSwitch className="mx-3 mt-2 w-fit sm:hidden" />
            <Link href={localePath("/incepe-un-proiect", locale)} className="btn-primary mt-3">
              {t.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
