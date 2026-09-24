import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ResourceForm } from "@/components/admin/resource-form";
import { requireAdminPage } from "@/lib/admin/auth";
import { defaultsFor, loadOptions } from "@/lib/admin/queries";
import { getContentResource } from "@/lib/admin/resources";

type Params = Promise<{ resource: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { resource } = await params;
  return { title: `New ${getContentResource(resource)?.singular.toLowerCase() ?? "item"}` };
}

export default async function NewResourcePage({ params }: { params: Params }) {
  const { resource: key } = await params;
  const resource = getContentResource(key);
  if (!resource) notFound();
  const { supabase } = await requireAdminPage();
  const options = await loadOptions(supabase, resource.groups);

  return (
    <>
      <AdminPageHeader title={`New ${resource.singular.toLowerCase()}`} back={{ href: `/admin/${key}`, label: resource.label }} />
      <ResourceForm resourceKey={key} id={null} groups={resource.groups} initial={defaultsFor(key)} options={options} />
    </>
  );
}
