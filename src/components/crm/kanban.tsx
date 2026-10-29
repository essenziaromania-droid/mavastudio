"use client";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { cn, formatDate, initials } from "@/lib/utils";

export type KanbanCard = {
  id: string;
  status: string;
  title: string;
  subtitle?: string | null;
  href: string;
  progress?: number;
  badge?: { label: string; cls: string } | null;
  date?: string | null;
  late?: boolean;
  people?: string[];
};

const COLOR: Record<string, string> = {
  de_inceput: "bg-slate-400",
  de_facut: "bg-rose-400",
  in_lucru: "bg-blue-500",
  review: "bg-amber-400",
  finalizat: "bg-emerald-500",
};

export function Kanban({ columns, cards, move }: { columns: { key: string; label: string }[]; cards: KanbanCard[]; move: (fd: FormData) => Promise<void> }) {
  const [, start] = useTransition();
  const [items, setItems] = useOptimistic(cards, (state, { id, status }: { id: string; status: string }) => state.map((c) => (c.id === id ? { ...c, status } : c)));

  const drop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id || items.find((c) => c.id === id)?.status === status) return;
    start(async () => {
      setItems({ id, status });
      const fd = new FormData();
      fd.set("id", id);
      fd.set("status", status);
      await move(fd);
    });
  };

  return (
    <div className="crm-scroll grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2">
      {columns.map((col) => {
        const list = items.filter((c) => c.status === col.key);
        return (
          <div key={col.key} onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e, col.key)} className="flex min-h-[300px] flex-col rounded-2xl bg-[#EEF0F8]/70 p-3">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={cn("h-2.5 w-2.5 rounded-full", COLOR[col.key] ?? "bg-slate-400")} />
              <span className="text-sm font-bold text-ink">{col.label}</span>
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-body">{list.length}</span>
            </div>
            <div className="flex-1 space-y-2.5">
              {list.map((c) => (
                <div key={c.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", c.id)} className={cn("cursor-grab rounded-xl border-l-4 bg-white p-3 shadow-card active:cursor-grabbing", c.late ? "border-l-rose-400" : "border-l-transparent")}>
                  <Link href={c.href} className="block text-sm font-bold text-ink hover:text-brand-blue">{c.title}</Link>
                  {c.subtitle && <p className="mt-0.5 truncate text-xs text-muted">{c.subtitle}</p>}
                  {typeof c.progress === "number" && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft"><div className={cn("h-full rounded-full", c.progress >= 100 ? "bg-emerald-500" : "bg-brand-gradient")} style={{ width: `${c.progress}%` }} /></div>
                      <span className="text-[11px] font-semibold text-body">{c.progress}%</span>
                    </div>
                  )}
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {(c.people ?? []).slice(0, 4).map((p) => (
                        <span key={p} title={p} className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-[9px] font-bold text-white ring-2 ring-white">{initials(p)}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {c.badge && <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", c.badge.cls)}>{c.badge.label}</span>}
                      {c.date && <span className={cn("text-[11px]", c.late ? "font-bold text-rose-500" : "text-muted")}>{formatDate(c.date)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
