import { renderMarkdown } from "@/lib/markdown";
import type { Locale } from "@/lib/i18n";

export function LegalPage({ title, updated, body, locale = "ro" }: { title: string; updated: string; body: string; locale?: Locale }) {
  return (
    <>
      <section className="bg-hero-soft">
        <div className="container max-w-3xl py-14">
          <h1 className="text-4xl font-extrabold md:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted">{locale === "en" ? "Last updated" : "Ultima actualizare"}: {updated}</p>
        </div>
      </section>
      <div className="container max-w-3xl py-12">
        <div className="prose-mava" dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
      </div>
    </>
  );
}
