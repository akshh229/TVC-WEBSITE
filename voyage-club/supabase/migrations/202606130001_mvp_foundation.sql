create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  slug text not null unique,
  category text not null check (char_length(category) between 2 and 60),
  date date not null,
  end_date date,
  location text not null check (char_length(location) between 2 and 160),
  status text not null default 'draft' check (status in ('upcoming', 'completed', 'draft')),
  registration_status text not null default 'open' check (registration_status in ('open', 'closed', 'waitlist')),
  summary text not null check (char_length(summary) between 10 and 600),
  description text,
  capacity integer check (capacity is null or capacity > 0),
  poster_url text,
  poster_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  role text not null check (char_length(role) between 2 and 100),
  department text not null check (char_length(department) between 2 and 100),
  group_name text not null default 'Core Team',
  bio text not null check (char_length(bio) between 10 and 600),
  image_url text,
  image_path text,
  image_alt text,
  linkedin_url text,
  instagram_url text,
  sort_order integer not null default 100,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  category text not null check (char_length(category) between 2 and 60),
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  media_url text,
  media_path text,
  thumbnail_url text,
  thumbnail_path text,
  alt_text text,
  caption text,
  event_date date,
  sort_order integer not null default 100,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  tier text not null default 'Partner',
  logo_url text,
  logo_path text,
  logo_alt text,
  website_url text,
  sort_order integer not null default 100,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  role text,
  quote text not null check (char_length(quote) between 10 and 800),
  image_url text,
  image_path text,
  image_alt text,
  sort_order integer not null default 100,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('general', 'collaboration', 'sponsorship')),
  name text not null check (char_length(name) between 2 and 100),
  email text not null,
  phone text,
  subject text not null check (char_length(subject) between 2 and 160),
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved', 'spam')),
  notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recruitment_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null,
  phone text not null,
  department text not null,
  year text not null,
  preferred_domain text not null,
  motivation text not null check (char_length(motivation) between 20 and 3000),
  status text not null default 'pending' check (status in ('pending', 'shortlisted', 'interview', 'accepted', 'rejected', 'withdrawn')),
  notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null,
  phone text not null,
  student_id text not null,
  program text not null,
  year text not null,
  interests text not null check (char_length(interests) between 10 and 3000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'waitlisted', 'withdrawn')),
  notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null,
  phone text not null,
  program text not null,
  status text not null default 'registered' check (status in ('registered', 'waitlisted', 'cancelled', 'attended', 'no_show')),
  notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists event_registrations_event_email_unique
  on public.event_registrations (event_id, lower(email));
create index if not exists events_public_date_idx on public.events (is_published, date);
create index if not exists team_public_order_idx on public.team_members (is_published, sort_order);
create index if not exists gallery_public_order_idx on public.gallery_items (is_published, event_date desc, sort_order);
create index if not exists contact_status_idx on public.contact_inquiries (status, created_at desc);
create index if not exists recruitment_status_idx on public.recruitment_applications (status, created_at desc);
create index if not exists membership_status_idx on public.membership_applications (status, created_at desc);
create index if not exists registrations_status_idx on public.event_registrations (status, created_at desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'events', 'team_members', 'gallery_items', 'sponsors', 'testimonials',
    'contact_inquiries', 'recruitment_applications', 'membership_applications',
    'event_registrations'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

alter table public.admin_users enable row level security;
alter table public.events enable row level security;
alter table public.team_members enable row level security;
alter table public.gallery_items enable row level security;
alter table public.sponsors enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.recruitment_applications enable row level security;
alter table public.membership_applications enable row level security;
alter table public.event_registrations enable row level security;

create policy "Users can verify own admin membership"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

create policy "Public reads published events"
on public.events for select
using (is_published = true and status <> 'draft');
create policy "Public reads published team"
on public.team_members for select using (is_published = true);
create policy "Public reads published gallery"
on public.gallery_items for select using (is_published = true);
create policy "Public reads published sponsors"
on public.sponsors for select using (is_published = true);
create policy "Public reads published testimonials"
on public.testimonials for select using (is_published = true);

create policy "Public submits contact inquiries"
on public.contact_inquiries for insert with check (status = 'new');
create policy "Public submits recruitment applications"
on public.recruitment_applications for insert with check (status = 'pending');
create policy "Public submits membership applications"
on public.membership_applications for insert with check (status = 'pending');
create policy "Public submits event registrations"
on public.event_registrations for insert with check (status in ('registered', 'waitlisted'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-site-media',
  'public-site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads site media"
on storage.objects for select
using (bucket_id = 'public-site-media');
create policy "Admins upload site media"
on storage.objects for insert to authenticated
with check (bucket_id = 'public-site-media' and public.is_admin());
create policy "Admins update site media"
on storage.objects for update to authenticated
using (bucket_id = 'public-site-media' and public.is_admin())
with check (bucket_id = 'public-site-media' and public.is_admin());
create policy "Admins delete site media"
on storage.objects for delete to authenticated
using (bucket_id = 'public-site-media' and public.is_admin());

