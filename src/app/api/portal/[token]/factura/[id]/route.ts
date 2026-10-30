import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getSetting } from "@/lib/events";
import { DEFAULT_INVOICING, downloadInvoicePdf, type InvoicingSettings } from "@/lib/invoicing";
import { clientByToken } from "@/lib/portal";

export const runtime = "nodejs";

/** PDF-ul unei facturi emise, pentru clientul care deține linkul de portal. */
export async function GET(_: Request, { params }: { params: { token: string; id: string } }) {
  const client = await clientByToken(params.token);
  if (!client || !/^[0-9a-f-]{36}$/i.test(params.id)) return new NextResponse("Not found", { status: 404 });
  const sb = createAdminClient();
  const { data: inv } = await sb.from("invoices").select("provider, series, number, external_url").eq("id", params.id).eq("client_id", client.id).not("number", "is", null).maybeSingle();
  if (!inv) return new NextResponse("Not found", { status: 404 });
  const settings = await getSetting<InvoicingSettings>(sb, "invoicing", DEFAULT_INVOICING);
  const r = await downloadInvoicePdf(settings, inv);
  if (!r.ok) return new NextResponse("Factura nu poate fi descărcată acum. Încearcă din nou mai târziu.", { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new NextResponse(new Uint8Array(r.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Factura-${[inv.series, inv.number].filter(Boolean).join("-")}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
