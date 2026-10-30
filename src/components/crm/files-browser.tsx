import Link from "next/link";
import { FileText, Film, Folder, Image as ImageIcon, Download, Trash2, Eye, EyeOff, MessageSquare } from "lucide-react";
import { toggleFileVisibility } from "@/app/crm/actions/portal";
import { getSession } from "@/lib/crm/auth";
import { DRIVE_FOLDERS } from "@/lib/crm/constants";
import { Panel } from "./ui";
import { FileUpload } from "./file-upload";
import { deleteFile } from "@/app/crm/actions/files";
import { formatDate } from "@/lib/utils";

function size(n?: number | null) {
  if (!n) return "";
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
}

export async function FilesBrowser({ clientId, projectId, clientName, folder }: { clientId?: string | null; projectId?: string | null; clientName?: string; folder?: string }) {
  const s = await getSession();
  let q = s.sb.from("files").select("id, name, path, mime, size, folder, created_at, visible_to_client, review_status, drive_url, profiles:uploaded_by(full_name), file_comments(id, author_type, resolved)").order("created_at", { ascending: false }).limit(500);
  if (projectId) q = q.eq("project_id", projectId);
  else if (clientId) q = q.eq("client_id", clientId);
  if (folder) q = q.eq("folder", folder);
  const { data: files } = await q;
  const urls = files?.length ? (await s.sb.storage.from("crm-files").createSignedUrls(files.map((f) => f.path), 3600)).data ?? [] : [];
  const urlOf = new Map(urls.map((u) => [u.path, u.signedUrl]));
  const ALWAYS = ["02 Contract", "09 Livrabile", "10 Facturi"];
  const REVIEW: Record<string, [string, string]> = { in_asteptare: ["De aprobat", "bg-blue-50 text-brand-blue"], aprobat: ["Aprobat", "bg-emerald-50 text-emerald-700"], modificari: ["Modificări", "bg-amber-50 text-amber-700"] };
  const counts = new Map<string, number>();
  (files ?? []).forEach((f) => counts.set(f.folder, (counts.get(f.folder) ?? 0) + 1));

  return (
    <Panel
      title={clientName ? `MAVA Studio › Clienți › ${clientName}` : "Fișiere"}
      actions={s.can("fisiere") ? <FileUpload clientId={clientId} projectId={projectId} /> : undefined}
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {DRIVE_FOLDERS.map((f) => (
          <div key={f} className="flex items-center gap-3 rounded-xl border border-line p-3">
            <Folder className="h-6 w-6 shrink-0 fill-amber-300 text-amber-400" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{f}</p>
              <p className="text-[11px] text-muted">{counts.get(f) ?? 0} fișiere</p>
            </div>
          </div>
        ))}
      </div>
      {!files?.length && <p className="py-8 text-center text-sm text-muted">Nu există fișiere încă.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(files ?? []).map((f) => {
          const url = urlOf.get(f.path);
          const isImg = f.mime?.startsWith("image/");
          const isVid = f.mime?.startsWith("video/");
          const visible = f.visible_to_client || ALWAYS.includes(f.folder);
          const notes = (f.file_comments as { author_type: string; resolved: boolean }[] | null) ?? [];
          const open = notes.filter((c) => c.author_type === "client" && !c.resolved).length;
          const rv = f.review_status ? REVIEW[f.review_status] : null;
          return (
            <div key={f.id} className="group overflow-hidden rounded-xl border border-line">
              <Link href={`/crm/fisiere/${f.id}`} className="relative flex aspect-[16/10] items-center justify-center bg-soft">
                {rv && <span className={`absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold ${rv[1]}`}>{rv[0]}</span>}
                {notes.length > 0 && <span className={`absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${open ? "bg-amber-500 text-white" : "bg-white/90 text-muted"}`}><MessageSquare className="h-3 w-3" /> {notes.length}</span>}
                {isImg && url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={f.name} className="h-full w-full object-cover" loading="lazy" />
                ) : isVid ? (
                  <Film className="h-10 w-10 text-brand-blue" />
                ) : isImg ? (
                  <ImageIcon className="h-10 w-10 text-brand-blue" />
                ) : (
                  <FileText className="h-10 w-10 text-brand-blue" />
                )}
              </Link>
              <div className="flex items-start gap-2 p-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/crm/fisiere/${f.id}`} className="block truncate text-sm font-semibold text-ink hover:text-brand-blue" title={f.name}>{f.name}</Link>
                  <p className="text-[11px] text-muted">{f.folder} · {size(f.size)} · {formatDate(f.created_at)}</p>
                </div>
                {ALWAYS.includes(f.folder) ? (
                  <span className="rounded-lg p-1.5 text-emerald-500" title="Mereu vizibil în portalul clientului"><Eye className="h-4 w-4" /></span>
                ) : (
                  <form action={toggleFileVisibility}>
                    <input type="hidden" name="id" value={f.id} />
                    <input type="hidden" name="visible" value={visible ? "0" : "1"} />
                    <button className={`rounded-lg p-1.5 hover:bg-soft ${visible ? "text-emerald-500" : "text-muted"}`} title={visible ? "Vizibil în portal · clic pentru a ascunde" : "Ascuns clientului · clic pentru a-l arăta în portal"}>
                      {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </form>
                )}
                {f.drive_url && (
                  <a href={f.drive_url} target="_blank" className="rounded-lg p-1.5 text-muted hover:bg-soft hover:text-brand-blue" title="Deschide în Google Drive">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M7.7 3.5h8.6l5.2 9-4.3 7.5H6.8L2.5 12.5zm1.2 2L4.8 12.5l2.9 5h8.6l2.9-5-4.1-7z" /></svg>
                  </a>
                )}
                {url && <a href={url} target="_blank" className="rounded-lg p-1.5 text-muted hover:bg-soft hover:text-brand-blue" title="Descarcă"><Download className="h-4 w-4" /></a>}
                {s.can("fisiere") && (
                  <form action={deleteFile}>
                    <input type="hidden" name="id" value={f.id} />
                    <button className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-500" title="Șterge"><Trash2 className="h-4 w-4" /></button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
