alter table public.profiles
  add column if not exists catalog_limit integer not null default 0;

update public.profiles profiles
set catalog_limit = case
  when profiles.role = 'seller' then coalesce(catalog_totals.total_catalogs, 0)
  else 0
end
from (
  select
    owner_id,
    count(id)::integer as total_catalogs
  from public.business_catalogs
  group by owner_id
) as catalog_totals
where profiles.id = catalog_totals.owner_id;

update public.profiles
set catalog_limit = 0
where role <> 'seller';

comment on column public.profiles.catalog_limit is 'Maximum number of catalogs a seller can have across the application.';
