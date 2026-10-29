import Link from "next/link";
import { Bell } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { PageHeader, Panel } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { markAllRead } from "../actions/admin";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Notificări" };

export default async function NotificationsPage() {
  const s = await getSession();
  let q = s.sb.from("notifications").select("*").order("created_at", { ascending: false }).limit(150);
  q = s.isAdmin ? q.or(`user_id.eq.${s.userId},user_id.is.null`) : q.eq("user_id", s.userId);
  const { data } = await q;
  return (
    <>
      <PageHeader title="Notificări" actions={<form action={markAllRead}><SubmitButton variant="ghost">Marchează toate ca citite</SubmitButton></form>} />
      <Panel pad={false} className="max-w-3xl">
        <ul className="divide-y divide-line">
          {(data ?? []).map((n) => {
            const inner = (
              <div className={cn("flex gap-4 px-5 py-4", !n.read_at && "bg-blue-50/50")}>
                <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", n.read_at ? "bg-soft text-muted" : "bg-blue-100 text-brand-blue")}><Bell className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", n.read_at ? "text-body" : "font-semibold text-ink")}>{n.title}</p>
                  {n.body && <p className="truncate text-xs text-muted">{n.body}</p>}
                  <p className="mt-1 text-[11px] text-muted">{formatDate(n.created_at, true)}</p>
                </div>
              </div>
            );
            return <li key={n.id}>{n.link ? <Link href={n.link} className="block hover:bg-soft/60">{inner}</Link> : inner}</li>;
          })}
          {!data?.length && <li className="px-5 py-14 text-center text-sm text-muted">Nicio notificare.</li>}
        </ul>
      </Panel>
    </>
  );
}
