"use server";

import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getPublicClient } from "@/lib/supabase/public";

export interface FormState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  /** Echoed back on failure so the form keeps what the visitor typed. */
  values?: Record<string, string>;
}

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Enter a valid phone number")
  .regex(/^[+\d][\d\s-]{6,19}$/, "Enter a valid phone number");
const email = z.string().trim().toLowerCase().max(160).email("Enter a valid email address");
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters`)
    .optional()
    .transform((v) => (v ? v : null));
const uuidOrNull = z
  .string()
  .optional()
  .transform((v) => (v && /^[0-9a-f-]{36}$/i.test(v) ? v : null));

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

function invalid(formData: FormData, errors: Record<string, string>, message = "Please check the highlighted fields."): FormState {
  const values: Record<string, string> = {};
  formData.forEach((v, k) => {
    if (typeof v === "string" && k !== "website" && !k.startsWith("$")) values[k] = v;
  });
  return { ok: false, message, errors, values };
}

/** Bots fill the hidden "website" field; humans never see it. */
function isSpam(formData: FormData) {
  return Boolean(formData.get("website"));
}

const NOT_CONFIGURED_MESSAGE =
  "The site is in demo mode, so this form is not connected yet. Please call or WhatsApp us instead.";

/* ------------------------------------------------------------------ */

const enrollmentSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  email,
  phone,
  course_id: uuidOrNull,
  course_title: optional(160),
  udemy_course: optional(300),
  mode: z.enum(["online", "hybrid", "physical"], { message: "Choose a learning mode" }),
  batch_id: uuidOrNull,
  education: optional(160),
  message: optional(2000),
});

export async function submitEnrollment(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { ok: true, message: "Thank you!" };
  const parsed = enrollmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return invalid(formData, fieldErrors(parsed.error));
  }
  if (!parsed.data.course_title) {
    return invalid(formData, { course_id: "Choose a course" }, "Please choose a course.");
  }
  if (!isSupabaseConfigured) return invalid(formData, {}, NOT_CONFIGURED_MESSAGE);

  // udemy_course is only sent when chosen, so enrollments keep working before supabase/14udemy-courses.sql runs
  const { udemy_course, ...rest } = parsed.data;
  const row: Record<string, unknown> = udemy_course ? { ...rest, udemy_course } : rest;
  const { error } = await getPublicClient().from("enrollments").insert(row);
  if (error) {
    console.error("[enrollment]", error.message);
    return invalid(formData, {}, "We could not send your enrollment right now. Please try again or contact us.");
  }
  return {
    ok: true,
    message: "Your enrollment request has been received. Our team will call you within one working day to confirm your seat.",
  };
}

/* ------------------------------------------------------------------ */

const corporateSchema = z.object({
  organization: z.string().trim().min(2, "Enter your organisation name").max(160),
  org_type: z.enum(["corporate", "school", "college", "institution"]),
  contact_name: z.string().trim().min(2, "Enter the contact person's name").max(120),
  email,
  phone,
  program_id: uuidOrNull,
  program_title: optional(160),
  participants: z
    .string()
    .optional()
    .transform((v) => (v ? Number.parseInt(v, 10) : null))
    .refine((v) => v === null || (Number.isFinite(v) && v > 0 && v < 100000), "Enter a valid number"),
  preferred_dates: optional(160),
  message: optional(3000),
});

export async function submitCorporateInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { ok: true, message: "Thank you!" };
  const parsed = corporateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return invalid(formData, fieldErrors(parsed.error));
  }
  if (!isSupabaseConfigured) return invalid(formData, {}, NOT_CONFIGURED_MESSAGE);

  const { error } = await getPublicClient().from("corporate_inquiries").insert(parsed.data);
  if (error) {
    console.error("[corporate]", error.message);
    return invalid(formData, {}, "We could not send your request right now. Please try again or contact us.");
  }
  return { ok: true, message: "Thank you! Our partnerships team will contact you within two working days with a proposal." };
}

/* ------------------------------------------------------------------ */

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email,
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => (v ? v : null)),
  subject: optional(160),
  message: z.string().trim().min(5, "Write a short message").max(3000),
});

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isSpam(formData)) return { ok: true, message: "Thank you!" };
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return invalid(formData, fieldErrors(parsed.error));
  }
  if (!isSupabaseConfigured) return invalid(formData, {}, NOT_CONFIGURED_MESSAGE);

  const { error } = await getPublicClient().from("contact_messages").insert(parsed.data);
  if (error) {
    console.error("[contact]", error.message);
    return invalid(formData, {}, "We could not send your message right now. Please try again or call us.");
  }
  return { ok: true, message: "Thanks for reaching out! We will reply within one working day." };
}
