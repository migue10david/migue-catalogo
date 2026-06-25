alter table public.profiles
  add column product_limit integer not null default 0;

update public.profiles profiles
set product_limit = case
  when profiles.role = 'seller' then coalesce(product_totals.total_products, 0)
  else 0
end
from (
  select
    catalogs.owner_id,
    count(products.id)::integer as total_products
  from public.business_catalogs catalogs
  left join public.business_catalog_products products
    on products.business_catalog_id = catalogs.id
  group by catalogs.owner_id
) as product_totals
where profiles.id = product_totals.owner_id;

update public.profiles
set product_limit = 0
where role <> 'seller';

comment on column public.profiles.product_limit is 'Maximum number of products a seller can have across all their catalogs.';
