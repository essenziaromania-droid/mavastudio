"use client";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, PenLine } from "lucide-react";
import { signContract, type PublicState } from "../../public-actions";

function Btn() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="btn-primary !px-8 !py-4">{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><PenLine className="h-5 w-5" /> Semnează contractul</>}</button>;
}

export function SignForm({ token }: { token: string }) {
  const [state, action] = useFormState<PublicState, FormData>(signContract, {});
  if (state.ok) return <p className="text-lg font-bold text-emerald-700">✓ Contractul a fost semnat. Mulțumim! Vei primi în curând factura de avans și detaliile de început ale proiectului.</p>;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <h2 className="text-xl font-extrabold">Semnare electronică</h2>
      <label className="block">
        <span className="label">Numele complet al semnatarului *</span>
        <input name="name" required className="input max-w-md font-serif text-lg italic" placeholder="Prenume Nume" />
      </label>
      <label className="flex items-start gap-3 text-sm text-body">
        <input type="checkbox" name="agree" required className="mt-0.5 h-4 w-4 accent-brand-blue" />
        Am citit contractul, sunt de acord cu termenii lui și am dreptul să semnez în numele beneficiarului. Înțeleg că semnătura electronică are aceeași valoare ca semnătura olografă.
      </label>
      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <Btn />
      <p className="text-xs text-muted">Pentru dovada semnării înregistrăm numele, data, ora și adresa IP.</p>
    </form>
  );
}
