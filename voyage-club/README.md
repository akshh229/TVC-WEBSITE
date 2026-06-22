# The Voyage Club Website

Production-oriented MVP for The Voyage Club at Chandigarh University.

## Stack

- Next.js 16 and React 19
- TypeScript
- Supabase Postgres, Auth, and Storage
- Vercel

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The service-role key is server-only and must never use a `NEXT_PUBLIC_` prefix.

## Supabase Setup

Apply the files in `supabase/migrations/`, create an Auth user for each approved
administrator, and add those user IDs to `public.admin_users`.

Next.js 16 uses the root `proxy.ts` file for request-time Supabase session refresh.
Do not add a duplicate `middleware.ts`.

## Quality Checks

```bash
npm run check
```

The command runs lint, TypeScript checking, tests, and a production build.

## Project Status

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the remaining launch work,
content requirements, acceptance gates, and security notes.

Official club email and YouTube values still need to be supplied in `lib/content.ts`.
