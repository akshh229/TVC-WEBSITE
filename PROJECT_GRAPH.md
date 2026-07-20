# Project Graph

Generated: July 7, 2026

This is a whole-workspace map for `D:/TVC WEBSITE`. The active production-oriented app is `voyage-club`; `tvc website` is a separate older Next.js template/prototype.

## Workspace Map

```mermaid
flowchart TD
  Root["D:/TVC WEBSITE"]
  Root --> Agents[".agents/"]
  Root --> Claude[".claude/"]
  Root --> Skills["skills-lock.json"]
  Root --> VC["voyage-club/"]
  Root --> Old["tvc website/"]

  VC --> VCApp["app/ routes"]
  VC --> VCComponents["components/ UI + forms"]
  VC --> VCLib["lib/ data, actions, auth, validation"]
  VC --> VCSupabase["supabase/ migrations, schema, seed"]
  VC --> VCPublic["public/ media assets"]
  VC --> VCPlan["IMPLEMENTATION_PLAN.md"]

  Old --> OldApp["app/"]
  Old --> OldComponents["components/ Grainient + theme"]
  Old --> OldLib["lib/utils.ts"]
  Old --> OldConfig["shadcn / Tailwind-oriented config"]
```

## Runtime Architecture

```mermaid
flowchart LR
  Browser["Browser"]
  Proxy["proxy.ts"]
  Layout["app/layout.tsx"]
  HeaderFooter["SiteHeader + SiteFooter + global interactions"]

  subgraph Public["Public pages"]
    PublicHub["public route group"]
    Home["/"]
    About["/about"]
    Team["/team"]
    Events["/events"]
    Gallery["/gallery"]
    Recruitment["/recruitment"]
    Membership["/membership"]
    Contact["/contact"]
    Privacy["/privacy"]
    Dashboard["/dashboard"]
  end

  subgraph Admin["Admin surface"]
    AdminPage["/admin"]
    AdminPanel["AdminContentPanel / AdminSubmissionPanel"]
    AdminNav["AdminNav"]
  end

  subgraph Components["Shared components"]
    SmartForm["SmartForm"]
    ManagedMedia["ManagedMedia"]
    SectionHeader["SectionHeader"]
    ClientFx["Typewriter / CountUp / ScrollReveal / GalleryTape"]
  end

  subgraph Lib["Server and domain layer"]
    Data["lib/data.ts"]
    Actions["lib/actions.ts"]
    AdminData["lib/admin-data.ts"]
    Auth["lib/auth.ts"]
    Validation["lib/validation.ts"]
    Content["lib/content.ts"]
    Notifications["lib/notifications.ts"]
    SupabaseServer["lib/supabase/server.ts"]
    SupabaseClient["lib/supabase/client.ts"]
  end

  subgraph External["External services"]
    Supabase["Supabase Auth / Postgres / Storage"]
    Resend["Resend email API"]
  end

  Browser --> Proxy --> Layout --> HeaderFooter
  Layout --> PublicHub
  Layout --> AdminPage

  PublicHub --> Home
  PublicHub --> About
  PublicHub --> Team
  PublicHub --> Events
  PublicHub --> Gallery
  PublicHub --> Recruitment
  PublicHub --> Membership
  PublicHub --> Contact
  PublicHub --> Privacy
  PublicHub --> Dashboard
  PublicHub --> ManagedMedia
  PublicHub --> SectionHeader
  PublicHub --> ClientFx
  PublicHub --> Data
  PublicHub --> Content
  PublicHub --> SmartForm

  AdminPage --> Auth
  AdminPage --> AdminData
  AdminPage --> AdminPanel
  AdminPanel --> AdminNav
  AdminPanel --> SmartForm

  SmartForm --> Actions
  Data --> SupabaseServer
  Actions --> Validation
  Actions --> SupabaseServer
  Actions --> Notifications
  Actions --> Auth
  AdminData --> Auth
  AdminData --> SupabaseServer
  Auth --> SupabaseServer
  SupabaseServer --> Supabase
  SupabaseClient --> Supabase
  Notifications --> Resend
```

## Public Submission Flow

```mermaid
sequenceDiagram
  actor Visitor
  participant Page as Public route
  participant Form as components/forms.tsx
  participant Actions as lib/actions.ts
  participant Validation as lib/validation.ts
  participant Supabase as Supabase Postgres
  participant Notify as lib/notifications.ts
  participant Admin as /admin dashboard

  Visitor->>Page: Fill contact / recruitment / membership / event form
  Page->>Form: Render SmartForm with bound server action
  Form->>Actions: Submit FormData
  Actions->>Validation: Zod safeParse
  Actions->>Supabase: consume_rate_limit RPC when service key exists
  Actions->>Supabase: insert public submission row
  Actions->>Notify: send admin email if Resend env exists
  Actions->>Admin: revalidate /admin
  Actions-->>Form: ActionResult with success or field errors
```

## Admin Flow

```mermaid
flowchart TD
  AdminUser["Admin user"]
  Login["/admin login form"]
  SignIn["signInAdmin()"]
  AuthUser["Supabase auth user"]
  Allowlist["public.admin_users"]
  RequireAdmin["requireAdmin()"]
  Dashboard["Admin dashboard"]
  ContentCRUD["create/update/delete content"]
  SubmissionReview["update submissions"]
  Upload["uploadImage()"]
  Revalidate["revalidatePath()"]

  AdminUser --> Login --> SignIn --> AuthUser
  AuthUser --> Allowlist --> RequireAdmin --> Dashboard
  Dashboard --> ContentCRUD
  Dashboard --> SubmissionReview
  ContentCRUD --> Upload
  ContentCRUD --> Revalidate
  SubmissionReview --> Revalidate
```

## Database And Storage Graph

```mermaid
erDiagram
  auth_users {
    uuid id PK
  }

  admin_users {
    uuid user_id PK
    timestamptz created_at
  }

  events {
    uuid id PK
    text title
    text slug UK
    date date
    text status
    text registration_status
    integer capacity
    boolean is_published
  }

  team_members {
    uuid id PK
    text name
    text role
    text group_name
    integer sort_order
    boolean is_published
  }

  gallery_items {
    uuid id PK
    text title
    text media_type
    text media_url
    text media_path
    integer sort_order
    boolean is_published
  }

  sponsors {
    uuid id PK
    text name
    text tier
    text logo_url
    integer sort_order
    boolean is_published
  }

  testimonials {
    uuid id PK
    text name
    text quote
    integer sort_order
    boolean is_published
  }

  contact_inquiries {
    uuid id PK
    text kind
    text email
    text status
    uuid reviewed_by FK
  }

  recruitment_applications {
    uuid id PK
    text email
    text preferred_domain
    text status
    uuid reviewed_by FK
  }

  membership_applications {
    uuid id PK
    text email
    text student_id
    text status
    uuid reviewed_by FK
  }

  event_registrations {
    uuid id PK
    uuid event_id FK
    text email
    text status
    uuid reviewed_by FK
  }

  rate_limit_buckets {
    text key PK
    integer count
    timestamptz reset_at
  }

  auth_users ||--o| admin_users : allowlisted_as
  events ||--o{ event_registrations : receives
  auth_users ||--o{ contact_inquiries : reviews
  auth_users ||--o{ recruitment_applications : reviews
  auth_users ||--o{ membership_applications : reviews
  auth_users ||--o{ event_registrations : reviews
```

Storage bucket:

- `public-site-media`: public read, admin upload/update/delete, 5 MB file limit, image MIME allowlist.

## Import Hubs

| Hub | Role | Main dependents |
| --- | --- | --- |
| `lib/actions.ts` | Server actions for public forms, admin auth, content CRUD, media upload, submission review | public form pages, `components/admin-panel.tsx` |
| `lib/data.ts` | Published content reads with demo fallbacks outside production | home, team, events, gallery |
| `lib/admin-data.ts` | Admin-only reads and counts | `app/admin/page.tsx` |
| `lib/auth.ts` | Current user lookup, admin allowlist checks, required admin guard | admin page, admin data, admin mutations |
| `lib/validation.ts` | Zod schemas for public and admin forms | `lib/actions.ts`, validation tests |
| `lib/supabase/server.ts` | SSR Supabase client and service-role client | data, auth, actions, admin page |
| `components/forms.tsx` | Client SmartForm wrapper for `useActionState` | public forms and admin panels |
| `components/admin-panel.tsx` | Admin CRUD/review UI | `app/admin/page.tsx` |

## Route To Data Map

| Route | Reads | Writes / actions |
| --- | --- | --- |
| `/` | `getEvents`, `getGalleryItems`, `getSponsors`, `getTestimonials`, `lib/content.ts` | none |
| `/about` | mostly static content/media | none |
| `/team` | `getTeamMembers` | none |
| `/events` | `getEvents` | `submitEventRegistration` |
| `/gallery` | `getGalleryItems`, `lib/content.ts` | none |
| `/recruitment` | `lib/content.ts` | `submitRecruitmentApplication` |
| `/membership` | page content | `submitMembershipApplication` |
| `/contact` | `siteConfig` / social config | `submitContactInquiry` |
| `/admin` | `getCurrentUser`, `isCurrentUserAdmin`, `getAdminCounts`, `getAdminContent`, `getAdminSubmissions` | `signInAdmin`, `signOutAdmin`, `createContent`, `updateContent`, `deleteContent`, `updateSubmission` |

## Key Implementation Boundaries

- Public reads use anon/SSR Supabase access and RLS-filtered published rows.
- Public writes go through server actions, Zod validation, honeypot fields, rate limiting, and insert-only RLS.
- Admin reads and writes use the service-role client only after `requireAdmin()` checks Supabase Auth plus `public.admin_users`.
- Media uploads are centralized in `uploadImage()` and currently target `public-site-media`.
- `proxy.ts` is the request-time Supabase session refresh point for Next.js 16; the plan explicitly says not to add duplicate middleware.
- `tvc website` appears separate from the active MVP and still reads like a template app.

## Graph-Based Hotspots

- `lib/actions.ts` is the largest behavioral hub. Any change here can affect public submissions, admin CRUD, media uploads, auth redirects, notifications, and cache revalidation.
- `app/admin/page.tsx` is a combined login, authorization, dashboard, content management, and queue routing surface. Future admin growth will likely benefit from route or component splitting.
- `components/admin-panel.tsx` owns field configuration for all content tables and all submission queue rendering. Schema/UI drift is the main risk here.
- Supabase migrations are the true contract for tables, policies, storage, and RPC behavior. Keep `lib/validation.ts`, admin field config, and migrations synchronized.
- The old `tvc website` app can confuse maintainers unless it is clearly archived, removed, or documented as legacy.

## Suggested Next Graphs

- Add CI-generated import graphs after the app stabilizes, for example with `madge` or `dependency-cruiser`.
- Add a C4 container diagram to `IMPLEMENTATION_PLAN.md` once deployment environments are final.
- Add a Supabase policy matrix beside the ERD for anonymous, authenticated non-admin, admin, and service-role access.
