import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { clientByToken, touchPortal } from "@/lib/portal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Portal client", robots: { index: false, follow: false } };

export default async function PortalLayout({ children, params }: { children: React.ReactNode; params: { token: string } }) {
  const client = await clientByToken(params.token);
  if (!client) notFound();
  await touchPortal(client.id, client.portal_last_seen);
  return (
    <div className="min-h-screen bg-hero-soft">
      <header className="border-b border-line bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href={`/portal/${params.token}`} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="MAVA Studio" className="h-8 w-auto" />
            <span className="hidden border-l border-line pl-3 text-sm font-semibold text-ink sm:block">Portal client</span>
          </Link>
          <div className="text-right">
            <p className="text-sm font-bold text-ink">{client.name}</p>
            {client.contact_name && <p className="text-xs text-muted">{client.contact_name}</p>}
          </div>
        </div>
      </header>
      <main className="container py-8 md:py-10">{children}</main>
      <footer className="container pb-8 text-center text-xs text-muted">
        <p className="flex items-center justify-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Link personal și confidențial. Nu îl distribui altor persoane.</p>
        <p className="mt-1">MAVA Studio · contact@mavastudio.ro</p>
      </footer>
    </div>
  );
}
