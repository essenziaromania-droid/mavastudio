"use client";
import { useRef, useState, useTransition } from "react";
import { Loader2, Search } from "lucide-react";
import { lookupCui } from "@/app/crm/actions/sales";
import { Field, Input, Select, Textarea, optionsFrom } from "./ui";
import { SubmitButton } from "./client-ui";
import { CLIENT_STATUS, LEAD_SOURCE } from "@/lib/crm/constants";

type C = Record<string, string | null | undefined>;

export function ClientForm({ action, client = {}, submitLabel = "Salvează" }: { action: (fd: FormData) => Promise<void>; client?: C; submitLabel?: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [type, setType] = useState(client.type ?? "company");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  const v = (k: string) => client[k] ?? "";

  const fill = (name: string, value?: string) => {
    const el = ref.current?.elements.namedItem(name) as HTMLInputElement | null;
    if (el && value) el.value = value;
  };

  return (
    <form ref={ref} action={action} className="space-y-6">
      {client.id && <input type="hidden" name="id" value={client.id} />}
      <div className="flex gap-2">
        {[["company", "Companie"], ["person", "Persoană fizică"]].map(([k, l]) => (
          <label key={k} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm has-[:checked]:border-brand-blue has-[:checked]:bg-blue-50 has-[:checked]:text-brand-blue">
            <input type="radio" name="type" value={k} checked={type === k} onChange={() => setType(k)} className="accent-brand-blue" /> {l}
          </label>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {type === "company" && (
          <Field label="CUI" hint="Completează CUI-ul și apasă Caută pentru a prelua datele din ANAF.">
            <div className="flex gap-2">
              <Input name="cui" defaultValue={v("cui")} placeholder="RO12345678" />
              <button
                type="button"
                className="btn-ghost btn-sm shrink-0"
                disabled={pending}
                onClick={() => {
                  const cui = (ref.current?.elements.namedItem("cui") as HTMLInputElement)?.value ?? "";
                  start(async () => {
                    const r = await lookupCui(cui);
                    if (!r.ok) return setMsg(r.error ?? "Negăsit");
                    fill("name", r.name);
                    fill("reg_com", r.reg_com);
                    fill("address", r.address);
                    fill("city", r.city);
                    fill("county", r.county);
                    setMsg("Date preluate din ANAF ✓");
                  });
                }}
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Caută
              </button>
            </div>
            {msg && <span className="mt-1 block text-xs text-brand-blue">{msg}</span>}
          </Field>
        )}
        <Field label={type === "company" ? "Denumire firmă *" : "Nume complet *"}><Input name="name" defaultValue={v("name")} required /></Field>
        {type === "company" && <Field label="Nr. Registrul Comerțului"><Input name="reg_com" defaultValue={v("reg_com")} /></Field>}
        <Field label="Adresă" className={type === "company" ? "" : "sm:col-span-1"}><Input name="address" defaultValue={v("address")} /></Field>
        <Field label="Localitate"><Input name="city" defaultValue={v("city")} /></Field>
        <Field label="Județ"><Input name="county" defaultValue={v("county")} /></Field>
        <Field label="Email"><Input name="email" type="email" defaultValue={v("email")} /></Field>
        <Field label="Telefon"><Input name="phone" defaultValue={v("phone")} /></Field>
        <Field label="Website"><Input name="website" defaultValue={v("website")} placeholder="www.exemplu.ro" /></Field>
        {type === "company" && <Field label="IBAN"><Input name="iban" defaultValue={v("iban")} /></Field>}
        <Field label="Status"><Select name="status" defaultValue={v("status") || "prospect"} options={optionsFrom(CLIENT_STATUS)} /></Field>
        <Field label="Sursă"><Select name="source" defaultValue={v("source")} options={LEAD_SOURCE} placeholder="—" /></Field>
      </div>
      {type === "company" && (
        <div>
          <p className="mb-3 text-sm font-bold text-ink">Persoană de contact</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nume"><Input name="contact_name" defaultValue={v("contact_name")} /></Field>
            <Field label="Funcție"><Input name="contact_role" defaultValue={v("contact_role")} placeholder="Administrator" /></Field>
            <Field label="Email"><Input name="contact_email" type="email" defaultValue={v("contact_email")} /></Field>
            <Field label="Telefon"><Input name="contact_phone" defaultValue={v("contact_phone")} /></Field>
          </div>
        </div>
      )}
      <Field label="Note interne"><Textarea name="notes" rows={3} defaultValue={v("notes")} /></Field>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
