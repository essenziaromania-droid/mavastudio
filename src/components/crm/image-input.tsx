"use client";
import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { inputCls } from "./ui";

/** Câmp URL imagine + upload în bucket-ul public „public-media”. */
export function ImageInput({ name, defaultValue, folder = "uploads" }: { name: string; defaultValue?: string | null; folder?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} placeholder="https://... sau încarcă o imagine" />
        <label className="btn-ghost btn-sm shrink-0 cursor-pointer">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Încarcă
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              setErr("");
              const sb = createClient();
              const path = `${folder}/${Date.now()}_${f.name.replace(/[^\w.\-]+/g, "_")}`;
              const { error } = await sb.storage.from("public-media").upload(path, f, { contentType: f.type, cacheControl: "31536000" });
              if (error) setErr(error.message);
              else setUrl(sb.storage.from("public-media").getPublicUrl(path).data.publicUrl);
              setBusy(false);
            }}
          />
        </label>
      </div>
      {err && <p className="text-xs text-rose-500">{err}</p>}
      {url && (
        <div className="relative w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-28 rounded-xl border border-line object-cover" />
          <button type="button" onClick={() => setUrl("")} className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow"><X className="h-3 w-3" /></button>
        </div>
      )}
    </div>
  );
}

/** Upload multiplu pentru galerie: adaugă URL-urile, câte unul pe linie, în textarea. */
export function GalleryInput({ name, defaultValue }: { name: string; defaultValue?: string[] }) {
  const [value, setValue] = useState((defaultValue ?? []).join("\n"));
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2">
      <textarea name={name} value={value} onChange={(e) => setValue(e.target.value)} rows={4} className={`${inputCls} font-mono text-xs`} placeholder="Câte un URL de imagine pe linie" />
      <label className="btn-ghost btn-sm w-fit cursor-pointer">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Încarcă imagini
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            if (!files.length) return;
            setBusy(true);
            const sb = createClient();
            const urls: string[] = [];
            for (const f of files) {
              const path = `portofoliu/${Date.now()}_${f.name.replace(/[^\w.\-]+/g, "_")}`;
              const { error } = await sb.storage.from("public-media").upload(path, f, { contentType: f.type, cacheControl: "31536000" });
              if (!error) urls.push(sb.storage.from("public-media").getPublicUrl(path).data.publicUrl);
            }
            setValue((v) => [v.trim(), ...urls].filter(Boolean).join("\n"));
            setBusy(false);
          }}
        />
      </label>
    </div>
  );
}
