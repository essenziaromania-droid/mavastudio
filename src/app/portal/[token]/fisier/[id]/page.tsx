import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import { clientByToken, portalFile, reviewable } from "@/lib/portal";
import { formatDate } from "@/lib/utils";
import { ReviewForm } from "../../forms";
import { MediaReview } from "@/components/ui/media-review";
import { portalComment } from "../../../actions";

export default async function PortalFilePage({ params }: { params: { token: string; id: string } }) {
  const client = await clientByToken(params.token);
  if (!client) notFound();
  const file = await portalFile(client.id, params.id);
  if (!file) notFound();
  const { data: comments } = await createAdminClient()
    .from("file_comments")
    .select("id, author_type, author_name, body, timecode, created_at")
    .eq("file_id", file.id)
    .order("timecode", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  return (
    <>
      <Link href={`/portal/${params.token}?tab=materiale`} className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue"><ArrowLeft className="h-4 w-4" /> Toate materialele</Link>
      <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">{file.name}</h1>
      <p className="mt-1 text-sm text-muted">Adăugat la {formatDate(file.created_at)}</p>

      {reviewable(file.folder) && (
        <div className="card mt-6 p-5">
          <h2 className="font-bold">Ești mulțumit de acest material?</h2>
          <p className="mb-4 mt-1 text-sm text-body">Aprobă-l sau spune-ne ce ai vrea să schimbăm. Echipa primește imediat răspunsul tău.</p>
          <ReviewForm token={params.token} fileId={file.id} status={file.review_status} />
        </div>
      )}

      <div className="mt-6">
        <MediaReview action={portalComment} hidden={{ token: params.token, file_id: file.id }} url={file.url} mime={file.mime} name={file.name} comments={(comments ?? []).map((c) => ({ ...c, timecode: c.timecode == null ? null : Number(c.timecode) }))} />
      </div>
    </>
  );
}
