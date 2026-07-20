-- The remote schema baseline revealed legacy default grants that permit
-- anonymous and authenticated roles to attempt writes outside the site's
-- intended public API. RLS remains the row-level boundary, while these grants
-- keep the Data API surface deliberately narrow.
revoke all privileges on table
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
from anon, authenticated;

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
