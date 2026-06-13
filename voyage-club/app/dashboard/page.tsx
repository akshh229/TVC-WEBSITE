import Link from "next/link";
import { PageHero } from "@/components/section";

export default function DashboardPage() {
  return (
    <>
      <PageHero eyebrow="Member portal" title="Member Dashboard Is A Phase 2 Feature">
        The MVP protects admin only. Member login, certificates, attendance, renewal, and personalized dashboards should
        be implemented after the club confirms member-auth requirements and data ownership.
      </PageHero>
      <section className="section">
        <div className="container">
          <div className="card">
            <h3>Current MVP path</h3>
            <p style={{ marginTop: 10 }}>
              Public users can apply for membership. Admins can review applications in Supabase/admin workflows.
            </p>
            <Link className="btn primary" href="/membership" style={{ marginTop: 18 }}>Apply for membership</Link>
          </div>
        </div>
      </section>
    </>
  );
}
