import { createServerClient } from "@supabase/ssr";
import { createClient as createSbClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from "./env";

/** Client bound to the logged-in user's session (RLS applies). */
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are refreshed by middleware.
        }
      },
    },
  });
}

/** Service-role client. Server only — bypasses RLS. Use for public API routes (lead form, offer acceptance). */
export function createAdminClient() {
  return createSbClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Anonymous read-only client for public content (blog, portfolio). */
export function createPublicClient() {
  return createSbClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
}
