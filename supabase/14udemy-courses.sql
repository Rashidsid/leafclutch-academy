-- =====================================================================
-- 14udemy-courses.sql — free Udemy courses (lifetime access) per course
--
-- • courses.udemy_courses   list of Udemy courses shown under “What you get”,
--                           managed in Admin → Courses → Free Udemy courses
-- • enrollments.udemy_course the Udemy course a learner chose when enrolling
--
-- Safe to re-run.
-- =====================================================================

alter table public.courses
  add column if not exists udemy_courses jsonb not null default '[]'::jsonb;

-- [{ "url", "title", "headline", "image", "instructor", "rating",
--    "ratings_count", "hours", "lectures", "level" }]
comment on column public.courses.udemy_courses is
  'Free Udemy courses bundled with this course (managed in the admin panel).';

alter table public.enrollments
  add column if not exists udemy_course text;

-- Keep public submissions small
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'enrollments_udemy_course_length'
  ) then
    alter table public.enrollments
      add constraint enrollments_udemy_course_length
      check (udemy_course is null or char_length(udemy_course) <= 300);
  end if;
end;
$$;
