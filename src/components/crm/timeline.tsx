import { FileText, Phone, Mail, Users, PenLine, Wallet, FolderKanban, StickyNote, Inbox, RefreshCw, Receipt } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { addNote } from "@/app/crm/actions/sales";
import { SubmitButton } from "./client-ui";
import { Select, Textarea } from "./ui";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lead: Inbox,
  apel: Phone,
  email: Mail,
  intalnire: Users,
  oferta: FileText,
  contract: PenLine,
  plata: Wallet,
  factura: Receipt,
  proiect: FolderKanban,
  status: RefreshCw,
  nota: StickyNote,
  client: Users,
};

export type ActivityRow = { id: string; type: string; title: string; description: string | null; created_at: string; profiles?: { full_name: string } | null };

export function Timeline({ items }: { items: ActivityRow[] }) {
  if (!items.length) return <p className="py-8 text-center text-sm text-muted">Nicio activitate încă.</p>;
  return (
    <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-line">
      {items.map((a) => {
        const I = ICONS[a.type] ?? StickyNote;
        return (
          <li key={a.id} className="relative flex gap-4">
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand-blue ring-4 ring-white"><I className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm font-semibold text-ink">{a.title}</p>
              {a.description && <p className="mt-0.5 whitespace-pre-line text-sm text-body">{a.description}</p>}
              <p className="mt-1 text-[11px] text-muted">{formatDate(a.created_at, true)}{a.profiles?.full_name ? ` · ${a.profiles.full_name}` : ""}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function NoteForm({ leadId, clientId, projectId, path }: { leadId?: string; clientId?: string; projectId?: string; path: string }) {
  return (
    <form action={addNote} className="mb-6 space-y-2 rounded-xl bg-soft p-3">
      {leadId && <input type="hidden" name="lead_id" value={leadId} />}
      {clientId && <input type="hidden" name="client_id" value={clientId} />}
      {projectId && <input type="hidden" name="project_id" value={projectId} />}
      <input type="hidden" name="path" value={path} />
      <Textarea name="body" rows={2} placeholder="Adaugă o notă, un apel sau o întâlnire..." required />
      <div className="flex items-center justify-between gap-2">
        <Select name="type" className="!w-auto !py-1.5 text-xs" options={{ nota: "Notă", apel: "Apel efectuat", email: "Email trimis", intalnire: "Întâlnire" }} />
        <SubmitButton className="btn-sm !py-1.5">Adaugă</SubmitButton>
      </div>
    </form>
  );
}
