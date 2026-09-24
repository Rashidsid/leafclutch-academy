import "server-only";
import { slugify } from "@/lib/format";
import type { Field, Group } from "./resources";

type Values = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const strArray = (v: unknown) =>
  Array.isArray(v) ? v.map(str).filter(Boolean) : typeof v === "string" ? v.split("\n").map((s) => s.trim()).filter(Boolean) : [];

function coerceField(field: Field, raw: unknown, values: Values): unknown {
  switch (field.type) {
    case "switch":
      return raw === true || raw === "true" || raw === "on";
    case "number": {
      const s = str(raw);
      if (!s) return null;
      const n = Number(s);
      if (!Number.isFinite(n)) throw new Error(`${field.label} must be a number.`);
      return n;
    }
    case "slug": {
      const s = slugify(str(raw) || str(values[field.from ?? ""]));
      if (!s) throw new Error(`${field.label} could not be generated. Enter it manually.`);
      return s;
    }
    case "list":
      return strArray(raw);
    case "modes": {
      const allowed = new Set(["online", "hybrid", "physical"]);
      const modes = strArray(raw).filter((m) => allowed.has(m));
      if (!modes.length) throw new Error("Choose at least one learning mode.");
      return modes;
    }
    case "curriculum":
      return (Array.isArray(raw) ? raw : [])
        .map((m) => {
          const lesson = m as Values;
          const sections = (Array.isArray(lesson?.sections) ? lesson.sections : [])
            .map((s) => ({ title: str((s as Values)?.title), points: strArray((s as Values)?.points) }))
            .filter((s) => s.title || s.points.length);
          // Older flat lessons keep working: their topics become one untitled section
          const topics = strArray(lesson?.topics);
          if (!sections.length && topics.length) sections.push({ title: "", points: topics });
          return { title: str(lesson?.title), sections };
        })
        .filter((m) => m.title);
    case "faqs":
      return (Array.isArray(raw) ? raw : [])
        .map((f) => ({ question: str((f as Values)?.question), answer: str((f as Values)?.answer) }))
        .filter((f) => f.question && f.answer);
    case "installments": {
      const items = (Array.isArray(raw) ? raw : [])
        .map((i) => ({
          label: str((i as Values)?.label),
          percent: Number((i as Values)?.percent) || 0,
          note: str((i as Values)?.note),
        }))
        .filter((i) => i.label);
      const total = items.reduce((n, i) => n + i.percent, 0);
      if (items.length && Math.round(total) !== 100) throw new Error(`Payment plan percentages add up to ${total}%. They must total 100%.`);
      return items;
    }
    case "stats":
      return (Array.isArray(raw) ? raw : [])
        .map((s) => ({ value: str((s as Values)?.value), label: str((s as Values)?.label) }))
        .filter((s) => s.value && s.label);
    case "select": {
      const s = str(raw);
      if (!s) return null;
      if (field.options && !field.options.some((o) => o.value === s)) throw new Error(`Invalid value for ${field.label}.`);
      // rating is stored as a number
      return field.name === "rating" ? Number(s) : s;
    }
    default: {
      const s = str(raw);
      return s || null;
    }
  }
}

/** Turns editor values into a clean row for the given field groups. */
export function buildPayload(groups: Group[], values: Values) {
  const row: Values = {};
  for (const group of groups) {
    for (const field of group.fields) {
      if (field.type === "relation") continue;
      const value = coerceField(field, values[field.name], values);
      const empty = value === null || (Array.isArray(value) && !value.length && field.type !== "list");
      if (field.required && empty) throw new Error(`${field.label} is required.`);
      if (field.type === "number" && value === null && field.name === "sort_order") {
        row[field.name] = 0;
        continue;
      }
      row[field.name] = value;
    }
  }
  return row;
}
