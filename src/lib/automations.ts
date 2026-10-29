import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, format } from "date-fns";
import { addActivity, audit, DEFAULT_AUTOMATIONS, getSetting, notify, type AutomationSettings } from "@/lib/events";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import type { ContractTemplate } from "@/lib/contract-template";
import { buildContractBody, type Company } from "@/lib/documents";
import { formatLei } from "@/lib/utils";
import { SITE } from "@/content/site";

const crmUrl = (path: string) => `${process.env.NEXT_PUBLIC_CRM_URL ?? SITE.url + "/crm"}${path}`;
const ymd = (d: Date) => format(d, "yyyy-MM-dd");

/* ─────────────── Lead nou ─────────────── */

export async function onLeadCreated(sb: SupabaseClient, lead: { id: string; name: string; email?: string | null; phone?: string | null; company?: string | null; services: string[]; budget?: string | null; deadline?: string | null; message?: string | null; source: string; language?: string | null }) {
  const cfg = await getSetting<AutomationSettings>(sb, "automations", DEFAULT_AUTOMATIONS);
  const title = `Lead nou: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`;

  const en = lead.language === "en";
  await addActivity(sb, { lead_id: lead.id, type: "lead", title: "Lead primit", description: `Sursă: ${lead.source}. Servicii: ${lead.services.join(", ") || "—"}${en ? ". Limba: engleză" : ""}` });

  if (cfg.lead_new_notify) {
    await notify(sb, { type: "lead", title, body: lead.services.join(", "), link: `/crm/leaduri/${lead.id}` });
    const body = `
      <p><b>Nume:</b> ${escapeHtml(lead.name)}<br/><b>Companie:</b> ${escapeHtml(lead.company ?? "—")}<br/>
      <b>Email:</b> ${escapeHtml(lead.email ?? "—")}<br/><b>Telefon:</b> ${escapeHtml(lead.phone ?? "—")}<br/>
      <b>Servicii:</b> ${escapeHtml(lead.services.join(", ") || "—")}<br/><b>Buget:</b> ${escapeHtml(lead.budget ?? "—")}<br/>
      <b>Deadline:</b> ${escapeHtml(lead.deadline ?? "—")}<br/><b>Limba site-ului:</b> ${en ? "engleză 🇬🇧 – răspunde în engleză" : "română"}</p>
      <p style="white-space:pre-line;background:#F6F7FE;border-radius:12px;padding:14px">${escapeHtml(lead.message ?? "")}</p>`;
    await sendEmail({ to: ADMIN_EMAIL, subject: `🔔 ${title}`, html: brandedEmail({ title, bodyHtml: body, cta: { label: "Deschide în CRM", url: crmUrl(`/leaduri/${lead.id}`) } }), replyTo: lead.email ?? undefined });
  }

  if (cfg.lead_new_task) {
    await sb.from("tasks").insert({
      title: `Contactează lead-ul ${lead.name}`,
      description: `Lead nou din ${lead.source}. Servicii: ${lead.services.join(", ")}.\nTelefon: ${lead.phone ?? "—"} · Email: ${lead.email ?? "—"}`,
      priority: "ridicata",
      deadline: ymd(addDays(new Date(), 1)),
    });
  }

  if (cfg.lead_new_autoreply && lead.email) {
    const first = lead.name.split(" ")[0];
    await sendEmail({
      to: lead.email,
      subject: en ? "We've received your request – MAVA Studio" : "Am primit cererea ta – MAVA Studio",
      html: en
        ? brandedEmail({
            lang: "en",
            title: `Thank you, ${first}!`,
            bodyHtml: `<p>We've received your request and are reviewing it carefully. We'll get back to you within 24 hours (business days) with a few questions and the next steps.</p><p>In the meantime, feel free to reply to this email if you'd like to send us more details.</p><p>Kind regards,<br/>The MAVA Studio team</p>`,
            cta: { label: "See our projects", url: `${SITE.url}/en/projects` },
          })
        : brandedEmail({
            title: `Mulțumim, ${first}!`,
            bodyHtml: `<p>Am primit cererea ta și o analizăm cu atenție. Revenim în maximum 24 de ore (zile lucrătoare) cu câteva întrebări și următorii pași.</p><p>Între timp, poți răspunde direct la acest email dacă vrei să ne trimiți detalii suplimentare.</p><p>Cu drag,<br/>Echipa MAVA Studio</p>`,
            cta: { label: "Vezi proiectele noastre", url: `${SITE.url}/proiecte` },
          }),
    });
  }
}

/* ─────────────── Ofertă acceptată ─────────────── */

export async function onOfferAccepted(sb: SupabaseClient, offerId: string) {
  const cfg = await getSetting<AutomationSettings>(sb, "automations", DEFAULT_AUTOMATIONS);
  const { data: offer } = await sb.from("offers").select("*, clients(*), offer_items(*)").eq("id", offerId).single();
  if (!offer) return null;

  await addActivity(sb, { client_id: offer.client_id, type: "oferta", title: `Ofertă acceptată – ${offer.number}`, description: formatLei(offer.total) });
  await notify(sb, { type: "oferta", title: `Oferta ${offer.number} a fost acceptată 🎉`, body: offer.clients?.name, link: `/crm/oferte/${offer.id}` });
  await audit(sb, { actor_name: offer.clients?.name ?? "Client", action: "a acceptat oferta", entity: "oferta", entity_id: offer.number });
  if (offer.lead_id) await sb.from("leads").update({ status: "castigat", client_id: offer.client_id, updated_at: new Date().toISOString() }).eq("id", offer.lead_id);
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `✅ Oferta ${offer.number} a fost acceptată`,
    html: brandedEmail({ title: `Oferta ${offer.number} a fost acceptată`, bodyHtml: `<p>${escapeHtml(offer.clients?.name ?? "Clientul")} a acceptat oferta în valoare de <b>${formatLei(offer.total)}</b>.</p>`, cta: { label: "Deschide oferta", url: crmUrl(`/oferte/${offer.id}`) } }),
  });

  if (!cfg.offer_accepted_contract || !offer.client_id) return null;
  const { data: existing } = await sb.from("contracts").select("id").eq("offer_id", offer.id).maybeSingle();
  if (existing) return existing.id as string;

  const company = await getSetting<Company>(sb, "company", {});
  const { data: num } = await sb.rpc("next_doc_number", { p_prefix: "CT" });
  const items = (offer.offer_items ?? []).sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort);
  const body = buildContractBody({
    number: num as string,
    company,
    client: offer.clients,
    items,
    total: Number(offer.total),
    vatRate: Number(offer.vat_rate),
    deliveryTerm: offer.delivery_term,
    paymentTerms: offer.payment_terms,
    offerNumber: offer.number,
    template: await getSetting<ContractTemplate>(sb, "contract_template", {}),
  });
  const { data: contract } = await sb
    .from("contracts")
    .insert({ number: num, client_id: offer.client_id, offer_id: offer.id, title: offer.title, value: offer.total, body, start_date: ymd(new Date()) })
    .select("id, number")
    .single();
  if (contract) {
    await addActivity(sb, { client_id: offer.client_id, type: "contract", title: `Contract generat – ${contract.number}` });
    await notify(sb, { type: "contract", title: `Contractul ${contract.number} a fost generat automat`, body: "Verifică-l și trimite-l spre semnare.", link: `/crm/contracte/${contract.id}` });
  }
  return contract?.id as string | undefined;
}

/* ─────────────── Contract semnat ─────────────── */

export async function onContractSigned(sb: SupabaseClient, contractId: string) {
  const cfg = await getSetting<AutomationSettings>(sb, "automations", DEFAULT_AUTOMATIONS);
  const { data: c } = await sb.from("contracts").select("*, clients(name), offers(offer_items(category))").eq("id", contractId).single();
  if (!c) return;

  await addActivity(sb, { client_id: c.client_id, type: "contract", title: `Contract semnat – ${c.number}`, description: c.signed_by_name ? `Semnat de ${c.signed_by_name}` : undefined });
  await notify(sb, { type: "contract", title: `Contractul ${c.number} a fost semnat ✍️`, body: c.clients?.name, link: `/crm/contracte/${c.id}` });
  if (c.client_id) await sb.from("clients").update({ status: "activ" }).eq("id", c.client_id);

  let projectId: string | null = null;
  if (cfg.contract_signed_project) {
    const { data: existing } = await sb.from("projects").select("id").eq("contract_id", c.id).maybeSingle();
    if (existing) projectId = existing.id;
    else {
      const category: string = c.offers?.offer_items?.[0]?.category ?? "website";
      projectId = await createProjectFromTemplate(sb, {
        name: `${c.title} – ${c.clients?.name ?? ""}`.trim(),
        client_id: c.client_id,
        contract_id: c.id,
        category,
        value: Number(c.value),
      });
    }
  }

  if (cfg.contract_signed_invoice && projectId) {
    const { data: ms } = await sb.from("payment_milestones").select("*").eq("project_id", projectId).order("sort").limit(1).maybeSingle();
    if (ms && !ms.invoice_id) {
      const vat = 21;
      const total = Number(ms.amount);
      const subtotal = Math.round((total / (1 + vat / 100)) * 100) / 100;
      const { data: inv } = await sb
        .from("invoices")
        .insert({
          client_id: c.client_id,
          project_id: projectId,
          contract_id: c.id,
          status: "draft",
          description: `${ms.label} – ${c.title} (contract ${c.number})`,
          subtotal,
          vat_amount: Math.round((total - subtotal) * 100) / 100,
          total,
          due_date: ymd(addDays(new Date(), 5)),
          service_category: c.offers?.offer_items?.[0]?.category ?? null,
        })
        .select("id")
        .single();
      if (inv) {
        await sb.from("payment_milestones").update({ invoice_id: inv.id }).eq("id", ms.id);
        await notify(sb, { type: "factura", title: "Factură de avans pregătită", body: `${formatLei(total)} – verifică și emite factura.`, link: `/crm/financiar/facturi/${inv.id}` });
      }
    }
  }
}

export async function createProjectFromTemplate(
  sb: SupabaseClient,
  p: { name: string; client_id: string | null; contract_id?: string | null; category: string; value: number; manager_id?: string | null; start?: Date },
) {
  const start = p.start ?? new Date();
  const { data: tpl } = await sb.from("project_templates").select("*").eq("category", p.category).limit(1).maybeSingle();
  const stages: { title: string; days: number }[] = tpl?.stages ?? [{ title: "Brief", days: 2 }, { title: "Execuție", days: 10 }, { title: "Livrare", days: 1 }];
  const totalDays = stages.reduce((s, x) => s + Number(x.days || 1), 0);

  const { data: project } = await sb
    .from("projects")
    .insert({
      name: p.name,
      client_id: p.client_id,
      contract_id: p.contract_id ?? null,
      category: p.category,
      value: p.value,
      manager_id: p.manager_id ?? null,
      start_date: ymd(start),
      deadline: ymd(addDays(start, totalDays)),
    })
    .select("id")
    .single();
  if (!project) return null;

  let cursor = start;
  const tasks = stages.map((s, i) => {
    cursor = addDays(cursor, Number(s.days || 1));
    return { project_id: project.id, client_id: p.client_id, title: s.title, sort: i, deadline: ymd(cursor), priority: "medie" };
  });
  if (tasks.length) await sb.from("tasks").insert(tasks);

  if (p.value > 0) {
    const plan = [
      { label: "Avans 50%", percent: 50 },
      { label: "Versiune beta 30%", percent: 30 },
      { label: "Lansare 20%", percent: 20 },
    ];
    await sb.from("payment_milestones").insert(
      plan.map((m, i) => ({ project_id: project.id, label: m.label, percent: m.percent, amount: Math.round(p.value * m.percent) / 100, sort: i })),
    );
  }

  await addActivity(sb, { client_id: p.client_id, project_id: project.id, type: "proiect", title: `Proiect creat – ${p.name}`, description: `${tasks.length} task-uri din șablonul „${tpl?.name ?? "standard"}”` });
  await notify(sb, { type: "proiect", title: `Proiect nou: ${p.name}`, link: `/crm/proiecte/${project.id}` });
  return project.id as string;
}

/* ─────────────── Factură plătită ─────────────── */

export async function onInvoicePaid(sb: SupabaseClient, invoiceId: string) {
  const cfg = await getSetting<AutomationSettings>(sb, "automations", DEFAULT_AUTOMATIONS);
  const { data: inv } = await sb.from("invoices").select("*, clients(name), projects(id, name, manager_id, status)").eq("id", invoiceId).single();
  if (!inv) return;
  await sb.from("payment_milestones").update({ status: "incasata" }).eq("invoice_id", inv.id);
  await addActivity(sb, { client_id: inv.client_id, project_id: inv.project_id, type: "plata", title: `Plată încasată – ${formatLei(inv.total)}`, description: [inv.series, inv.number].filter(Boolean).join(" ") || undefined });
  if (inv.projects && inv.projects.status === "de_inceput") await sb.from("projects").update({ status: "in_lucru" }).eq("id", inv.projects.id);
  if (cfg.invoice_paid_notify) {
    await notify(sb, { type: "plata", title: `Factură încasată: ${formatLei(inv.total)}`, body: inv.clients?.name, link: `/crm/financiar/facturi/${inv.id}` });
    if (inv.projects?.manager_id) {
      await notify(sb, { user_id: inv.projects.manager_id, type: "plata", title: `Plată primită pentru ${inv.projects.name}`, body: "Poți începe etapa următoare.", link: `/crm/proiecte/${inv.projects.id}` });
    }
  }
}
