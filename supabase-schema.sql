create table if not exists public.reservations (
  id text primary key,
  name text not null,
  phone text not null,
  guests text,
  date date not null,
  time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  table_id text,
  booked_at timestamptz not null default timezone('utc', now())
);

alter table public.reservations enable row level security;

drop policy if exists "Public can insert reservations" on public.reservations;
create policy "Public can insert reservations"
on public.reservations
for insert
to anon
with check (true);

drop policy if exists "Public can read reservations" on public.reservations;
create policy "Public can read reservations"
on public.reservations
for select
to anon
using (true);

drop policy if exists "Public can update reservations" on public.reservations;
create policy "Public can update reservations"
on public.reservations
for update
to anon
using (true)
with check (true);

drop policy if exists "Public can delete reservations" on public.reservations;
create policy "Public can delete reservations"
on public.reservations
for delete
to anon
using (true);
