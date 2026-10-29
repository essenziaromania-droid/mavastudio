import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { deletePost, savePost } from "../../../actions/website";
import { Field, Input, PageHeader, Panel, Select, Textarea } from "@/components/crm/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { ImageInput } from "@/components/crm/image-input";

export const metadata = { title: "Articol" };

const CATEGORIES = ["Website-uri", "SaaS", "CRM & Automatizări", "AI Content", "Video", "Social Media", "Business", "Noutăți"];
const CATEGORIES_EN = ["Websites", "SaaS", "CRM & Automation", "AI Content", "Video", "Social Media", "Business", "News"];

export default async function PostEditor({ params, searchParams }: { params: { id: string }; searchParams: { saved?: string; err?: string } }) {
  const { sb } = await requireModule("website");
  const isNew = params.id === "nou";
  const { data: p } = isNew ? { data: null } : await sb.from("blog_posts").select("*").eq("id", params.id).maybeSingle();
  if (!isNew && !p) notFound();
  const v = (k: string) => ((p as Record<string, unknown> | null)?.[k] as string | null) ?? "";
  const en = ((p?.translations as { en?: Record<string, string> } | null)?.en ?? {}) as Record<string, string>;
  const e = (k: string) => en[k] ?? "";

  return (
    <>
      <PageHeader
        back={{ href: "/crm/website?tab=blog", label: "Blog" }}
        title={isNew ? "Articol nou" : v("title")}
        actions={p?.status === "published" && (
          <div className="flex gap-2">
            <a href={`/blog/${p.slug}?setlang=ro`} target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> Vezi pe site</a>
            {en.title && en.content && <a href={`/en/blog/${p.slug}?setlang=en`} target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> EN</a>}
          </div>
        )}
      />
      {searchParams.saved && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Articol salvat.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}
      <form action={savePost} className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {!isNew && <input type="hidden" name="id" value={params.id} />}
        <div className="space-y-6">
          <Panel title="🇷🇴 Română">
            <div className="space-y-4">
              <Field label="Titlu *"><Input name="title" defaultValue={v("title")} required className="text-lg font-bold" /></Field>
              <Field label="Rezumat" hint="Apare în lista de articole și ca descriere în Google."><Textarea name="excerpt" rows={2} defaultValue={v("excerpt")} /></Field>
              <Field label="Conținut (Markdown)" hint="## Subtitlu · **bold** · - listă · [text](link) · ![alt](url-imagine)">
                <Textarea name="content" rows={24} defaultValue={v("content")} className="font-mono text-[13px] leading-relaxed" />
              </Field>
            </div>
          </Panel>
          <Panel title="🇬🇧 English (vizitatorii din afara României)">
            <p className="mb-4 text-xs text-muted">Articolul apare pe site-ul în engleză doar dacă are titlu și conținut în engleză. Link-urile interne în engleză încep cu /en (ex. /en/start-a-project).</p>
            <div className="space-y-4">
              <Field label="Title"><Input name="en_title" defaultValue={e("title")} className="text-lg font-bold" /></Field>
              <Field label="Excerpt"><Textarea name="en_excerpt" rows={2} defaultValue={e("excerpt")} /></Field>
              <Field label="Content (Markdown)"><Textarea name="en_content" rows={16} defaultValue={e("content")} className="font-mono text-[13px] leading-relaxed" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category"><Select name="en_category" options={CATEGORIES_EN.map((c) => ({ value: c, label: c }))} defaultValue={e("category")} placeholder="—" /></Field>
                <Field label="SEO title"><Input name="en_seo_title" defaultValue={e("seo_title")} maxLength={70} /></Field>
              </div>
              <Field label="SEO description"><Textarea name="en_seo_description" rows={2} defaultValue={e("seo_description")} maxLength={170} /></Field>
            </div>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Publicare">
            <div className="space-y-4">
              <Field label="Status"><Select name="status" options={{ draft: "Draft", published: "Publicat" }} defaultValue={v("status") || "draft"} /></Field>
              <Field label="Data publicării" hint="Poți programa un articol pentru o dată viitoare."><Input name="published_at" type="datetime-local" defaultValue={p?.published_at ? new Date(p.published_at).toISOString().slice(0, 16) : ""} /></Field>
              <SubmitButton className="w-full">Salvează</SubmitButton>
            </div>
          </Panel>
          <Panel title="Detalii">
            <div className="space-y-4">
              <Field label="Imagine principală"><ImageInput name="cover_url" defaultValue={v("cover_url")} folder="blog" /></Field>
              <Field label="Categorie"><Select name="category" options={CATEGORIES.map((c) => ({ value: c, label: c }))} defaultValue={v("category")} placeholder="—" /></Field>
              <Field label="Etichete (separate prin virgulă)"><Input name="tags" defaultValue={(p?.tags ?? []).join(", ")} /></Field>
              <Field label="Autor"><Input name="author_name" defaultValue={v("author_name") || "Echipa MAVA Studio"} /></Field>
              <Field label="Slug (URL)" hint="Se generează automat din titlu."><Input name="slug" defaultValue={v("slug")} /></Field>
            </div>
          </Panel>
          <Panel title="SEO">
            <div className="space-y-4">
              <Field label="Titlu SEO"><Input name="seo_title" defaultValue={v("seo_title")} maxLength={70} /></Field>
              <Field label="Descriere SEO"><Textarea name="seo_description" rows={3} defaultValue={v("seo_description")} maxLength={170} /></Field>
            </div>
          </Panel>
        </div>
      </form>
      {!isNew && (
        <form action={deletePost} className="mt-6">
          <input type="hidden" name="id" value={params.id} />
          <ConfirmSubmit message="Ștergi definitiv articolul?">Șterge articolul</ConfirmSubmit>
        </form>
      )}
    </>
  );
}
