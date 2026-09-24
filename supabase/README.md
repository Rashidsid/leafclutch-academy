# Supabase setup

Run these files **in order** in Supabase → SQL Editor (paste each file, then Run).
Every file is safe to run again. Seed files never overwrite rows you have edited in the admin panel.

| # | File | What it does |
|---|------|--------------|
| 1 | `1schema.sql` | Tables, indexes and `updated_at` triggers |
| 2 | `2security.sql` | Row Level Security, `is_admin()` and `verify_certificate()` |
| 3 | `3storage.sql` | Public `media` bucket for images uploaded from the admin |
| 4 | `4seed-settings.sql` | Contact details, hero text, stats and social links |
| 5 | `5seed-categories.sql` | Course categories |
| 6 | `6seed-courses.sql` | The 12 programs with fees, curriculum, tools, FAQs and the 50/50 payment plan |
| 7 | `7seed-mentors.sql` | Rohan Aryal, linked to Agentic AI, Generative AI, AI/ML, Data Science and Data Analytics |
| 8 | `8seed-faqs.sql` | General FAQs |
| 9 | `9seed-programs.sql` | Corporate, school, college and institutional programs |
| 10 | `10seed-batches.sql` | Sample upcoming batches (dates relative to the day you run it) |
| 11 | `11seed-testimonials.sql` | **Sample** testimonials, seeded **unpublished**. Replace them with real reviews |
| 12 | `12create-admin.sql` | Gives a user access to `/admin` |
| 13 | `13certificate-and-detailed-curriculum.sql` | Adds the certificate sample image setting and the detailed Lesson → Section → Points curricula. **Replaces** the curriculum of the 12 starter courses |
| – | `reset.sql` | **Deletes all tables and data.** Development only |

## Step by step

1. **Create a project** at [supabase.com](https://supabase.com).
2. **Run files 1 → 11** in the SQL Editor.
3. **Create the admin user**: Authentication → Users → *Add user* → enter email and password and tick *Auto Confirm User*.
4. Open `12create-admin.sql`, replace the email with that user's email and run it.
5. **Recommended:** Authentication → Sign In / Providers → turn **off** “Allow new users to sign up”. Admins are added by you, never by the public.
6. **Connect the website**: Project Settings → API. Copy the Project URL and the `anon` (publishable) key into `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=https://academy.leafclutch.com.np
   ```

7. Restart `npm run dev` and sign in at `/admin/login`.

## How security works

- Visitors can **read** published courses, mentors, batches, testimonials, FAQs, programs, partners and settings.
- Visitors can only **submit** enrollments, corporate inquiries and contact messages. They can never read them back, and the database rejects oversized or pre-filled status/notes values.
- Certificates cannot be listed publicly. `/verify` checks one exact code through `verify_certificate()`.
- Everything else, including image uploads, needs a signed-in user listed in `public.admins`.
- The website only uses the public anon key. **Never** put the `service_role` key in the website.

## Changing the starter content

The seed files are generated from `supabase/seed-data/seed-content.ts`. To change the starter content before a fresh install, edit that file and run:

```bash
npm run seed:sql
```

After the site is live, edit content in the admin panel instead.

> **Why files 6–11 contain long base64 blocks:** the Supabase SQL Editor mis-read long course text as SQL
> (`relation "the" does not exist`). Each record's content is therefore stored as base64-encoded JSON
> that Postgres decodes itself (`convert_from(decode(...))`). The comment above each statement says which
> record it is, and the readable source is `supabase/seed-data/seed-content.ts`.
