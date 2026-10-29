"use client";
import { useFormState } from "react-dom";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { resetPassword, signIn, type AuthState } from "@/app/crm/actions/auth";
import { SubmitButton } from "@/components/crm/client-ui";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next, mfa, notice }: { next?: string; mfa?: boolean; notice?: string }) {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [state, action] = useFormState<AuthState, FormData>(signIn, {});
  const [resetState, resetAction] = useFormState<AuthState, FormData>(resetPassword, {});

  if (mfa) return <MfaForm />;

  if (mode === "reset") {
    return (
      <form action={resetAction} className="space-y-4">
        <h1 className="text-center text-2xl font-extrabold">Resetează parola</h1>
        <p className="text-center text-sm text-body">Îți trimitem un link pentru a seta o parolă nouă.</p>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input name="email" type="email" required placeholder="email@mavastudio.ro" className="input pl-11" />
        </div>
        {resetState.error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{resetState.error}</p>}
        {resetState.info && <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{resetState.info}</p>}
        <SubmitButton className="w-full !py-3.5" pendingText="Se trimite...">Trimite linkul</SubmitButton>
        <button type="button" onClick={() => setMode("login")} className="w-full text-center text-sm font-semibold text-brand-blue">← Înapoi la autentificare</button>
      </form>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <h1 className="text-center text-2xl font-extrabold">Bine ai revenit!</h1>
      <p className="text-center text-sm text-body">Autentifică-te în CRM-ul MAVA Studio.</p>
      {notice && <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{notice}</p>}
      <input type="hidden" name="next" value={next ?? "/crm"} />
      <div className="relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input name="email" type="email" required autoComplete="email" placeholder="email@mavastudio.ro" className="input pl-11" />
      </div>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input name="password" type="password" required autoComplete="current-password" placeholder="Parola" className="input pl-11" />
      </div>
      {state.error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{state.error}</p>}
      <SubmitButton className="w-full !py-3.5" pendingText="Se verifică...">Autentificare</SubmitButton>
      <button type="button" onClick={() => setMode("reset")} className="w-full text-center text-sm text-muted hover:text-brand-blue">Ai uitat parola?</button>
    </form>
  );
}

function MfaForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const sb = createClient();
        const { data: factors } = await sb.auth.mfa.listFactors();
        const factor = factors?.totp?.[0];
        if (!factor) {
          setBusy(false);
          return setError("Nu există un factor 2FA configurat.");
        }
        const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
        setBusy(false);
        if (error) return setError("Cod invalid. Încearcă din nou.");
        router.replace("/crm");
        router.refresh();
      }}
    >
      <div className="flex justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue"><ShieldCheck className="h-7 w-7" /></span></div>
      <h1 className="text-center text-2xl font-extrabold">Verificare în doi pași</h1>
      <p className="text-center text-sm text-body">Introdu codul de 6 cifre din aplicația de autentificare.</p>
      <input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} required className="input text-center text-2xl tracking-[0.5em]" placeholder="000000" autoFocus />
      {error && <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{error}</p>}
      <button disabled={busy} className="btn-primary w-full !py-3.5">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verifică"}</button>
    </form>
  );
}
