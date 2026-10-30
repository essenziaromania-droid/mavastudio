"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Check, Loader2, Pencil, Send } from "lucide-react";
import { portalApproveMonth, portalMessage, portalPostReview, portalReview, type PortalState } from "../actions";
import { cn } from "@/lib/utils";

function Btn({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={cn("btn-primary", className)}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

const Err = ({ s }: { s: PortalState }) => (s.error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{s.error}</p> : null);

/* ───────── Mesaj către echipă ───────── */

export function MessageForm({ token }: { token: string }) {
  const [state, action] = useFormState<PortalState, FormData>(portalMessage, {});
  if (state.ok) return <p className="font-semibold text-emerald-700">✓ Mesajul a fost trimis. Îți răspundem în cel mai scurt timp.</p>;
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="token" value={token} />
      <textarea name="body" required rows={5} maxLength={3000} className="input" placeholder="Scrie mesajul tău..." />
      <Err s={state} />
      <Btn><Send className="h-4 w-4" /> Trimite mesajul</Btn>
    </form>
  );
}

/* ───────── Aprobare / cerere de modificări ───────── */

export function ReviewForm({ token, fileId, status }: { token: string; fileId: string; status: string | null }) {
  const [state, action] = useFormState<PortalState, FormData>(portalReview, {});
  const [mode, setMode] = useState<"aprobat" | "modificari" | null>(null);
  if (state.ok) return <p className="font-semibold text-emerald-700">✓ Mulțumim! Echipa a fost anunțată.</p>;
  return (
    <div>
      {status && <p className="mb-3 text-sm text-body">Ai marcat deja acest material ca <b className="text-ink">{status === "aprobat" ? "aprobat" : "„modificări cerute”"}</b>. Poți schimba decizia oricând.</p>}
      {!mode ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode("aprobat")} className="btn-primary"><Check className="h-4 w-4" /> Aprob</button>
          <button type="button" onClick={() => setMode("modificari")} className="btn-outline"><Pencil className="h-4 w-4" /> Cer modificări</button>
        </div>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="file_id" value={fileId} />
          <input type="hidden" name="decision" value={mode} />
          <textarea
            name="note"
            rows={4}
            maxLength={2000}
            required={mode === "modificari"}
            className="input"
            placeholder={mode === "aprobat" ? "Un mesaj pentru echipă (opțional)" : "Ce ai vrea să schimbăm? Cu cât mai concret, cu atât mai repede."}
          />
          <Err s={state} />
          <div className="flex gap-2">
            <Btn>{mode === "aprobat" ? <><Check className="h-4 w-4" /> Confirm aprobarea</> : <><Send className="h-4 w-4" /> Trimite modificările</>}</Btn>
            <button type="button" onClick={() => setMode(null)} className="btn-ghost">Înapoi</button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ───────── Social media ───────── */

export function PostReview({ token, postId, status }: { token: string; postId: string; status: string }) {
  const [state, action] = useFormState<PortalState, FormData>(portalPostReview, {});
  const [mode, setMode] = useState<"aprobat" | "modificari" | null>(null);
  if (state.ok) return <p className="text-sm font-semibold text-emerald-700">✓ Mulțumim! Echipa a fost anunțată.</p>;
  if (!mode)
    return (
      <div className="flex flex-wrap gap-2">
        {status !== "aprobat" && <button type="button" onClick={() => setMode("aprobat")} className="btn-primary btn-sm"><Check className="h-4 w-4" /> Aprob</button>}
        <button type="button" onClick={() => setMode("modificari")} className="btn-outline btn-sm"><Pencil className="h-4 w-4" /> {status === "aprobat" ? "Vreau totuși modificări" : "Cer modificări"}</button>
      </div>
    );
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="decision" value={mode} />
      <textarea name="note" rows={3} maxLength={2000} required={mode === "modificari"} className="input text-sm" placeholder={mode === "aprobat" ? "Un mesaj pentru echipă (opțional)" : "Ce ai vrea să schimbăm? (text, imagine, dată...)"} />
      <Err s={state} />
      <div className="flex gap-2">
        <Btn className="btn-sm">{mode === "aprobat" ? "Confirm aprobarea" : "Trimite"}</Btn>
        <button type="button" onClick={() => setMode(null)} className="btn-ghost btn-sm">Înapoi</button>
      </div>
    </form>
  );
}

export function ApproveMonth({ token, ids }: { token: string; ids: string[] }) {
  const [state, action] = useFormState<PortalState, FormData>(portalApproveMonth, {});
  if (state.ok) return <p className="text-sm font-semibold text-emerald-700">✓ Toate postările au fost aprobate. Mulțumim!</p>;
  return (
    <form action={action}>
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="ids" value={ids.join(",")} />
      <Err s={state} />
      <Btn><Check className="h-4 w-4" /> Aprob toate cele {ids.length} postări</Btn>
    </form>
  );
}
