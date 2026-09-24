# Leafclutch Academy

Course website and admin panel for Leafclutch Academy, the training wing of Leafclutch Technologies Pvt. Ltd.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage)

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Without Supabase credentials the site runs in **demo mode** and shows the starter content from `supabase/seed-data/seed-content.ts`, so you can preview everything straight away. Forms and the admin panel need Supabase. Follow [supabase/README.md](supabase/README.md) to connect it.

```bash
npm run build && npm start   # production
npm run typecheck            # TypeScript
npm run lint                 # ESLint
npm run seed:sql             # regenerate supabase/4…11 seed files from seed-content.ts
```

## Features

**Public website**
- Home: hero with search, stats, course explorer with category tabs, learning modes, learning journey, “every course includes”, 50/50 payment plan, testimonial carousel, mentors, corporate programs, partners, FAQs
- Course catalogue with search, category filters and sorting
- Course pages: overview, what you will learn, tools, expandable curriculum, what you get, fees and installment plan, learning modes, upcoming batches, mentors, prerequisites, careers, certificate, FAQs, testimonials, related courses, and a sticky enroll card
- Online, Hybrid and Physical modes at the same fee
- Enrollment form with course, mode and batch selection and a live payment summary
- Upcoming classes, Mentors, Corporate & Institutions (with proposal form), About, Contact
- Certificate verification by code
- SEO: per-page metadata, Course JSON-LD, sitemap.xml, robots.txt
- Floating WhatsApp button; responsive down to small phones

**Admin panel (`/admin`)**
- Dashboard with new enrollments, inquiries, messages and upcoming batches
- Courses: every field, including curriculum builder, tools, FAQs, payment plan, modes, mentors, artwork and SEO
- Categories, Batches, Mentors, Testimonials, FAQs, Corporate programs, Partners, Certificates
- Image uploads to Supabase Storage
- Inbox for enrollments, corporate inquiries and messages: status workflow, internal notes, call/WhatsApp/email shortcuts, CSV export
- Site settings: announcement bar, hero text, stats, contact details, social links, map
- Saving in the admin refreshes the public site immediately

## Project structure

```
supabase/                 SQL, run in order (see supabase/README.md)
supabase/seed-data/generate-seed-sql.ts
src/
  app/
    (site)/               public pages (home, courses, course/[slug], enroll, schedule,
                          corporate, mentors, about, contact, verify)
    admin/
      login/              sign-in
      (panel)/            dashboard, settings, [resource] list / new / [id] edit
      actions.ts          admin server actions (auth, CRUD, inbox, settings)
    actions.ts            public form server actions
    sitemap.ts, robots.ts, not-found.tsx
  components/
    site/                 header, footer, course card/cover, testimonial carousel, sections
    forms/                enrollment, corporate and contact forms
    admin/                shell, generic resource form and fields, inbox, row actions
    ui/                   buttons, badges, logo, icons
  data/seed-content.ts    starter content (source for seed SQL and demo mode)
  lib/
    admin/resources.ts    admin sections and fields are declared here
    data.ts               public data queries (with demo fallback)
    supabase/             browser, server and public clients
  proxy.ts                keeps the admin session fresh (Next 16 “proxy”, formerly middleware)
```

### Adding a field to the admin

1. Add the column in a new SQL file, e.g. `supabase/13add-column.sql`.
2. Add the field to the resource in `src/lib/admin/resources.ts`. The editor, validation and saving pick it up automatically.
3. Show it on the website where needed.

## Deploying

Deploy to Vercel (or any Node host). Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SITE_URL` in the host's environment variables.
