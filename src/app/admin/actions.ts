"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildPayload } from "@/lib/admin/coerce";
import { NotAdminError, requireAdmin } from "@/lib/admin/auth";
import { getContentResource, getResource, settingsGroups } from "@/lib/admin/resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { lowestPrice, MODE_ORDER } from "@/lib/pricing";
import type { CoursePricing, LearningMode } from "@/lib/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

function friendlyError(error: unknown): string {
  if (error instanceof NotAdminError) return error.message;
  const e = error as { code?: string; message?: string; details?: string };
  if (e?.code === "23505") return "That value must be unique, and another record already uses it (check the slug or code).";
  if (e?.code === "23503") return "This record is linked to other data and cannot be changed that way.";
  if (e?.code === "42501") return "Permission denied. Make sure your account is listed in public.admins.";
  return e?.message || "Something went wrong. Please try again.";
}

/** Public pages are cached; refresh everything after any content change. */
function refreshSite() {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Enter your email and password." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "Incorrect email or password." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account does not have admin access. Run supabase/12create-admin.sql for it." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Content CRUD                                                        */
/* ------------------------------------------------------------------ */

export async function saveResource(key: string, id: string | null, values: Record<string, unknown>): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const resource = getContentResource(key);
    if (!resource) return { ok: false, error: "Unknown section." };

    const row = buildPayload(resource.groups, values);

    // Courses: the modes offered and the "from" fee are derived from the per-mode pricing
    if (resource.key === "courses" && row.pricing) {
      const pricing = row.pricing as CoursePricing;
      row.modes = MODE_ORDER.filter((m) => pricing[m]);
      row.fee = lowestPrice({ fee: 0, modes: row.modes as LearningMode[], pricing }).final;
    }

    // Certificates: default the printed course title to the selected course
    if (resource.key === "certificates" && !row.course_title && row.course_id) {
      const { data } = await supabase.from("courses").select("title").eq("id", row.course_id).maybeSingle();
      row.course_title = data?.title ?? null;
    }
    if (resource.key === "certificates") {
      if (!row.course_title) return { ok: false, error: "Choose a course or enter the course title." };
      row.code = String(row.code).toUpperCase();
    }

    const query = id
      ? supabase.from(resource.table).update(row).eq("id", id).select("id").single()
      : supabase.from(resource.table).insert(row).select("id").single();
    const { data, error } = await query;
    if (error) return { ok: false, error: friendlyError(error) };
    const savedId = data.id as string;

    if (resource.relation) {
      const rel = resource.relation;
      const ids = Array.isArray(values[rel.field]) ? (values[rel.field] as string[]).filter(Boolean) : [];
      const { error: delError } = await supabase.from(rel.table).delete().eq(rel.ownKey, savedId);
      if (delError) return { ok: false, error: friendlyError(delError), id: savedId };
      if (ids.length) {
        const { error: insError } = await supabase
          .from(rel.table)
          .insert(ids.map((other) => ({ [rel.ownKey]: savedId, [rel.otherKey]: other })));
        if (insError) return { ok: false, error: friendlyError(insError), id: savedId };
      }
    }

    refreshSite();
    return { ok: true, id: savedId };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}

export async function deleteResource(key: string, id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const resource = getResource(key);
    if (!resource) return { ok: false, error: "Unknown section." };
    const { error } = await supabase.from(resource.table).delete().eq("id", id);
    if (error) return { ok: false, error: friendlyError(error) };
    refreshSite();
    revalidatePath(`/admin/${key}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}

export async function togglePublished(key: string, id: string, value: boolean): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const resource = getContentResource(key);
    if (!resource) return { ok: false, error: "Unknown section." };
    const { error } = await supabase.from(resource.table).update({ is_published: value }).eq("id", id);
    if (error) return { ok: false, error: friendlyError(error) };
    refreshSite();
    revalidatePath(`/admin/${key}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}

/* ------------------------------------------------------------------ */
/* Inbox                                                               */
/* ------------------------------------------------------------------ */

export async function updateSubmission(
  key: string,
  id: string,
  patch: { status?: string; admin_notes?: string },
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const resource = getResource(key);
    if (!resource || resource.kind !== "inbox") return { ok: false, error: "Unknown section." };
    const update: Record<string, string | null> = {};
    if (patch.status !== undefined) {
      if (!resource.statuses.some((s) => s.value === patch.status)) return { ok: false, error: "Invalid status." };
      update.status = patch.status;
    }
    if (patch.admin_notes !== undefined) update.admin_notes = patch.admin_notes.trim().slice(0, 4000) || null;
    const { error } = await supabase.from(resource.table).update(update).eq("id", id);
    if (error) return { ok: false, error: friendlyError(error) };
    revalidatePath(`/admin/${key}`);
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export async function saveSettings(values: Record<string, unknown>): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const row = buildPayload(settingsGroups, values);
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...row });
    if (error) return { ok: false, error: friendlyError(error) };
    refreshSite();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}

/* ------------------------------------------------------------------ */
/* Udemy                                                               */
/* ------------------------------------------------------------------ */

export async function fetchUdemyDetails(
  url: string,
): Promise<{ ok: true; course: import("@/lib/types").UdemyCourse } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const { fetchUdemyCourse, normalizeUdemyUrl } = await import("@/lib/udemy");
    if (!normalizeUdemyUrl(url)) return { ok: false, error: "Paste a Udemy course link like https://www.udemy.com/course/web-dev-master/" };
    const course = await fetchUdemyCourse(url);
    if (!course) return { ok: false, error: "Udemy did not return the course details. Fill in the fields manually." };
    return { ok: true, course };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  }
}
