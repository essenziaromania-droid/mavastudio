import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Film, Heart, MessageCircle, Send, X } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { Field, Input, PageHeader, Panel, Select, StatusBadge, Textarea } from "@/components/crm/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { FileUpload } from "@/components/crm/file-upload";
import { SOCIAL_FORMATS, SOCIAL_PLATFORMS, SOCIAL_STATUS } from "@/lib/crm/constants";
import { deleteSocialPost, detachSocialMedia, saveSocialPost } from "../../actions/social";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/content/site";

export const metadata = { title: "Postare social media" };

const TZ = "Europe/Bucharest";
const ymdRo = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(d);
const hmRo = (d: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(d);

export default async function SocialPostPage({ params, searchParams }: { params: { id: string }; searchParams: { date?: string; client?: string; saved?: string; err?: string } }) {
  const { sb } = await requireModule("social");
  const isNew = params.id === "nou";
  const { data: p } = isNew ? { data: null } : await sb.from("social_posts").select("*, clients(id, name, portal_token)").eq("id", params.id).maybeSingle();
  if (!isNew && !p) notFound();
  const [{ data: clients }, { data: team }, media] = await Promise.all([
    sb.from("clients").select("id, name").order("name"),
    sb.from("profiles").select("id, full_name").order("full_name"),
    isNew ? Promise.resolve({ data: [] as { id: string; name: string; path: string; mime: string | null }[] }) : sb.from("files").select("id, name, path, mime").eq("social_post_id", params.id).order("created_at"),
  ]);
  const files = media.data ?? [];
  const signed = files.length ? (await sb.storage.from("crm-files").createSignedUrls(files.map((f) => f.path), 3600)).data ?? [] : [];
  const urlOf = new Map(signed.map((s) => [s.path, s.signedUrl]));

  const when = p ? new Date(p.scheduled_at) : null;
  const date = when ? ymdRo(when) : searchParams.date ?? ymdRo(new Date());
  const time = when ? hmRo(when) : "10:00";
  const platforms: string[] = p?.platforms ?? ["facebook", "instagram"];
  const client = p?.clients as { id: string; name: string; portal_token: string } | null;
  const first = files[0];
  const firstUrl = first ? urlOf.get(first.path) : null;

  return (
    <>
      <PageHeader
        back={{ href: `/crm/social?m=${date.slice(0, 7)}${p?.client_id ? `&client=${p.client_id}` : ""}`, label: "Calendar social media" }}
        title={isNew ? "Postare nouă" : p!.title || `${SOCIAL_FORMATS[p!.format]} · ${client?.name ?? ""}`}
        sub={!isNew && <span className="flex items-center gap-2"><StatusBadge map={SOCIAL_STATUS} value={p!.status} /> {formatDate(p!.scheduled_at, true)}</span>}
      />
      {searchParams.saved && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Postare salvată.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <form action={saveSocialPost} className="space-y-6">
          {!isNew && <input type="hidden" name="id" value={p!.id} />}
          <Panel title="Detalii postare">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client *"><Select name="client_id" required options={(clients ?? []).map((c) => ({ value: c.id, label: c.name }))} defaultValue={p?.client_id ?? searchParams.client ?? ""} placeholder="Alege clientul" /></Field>
              <Field label="Titlu intern" hint="Apare în calendar (ex. „Lansare colecție toamnă”)."><Input name="title" defaultValue={p?.title ?? ""} /></Field>
              <Field label="Data publicării *"><Input name="date" type="date" required defaultValue={date} /></Field>
              <Field label="Ora (România)"><Input name="time" type="time" defaultValue={time} /></Field>
              <Field label="Format"><Select name="format" options={SOCIAL_FORMATS} defaultValue={p?.format ?? "postare"} /></Field>
              <Field label="Status"><Select name="status" options={Object.fromEntries(Object.entries(SOCIAL_STATUS).map(([k, v]) => [k, v.label]))} defaultValue={p?.status ?? "idee"} /></Field>
              <div className="sm:col-span-2">
                <span className="label">Platforme</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {Object.entries(SOCIAL_PLATFORMS).map(([k, v]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm has-[:checked]:border-brand-blue has-[:checked]:bg-blue-50">
                      <input type="checkbox" name="platforms" value={k} defaultChecked={platforms.includes(k)} className="accent-brand-blue" /> {v}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
          <Panel title="Conținut">
            <div className="space-y-4">
              <Field label="Text (descriere)"><Textarea name="caption" rows={8} defaultValue={p?.caption ?? ""} placeholder="Textul care apare la postare..." /></Field>
              <Field label="Hashtag-uri"><Input name="hashtags" defaultValue={p?.hashtags ?? ""} placeholder="#brand #produs #oferta" /></Field>
              <Field label="Notă internă" hint="Nu o vede clientul."><Textarea name="internal_note" rows={2} defaultValue={p?.internal_note ?? ""} /></Field>
            </div>
          </Panel>
          <Panel title="Echipă și publicare">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Responsabil"><Select name="assignee_id" options={(team ?? []).map((t) => ({ value: t.id, label: t.full_name ?? "—" }))} defaultValue={p?.assignee_id ?? ""} placeholder="—" /></Field>
              <Field label="Link postare publicată" hint="Completează după publicare."><Input name="published_url" defaultValue={p?.published_url ?? ""} placeholder="https://instagram.com/p/..." /></Field>
            </div>
          </Panel>
          <SubmitButton>{isNew ? "Creează postarea" : "Salvează modificările"}</SubmitButton>
        </form>

        <div className="space-y-6">
          {!isNew && (
            <Panel title="Imagini / video">
              <div className="grid grid-cols-3 gap-2">
                {files.map((f) => {
                  const url = urlOf.get(f.path);
                  return (
                    <div key={f.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-soft">
                      {f.mime?.startsWith("image/") && url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={f.name} className="h-full w-full object-cover" />
                      ) : f.mime?.startsWith("video/") && url ? (
                        <video src={url} className="h-full w-full object-cover" muted />
                      ) : (
                        <span className="flex h-full items-center justify-center"><Film className="h-6 w-6 text-brand-blue" /></span>
                      )}
                      <form action={detachSocialMedia} className="absolute right-1 top-1">
                        <input type="hidden" name="file_id" value={f.id} />
                        <input type="hidden" name="post_id" value={p!.id} />
                        <button className="rounded-full bg-white/90 p-1 text-muted opacity-0 shadow transition hover:text-rose-500 group-hover:opacity-100" title="Scoate din postare"><X className="h-3.5 w-3.5" /></button>
                      </form>
                    </div>
                  );
                })}
              </div>
              {!files.length && <p className="mb-3 text-sm text-muted">Încă nu ai adăugat imagini sau video.</p>}
              <div className="mt-3">
                <FileUpload clientId={p!.client_id} projectId={p!.project_id} defaultFolder="08 Social Media" socialPostId={p!.id} label="Adaugă imagini / video" accept="image/*,video/*" />
              </div>
              <p className="mt-2 text-[11px] text-muted">Ordinea încărcării = ordinea din carusel. Fișierele se salvează și în Fișiere → 08 Social Media.</p>
            </Panel>
          )}

          {!isNew && (p!.client_note || p!.reviewed_at) && (
            <Panel title="Răspunsul clientului">
              <StatusBadge map={SOCIAL_STATUS} value={p!.status} />
              {p!.client_note && <p className="mt-3 whitespace-pre-line rounded-xl bg-soft p-3 text-sm text-body">{p!.client_note}</p>}
              {p!.reviewed_at && <p className="mt-2 text-xs text-muted">{formatDate(p!.reviewed_at, true)}</p>}
            </Panel>
          )}

          {!isNew && (
            <Panel title="Previzualizare">
              <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-line bg-white">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-ink"><span className="h-7 w-7 rounded-full bg-brand-gradient" /> {client?.name}</div>
                <div className="flex aspect-square items-center justify-center bg-soft">
                  {first?.mime?.startsWith("image/") && firstUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={firstUrl} alt="" className="h-full w-full object-cover" />
                  ) : first?.mime?.startsWith("video/") && firstUrl ? (
                    <video src={firstUrl} className="h-full w-full object-cover" muted controls />
                  ) : (
                    <span className="text-xs text-muted">Fără imagine</span>
                  )}
                </div>
                <div className="flex gap-3 px-3 py-2 text-ink"><Heart className="h-5 w-5" /><MessageCircle className="h-5 w-5" /><Send className="h-5 w-5" />{files.length > 1 && <span className="ml-auto text-xs text-muted">1/{files.length}</span>}</div>
                <p className="whitespace-pre-line px-3 pb-3 text-sm text-ink"><b>{client?.name}</b> {p!.caption}{p!.hashtags && <span className="block text-brand-blue">{p!.hashtags}</span>}</p>
              </div>
              {client?.portal_token && <a href={`${SITE.url}/portal/${client.portal_token}?tab=social&m=${date.slice(0, 7)}`} target="_blank" className="mt-3 block text-center text-xs text-brand-blue">Vezi cum o vede clientul în portal →</a>}
              {p!.published_url && <a href={p!.published_url} target="_blank" className="btn-ghost btn-sm mt-3 w-full"><ExternalLink className="h-4 w-4" /> Postarea publicată</a>}
            </Panel>
          )}

          {!isNew && (
            <form action={deleteSocialPost}>
              <input type="hidden" name="id" value={p!.id} />
              <ConfirmSubmit message="Ștergi postarea din calendar?">Șterge postarea</ConfirmSubmit>
            </form>
          )}
          {isNew && <p className="rounded-xl bg-soft p-4 text-sm text-body">După ce creezi postarea, poți adăuga imaginile sau video-urile ei.</p>}
        </div>
      </div>
      <p className="mt-6 text-xs text-muted"><Link href="/crm/social" className="text-brand-blue">← Înapoi la calendar</Link></p>
    </>
  );
}
