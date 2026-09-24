import Link from "next/link";
import { ArrowRight, BookOpen, Building2, CalendarDays, Mail, Plus, Quote, UserPlus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { buttonClass } from "@/components/ui/button";
import { requireAdminPage } from "@/lib/admin/auth";
import { formatDate, MODE_LABELS } from "@/lib/format";
import type { LearningMode } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { supabase, user } = await requireAdminPage();
  const count = async (table: string, filter?: [string, string | boolean]) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count } = await q;
    return count ?? 0;
  };

  const today = new Date().toISOString().slice(0, 10);
  const [courses, newEnrollments, totalEnrollments, newInquiries, newMessages, testimonials, recent, upcoming] = await Promise.all([
    count("courses", ["is_published", true]),
    count("enrollments", ["status", "new"]),
    count("enrollments"),
    count("corporate_inquiries", ["status", "new"]),
    count("contact_messages", ["status", "new"]),
    count("testimonials", ["is_published", true]),
    supabase.from("enrollments").select("id, full_name, course_title, mode, status, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("batches").select("id, start_date, mode, status, course:courses(title)").gte("start_date", today).order("start_date").limit(5),
  ]);

  const cards = [
    { label: "New enrollments", value: newEnrollments, sub: `${totalEnrollments} total`, href: "/admin/enrollments?status=new", icon: UserPlus, tone: "from-navy to-sky" },
    { label: "Corporate inquiries", value: newInquiries, sub: "awaiting reply", href: "/admin/corporate-inquiries?status=new", icon: Building2, tone: "from-violet-600 to-fuchsia-500" },
    { label: "New messages", value: newMessages, sub: "from contact form", href: "/admin/messages?status=new", icon: Mail, tone: "from-amber-500 to-orange-500" },
    { label: "Live courses", value: courses, sub: `${testimonials} testimonials`, href: "/admin/courses", icon: BookOpen, tone: "from-emerald-600 to-teal-500" },
  ];

  const name = user.email?.split("@")[0] ?? "there";

  return (
    <>
      <AdminPageHeader
        title={`Welcome back, ${name}`}
        description="Here is what is happening at Leafclutch Academy."
        actions={
          <>
            <Link href="/admin/courses/new" className={buttonClass("outline", "md")}>
              <Plus className="size-4" aria-hidden /> Course
            </Link>
            <Link href="/admin/batches/new" className={buttonClass("outline", "md")}>
              <Plus className="size-4" aria-hidden /> Batch
            </Link>
            <Link href="/admin/testimonials/new" className={buttonClass("primary", "md")}>
              <Quote className="size-4" aria-hidden /> Add testimonial
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group rounded-2xl border border-line bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-card">
            <div className="flex items-center justify-between">
              <span className={`inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${c.tone}`}>
                <c.icon className="size-5" aria-hidden />
              </span>
              <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1 group-hover:text-navy" aria-hidden />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-ink">{c.value}</p>
            <p className="text-sm font-semibold text-ink">{c.label}</p>
            <p className="text-xs text-muted">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-line bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-extrabold">Latest enrollments</h2>
            <Link href="/admin/enrollments" className="text-sm font-semibold text-sky hover:text-navy">View all</Link>
          </div>
          <ul className="divide-y divide-line">
            {(recent.data ?? []).map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{e.full_name}</p>
                  <p className="truncate text-xs text-muted">
                    {e.course_title} · {MODE_LABELS[e.mode as LearningMode] ?? e.mode}
                  </p>
                </div>
                <span className="rounded-full bg-tint px-2 py-0.5 text-xs font-semibold capitalize text-navy">{e.status}</span>
                <span className="hidden text-xs text-muted sm:block">{formatDate(e.created_at, { day: "numeric", month: "short" })}</span>
              </li>
            ))}
            {!recent.data?.length && <li className="px-5 py-10 text-center text-sm text-muted">No enrollments yet.</li>}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-extrabold">Upcoming batches</h2>
            <Link href="/admin/batches" className="text-sm font-semibold text-sky hover:text-navy">Manage</Link>
          </div>
          <ul className="divide-y divide-line">
            {(upcoming.data ?? []).map((b) => {
              const course = (Array.isArray(b.course) ? b.course[0] : b.course) as { title: string } | null;
              return (
                <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                  <CalendarDays className="size-5 shrink-0 text-sky" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{course?.title ?? "Course"}</p>
                    <p className="text-xs text-muted">
                      {formatDate(b.start_date)} · {MODE_LABELS[b.mode as LearningMode] ?? b.mode}
                    </p>
                  </div>
                  <span className="text-xs font-semibold capitalize text-muted">{b.status}</span>
                </li>
              );
            })}
            {!upcoming.data?.length && <li className="px-5 py-10 text-center text-sm text-muted">No upcoming batches. Add one so learners can see start dates.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
