import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ResourceForm } from "@/components/admin/resource-form";
import { EMPTY_SETTINGS } from "@/lib/defaults";
import { requireAdminPage } from "@/lib/admin/auth";
import { settingsGroups } from "@/lib/admin/resources";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <>
      <AdminPageHeader title="Site settings" description="Contact details, home page hero, stats, announcement bar and social links." />
      <ResourceForm resourceKey="settings" id={null} settings groups={settingsGroups} initial={data ?? { ...EMPTY_SETTINGS }} options={{}} />
    </>
  );
}
