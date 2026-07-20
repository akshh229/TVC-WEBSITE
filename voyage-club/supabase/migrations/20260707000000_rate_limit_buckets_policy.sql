-- rate_limit_buckets has RLS enabled but no policies, which the Supabase
-- advisor flags as "RLS Enabled No Policy". Behavior is intentional: only
-- the SECURITY DEFINER consume_rate_limit() function touches this table.
-- service_role already bypasses RLS, so this policy changes nothing at
-- runtime -- it exists to document intent and satisfy the linter.
create policy "service role manages rate limit buckets"
on public.rate_limit_buckets
for all
to service_role
using (true)
with check (true);
