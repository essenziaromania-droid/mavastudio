"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { audit } from "@/lib/events";
import { slugify } from "@/lib/utils";

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v.length ? v : null;
};
const list = (fd: FormData, k: string) =>
  String(fd.get(k) ?? "")
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter(Boolean);
const lines = (fd: FormData, k: string) =>
  String(fd.get(k) ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
const metricsOf = (fd: FormData, k: string) =>
  lines(fd, k)
    .map((l) => {
      const [value, ...rest] = l.split("|");
      return { value: (value ?? "").trim(), label: rest.join("|").trim() };
    })
    .filter((m) => m.value);
/** Păstrează doar câmpurile completate, ca cele goale să folosească varianta română. */
const compact = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== "" && !(Array.isArray(v) && !v.length)));
const MIGRATION_HINT = "Pentru varianta în engleză rulează migrarea supabase/migrations/0002_i18n.sql în Supabase.";

export async function savePost(fd: FormData) {
  const s = await getSession();
  if (!s.can("website")) return;
  const id = str(fd, "id");
  const title = str(fd, "title") ?? "Articol nou";
  const status = fd.get("status") === "published" ? "published" : "draft";
  const row = {
    title,
    slug: slugify(str(fd, "slug") ?? title),
    excerpt: str(fd, "excerpt"),
    content: String(fd.get("content") ?? ""),
    cover_url: str(fd, "cover_url"),
    category: str(fd, "category"),
    tags: list(fd, "tags"),
    author_name: str(fd, "author_name") ?? "Echipa MAVA Studio",
    status,
    published_at: status === "published" ? (str(fd, "published_at") ? new Date(String(fd.get("published_at"))).toISOString() : new Date().toISOString()) : str(fd, "published_at"),
    seo_title: str(fd, "seo_title"),
    seo_description: str(fd, "seo_description"),
    translations: {
      en: compact({
        title: str(fd, "en_title"),
        excerpt: str(fd, "en_excerpt"),
        content: str(fd, "en_content"),
        category: str(fd, "en_category"),
        seo_title: str(fd, "en_seo_title"),
        seo_description: str(fd, "en_seo_description"),
      }),
    },
    updated_at: new Date().toISOString(),
  };
  const res = id ? await s.sb.from("blog_posts").update(row).eq("id", id).select("id").single() : await s.sb.from("blog_posts").insert(row).select("id").single();
  if (res.error) redirect(`/crm/website/blog/${id ?? "nou"}?err=${encodeURIComponent(res.error.message.includes("duplicate") ? "Există deja un articol cu acest slug." : res.error.message.includes("translations") ? MIGRATION_HINT : res.error.message)}`);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a ${id ? "actualizat" : "creat"} articolul „${title}” (${status})`, entity: "blog", entity_id: res.data.id });
  revalidatePath("/", "layout");
  redirect(`/crm/website/blog/${res.data.id}?saved=1`);
}

export async function deletePost(fd: FormData) {
  const s = await getSession();
  if (!s.can("website")) return;
  await s.sb.from("blog_posts").delete().eq("id", String(fd.get("id")));
  revalidatePath("/blog");
  redirect("/crm/website?tab=blog");
}

export async function savePortfolio(fd: FormData) {
  const s = await getSession();
  if (!s.can("website")) return;
  const id = str(fd, "id");
  const title = str(fd, "title") ?? "Proiect";
  const metrics = metricsOf(fd, "metrics");
  const row = {
    title,
    slug: slugify(str(fd, "slug") ?? title),
    client_name: str(fd, "client_name"),
    category: str(fd, "category") ?? "website",
    subtitle: str(fd, "subtitle"),
    summary: str(fd, "summary"),
    cover_url: str(fd, "cover_url"),
    gallery: String(fd.get("gallery") ?? "").split("\n").map((x) => x.trim()).filter(Boolean),
    problem: str(fd, "problem"),
    solution: str(fd, "solution"),
    results: str(fd, "results"),
    technologies: list(fd, "technologies"),
    features: String(fd.get("features") ?? "").split("\n").map((x) => x.trim()).filter(Boolean),
    metrics,
    live_url: str(fd, "live_url"),
    featured: fd.get("featured") === "on",
    published: fd.get("published") === "on",
    sort: Number(fd.get("sort") || 0),
    translations: {
      en: compact({
        title: str(fd, "en_title"),
        subtitle: str(fd, "en_subtitle"),
        summary: str(fd, "en_summary"),
        problem: str(fd, "en_problem"),
        solution: str(fd, "en_solution"),
        results: str(fd, "en_results"),
        features: lines(fd, "en_features"),
        metrics: metricsOf(fd, "en_metrics"),
      }),
    },
  };
  const res = id ? await s.sb.from("portfolio_projects").update(row).eq("id", id).select("id").single() : await s.sb.from("portfolio_projects").insert(row).select("id").single();
  if (res.error) redirect(`/crm/website/portofoliu/${id ?? "nou"}?err=${encodeURIComponent(res.error.message.includes("duplicate") ? "Există deja un proiect cu acest slug." : res.error.message.includes("translations") ? MIGRATION_HINT : res.error.message)}`);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a ${id ? "actualizat" : "adăugat"} proiectul de portofoliu „${title}”`, entity: "portofoliu", entity_id: res.data.id });
  revalidatePath("/", "layout");
  redirect(`/crm/website/portofoliu/${res.data.id}?saved=1`);
}

export async function deletePortfolio(fd: FormData) {
  const s = await getSession();
  if (!s.can("website")) return;
  await s.sb.from("portfolio_projects").delete().eq("id", String(fd.get("id")));
  revalidatePath("/", "layout");
  redirect("/crm/website?tab=portofoliu");
}
