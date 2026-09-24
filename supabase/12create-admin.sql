-- =====================================================================
-- 12create-admin.sql — give a user access to /admin
--
-- 1. Supabase Dashboard → Authentication → Users → "Add user"
--    (email + password, tick "Auto Confirm User").
-- 2. Replace the email below and run this file.
-- Run again with another email to add more admins.
-- =====================================================================

insert into public.admins (user_id, email)
select id, email
from auth.users
where lower(email) = lower('admin@leafclutch.com.np')   -- ← change me
on conflict (user_id) do nothing;

-- Check who is an admin:
-- select a.email, a.created_at from public.admins a order by a.created_at;

-- Remove an admin:
-- delete from public.admins where lower(email) = lower('someone@example.com');
