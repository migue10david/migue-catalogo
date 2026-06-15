create table public.business_catalogs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  logo_url text,
  cover_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint business_catalogs_name_not_blank check (btrim(name) <> '')
);

create trigger on_business_catalogs_updated
  before update on public.business_catalogs
  for each row execute procedure public.set_updated_at();

create index business_catalogs_owner_id_idx
  on public.business_catalogs (owner_id);

create index business_catalogs_owner_id_is_active_idx
  on public.business_catalogs (owner_id, is_active);

alter table public.business_catalogs enable row level security;
alter table public.business_catalogs force row level security;

create policy "Sellers can create their own business catalogs"
on public.business_catalogs
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'seller'
  )
);

create policy "Sellers can read their own business catalogs and admins can read all"
on public.business_catalogs
for select
to authenticated
using (
  owner_id = (select auth.uid())
  or (select public.is_admin())
);

create policy "Sellers can update their own business catalogs and admins can update all"
on public.business_catalogs
for update
to authenticated
using (
  owner_id = (select auth.uid())
  or (select public.is_admin())
)
with check (
  owner_id = (select auth.uid())
  or (select public.is_admin())
);

create policy "Sellers can delete their own business catalogs and admins can delete all"
on public.business_catalogs
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  or (select public.is_admin())
);

comment on table public.business_catalogs is 'Business catalogs created by seller accounts.';
