import type { BatchStatus, LearningMode, ProgramAudience } from "./types";

export function formatNpr(amount: number) {
  return `Rs. ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatDate(value: string | Date, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  const d = typeof value === "string" ? new Date(value.length === 10 ? `${value}T00:00:00` : value) : value;
  return new Intl.DateTimeFormat("en-GB", opts).format(d);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const MODE_LABELS: Record<LearningMode, string> = {
  online: "Online",
  hybrid: "Hybrid",
  physical: "Physical",
};

export const MODE_DETAILS: Record<LearningMode, { title: string; summary: string; points: string[] }> = {
  online: {
    title: "Online",
    summary: "Live, interactive classes over video, from anywhere in Nepal or abroad.",
    points: ["Live sessions with your mentor", "Screen sharing and pair programming", "Recording of every class"],
  },
  hybrid: {
    title: "Hybrid",
    summary: "Mix both: join the lab when you can and log in live when you cannot.",
    points: ["Switch between lab and online", "Same batch, same mentor", "Recording of every class"],
  },
  physical: {
    title: "Physical",
    summary: "In-person classes at our lab in Siddharthanagar, Rupandehi.",
    points: ["Face-to-face mentoring", "Lab computers and team projects", "Recording of every class"],
  },
};

export const BATCH_STATUS: Record<BatchStatus, { label: string; tone: string }> = {
  open: { label: "Seats open", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  filling: { label: "Filling fast", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
  full: { label: "Batch full", tone: "bg-rose-50 text-rose-700 ring-rose-200" },
  closed: { label: "Closed", tone: "bg-slate-100 text-slate-600 ring-slate-200" },
};

export const AUDIENCE_LABELS: Record<ProgramAudience, string> = {
  corporate: "Companies",
  school: "Schools",
  college: "Colleges",
  institution: "Institutes",
};

export function whatsappLink(number: string | null | undefined, text?: string) {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
