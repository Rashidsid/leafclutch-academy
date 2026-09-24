import type { Metadata } from "next";
import { BadgeCheck, SearchCheck, ShieldX } from "lucide-react";
import { PageHero } from "@/components/site/sections";
import { verifyCertificate } from "@/lib/data";
import { formatDate, MODE_LABELS } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { LearningMode } from "@/lib/types";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description: "Check that a Leafclutch Academy certificate is genuine using its unique certificate code.",
  alternates: { canonical: "/verify" },
};

type SearchParams = Promise<{ code?: string }>;

export default async function VerifyPage({ searchParams }: { searchParams: SearchParams }) {
  const { code = "" } = await searchParams;
  const trimmed = code.trim().slice(0, 64);
  const result = trimmed ? await verifyCertificate(trimmed) : null;

  return (
    <>
      <PageHero
        eyebrow="Certificate verification"
        title="Verify a certificate"
        description="Enter the certificate code printed on a Leafclutch Academy certificate to confirm that it is genuine."
        breadcrumb={[{ href: "/verify", label: "Verify Certificate" }]}
      />
      <section className="container-x max-w-3xl py-12 sm:py-16">
        <form className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-3 shadow-card sm:flex-row" role="search">
          <label htmlFor="code" className="sr-only">
            Certificate code
          </label>
          <input
            id="code"
            name="code"
            defaultValue={trimmed}
            placeholder="e.g. LCA-2026-0001"
            className="field flex-1 border-0 text-base uppercase shadow-none focus:ring-0"
            autoComplete="off"
            required
            maxLength={64}
          />
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white hover:bg-navy-700">
            <SearchCheck className="size-4" aria-hidden /> Verify
          </button>
        </form>

        {trimmed && result && result.status === "valid" && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-card">
            <div className="flex items-center gap-3 bg-emerald-500 px-6 py-4 text-white">
              <BadgeCheck className="size-6" aria-hidden />
              <p className="font-bold">This certificate is genuine</p>
            </div>
            <dl className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Awarded to</dt>
                <dd className="mt-1 text-xl font-extrabold text-ink">{result.student_name}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Course</dt>
                <dd className="mt-1 text-lg font-bold text-ink">{result.course_title}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Issued on</dt>
                <dd className="mt-1 font-semibold">{formatDate(result.issued_on, { day: "numeric", month: "long", year: "numeric" })}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-muted">Certificate code</dt>
                <dd className="mt-1 font-mono font-semibold">{result.code}</dd>
              </div>
              {result.mode && (
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-muted">Learning mode</dt>
                  <dd className="mt-1 font-semibold">{MODE_LABELS[result.mode as LearningMode] ?? result.mode}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {trimmed && result && result.status === "revoked" && (
          <div className="mt-8 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <ShieldX className="size-6 shrink-0" aria-hidden />
            <p>
              Certificate <strong>{result.code}</strong> was issued to {result.student_name} but has been{" "}
              <strong>revoked</strong>. Please contact us for details.
            </p>
          </div>
        )}

        {trimmed && !result && (
          <div className="mt-8 flex gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
            <ShieldX className="size-6 shrink-0" aria-hidden />
            <div>
              <p className="font-bold">No certificate found for &ldquo;{trimmed}&rdquo;</p>
              <p className="mt-1 text-sm">
                {isSupabaseConfigured
                  ? "Check the code for typing mistakes. If it still does not match, contact us and we will help."
                  : "Certificate verification works once the site is connected to Supabase."}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
