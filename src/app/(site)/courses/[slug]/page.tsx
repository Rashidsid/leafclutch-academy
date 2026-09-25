import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock,
  Download,
  Gift,
  Laptop,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import { CertificateSample } from "@/components/site/certificate-sample";
import { CourseCard } from "@/components/site/course-card";
import { CourseCover } from "@/components/site/course-cover";
import { Curriculum } from "@/components/site/curriculum";
import { CtaBand, FaqList, IncludesGrid } from "@/components/site/sections";
import { ModePriceCard } from "@/components/site/mode-price-card";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { UdemyOfferCard, UdemySection } from "@/components/site/udemy-offer";
import { Reveal } from "@/components/ui/motion";
import { toLite } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { getBatches, getCourseBySlug, getCourses, getSettings, getTestimonials, ratingsByCourse } from "@/lib/data";
import { BATCH_STATUS, formatDate, formatNpr, initials, MODE_DETAILS, MODE_LABELS } from "@/lib/format";
import { hasVariablePricing, lowestPrice, modePrices } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  const title = course.seo_title || `${course.title} Training in Nepal`;
  const description =
    course.seo_description ||
    `${course.subtitle ?? ""} ${course.duration}, from ${formatNpr(lowestPrice(course).final)}. Online, Hybrid or Physical at Leafclutch Academy.`.trim();
  return {
    title,
    description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { title, description, images: course.thumbnail_url ? [course.thumbnail_url] : undefined },
  };
}

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "fees", label: "Fees & modes" },
  { id: "mentors", label: "Mentors" },
  { id: "certificate", label: "Certificate" },
  { id: "faq", label: "FAQ" },
];

function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-2xl font-bold tracking-tight text-ink sm:text-[28px]", className)}>{children}</h2>;
}

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const [settings, allCourses, testimonials, batches] = await Promise.all([
    getSettings(),
    getCourses(),
    getTestimonials(),
    getBatches(),
  ]);

  const courseTestimonials = testimonials.filter((t) => t.course_id === course.id);
  const rating = ratingsByCourse(testimonials).get(course.id);
  const courseBatches = batches.filter((b) => b.course_id === course.id);
  const related = [
    ...allCourses.filter((c) => c.id !== course.id && c.category_id === course.category_id),
    ...allCourses.filter((c) => c.id !== course.id && c.category_id !== course.category_id),
  ].slice(0, 4);
  const prices = modePrices(course);
  const from = lowestPrice(course);
  const variable = hasVariablePricing(course);
  const firstInstallment = course.installments[0];
  const startAmount = firstInstallment ? Math.round((from.final * firstInstallment.percent) / 100) : null;
  const paragraphs = (course.description ?? "").split(/\n\s*\n/).filter(Boolean);
  const pdfHref = `/courses/${course.slug}/syllabus`;
  const modes = course.modes.map((m) => MODE_LABELS[m]);
  const modeText = modes.length > 1 ? `${modes.slice(0, -1).join(", ")} & ${modes.at(-1)}` : (modes[0] ?? "");
  const verifyUrl = `${SITE_URL.replace(/^https?:\/\//, "")}/verify`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle ?? course.description ?? undefined,
    url: `${SITE_URL}/courses/${course.slug}`,
    provider: { "@type": "Organization", name: settings.site_name, sameAs: "https://leafclutch.com.np" },
    offers: prices.map((p) => ({ "@type": "Offer", name: MODE_LABELS[p.mode], price: p.final, priceCurrency: "NPR", category: "Paid" })),
    hasCourseInstance: course.modes.map((m) => ({
      "@type": "CourseInstance",
      courseMode: m === "physical" ? "Onsite" : m === "online" ? "Online" : "Blended",
      courseWorkload: "P3M",
    })),
    ...(rating && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: rating.average.toFixed(1), reviewCount: rating.count },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so admin-entered text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="animate-drift absolute -top-32 -right-24 size-[28rem] rounded-full bg-navy-700" aria-hidden />
        <div className="absolute -bottom-40 -left-24 size-96 rounded-full border-[48px] border-navy-700/60" aria-hidden />

        <div className="container-x relative grid items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-16">
          <div className="animate-fade-up">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/75">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden><ChevronRight className="size-4" /></li>
                {course.category ? (
                  <li>
                    <Link href={`/courses?category=${course.category.slug}`} className="hover:text-white">
                      {course.category.name}
                    </Link>
                  </li>
                ) : (
                  <li><Link href="/courses" className="hover:text-white">Courses</Link></li>
                )}
                <li aria-hidden><ChevronRight className="size-4" /></li>
                <li className="font-semibold text-white">{course.title}</li>
              </ol>
            </nav>

            <div className="flex flex-wrap gap-2">
              {course.is_ai_integrated && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-extrabold tracking-wide text-navy-900 uppercase">
                  <Sparkles className="size-3.5" aria-hidden /> AI Integrated Course
                </span>
              )}
              {course.badge && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide uppercase ring-1 ring-white/25">
                  {course.badge}
                </span>
              )}
              <a
                href={course.udemy_courses.length ? "#udemy" : `/enroll?course=${course.slug}`}
                className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-extrabold tracking-wide text-navy uppercase [animation-duration:2.5s] hover:animate-none"
              >
                <Gift className="size-3.5 text-sky" aria-hidden /> Includes a free Udemy course
              </a>
            </div>

            <h1 className="mt-4 text-balance text-3xl leading-tight font-bold tracking-tight sm:text-5xl sm:leading-[1.12]">
              {course.title} Training in Nepal
            </h1>
            {course.subtitle && <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">{course.subtitle}</p>}

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[15px] font-semibold">
              <li className="flex items-center gap-2">
                <CalendarDays className="size-5 text-mint" aria-hidden /> {course.duration}
              </li>
              <li className="flex items-center gap-2">
                <Laptop className="size-5 text-mint" aria-hidden /> Mode: {modeText} Live Classes
              </li>
              {course.level && (
                <li className="flex items-center gap-2">
                  <BarChart3 className="size-5 text-mint" aria-hidden /> {course.level}
                </li>
              )}
              {rating && (
                <li className="flex items-center gap-2">
                  <Star className="size-5 fill-amber-400 text-amber-400" aria-hidden /> {rating.average.toFixed(1)} ({rating.count})
                </li>
              )}
            </ul>

            {course.mentors && course.mentors.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {course.mentors.slice(0, 4).map((m) =>
                    m.photo_url ? (
                      <img key={m.id} src={m.photo_url} alt="" className="size-11 rounded-full object-cover object-top ring-2 ring-white" />
                    ) : (
                      <span key={m.id} className="inline-flex size-11 items-center justify-center rounded-full bg-sky text-sm font-bold ring-2 ring-white">
                        {initials(m.name)}
                      </span>
                    ),
                  )}
                </div>
                <p className="text-[15px] font-medium text-white/90">
                  Learn directly from{" "}
                  <a href="#mentors" className="font-bold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                    {course.mentors.map((m) => m.name).join(", ")}
                  </a>
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/contact?course=${course.slug}`}
                className="shine inline-flex h-13 items-center gap-2 rounded-xl bg-sky px-6 text-[15px] font-extrabold tracking-wide text-white uppercase shadow-lift transition hover:-translate-y-0.5 hover:bg-cyan"
              >
                Send inquiry <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={`/enroll?course=${course.slug}`}
                className="inline-flex h-13 items-center rounded-xl px-5 text-[15px] font-extrabold tracking-wide uppercase ring-1 ring-white/40 transition hover:bg-white hover:text-navy"
              >
                Enroll now
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="rounded-3xl bg-white p-3 shadow-2xl transition duration-500 hover:-rotate-1">
              <CourseCover course={course} size="hero" />
            </div>
            <div className="animate-float absolute -bottom-5 left-4 rounded-2xl bg-white px-4 py-3 text-navy shadow-lift sm:left-8">
              <p className="text-[11px] font-bold tracking-wider text-muted uppercase">{variable ? "Fee from" : "Total fee"}</p>
              <p className="text-xl font-extrabold">
                {formatNpr(from.final)}
                {from.discount > 0 && <s className="ml-2 text-sm font-semibold text-muted">{formatNpr(from.price)}</s>}
              </p>
              {from.discount > 0 && (
                <span className="mt-1 inline-block rounded bg-emerald-600 px-1.5 text-[11px] font-extrabold text-white">{from.discount}% OFF</span>
              )}
            </div>
            {startAmount !== null && (
              <div className="animate-float absolute -top-4 right-4 rounded-2xl bg-mint px-4 py-2.5 text-navy-900 shadow-lift [animation-delay:1.5s] sm:right-8">
                <p className="text-[11px] font-bold tracking-wider uppercase">Start with</p>
                <p className="text-lg font-extrabold">{formatNpr(startAmount)}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Section tabs */}
      <div className="sticky top-19 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-4">
          <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto" aria-label="Course sections">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="shrink-0 border-b-[3px] border-transparent px-2.5 py-3.5 text-[15px] font-semibold text-slate-600 transition hover:border-navy hover:text-navy"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a href={pdfHref} download className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-navy hover:underline md:inline-flex">
            <Download className="size-4" aria-hidden /> Syllabus PDF
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------ Body */}
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_340px] lg:gap-12 lg:py-14">
        <div className="min-w-0 space-y-14">
          {/* Overview */}
          <section id="overview" className="scroll-mt-36">
            {(course.updated_at || course.created_at) && (
              <div className="mb-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                {course.updated_at && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1.5 ring-1 ring-line">
                    <Clock className="size-3.5" aria-hidden /> Updated on {formatDate(course.updated_at)}
                  </span>
                )}
                {course.created_at && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2.5 py-1.5 ring-1 ring-line">
                    <CalendarDays className="size-3.5" aria-hidden /> Created on {formatDate(course.created_at)}
                  </span>
                )}
              </div>
            )}
            <H2>Course overview</H2>
            <div className="prose-lc mt-4 text-[16px]">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {course.outcomes.length > 0 && (
            <Reveal>
              <section className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
                <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                  <Target className="size-5 text-navy" aria-hidden /> What you will learn
                </h2>
                <ul className="mt-5 grid gap-3.5 sm:grid-cols-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-[15px] leading-6 text-slate-700">
                      <CircleCheck className="mt-0.5 size-5 shrink-0 text-leaf" aria-hidden /> {o}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {course.tools.length > 0 && (
            <Reveal>
              <section>
                <H2>Tools covered</H2>
                <p className="mt-2 text-[15px] text-slate-600">Some of the major industry-relevant tools you will work with in this course:</p>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {course.tools.map((t) => (
                    <li
                      key={t}
                      className="rounded-lg bg-tint px-3.5 py-2 text-sm font-semibold text-navy ring-1 ring-navy/10 transition duration-300 hover:-translate-y-0.5 hover:bg-navy hover:text-white"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {course.curriculum.length > 0 && (
            <section id="curriculum" className="scroll-mt-36">
              <H2>Curriculum</H2>
              <p className="mt-2 mb-6 text-[15px] leading-7 text-slate-600">
                The complete syllabus for {course.title}: every lesson, section and topic you will cover. Download it as a PDF to
                read offline or share it.
              </p>
              <Curriculum lessons={course.curriculum} pdfHref={pdfHref} />
            </section>
          )}

          {(course.includes.length > 0 || course.udemy_courses.length > 0) && (
            <section className="space-y-6">
              <H2>What you get</H2>
              {course.includes.length > 0 && (
                <Reveal>
                  <IncludesGrid items={course.includes} />
                </Reveal>
              )}
              <UdemySection courses={course.udemy_courses} courseTitle={course.title} />
            </section>
          )}

          {/* Fees & modes */}
          <section id="fees" className="scroll-mt-36">
            <H2>Fees & payment plan</H2>
            <p className="mt-2 text-[15px] text-slate-600">
              {course.duration} program. Choose the class type that suits you. The curriculum, mentors, recordings and certificate
              are the same in every mode.
            </p>

            {/* Price per learning mode */}
            <div className={cn("mt-6 grid gap-4", prices.length >= 3 ? "sm:grid-cols-3" : prices.length === 2 ? "sm:grid-cols-2" : "")}>
              {prices.map((p, i) => (
                <Reveal
                  key={p.mode}
                  delay={i * 100}
                  className="relative overflow-hidden rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-navy/30 hover:shadow-lift"
                >
                  {p.discount > 0 && (
                    <span className="absolute top-4 right-4 rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-extrabold text-white">
                      {p.discount}% OFF
                    </span>
                  )}
                  <p className="text-sm font-bold tracking-wider text-navy uppercase">{MODE_LABELS[p.mode]}</p>
                  <p className="mt-1 text-xs text-muted">{MODE_DETAILS[p.mode].summary}</p>
                  <p className="mt-4 text-2xl font-extrabold text-ink">{formatNpr(p.final)}</p>
                  {p.discount > 0 && <s className="text-sm text-muted">{formatNpr(p.price)}</s>}
                  <Link
                    href={`/enroll?course=${course.slug}&mode=${p.mode}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-navy hover:underline"
                  >
                    Enroll {MODE_LABELS[p.mode].toLowerCase()} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* Installments per mode */}
            {course.installments.length > 0 && (
              <Reveal className="mt-6 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-130 text-left text-sm">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Payment plan</th>
                      {prices.map((p) => (
                        <th key={p.mode} className="px-5 py-3.5 text-right font-bold">
                          {MODE_LABELS[p.mode]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {course.installments.map((ins) => (
                      <tr key={ins.label}>
                        <td className="px-5 py-4">
                          <p className="font-bold text-ink">
                            {ins.label} <span className="font-medium text-muted">({ins.percent}%)</span>
                          </p>
                          <p className="text-xs text-muted">{ins.note}</p>
                        </td>
                        {prices.map((p) => (
                          <td key={p.mode} className="px-5 py-4 text-right font-extrabold whitespace-nowrap text-navy">
                            {formatNpr(Math.round((p.final * ins.percent) / 100))}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-surface">
                      <td className="px-5 py-3.5 font-bold text-ink">Total</td>
                      {prices.map((p) => (
                        <td key={p.mode} className="px-5 py-3.5 text-right font-extrabold whitespace-nowrap text-ink">
                          {formatNpr(p.final)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </Reveal>
            )}
          </section>

          {courseBatches.length > 0 && (
            <section>
              <H2>Upcoming batches</H2>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-surface text-xs tracking-wider text-muted uppercase">
                    <tr>
                      <th className="px-5 py-3 font-bold">Starts</th>
                      <th className="px-5 py-3 font-bold">Mode</th>
                      <th className="px-5 py-3 font-bold">Schedule</th>
                      <th className="px-5 py-3 font-bold">Status</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {courseBatches.map((b) => (
                      <tr key={b.id} className="transition hover:bg-surface">
                        <td className="px-5 py-4 font-bold text-ink">{formatDate(b.start_date)}</td>
                        <td className="px-5 py-4">{MODE_LABELS[b.mode]}</td>
                        <td className="px-5 py-4 text-slate-600">{b.schedule ?? "To be announced"}</td>
                        <td className="px-5 py-4">
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1", BATCH_STATUS[b.status].tone)}>
                            {BATCH_STATUS[b.status].label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {b.status !== "full" && (
                            <Link href={`/enroll?course=${course.slug}&mode=${b.mode}&batch=${b.id}`} className="font-bold text-navy hover:underline">
                              Enroll
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {course.mentors && course.mentors.length > 0 && (
            <section id="mentors" className="scroll-mt-36">
              <H2>Your {course.mentors.length > 1 ? "mentors" : "mentor"}</H2>
              <div className="mt-6 space-y-4">
                {course.mentors.map((m) => (
                  <Reveal key={m.id} className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 transition hover:shadow-card sm:flex-row">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="size-28 shrink-0 rounded-2xl object-cover object-top" />
                    ) : (
                      <span className="inline-flex size-28 shrink-0 items-center justify-center rounded-2xl bg-tint text-3xl font-extrabold text-navy">
                        {initials(m.name)}
                      </span>
                    )}
                    <div>
                      <p className="text-lg font-bold text-ink">{m.name}</p>
                      <p className="text-sm font-semibold text-navy">{m.role}</p>
                      {m.bio && <p className="mt-2 text-[15px] leading-6 text-slate-600">{m.bio}</p>}
                      {m.expertise.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {m.expertise.map((x) => (
                            <span key={x} className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-navy">
                              {x}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {(course.prerequisites.length > 0 || course.careers.length > 0) && (
            <Reveal className="grid gap-6 md:grid-cols-2">
              {course.prerequisites.length > 0 && (
                <div className="rounded-2xl border border-line p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Users className="size-5 text-navy" aria-hidden /> Who can join
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {course.prerequisites.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-slate-600">
                        <CircleCheck className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {course.careers.length > 0 && (
                <div className="rounded-2xl border border-line p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <Briefcase className="size-5 text-navy" aria-hidden /> Career opportunities
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {course.careers.map((c) => (
                      <li key={c} className="rounded-lg bg-tint px-3 py-1.5 text-sm font-semibold text-navy">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          )}
        </div>

        {/* ------------------------------------------------------------ Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-36 lg:self-start">
          <ModePriceCard prices={prices} installments={course.installments} courseSlug={course.slug} />

          <UdemyOfferCard courseTitle={course.title} courseSlug={course.slug} count={course.udemy_courses.length} />
        </aside>
      </div>

      {/* ------------------------------------------------------------ Testimonials */}
      {courseTestimonials.length > 0 && (
        <section className="container-x pb-14">
          <H2 className="mb-8">What learners say about {course.title}</H2>
          <Reveal>
            <TestimonialCarousel items={courseTestimonials} />
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------------ Certificate */}
      <section id="certificate" className="scroll-mt-32 bg-tint py-14 sm:py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left" className="rounded-2xl bg-white p-7 shadow-card sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">Earn a high-value industry certificate</h2>
            <p className="mt-4 text-[16px] leading-7 text-slate-600">
              Complete {course.title} and receive a certificate from {settings.site_name}. Add it to your LinkedIn profile,
              resume or CV to stand out to recruiters. Every certificate carries a unique code that employers can check online.
            </p>
            <p className="mt-5 text-[15px] text-slate-700">
              Already earned a certificate?{" "}
              <Link href="/verify" className="font-bold text-navy underline underline-offset-4 hover:text-sky">
                Verify it here
              </Link>
            </p>
          </Reveal>
          <Reveal variant="zoom" delay={150}>
            <div className="mx-auto max-w-xl rotate-2 transition duration-500 hover:rotate-0 hover:scale-[1.02]">
              <CertificateSample imageUrl={settings.certificate_image_url} siteName={settings.site_name} verifyUrl={verifyUrl} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Related courses */}
      {related.length > 0 && (
        <section className="container-x py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <H2>Related courses</H2>
              <p className="mt-1 text-[15px] text-muted">Learners who viewed {course.title} also showed interest in these courses.</p>
            </div>
            <Link href="/courses" className="hidden shrink-0 items-center gap-1 text-sm font-bold text-navy hover:underline sm:inline-flex">
              View all courses <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c, i) => (
              <Reveal key={c.id} delay={i * 100}>
                <CourseCard course={toLite(c)} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ FAQ */}
      {course.faqs.length > 0 && (
        <section id="faq" className="scroll-mt-32 bg-surface py-14">
          <div className="container-x">
            <H2 className="mb-8 text-center">Frequently asked questions</H2>
            <Reveal>
              <FaqList items={course.faqs} className="mx-auto max-w-3xl" />
            </Reveal>
          </div>
        </section>
      )}

      <CtaBand title={`Start ${course.title} this month`} whatsapp={settings.whatsapp} />
    </>
  );
}
