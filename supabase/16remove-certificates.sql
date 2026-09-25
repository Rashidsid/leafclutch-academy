-- =====================================================================
-- 16remove-certificates.sql — certificate verification moved to
-- https://verify.leafclutch.com.np
--
-- Removes the old certificate records table and its public lookup
-- function from this database. The website's /verify address now
-- redirects to the verification site.
--
-- NOTE: this permanently deletes any certificates stored here. Export them
-- first (Table Editor → certificates → Export to CSV) if you need them.
--
-- Safe to re-run.
-- =====================================================================

drop function if exists public.verify_certificate(text);
drop table if exists public.certificates cascade;
