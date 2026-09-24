"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, Ellipsis, House, MessageSquareText, Phone, Search, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonClass } from "@/components/ui/button";
import { CourseCover } from "./course-cover";
import { CourseRow } from "./course-card";
import { IconByName } from "@/lib/icons";
import { cn } from "@/lib/cn";
import type { CourseLite } from "@/lib/catalog";

export interface MenuCategory {
  slug: string;
  name: string;
  icon: string | null;
}

export interface HeaderMenu {
  categories: MenuCategory[];
  careers: string[];
  skills: string[];
  courses: CourseLite[];
  favourites: CourseLite[];
}

const AUDIENCE_TABS = [
  { href: "/", label: "For Individuals", match: (p: string) => !p.startsWith("/corporate") && !p.startsWith("/verify") },
  { href: "/corporate", label: "For Businesses", match: (p: string) => p.startsWith("/corporate") },
  { href: "/corporate#programs", label: "For Schools & Colleges", match: () => false },
  { href: "/verify", label: "Verify Certificate", match: (p: string) => p.startsWith("/verify") },
];

const q = (s: string) => `/courses?q=${encodeURIComponent(s)}`;

export function Header({ menu, phone }: { menu: HeaderMenu; phone: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [explore, setExplore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Close everything when the route changes
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawer(false);
    setExplore(false);
    setSearchOpen(false);
    setMobileSearch(false);
  }

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExplore(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setExplore(false);
        setDrawer(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const term = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      term
        ? menu.courses
            .filter((c) => [c.title, c.subtitle, c.category, ...c.tools].some((s) => s?.toLowerCase().includes(term)))
            .slice(0, 6)
        : [],
    [term, menu.courses],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(term ? q(query.trim()) : "/courses");
    setSearchOpen(false);
    setMobileSearch(false);
  }

  const searchBox = (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={submit} role="search" className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="What do you want to learn?"
          aria-label="Search courses"
          className={cn(
            "h-12 w-full rounded-full border bg-white pr-14 pl-5 text-[15px] text-ink outline-none transition placeholder:text-slate-500",
            searchOpen ? "border-navy ring-4 ring-navy/10" : "border-line hover:border-slate-400",
          )}
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute top-1/2 right-1.5 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white transition hover:bg-navy-700"
        >
          <Search className="size-4.5" />
        </button>
      </form>

      {searchOpen && (
        <div className="absolute top-full left-1/2 z-50 mt-2 w-[min(94vw,56rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-white shadow-2xl lg:left-0 lg:translate-x-0">
          <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
            {term ? (
              <>
                <p className="mb-3 text-sm font-bold text-ink">Courses matching &ldquo;{query.trim()}&rdquo;</p>
                {matches.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {matches.map((c) => (
                      <CourseRow key={c.id} course={c} />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl bg-surface p-4 text-sm text-muted">
                    No course matches yet. Try another keyword or browse all courses.
                  </p>
                )}
                <Link href={q(query.trim())} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-navy hover:underline">
                  See all results <ArrowRight className="size-4" aria-hidden />
                </Link>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-ink">Trending at Leafclutch Academy</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {menu.courses.map((c) => (
                    <Link
                      key={c.id}
                      href={`/courses/${c.slug}`}
                      className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-navy hover:bg-tint hover:text-navy"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
                {menu.favourites.length > 0 && (
                  <>
                    <p className="mt-7 text-lg font-bold text-ink">Start with these learner favourites</p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-3">
                      {menu.favourites.slice(0, 3).map((c) => (
                        <Link key={c.id} href={`/courses/${c.slug}`} className="group rounded-2xl border border-line p-2.5 transition hover:shadow-card">
                          <CourseCover course={c} showBadges={false} />
                          <p className="mt-3 px-1 font-bold text-ink group-hover:underline">{c.title}</p>
                          <p className="px-1 pb-1 text-xs text-muted">
                            {c.level} · {c.duration}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="border-t border-line bg-surface px-6 py-3.5 text-sm">
            <span className="text-muted">Not sure where to start?</span>{" "}
            <Link href="/contact" className="font-bold text-ink hover:underline">
              Get free counselling <ArrowRight className="inline size-4" aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Audience bar */}
      <div className="bg-ink text-white">
        <div className="container-x flex h-11 items-center justify-between gap-4">
          <nav className="no-scrollbar -mx-2 flex h-full overflow-x-auto" aria-label="Audience">
            {AUDIENCE_TABS.map((t) => {
              const active = t.match(pathname);
              return (
                <Link
                  key={t.label}
                  href={t.href}
                  className={cn(
                    "relative flex shrink-0 items-center px-3 text-[13px] whitespace-nowrap transition sm:text-sm",
                    active ? "bg-white/10 font-bold" : "text-white/80 hover:text-white",
                  )}
                >
                  {t.label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-0.75 rounded-t bg-mint" />}
                </Link>
              );
            })}
          </nav>
          {phone && (
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="hidden shrink-0 items-center gap-1.5 text-sm text-white/80 hover:text-white md:flex">
              <Phone className="size-3.5" aria-hidden /> {phone}
            </a>
          )}
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="container-x flex h-19 items-center gap-3 lg:gap-5">
          <Logo />

          <div ref={exploreRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setExplore((v) => !v)}
              aria-expanded={explore}
              className={cn(
                "inline-flex h-11 items-center gap-1 rounded-lg px-3 text-[15px] font-semibold transition",
                explore ? "bg-tint text-navy" : "text-slate-700 hover:bg-tint hover:text-navy",
              )}
            >
              Explore <ChevronDown className={cn("size-4 transition", explore && "rotate-180")} aria-hidden />
            </button>
          </div>
          <Link href="/schedule" className="hidden text-[15px] font-medium whitespace-nowrap text-slate-700 hover:text-navy xl:block">
            Upcoming Classes
          </Link>

          <div className="mx-auto hidden w-full max-w-xl md:block">{searchBox}</div>

          <nav className="hidden items-center gap-5 text-[15px] font-medium text-slate-700 2xl:flex" aria-label="Main">
            <Link href="/mentors" className="hover:text-navy">Mentors</Link>
            <Link href="/about" className="hover:text-navy">About</Link>
            <Link href="/contact" className="hover:text-navy">Contact</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <button
              type="button"
              onClick={() => setMobileSearch((v) => !v)}
              aria-label="Search"
              className="inline-flex size-10 items-center justify-center rounded-full text-navy hover:bg-tint md:hidden"
            >
              <Search className="size-5" />
            </button>
            <Link href="/contact" className="hidden text-[15px] font-semibold text-navy hover:underline lg:block 2xl:hidden">
              Contact
            </Link>
            <Link href="/enroll" className={buttonClass("outline", "md", "hidden border-navy text-navy hover:bg-navy hover:text-white sm:inline-flex")}>
              Enroll Now
            </Link>
          </div>
        </div>

        {mobileSearch && <div className="container-x pb-4 md:hidden">{searchBox}</div>}

        {/* Explore mega menu */}
        {explore && (
          <div className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-2xl lg:block" onMouseDown={(e) => e.stopPropagation()}>
            <div className="container-x grid grid-cols-4 gap-10 py-8">
              <MegaColumn title="Explore careers">
                {menu.careers.map((c) => (
                  <MegaLink key={c} href={q(c)}>{c}</MegaLink>
                ))}
                <MegaLink href="/courses" underline>View all</MegaLink>
              </MegaColumn>
              <MegaColumn title="Explore categories">
                {menu.categories.map((c) => (
                  <MegaLink key={c.slug} href={`/courses?category=${c.slug}`}>
                    <IconByName name={c.icon} className="size-4 text-sky" aria-hidden /> {c.name}
                  </MegaLink>
                ))}
                <MegaLink href="/courses" underline>View all</MegaLink>
              </MegaColumn>
              <MegaColumn title="Popular programs">
                {menu.favourites.slice(0, 8).map((c) => (
                  <MegaLink key={c.slug} href={`/courses/${c.slug}`}>{c.title}</MegaLink>
                ))}
                <MegaLink href="/courses" underline>View all</MegaLink>
              </MegaColumn>
              <div className="space-y-8">
                <MegaColumn title="Trending skills">
                  {menu.skills.slice(0, 7).map((s) => (
                    <MegaLink key={s} href={q(s)}>{s}</MegaLink>
                  ))}
                </MegaColumn>
                <MegaColumn title="For organisations">
                  <MegaLink href="/corporate">Corporate & institutions</MegaLink>
                  <MegaLink href="/verify">Verify a certificate</MegaLink>
                </MegaColumn>
              </div>
            </div>
            <div className="container-x">
              <p className="border-t border-line py-5 text-[15px] text-slate-700">
                Not sure where to begin?{" "}
                <Link href="/schedule" className="underline hover:text-navy">See upcoming classes</Link> or{" "}
                <Link href="/contact" className="underline hover:text-navy">talk to a counsellor</Link>
                <span className="ml-2 rounded bg-mint px-1.5 py-0.5 text-[11px] font-extrabold text-navy-900">FREE</span>
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-8px_24px_-12px_rgb(7_32_105/0.5)] lg:hidden"
      >
        <div className="mx-auto grid h-16 max-w-lg grid-cols-4">
          {[
            { href: "/", label: "Home", icon: House, active: pathname === "/" },
            { href: "/courses", label: "Courses", icon: BookOpen, active: pathname.startsWith("/courses") },
            { href: "/contact", label: "Enquiry", icon: MessageSquareText, active: pathname.startsWith("/contact") || pathname.startsWith("/enroll") },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 text-[11px] transition active:scale-95",
                item.active ? "font-bold text-white" : "text-white/65",
              )}
            >
              <item.icon className={cn("size-5 transition", item.active && "scale-110")} aria-hidden />
              {item.label}
              {item.active && <span className="animate-pop absolute inset-x-5 bottom-0 h-1 rounded-t-full bg-white" />}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-expanded={drawer}
            className={cn("relative flex flex-col items-center justify-center gap-1 text-[11px] transition active:scale-95", drawer ? "font-bold text-white" : "text-white/65")}
          >
            <Ellipsis className="size-5" aria-hidden />
            More
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", drawer ? "visible" : "invisible")} aria-hidden={!drawer}>
        <div className={cn("absolute inset-0 bg-ink/50 transition-opacity", drawer ? "opacity-100" : "opacity-0")} onClick={() => setDrawer(false)} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
            drawer ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-19 items-center justify-between border-b border-line px-4">
            <Logo />
            <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-tint">
              <X className="size-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <nav className="space-y-1" aria-label="Mobile">
              {[
                ["/", "Home"],
                ["/courses", "All courses"],
                ["/schedule", "Upcoming classes"],
                ["/corporate", "For businesses & institutions"],
                ["/mentors", "Mentors"],
                ["/about", "About us"],
                ["/contact", "Contact"],
                ["/verify", "Verify certificate"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={cn("block rounded-lg px-3 py-2.5 font-semibold hover:bg-tint", pathname === href ? "bg-tint text-navy" : "text-ink")}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <p className="mt-6 mb-3 px-3 text-xs font-bold tracking-wider text-muted uppercase">Categories</p>
            <div className="flex flex-wrap gap-2 px-3">
              {menu.categories.map((c) => (
                <Link key={c.slug} href={`/courses?category=${c.slug}`} className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1.5 text-sm font-semibold text-ink">
                  <IconByName name={c.icon} className="size-4 text-sky" aria-hidden /> {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-line p-4">
            <Link href="/enroll" className={buttonClass("primary", "lg", "w-full")}>
              Enroll Now <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function MegaColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[17px] font-bold text-ink">{title}</p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function MegaLink({ href, children, underline = false }: { href: string; children: React.ReactNode; underline?: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 text-[15px] text-slate-700 hover:text-navy hover:underline",
          underline && "pt-1 font-semibold text-ink underline",
        )}
      >
        {children}
      </Link>
    </li>
  );
}
