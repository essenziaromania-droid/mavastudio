import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Send } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { KeyVal, PageHeader, Panel } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { MediaReview } from "@/components/ui/media-review";
import { requestApproval, resolveFileComments, teamFileComment, toggleFileVisibility } from "../../actions/portal";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/content/site";

export const metadata = { title: "Fișier" };

const CLIENT_FOLDERS = ["02 Contract", "09 Livrabile", "10 Facturi"];
const REVIEW: Record<string, [string, string]> = {
  in_asteptare: ["Așteaptă aprobarea clientului", "bg-blue-50 text-brand-blue"],
  aprobat: ["Aprobat de client", "bg-emerald-50 text-emerald-700"],
  modificari: ["Clientul a cerut modificări", "bg-amber-50 text-amber-700"],
};

export default async function FilePage({ params, searchParams }: { params: { id: string }; searchParams: { sent?: string; err?: string } }) {
  const s = await getSession();
  if (!s.can("fisiere") && !s.can("proiecte")) notFound();
  const { data: f } = await s.sb.from("files").select("*, clients(id, name, portal_token), projects(id, name)").eq("id", params.id).maybeSingle();
  if (!f) notFound();
  const [{ data: signed }, { data: comments }] = await Promise.all([
    s.sb.storage.from("crm-files").createSignedUrl(f.path, 3600),
    s.sb.from("file_comments").select("id, author_type, author_name, body, timecode, created_at, resolved").eq("file_id", f.id).order("timecode", { ascending: true, nullsFirst: false }).order("created_at"),
  ]);
  const client = f.clients as { id: string; name: string; portal_token: string } | null;
  const project = f.projects as { id: string; name: string } | null;
  const visible = f.visible_to_client || CLIENT_FOLDERS.includes(f.folder);
  const forced = CLIENT_FOLDERS.includes(f.folder);
  const open = (comments ?? []).filter((c) => c.author_type === "client" && !c.resolved).length;
  const rv = f.review_status ? REVIEW[f.review_status] : null;

  return (
    <>
      <PageHeader
        back={client ? { href: `/crm/clienti/${client.id}?tab=fisiere`, label: client.name } : { href: "/crm/fisiere", label: "Fișiere" }}
        title={f.name}
        sub={<>{f.folder}{project && <> · <Link href={`/crm/proiecte/${project.id}`} className="text-brand-blue">{project.name}</Link></>} · {formatDate(f.created_at)}</>}
      />
      {searchParams.sent && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Materialul a fost trimis clientului spre aprobare.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{searchParams.err}</p>}

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Portal client">
          {client ? (
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                {visible ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-muted" />}
                {visible ? "Vizibil clientului în portal" : "Ascuns clientului"}
              </p>
              {forced ? (
                <p className="text-xs text-muted">Fișierele din „{f.folder}” sunt mereu vizibile clientului.</p>
              ) : (
                <form action={toggleFileVisibility}>
                  <input type="hidden" name="id" value={f.id} />
                  <input type="hidden" name="visible" value={visible ? "0" : "1"} />
                  <SubmitButton className="btn-sm">{visible ? "Ascunde din portal" : "Arată în portal"}</SubmitButton>
                </form>
              )}
              <a href={`${SITE.url}/portal/${client.portal_token}/fisier/${f.id}`} target="_blank" className="block text-xs text-brand-blue">Vezi cum îl vede clientul →</a>
            </div>
          ) : (
            <p className="text-sm text-muted">Fișierul nu este asociat unui client.</p>
          )}
        </Panel>
        <Panel title="Aprobare">
          {rv && <p className={`mb-3 rounded-xl px-3 py-2 text-sm font-semibold ${rv[1]}`}>{rv[0]}</p>}
          {f.review_note && <p className="mb-3 whitespace-pre-line rounded-xl bg-soft p-3 text-sm text-body">{f.review_note}</p>}
          {f.reviewed_at && <KeyVal k="Răspuns la" v={formatDate(f.reviewed_at, true)} />}
          {client && !forced && (
            <form action={requestApproval} className="mt-2">
              <input type="hidden" name="id" value={f.id} />
              <SubmitButton className="btn-sm" pendingText="Se trimite..."><Send className="h-4 w-4" /> {f.review_status ? "Trimite din nou spre aprobare" : "Trimite clientului spre aprobare"}</SubmitButton>
              <p className="mt-2 text-[11px] text-muted">Clientul primește un email cu link direct către material.</p>
            </form>
          )}
        </Panel>
        <Panel title="Comentarii">
          <p className="text-sm text-body">{(comments ?? []).length} comentarii{open ? <>, din care <b className="text-amber-700">{open} nerezolvate</b></> : ""}.</p>
          {open > 0 && (
            <form action={resolveFileComments} className="mt-3">
              <input type="hidden" name="id" value={f.id} />
              <SubmitButton className="btn-sm"><CheckCircle2 className="h-4 w-4" /> Marchează rezolvate</SubmitButton>
            </form>
          )}
        </Panel>
      </div>

      <MediaReview
        action={teamFileComment}
        hidden={{ file_id: f.id }}
        url={signed?.signedUrl ?? null}
        mime={f.mime}
        name={f.name}
        teamLabel="echipă"
        clientLabel={client?.name ?? "Client"}
        comments={(comments ?? []).map((c) => ({ ...c, timecode: c.timecode == null ? null : Number(c.timecode) }))}
      />
    </>
  );
}
