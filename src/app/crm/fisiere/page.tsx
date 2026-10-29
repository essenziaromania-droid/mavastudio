import Link from "next/link";
import { requireModule } from "@/lib/crm/auth";
import { PageHeader } from "@/components/crm/ui";
import { FilesBrowser } from "@/components/crm/files-browser";
import { getClientsOptions } from "@/lib/crm/queries";
import { DRIVE_FOLDERS } from "@/lib/crm/constants";
import { cn } from "@/lib/utils";

export const metadata = { title: "Fișiere" };

export default async function FilesPage({ searchParams }: { searchParams: { client?: string; folder?: string } }) {
  const { sb } = await requireModule("fisiere");
  const clients = await getClientsOptions(sb);
  const current = clients.find((c) => c.value === searchParams.client);
  const link = (p: Record<string, string | undefined>) => {
    const q = new URLSearchParams(Object.entries({ client: searchParams.client, folder: searchParams.folder, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/crm/fisiere${q.size ? `?${q}` : ""}`;
  };
  return (
    <>
      <PageHeader title="Fișiere" sub="Toate documentele, imaginile și materialele video, organizate pe clienți și proiecte." />
      <div className="mb-5 flex flex-wrap gap-3">
        <form className="flex gap-2">
          <select name="client" defaultValue={searchParams.client ?? ""} className="rounded-xl border border-line px-3 py-2 text-sm">
            <option value="">Toți clienții</option>
            {clients.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {searchParams.folder && <input type="hidden" name="folder" value={searchParams.folder} />}
          <button className="btn-ghost btn-sm">Aplică</button>
        </form>
        <div className="flex flex-wrap gap-1.5">
          <Link href={link({ folder: undefined })} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", !searchParams.folder ? "bg-brand-blue text-white" : "bg-white text-body ring-1 ring-line")}>Toate</Link>
          {DRIVE_FOLDERS.map((f) => (
            <Link key={f} href={link({ folder: f })} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", searchParams.folder === f ? "bg-brand-blue text-white" : "bg-white text-body ring-1 ring-line")}>{f}</Link>
          ))}
        </div>
      </div>
      <FilesBrowser clientId={searchParams.client} clientName={current?.label} folder={searchParams.folder} />
    </>
  );
}
