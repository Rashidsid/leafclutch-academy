import { Database } from "lucide-react";

/** Shown in the admin area until the Supabase environment variables are set. */
export function SetupNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8 shadow-card"}>
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
        <Database className="size-6" aria-hidden />
      </span>
      <h2 className="mt-4 text-xl font-extrabold text-ink">Connect Supabase to use the admin panel</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
        <li>Create a Supabase project.</li>
        <li>
          Run the SQL files in <code className="rounded bg-soft px-1">supabase/</code> in order (1 → 12) in the SQL editor.
        </li>
        <li>
          Copy <code className="rounded bg-soft px-1">.env.example</code> to{" "}
          <code className="rounded bg-soft px-1">.env.local</code> and add your project URL and anon key.
        </li>
        <li>Create your admin user and run <code className="rounded bg-soft px-1">12create-admin.sql</code>.</li>
        <li>Restart the dev server.</li>
      </ol>
      <p className="mt-4 text-xs text-muted">Full instructions are in supabase/README.md.</p>
    </div>
  );
}
