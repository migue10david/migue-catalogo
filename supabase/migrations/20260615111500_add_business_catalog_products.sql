create table public.business_catalog_products (
  id uuid primary key default gen_random_uuid(),
  business_catalog_id uuid not null references public.business_catalogs (id) on delete cascade,
  name text not null,
  description text,
  price numeric(12, 2) not null,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint business_catalog_products_name_not_blank check (btrim(name) <> ''),
  constraint business_catalog_products_price_non_negative check (price >= 0)
);

create trigger on_business_catalog_products_updated
  before update on public.business_catalog_products
  for each row execute procedure public.set_updated_at();

create index business_catalog_products_business_catalog_id_idx
  on public.business_catalog_products (business_catalog_id);

create index business_catalog_products_business_catalog_id_is_active_idx
  on public.business_catalog_products (business_catalog_id, is_active);

alter table public.business_catalog_products enable row level security;
alter table public.business_catalog_products force row level security;

create policy "Sellers can create products in their own catalogs"
on public.business_catalog_products
for insert
to authenticated
with check (
  exists (
    select 1
    from public.business_catalogs
    where id = business_catalog_id
      and owner_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'seller'
  )
);

create policy "Sellers can read their own products and admins can read all"
on public.business_catalog_products
for select
to authenticated
using (
  exists (
    select 1
    from public.business_catalogs
    where id = business_catalog_id
      and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
);

create policy "Sellers can update their own products and admins can update all"
on public.business_catalog_products
for update
to authenticated
using (
  exists (
    select 1
    from public.business_catalogs
    where id = business_catalog_id
      and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
)
with check (
  exists (
    select 1
    from public.business_catalogs
    where id = business_catalog_id
      and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
);

create policy "Sellers can delete their own products and admins can delete all"
on public.business_catalog_products
for delete
to authenticated
using (
  exists (
    select 1
    from public.business_catalogs
    where id = business_catalog_id
      and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
);

comment on table public.business_catalog_products is 'Products created by sellers inside their business catalogs.';
