create type public.seller_subscription_status as enum (
  'pending',
  'approved',
  'rejected'
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create table public.seller_subscription_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.seller_subscription_status not null default 'pending',
  notes text,
  admin_notes text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger on_seller_subscription_requests_updated
  before update on public.seller_subscription_requests
  for each row execute procedure public.set_updated_at();

create unique index seller_subscription_requests_one_pending_per_user_idx
  on public.seller_subscription_requests (user_id)
  where status = 'pending';

create index seller_subscription_requests_user_id_idx
  on public.seller_subscription_requests (user_id);

create index seller_subscription_requests_status_created_at_idx
  on public.seller_subscription_requests (status, created_at desc);

alter table public.seller_subscription_requests enable row level security;
alter table public.seller_subscription_requests force row level security;

create policy "Users can create their own seller request"
on public.seller_subscription_requests
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'user'
  )
);

create policy "Users can read their own seller requests"
on public.seller_subscription_requests
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Admins can read all seller requests"
on public.seller_subscription_requests
for select
to authenticated
using ((select public.is_admin()));

create policy "Admins can update seller requests"
on public.seller_subscription_requests
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create or replace function public.approve_seller_subscription_request(
  p_request_id uuid,
  p_admin_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  update public.seller_subscription_requests
  set status = 'approved',
      admin_notes = p_admin_notes,
      reviewed_by = auth.uid(),
      reviewed_at = timezone('utc', now())
  where id = p_request_id
    and status = 'pending'
  returning user_id into v_user_id;

  if v_user_id is null then
    raise exception 'Request not found or already reviewed';
  end if;

  update public.profiles
  set role = 'seller'
  where id = v_user_id;
end;
$$;

create or replace function public.reject_seller_subscription_request(
  p_request_id uuid,
  p_admin_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  update public.seller_subscription_requests
  set status = 'rejected',
      admin_notes = p_admin_notes,
      reviewed_by = auth.uid(),
      reviewed_at = timezone('utc', now())
  where id = p_request_id
    and status = 'pending';

  if not found then
    raise exception 'Request not found or already reviewed';
  end if;
end;
$$;

comment on table public.seller_subscription_requests is 'Requests from regular users who want seller access.';
comment on function public.is_admin() is 'Returns true when the current authenticated user has the admin role.';
comment on function public.approve_seller_subscription_request(uuid, text) is 'Approves a pending seller request and promotes the user to seller.';
comment on function public.reject_seller_subscription_request(uuid, text) is 'Rejects a pending seller request.';
