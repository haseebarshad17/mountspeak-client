-- RLS for public tour reads (columns already exist on public.tours).

alter table public.tours enable row level security;

drop policy if exists "Public read published tours" on public.tours;
create policy "Public read published tours"
  on public.tours
  for select
  to anon, authenticated
  using (publication_status = 'PUBLISHED');
