-- Security hardening: tighten public insert policies and add a
-- serverless-safe rate limiter backed by Postgres.

-- 1. Restrict public submission inserts to user-supplied columns only.
--    The previous policies only checked `status`, which let an anon-key
--    holder set reviewer/notes columns directly through the REST API and
--    bypass the server action's Zod validation. Force the moderation
--    columns to their defaults on insert.

drop policy if exists "Public submits contact inquiries" on public.contact_inquiries;
create policy "Public submits contact inquiries"
on public.contact_inquiries for insert
with check (
  status = 'new'
  and notes is null
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists "Public submits recruitment applications" on public.recruitment_applications;
create policy "Public submits recruitment applications"
on public.recruitment_applications for insert
with check (
  status = 'pending'
  and notes is null
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists "Public submits membership applications" on public.membership_applications;
create policy "Public submits membership applications"
on public.membership_applications for insert
with check (
  status = 'pending'
  and notes is null
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists "Public submits event registrations" on public.event_registrations;
create policy "Public submits event registrations"
on public.event_registrations for insert
with check (
  status in ('registered', 'waitlisted')
  and notes is null
  and reviewed_at is null
  and reviewed_by is null
);

-- 2. Postgres-backed fixed-window rate limiter.
--    The in-memory Map in the app does not work across serverless
--    instances. This table + security-definer RPC give a shared counter.

create table if not exists public.rate_limit_buckets (
  key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null
);

alter table public.rate_limit_buckets enable row level security;
-- No policies: only the security-definer function below may touch this table.

create or replace function public.consume_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_count integer;
begin
  insert into public.rate_limit_buckets (key, count, reset_at)
  values (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  on conflict (key) do update
    set count = case
                  when public.rate_limit_buckets.reset_at <= v_now then 1
                  else public.rate_limit_buckets.count + 1
                end,
        reset_at = case
                     when public.rate_limit_buckets.reset_at <= v_now
                       then v_now + make_interval(secs => p_window_seconds)
                     else public.rate_limit_buckets.reset_at
                   end
  returning count into v_count;

  -- true = request allowed, false = limit exceeded
  return v_count <= p_max;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to anon, authenticated;

-- Optional housekeeping: drop expired buckets. Schedule with pg_cron if available.
create index if not exists rate_limit_buckets_reset_idx
  on public.rate_limit_buckets (reset_at);
