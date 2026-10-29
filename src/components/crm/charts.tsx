"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

const lei = (v: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(v) + " lei";
const compact = (v: number) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : String(v));

function TooltipBox({ active, payload, label, money = true }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; money?: boolean }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-card">
      {label && <p className="mb-1 font-semibold text-ink">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-body">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <b className="text-ink">{money ? lei(p.value) : p.value}</b>
        </p>
      ))}
    </div>
  );
}

/** Evoluție în timp: una sau două serii (ex. încasări vs cheltuieli) pe aceeași axă, în lei. */
export function TrendChart({ data, series, height = 260 }: { data: Record<string, number | string>[]; series: { key: string; name: string; color: string }[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity={0.22} />
                <stop offset="1" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="#EEF0F8" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#7A819E" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#7A819E" }} tickFormatter={compact} width={44} />
          <Tooltip content={<TooltipBox />} cursor={{ stroke: "#C7CCE6", strokeDasharray: "3 3" }} />
          {series.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#4B5375" }} />}
          {series.map((s) => (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} fill={`url(#g-${s.key})`} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Distribuție pe categorii: donut + legendă cu valori și procente (identitatea nu depinde doar de culoare). */
export function DonutChart({ data, centerLabel }: { data: { name: string; value: number; color: string }[]; centerLabel: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <p className="py-16 text-center text-sm text-muted">Nu există încă date.</p>;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="64%" outerRadius="100%" paddingAngle={1.5} stroke="#fff" strokeWidth={2}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip content={<TooltipBox />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] text-muted">{centerLabel}</span>
          <span className="text-sm font-extrabold text-ink">{lei(total)}</span>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 truncate text-body">{d.name}</span>
            <span className="font-semibold text-ink">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarsChart({ data, color = "#2B4CF5", name, money = false, height = 220 }: { data: { label: string; value: number }[]; color?: string; name: string; money?: boolean; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid stroke="#EEF0F8" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#7A819E" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#7A819E" }} tickFormatter={money ? compact : undefined} allowDecimals={false} width={40} />
          <Tooltip content={<TooltipBox money={money} />} cursor={{ fill: "#F2F4FC" }} />
          <Bar dataKey="value" name={name} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
