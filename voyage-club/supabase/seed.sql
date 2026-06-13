-- Development seed data. Do not run in production without reviewing the content.
insert into public.events (
  title, slug, category, date, location, status, registration_status,
  summary, capacity, is_published
) values
  (
    'Innovation Summit 2026',
    'innovation-summit-2026',
    'Workshop',
    '2026-07-15',
    'Auditorium Block A',
    'upcoming',
    'open',
    'A full-day program connecting student innovators with mentors, founders, and practical build sessions.',
    300,
    true
  ),
  (
    'Leaders Connect 2026',
    'leaders-connect-2026',
    'Networking',
    '2026-08-03',
    'Conference Hall',
    'upcoming',
    'open',
    'An alumni and industry networking evening for students preparing to lead teams and initiatives.',
    150,
    true
  )
on conflict (slug) do nothing;

