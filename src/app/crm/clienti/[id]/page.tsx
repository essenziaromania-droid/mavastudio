import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ExternalLink, FileText, Mail, Pencil, Receipt } from "lucide-react";
import { ConfirmSubmit, CopyButton, SubmitButton } from "@/components/crm/client-ui";
import { regeneratePortalLink, sendPortalLink } from "../../actions/portal";
import { SITE } from "@/content/site";
import { getSession } from "@/lib/crm/auth";
import { Avatar, KeyVal, PageHeader, Panel, ProgressBar, StatusBadge, Table, Td, Tabs } from "@/components/crm/ui";
import { NoteForm, Timeline, type ActivityRow } from "@/components/crm/timeline";
import { CLIENT_STATUS, CONTRACT_STATUS, EVENT_TYPE, INVOICE_STATUS, OFFER_STATUS, PROJECT_STATUS, SERVICE_CATEGORY } from "@/lib/crm/constants";
import { formatDate, formatLei } from "@/lib/utils";
import { FilesBrowser } from "@/components/crm/files-browser";
import { MessageThread, type MessageRow } from "@/components/crm/messages";

export const metadata = { title: "Profil client" };

export default async function ClientProfile({ params, searchParams }: { params: { id: string }; searchParams: { tab?: string; portal_sent?: string; portal_err?: string; portal_new?: string; replied?: string; err?: string } }) {
  const s = await getSession();
  if (!s.can("clienti") && !s.can("proiecte")) notFound();
  const { sb } = s;
  const { data: c } = await sb.from("clients").select("*").eq("id", params.id).maybeSingle();
  if (!c) notFound();
  const tab = searchParams.tab ?? "prezentare";

  const [offers, contracts, projects, invoices, acts, nextEvent] = await Promise.all([
    sb.from("offers").select("id, number, title, status, total, created_at").eq("client_id", c.id).order("created_at", { ascending: false }),
    sb.from("contracts").select("id, number, title, status, value, created_at, signed_at").eq("client_id", c.id).order("created_at", { ascending: false }),
    sb.from("projects").select("id, name, status, progress, category, value, deadline").eq("client_id", c.id).order("created_at", { ascending: false }),
    sb.from("invoices").select("id, series, number, status, total, paid_amount, issue_date, due_date").eq("client_id", c.id).order("issue_date", { ascending: false }),
    sb.from("activities").select("id, type, title, description, created_at, profiles:actor_id(full_name)").eq("client_id", c.id).order("created_at", { ascending: false }).limit(100),
    sb.from("events").select("id, title, start_at, type").eq("client_id", c.id).gte("start_at", new Date().toISOString()).order("start_at").limit(1).maybeSingle(),
  ]);

  const canMail = s.can("mesaje");
  const msgs = canMail
    ? await sb.from("messages").select("id, direction, source, from_email, from_name, to_emails, subject, body_text, attachment_names, sent_at, read, message_id").eq("client_id", c.id).order("sent_at", { ascending: false }).limit(200)
    : { data: [] as MessageRow[] };
  const unreadMsgs = (msgs.data ?? []).filter((m) => !m.read && m.direction === "in").length;
  // La deschiderea tab-ului, mesajele clientului devin citite (rămân evidențiate doar acum).
  if (tab === "mesaje" && unreadMsgs) await sb.from("messages").update({ read: true }).eq("client_id", c.id).eq("read", false);

  const signedValue = (contracts.data ?? []).filter((x) => x.status === "semnat").reduce((a, x) => a + Number(x.value), 0);
  const invoiced = (invoices.data ?? []).filter((i) => !["draft", "anulata"].includes(i.status)).reduce((a, i) => a + Number(i.total), 0);
  const toCollect = (invoices.data ?? []).filter((i) => ["emisa", "trimisa", "partial", "restanta"].includes(i.status)).reduce((a, i) => a + Number(i.total) - Number(i.paid_amount), 0);
  const base = `/crm/clienti/${c.id}`;

  return (
    <>
      <PageHeader
        back={{ href: "/crm/clienti", label: "Clienți" }}
        title={<span className="flex items-center gap-3">{c.name} <StatusBadge map={CLIENT_STATUS} value={c.status} /></span>}
        sub={`Client din ${formatDate(c.created_at)}`}
        actions={
          <>
            {c.drive_folder_url && <a href={c.drive_folder_url} target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> Dosar Drive</a>}
            <Link href={`${base}/editare`} className="btn-ghost !py-2.5"><Pencil className="h-4 w-4" /> Editează</Link>
            {s.can("oferte") && <Link href={`/crm/oferte/noua?client=${c.id}`} className="btn-outline !py-2.5"><FileText className="h-4 w-4" /> Generează ofertă</Link>}
            {s.can("financiar") && <Link href={`/crm/financiar/facturi/noua?client=${c.id}`} className="btn-primary !py-2.5"><Receipt className="h-4 w-4" /> Emite factură</Link>}
          </>
        }
      />
      <Tabs
        active={tab}
        items={[
          { key: "prezentare", label: "Prezentare", href: base },
          { key: "oferte", label: "Oferte", href: `${base}?tab=oferte`, count: offers.data?.length },
          { key: "contracte", label: "Contracte", href: `${base}?tab=contracte`, count: contracts.data?.length },
          { key: "proiecte", label: "Proiecte", href: `${base}?tab=proiecte`, count: projects.data?.length },
          { key: "facturi", label: "Facturi", href: `${base}?tab=facturi`, count: invoices.data?.length },
          ...(canMail ? [{ key: "mesaje", label: unreadMsgs ? `Mesaje · ${unreadMsgs} noi` : "Mesaje", href: `${base}?tab=mesaje`, count: msgs.data?.length }] : []),
          { key: "fisiere", label: "Fișiere", href: `${base}?tab=fisiere` },
          { key: "activitate", label: "Activitate", href: `${base}?tab=activitate` },
        ]}
      />

      {tab === "prezentare" && (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
          <Panel title="Detalii client">
            <dl>
              {c.type === "company" && <KeyVal k="CUI" v={c.cui} />}
              {c.type === "company" && <KeyVal k="Nr. Reg. Com." v={c.reg_com} />}
              <KeyVal k="Adresă" v={[c.address, c.city, c.county].filter(Boolean).join(", ")} />
              <KeyVal k="Telefon" v={c.phone} />
              <KeyVal k="Email" v={c.email && <a className="text-brand-blue" href={`mailto:${c.email}`}>{c.email}</a>} />
              <KeyVal k="Website" v={c.website && <a className="text-brand-blue" href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank">{c.website}</a>} />
              <KeyVal k="Sursă lead" v={c.source} />
            </dl>
            {c.notes && <p className="mt-3 rounded-xl bg-soft p-3 text-sm text-body">{c.notes}</p>}
          </Panel>
          <div className="space-y-6">
            <Panel title="Proiecte active">
              <ul className="space-y-3">
                {(projects.data ?? []).filter((p) => p.status !== "finalizat").slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <Link href={`/crm/proiecte/${p.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-line p-3 hover:border-brand-blue/40">
                      <span className="text-sm font-semibold text-ink">{p.name}</span>
                      <StatusBadge map={PROJECT_STATUS} value={p.status} />
                    </Link>
                  </li>
                ))}
                {!projects.data?.some((p) => p.status !== "finalizat") && <li className="text-sm text-muted">Niciun proiect activ.</li>}
              </ul>
            </Panel>
            <Panel>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-xs text-muted">Valoare contracte</p><p className="mt-1 font-extrabold text-ink">{formatLei(signedValue)}</p></div>
                <div><p className="text-xs text-muted">Total facturat</p><p className="mt-1 font-extrabold text-ink">{formatLei(invoiced)}</p></div>
                <div><p className="text-xs text-muted">De încasat</p><p className="mt-1 font-extrabold text-rose-500">{formatLei(toCollect)}</p></div>
              </div>
            </Panel>
          </div>
          <div className="space-y-6">
            <Panel title="Portal client">
              {searchParams.portal_sent && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Linkul a fost trimis la {searchParams.portal_sent}.</p>}
              {searchParams.portal_err && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{searchParams.portal_err}</p>}
              {searchParams.portal_new && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Link nou generat. Cel vechi nu mai funcționează; trimite-l pe cel nou clientului.</p>}
              <p className="text-sm text-body">Clientul vede proiectele, materialele de aprobat, contractele și facturile lui.</p>
              <p className="mt-2 text-xs text-muted">{c.portal_last_seen ? `Ultima vizită: ${formatDate(c.portal_last_seen, true)}` : "Clientul nu a deschis încă portalul."}</p>
              {c.portal_token && (
                <>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <CopyButton text={`${SITE.url}/portal/${c.portal_token}`} />
                    <a href={`${SITE.url}/portal/${c.portal_token}`} target="_blank" className="btn-ghost btn-sm"><ExternalLink className="h-4 w-4" /> Deschide</a>
                  </div>
                  <form action={sendPortalLink} className="mt-3 flex gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <input name="to" type="email" required defaultValue={c.contact_email || c.email || ""} placeholder="email client" className="input !py-2 text-sm" />
                    <SubmitButton className="btn-sm shrink-0" pendingText="..."><Mail className="h-4 w-4" /> Trimite</SubmitButton>
                  </form>
                  <form action={regeneratePortalLink} className="mt-3">
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmSubmit message="Generezi un link nou? Cel vechi nu va mai funcționa.">Regenerează linkul</ConfirmSubmit>
                  </form>
                </>
              )}
              {!c.portal_token && <p className="mt-3 text-xs text-amber-700">Rulează migrarea 0005_client_portal.sql în Supabase pentru a activa portalul.</p>}
            </Panel>
            {c.type === "company" && (
              <Panel title="Persoană de contact">
                <div className="flex items-center gap-3">
                  <Avatar name={c.contact_name ?? c.name} size={44} />
                  <div className="text-sm">
                    <p className="font-bold text-ink">{c.contact_name ?? "—"}</p>
                    <p className="text-xs text-muted">{c.contact_role}</p>
                    <p className="text-brand-blue">{c.contact_email}</p>
                    <p className="text-body">{c.contact_phone}</p>
                  </div>
                </div>
              </Panel>
            )}
            <Panel title="Următoarea activitate">
              {nextEvent.data ? (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand-blue"><CalendarDays className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{nextEvent.data.title}</p>
                    <p className="text-xs text-muted">{formatDate(nextEvent.data.start_at, true)} · {EVENT_TYPE[nextEvent.data.type as keyof typeof EVENT_TYPE]?.label}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted">Nimic programat.</p>
              )}
              <Link href={`/crm/calendar?client=${c.id}#nou`} className="btn-ghost btn-sm mt-4 w-full">Programează</Link>
            </Panel>
          </div>
        </div>
      )}

      {tab === "oferte" && (
        <Panel pad={false}>
          <Table head={["Număr", "Titlu", "Status", "Total", "Data"]} empty="Nicio ofertă.">
            {(offers.data ?? []).map((o) => (
              <tr key={o.id} className="hover:bg-soft/50">
                <Td><Link href={`/crm/oferte/${o.id}`} className="font-semibold text-brand-blue">{o.number}</Link></Td>
                <Td>{o.title}</Td>
                <Td><StatusBadge map={OFFER_STATUS} value={o.status} /></Td>
                <Td className="font-semibold">{formatLei(o.total)}</Td>
                <Td className="text-xs text-muted">{formatDate(o.created_at)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "contracte" && (
        <Panel pad={false}>
          <Table head={["Nr. contract", "Titlu", "Valoare", "Status", "Semnat"]} empty="Niciun contract.">
            {(contracts.data ?? []).map((x) => (
              <tr key={x.id} className="hover:bg-soft/50">
                <Td><Link href={`/crm/contracte/${x.id}`} className="font-semibold text-brand-blue">{x.number}</Link></Td>
                <Td>{x.title}</Td>
                <Td className="font-semibold">{formatLei(x.value)}</Td>
                <Td><StatusBadge map={CONTRACT_STATUS} value={x.status} /></Td>
                <Td className="text-xs text-muted">{formatDate(x.signed_at)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "proiecte" && (
        <Panel pad={false}>
          <Table head={["Proiect", "Serviciu", "Status", "Progres", "Valoare", "Deadline"]} empty="Niciun proiect.">
            {(projects.data ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-soft/50">
                <Td><Link href={`/crm/proiecte/${p.id}`} className="font-semibold text-ink hover:text-brand-blue">{p.name}</Link></Td>
                <Td className="text-xs">{SERVICE_CATEGORY[p.category ?? ""]?.label ?? "—"}</Td>
                <Td><StatusBadge map={PROJECT_STATUS} value={p.status} /></Td>
                <Td className="w-40"><ProgressBar value={p.progress} /><span className="text-[11px] text-muted">{p.progress}%</span></Td>
                <Td>{formatLei(p.value)}</Td>
                <Td className="text-xs">{formatDate(p.deadline)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "facturi" && (
        <Panel pad={false}>
          <Table head={["Factură", "Emisă", "Scadență", "Total", "Încasat", "Status"]} empty={s.can("financiar") ? "Nicio factură." : "Nu ai acces la datele financiare."}>
            {(invoices.data ?? []).map((i) => (
              <tr key={i.id} className="hover:bg-soft/50">
                <Td><Link href={`/crm/financiar/facturi/${i.id}`} className="font-semibold text-brand-blue">{[i.series, i.number].filter(Boolean).join(" ") || "Draft"}</Link></Td>
                <Td className="text-xs">{formatDate(i.issue_date)}</Td>
                <Td className="text-xs">{formatDate(i.due_date)}</Td>
                <Td className="font-semibold">{formatLei(i.total)}</Td>
                <Td>{formatLei(i.paid_amount)}</Td>
                <Td><StatusBadge map={INVOICE_STATUS} value={i.status} /></Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "fisiere" && <FilesBrowser clientId={c.id} clientName={c.name} />}
      {tab === "mesaje" && canMail && (
        <>
          {searchParams.replied && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Emailul a fost trimis.</p>}
          {searchParams.err && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}
          <MessageThread messages={(msgs.data ?? []) as MessageRow[]} back={`${base}?tab=mesaje`} replyTo={c.contact_email || c.email} />
        </>
      )}

      {tab === "activitate" && (
        <Panel title="Timeline client" className="max-w-3xl">
          <NoteForm clientId={c.id} path={`${base}?tab=activitate`} />
          <Timeline items={(acts.data ?? []) as unknown as ActivityRow[]} />
        </Panel>
      )}
    </>
  );
}
