"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Check, Loader2, MessageSquare } from "lucide-react";
import { acceptOffer, requestOfferChanges, type PublicState } from "../../public-actions";

function Btn({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "outline" }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className={variant === "primary" ? "btn-primary !px-8 !py-4" : "btn-outline !px-6 !py-3.5"}>{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : children}</button>;
}

export function OfferResponse({ token, status, expired }: { token: string; status: string; expired: boolean }) {
  const [acc, accept] = useFormState<PublicState, FormData>(acceptOffer, {});
  const [chg, change] = useFormState<PublicState, FormData>(requestOfferChanges, {});
  const [showChanges, setShowChanges] = useState(false);

  if (status === "acceptata" || acc.ok) {
    return (
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check className="h-6 w-6" strokeWidth={3} /></span>
        <div>
          <p className="text-lg font-bold text-ink">Oferta a fost acceptată. Mulțumim!</p>
          <p className="text-sm text-body">Îți trimitem în curând contractul spre semnare și următorii pași.</p>
        </div>
      </div>
    );
  }
  if (chg.ok) return <p className="text-lg font-bold text-ink">Mulțumim! Am primit solicitarea ta și revenim cu o ofertă actualizată.</p>;
  if (expired || ["respinsa", "expirata"].includes(status)) {
    return <p className="text-body">Această ofertă nu mai este valabilă. Scrie-ne la <a className="text-brand-blue" href="mailto:contact@mavastudio.ro">contact@mavastudio.ro</a> pentru o ofertă actualizată.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold">Ce dorești să faci?</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <form action={accept}>
          <input type="hidden" name="token" value={token} />
          <Btn><Check className="h-5 w-5" /> Accept oferta</Btn>
        </form>
        <button onClick={() => setShowChanges((v) => !v)} className="btn-outline !px-6 !py-3.5"><MessageSquare className="h-4 w-4" /> Solicită modificări</button>
      </div>
      {acc.error && <p className="mt-3 text-sm text-rose-600">{acc.error}</p>}
      {showChanges && (
        <form action={change} className="mt-5 max-w-xl space-y-3">
          <input type="hidden" name="token" value={token} />
          <textarea name="feedback" rows={4} required className="input" placeholder="Ce ai dori să modificăm în ofertă?" />
          {chg.error && <p className="text-sm text-rose-600">{chg.error}</p>}
          <Btn variant="outline">Trimite solicitarea</Btn>
        </form>
      )}
      <p className="mt-4 text-xs text-muted">Prin acceptarea ofertei confirmi că ești de acord cu serviciile, prețurile și condițiile de mai sus. Contractul va fi transmis separat pentru semnare.</p>
    </div>
  );
}
