import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Send } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { PageHeader, Panel, StatusBadge } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { SOCIAL_FORMATS, SOCIAL_STATUS } from "@/lib/crm/constants";
import { sendMonthForApproval } from "../actions/social";
import { cn } from "@/lib/utils";

export const metadata = { title: "Social media" };

const TZ = "Europe/Bucharest";
const MONTHS = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
const DAYS = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const ymdRo = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(d);
const hmRo = (d: Date) => new Intl.DateTimeFormat("ro-RO", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(d);

const CHIP: Record<string, string> = {
  idee: "border-slate-200 bg-slate-50 text-slate-600",
  in_lucru: "border-blue-200 bg-blue-50 text-blue-700",
  de_aprobat: "border-purple-200 bg-purple-50 text-purple-700",
  modificari: "border-amber-200 bg-amber-50 text-amber-800",
  aprobat: "border-emerald-200 bg-emerald-50 text-emerald-700",
  programat: "border-cyan-200 bg-cyan-50 text-cyan-700",
  publicat: "border-emerald-300 bg-emerald-100 text-emerald-800",
};
const PLATFORM_SHORT: Record<string, string> = { facebook: "FB", instagram: "IG", tiktok: "TT", linkedin: "IN", youtube: "YT" };

export default async function SocialCalendar({ searchParams }: { searchParams: { m?: string; client?: string; sent?: string; err?: string } }) {
  const { sb } = await requireModule("social");
  const now = ymdRo(new Date()).slice(0, 7);
  const month = /^\d{4}-\d{2}$/.test(searchParams.m ?? "") ? searchParams.m! : now;
  const [y, mo] = month.split("-").map(Number) as [number, number];
  const prev = mo === 1 ? `${y - 1}-12` : `${y}-${String(mo - 1).padStart(2, "0")}`;
  const next = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`;
  const clientId = searchParams.client ?? "";
  const qs = (m: string) => `/crm/social?m=${m}${clientId ? `&client=${clientId}` : ""}`;

  // Interval larg (o zi în plus la capete), apoi grupăm pe ziua din România.
  const from = new Date(Date.UTC(y, mo - 1, 1) - 864e5).toISOString();
  const to = new Date(Date.UTC(y, mo, 1) + 864e5).toISOString();
  let q = sb.from("social_posts").select("id, scheduled_at, platforms, format, title, caption, status, client_id, clients(name)").gte("scheduled_at", from).lt("scheduled_at", to).order("scheduled_at");
  if (clientId) q = q.eq("client_id", clientId);
  const [{ data: posts, error }, { data: clients }] = await Promise.all([q, sb.from("clients").select("id, name").order("name")]);

  const byDay = new Map<string, NonNullable<typeof posts>>();
  (posts ?? []).forEach((p) => {
    const d = ymdRo(new Date(p.scheduled_at));
    if (!d.startsWith(month)) return;
    byDay.set(d, [...(byDay.get(d) ?? []), p]);
  });
  const monthPosts = Array.from(byDay.values()).flat();
  const counts = new Map<string, number>();
  monthPosts.forEach((p) => counts.set(p.status, (counts.get(p.status) ?? 0) + 1));
  const ready = monthPosts.filter((p) => ["in_lucru", "modificari"].includes(p.status)).length;

  // Grila lunii, cu săptămâna începând luni.
  const first = new Date(Date.UTC(y, mo - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`)];
  while (cells.length % 7) cells.push(null);
  const today = ymdRo(new Date());

  return (
    <>
      <PageHeader
        title="Social media"
        sub="Calendarul postărilor pentru clienți. Postările trimise spre aprobare apar în portalul clientului."
        actions={<Link href={`/crm/social/nou${clientId ? `?client=${clientId}` : ""}`} className="btn-primary !py-2.5"><Plus className="h-4 w-4" /> Postare nouă</Link>}
      />
      {error && <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Rulează migrarea supabase/migrations/0006_social_calendar.sql în Supabase pentru a activa calendarul.</p>}
      {searchParams.sent && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{searchParams.sent} postări trimise clientului spre aprobare.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{searchParams.err}</p>}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href={qs(prev)} className="rounded-xl border border-line bg-white p-2 hover:border-brand-blue/40" aria-label="Luna anterioară"><ChevronLeft className="h-4 w-4" /></Link>
          <h2 className="min-w-[170px] text-center text-lg font-extrabold">{MONTHS[mo - 1]} {y}</h2>
          <Link href={qs(next)} className="rounded-xl border border-line bg-white p-2 hover:border-brand-blue/40" aria-label="Luna următoare"><ChevronRight className="h-4 w-4" /></Link>
          {month !== now && <Link href={qs(now)} className="btn-ghost btn-sm">Azi</Link>}
        </div>
        <form className="flex items-center gap-2">
          <input type="hidden" name="m" value={month} />
          <select name="client" defaultValue={clientId} className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
            <option value="">Toți clienții</option>
            {(clients ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="btn-ghost btn-sm">Aplică</button>
        </form>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {Object.entries(SOCIAL_STATUS).map(([k, v]) => (
          <span key={k} className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", CHIP[k])}>{v.label}{counts.get(k) ? ` · ${counts.get(k)}` : ""}</span>
        ))}
        {clientId && (
          <form action={sendMonthForApproval} className="ml-auto">
            <input type="hidden" name="client_id" value={clientId} />
            <input type="hidden" name="month" value={month} />
            <SubmitButton className="btn-sm" pendingText="Se trimite..."><Send className="h-4 w-4" /> Trimite luna spre aprobare{ready ? ` (${ready})` : ""}</SubmitButton>
          </form>
        )}
      </div>
      {!clientId && <p className="-mt-2 mb-4 text-xs text-muted">Alege un client ca să poți trimite postările lunii spre aprobare.</p>}

      <Panel pad={false}>
        <div className="grid grid-cols-7 border-b border-line text-center text-[11px] font-bold uppercase tracking-wider text-muted">
          {DAYS.map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => (
            <div key={i} className={cn("group min-h-[120px] border-b border-r border-line p-1.5", !d && "bg-soft/40", i % 7 === 6 && "border-r-0")}>
              {d && (
                <>
                  <div className="mb-1 flex items-center justify-between">
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold", d === today ? "bg-brand-blue text-white" : "text-ink-2")}>{Number(d.slice(8))}</span>
                    <Link href={`/crm/social/nou?date=${d}${clientId ? `&client=${clientId}` : ""}`} className="rounded p-0.5 text-muted opacity-0 transition hover:text-brand-blue group-hover:opacity-100" aria-label="Postare nouă"><Plus className="h-3.5 w-3.5" /></Link>
                  </div>
                  <div className="space-y-1">
                    {(byDay.get(d) ?? []).map((p) => (
                      <Link key={p.id} href={`/crm/social/${p.id}`} className={cn("block rounded-lg border px-1.5 py-1 text-[11px] leading-tight hover:shadow-sm", CHIP[p.status])}>
                        <span className="font-bold">{hmRo(new Date(p.scheduled_at))}</span> {(p.platforms as string[]).map((x) => PLATFORM_SHORT[x] ?? x).join("·")}
                        <span className="block truncate">{!clientId && <b>{(p.clients as unknown as { name: string } | null)?.name} · </b>}{p.title || SOCIAL_FORMATS[p.format] || "Postare"}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {!!monthPosts.length && (
        <Panel title={`Toate postările din ${MONTHS[mo - 1].toLowerCase()}`} className="mt-6" pad={false}>
          <ul className="divide-y divide-line">
            {monthPosts.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)).map((p) => (
              <li key={p.id}>
                <Link href={`/crm/social/${p.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-soft/50">
                  <span className="w-28 shrink-0 text-xs text-muted">{new Intl.DateTimeFormat("ro-RO", { timeZone: TZ, day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(p.scheduled_at))}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{p.title || SOCIAL_FORMATS[p.format]}</span>
                    <span className="block truncate text-xs text-muted">{(p.clients as unknown as { name: string } | null)?.name} · {(p.platforms as string[]).map((x) => PLATFORM_SHORT[x] ?? x).join(", ")}{p.caption ? ` · ${p.caption.slice(0, 80)}` : ""}</span>
                  </span>
                  <StatusBadge map={SOCIAL_STATUS} value={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
