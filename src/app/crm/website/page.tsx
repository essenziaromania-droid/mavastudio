import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { Badge, Field, Input, PageHeader, Panel, Table, Td, Tabs, Textarea } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { saveSettings } from "../actions/admin";
import { PORTFOLIO_CATEGORIES } from "@/lib/crm/constants";
import { DEFAULT_SITE, type SiteSettings } from "@/lib/public-data";
import { getSetting } from "@/lib/events";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Website" };

export default async function WebsiteAdmin({ searchParams }: { searchParams: { tab?: string; saved?: string } }) {
  const { sb } = await requireModule("website");
  const tab = searchParams.tab ?? "blog";

  return (
    <>
      <PageHeader
        title="Website"
        sub="Administrează conținutul site-ului mavastudio.ro: blog, portofoliu, date de contact și statistici."
        actions={<a href="/" target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> Deschide site-ul</a>}
      />
      <Tabs
        active={tab}
        items={[
          { key: "blog", label: "Blog", href: "/crm/website?tab=blog" },
          { key: "portofoliu", label: "Portofoliu", href: "/crm/website?tab=portofoliu" },
          { key: "setari", label: "Contact, statistici & social", href: "/crm/website?tab=setari" },
        ]}
      />
      {searchParams.saved && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Salvat. Modificările apar pe site în câteva momente.</p>}
      {tab === "blog" && <Blog />}
      {tab === "portofoliu" && <Portfolio />}
      {tab === "setari" && <SiteSettingsForm />}
    </>
  );

  async function Blog() {
    const { data } = await sb.from("blog_posts").select("id, title, slug, status, category, published_at, updated_at").order("updated_at", { ascending: false });
    return (
      <Panel pad={false} title="Articole" actions={<Link href="/crm/website/blog/nou" className="btn-primary btn-sm"><Plus className="h-4 w-4" /> Articol nou</Link>}>
        <Table head={["Titlu", "Categorie", "Status", "Publicat", "Actualizat"]} empty="Niciun articol încă. Până publici primul articol, pe site apar 3 articole demonstrative.">
          {(data ?? []).map((p) => (
            <tr key={p.id} className="hover:bg-soft/50">
              <Td><Link href={`/crm/website/blog/${p.id}`} className="font-semibold text-ink hover:text-brand-blue">{p.title}</Link><p className="text-xs text-muted">/blog/{p.slug}</p></Td>
              <Td className="text-xs">{p.category ?? "—"}</Td>
              <Td><Badge tone={p.status === "published" ? "green" : "gray"}>{p.status === "published" ? "Publicat" : "Draft"}</Badge></Td>
              <Td className="text-xs">{formatDate(p.published_at)}</Td>
              <Td className="text-xs text-muted">{formatDate(p.updated_at, true)}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    );
  }

  async function Portfolio() {
    const { data } = await sb.from("portfolio_projects").select("id, title, slug, category, published, featured, sort, cover_url").order("sort").order("created_at", { ascending: false });
    return (
      <Panel pad={false} title="Proiecte în portofoliu" actions={<Link href="/crm/website/portofoliu/nou" className="btn-primary btn-sm"><Plus className="h-4 w-4" /> Proiect nou</Link>}>
        <Table head={["Proiect", "Categorie", "Status", "Recomandat", "Ordine"]} empty="Niciun proiect. Până publici primul proiect, pe site apar proiectele demonstrative din mock-up.">
          {(data ?? []).map((p) => (
            <tr key={p.id} className="hover:bg-soft/50">
              <Td>
                <Link href={`/crm/website/portofoliu/${p.id}`} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.cover_url ? <img src={p.cover_url} alt="" className="h-10 w-16 rounded-lg object-cover" /> : <span className="h-10 w-16 rounded-lg bg-soft" />}
                  <span className="font-semibold text-ink hover:text-brand-blue">{p.title}</span>
                </Link>
              </Td>
              <Td className="text-xs">{PORTFOLIO_CATEGORIES[p.category] ?? p.category}</Td>
              <Td><Badge tone={p.published ? "green" : "gray"}>{p.published ? "Publicat" : "Ascuns"}</Badge></Td>
              <Td>{p.featured ? "★" : ""}</Td>
              <Td className="text-xs">{p.sort}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    );
  }

  async function SiteSettingsForm() {
    const v = await getSetting<SiteSettings>(sb, "site", DEFAULT_SITE);
    return (
      <Panel title="Setări site" className="max-w-3xl">
        <form action={saveSettings} className="space-y-6">
          <input type="hidden" name="key" value="site" />
          <input type="hidden" name="back" value="/crm/website?tab=setari" />
          <input type="hidden" name="bools" value="show_phone,show_stats" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email afișat"><Input name="v.email" defaultValue={v.email} /></Field>
            <Field label="Telefon"><Input name="v.phone" defaultValue={v.phone} placeholder="+40 7XX XXX XXX" /></Field>
            <Field label="Program"><Input name="v.schedule" defaultValue={v.schedule} /></Field>
            <Field label="Program 🇬🇧 (site-ul în engleză)"><Input name="v.schedule_en" defaultValue={v.schedule_en ?? DEFAULT_SITE.schedule_en} /></Field>
            <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="b.show_phone" defaultChecked={v.show_phone} className="accent-brand-blue" /> Afișează telefonul pe pagina de Contact</label>
          </div>
          <div className="rounded-xl bg-soft p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink"><input type="checkbox" name="b.show_stats" defaultChecked={v.show_stats} className="accent-brand-blue" /> Afișează statisticile pe site (hero și pagina Proiecte)</label>
            <p className="mt-1 text-xs text-muted">Activează doar când cifrele sunt reale. Paginile de servicii au propriile cifre (ex. „500+ clipuri editate”), afișate tot doar când această opțiune e activă.</p>
            <Field label="Statistici homepage (una pe linie: valoare | etichetă)" className="mt-3">
              <Textarea name="l.stats" rows={3} defaultValue={v.stats.map((x) => `${x.value} | ${x.label}`).join("\n")} />
            </Field>
            <Field label="Statistici 🇬🇧 – aceeași ordine, etichete în engleză" className="mt-3" hint="Valorile sunt preluate din lista în română; aici contează doar eticheta.">
              <Textarea name="l.stats_en" rows={3} defaultValue={(v.stats_en ?? DEFAULT_SITE.stats_en ?? []).map((x) => `${x.value} | ${x.label}`).join("\n")} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["instagram", "linkedin", "youtube", "tiktok", "facebook"] as const).map((k) => (
              <Field key={k} label={k[0]!.toUpperCase() + k.slice(1)}><Input name={`v.socials.${k}`} defaultValue={v.socials[k] ?? ""} placeholder={`https://${k}.com/...`} /></Field>
            ))}
          </div>
          <SubmitButton>Salvează</SubmitButton>
        </form>
      </Panel>
    );
  }
}
