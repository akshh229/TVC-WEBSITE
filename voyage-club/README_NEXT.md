# The Voyage Club MVP

This folder now contains a Next.js + TypeScript MVP alongside the original static HTML files.

## Remaining implementation

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the phased production-readiness
roadmap, acceptance gates, testing strategy, content checklist, and launch definition of done.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Run `supabase/schema.sql` in the Supabase SQL editor.
5. Create an auth user for the admin.
6. Add that user ID to `public.admin_users`.

Without Supabase env vars, public forms run in demo mode and the admin page shows setup instructions.

## Asset slots still needed

- Hero club photograph
- About/story photograph
- Event posters
- Team portraits
- Gallery images and recap videos
- Sponsor logos
- Official club email and social links

Update placeholder contact/social values in `lib/content.ts`.
