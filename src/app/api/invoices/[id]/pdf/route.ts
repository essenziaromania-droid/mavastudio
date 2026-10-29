import { NextResponse } from "next/server";
import { getSession } from "@/lib/crm/auth";
import { getSetting } from "@/lib/events";
import { createAdminClient } from "@/lib/supabase/server";
import { DEFAULT_INVOICING, downloadInvoicePdf, type InvoicingSettings } from "@/lib/invoicing";

export const runtime = "nodejs";

/** PDF-ul unei facturi emise, adus din SmartBill / Oblio / FGO. Doar pentru utilizatori CRM cu acces la Financiar. */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s.can("financiar")) return new NextResponse("Forbidden", { status: 403 });
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) return new NextResponse("Not found", { status: 404 });

  const { data: inv } = await s.sb.from("invoices").select("provider, series, number, external_url").eq("id", params.id).maybeSingle();
  if (!inv) return new NextResponse("Not found", { status: 404 });

  const settings = await getSetting<InvoicingSettings>(createAdminClient(), "invoicing", DEFAULT_INVOICING);
  const r = await downloadInvoicePdf(settings, inv);
  if (!r.ok) return new NextResponse(r.error, { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } });

  const name = `Factura-${[inv.series, inv.number].filter(Boolean).join("-")}.pdf`;
  const inline = new URL(req.url).searchParams.get("download") !== "1";
  return new NextResponse(new Uint8Array(r.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
