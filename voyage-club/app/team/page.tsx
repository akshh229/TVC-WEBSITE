import { Metadata } from "next";
import { ManagedMedia } from "@/components/managed-media";
import { PageHero } from "@/components/section";
import { getTeamMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Team"
};

export default async function TeamPage() {
  const team = await getTeamMembers();

  return (
    <>
      <PageHero eyebrow="Our people" title="Meet The Team Behind The Voyage">
        Faculty mentors and student leaders work across disciplines to turn club ideas into dependable programs.
      </PageHero>
      <section className="section">
        <div className="container">
          {team.length ? <div className="grid three">{team.map((member) => (
            <article className="card" key={member.id}>
              <ManagedMedia src={member.image_url} alt={member.image_alt || `${member.name}, ${member.role}`} label="Portrait coming soon" />
              <span className="badge purple" style={{ marginTop: 18 }}>{member.role}</span>
              <h3 style={{ marginTop: 14 }}>{member.name}</h3>
              <p>{member.department}</p>
              <p style={{ marginTop: 10 }}>{member.bio}</p>
            </article>
          ))}</div> : <div className="empty-state"><p>The approved leadership roster is being prepared.</p><p>Check back after the club publishes the current team.</p></div>}
        </div>
      </section>
    </>
  );
}
