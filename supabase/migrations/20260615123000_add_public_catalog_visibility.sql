create policy "Public can read active business catalogs"
on public.business_catalogs
for select
to public
using (is_active = true);

create policy "Public can read active business catalog products"
on public.business_catalog_products
for select
to public
using (
  is_active = true
  and exists (
    select 1
    from public.business_catalogs
    where id = business_catalog_id
      and is_active = true
  )
);
