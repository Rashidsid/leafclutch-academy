"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CircleHelp,
  ExternalLink,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Quote,
  Settings,
  Tags,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  tags: Tags,
  "calendar-days": CalendarDays,
  "graduation-cap": GraduationCap,
  quote: Quote,
  "circle-help": CircleHelp,
  briefcase: Briefcase,
  handshake: Handshake,
  award: Award,
  "user-plus": UserPlus,
  "building-2": Building2,
  mail: Mail,
};

export interface NavSection {
  title: string;
  items: { key: string; label: string; icon: string; badge?: number }[];
}

export function AdminShell({
  nav,
  email,
  children,
}: {
  nav: NavSection[];
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const link = (href: string, label: string, Icon: LucideIcon, badge?: number) => {
    const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
          active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
        )}
      >
        <Icon className={cn("size-[18px]", active ? "text-mint" : "")} aria-hidden />
        <span className="flex-1">{label}</span>
        {badge ? (
          <span className="rounded-full bg-sky px-1.5 py-0.5 text-[10px] leading-none font-bold text-white">{badge}</span>
        ) : null}
      </Link>
    );
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900 text-white">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <Image src="/brand/logo-footer.png" alt="" width={32} height={32} className="size-8" />
        <div className="leading-tight">
          <p className="text-sm font-extrabold">Leafclutch Academy</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Admin">
        <div className="space-y-1">
          {link("/admin", "Dashboard", LayoutDashboard)}
          {link("/admin/settings", "Site settings", Settings)}
        </div>
        {nav.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((i) => link(`/admin/${i.key}`, i.label, ICONS[i.icon] ?? BookOpen, i.badge))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-[18px]" aria-hidden /> View website
        </a>
        <form action={signOut}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white">
            <LogOut className="size-[18px]" aria-hidden /> Sign out
          </button>
        </form>
        <p className="mt-2 truncate px-3 text-xs text-white/40" title={email}>
          {email}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      {/* Mobile */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-tint">
          <Menu className="size-5" />
        </button>
        <p className="text-sm font-extrabold text-navy">Leafclutch Admin</p>
        <span className="size-10" />
      </div>
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div className={cn("absolute inset-y-0 left-0 w-72 transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          {sidebar}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute top-3 -right-12 inline-flex size-10 items-center justify-center rounded-lg bg-white"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex text-sm font-semibold text-sky hover:text-navy">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
