-- Agency marketing site config (homepage JSON in theme column)
create table if not exists public.agency_sites (
    agency_id uuid primary key references public.agencies (id) on delete cascade,
    site_url text,
    theme jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists agency_sites_updated_at_idx on public.agency_sites (updated_at desc);

alter table public.agency_sites enable row level security;

create policy "Public read agency_sites"
    on public.agency_sites
    for select
    to anon, authenticated
    using (true);

create policy "Authenticated update agency_sites"
    on public.agency_sites
    for update
    to authenticated
    using (true)
    with check (true);

create policy "Authenticated insert agency_sites"
    on public.agency_sites
    for insert
    to authenticated
    with check (true);
