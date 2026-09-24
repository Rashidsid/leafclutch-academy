-- =====================================================================
-- reset.sql — DANGER: deletes every Leafclutch Academy table and all data.
-- Use only on a development project, then re-run files 1 → 12 in order.
-- Uploaded files in the "media" bucket are NOT deleted.
-- =====================================================================

drop table if exists public.enrollments cascade;
drop table if exists public.corporate_inquiries cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.certificates cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.batches cascade;
drop table if exists public.course_mentors cascade;
drop table if exists public.mentors cascade;
drop table if exists public.courses cascade;
drop table if exists public.categories cascade;
drop table if exists public.faqs cascade;
drop table if exists public.programs cascade;
drop table if exists public.partners cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.admins cascade;

drop function if exists public.verify_certificate(text);
drop function if exists public.is_admin() cascade;
drop function if exists public.set_updated_at() cascade;
