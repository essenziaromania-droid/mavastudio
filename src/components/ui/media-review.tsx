"use client";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Clock, Loader2, MessageSquare, Send } from "lucide-react";
import { formatTimecode } from "@/lib/timecode";
import { cn } from "@/lib/utils";

/**
 * Vizualizare material (imagine, video, PDF) + comentarii.
 * La video, comentariul se leagă de secunda la care e pus clipul pe pauză; un clic pe secundă derulează clipul acolo.
 * Folosit în portalul clientului și în CRM (cu acțiuni diferite).
 */

export type FormState = { ok?: boolean; error?: string };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="btn-primary w-full">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Trimite comentariul</>}
    </button>
  );
}

type Comment = { id: string; author_type: string; author_name: string | null; body: string; timecode: number | null; created_at: string };

export function MediaReview({
  action: serverAction,
  hidden,
  url,
  mime,
  name,
  comments,
  teamLabel = "MAVA Studio",
  clientLabel = "Tu",
}: {
  action: (s: FormState, fd: FormData) => Promise<FormState>;
  hidden: Record<string, string>;
  url: string | null;
  mime: string | null;
  name: string;
  comments: Comment[];
  teamLabel?: string;
  clientLabel?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState<number | null>(null);
  const [state, action] = useFormState<FormState, FormData>(serverAction, {});
  const form = useRef<HTMLFormElement>(null);
  const isVid = mime?.startsWith("video/");
  const isImg = mime?.startsWith("image/");
  const isPdf = mime === "application/pdf";

  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);

  const seek = (t: number | null) => {
    if (t == null || !video.current) return;
    video.current.currentTime = t;
    video.current.play().catch(() => {});
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="card overflow-hidden">
        <div className="flex min-h-[260px] items-center justify-center bg-ink/95">
          {!url ? (
            <p className="p-10 text-sm text-white/70">Fișierul nu poate fi afișat.</p>
          ) : isVid ? (
            <video ref={video} src={url} controls playsInline className="max-h-[70vh] w-full" onPause={() => setTime(video.current?.currentTime ?? null)} onSeeked={() => setTime(video.current?.currentTime ?? null)} />
          ) : isImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={name} className="max-h-[70vh] w-auto" />
          ) : isPdf ? (
            <iframe src={url} title={name} className="h-[70vh] w-full bg-white" />
          ) : (
            <a href={url} target="_blank" className="btn-primary m-10">Descarcă fișierul</a>
          )}
        </div>
        {url && (
          <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <a href={url} target="_blank" download className="btn-ghost btn-sm shrink-0">Descarcă</a>
          </div>
        )}
      </div>

      <div className="card flex flex-col p-5">
        <h2 className="flex items-center gap-2 font-bold"><MessageSquare className="h-4 w-4 text-brand-blue" /> Comentarii</h2>
        {isVid && <p className="mt-1 text-xs text-muted">Pune clipul pe pauză în momentul dorit, apoi scrie comentariul: se salvează la secunda respectivă.</p>}
        <ul className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {!comments.length && <li className="text-sm text-muted">Niciun comentariu încă.</li>}
          {comments.map((c) => (
            <li key={c.id} className={cn("rounded-xl p-3 text-sm", c.author_type === "echipa" ? "bg-blue-50/70" : "bg-soft")}>
              <p className="flex items-center gap-2 text-xs font-semibold text-ink">
                {c.author_type === "echipa" ? (c.author_name ? `${c.author_name} · ${teamLabel}` : teamLabel) : c.author_name ?? clientLabel}
                {c.timecode != null && (
                  <button type="button" onClick={() => seek(c.timecode)} className="flex items-center gap-1 rounded-full bg-brand-blue px-2 py-0.5 text-[10px] font-bold text-white">
                    <Clock className="h-3 w-3" /> {formatTimecode(c.timecode)}
                  </button>
                )}
              </p>
              <p className="mt-1 whitespace-pre-line text-body">{c.body}</p>
            </li>
          ))}
        </ul>
        <form ref={form} action={action} className="mt-4 space-y-2 border-t border-line pt-4">
          {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          {isVid && <input type="hidden" name="timecode" value={time ?? ""} />}
          {isVid && (
            <p className="text-xs text-muted">
              {time != null ? <>Comentariu la <b className="text-brand-blue">{formatTimecode(time)}</b></> : "Comentariu general (fără secundă)"}
            </p>
          )}
          <textarea name="body" required rows={3} maxLength={2000} className="input" placeholder="Scrie un comentariu..." />
          {state.error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{state.error}</p>}
          <Submit />
        </form>
      </div>
    </div>
  );
}
