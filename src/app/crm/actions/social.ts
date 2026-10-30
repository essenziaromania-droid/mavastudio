"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit } from "@/lib/events";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { SITE } from "@/content/site";
import { SOCIAL_FORMATS, SOCIAL_PLATFORMS, SOCIAL_STATUS } from "@/lib/crm/constants";

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v.length ? v : null;
};
const MONTHS = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];

/** Data și ora din formular sunt ora României; le transformăm în moment UTC. */
function bucharestToIso(date: string, time: string) {
  const guess = new Date(`${date}T${time || "10:00"}:00Z`);
  const local = new Date(guess.toLocaleString("en-US", { timeZone: "Europe/Bucharest" }));
  const utc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(guess.getTime() - (local.getTime() - utc.getTime())).toISOString();
}

export async function saveSocialPost(fd: FormData) {
  const s = await getSession();
  if (!s.can("social")) return;
  const id = str(fd, "id");
  const back = (q: string) => redirect(`/crm/social/${id ?? "nou"}?${q}`);
  const clientId = str(fd, "client_id");
  const date = str(fd, "date");
  if (!clientId || !date) back(`err=${encodeURIComponent("Alege clientul și data postării.")}`);
  const platforms = fd.getAll("platforms").map(String).filter((p) => p in SOCIAL_PLATFORMS);
  const format = String(fd.get("format") ?? "postare");
  const status = String(fd.get("status") ?? "idee");
  const row = {
    client_id: clientId!,
    project_id: str(fd, "project_id"),
    scheduled_at: bucharestToIso(date!, String(fd.get("time") ?? "10:00")),
    platforms,
    format: format in SOCIAL_FORMATS ? format : "postare",
    title: str(fd, "title"),
    caption: str(fd, "caption"),
    hashtags: str(fd, "hashtags"),
    internal_note: str(fd, "internal_note"),
    status: status in SOCIAL_STATUS ? status : "idee",
    published_url: str(fd, "published_url"),
    assignee_id: str(fd, "assignee_id"),
    updated_at: new Date().toISOString(),
  };
  const res = id
    ? await s.sb.from("social_posts").update(row).eq("id", id).select("id").single()
    : await s.sb.from("social_posts").insert({ ...row, created_by: s.userId }).select("id").single();
  if (res.error) back(`err=${encodeURIComponent(res.error.message.includes("social_posts") ? "Rulează migrarea 0006_social_calendar.sql în Supabase." : res.error.message)}`);
  revalidatePath("/crm/social");
  redirect(`/crm/social/${res.data!.id}?saved=1`);
}

export async function setSocialStatus(fd: FormData) {
  const s = await getSession();
  if (!s.can("social")) return;
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  if (!(status in SOCIAL_STATUS)) return;
  await s.sb.from("social_posts").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/crm/social");
  revalidatePath(`/crm/social/${id}`);
}

export async function deleteSocialPost(fd: FormData) {
  const s = await getSession();
  if (!s.can("social")) return;
  const id = String(fd.get("id"));
  await s.sb.from("social_posts").delete().eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a șters o postare din calendarul social media", entity: "social", entity_id: id });
  redirect("/crm/social");
}

/** Scoate o imagine / un video din postare (fișierul rămâne în Fișiere, folderul 08 Social Media). */
export async function detachSocialMedia(fd: FormData) {
  const s = await getSession();
  if (!s.can("social")) return;
  const fileId = String(fd.get("file_id"));
  const postId = String(fd.get("post_id"));
  await s.sb.from("files").update({ social_post_id: null }).eq("id", fileId);
  revalidatePath(`/crm/social/${postId}`);
}

/**
 * Trimite clientului spre aprobare toate postările pregătite dintr-o lună:
 * cele „În lucru” sau cu „Modificări” devin „La client”, iar clientul primește emailul cu linkul din portal.
 */
export async function sendMonthForApproval(fd: FormData) {
  const s = await getSession();
  if (!s.can("social")) return;
  const clientId = String(fd.get("client_id"));
  const month = String(fd.get("month")); // AAAA-LL
  const back = (q: string) => redirect(`/crm/social?client=${clientId}&m=${month}&${q}`);
  const [y, mo] = month.split("-").map(Number);
  const from = new Date(Date.UTC(y!, mo! - 1, 1)).toISOString();
  const to = new Date(Date.UTC(y!, mo!, 1)).toISOString();
  const { data: posts } = await s.sb
    .from("social_posts")
    .select("id")
    .eq("client_id", clientId)
    .gte("scheduled_at", from)
    .lt("scheduled_at", to)
    .in("status", ["in_lucru", "modificari"]);
  if (!posts?.length) back(`err=${encodeURIComponent("Nu există postări „În lucru” sau cu „Modificări” în luna aceasta. Marchează întâi postările pregătite ca „În lucru”.")}`);
  await s.sb.from("social_posts").update({ status: "de_aprobat", updated_at: new Date().toISOString() }).in("id", posts!.map((p) => p.id));

  const { data: c } = await s.sb.from("clients").select("name, contact_name, email, contact_email, portal_token").eq("id", clientId).single();
  const to_ = c?.contact_email || c?.email;
  const label = `${MONTHS[mo! - 1]} ${y}`;
  if (to_ && c?.portal_token) {
    await sendEmail({
      to: to_,
      replyTo: ADMIN_EMAIL,
      subject: `Calendarul social media pentru ${label} – de aprobat`,
      html: brandedEmail({
        title: `Postările pentru ${label} sunt gata`,
        bodyHtml: `<p>Bună ziua${c.contact_name ? `, ${escapeHtml(c.contact_name.split(" ")[0]!)}` : ""},</p><p>Am pregătit <b>${posts!.length} ${posts!.length === 1 ? "postare" : "postări"}</b> pentru ${escapeHtml(label)}. Le poți vedea în portal, cu imaginile, textele și datele de publicare, și le poți aproba sau ne poți spune ce ai vrea să schimbăm.</p><p>Cu drag,<br/>Echipa MAVA Studio</p>`,
        cta: { label: "Vezi și aprobă postările", url: `${SITE.url}/portal/${c.portal_token}?tab=social&m=${month}` },
      }),
    });
  }
  await addActivity(s.sb, { client_id: clientId, type: "nota", title: `Calendar social media ${label} trimis spre aprobare`, description: `${posts!.length} postări`, actor_id: s.userId });
  back(to_ ? `sent=${posts!.length}` : `err=${encodeURIComponent("Postările sunt în portal, dar clientul nu are email salvat, așa că nu a fost anunțat.")}`);
}
