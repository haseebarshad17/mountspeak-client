-- Run in Supabase SQL Editor (Dashboard → SQL).
-- 1) Creates agency_sites if missing
-- 2) Replace :agency_id with an existing agencies.id from your project

-- Migration (safe to re-run)
create table if not exists public.agency_sites (
    agency_id uuid primary key references public.agencies (id) on delete cascade,
    site_url text,
    theme jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists agency_sites_updated_at_idx on public.agency_sites (updated_at desc);

alter table public.agency_sites enable row level security;

drop policy if exists "Public read agency_sites" on public.agency_sites;
create policy "Public read agency_sites"
    on public.agency_sites
    for select
    to anon, authenticated
    using (true);

-- Example seed (uncomment and set your agency UUID + theme JSON as {"page":{...}} per homepage.page.types.ts)
-- insert into public.agency_sites (agency_id, site_url, theme)
-- values (
--   'YOUR-AGENCY-UUID-HERE'::uuid,
--   'http://localhost:3000',
--   '{}'::jsonb
-- )
-- on conflict (agency_id) do update set
--   site_url = excluded.site_url,
--   theme = excluded.theme,
--   updated_at = now();
