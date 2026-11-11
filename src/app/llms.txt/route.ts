import { SITE } from "@/content/site";
import { getServices } from "@/content/services";
import { getPosts } from "@/lib/public-data";

export const revalidate = 3600;

/**
 * /llms.txt — rezumatul site-ului pentru motoarele de căutare cu AI (ChatGPT, Perplexity, Gemini, Claude).
 * Formatul urmează propunerea de la llmstxt.org.
 */
export async function GET() {
  const posts = await getPosts("ro");
  const u = (p: string) => `${SITE.url}${p}`;
  const body = [
    "# MAVA Studio",
    "",
    "> Studio digital din România, condus de fondatorul Marius Ungureanu. Construiește site-uri de prezentare, landing page-uri și magazine online, creează poze și clipuri de produs cu AI, editează video, administrează social media și dezvoltă CRM-uri, automatizări și aplicații web pentru afaceri mici și mijlocii. Lucrează cu clienți din România și din străinătate.",
    "",
    "Prețuri de pornire (lei, firma nu este plătitoare de TVA): landing page de la 1.000 lei, site de prezentare de la 3.000 lei, magazin online de la 6.000 lei, administrare social media de la 1.500 lei/lună, editare video de la 25 lei/minut, CRM de la 10.000 lei, platformă web de la 25.000 lei, mentenanță site 500 lei/lună. Răspuns la cereri în 24 de ore lucrătoare.",
    "",
    "## Pagini principale",
    `- [Prima pagină](${u("/")}): ce face MAVA Studio și pentru cine`,
    `- [Servicii](${u("/servicii")}): toate serviciile, grupate`,
    `- [Prețuri](${u("/preturi")}): prețuri de pornire, termene de livrare și condiții de plată`,
    `- [Proiecte](${u("/proiecte")}): portofoliu cu proiecte reale`,
    `- [Despre noi](${u("/despre-noi")}): fondatorul și modul de lucru`,
    `- [Contact](${u("/contact")}) și [cerere de ofertă](${u("/incepe-un-proiect")})`,
    "",
    "## Servicii",
    ...getServices("ro").map((s) => `- [${s.menuTitle}](${u(`/servicii/${s.slug}`)}): ${s.short}`),
    "",
    "## Articole de blog",
    ...posts.map((p) => `- [${p.title}](${u(`/blog/${p.slug}`)}): ${p.seo_description || p.excerpt || ""}`),
    "",
    "## English",
    `- [English version of the site](${u("/en")}) and [pricing](${u("/en/pricing")})`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
