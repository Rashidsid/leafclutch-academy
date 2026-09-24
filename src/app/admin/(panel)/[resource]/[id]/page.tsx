import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ResourceForm } from "@/components/admin/resource-form";
import { DeleteButton } from "@/components/admin/row-actions";
import { requireAdminPage } from "@/lib/admin/auth";
import { loadOptions, rowToValues } from "@/lib/admin/queries";
import { getContentResource, readPath } from "@/lib/admin/resources";

type Params = Promise<{ resource: string; id: string }>;
type SearchParams = Promise<{ created?: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { resource } = await params;
  return { title: `Edit ${getContentResource(resource)?.singular.toLowerCase() ?? "item"}` };
}

export default async function EditResourcePage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ resource: key, id }, { created }] = await Promise.all([params, searchParams]);
  const resource = getContentResource(key);
  if (!resource || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdminPage();

  const [{ data: row }, options] = await Promise.all([
    supabase.from(resource.table).select(resource.select).eq("id", id).maybeSingle(),
    loadOptions(supabase, resource.groups),
  ]);
  if (!row) notFound();
  const record = row as unknown as Record<string, unknown>;
  const title = String(readPath(record, resource.titleField) ?? resource.singular);

  return (
    <>
      <AdminPageHeader
        title={title}
        description={`Edit ${resource.singular.toLowerCase()}`}
        back={{ href: `/admin/${key}`, label: resource.label }}
        actions={<DeleteButton resourceKey={key} id={id} label={title} redirectTo={`/admin/${key}`} />}
      />
      {created && (
        <p className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200" role="status">
          <CircleCheck className="size-4" aria-hidden /> {resource.singular} created.
        </p>
      )}
      <ResourceForm
        resourceKey={key}
        id={id}
        groups={resource.groups}
        initial={rowToValues(resource, record)}
        options={options}
        publicUrl={resource.publicPath?.(record) ?? null}
      />
    </>
  );
}
