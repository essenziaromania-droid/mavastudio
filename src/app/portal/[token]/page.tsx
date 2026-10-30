import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, Clock, Download, ExternalLink, FileText, Film, FolderOpen, Image as ImageIcon, MessageSquare, PenLine, Receipt } from "lucide-react";
import { clientByToken, portalData, reviewable } from "@/lib/portal";
import { formatDate, formatLei, cn } from "@/lib/utils";
import { MessageForm } from "./forms";

const PROJECT_STATUS: Record<string, string> = { de_inceput: "Urmează să înceapă", in_lucru: "În lucru", review: "În verificare", finalizat: "Finalizat" };
const INVOICE_STATUS: Record<string, [string, string]> = {
  emisa: ["De plată", "bg-amber-50 text-amber-700"],
  trimisa: ["De plată", "bg-amber-50 text-amber-700"],
  partial: ["Plătită parțial", "bg-amber-50 text-amber-700"],
  restanta: ["Restantă", "bg-rose-50 text-rose-600"],
  platita: ["Plătită", "bg-emerald-50 text-emerald-700"],
};
const REVIEW: Record<string, [string, string]> = {
  aprobat: ["Aprobat", "bg-emerald-50 text-emerald-700"],
  modificari: ["Modificări cerute", "bg-amber-50 text-amber-700"],
};

export default async function PortalHome({ params, searchParams }: { params: { token: string }; searchParams: { tab?: string } }) {
  const client = await clientByToken(params.token);
  if (!client) notFound();
  const d = await portalData(client.id);
  const tab = searchParams.tab ?? "proiecte";
  const base = `/portal/${params.token}`;
  const toReview = d.files.filter((f) => reviewable(f.folder) && !f.review_status).length;
  const toPay = d.invoices.filter((i) => ["emisa", "trimisa", "partial", "restanta"].includes(i.status)).length;
  const toSign = d.contracts.filter((c) => !c.signed_at).length;

  const tabs = [
    { key: "proiecte", label: "Proiecte", count: d.projects.length },
    { key: "materiale", label: "Materiale", count: toReview, alert: toReview > 0 },
    { key: "documente", label: "Documente", count: toSign + toPay, alert: toSign + toPay > 0 },
    { key: "mesaj", label: "Scrie-ne" },
  ];

  return (
    <>
      <h1 className="text-3xl font-extrabold md:text-4xl">Bun venit{client.contact_name ? `, ${client.contact_name.split(" ")[0]}` : ""}!</h1>
      <p className="mt-2 text-body">Aici vezi stadiul proiectelor tale, materialele de aprobat și documentele, într-un singur loc.</p>

      {(toReview > 0 || toSign > 0 || toPay > 0) && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {toReview > 0 && <Link href={`${base}?tab=materiale`} className="card flex items-center gap-3 p-4 card-hover"><ImageIcon className="h-5 w-5 text-purple-600" /><span className="text-sm"><b className="text-ink">{toReview}</b> {toReview === 1 ? "material așteaptă" : "materiale așteaptă"} aprobarea ta</span></Link>}
          {toSign > 0 && <Link href={`${base}?tab=documente`} className="card flex items-center gap-3 p-4 card-hover"><PenLine className="h-5 w-5 text-brand-blue" /><span className="text-sm"><b className="text-ink">{toSign}</b> {toSign === 1 ? "contract de semnat" : "contracte de semnat"}</span></Link>}
          {toPay > 0 && <Link href={`${base}?tab=documente`} className="card flex items-center gap-3 p-4 card-hover"><Receipt className="h-5 w-5 text-amber-600" /><span className="text-sm"><b className="text-ink">{toPay}</b> {toPay === 1 ? "factură de plată" : "facturi de plată"}</span></Link>}
        </div>
      )}

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-line">
        {tabs.map((t) => (
          <Link key={t.key} href={`${base}?tab=${t.key}`} className={cn("-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold", tab === t.key ? "border-brand-blue text-brand-blue" : "border-transparent text-ink-2 hover:text-ink")}>
            {t.label}
            {!!t.count && <span className={cn("rounded-full px-2 py-0.5 text-[11px]", t.alert ? "bg-brand-blue text-white" : "bg-soft text-muted")}>{t.count}</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "proiecte" && (
          <div className="space-y-5">
            {!d.projects.length && <Empty icon={FolderOpen} text="Proiectele tale vor apărea aici după semnarea contractului." />}
            {d.projects.map((p) => (
              <section key={p.id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold">{p.name}</h2>
                    <p className="text-sm text-muted">{PROJECT_STATUS[p.status] ?? p.status}{p.deadline ? ` · termen estimat ${formatDate(p.deadline)}` : ""}</p>
                  </div>
                  <span className="font-display text-3xl font-extrabold text-gradient">{p.progress}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-brand-gradient" style={{ width: `${p.progress}%` }} /></div>
                {!!p.tasks.length && (
                  <ol className="mt-5 grid gap-2 sm:grid-cols-2">
                    {p.tasks.map((t) => {
                      const done = t.status === "finalizat";
                      const active = ["in_lucru", "review"].includes(t.status);
                      return (
                        <li key={t.id} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm", done ? "border-emerald-100 bg-emerald-50/50" : active ? "border-brand-blue/30 bg-blue-50/50" : "border-line")}>
                          {done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : active ? <Clock className="h-4 w-4 shrink-0 text-brand-blue" /> : <Circle className="h-4 w-4 shrink-0 text-muted" />}
                          <span className={cn("flex-1", done ? "text-body" : "text-ink")}>{t.title}</span>
                          {t.deadline && !done && <span className="text-[11px] text-muted">{formatDate(t.deadline)}</span>}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            ))}
          </div>
        )}

        {tab === "materiale" && (
          <>
            {!d.files.length && <Empty icon={ImageIcon} text="Materialele pregătite pentru tine (design-uri, video-uri, livrabile) vor apărea aici." />}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.files.map((f) => {
                const isImg = f.mime?.startsWith("image/");
                const isVid = f.mime?.startsWith("video/");
                const rv = f.review_status ? REVIEW[f.review_status] : null;
                return (
                  <Link key={f.id} href={`${base}/fisier/${f.id}`} className="card group overflow-hidden card-hover">
                    <div className="relative flex aspect-[16/10] items-center justify-center bg-soft">
                      {isImg && f.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.url} alt={f.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : isVid ? (
                        <Film className="h-10 w-10 text-brand-blue" />
                      ) : (
                        <FileText className="h-10 w-10 text-brand-blue" />
                      )}
                      {reviewable(f.folder) && (
                        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold", rv ? rv[1] : "bg-brand-blue text-white")}>{rv ? rv[0] : "De aprobat"}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="truncate font-semibold text-ink" title={f.name}>{f.name}</p>
                      <p className="mt-0.5 flex items-center gap-3 text-xs text-muted">
                        <span>{formatDate(f.created_at)}</span>
                        {f.comments > 0 && <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {f.comments}</span>}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {tab === "documente" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <DocList title="Contracte" empty="Niciun contract încă.">
              {d.contracts.map((c) => (
                <DocRow key={c.id} title={`${c.number} · ${c.title}`} meta={c.signed_at ? `Semnat la ${formatDate(c.signed_at)}` : "Așteaptă semnătura ta"} badge={c.signed_at ? ["Semnat", "bg-emerald-50 text-emerald-700"] : ["De semnat", "bg-brand-blue text-white"]}>
                  <a href={`/contract/${c.public_token}`} className="btn-ghost btn-sm !py-1.5"><ExternalLink className="h-3.5 w-3.5" /> {c.signed_at ? "Vezi" : "Citește și semnează"}</a>
                  <a href={`/api/pdf/contract/${c.public_token}?public=1&download=1`} className="btn-ghost btn-sm !py-1.5"><Download className="h-3.5 w-3.5" /> PDF</a>
                </DocRow>
              ))}
            </DocList>
            <DocList title="Facturi" empty="Nicio factură încă.">
              {d.invoices.map((i) => {
                const st = INVOICE_STATUS[i.status] ?? ["Emisă", "bg-soft text-muted"];
                const rest = Number(i.total) - Number(i.paid_amount);
                return (
                  <DocRow key={i.id} title={`Factura ${i.series ?? ""} ${i.number}`} meta={`${formatLei(i.total, { decimals: true })}${i.due_date && i.status !== "platita" ? ` · scadentă ${formatDate(i.due_date)}` : ""}${i.status === "partial" ? ` · rest ${formatLei(rest, { decimals: true })}` : ""}`} badge={st as [string, string]}>
                    {i.provider !== "manual" && <a href={`/api/portal/${params.token}/factura/${i.id}`} className="btn-ghost btn-sm !py-1.5"><Download className="h-3.5 w-3.5" /> PDF</a>}
                  </DocRow>
                );
              })}
            </DocList>
            <DocList title="Oferte" empty="Nicio ofertă încă.">
              {d.offers.map((o) => (
                <DocRow key={o.id} title={`${o.number} · ${o.title}`} meta={`${formatLei(o.total, { decimals: true })} · ${formatDate(o.created_at)}`} badge={o.status === "acceptata" ? ["Acceptată", "bg-emerald-50 text-emerald-700"] : null}>
                  <a href={`/oferta/${o.public_token}`} className="btn-ghost btn-sm !py-1.5"><ExternalLink className="h-3.5 w-3.5" /> Vezi oferta</a>
                </DocRow>
              ))}
            </DocList>
          </div>
        )}

        {tab === "mesaj" && (
          <div className="card max-w-2xl p-6">
            <h2 className="text-xl font-extrabold">Scrie-ne</h2>
            <p className="mt-1 text-sm text-body">Ai o întrebare sau o idee? Echipa MAVA Studio primește mesajul imediat și îți răspunde pe email.</p>
            <div className="mt-5"><MessageForm token={params.token} /></div>
          </div>
        )}
      </div>
    </>
  );
}

function Empty({ icon: I, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <I className="h-10 w-10 text-brand-blue/60" />
      <p className="max-w-sm text-sm text-body">{text}</p>
    </div>
  );
}

function DocList({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const has = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <section className="card p-5">
      <h2 className="mb-3 font-bold">{title}</h2>
      {has ? <ul className="divide-y divide-line">{children}</ul> : <p className="text-sm text-muted">{empty}</p>}
    </section>
  );
}

function DocRow({ title, meta, badge, children }: { title: string; meta: string; badge: [string, string] | null; children?: React.ReactNode }) {
  return (
    <li className="py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {badge && <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", badge[1])}>{badge[0]}</span>}
      </div>
      <p className="text-xs text-muted">{meta}</p>
      {children && <div className="mt-2 flex flex-wrap gap-2">{children}</div>}
    </li>
  );
}
