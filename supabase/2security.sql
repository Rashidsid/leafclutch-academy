-- =====================================================================
-- 2security.sql — Row Level Security
--
-- Rules:
--   • Visitors can read published content and settings.
--   • Visitors can only INSERT into the inbox tables (enrollments,
--     corporate_inquiries, contact_messages), never read them back.
--   • Admins (users listed in public.admins) can do everything.
--   • Certificates are not listable; they are checked by exact code
--     through verify_certificate().
-- Safe to re-run.
-- =====================================================================

-- ---------------------------------------------------------------------
-- is_admin(): true when the signed-in user is in public.admins
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','categories','courses','mentors','course_mentors','batches','testimonials',
    'faqs','programs','partners','certificates','enrollments','corporate_inquiries',
    'contact_messages','admins'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Helper: drop & recreate policies so this file can be re-run
-- ---------------------------------------------------------------------
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in (
        'site_settings','categories','courses','mentors','course_mentors','batches','testimonials',
        'faqs','programs','partners','certificates','enrollments','corporate_inquiries',
        'contact_messages','admins'
      )
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Public read policies
-- ---------------------------------------------------------------------
create policy "settings are public" on public.site_settings
  for select using (true);

create policy "categories are public" on public.categories
  for select using (true);

create policy "published courses are public" on public.courses
  for select using (is_published or public.is_admin());

create policy "published mentors are public" on public.mentors
  for select using (is_published or public.is_admin());

create policy "course mentors are public" on public.course_mentors
  for select using (true);

create policy "published batches are public" on public.batches
  for select using (is_published or public.is_admin());

create policy "published testimonials are public" on public.testimonials
  for select using (is_published or public.is_admin());

create policy "published faqs are public" on public.faqs
  for select using (is_published or public.is_admin());

create policy "published programs are public" on public.programs
  for select using (is_published or public.is_admin());

create policy "published partners are public" on public.partners
  for select using (is_published or public.is_admin());

-- ---------------------------------------------------------------------
-- Admin write policies for managed content
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','categories','courses','mentors','course_mentors','batches','testimonials',
    'faqs','programs','partners'
  ]
  loop
    execute format(
      'create policy "admins insert %1$s" on public.%1$I for insert with check (public.is_admin())', t);
    execute format(
      'create policy "admins update %1$s" on public.%1$I for update using (public.is_admin()) with check (public.is_admin())', t);
    execute format(
      'create policy "admins delete %1$s" on public.%1$I for delete using (public.is_admin())', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------
-- Certificates: admin only (public checks go through verify_certificate)
-- ---------------------------------------------------------------------
create policy "admins manage certificates" on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.verify_certificate(p_code text)
returns table (
  code text,
  student_name text,
  course_title text,
  mode text,
  issued_on date,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select c.code, c.student_name, c.course_title, c.mode, c.issued_on, c.status
  from public.certificates c
  where upper(c.code) = upper(trim(p_code))
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Inbox tables: anyone may submit, only admins may read/update/delete.
-- Length limits stop oversized spam payloads.
-- ---------------------------------------------------------------------
create policy "anyone can enroll" on public.enrollments
  for insert to anon, authenticated
  with check (
    status = 'new' and admin_notes is null
    and char_length(full_name) between 2 and 120
    and char_length(email) <= 160
    and char_length(phone) between 7 and 20
    and coalesce(char_length(message), 0) <= 2000
    and coalesce(char_length(education), 0) <= 160
  );
create policy "admins read enrollments" on public.enrollments
  for select using (public.is_admin());
create policy "admins update enrollments" on public.enrollments
  for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete enrollments" on public.enrollments
  for delete using (public.is_admin());

create policy "anyone can send corporate inquiry" on public.corporate_inquiries
  for insert to anon, authenticated
  with check (
    status = 'new' and admin_notes is null
    and char_length(organization) between 2 and 160
    and char_length(contact_name) between 2 and 120
    and char_length(email) <= 160
    and char_length(phone) between 7 and 20
    and coalesce(char_length(message), 0) <= 3000
  );
create policy "admins read corporate inquiries" on public.corporate_inquiries
  for select using (public.is_admin());
create policy "admins update corporate inquiries" on public.corporate_inquiries
  for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete corporate inquiries" on public.corporate_inquiries
  for delete using (public.is_admin());

create policy "anyone can send a message" on public.contact_messages
  for insert to anon, authenticated
  with check (
    status = 'new' and admin_notes is null
    and char_length(name) between 2 and 120
    and char_length(email) <= 160
    and char_length(message) between 5 and 3000
  );
create policy "admins read messages" on public.contact_messages
  for select using (public.is_admin());
create policy "admins update messages" on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete messages" on public.contact_messages
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- Admins table: admins can see the list; changes happen in SQL only
-- ---------------------------------------------------------------------
create policy "admins read admins" on public.admins
  for select using (public.is_admin());
