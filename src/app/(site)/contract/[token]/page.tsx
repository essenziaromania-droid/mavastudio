import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import { SignForm } from "./sign-form";
import { addActivity, notify } from "@/lib/events";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contract", robots: { index: false, follow: false } };

export default async function PublicContract({ params }: { params: { token: string } }) {
  if (!hasSupabase || !/^[0-9a-f-]{36}$/i.test(params.token)) notFound();
  const sb = createAdminClient();
  const { data: c } = await sb.from("contracts").select("*, clients(name)").eq("public_token", params.token).maybeSingle();
  if (!c || c.status === "draft") notFound();
  if (!c.viewed_at) {
    await sb.from("contracts").update({ viewed_at: new Date().toISOString(), status: c.status === "trimis" ? "vizualizat" : c.status }).eq("id", c.id);
    await addActivity(sb, { client_id: c.client_id, type: "contract", title: `Contractul ${c.number} a fost vizualizat` });
    await notify(sb, { type: "contract", title: `👀 Contractul ${c.number} a fost vizualizat`, body: c.clients?.name, link: `/crm/contracte/${c.id}` });
  }
  return (
    <section className="bg-hero-soft">
      <div className="container max-w-3xl py-12">
        <div className="card overflow-hidden">
          <div className="h-1.5 bg-brand-gradient" />
          <div className="flex items-center justify-between border-b border-line px-6 py-4 md:px-10">
            <p className="eyebrow">Contract {c.number}</p>
            <a href={`/api/pdf/contract/${params.token}?public=1&download=1`} className="btn-ghost btn-sm"><Download className="h-4 w-4" /> PDF</a>
          </div>
          <div className="prose-mava p-6 text-[15px] md:p-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(c.body ?? "") }} />
          <div className="border-t border-line bg-soft/60 p-6 md:p-10">
            {c.status === "semnat" ? (
              <p className="font-semibold text-emerald-700">✓ Semnat electronic de {c.signed_by_name} la {formatDate(c.signed_at, true)}.</p>
            ) : (
              <SignForm token={params.token} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
