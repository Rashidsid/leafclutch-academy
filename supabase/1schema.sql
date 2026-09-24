-- =====================================================================
-- 1schema.sql — Leafclutch Academy core tables
-- Run first. Safe to re-run (uses IF NOT EXISTS).
-- =====================================================================


-- Keeps updated_at current on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Site settings (single row, id = 1)
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id              smallint primary key default 1 check (id = 1),
  site_name       text not null default 'Leafclutch Academy',
  tagline         text,
  announcement    text,
  hero_eyebrow    text,
  hero_title      text,
  hero_highlight  text,
  hero_subtitle   text,
  phone           text,
  whatsapp        text,
  email           text,
  address         text,
  office_hours    text,
  map_embed_url   text,
  facebook_url    text,
  instagram_url   text,
  linkedin_url    text,
  tiktok_url      text,
  youtube_url     text,
  discord_url     text,
  stats           jsonb not null default '[]'::jsonb,
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  icon        text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.courses (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  subtitle         text,
  category_id      uuid references public.categories(id) on delete set null,
  description      text,
  fee              numeric(10,2) not null default 0 check (fee >= 0),
  duration         text not null default '3 Months',
  level            text,
  -- Online, Hybrid and Physical share the same fee
  modes            text[] not null default array['online','hybrid','physical']
                   check (modes <@ array['online','hybrid','physical']),
  badge            text,
  is_ai_integrated boolean not null default false,
  is_featured      boolean not null default false,
  is_published     boolean not null default true,
  sort_order       int not null default 0,
  icon             text,
  accent           text,
  thumbnail_url    text,
  tools            text[] not null default '{}',
  outcomes         text[] not null default '{}',
  prerequisites    text[] not null default '{}',
  includes         text[] not null default '{}',
  careers          text[] not null default '{}',
  -- [{ "title": "Module", "topics": ["Topic", ...] }]
  curriculum       jsonb not null default '[]'::jsonb,
  -- [{ "question": "...", "answer": "..." }]
  faqs             jsonb not null default '[]'::jsonb,
  -- [{ "label": "First installment", "percent": 50, "note": "Payable at enrollment" }]
  installments     jsonb not null default '[]'::jsonb,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists courses_category_idx on public.courses(category_id);
create index if not exists courses_published_idx on public.courses(is_published, sort_order);

create table if not exists public.mentors (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  role         text not null default 'Mentor',
  bio          text,
  photo_url    text,
  expertise    text[] not null default '{}',
  linkedin_url text,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.course_mentors (
  course_id uuid not null references public.courses(id) on delete cascade,
  mentor_id uuid not null references public.mentors(id) on delete cascade,
  primary key (course_id, mentor_id)
);
create index if not exists course_mentors_mentor_idx on public.course_mentors(mentor_id);

create table if not exists public.batches (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses(id) on delete cascade,
  title        text,
  start_date   date not null,
  mode         text not null default 'online' check (mode in ('online','hybrid','physical')),
  schedule     text,
  seats        int check (seats is null or seats >= 0),
  status       text not null default 'open' check (status in ('open','filling','full','closed')),
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists batches_course_idx on public.batches(course_id, start_date);

-- ---------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text,
  organization text,
  course_id    uuid references public.courses(id) on delete set null,
  quote        text not null,
  rating       smallint not null default 5 check (rating between 1 and 5),
  image_url    text,
  avatar_url   text,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.faqs (
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  answer       text not null,
  topic        text not null default 'general',
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Corporate, school, college and institutional programs
create table if not exists public.programs (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  audience     text not null default 'corporate'
               check (audience in ('corporate','school','college','institution')),
  duration     text,
  summary      text,
  highlights   text[] not null default '{}',
  icon         text,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Hiring / institutional partner logos
create table if not exists public.partners (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  logo_url     text,
  website_url  text,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Certificates that anyone can verify by code (read through verify_certificate())
create table if not exists public.certificates (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  student_name text not null,
  course_id    uuid references public.courses(id) on delete set null,
  course_title text not null,
  mode         text check (mode is null or mode in ('online','hybrid','physical')),
  issued_on    date not null default current_date,
  status       text not null default 'valid' check (status in ('valid','revoked')),
  remarks      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Inbox (submitted from the public site)
-- ---------------------------------------------------------------------
create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        text not null,
  phone        text not null,
  course_id    uuid references public.courses(id) on delete set null,
  course_title text,
  mode         text not null check (mode in ('online','hybrid','physical')),
  batch_id     uuid references public.batches(id) on delete set null,
  education    text,
  message      text,
  status       text not null default 'new' check (status in ('new','contacted','enrolled','cancelled')),
  admin_notes  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists enrollments_status_idx on public.enrollments(status, created_at desc);

create table if not exists public.corporate_inquiries (
  id              uuid primary key default gen_random_uuid(),
  organization    text not null,
  org_type        text not null default 'corporate'
                  check (org_type in ('corporate','school','college','institution')),
  contact_name    text not null,
  email           text not null,
  phone           text not null,
  program_id      uuid references public.programs(id) on delete set null,
  program_title   text,
  participants    int check (participants is null or participants > 0),
  preferred_dates text,
  message         text,
  status          text not null default 'new' check (status in ('new','contacted','proposal_sent','won','closed')),
  admin_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  status      text not null default 'new' check (status in ('new','read','replied','closed')),
  admin_notes text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Admin users (rows are added with 12create-admin.sql)
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','categories','courses','mentors','batches','testimonials','faqs',
    'programs','partners','certificates','enrollments','corporate_inquiries','contact_messages'
  ]
  loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end;
$$;
