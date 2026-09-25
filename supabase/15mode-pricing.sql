-- =====================================================================
-- 15mode-pricing.sql — separate price and discount for Online, Hybrid
-- and Physical classes
--
-- courses.pricing = { "online":   { "price": 8000,  "discount": 0  },
--                     "hybrid":   { "price": 10000, "discount": 10 },
--                     "physical": { "price": 12000, "discount": 20 } }
--
-- • Only the modes a course offers are present (managed in
--   Admin → Courses → Pricing & learning modes).
-- • courses.fee is kept as the lowest price a learner can pay, for sorting.
-- • Existing courses start with every offered mode at their current fee and
--   no discount, so nothing changes on the site until you set new prices.
--
-- Safe to re-run: courses that already have prices are left untouched.
-- =====================================================================

alter table public.courses
  add column if not exists pricing jsonb not null default '{}'::jsonb;

comment on column public.courses.pricing is
  'Price and discount percent per learning mode (managed in the admin panel).';

update public.courses c
set pricing = (
  select coalesce(
    jsonb_object_agg(m, jsonb_build_object('price', c.fee, 'discount', 0)),
    '{}'::jsonb
  )
  from unnest(c.modes) as m
)
where c.pricing = '{}'::jsonb;
