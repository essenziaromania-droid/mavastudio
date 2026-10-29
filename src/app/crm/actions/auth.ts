"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; info?: string };

function origin() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return process.env.NEXT_PUBLIC_SITE_URL && !host?.startsWith("localhost") ? process.env.NEXT_PUBLIC_SITE_URL : `${proto}://${host}`;
}

export async function signIn(_: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const next = String(fd.get("next") ?? "/crm");
  if (!email || !password) return { error: "Completează emailul și parola." };
  const sb = createClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email sau parolă incorectă." };
  const { data: aal } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") redirect("/login?mfa=1");
  redirect(next.startsWith("/crm") ? next : "/crm");
}

export async function resetPassword(_: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get("email") ?? "").trim();
  if (!email) return { error: "Completează adresa de email." };
  const sb = createClient();
  await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin()}/auth/callback?next=/crm/cont?reset=1` });
  return { info: "Dacă adresa există în sistem, vei primi un email cu linkul de resetare." };
}

export async function signOut() {
  const sb = createClient();
  await sb.auth.signOut();
  redirect("/login");
}

export async function updatePassword(_: AuthState, fd: FormData): Promise<AuthState> {
  const p1 = String(fd.get("password") ?? "");
  const p2 = String(fd.get("password2") ?? "");
  if (p1.length < 10) return { error: "Parola trebuie să aibă minimum 10 caractere." };
  if (p1 !== p2) return { error: "Parolele nu coincid." };
  const sb = createClient();
  const { error } = await sb.auth.updateUser({ password: p1 });
  if (error) return { error: error.message };
  return { info: "Parola a fost actualizată." };
}

export async function updateProfile(_: AuthState, fd: FormData): Promise<AuthState> {
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: "Sesiune expirată." };
  const { error } = await sb
    .from("profiles")
    .update({ full_name: String(fd.get("full_name") ?? "").trim(), phone: String(fd.get("phone") ?? "").trim() || null })
    .eq("id", user.id);
  if (error) return { error: error.message };
  return { info: "Profil actualizat." };
}
