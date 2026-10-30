"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { registerFile } from "@/app/crm/actions/files";
import { DRIVE_FOLDERS } from "@/lib/crm/constants";

export function FileUpload({ clientId, projectId, defaultFolder = "01 Brief", socialPostId, label = "Încarcă fișiere", accept }: { clientId?: string | null; projectId?: string | null; defaultFolder?: string; socialPostId?: string; label?: string; accept?: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState(defaultFolder);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setErr("");
    const sb = createClient();
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        setErr(`${file.name} depășește 50 MB.`);
        continue;
      }
      setBusy(file.name);
      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${clientId ?? "intern"}/${projectId ?? "general"}/${folder}/${Date.now()}_${safe}`;
      const { error } = await sb.storage.from("crm-files").upload(path, file, { contentType: file.type || "application/octet-stream" });
      if (error) {
        setErr(error.message);
        continue;
      }
      const r = await registerFile({ client_id: clientId ?? null, project_id: projectId ?? null, social_post_id: socialPostId ?? null, folder, name: file.name, path, mime: file.type, size: file.size });
      if (r.error) setErr(r.error);
    }
    setBusy("");
    if (input.current) input.current.value = "";
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!socialPostId && (
        <select value={folder} onChange={(e) => setFolder(e.target.value)} className="rounded-xl border border-line px-3 py-2 text-sm">
          {DRIVE_FOLDERS.map((f) => <option key={f}>{f}</option>)}
        </select>
      )}
      <label className="btn-primary btn-sm cursor-pointer !py-2.5">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {busy ? `Se încarcă ${busy}...` : label}
        <input ref={input} type="file" multiple accept={accept} className="hidden" onChange={(e) => upload(e.target.files)} disabled={!!busy} />
      </label>
      {err && <span className="text-xs text-rose-500">{err}</span>}
    </div>
  );
}
