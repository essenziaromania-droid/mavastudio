import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { deletePortfolio, savePortfolio } from "../../../actions/website";
import { Field, Input, PageHeader, Panel, Select, Textarea } from "@/components/crm/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { GalleryInput, ImageInput } from "@/components/crm/image-input";
import { PORTFOLIO_CATEGORIES } from "@/lib/crm/constants";

export const metadata = { title: "Proiect portofoliu" };

export default async function PortfolioEditor({ params, searchParams }: { params: { id: string }; searchParams: { saved?: string; err?: string } }) {
  const { sb } = await requireModule("website");
  const isNew = params.id === "nou";
  const { data: p } = isNew ? { data: null } : await sb.from("portfolio_projects").select("*").eq("id", params.id).maybeSingle();
  if (!isNew && !p) notFound();
  const v = (k: string) => ((p as Record<string, unknown> | null)?.[k] as string | null) ?? "";
  const en = ((p?.translations as { en?: Record<string, unknown> } | null)?.en ?? {}) as {
    title?: string; subtitle?: string; summary?: string; problem?: string; solution?: string; results?: string;
    features?: string[]; metrics?: { value: string; label: string }[];
  };

  return (
    <>
      <PageHeader
        back={{ href: "/crm/website?tab=portofoliu", label: "Portofoliu" }}
        title={isNew ? "Proiect nou în portofoliu" : v("title")}
        actions={p?.published && (
          <div className="flex gap-2">
            <a href={`/proiecte/${p.slug}?setlang=ro`} target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> Vezi pe site</a>
            <a href={`/en/projects/${p.slug}?setlang=en`} target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> EN</a>
          </div>
        )}
      />
      {searchParams.saved && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Proiect salvat.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}
      <form action={savePortfolio} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {!isNew && <input type="hidden" name="id" value={params.id} />}
        <div className="space-y-6">
        <Panel title="Studiu de caz · 🇷🇴 Română">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nume proiect *"><Input name="title" defaultValue={v("title")} required /></Field>
            <Field label="Client"><Input name="client_name" defaultValue={v("client_name")} /></Field>
            <Field label="Subtitlu" hint="ex. Website · eCommerce"><Input name="subtitle" defaultValue={v("subtitle")} /></Field>
            <Field label="Categorie (filtru pe site)"><Select name="category" options={PORTFOLIO_CATEGORIES} defaultValue={v("category") || "website"} /></Field>
            <Field label="Rezumat" className="sm:col-span-2"><Textarea name="summary" rows={2} defaultValue={v("summary")} /></Field>
            <Field label="Problema" className="sm:col-span-2"><Textarea name="problem" rows={3} defaultValue={v("problem")} /></Field>
            <Field label="Soluția" className="sm:col-span-2"><Textarea name="solution" rows={3} defaultValue={v("solution")} /></Field>
            <Field label="Rezultatul" className="sm:col-span-2"><Textarea name="results" rows={3} defaultValue={v("results")} /></Field>
            <Field label="Funcționalități (una pe linie)"><Textarea name="features" rows={6} defaultValue={(p?.features ?? []).join("\n")} /></Field>
            <Field label="Tehnologii (separate prin virgulă)"><Textarea name="technologies" rows={6} defaultValue={(p?.technologies ?? []).join(", ")} /></Field>
            <Field label="Cifre cheie (una pe linie: valoare | etichetă)" className="sm:col-span-2" hint="ex. +320% | creștere vânzări"><Textarea name="metrics" rows={3} defaultValue={((p?.metrics as { value: string; label: string }[]) ?? []).map((m) => `${m.value} | ${m.label}`).join("\n")} /></Field>
          </div>
        </Panel>
        <Panel title="🇬🇧 English (vizitatorii din afara României)">
          <p className="mb-4 text-xs text-muted">Câmpurile lăsate goale se afișează în română. Clientul, categoria, tehnologiile și imaginile sunt comune.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project name"><Input name="en_title" defaultValue={en.title ?? ""} placeholder={v("title")} /></Field>
            <Field label="Subtitle" hint="e.g. Website · eCommerce"><Input name="en_subtitle" defaultValue={en.subtitle ?? ""} /></Field>
            <Field label="Summary" className="sm:col-span-2"><Textarea name="en_summary" rows={2} defaultValue={en.summary ?? ""} /></Field>
            <Field label="The problem" className="sm:col-span-2"><Textarea name="en_problem" rows={3} defaultValue={en.problem ?? ""} /></Field>
            <Field label="The solution" className="sm:col-span-2"><Textarea name="en_solution" rows={3} defaultValue={en.solution ?? ""} /></Field>
            <Field label="The result" className="sm:col-span-2"><Textarea name="en_results" rows={3} defaultValue={en.results ?? ""} /></Field>
            <Field label="Features (one per line)"><Textarea name="en_features" rows={6} defaultValue={(en.features ?? []).join("\n")} /></Field>
            <Field label="Key figures (value | label)" hint="e.g. +320% | sales growth"><Textarea name="en_metrics" rows={6} defaultValue={(en.metrics ?? []).map((m) => `${m.value} | ${m.label}`).join("\n")} /></Field>
          </div>
        </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Publicare">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={p?.published ?? false} className="accent-brand-blue" /> Publicat pe site</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} className="accent-brand-blue" /> Recomandat (apare pe homepage)</label>
              <Field label="Ordine afișare" hint="Număr mic = mai sus."><Input name="sort" type="number" defaultValue={String(p?.sort ?? 0)} /></Field>
              <Field label="Link site live"><Input name="live_url" defaultValue={v("live_url")} placeholder="https://..." /></Field>
              <Field label="Slug (URL)"><Input name="slug" defaultValue={v("slug")} /></Field>
              <SubmitButton className="w-full">Salvează</SubmitButton>
            </div>
          </Panel>
          <Panel title="Imagini">
            <div className="space-y-4">
              <Field label="Imagine copertă (16:10)"><ImageInput name="cover_url" defaultValue={v("cover_url")} folder="portofoliu" /></Field>
              <Field label="Galerie"><GalleryInput name="gallery" defaultValue={p?.gallery ?? []} /></Field>
            </div>
          </Panel>
        </div>
      </form>
      {!isNew && (
        <form action={deletePortfolio} className="mt-6">
          <input type="hidden" name="id" value={params.id} />
          <ConfirmSubmit message="Ștergi proiectul din portofoliu?">Șterge proiectul</ConfirmSubmit>
        </form>
      )}
    </>
  );
}
