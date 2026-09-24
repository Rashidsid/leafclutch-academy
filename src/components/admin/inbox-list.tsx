"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, Download, Inbox, LoaderCircle, Mail, Phone, Search } from "lucide-react";
import { updateSubmission } from "@/app/admin/actions";
import { DeleteButton } from "./row-actions";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatDate, MODE_LABELS, whatsappLink } from "@/lib/format";
import { readPath, type InboxResource, type Option } from "@/lib/admin/resources";
import type { LearningMode } from "@/lib/types";

type Row = Record<string, unknown>;

const STATUS_TONES: Record<string, string> = {
  new: "bg-sky/10 text-sky ring-sky/30",
  contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  read: "bg-amber-50 text-amber-700 ring-amber-200",
  proposal_sent: "bg-violet-50 text-violet-700 ring-violet-200",
  enrolled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  won: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  replied: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

function display(value: unknown, kind?: string) {
  if (value == null || value === "") return null;
  if (kind === "mode") return MODE_LABELS[value as LearningMode] ?? String(value);
  if (kind === "date") return formatDate(String(value));
  return String(value).replace(/_/g, " ");
}

function toCsv(rows: Row[], columns: { name: string; label: string }[]) {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    // Prefix formula-like values so spreadsheets do not execute them
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [columns.map((c) => esc(c.label)).join(","), ...rows.map((r) => columns.map((c) => esc(readPath(r, c.name))).join(","))].join("\r\n");
}

export function InboxList({
  resource,
  rows,
  counts,
  status,
  term,
}: {
  resource: Pick<InboxResource, "key" | "label" | "titleField" | "subtitleFields" | "statuses" | "details">;
  rows: Row[];
  counts: Record<string, number>;
  status: string;
  term: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  function exportCsv() {
    const columns = [
      { name: "created_at", label: "Received" },
      { name: resource.titleField, label: "Name" },
      ...resource.details,
      { name: "status", label: "Status" },
      { name: "admin_notes", label: "Notes" },
    ];
    const blob = new Blob([`﻿${toCsv(rows, columns)}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resource.key}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tab = (value: string, label: string, count: number) => (
    <Link
      key={value || "all"}
      href={`/admin/${resource.key}${value ? `?status=${value}` : ""}`}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
        status === value ? "bg-navy text-white" : "bg-white text-slate-600 ring-1 ring-line hover:text-navy",
      )}
    >
      {label} <span className={cn("ml-1 text-xs", status === value ? "text-white/70" : "text-muted")}>{count}</span>
    </Link>
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {tab("", "All", total)}
          {resource.statuses.map((s) => tab(s.value, s.label, counts[s.value] ?? 0))}
        </div>
        <div className="flex gap-2">
          <form className="relative">
            {status && <input type="hidden" name="status" value={status} />}
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input name="q" defaultValue={term} placeholder="Search…" className="field w-56 pl-9" aria-label="Search" />
          </form>
          <button type="button" onClick={exportCsv} disabled={!rows.length} className={buttonClass("outline", "md")}>
            <Download className="size-4" aria-hidden /> CSV
          </button>
        </div>
      </div>

      {rows.length ? (
        <ul className="space-y-2">
          {rows.map((row) => (
            <InboxItem
              key={String(row.id)}
              row={row}
              resource={resource}
              open={openId === row.id}
              onToggle={() => setOpenId(openId === row.id ? null : String(row.id))}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <Inbox className="size-10 text-muted" aria-hidden />
          <p className="mt-3 font-bold">Nothing here</p>
          <p className="text-sm text-muted">New submissions from the website appear here.</p>
        </div>
      )}
    </div>
  );
}

function InboxItem({
  row,
  resource,
  open,
  onToggle,
}: {
  row: Row;
  resource: Pick<InboxResource, "key" | "titleField" | "subtitleFields" | "statuses" | "details">;
  open: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState(String(row.admin_notes ?? ""));
  const [saved, setSaved] = useState(false);
  const id = String(row.id);
  const status = String(row.status);
  const title = String(readPath(row, resource.titleField) ?? "—");
  const subtitle = resource.subtitleFields.map((f) => display(readPath(row, f), f === "mode" ? "mode" : undefined)).filter(Boolean).join(" · ");
  const phone = row.phone ? String(row.phone) : null;
  const email = row.email ? String(row.email) : null;
  const wa = phone ? whatsappLink(phone.replace(/^0+/, "").length === 10 ? `977${phone}` : phone) : null;

  const patch = (p: { status?: string; admin_notes?: string }) =>
    start(async () => {
      const res = await updateSubmission(resource.key, id, p);
      if (!res.ok) return window.alert(res.error);
      if (p.admin_notes !== undefined) setSaved(true);
      router.refresh();
    });

  return (
    <li className={cn("overflow-hidden rounded-2xl border bg-white transition", open ? "border-sky/40 shadow-card" : "border-line")}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 px-4 py-3.5 text-left hover:bg-surface/60">
        {status === "new" && <span className="size-2 shrink-0 rounded-full bg-sky" aria-label="New" />}
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-ink">{title}</p>
          {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        </div>
        <span className={cn("hidden rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 sm:inline", STATUS_TONES[status] ?? STATUS_TONES.closed)}>
          {status.replace(/_/g, " ")}
        </span>
        <span className="hidden shrink-0 text-xs text-muted md:block">{formatDate(String(row.created_at), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-muted transition", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div className="grid gap-6 border-t border-line p-4 sm:p-5 lg:grid-cols-[1.3fr_1fr]">
          <dl className="grid gap-4 sm:grid-cols-2">
            {resource.details.map((d) => {
              const v = display(readPath(row, d.name), d.kind);
              if (!v) return null;
              const long = d.name === "message";
              return (
                <div key={d.name} className={long ? "sm:col-span-2" : ""}>
                  <dt className="text-xs font-bold uppercase tracking-wider text-muted">{d.label}</dt>
                  <dd className={cn("mt-1 text-sm text-ink", long && "whitespace-pre-wrap rounded-xl bg-surface p-3")}>
                    {d.kind === "email" ? (
                      <a href={`mailto:${v}`} className="text-sky hover:underline">{v}</a>
                    ) : d.kind === "phone" ? (
                      <a href={`tel:${v}`} className="text-sky hover:underline">{v}</a>
                    ) : (
                      v
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="space-y-4 rounded-xl bg-surface p-4">
            <div>
              <label className="label" htmlFor={`status-${id}`}>Status</label>
              <div className="flex items-center gap-2">
                <select id={`status-${id}`} className="field" value={status} disabled={pending} onChange={(e) => patch({ status: e.target.value })}>
                  {resource.statuses.map((s: Option) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {pending && <LoaderCircle className="size-4 animate-spin text-sky" aria-hidden />}
              </div>
            </div>
            <div>
              <label className="label" htmlFor={`notes-${id}`}>Internal notes</label>
              <textarea
                id={`notes-${id}`}
                className="field"
                rows={3}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setSaved(false);
                }}
                placeholder="Call outcome, payment received, follow-up date…"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-emerald-600">{saved ? "Notes saved" : ""}</span>
                <button type="button" disabled={pending} onClick={() => patch({ admin_notes: notes })} className={buttonClass("primary", "sm")}>
                  Save notes
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              {phone && (
                <a href={`tel:${phone}`} className={buttonClass("outline", "sm")}>
                  <Phone className="size-4" aria-hidden /> Call
                </a>
              )}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "sm")}>
                  <WhatsappIcon className="size-4 text-whatsapp" /> WhatsApp
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className={buttonClass("outline", "sm")}>
                  <Mail className="size-4" aria-hidden /> Email
                </a>
              )}
              <span className="ml-auto">
                <DeleteButton resourceKey={resource.key} id={id} label={title} compact />
              </span>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
