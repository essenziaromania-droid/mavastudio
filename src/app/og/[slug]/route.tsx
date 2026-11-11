import { ImageResponse } from "next/og";
import { BLOG_TITLES } from "@/content/blog/titles";

export const runtime = "edge";

// Adresele fonturilor trebuie scrise complet, ca să fie incluse la build.
const loadExtraBold = () => fetch(new URL("../../../../public/fonts/PlusJakartaSans-ExtraBold.ttf", import.meta.url)).then((r) => r.arrayBuffer());
const loadRegular = () => fetch(new URL("../../../../public/fonts/PlusJakartaSans-Regular.ttf", import.meta.url)).then((r) => r.arrayBuffer());

/**
 * Imaginea de distribuire a unui articol (Facebook, LinkedIn, WhatsApp, Google Discover):
 * titlul pe gradientul MAVA, 1200×630. Adresa: /og/<slug>?lang=ro|en
 */
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const lang = new URL(req.url).searchParams.get("lang") === "en" ? "en" : "ro";
  const entry = BLOG_TITLES[params.slug];
  const title = entry?.[lang]?.title ?? (lang === "en" ? "MAVA Studio blog" : "Blog MAVA Studio");
  const category = entry?.[lang]?.category ?? "Blog";
  const [extra, regular] = await Promise.all([loadExtraBold(), loadRegular()]);
  const size = title.length > 90 ? 56 : title.length > 60 ? 64 : 74;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "white",
          fontFamily: "Jakarta",
          background: "linear-gradient(135deg, #2B4CF5 0%, #5B3CF2 50%, #B23CF0 100%)",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -90, top: -90, width: 360, height: 360, borderRadius: 999, background: "linear-gradient(135deg, rgba(103,232,249,.55), rgba(240,171,252,.35))", display: "flex" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 400, padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: 2 }}>
            {category}
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: 2 }}>MAVA STUDIO</div>
        </div>
        <div style={{ display: "flex", fontSize: size, fontWeight: 800, lineHeight: 1.12, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", width: 120, height: 8, borderRadius: 99, background: "linear-gradient(90deg, #67E8F9, rgba(255,255,255,.85))" }} />
          <div style={{ display: "flex", fontSize: 26, fontWeight: 400, opacity: 0.9 }}>mavastudio.ro/blog</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Jakarta", data: extra, weight: 800, style: "normal" },
        { name: "Jakarta", data: regular, weight: 400, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
