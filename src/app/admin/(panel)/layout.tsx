import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { AdminShell, type NavSection } from "@/components/admin/admin-shell";
import { SetupNotice } from "@/components/admin/setup-notice";
import { signOut } from "@/app/admin/actions";
import { getAdminSession } from "@/lib/admin/auth";
import { getResource, NAV_GROUPS } from "@/lib/admin/resources";
import { buttonClass } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (session.status === "unconfigured") {
    return (
      <main className="min-h-dvh bg-surface px-4 py-16">
        <SetupNotice />
      </main>
    );
  }
  if (session.status === "signed-out") redirect("/admin/login");
  if (session.status === "forbidden") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-surface px-4">
        <div className="max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-card">
          <ShieldAlert className="mx-auto size-10 text-rose-500" aria-hidden />
          <h1 className="mt-4 text-xl font-extrabold">No admin access</h1>
          <p className="mt-2 text-sm text-muted">
            {session.user.email} is signed in but is not an admin. Add it with supabase/12create-admin.sql.
          </p>
          <form action={signOut} className="mt-6">
            <button className={buttonClass("primary")}>Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  // Unread counts for the inbox badges
  const counts = await Promise.all(
    ["enrollments", "corporate_inquiries", "contact_messages"].map(async (table) => {
      const { count } = await session.supabase.from(table).select("id", { count: "exact", head: true }).eq("status", "new");
      return [table, count ?? 0] as const;
    }),
  );
  const newByTable = Object.fromEntries(counts);

  const nav: NavSection[] = NAV_GROUPS.map((g) => ({
    title: g.title,
    items: g.keys.flatMap((key) => {
      const r = getResource(key);
      if (!r) return [];
      return [{ key: r.key, label: r.label, icon: r.icon, badge: r.kind === "inbox" ? newByTable[r.table] : undefined }];
    }),
  }));

  return (
    <AdminShell nav={nav} email={session.user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
