import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Plus, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { InboxList } from "@/components/admin/inbox-list";
import { DeleteButton, PublishToggle } from "@/components/admin/row-actions";
import { buttonClass } from "@/components/ui/button";
import { requireAdminPage } from "@/lib/admin/auth";
import { getResource, readPath, type Column, type ContentResource, type InboxResource } from "@/lib/admin/resources";
import { formatDate, formatNpr, MODE_LABELS } from "@/lib/format";
import type { LearningMode } from "@/lib/types";

type Params = Promise<{ resource: string }>;
type SearchParams = Promise<{ q?: string; status?: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { resource } = await params;
  return { title: getResource(resource)?.label ?? "Admin" };
}

/** Escape characters that have meaning inside a PostgREST or() filter. */
const safeTerm = (q: string) => q.replace(/[%,()*\\]/g, " ").trim().slice(0, 80);

export default async function ResourceListPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ resource: key }, { q = "", status = "" }] = await Promise.all([params, searchParams]);
  const resource = getResource(key);
  if (!resource) notFound();
  const { supabase } = await requireAdminPage();
  const term = safeTerm(q);

  if (resource.kind === "inbox") return <InboxPage resource={resource} term={term} status={status} supabase={supabase} />;

  let query = supabase.from(resource.table).select(resource.select);
  for (const o of resource.order) query = query.order(o.column, { ascending: o.ascending ?? true });
  if (term) query = query.or(resource.searchFields.map((f) => `${f}.ilike.%${term}%`).join(","));
  const { data, error } = await query.limit(500);
  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const hasPublish = resource.groups.some((g) => g.fields.some((f) => f.name === "is_published"));

  return (
    <>
      <AdminPageHeader
        title={resource.label}
        description={resource.description}
        actions={
          <Link href={`/admin/${resource.key}/new`} className={buttonClass("primary", "md")}>
            <Plus className="size-4" aria-hidden /> New {resource.singular.toLowerCase()}
          </Link>
        }
      />

      <form className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input name="q" defaultValue={q} placeholder={`Search ${resource.label.toLowerCase()}…`} className="field pl-9" aria-label="Search" />
      </form>

      {error && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">Could not load: {error.message}</p>}

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-xs">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              {resource.columns.map((c) => (
                <th key={c.name} className="px-4 py-3 font-bold">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => {
              const id = String(row.id);
              const title = String(readPath(row, resource.titleField) ?? "Untitled");
              return (
                <tr key={id} className="hover:bg-surface/60">
                  {resource.columns.map((c, i) => (
                    <td key={c.name} className="px-4 py-3 align-middle">
                      {c.name === "is_published" && hasPublish ? (
                        <PublishToggle resourceKey={resource.key} id={id} value={row.is_published === true} />
                      ) : i === firstTextColumn(resource) ? (
                        <Link href={`/admin/${resource.key}/${id}`} className="font-semibold text-ink hover:text-navy hover:underline">
                          <Cell column={c} row={row} />
                        </Link>
                      ) : (
                        <Cell column={c} row={row} />
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/${resource.key}/${id}`}
                        aria-label={`Edit ${title}`}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-tint hover:text-navy"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteButton resourceKey={resource.key} id={id} label={title} compact />
                    </div>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={resource.columns.length + 1} className="px-4 py-12 text-center text-muted">
                  {term ? "Nothing matches your search." : `No ${resource.label.toLowerCase()} yet.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">{rows.length} {rows.length === 1 ? "item" : "items"}</p>
    </>
  );
}

function firstTextColumn(resource: ContentResource) {
  return resource.columns.findIndex((c) => !c.kind || c.kind === "text");
}

function Cell({ column, row }: { column: Column; row: Record<string, unknown> }) {
  const v = readPath(row, column.name);
  switch (column.kind) {
    case "image":
      return v ? (
        <img src={String(v)} alt="" className="size-10 rounded-lg object-cover" />
      ) : (
        <span className="block size-10 rounded-lg bg-soft" />
      );
    case "money":
      return <span className="font-semibold text-navy">{formatNpr(Number(v ?? 0))}</span>;
    case "bool":
      return v ? <span className="text-emerald-600">Yes</span> : <span className="text-muted">No</span>;
    case "date":
      return <span>{v ? formatDate(String(v)) : "—"}</span>;
    case "mode":
      return <span>{MODE_LABELS[v as LearningMode] ?? String(v ?? "—")}</span>;
    case "badge":
      return v ? <span className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-navy">{String(v).replace(/_/g, " ")}</span> : <span className="text-muted">—</span>;
    default:
      return <span>{v == null || v === "" ? "—" : String(v)}</span>;
  }
}

/* ------------------------------------------------------------------ */

async function InboxPage({
  resource,
  term,
  status,
  supabase,
}: {
  resource: InboxResource;
  term: string;
  status: string;
  supabase: Awaited<ReturnType<typeof requireAdminPage>>["supabase"];
}) {
  let query = supabase.from(resource.table).select(resource.select).order("created_at", { ascending: false });
  if (status && resource.statuses.some((s) => s.value === status)) query = query.eq("status", status);
  if (term) query = query.or(resource.searchFields.map((f) => `${f}.ilike.%${term}%`).join(","));
  const { data, error } = await query.limit(500);

  const counts = await Promise.all(
    resource.statuses.map(async (s) => {
      const { count } = await supabase.from(resource.table).select("id", { count: "exact", head: true }).eq("status", s.value);
      return [s.value, count ?? 0] as const;
    }),
  );

  return (
    <>
      <AdminPageHeader title={resource.label} description={resource.description} />
      {error && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">Could not load: {error.message}</p>}
      <InboxList
        resource={{
          key: resource.key,
          label: resource.label,
          titleField: resource.titleField,
          subtitleFields: resource.subtitleFields,
          statuses: resource.statuses,
          details: resource.details,
        }}
        rows={(data ?? []) as unknown as Record<string, unknown>[]}
        counts={Object.fromEntries(counts)}
        status={status}
        term={term}
      />
    </>
  );
}
