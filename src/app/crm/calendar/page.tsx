import Link from "next/link";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ro } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { Field, Input, PageHeader, Panel, Select, Textarea, optionsFrom } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { EVENT_TYPE } from "@/lib/crm/constants";
import { createEvent, deleteEvent } from "../actions/calendar";
import { getClientsOptions, getProjectsOptions } from "@/lib/crm/queries";
import { cn } from "@/lib/utils";

export const metadata = { title: "Calendar" };

const DOT: Record<string, string> = { intalnire: "bg-blue-500", deadline: "bg-rose-500", lansare: "bg-emerald-500", review: "bg-amber-500", prezentare: "bg-purple-500", altul: "bg-slate-400", task: "bg-cyan-500", proiect: "bg-rose-400" };

type Item = { id: string; title: string; kind: string; time?: string; href?: string; deletable?: boolean };

export default async function CalendarPage({ searchParams }: { searchParams: { luna?: string; client?: string } }) {
  const { sb } = await requireModule("calendar");
  const month = searchParams.luna ? new Date(`${searchParams.luna}-01T12:00:00`) : new Date();
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const from = format(gridStart, "yyyy-MM-dd");
  const to = format(gridEnd, "yyyy-MM-dd");

  const [{ data: events }, { data: tasks }, { data: projects }, clients, projectOpts] = await Promise.all([
    sb.from("events").select("id, title, type, start_at, all_day").gte("start_at", `${from}T00:00:00`).lte("start_at", `${to}T23:59:59`).order("start_at"),
    sb.from("tasks").select("id, title, deadline").neq("status", "finalizat").gte("deadline", from).lte("deadline", to),
    sb.from("projects").select("id, name, deadline").neq("status", "finalizat").gte("deadline", from).lte("deadline", to),
    getClientsOptions(sb),
    getProjectsOptions(sb),
  ]);

  const byDay = new Map<string, Item[]>();
  const push = (d: string, it: Item) => byDay.set(d, [...(byDay.get(d) ?? []), it]);
  (events ?? []).forEach((e) => push(format(new Date(e.start_at), "yyyy-MM-dd"), { id: e.id, title: e.title, kind: e.type, time: e.all_day ? undefined : format(new Date(e.start_at), "HH:mm"), deletable: true }));
  (tasks ?? []).forEach((t) => push(t.deadline!, { id: t.id, title: t.title, kind: "task", href: `/crm/taskuri/${t.id}` }));
  (projects ?? []).forEach((p) => push(p.deadline!, { id: p.id, title: `Deadline: ${p.name}`, kind: "proiect", href: `/crm/proiecte/${p.id}` }));

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <>
      <PageHeader title="Calendar" sub="Întâlniri, deadline-uri, task-uri, lansări, review-uri și prezentări." />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Panel pad={false}>
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <Link href={`/crm/calendar?luna=${format(subMonths(month, 1), "yyyy-MM")}`} className="rounded-lg p-2 hover:bg-soft"><ChevronLeft className="h-4 w-4" /></Link>
            <h2 className="text-lg font-bold capitalize">{format(month, "LLLL yyyy", { locale: ro })}</h2>
            <Link href={`/crm/calendar?luna=${format(addMonths(month, 1), "yyyy-MM")}`} className="rounded-lg p-2 hover:bg-soft"><ChevronRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-7 border-b border-line text-center text-xs font-semibold text-muted">
            {["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"].map((d) => <div key={d} className="py-2">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {days.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const items = byDay.get(key) ?? [];
              return (
                <div key={key} className={cn("min-h-[110px] border-b border-r border-line p-1.5", !isSameMonth(d, month) && "bg-soft/50")}>
                  <span className={cn("mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold", isToday(d) ? "bg-brand-blue text-white" : isSameMonth(d, month) ? "text-ink" : "text-muted")}>{format(d, "d")}</span>
                  <ul className="space-y-0.5">
                    {items.slice(0, 4).map((it) => (
                      <li key={it.kind + it.id} className="group flex items-center gap-1 rounded px-1 py-0.5 text-[11px] hover:bg-soft">
                        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[it.kind])} />
                        {it.href ? <Link href={it.href} className="truncate text-ink-2">{it.time && <b>{it.time} </b>}{it.title}</Link> : <span className="truncate text-ink-2">{it.time && <b>{it.time} </b>}{it.title}</span>}
                        {it.deletable && (
                          <form action={deleteEvent} className="ml-auto hidden group-hover:block"><input type="hidden" name="id" value={it.id} /><button title="Șterge"><X className="h-3 w-3 text-muted hover:text-rose-500" /></button></form>
                        )}
                      </li>
                    ))}
                    {items.length > 4 && <li className="px-1 text-[10px] text-muted">+{items.length - 4} altele</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </Panel>
        <div id="nou" className="space-y-6">
          <Panel title="Eveniment nou">
            <form action={createEvent} className="space-y-3">
              <Field label="Titlu *"><Input name="title" required placeholder="Ședință proiect" /></Field>
              <Field label="Tip"><Select name="type" options={optionsFrom(EVENT_TYPE)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Data *"><Input name="date" type="date" required defaultValue={format(new Date(), "yyyy-MM-dd")} /></Field>
                <Field label="Ora" hint="Gol = toată ziua"><Input name="time" type="time" /></Field>
              </div>
              <Field label="Durată (minute)"><Input name="duration" type="number" defaultValue={60} step={15} /></Field>
              <Field label="Client"><Select name="client_id" options={clients} placeholder="—" defaultValue={searchParams.client ?? ""} /></Field>
              <Field label="Proiect"><Select name="project_id" options={projectOpts} placeholder="—" /></Field>
              <Field label="Locație / link"><Input name="location" placeholder="Google Meet, birou..." /></Field>
              <Field label="Detalii"><Textarea name="description" rows={2} /></Field>
              <SubmitButton className="w-full">Adaugă în calendar</SubmitButton>
            </form>
          </Panel>
          <Panel title="Legendă">
            <ul className="grid grid-cols-2 gap-2 text-xs text-body">
              {[...Object.entries(EVENT_TYPE).map(([k, v]) => [k, v.label]), ["task", "Deadline task"], ["proiect", "Deadline proiect"]].map(([k, l]) => (
                <li key={k} className="flex items-center gap-2"><span className={cn("h-2 w-2 rounded-full", DOT[k])} />{l}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
