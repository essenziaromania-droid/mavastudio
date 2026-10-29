"use client";
import { useState } from "react";
import type { PortfolioItem } from "@/content/demo";
import { CATEGORY_LABELS, CATEGORY_LABELS_EN } from "@/content/demo";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";
import { useLocale } from "./locale-provider";

const T = {
  ro: { all: "Toate", empty: "Nu există încă proiecte în această categorie." },
  en: { all: "All", empty: "No projects in this category yet." },
};

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const locale = useLocale();
  const t = T[locale];
  const labels = locale === "en" ? CATEGORY_LABELS_EN : CATEGORY_LABELS;
  const [filter, setFilter] = useState<string>("toate");
  const tabs = [{ key: "toate", label: t.all }, ...Object.entries(labels).map(([key, label]) => ({ key, label }))];
  const filtered = filter === "toate" ? items : items.filter((i) => i.category === filter);
  return (
    <>
      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full px-7 py-2.5 text-sm font-medium transition",
              filter === tab.key ? "bg-brand-gradient text-white shadow-glow" : "border border-line bg-white text-ink-2 hover:border-brand-blue/40",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProjectCard key={p.slug} p={p} showSummary locale={locale} />)}
        </div>
      ) : <p className="py-16 text-center text-body">{t.empty}</p>}
    </>
  );
}
