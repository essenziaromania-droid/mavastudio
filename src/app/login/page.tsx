import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/ui/logo";
import { hasSupabase } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Autentificare", robots: { index: false } };

export default function LoginPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-soft px-4">
      <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 opacity-60" />
      <div aria-hidden className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200 to-fuchsia-200 opacity-60" />
      <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-card-hover">
        <div className="mb-8 flex justify-center"><Logo href="/" /></div>
        {!hasSupabase || searchParams.setup ? (
          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            <b>CRM-ul nu este încă configurat.</b> Adaugă variabilele Supabase în fișierul <code>.env.local</code> (vezi <code>README.md</code>) și repornește aplicația.
          </div>
        ) : (
          <LoginForm next={searchParams.next} mfa={searchParams.mfa === "1"} notice={searchParams.inactive ? "Contul tău nu este activ. Contactează administratorul." : searchParams.link ? "Linkul a expirat sau nu este valid." : undefined} />
        )}
      </div>
    </div>
  );
}
