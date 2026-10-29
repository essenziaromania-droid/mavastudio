import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  avatar_url: string | null;
  hourly_cost: number;
};

export type Session = {
  sb: ReturnType<typeof createClient>;
  userId: string;
  profile: Profile;
  perms: Set<string>;
  can: (module: string) => boolean;
  isAdmin: boolean;
};

/** Utilizatorul curent + permisiuni. Redirecționează la /login dacă nu există sesiune sau profil activ. */
export const getSession = cache(async (): Promise<Session> => {
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile || profile.status !== "activ") redirect("/login?inactive=1");

  const { data: rows } = await sb.from("role_permissions").select("module").eq("role", profile.role);
  const perms = new Set<string>((rows ?? []).map((r) => r.module as string));
  const isAdmin = profile.role === "admin";
  return { sb, userId: user.id, profile: profile as Profile, perms, isAdmin, can: (m: string) => isAdmin || perms.has(m) };
});

/** Oprește accesul la o pagină dacă rolul nu are modulul. */
export async function requireModule(module: string | string[]) {
  const s = await getSession();
  const list = Array.isArray(module) ? module : [module];
  if (!list.some((m) => s.can(m))) redirect("/crm?forbidden=1");
  return s;
}
