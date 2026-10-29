"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { updatePassword, updateProfile, type AuthState } from "@/app/crm/actions/auth";
import { Field, Input, Panel } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { createClient } from "@/lib/supabase/client";

function Msg({ s }: { s: AuthState }) {
  if (s.error) return <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{s.error}</p>;
  if (s.info) return <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{s.info}</p>;
  return null;
}

export function AccountForms({ fullName, phone }: { fullName: string; phone: string }) {
  const [p, profileAction] = useFormState<AuthState, FormData>(updateProfile, {});
  const [pw, passwordAction] = useFormState<AuthState, FormData>(updatePassword, {});
  return (
    <div className="space-y-6">
      <Panel title="Profil">
        <form action={profileAction} className="space-y-4">
          <Field label="Nume complet"><Input name="full_name" defaultValue={fullName} required /></Field>
          <Field label="Telefon"><Input name="phone" defaultValue={phone} /></Field>
          <Msg s={p} />
          <SubmitButton>Salvează</SubmitButton>
        </form>
      </Panel>
      <Panel title="Schimbă parola">
        <form action={passwordAction} className="space-y-4">
          <Field label="Parola nouă" hint="Minimum 10 caractere."><Input name="password" type="password" autoComplete="new-password" required /></Field>
          <Field label="Confirmă parola"><Input name="password2" type="password" autoComplete="new-password" required /></Field>
          <Msg s={pw} />
          <SubmitButton>Actualizează parola</SubmitButton>
        </form>
      </Panel>
    </div>
  );
}

export function TwoFactor() {
  const [loading, setLoading] = useState(true);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [enroll, setEnroll] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<AuthState>({});

  const load = async () => {
    const sb = createClient();
    const { data } = await sb.auth.mfa.listFactors();
    setFactorId(data?.totp?.find((f) => f.status === "verified")?.id ?? null);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader2 className="h-5 w-5 animate-spin text-muted" />;

  if (factorId) {
    return (
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600"><ShieldCheck className="h-5 w-5" /> 2FA este activ pentru contul tău.</p>
        <button
          className="btn btn-sm border border-rose-200 text-rose-600"
          onClick={async () => {
            if (!confirm("Dezactivezi verificarea în doi pași?")) return;
            const { error } = await createClient().auth.mfa.unenroll({ factorId });
            if (error) setMsg({ error: error.message });
            else load();
          }}
        >
          Dezactivează 2FA
        </button>
        <Msg s={msg} />
      </div>
    );
  }

  if (enroll) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-body">Scanează codul QR cu Google Authenticator, Microsoft Authenticator sau 1Password, apoi introdu codul de 6 cifre.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={enroll.qr} alt="Cod QR 2FA" className="h-44 w-44 rounded-xl border border-line p-2" />
        <p className="break-all text-xs text-muted">Cheie manuală: <code>{enroll.secret}</code></p>
        <Input value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} placeholder="000000" className="max-w-[180px] text-center tracking-[0.4em]" />
        <button
          className="btn-primary btn-sm"
          onClick={async () => {
            const { error } = await createClient().auth.mfa.challengeAndVerify({ factorId: enroll.id, code: code.trim() });
            if (error) return setMsg({ error: "Cod invalid." });
            setEnroll(null);
            setMsg({ info: "2FA a fost activat." });
            load();
          }}
        >
          Activează
        </button>
        <Msg s={msg} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-body">Protejează-ți contul cu un cod generat de o aplicație de autentificare, cerut la fiecare conectare. Recomandat pentru toți utilizatorii cu acces la date financiare.</p>
      <button
        className="btn-primary btn-sm"
        onClick={async () => {
          const sb = createClient();
          // curăță eventualele înrolări neterminate
          const { data: existing } = await sb.auth.mfa.listFactors();
          for (const f of existing?.all ?? []) if (f.status !== "verified") await sb.auth.mfa.unenroll({ factorId: f.id });
          const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp", friendlyName: `MAVA ${Date.now()}` });
          if (error || !data) return setMsg({ error: error?.message ?? "Eroare" });
          setEnroll({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
        }}
      >
        <ShieldCheck className="h-4 w-4" /> Configurează 2FA
      </button>
      <Msg s={msg} />
    </div>
  );
}
