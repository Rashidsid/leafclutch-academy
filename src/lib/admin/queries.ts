import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NEW_COURSE_INSTALLMENTS } from "@/lib/defaults";
import type { ContentResource, Group, Option, OptionSource } from "./resources";

type Row = Record<string, unknown>;

const SOURCES: Record<OptionSource, { table: string; label: string; order: string }> = {
  categories: { table: "categories", label: "name", order: "sort_order" },
  courses: { table: "courses", label: "title", order: "sort_order" },
  mentors: { table: "mentors", label: "name", order: "sort_order" },
  programs: { table: "programs", label: "title", order: "sort_order" },
};

/** Loads dropdown / checkbox options needed by the given field groups. */
export async function loadOptions(supabase: SupabaseClient, groups: Group[]) {
  const needed = new Set<OptionSource>();
  groups.forEach((g) => g.fields.forEach((f) => f.optionsFrom && needed.add(f.optionsFrom)));
  const entries = await Promise.all(
    [...needed].map(async (source) => {
      const s = SOURCES[source];
      const { data } = await supabase.from(s.table).select(`id, ${s.label}`).order(s.order);
      const opts: Option[] = ((data ?? []) as unknown as Row[]).map((r) => ({ value: String(r.id), label: String(r[s.label]) }));
      return [source, opts] as const;
    }),
  );
  return Object.fromEntries(entries) as Partial<Record<OptionSource, Option[]>>;
}

/** Converts a database row into editor values (including many-to-many ids). */
export function rowToValues(resource: ContentResource, row: Row): Row {
  const values: Row = { ...row };
  if (resource.relation) {
    const rel = resource.relation;
    const links = (row[rel.table] as Row[] | undefined) ?? [];
    values[rel.field] = links.map((l) => String(l[rel.otherKey]));
  }
  // numbers are edited as text in inputs
  for (const g of resource.groups) {
    for (const f of g.fields) {
      if (f.type === "select" && typeof values[f.name] === "number") values[f.name] = String(values[f.name]);
    }
  }
  return values;
}

/** Sensible starting values for a new record. */
export function defaultsFor(key: string): Row {
  const today = new Date().toISOString().slice(0, 10);
  const base: Row = { is_published: true, sort_order: 0 };
  switch (key) {
    case "courses":
      return {
        ...base,
        duration: "3 Months",
        modes: ["online", "hybrid", "physical"],
        installments: NEW_COURSE_INSTALLMENTS,
        includes: [],
        tools: [],
        outcomes: [],
        prerequisites: [],
        careers: [],
        curriculum: [],
        faqs: [],
        mentor_ids: [],
        icon: "sparkles",
        accent: "#072069",
        is_featured: false,
        is_ai_integrated: false,
      };
    case "mentors":
      return { ...base, role: "Mentor", expertise: [], course_ids: [] };
    case "batches":
      return { is_published: true, status: "open", mode: "online", start_date: today };
    case "testimonials":
      return { ...base, rating: "5" };
    case "faqs":
      return { ...base, topic: "general" };
    case "programs":
      return { ...base, audience: "corporate", highlights: [], icon: "briefcase" };
    case "certificates":
      return { status: "valid", issued_on: today, code: `LCA-${today.slice(0, 4)}-` };
    default:
      return base;
  }
}
