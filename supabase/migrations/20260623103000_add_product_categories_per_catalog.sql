create table public.business_catalog_product_categories (
  id uuid primary key default gen_random_uuid(),
  business_catalog_id uuid not null references public.business_catalogs (id) on delete cascade,
  name text not null,
  slug text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint business_catalog_product_categories_name_not_blank check (btrim(name) <> ''),
  constraint business_catalog_product_categories_slug_not_blank check (btrim(slug) <> ''),
  constraint business_catalog_product_categories_business_catalog_id_slug_key unique (business_catalog_id, slug)
);

create trigger on_business_catalog_product_categories_updated
  before update on public.business_catalog_product_categories
  for each row execute procedure public.set_updated_at();

create index business_catalog_product_categories_business_catalog_id_idx
  on public.business_catalog_product_categories (business_catalog_id);

create index business_catalog_product_categories_business_catalog_id_is_active_idx
  on public.business_catalog_product_categories (business_catalog_id, is_active);

alter table public.business_catalog_product_categories enable row level security;
alter table public.business_catalog_product_categories force row level security;

create policy "Sellers can create product categories in their own catalogs"
on public.business_catalog_product_categories
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

create policy "Sellers can read product categories in their own catalogs, admins can read all, public can read active categories from active catalogs"
on public.business_catalog_product_categories
for select
to public, authenticated
using (
  (
    is_active = true
    and exists (
      select 1
      from public.business_catalogs
      where id = business_catalog_id
        and is_active = true
    )
  )
  or exists (
    select 1
    from public.business_catalogs
    where id = business_catalog_id
      and owner_id = (select auth.uid())
  )
  or (select public.is_admin())
);

create policy "Sellers can update product categories in their own catalogs and admins can update all"
on public.business_catalog_product_categories
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

create policy "Sellers can delete product categories in their own catalogs and admins can delete all"
on public.business_catalog_product_categories
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

alter table public.business_catalog_products
  add column product_category_id uuid references public.business_catalog_product_categories (id) on delete restrict;

insert into public.business_catalog_product_categories (business_catalog_id, name, slug)
select distinct business_catalog_id, 'General', 'general'
from public.business_catalog_products
on conflict (business_catalog_id, slug) do nothing;

update public.business_catalog_products products
set product_category_id = categories.id
from public.business_catalog_product_categories categories
where products.product_category_id is null
  and categories.business_catalog_id = products.business_catalog_id
  and categories.slug = 'general';

alter table public.business_catalog_products
  alter column product_category_id set not null;

create index business_catalog_products_product_category_id_idx
  on public.business_catalog_products (product_category_id);

create index business_catalog_products_catalog_category_idx
  on public.business_catalog_products (business_catalog_id, product_category_id);

drop policy "Sellers can create products in their own catalogs" on public.business_catalog_products;
drop policy "Sellers can update their own products and admins can update all" on public.business_catalog_products;

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
    from public.business_catalog_product_categories
    where id = product_category_id
      and business_catalog_id = business_catalog_products.business_catalog_id
  )
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'seller'
  )
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
  (
    exists (
      select 1
      from public.business_catalogs
      where id = business_catalog_id
        and owner_id = (select auth.uid())
    )
    and exists (
      select 1
      from public.business_catalog_product_categories
      where id = product_category_id
        and business_catalog_id = business_catalog_products.business_catalog_id
    )
  )
  or (select public.is_admin())
);

comment on table public.business_catalog_product_categories is 'Categories created by sellers inside each business catalog to organize products.';
comment on column public.business_catalog_products.product_category_id is 'Product category chosen inside the owning business catalog.';
