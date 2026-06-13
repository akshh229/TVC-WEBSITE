import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { AdminContentPanel, AdminNav, AdminSubmissionPanel } from "@/components/admin-panel";
import { SmartForm } from "@/components/forms";
import { signInAdmin, signOutAdmin } from "@/lib/actions";
import { getAdminContent, getAdminCounts, getAdminSubmissions } from "@/lib/admin-data";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/auth";
import { hasSupabaseAdminEnv, hasSupabaseEnv } from "@/lib/supabase/server";
import type { AdminContentTable, SubmissionTable } from "@/lib/types";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false }
};

const contentTables = new Set<AdminContentTable>(["events", "team_members", "gallery_items", "sponsors", "testimonials"]);
const submissionTables = new Set<SubmissionTable>(["contact_inquiries", "recruitment_applications", "membership_applications", "event_registrations"]);

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const view = typeof params.view === "string" ? params.view : "overview";

  if (!hasSupabaseEnv() || !hasSupabaseAdminEnv()) {
    return (
      <section className="page-hero">
        <div className="container narrow">
          <span className="eyebrow">Admin setup</span>
          <h1>Connect Supabase To Continue</h1>
          <p>Add the variables from `.env.example`, apply the migration, create an Auth user, and add that user ID to `public.admin_users`.</p>
          <Link className="btn secondary" href="/" style={{ marginTop: 24 }}>Return to site</Link>
        </div>
      </section>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return (
      <section className="page-hero">
        <div className="container admin-login-layout">
          <div>
            <span className="eyebrow">Admin login</span>
            <h1>Club Operations</h1>
            <p>Approved administrators can manage public content, media, applications, inquiries, and event registrations.</p>
          </div>
          <div className="admin-login-panel">
            <h2>Sign in</h2>
            <SmartForm action={signInAdmin} submitLabel="Sign in">
              <div className="field">
                <label htmlFor="admin-email">Email</label>
                <input id="admin-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="admin-password">Password</label>
                <input id="admin-password" name="password" type="password" autoComplete="current-password" minLength={8} required />
              </div>
            </SmartForm>
          </div>
        </div>
      </section>
    );
  }

  if (!(await isCurrentUserAdmin())) {
    return (
      <section className="page-hero">
        <div className="container narrow">
          <span className="eyebrow">Access denied</span>
          <h1>This Account Is Not An Administrator</h1>
          <p>Ask an existing project owner to add your Supabase user ID to the admin allowlist.</p>
          <form action={signOutAdmin} style={{ marginTop: 24 }}>
            <button className="btn secondary" type="submit">Sign out</button>
          </form>
        </div>
      </section>
    );
  }

  const active = contentTables.has(view as AdminContentTable) || submissionTables.has(view as SubmissionTable) ? view : "overview";
  const counts = await getAdminCounts();
  const contentRecords = contentTables.has(active as AdminContentTable) ? await getAdminContent(active as AdminContentTable) : null;
  const submissions = submissionTables.has(active as SubmissionTable) ? await getAdminSubmissions(active as SubmissionTable) : null;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <span className="brand-name">TVC Admin</span>
          <span className="brand-sub">{user.email}</span>
        </div>
        <AdminNav active={active} />
        <form action={signOutAdmin}>
          <button className="btn secondary full" type="submit"><LogOut size={16} aria-hidden="true" />Sign out</button>
        </form>
      </aside>
      <div className="admin-main">
        {active === "overview" ? (
          <>
            <div className="admin-panel-heading">
              <div><span className="eyebrow">Operations</span><h1>Dashboard</h1></div>
              <Link className="btn secondary" href="/">View public site</Link>
            </div>
            <section className="metric-grid" aria-label="Content and submission totals">
              {Object.entries(counts).map(([label, count]) => (
                <Link className="metric" href={`/admin?view=${label}`} key={label}>
                  <strong>{count}</strong>
                  <span>{label.replaceAll("_", " ")}</span>
                </Link>
              ))}
            </section>
            <section className="admin-panel">
              <h2>Launch checklist</h2>
              <ul className="checklist">
                <li>Publish final events, team, gallery, sponsors, and testimonials.</li>
                <li>Review new inquiries and applications regularly.</li>
                <li>Replace local demo content before production launch.</li>
                <li>Keep uploaded media below 5 MB and provide meaningful alt text.</li>
              </ul>
            </section>
          </>
        ) : null}
        {contentRecords ? <AdminContentPanel table={active as AdminContentTable} records={contentRecords} /> : null}
        {submissions ? <AdminSubmissionPanel table={active as SubmissionTable} records={submissions} /> : null}
      </div>
    </div>
  );
}

