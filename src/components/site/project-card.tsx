import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PortfolioItem } from "@/content/demo";
import { localePath, type Locale } from "@/lib/i18n";
import { ProjectVisual } from "./mockups";

export function ProjectCard({ p, showSummary = false, locale = "ro" }: { p: PortfolioItem; showSummary?: boolean; locale?: Locale }) {
  return (
    <Link href={localePath(`/proiecte/${p.slug}`, locale)} className="card group flex flex-col overflow-hidden card-hover">
      <div className="aspect-[16/10] overflow-hidden border-b border-line">
        {p.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="h-full w-full transition duration-500 group-hover:scale-[1.03]"><ProjectVisual visual={p.visual} title={p.title} lang={locale} /></div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="text-sm text-body">{p.subtitle}</p>
          </div>
          <span className="arrow-dot shrink-0"><ArrowRight className="h-4 w-4" /></span>
        </div>
        {showSummary && p.summary && <p className="mt-3 text-sm leading-relaxed text-body">{p.summary}</p>}
      </div>
    </Link>
  );
}
