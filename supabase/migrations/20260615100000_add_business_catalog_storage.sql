insert into storage.buckets (id, name, public)
values ('business-catalog-media', 'business-catalog-media', true)
on conflict (id) do nothing;

create policy "Public can view business catalog media"
on storage.objects
for select
to public
using (bucket_id = 'business-catalog-media');

create policy "Sellers can upload their own business catalog media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'business-catalog-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'seller'
  )
);

create policy "Sellers can update their own business catalog media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'business-catalog-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'business-catalog-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Sellers can delete their own business catalog media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'business-catalog-media'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select public.is_admin())
  )
);
