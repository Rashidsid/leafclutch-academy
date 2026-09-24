import "server-only";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSession =
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "forbidden"; user: User }
  | { status: "ok"; user: User; supabase: SupabaseClient };

/** Resolves the current visitor's admin status. RLS enforces the same rule in the database. */
export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured) return { status: "unconfigured" };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return { status: "forbidden", user };
  return { status: "ok", user, supabase };
}

export class NotAdminError extends Error {
  constructor() {
    super("You must be signed in as an admin to do that.");
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.status !== "ok") throw new NotAdminError();
  return session;
}

/** For admin pages: send anyone who is not an admin to the login screen. */
export async function requireAdminPage() {
  const session = await getAdminSession();
  if (session.status !== "ok") redirect("/admin/login");
  return session;
}
