# The Voyage Club MVP

This folder contains the active Next.js + TypeScript application. The retired static
HTML prototype has been removed.

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
4. Apply the SQL files in `supabase/migrations/`.
5. Create an auth user for the admin.
6. Add that user ID to `public.admin_users`.

Without Supabase env vars, production submissions fail safely. Local demo-mode success
requires `NEXT_PUBLIC_ENABLE_DEMO_DATA=true`.

Next.js 16 uses `proxy.ts` for Supabase session refresh. Do not create a duplicate
`middleware.ts`.

## Asset slots still needed

- Hero club photograph
- About/story photograph
- Event posters
- Team portraits
- Recap videos
- Sponsor logos
- Official club email and social links

Update placeholder contact/social values in `lib/content.ts`.
