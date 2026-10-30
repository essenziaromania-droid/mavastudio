"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Filter, Users, FileText, PenLine, FolderKanban, ListChecks, CalendarDays, Wallet, HardDrive, UserCog, PieChart,
  Globe, Settings, Menu, X, ExternalLink, Megaphone, Mail,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/crm", label: "Dashboard", icon: LayoutDashboard, module: "dashboard" },
  { href: "/crm/leaduri", label: "Lead-uri", icon: Filter, module: "leads" },
  { href: "/crm/clienti", label: "Clienți", icon: Users, module: "clienti" },
  { href: "/crm/mesaje", label: "Mesaje", icon: Mail, module: "mesaje" },
  { href: "/crm/oferte", label: "Oferte", icon: FileText, module: "oferte" },
  { href: "/crm/contracte", label: "Contracte", icon: PenLine, module: "contracte" },
  { href: "/crm/proiecte", label: "Proiecte", icon: FolderKanban, module: "proiecte" },
  { href: "/crm/taskuri", label: "Task-uri", icon: ListChecks, module: "*" },
  { href: "/crm/calendar", label: "Calendar", icon: CalendarDays, module: "calendar" },
  { href: "/crm/social", label: "Social media", icon: Megaphone, module: "social" },
  { href: "/crm/financiar", label: "Financiar", icon: Wallet, module: "financiar" },
  { href: "/crm/fisiere", label: "Fișiere", icon: HardDrive, module: "fisiere" },
  { href: "/crm/angajati", label: "Angajați", icon: UserCog, module: "angajati" },
  { href: "/crm/rapoarte", label: "Rapoarte", icon: PieChart, module: "rapoarte" },
  { href: "/crm/website", label: "Website", icon: Globe, module: "website" },
  { href: "/crm/setari", label: "Setări", icon: Settings, module: "setari" },
];

export function Sidebar({ allowed }: { allowed: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const items = ITEMS.filter((i) => i.module === "*" || allowed.includes(i.module) || (i.module === "proiecte" && allowed.includes("proiecte_toate")));
  const isActive = (href: string) => (href === "/crm" ? pathname === "/crm" : pathname.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="px-5 pb-6 pt-5"><Logo href="/crm" light /></div>
      <div className="crm-scroll flex-1 space-y-1 overflow-y-auto px-3">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
              isActive(i.href) ? "bg-gradient-to-r from-[#2B4CF5] to-[#5B5CF6] text-white shadow-[0_8px_20px_-8px_rgba(43,76,245,.8)]" : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <i.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {i.label}
          </Link>
        ))}
      </div>
      <div className="border-t border-white/10 p-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs text-white/50 hover:text-white">
          <ExternalLink className="h-4 w-4" /> Vezi site-ul
        </a>
      </div>
    </nav>
  );

  return (
    <>
      <button className="fixed left-3 top-3 z-50 rounded-xl bg-navy p-2 text-white shadow-lg lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Meniu">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] bg-navy lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[250px] bg-navy">{nav}</aside>
        </div>
      )}
    </>
  );
}
