import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { renderContractPdf, renderOfferPdf } from "@/lib/pdf";
import { getSetting } from "@/lib/events";
import type { Company } from "@/lib/documents";

export const runtime = "nodejs";

/**
 * /api/pdf/oferta/{id}          – utilizator CRM autentificat (RLS)
 * /api/pdf/oferta/{token}?public=1 – link public al clientului (după token)
 * idem pentru /api/pdf/contract/...
 */
async function handle(req: NextRequest, { params }: { params: { kind: string; id: string } }) {
  const isPublic = req.nextUrl.searchParams.get("public") === "1";
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) return new NextResponse("Not found", { status: 404 });
  const sb = isPublic ? createAdminClient() : createClient();
  if (!isPublic) {
    const { data } = await sb.auth.getUser();
    if (!data.user) return new NextResponse("Unauthorized", { status: 401 });
  }
  const key = isPublic ? "public_token" : "id";
  const company = await getSetting<Company>(createAdminClient(), "company", {});

  let buf: Buffer;
  let name: string;
  if (params.kind === "oferta") {
    const { data: o } = await sb.from("offers").select("*, clients(*), offer_items(*)").eq(key, params.id).maybeSingle();
    if (!o) return new NextResponse("Not found", { status: 404 });
    buf = await renderOfferPdf(o, company);
    name = `Oferta-${o.number}.pdf`;
  } else if (params.kind === "contract") {
    const { data: c } = await sb.from("contracts").select("*, clients(*)").eq(key, params.id).maybeSingle();
    if (!c) return new NextResponse("Not found", { status: 404 });
    buf = await renderContractPdf(c, company);
    name = `Contract-${c.number}.pdf`;
  } else {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${req.nextUrl.searchParams.get("download") ? "attachment" : "inline"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function GET(req: NextRequest, ctx: { params: { kind: string; id: string } }) {
  try {
    return await handle(req, ctx);
  } catch (e) {
    console.error("[pdf]", e);
    return new NextResponse("PDF-ul nu a putut fi generat. Încearcă din nou.", { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
