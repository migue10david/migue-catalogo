create extension if not exists unaccent;

-- Helper: normalize a name into a URL-friendly slug (same logic as provinces/business_categories)
create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
  select
    regexp_replace(
      regexp_replace(
        regexp_replace(
          lower(unaccent(trim(input))),
          '[^a-z0-9]+', '-', 'g'
        ),
        '^-+|-+$', '', 'g'
      ),
      '-{2,}', '-', 'g'
    )
$$;

create or replace function public.generate_unique_business_catalog_slug(catalog_name text, catalog_id uuid default null)
returns text
language plpgsql
as $$
declare
  base_slug text;
  final_slug text;
  counter int := 1;
begin
  base_slug := public.slugify(catalog_name);

  if base_slug = '' then
    base_slug := 'catalog-' || left(coalesce(catalog_id::text, gen_random_uuid()::text), 8);
  end if;

  final_slug := base_slug;

  while exists (
    select 1
    from public.business_catalogs
    where slug = final_slug
      and (catalog_id is null or id <> catalog_id)
  ) loop
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  end loop;

  return final_slug;
end;
$$;

create or replace function public.set_business_catalog_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or btrim(new.slug) = '' then
    new.slug := public.generate_unique_business_catalog_slug(new.name, new.id);
  end if;

  return new;
end;
$$;

-- Add slug column (temporary default, will be overwritten by backfill)
alter table public.business_catalogs
  add column slug text not null default '';

-- Backfill existing catalogs with unique slugs
do $$
declare
  rec record;
  final_slug text;
begin
  for rec in select id, name from public.business_catalogs order by created_at loop
    final_slug := public.generate_unique_business_catalog_slug(rec.name, rec.id);
    update public.business_catalogs set slug = final_slug where id = rec.id;
  end loop;
end $$;

alter table public.business_catalogs
  alter column slug drop default;

-- Add unique constraint
alter table public.business_catalogs
  add constraint business_catalogs_slug_unique unique (slug);

-- Add check constraint: slug must not be blank
alter table public.business_catalogs
  add constraint business_catalogs_slug_not_blank check (btrim(slug) <> '');

-- Create index for fast lookups
create index business_catalogs_slug_idx
  on public.business_catalogs (slug);

create trigger set_business_catalog_slug_before_insert
  before insert on public.business_catalogs
  for each row
  execute function public.set_business_catalog_slug();

comment on column public.business_catalogs.slug is 'URL-friendly unique identifier generated from the catalog name at creation time.';
