-- Supabase projects created after 2026-05-30 may not expose SQL-created
-- public tables to the Data API unless roles are granted access explicitly.
-- RLS policies in the earlier migrations still decide which rows are visible.

grant usage on schema public to anon, authenticated, service_role;

grant select on table
  public.events,
  public.team_members,
  public.gallery_items,
  public.sponsors,
  public.testimonials
to anon, authenticated;

grant insert on table
  public.contact_inquiries,
  public.recruitment_applications,
  public.membership_applications,
  public.event_registrations
to anon, authenticated;

grant select on table public.admin_users to authenticated;

grant execute on function public.is_admin() to authenticated;

-- Advisor fixes for the foundation migration:
-- - make auth.uid() an initplan in the admin lookup policy
-- - pin the trigger helper search_path so it cannot be influenced by callers
drop policy if exists "Users can verify own admin membership" on public.admin_users;
create policy "Users can verify own admin membership"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

alter function public.set_updated_at() set search_path = public;

-- The service-role client powers authenticated admin reads and mutations.
-- RLS remains the authorization boundary for public roles; the secret key is
-- used only by server-side code after requireAdmin() succeeds.
grant select, insert, update, delete on table
  public.admin_users,
  public.events,
  public.team_members,
  public.gallery_items,
  public.sponsors,
  public.testimonials,
  public.contact_inquiries,
  public.recruitment_applications,
  public.membership_applications,
  public.event_registrations,
  public.rate_limit_buckets
to service_role;

-- Rate limiting is an internal server operation. Do not expose an arbitrary
-- security-definer write function to holders of the public browser key.
revoke execute on function public.consume_rate_limit(text, integer, integer) from anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
