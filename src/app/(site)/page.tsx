import Link from "next/link";
import { ArrowRight, Award, Briefcase, Building2, CircleCheck, Rocket, Wallet } from "lucide-react";
import { CourseRow } from "@/components/site/course-card";
import { CourseTabsBand, type BandTab } from "@/components/site/course-tabs-band";
import { HeroCarousel, type HeroSlide } from "@/components/site/hero-carousel";
import { CtaBand, FaqList, Journey } from "@/components/site/sections";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { CountUp, Reveal } from "@/components/ui/motion";
import {
  beginnerFriendly,
  coursesForCareerFilled,
  newCourses,
  popularCourses,
  toLite,
  topCareers,
  topSkills,
} from "@/lib/catalog";
import {
  getCategories,
  getCourses,
  getFaqs,
  getPartners,
  getSettings,
  getTestimonials,
  ratingsByCourse,
} from "@/lib/data";
import { IconByName } from "@/lib/icons";

export const revalidate = 300;

function SectionTitle({ children, href, action }: { children: React.ReactNode; href?: string; action?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{children}</h2>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-navy hover:underline">
          {action ?? "View all"} <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [settings, categories, courses, testimonials, faqs, partners] = await Promise.all([
    getSettings(),
    getCategories(),
    getCourses(),
    getTestimonials(),
    getFaqs(),
    getPartners(),
  ]);

  const ratings = Object.fromEntries(ratingsByCourse(testimonials));
  const lite = courses.map(toLite);
  const liteById = new Map(lite.map((c) => [c.id, c]));
  const L = (list: typeof courses) => list.map((c) => liteById.get(c.id)!);

  const heroTitle = [settings.hero_title, settings.hero_highlight].filter(Boolean).join(" ");
  const slides: HeroSlide[] = [
    {
      id: "ai",
      theme: "dark",
      art: "ai",
      title: heroTitle || "Build job-ready skills for the AI era",
      text: "Agentic AI, Generative AI, AI/ML and Data programs taught by practitioners, for every level.",
      cta: { href: "/courses?category=ai-data", label: "Explore AI courses" },
    },
    {
      id: "career",
      theme: "blue",
      art: "career",
      title: "Start, switch, or advance your career",
      text: settings.hero_subtitle ?? "Three-month, project-based programs with an internship pathway.",
      cta: { href: "/enroll", label: "Enroll now" },
    },
    {
      id: "teams",
      theme: "light",
      art: "teams",
      title: "Upskill your team, school or campus",
      text: "Corporate training, school campaigns and college bootcamps designed around your goals.",
      cta: { href: "/corporate", label: "Request a proposal" },
    },
    {
      id: "modes",
      theme: "mint",
      art: "modes",
      title: "Online, Hybrid or Physical. Same fee.",
      text: "Learn the way that suits you, with a recording of every class.",
      cta: { href: "/schedule", label: "See upcoming classes" },
    },
  ];

  const careerTabs: BandTab[] = topCareers(courses, 6)
    .map((career) => ({ label: career, courses: L(coursesForCareerFilled(courses, career)) }))
    .filter((t) => t.courses.length > 0);

  const categoryTabs: BandTab[] = categories
    .map((cat) => ({
      label: cat.name,
      courses: L(courses.filter((c) => c.category_id === cat.id && beginnerFriendly(c))),
    }))
    .filter((t) => t.courses.length > 0);

  const panels = [
    { title: "Most popular", href: "/courses", items: L(popularCourses(courses)).slice(0, 3) },
    { title: "New programs", href: "/courses?sort=title", items: L(newCourses(courses)).slice(0, 3) },
    { title: "Trending AI courses", href: "/courses?category=ai-data", items: L(courses.filter((c) => c.is_ai_integrated)).slice(0, 3) },
  ];

  return (
    <>
      {/* ------------------------------------------------------------ Hero carousel */}
      <section className="container-x pt-6 pb-4">
        <h1 className="sr-only">{settings.site_name}: IT training in Nepal</h1>
        <HeroCarousel slides={slides} />
      </section>

      {/* ------------------------------------------------------------ New and popular */}
      <section className="container-x py-10">
        <SectionTitle>New and popular</SectionTitle>
        <div className="grid gap-5 lg:grid-cols-3">
          {panels.map((p, i) => (
            <Reveal key={p.title} delay={i * 120} className="rounded-2xl bg-tint p-4">
              <Link href={p.href} className="mb-3 inline-flex items-center gap-1.5 px-1 text-lg font-bold text-ink hover:underline">
                {p.title} <ArrowRight className="size-4" aria-hidden />
              </Link>
              <div className="space-y-2.5">
                {p.items.map((c) => (
                  <CourseRow key={c.id} course={c} rating={ratings[c.id]} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Careers band */}
      {careerTabs.length > 0 && (
        <section className="container-x py-6">
          <Reveal variant="zoom">
          <CourseTabsBand
            title="Skills for the work you do and the career you want"
            text="Choose your goal. Learn the workflows, judgement and tools that employers are hiring for."
            cta={{ href: "/courses", label: "Explore programs" }}
            tabs={careerTabs}
            ratings={ratings}
          />
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------------ Quick actions */}
      <section className="container-x py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { href: "/courses", title: "Launch a new career", icon: Rocket },
            { href: "/corporate", title: "Train your team or campus", icon: Building2 },
            { href: "/verify", title: "Verify a certificate", icon: Award },
          ].map((a, i) => (
            <Reveal key={a.title} delay={i * 120}>
            <Link
              href={a.href}
              className="group relative flex h-28 items-center sm:h-32 justify-between overflow-hidden rounded-2xl bg-tint px-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="relative z-10 text-xl font-bold text-ink group-hover:underline">{a.title}</span>
              <span className="absolute top-1/2 right-6 size-28 -translate-y-1/2 rotate-12 rounded-3xl bg-sky/10" aria-hidden />
              <a.icon className="relative size-12 text-navy transition duration-500 group-hover:scale-110 group-hover:-rotate-6" strokeWidth={1.4} aria-hidden />
            </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
        <h2 className="mt-12 mb-5 text-2xl font-bold tracking-tight text-ink sm:text-[28px]">Explore categories</h2>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/courses?category=${c.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-soft px-3.5 py-2 text-sm font-medium text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-navy hover:text-white sm:px-4 sm:py-2.5 sm:text-[15px] [&>svg]:transition hover:[&>svg]:text-white"
            >
              <IconByName name={c.icon} className="size-4.5 text-navy" aria-hidden /> {c.name}
            </Link>
          ))}
          {topSkills(courses, 6).map((s) => (
            <Link
              key={s}
              href={`/courses?q=${encodeURIComponent(s)}`}
              className="inline-flex items-center rounded-xl bg-soft px-3.5 py-2 text-sm font-medium text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-navy hover:text-white sm:px-4 sm:py-2.5 sm:text-[15px]"
            >
              {s}
            </Link>
          ))}
        </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Job-ready band */}
      {categoryTabs.length > 0 && (
        <section className="container-x py-6">
          <Reveal variant="zoom">
          <CourseTabsBand
            title="Get job-ready for an in-demand career"
            text="No prior experience needed to get started. Every program begins with the fundamentals."
            cta={{ href: "/courses", label: "Explore programs" }}
            tabs={categoryTabs}
            ratings={ratings}
          />
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------------ Promo pair */}
      <section className="container-x grid gap-5 py-10 lg:grid-cols-2">
        <Reveal variant="left" className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white transition duration-300 hover:shadow-lift sm:p-10">
          <div className="animate-drift absolute -right-14 -bottom-20 size-72 rounded-full bg-navy-700" aria-hidden />
          <div className="absolute -right-4 -bottom-6 size-48 rounded-full border-[26px] border-navy-900/60" aria-hidden />
          <Wallet className="absolute right-12 bottom-12 hidden size-16 text-sky sm:block" aria-hidden />
          <p className="relative text-sm font-extrabold tracking-wider text-mint uppercase">One fee · every mode</p>
          <h2 className="relative mt-2 max-w-sm text-2xl leading-tight font-bold sm:text-[28px]">
            Start with just 50%. Pay the rest when you are promoted to the internship.
          </h2>
          <ul className="relative mt-5 space-y-2 text-[15px] text-white/85">
            {["Online, Hybrid or Physical at the same price", "Recorded video of every session", "Verifiable completion certificate"].map((t) => (
              <li key={t} className="flex gap-2">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden /> {t}
              </li>
            ))}
          </ul>
          <Link href="/enroll" className="relative mt-7 inline-flex items-center gap-2 font-bold hover:underline">
            Reserve your seat <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
        <Reveal variant="right" delay={120} className="relative overflow-hidden rounded-3xl bg-navy-900 p-7 text-white transition duration-300 hover:shadow-lift sm:p-10">
          <div className="absolute top-0 right-0 hidden h-full w-[38%] bg-white/5 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)] sm:block" aria-hidden />
          <Briefcase className="absolute right-10 bottom-10 hidden size-20 text-sky/70 sm:block" strokeWidth={1.3} aria-hidden />
          <p className="relative text-lg font-semibold text-white/90">
            leafclutch <span className="font-normal text-white/70">for institutions</span>
          </p>
          <h2 className="relative mt-3 max-w-sm text-2xl leading-tight font-bold sm:text-[28px]">
            Drive your organisation forward and empower your people
          </h2>
          <p className="relative mt-3 max-w-sm text-[15px] text-white/75">
            Corporate upskilling, school AI &amp; coding campaigns, college bootcamps and institutional partnerships.
          </p>
          <Link href="/corporate" className="relative mt-7 inline-flex items-center gap-2 font-bold hover:underline">
            Request a proposal <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-x py-12">
          <SectionTitle>Why learners choose Leafclutch Academy</SectionTitle>
          <Reveal>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------------ How it works */}
      <section className="bg-surface py-14">
        <div className="container-x">
          <SectionTitle>From first class to first job</SectionTitle>
          <Reveal>
            <Journey />
          </Reveal>
          {settings.stats.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {settings.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 100} className="rounded-2xl bg-white p-5 ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-card">
                  <CountUp value={s.value} className="block text-3xl font-extrabold text-navy" />
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ Partners */}
      {partners.length > 0 && (
        <section className="container-x py-14">
          <h2 className="text-center text-2xl font-bold text-ink">Our hiring & institutional partners</h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {partners.map((p) => {
              const logo = p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-12 w-auto max-w-40 object-contain grayscale transition hover:grayscale-0" loading="lazy" />
              ) : (
                <span className="text-lg font-bold text-muted">{p.name}</span>
              );
              return p.website_url ? (
                <a key={p.id} href={p.website_url} target="_blank" rel="noopener noreferrer">{logo}</a>
              ) : (
                <span key={p.id}>{logo}</span>
              );
            })}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ FAQ */}
      {faqs.length > 0 && (
        <section className="container-x py-14">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-ink sm:text-[28px]">Frequently asked questions</h2>
          <Reveal>
            <FaqList items={faqs} className="mx-auto max-w-3xl" />
          </Reveal>
        </section>
      )}

      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
