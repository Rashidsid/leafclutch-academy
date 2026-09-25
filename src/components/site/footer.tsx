import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import {
  DiscordIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/components/ui/brand-icons";
import type { MenuCategory } from "./header";
import { VERIFY_URL } from "@/lib/site";
import type { Course, SiteSettings } from "@/lib/types";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-ink">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-slate-600">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-navy hover:underline">
        {children}
      </Link>
    </li>
  );
}

export function Footer({
  settings,
  courses,
  categories,
}: {
  settings: SiteSettings;
  courses: Course[];
  categories: MenuCategory[];
}) {
  const socials = [
    { href: settings.facebook_url, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { href: settings.linkedin_url, label: "LinkedIn", Icon: LinkedinIcon },
    { href: settings.tiktok_url, label: "TikTok", Icon: TiktokIcon },
    { href: settings.youtube_url, label: "YouTube", Icon: YoutubeIcon },
    { href: settings.discord_url, label: "Discord", Icon: DiscordIcon },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <Column title="Popular courses">
          {courses.slice(0, 7).map((c) => (
            <FLink key={c.slug} href={`/courses/${c.slug}`}>{c.title}</FLink>
          ))}
        </Column>
        <Column title="More courses">
          {courses.slice(7, 14).map((c) => (
            <FLink key={c.slug} href={`/courses/${c.slug}`}>{c.title}</FLink>
          ))}
        </Column>
        <Column title="Categories">
          {categories.map((c) => (
            <FLink key={c.slug} href={`/courses?category=${c.slug}`}>{c.name}</FLink>
          ))}
          <FLink href="/schedule">Upcoming courses</FLink>
        </Column>
        <Column title="Academy">
          <FLink href="/about">About us</FLink>
          <FLink href="/mentors">Mentors</FLink>
          <FLink href="/corporate">For businesses & institutions</FLink>
          <FLink href="/enroll">Enroll</FLink>
          <FLink href={VERIFY_URL}>Verify certificate</FLink>
          <FLink href="/contact">Contact</FLink>
        </Column>
        <Column title="Get in touch">
          {settings.address && (
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{settings.address}</li>
          )}
          {settings.phone && (
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
              <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="hover:text-navy">{settings.phone}</a>
            </li>
          )}
          {settings.email && (
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-navy">{settings.email}</a>
            </li>
          )}
          {settings.office_hours && (
            <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{settings.office_hours}</li>
          )}
        </Column>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Logo />
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} {settings.site_name}. A unit of{" "}
              <a href="https://leafclutch.com.np" target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
                Leafclutch Technologies Pvt. Ltd.
              </a>
            </p>
          </div>
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full text-slate-600 ring-1 ring-line transition hover:bg-navy hover:text-white hover:ring-navy"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
