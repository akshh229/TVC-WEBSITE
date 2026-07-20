drop extension if exists "pg_net";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.consume_rate_limit(p_key text, p_max integer, p_window_seconds integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

grant delete on table "public"."admin_users" to "anon";

grant insert on table "public"."admin_users" to "anon";

grant select on table "public"."admin_users" to "anon";

grant update on table "public"."admin_users" to "anon";

grant delete on table "public"."admin_users" to "authenticated";

grant insert on table "public"."admin_users" to "authenticated";

grant update on table "public"."admin_users" to "authenticated";

grant delete on table "public"."contact_inquiries" to "anon";

grant select on table "public"."contact_inquiries" to "anon";

grant update on table "public"."contact_inquiries" to "anon";

grant delete on table "public"."contact_inquiries" to "authenticated";

grant select on table "public"."contact_inquiries" to "authenticated";

grant update on table "public"."contact_inquiries" to "authenticated";

grant delete on table "public"."event_registrations" to "anon";

grant select on table "public"."event_registrations" to "anon";

grant update on table "public"."event_registrations" to "anon";

grant delete on table "public"."event_registrations" to "authenticated";

grant select on table "public"."event_registrations" to "authenticated";

grant update on table "public"."event_registrations" to "authenticated";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."gallery_items" to "anon";

grant insert on table "public"."gallery_items" to "anon";

grant update on table "public"."gallery_items" to "anon";

grant delete on table "public"."gallery_items" to "authenticated";

grant insert on table "public"."gallery_items" to "authenticated";

grant update on table "public"."gallery_items" to "authenticated";

grant delete on table "public"."membership_applications" to "anon";

grant select on table "public"."membership_applications" to "anon";

grant update on table "public"."membership_applications" to "anon";

grant delete on table "public"."membership_applications" to "authenticated";

grant select on table "public"."membership_applications" to "authenticated";

grant update on table "public"."membership_applications" to "authenticated";

grant delete on table "public"."rate_limit_buckets" to "anon";

grant insert on table "public"."rate_limit_buckets" to "anon";

grant select on table "public"."rate_limit_buckets" to "anon";

grant update on table "public"."rate_limit_buckets" to "anon";

grant delete on table "public"."rate_limit_buckets" to "authenticated";

grant insert on table "public"."rate_limit_buckets" to "authenticated";

grant select on table "public"."rate_limit_buckets" to "authenticated";

grant update on table "public"."rate_limit_buckets" to "authenticated";

grant delete on table "public"."recruitment_applications" to "anon";

grant select on table "public"."recruitment_applications" to "anon";

grant update on table "public"."recruitment_applications" to "anon";

grant delete on table "public"."recruitment_applications" to "authenticated";

grant select on table "public"."recruitment_applications" to "authenticated";

grant update on table "public"."recruitment_applications" to "authenticated";

grant delete on table "public"."sponsors" to "anon";

grant insert on table "public"."sponsors" to "anon";

grant update on table "public"."sponsors" to "anon";

grant delete on table "public"."sponsors" to "authenticated";

grant insert on table "public"."sponsors" to "authenticated";

grant update on table "public"."sponsors" to "authenticated";

grant delete on table "public"."team_members" to "anon";

grant insert on table "public"."team_members" to "anon";

grant update on table "public"."team_members" to "anon";

grant delete on table "public"."team_members" to "authenticated";

grant insert on table "public"."team_members" to "authenticated";

grant update on table "public"."team_members" to "authenticated";

grant delete on table "public"."testimonials" to "anon";

grant insert on table "public"."testimonials" to "anon";

grant update on table "public"."testimonials" to "anon";

grant delete on table "public"."testimonials" to "authenticated";

grant insert on table "public"."testimonials" to "authenticated";

grant update on table "public"."testimonials" to "authenticated";


