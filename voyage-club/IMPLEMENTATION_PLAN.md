# The Voyage Club MVP - Remaining Implementation Plan

**Prepared:** June 13, 2026  
**Last reviewed:** June 22, 2026
**Current completion estimate:** 65-70% overall
**Target:** Launch-ready public website with admin-only content and application management  
**Stack:** Next.js 16, React 19, TypeScript, Supabase, Vercel

## Audit Remediation - June 22, 2026

Completed:

- Migrated fallback gallery media away from Google Drive to compressed local assets.
- Added meaningful fallback gallery alt text.
- Removed the obsolete Google Drive image configuration.
- Confirmed that Next.js 16 runs the existing root `proxy.ts`; no duplicate
  `middleware.ts` should be created.
- Removed the unused duplicate `utils/supabase/` clients.
- Fixed the five-item homepage statistics grid.
- Added a basic per-instance, per-IP throttle to public Server Actions.
- Made capacity-limited registration fail closed when the service client or count query
  is unavailable.
- Removed the retired static HTML/CSS/JS site and legacy event assets.
- Removed duplicate root background videos and the unused public background video.
- Re-encoded the active background loop from 50.2 MB to under 400 KB.

Still requires project-owner input or infrastructure:

- Supply the official club email and YouTube channel URL.
- Move public-form throttling to a shared durable store if traffic or abuse requires
  enforcement across multiple Vercel instances.
- Run authenticated admin/session and Supabase RLS integration tests against the
  deployed project.

## 1. Objective

Finish the existing Next.js migration and turn it into a production-ready MVP that:

- Presents eight polished public pages with real club content and media.
- Persists all public submissions in Supabase.
- Gives approved administrators secure content and application-management workflows.
- Uses Supabase Storage for club-managed images and videos.
- Meets baseline WCAG 2.2 AA accessibility expectations.
- Passes lint, type checking, production build, and automated browser smoke tests.
- Can be deployed and operated by a small student team without a custom backend service.

## 2. Scope Lock

### In MVP

- Public routes: Home, About, Team, Events, Gallery, Recruitment, Membership, Contact.
- Admin authentication and authorization.
- Admin CRUD for events, team members, gallery items, sponsors, and testimonials.
- Admin review/status workflows for contact inquiries, recruitment applications,
  membership applications, and event registrations.
- Supabase Storage uploads for public media.
- Server-side validation, useful error messages, loading states, and duplicate protection.
- Responsive layouts and accessible navigation/forms/dialogs.
- Production deployment, monitoring, documentation, and launch checklist.

### Explicitly Not In MVP

- Member accounts or member authentication.
- Personalized member dashboard, attendance, certificates, renewals, or payments.
- Public user profiles.
- Real-time chat or notifications.
- Native mobile applications.
- Complex analytics platform.
- Multi-tenant support.
- Automated email marketing workflows.
- A separate Express/NestJS backend.

The existing `/dashboard` route should remain an honest Phase 2 information page or be
removed from public navigation. It must not simulate a working member portal.

## 3. Working Assumptions

- Traffic remains below roughly 5,000 users per month.
- There are fewer than ten administrators.
- Supabase Free or Pro is sufficient for launch.
- Club administrators are trusted operators, but all authorization is still enforced
  server-side.
- The club will provide official names, contact details, social URLs, photographs,
  event information, sponsor logos, and consent to publish media.
- English is the only launch language.
- WCAG 2.2 AA is the accessibility target.
- Desktop Chrome, Firefox, Safari, and Edge plus current Android/iOS browsers are the
  supported browser set.

## 4. Architecture Decisions

### ADR-001: Keep A Modular Next.js Monolith

**Decision:** Keep presentation, reads, and mutations in the Next.js application.

**Rationale:**

- The product is a small CRUD-heavy club website.
- Server Components and Server Actions already fit the implementation.
- A separate API would add deployment, authentication, and maintenance overhead.

**Trade-off:** The web application and backend operations remain coupled. Revisit only
if another client, such as a native app, needs a stable public API.

### ADR-002: Supabase Is The Source Of Truth

**Decision:** Use Supabase Postgres, Auth, and Storage for all persisted MVP data.

**Rationale:**

- It matches the selected stack and existing code.
- It gives the club a fallback operations console.
- It avoids operating additional infrastructure.

**Trade-off:** The application depends on Supabase conventions and availability.

### ADR-003: Authorization Uses An Admin Table And Server Checks

**Decision:** Treat membership in `public.admin_users` as the authoritative admin role.
Do not trust user-editable `user_metadata`.

**Rationale:**

- Authorization must not be controlled by editable profile data.
- A database-backed allowlist is simple and auditable.

**Implementation rule:** Every admin read or mutation must call a shared server-only
authorization helper. Service-role access must never be exposed to the browser.

### ADR-004: Server Actions For Mutations

**Decision:** Continue using validated Server Actions for forms and admin commands.

**Rationale:**

- No external API consumer exists.
- It reduces duplicated request/response plumbing.
- It supports progressive enhancement and typed validation.

**Trade-off:** If public APIs are required later, action logic should be extracted into
service functions before adding route handlers.

### ADR-005: Database Metadata Plus Storage Objects

**Decision:** Store media files in Supabase Storage and store metadata/relationships in
Postgres.

**Rationale:**

- Files should not be encoded into database rows.
- Metadata remains queryable and editable.
- Object paths can be controlled and cleaned up during replacement/deletion.

## 5. Target Application Structure

```text
app/
  (public)/
    page.tsx
    about/page.tsx
    team/page.tsx
    events/page.tsx
    gallery/page.tsx
    recruitment/page.tsx
    membership/page.tsx
    contact/page.tsx
  admin/
    layout.tsx
    login/page.tsx
    page.tsx
    events/page.tsx
    team/page.tsx
    gallery/page.tsx
    sponsors/page.tsx
    testimonials/page.tsx
    submissions/[type]/page.tsx
  actions/
    public.ts
    admin.ts
components/
  public/
  admin/
  forms/
  media/
lib/
  auth/
  data/
  validation/
  supabase/
  constants/
supabase/
  migrations/
tests/
  e2e/
  fixtures/
```

This is a target organization, not a mandate for a large refactor. Move files only when
the move makes the next feature clearer or safer.

## 6. Delivery Strategy

### Recommended Sequence

1. Stabilize tooling and security.
2. Finalize schema, RLS, and Storage.
3. Build the admin shell and full content CRUD.
4. Build submission review workflows.
5. Render real media and complete public-page UX.
6. Add accessibility, automated tests, and operational safeguards.
7. Load real content, deploy, and run launch acceptance.

Security and persistence come before visual finishing because public content and admin
features depend on trustworthy data access.

## 7. Phase 0 - Project Hygiene And Baseline

**Goal:** Make the repository predictable before feature work.

### P0-01 Fix The Lint Toolchain

- Pin ESLint to a version supported by `eslint-config-next@16.2.9`.
- Regenerate `package-lock.json`.
- Run `npm ls` and confirm no invalid peer dependencies.
- Make `npm run lint` pass without disabling meaningful rules.

**Likely files:** `package.json`, `package-lock.json`, `eslint.config.mjs`

**Acceptance:**

- `npm run lint` exits with code 0.
- `npx tsc --noEmit` exits with code 0.
- `npm run build` exits with code 0.

### P0-02 Establish Version-Control Hygiene

- Add or verify `.gitignore` for `.next`, `.env*`, Playwright artifacts, coverage, and
  local Supabase output.
- Make the first clean baseline commit after confirming secrets are absent.
- Add a branch/PR workflow appropriate for the team.

### P0-03 Archive The Legacy Static Site

- Move legacy HTML/CSS/JS to `legacy-static/` or delete it after confirming it is no
  longer needed.
- Keep a short migration note if archived.
- Ensure the broken `css/home.css` reference is no longer part of the active product.
- Remove outdated setup instructions from the root README.

**Acceptance:** There is one obvious application entry point and one current setup guide.

### P0-04 Improve Environment Documentation

- Document local, preview, and production environment variables.
- Add comments explaining which keys may be public.
- State that `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- Add a startup/configuration check that reports missing variables safely.

## 8. Phase 1 - Database, Authorization, And Storage Foundation

**Goal:** Make Supabase secure, reproducible, and ready for admin workflows.

### P1-01 Convert Schema Into Ordered Migrations

- Replace the single ad hoc schema file with timestamped migrations.
- Keep migrations idempotent where practical.
- Include indexes, constraints, policies, storage setup, and seed data separately.
- Document local reset and production migration procedures.

### P1-02 Correct Admin Authorization

- Remove `user.user_metadata.role === "admin"` as an authorization source.
- Add a secure `is_admin()` SQL function or an RLS policy allowing a user to read only
  their own `admin_users` record.
- Keep the service-role client server-only.
- Add `requireAdmin()` that redirects or returns a typed unauthorized result.
- Apply the helper in the admin layout and every admin mutation.
- Decide whether non-admin authenticated users are signed out or shown an access-denied
  screen.

**Acceptance:**

- Anonymous visitor cannot access any admin data.
- Authenticated non-admin cannot access admin data or mutations.
- A user listed in `admin_users` can access the admin area.
- Changing browser-submitted metadata cannot grant admin access.

### P1-03 Strengthen The Data Model

Add or revise:

- `updated_at` columns and update triggers.
- `created_by` / `updated_by` on admin-managed content where useful.
- `slug` for events if event detail URLs are included.
- `is_published` or a consistent publication status.
- `sort_order` on all ordered public content.
- Status check constraints for every review queue.
- `notes` and `reviewed_at` for application workflows.
- `reviewed_by` foreign key to the reviewing auth user where practical.
- A UUID foreign key from `event_registrations.event_id` to `events.id`.
- Unique protection for duplicate event registrations, such as
  `(event_id, lower(email))`.
- Optional duplicate/rate-control fields for public forms.

### P1-04 Define RLS Policies Explicitly

Create a policy matrix:

| Resource | Anonymous | Authenticated Non-Admin | Admin |
|---|---|---|---|
| Published content | Read | Read | Full CRUD |
| Draft content | None | None | Full CRUD |
| Public submissions | Insert only | Insert only | Read/update/delete |
| Admin users | None | Own membership check only | Managed out-of-band initially |
| Storage public media | Read | Read | Upload/update/delete |

Test every policy with anonymous, non-admin, and admin clients.

### P1-05 Create Storage Buckets

Recommended buckets:

- `public-site-media`: public read, admin write.
- `private-submission-files`: private read/write if file attachments are added.

Recommended object paths:

```text
events/{event-id}/{uuid}-{filename}
team/{member-id}/{uuid}-{filename}
gallery/{year}/{event-or-category}/{uuid}-{filename}
sponsors/{sponsor-id}/{uuid}-{filename}
testimonials/{testimonial-id}/{uuid}-{filename}
```

### P1-06 Upload Security Rules

- Allowlist MIME types.
- Set file-size limits.
- Generate collision-resistant paths.
- Sanitize original file names.
- Reject executable or unsupported formats.
- Prefer WebP/AVIF/JPEG/PNG for images.
- Prefer external video embeds for large videos unless Supabase storage limits are
  explicitly accepted.
- Delete replaced objects after the database update succeeds.
- Do not delete shared/default assets.

### P1-07 Seed And Test Data

- Add seed content for local development only.
- Include one admin-managed item for each content type.
- Include submissions in each workflow state.
- Keep production content loading separate from development seeds.

## 9. Phase 2 - Admin Experience

**Goal:** Replace the single creation page with a usable operations workspace.

### P2-01 Admin Information Architecture

Create a restrained operations layout with:

- Sidebar or compact top navigation.
- Dashboard overview.
- Events.
- Team.
- Gallery.
- Sponsors.
- Testimonials.
- Contact inquiries.
- Recruitment applications.
- Membership applications.
- Event registrations.
- Sign out and current-user identity.

Use tables/lists for operational data, not marketing-style cards.

### P2-02 Shared Admin Components

Build:

- `AdminShell`
- `AdminNav`
- `DataTable`
- `StatusBadge`
- `EmptyState`
- `Pagination`
- `SearchInput`
- `FilterBar`
- `ConfirmDialog`
- `FormField`
- `MediaUploader`
- `SaveBar`
- `Toast` or accessible live-region notices

All destructive actions need confirmation and a clear result message.

### P2-03 Content CRUD

For events, team, gallery, sponsors, and testimonials:

- List records.
- Search and filter.
- Create.
- Edit.
- Publish/unpublish.
- Reorder where ordering matters.
- Delete with confirmation.
- Preview the public result.
- Validate server-side with Zod.
- Revalidate affected public routes after mutations.

### P2-04 Events Management

Fields:

- Title.
- Slug if event detail pages are used.
- Category.
- Summary and optional full description.
- Start date/time and optional end date/time.
- Venue/location.
- Capacity.
- Registration status.
- Publication status.
- Poster.
- Optional external registration URL.

Useful behavior:

- Upcoming/past classification derived from dates, not manually duplicated.
- Capacity can be blank for unlimited registration.
- Admin can export registrations as CSV.
- Event deletion is prevented or requires explicit handling when registrations exist.

### P2-05 Team Management

- Name, role, department/domain, biography.
- Portrait upload.
- Social links.
- Display order.
- Active/archived status.
- Optional team grouping such as faculty, core, lead, executive.

### P2-06 Gallery Management

- Upload one or multiple images.
- Add title, category, event date, alt text, and optional caption.
- Support YouTube links for video items.
- Generate or require thumbnails for video.
- Reorder and publish/unpublish items.
- Avoid uploading large raw video files unless the club explicitly chooses that cost.

### P2-07 Sponsor And Testimonial Management

- Sponsor name, tier/category, logo, website, order, published state.
- Testimonial quote, person, role, portrait, order, published state.
- Render these sections only when published records exist.

### P2-08 Submission Queues

Each queue needs:

- Paginated list.
- Search by name/email/student ID where relevant.
- Filter by status and date.
- Detail view or accessible side panel/dialog.
- Status transitions.
- Internal notes.
- Reviewer and review timestamp.
- CSV export.
- Delete or anonymize operation with confirmation.

Suggested statuses:

- Contact: `new`, `in_progress`, `resolved`, `spam`.
- Recruitment: `pending`, `shortlisted`, `interview`, `accepted`, `rejected`,
  `withdrawn`.
- Membership: `pending`, `approved`, `rejected`, `waitlisted`, `withdrawn`.
- Event registration: `registered`, `waitlisted`, `cancelled`, `attended`,
  `no_show`.

### P2-09 Admin Dashboard Metrics

Show only useful operating metrics:

- Upcoming events.
- New inquiries.
- Pending recruitment applications.
- Pending membership applications.
- Registrations per upcoming event.
- Recently updated content.

No charting library is needed unless a real decision requires charts.

## 10. Phase 3 - Public Data And Form Reliability

**Goal:** Make every public workflow trustworthy and launch-friendly.

### P3-01 Separate Demo Mode From Production

- Production must never report a successful submission without persistence.
- Demo fallback content can remain for local development only.
- In production, missing Supabase configuration should produce an operational error and
  monitoring signal.
- Add an environment flag if explicit demo behavior is still useful.

### P3-02 Shared Validation

- Create shared Zod schemas for server actions and form field constraints.
- Add useful length limits.
- Normalize email casing and phone formatting where appropriate.
- Trim strings and reject whitespace-only values.
- Validate URLs and dates.
- Return field-level errors, not only one generic message.

### P3-03 Spam And Abuse Protection

Recommended MVP controls:

- Honeypot field.
- Server-side minimum completion time.
- Per-IP or fingerprint rate limiting through a Vercel-compatible service if abuse
  appears.
- Optional Cloudflare Turnstile for public forms.
- Duplicate submission checks.
- Avoid logging full sensitive form payloads.

Start with honeypot plus duplicate checks; add CAPTCHA only if needed.

### P3-04 Form UX

For every form:

- Disable duplicate submit while pending.
- Preserve entered values after validation failure.
- Display field-specific errors.
- Announce errors and success through live regions.
- Move focus to the error summary after failure.
- Clear or replace the form after confirmed success.
- State expected next steps and response time.
- Include consent/privacy wording where personal data is collected.

### P3-05 Event Registration Rules

- Only allow registration for published, open, future events.
- Enforce capacity or waitlist behavior.
- Prevent duplicate registration.
- Show a clear closed/full state.
- Include event identity in the confirmation.

### P3-06 Data Retention

Document retention defaults:

- Spam inquiries: remove after 30 days.
- General inquiries: retain only as long as operationally needed.
- Rejected applications: archive or anonymize after the club's chosen period.
- Event registrations: retain through event reporting, then minimize.

The club must approve final retention periods.

## 11. Phase 4 - Public Website Completion

**Goal:** Replace the scaffold with a polished, media-rich public experience.

### P4-01 Real Media Rendering

Replace `MediaSlot` with:

- A reusable `ManagedImage` using `next/image`.
- Correct aspect ratios and responsive `sizes`.
- Meaningful alt text from content metadata.
- A graceful fallback only when media is genuinely unavailable.
- Video embed component with title and privacy-conscious loading.

### P4-02 Mobile Navigation

- Add a familiar menu button using a Lucide icon.
- Expose `aria-expanded` and `aria-controls`.
- Trap no focus.
- Close on route change and Escape.
- Keep focus visible.
- Ensure the menu does not push the entire first viewport into a long navigation list.

### P4-03 Home Page

Complete:

- Real full-width hero media.
- Accurate club statistics or remove unverifiable numbers.
- Featured upcoming events.
- Sponsor strip if records exist.
- Testimonials if records exist.
- Gallery preview with real media.
- Clear membership and recruitment calls to action.
- A visible hint of the next section on desktop and mobile.

### P4-04 About Page

- Real club story.
- Mission, vision, values.
- Verified milestones.
- Faculty/university relationship wording.
- Club story image.
- Remove generic copy that cannot be substantiated.

### P4-05 Team Page

- Group members by meaningful category.
- Render portraits and social links.
- Handle empty groups gracefully.
- Ensure cards remain aligned with varied biography lengths.

### P4-06 Events Page

- Upcoming and past views using tabs or filters.
- Event poster, date, venue, category, registration availability.
- Optional event detail route if content warrants it.
- Registration form associated with the selected event.
- Empty state when there are no upcoming events.

### P4-07 Gallery Page

- Category filters.
- Responsive image grid.
- Accessible lightbox/dialog.
- Keyboard next/previous and Escape behavior.
- Captions and alt text.
- Video items that do not autoplay.
- Lazy loading.

### P4-08 Recruitment Page

- Replace generic domain descriptions with responsibilities, useful skills, and expected
  commitment.
- Clearly show whether recruitment is open.
- Hide or disable application submission when closed.
- Keep the eight domains admin-manageable only if the club expects them to change often;
  otherwise retain them as typed constants for MVP simplicity.

### P4-09 Membership Page

- Explain eligibility, benefits, expectations, and application process.
- Add privacy/consent copy.
- State that application is not automatic acceptance.
- Keep member login out of the MVP.

### P4-10 Contact Page

- Add real email and social URLs.
- Include campus/location information if approved.
- Maintain one form with an inquiry-type selector unless workflows require distinct
  fields.
- Add response-time expectations.

### P4-11 Metadata And Discoverability

- Unique title and description per route.
- Open Graph and social image.
- Favicon and app icons.
- `robots.ts`.
- `sitemap.ts`.
- Canonical production URL.
- Organization/educational club structured data where accurate.
- Meaningful 404 page.

## 12. Phase 5 - Accessibility And Inclusive UX

**Target:** WCAG 2.2 AA baseline.

### P5-01 Structural Accessibility

- One clear `h1` per page.
- Logical heading hierarchy.
- Header, nav, main, section, and footer landmarks.
- Skip-to-content link.
- Descriptive page titles.
- Descriptive link and button names.

### P5-02 Keyboard And Focus

- Every interactive control works with keyboard only.
- Visible focus styles for links, buttons, inputs, tabs, and dialogs.
- Logical tab order.
- Escape closes dialogs and mobile menus.
- Focus returns to the trigger after dialog close.
- No keyboard traps.

### P5-03 Forms

- Explicit labels.
- Required-state communication.
- Error summaries and field associations through `aria-describedby`.
- `aria-live` status for asynchronous results.
- Autocomplete tokens for name, email, phone, and student details where applicable.
- Instructions do not rely on placeholder text.

### P5-04 Visual Accessibility

- Verify 4.5:1 contrast for normal text and 3:1 for large text.
- Verify focus contrast.
- Reflow at 320 CSS pixels.
- Test text zoom at 200%.
- Do not use color alone for status.
- Honor `prefers-reduced-motion`.
- Avoid unreadable text over images.

### P5-05 Media

- Useful alt text for informative images.
- Empty alt text for decorative images.
- Captions/transcripts for meaningful video.
- No autoplay audio.

### P5-06 Automated And Manual Audit

- Add `@axe-core/playwright`.
- Run axe against all public pages and core admin journeys.
- Perform manual keyboard testing.
- Test at least one screen reader flow on forms and admin navigation.
- Record remaining exceptions with rationale.

## 13. Phase 6 - Testing Strategy

### P6-01 Unit Tests

Cover:

- Zod validation schemas.
- Status transition rules.
- Date classification.
- Storage path generation.
- Authorization helpers where mockable.
- Data normalization.

### P6-02 Supabase Integration Tests

Against a disposable/local Supabase project:

- Anonymous public reads.
- Anonymous form inserts.
- Anonymous denial of private reads.
- Non-admin denial of admin reads/writes.
- Admin CRUD.
- Storage upload/read/delete policies.
- Duplicate registration constraint.
- Status update permissions.

### P6-03 Playwright Public Journeys

Required tests:

1. Every public route loads without console errors.
2. Header and footer navigation work.
3. Mobile navigation works at 320px and 390px.
4. Contact inquiry submits.
5. Recruitment application submits.
6. Membership application submits.
7. Event registration submits.
8. Invalid forms show accessible errors.
9. Event and gallery data render from Supabase.
10. Gallery lightbox works by keyboard.

### P6-04 Playwright Admin Journeys

Required tests:

1. Anonymous user is sent to admin login.
2. Non-admin user is denied.
3. Admin signs in and signs out.
4. Admin creates, edits, publishes, and deletes an event.
5. Admin uploads and replaces media.
6. Admin manages a team member.
7. Admin manages a gallery item.
8. Admin reviews and changes an application status.
9. Admin exports a queue.

### P6-05 Visual And Responsive Checks

Capture screenshots at:

- 320x568.
- 390x844.
- 768x1024.
- 1280x800.
- 1440x900.

Check:

- No overlap.
- No horizontal scrolling.
- No clipped buttons or text.
- Stable card/media dimensions.
- Hero framing.
- Admin table usability.

### P6-06 Quality Commands

The final required local/CI sequence:

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run test
npm run test:e2e
npm run build
```

## 14. Phase 7 - CI/CD, Observability, And Operations

### P7-01 GitHub Actions

On pull requests:

- Install with `npm ci`.
- Lint.
- Type-check.
- Run unit tests.
- Build.
- Run Playwright against the built application.
- Run accessibility checks.

Protect the production branch from merging when required checks fail.

### P7-02 Vercel Environments

- Connect the repository to Vercel.
- Configure preview and production variables separately.
- Use a non-production Supabase project for preview if practical.
- Confirm server-only variables are never exposed in client bundles.
- Configure the production domain and redirects.

### P7-03 Error Monitoring

Minimum:

- Capture server-action failures with structured context but no sensitive payloads.
- Monitor Vercel function errors and failed deployments.
- Add Sentry only if the team will actually monitor it.
- Include a request/correlation ID in unexpected error logs.

### P7-04 Operational Runbooks

Document:

- Add/remove an administrator.
- Publish an event.
- Upload/replace media.
- Export applications.
- Recover from a failed deployment.
- Rotate Supabase keys.
- Restore or recover deleted content where possible.
- Respond to spam or abusive submissions.

### P7-05 Backups And Recovery

- Confirm Supabase backup capabilities for the selected plan.
- Schedule exports before major schema changes.
- Keep migrations in source control.
- Document the recovery owner and expected recovery procedure.

## 15. Content And Asset Workstream

Engineering can create slots and workflows, but launch requires approved content.

### Required Brand Inputs

- Final logo files.
- Favicon/app icon.
- Official color/font approval.
- Official club name capitalization.
- University affiliation wording and permission.

### Required Contact Inputs

- Public club email.
- Instagram URL.
- LinkedIn URL.
- YouTube URL.
- Campus address or location if public.
- Response-time commitment.

### Required Public Content

- Final club story, mission, vision, and values.
- Verified statistics and milestones.
- Team names, roles, biographies, and portraits.
- Event titles, dates, descriptions, posters, capacities, and locations.
- Recruitment domain descriptions and opening/closing dates.
- Membership eligibility and review process.
- Sponsor names, logos, tiers, and links.
- Testimonials with publication consent.

### Media Governance

- Confirm consent for every identifiable person.
- Record alt text and captions during upload.
- Avoid publishing personal phone numbers.
- Compress images before upload.
- Keep originals in a club-owned archive outside the website if needed.

## 16. Security Checklist

- Service-role key is server-only.
- Admin authorization ignores editable user metadata.
- Every admin mutation rechecks authorization.
- RLS is enabled and tested for every table.
- Storage policies are tested.
- Public inputs have length/type validation.
- Public forms have spam controls.
- URLs are validated before rendering.
- External links use safe behavior where applicable.
- Security headers are configured.
- No secrets or personal submission data appear in logs.
- Dependencies are audited before launch.
- Admin passwords and MFA policy are documented; enable MFA if available for the chosen
  Supabase setup.

## 17. Privacy Checklist

- Publish a concise privacy notice.
- Explain what each form collects and why.
- Define who can access submissions.
- Define retention and deletion periods.
- Provide a contact path for correction/deletion requests.
- Do not collect data that is not operationally needed.
- Avoid exposing applications through public or client-side queries.
- Review whether student IDs are necessary for membership at initial application time.

## 18. Definition Of Done

The MVP is complete only when:

- All eight public pages use final approved content or intentional, launch-safe empty
  states.
- No visible placeholder strings remain.
- Public media renders from managed assets.
- All forms persist successfully in production Supabase.
- Failed submissions never present false success.
- Admin auth and role enforcement pass anonymous/non-admin/admin tests.
- Admin can complete all agreed content CRUD and submission-review workflows.
- Storage uploads and cleanup work.
- Lint, type check, unit tests, E2E tests, accessibility checks, and production build pass.
- Mobile and desktop screenshots show no blocking layout defects.
- Vercel production deployment is live on the final domain.
- Operations documentation and admin onboarding are complete.
- A launch owner signs off on content, privacy, accessibility, and functionality.

## 19. Suggested Milestones

### Milestone A - Secure Foundation

Includes Phase 0 and Phase 1.

**Exit gate:** Tooling passes; migrations, RLS, admin authorization, and storage policies
are verified.

### Milestone B - Operational Admin

Includes Phase 2.

**Exit gate:** Admin can manage all public content and review every submission type
without using raw SQL.

### Milestone C - Public Launch Candidate

Includes Phase 3 and Phase 4.

**Exit gate:** Public workflows persist correctly and every page displays approved
content/media.

### Milestone D - Release Quality

Includes Phase 5, Phase 6, and Phase 7.

**Exit gate:** CI, accessibility, browser tests, deployment, monitoring, and runbooks are
complete.

## 20. Rough Effort Estimate

Assuming one experienced developer and timely club content:

| Workstream | Estimate |
|---|---:|
| Tooling and repository cleanup | 0.5-1 day |
| Supabase migrations, RLS, auth, storage | 2-3 days |
| Admin shell and content CRUD | 3-5 days |
| Submission queues and exports | 2-3 days |
| Public forms and reliability | 1-2 days |
| Public media and page completion | 3-5 days |
| Accessibility remediation | 1-2 days |
| Automated tests and CI | 2-3 days |
| Content loading and launch QA | 1-3 days |
| **Total** | **15.5-27 days** |

Content delays, policy decisions, and visual revision rounds are the largest schedule
risks.

## 21. Prioritized Backlog

### P0 - Launch Blockers

- Fix lint dependency mismatch.
- Establish migrations.
- Fix admin authorization and RLS.
- Configure real Supabase environments.
- Implement production-safe form behavior.
- Implement admin content CRUD.
- Implement submission review workflows.
- Implement Storage uploads.
- Replace placeholders and fake statistics.
- Add production deployment and smoke tests.

### P1 - Required Quality

- Field-level validation.
- Spam/duplicate protection.
- Responsive mobile navigation.
- Accessible dialogs and form feedback.
- Playwright E2E suite.
- Axe accessibility suite.
- SEO metadata, sitemap, robots, social image.
- Privacy notice and retention policy.
- CI checks and runbooks.

### P2 - Valuable After Core Completion

- CSV exports.
- Reordering controls.
- Event detail pages.
- Waitlist capacity behavior.
- Draft previews.
- Audit fields and recent activity.
- Basic error monitoring.

### P3 - Post-MVP Ideas

- Member authentication and dashboard.
- Attendance and certificate management.
- Email notifications.
- Membership renewal.
- Payment collection.
- Advanced analytics.
- Multi-language content.
- Content scheduling.
- Fine-grained admin roles.

## 22. Risks And Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Club content arrives late | Launch blocked visually | Use a content checklist, owner, and deadline |
| RLS is misconfigured | Data exposure or broken admin | Policy matrix plus integration tests |
| Service key leaks | Full database compromise | Server-only module, secret scanning, Vercel env controls |
| Admin scope expands endlessly | Schedule slips | Enforce MVP CRUD and queue scope |
| Large media causes slow pages/cost | Poor UX and storage cost | Compression, `next/image`, external video embeds |
| Public forms attract spam | Noisy operations | Honeypot, duplicate checks, rate limits when needed |
| Old static site confuses maintainers | Wrong files edited/deployed | Archive or remove legacy implementation |
| Accessibility added too late | Expensive rework | Build keyboard/error semantics into shared components |
| No one owns operations | Site becomes stale | Name admin, content, and deployment owners |

## 23. Decision Log

| Decision | Alternatives | Reason |
|---|---|---|
| Keep Next.js monolith | Separate backend API | MVP scale does not justify extra service |
| Use Supabase for DB/Auth/Storage | Firebase, custom backend, Cloudinary | Existing stack and simple operations |
| Admin allowlist table | User-editable metadata, complex RBAC | Secure and sufficient for fewer than ten admins |
| Server Actions for mutations | REST route handlers | No external API client exists |
| Public media bucket | Store local assets only | Admin-managed content requires uploads |
| External embeds for large video | Store all videos in Supabase | Better cost and delivery for MVP |
| WCAG 2.2 AA | Informal accessibility only | Clear testable quality target |
| Playwright for E2E | Manual-only QA | Repeatable route, form, admin, and responsive coverage |
| Defer member dashboard | Fake or partial member auth | Avoid misleading users and major scope expansion |

## 24. First Implementation Sprint

The first sprint should contain only:

1. Fix ESLint/package compatibility.
2. Add `.gitignore` and clean current documentation.
3. Create the migration structure.
4. Repair admin authorization and RLS.
5. Add Supabase Storage buckets/policies.
6. Add local seed data.
7. Add integration tests for anonymous, non-admin, and admin access.

Do not begin broad visual polish until this sprint passes its security and persistence
acceptance tests.
