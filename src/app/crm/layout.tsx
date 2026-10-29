import type { Metadata } from "next";
import Link from "next/link";
import { Bell, LogOut, Search } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { Sidebar } from "@/components/crm/sidebar";
import { Avatar } from "@/components/crm/ui";
import { ROLES } from "@/lib/crm/constants";
import { signOut } from "./actions/auth";

export const metadata: Metadata = { title: { default: "CRM", template: "%s · CRM MAVA Studio" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  const allowed = s.isAdmin ? ["dashboard", "leads", "clienti", "oferte", "contracte", "proiecte", "proiecte_toate", "taskuri", "calendar", "financiar", "fisiere", "angajati", "rapoarte", "website", "setari"] : Array.from(s.perms);

  let unreadQuery = s.sb.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null);
  unreadQuery = s.isAdmin ? unreadQuery.or(`user_id.eq.${s.userId},user_id.is.null`) : unreadQuery.eq("user_id", s.userId);
  const { count: unread } = await unreadQuery;

  return (
    <div className="min-h-screen bg-[#F5F6FC]">
      <Sidebar allowed={allowed} />
      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-white/85 px-4 pl-16 backdrop-blur lg:px-8">
          <form action="/crm/cautare" className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input name="q" placeholder="Caută clienți, lead-uri, oferte, proiecte..." className="w-full rounded-xl border border-line bg-soft py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-blue focus:bg-white" />
          </form>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/crm/notificari" className="relative rounded-full p-2 text-ink-2 hover:bg-soft" aria-label="Notificări">
              <Bell className="h-5 w-5" />
              {!!unread && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread > 99 ? "99+" : unread}</span>}
            </Link>
            <Link href="/crm/cont" className="flex items-center gap-2.5">
              <Avatar name={s.profile.full_name} src={s.profile.avatar_url} size={34} />
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-semibold text-ink">{s.profile.full_name}</span>
                <span className="block text-[11px] text-muted">{ROLES[s.profile.role]}</span>
              </span>
            </Link>
            <form action={signOut}>
              <button className="rounded-full p-2 text-muted hover:bg-soft hover:text-rose-500" title="Deconectare"><LogOut className="h-4 w-4" /></button>
            </form>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
