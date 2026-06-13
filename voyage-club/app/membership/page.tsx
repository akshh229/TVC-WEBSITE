import { Metadata } from "next";
import { SmartForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/section";
import { submitMembershipApplication } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Membership"
};

export default function MembershipPage() {
  return (
    <>
      <PageHero eyebrow="Membership" title="Become A Voyager">
        Step into a student community that values Indian roots, disciplined work, clear communication, and visible
        contribution on campus.
      </PageHero>
      <section className="section">
        <div className="container grid two">
          <div>
            <SectionHeader eyebrow="Benefits" title="Why Join TVC">
            Members get access to purposeful programs, domain work, leadership opportunities, certificates, and a
            network of students who want to build something meaningful.
            </SectionHeader>
            <div className="grid two">
              <div className="card"><h3>Leadership roles</h3><p>Work on real initiatives with measurable responsibility.</p></div>
              <div className="card"><h3>Event access</h3><p>Join workshops, competitions, speaker sessions, and fests.</p></div>
              <div className="card"><h3>Certificates</h3><p>Build a record of participation and contribution.</p></div>
              <div className="card"><h3>Network</h3><p>Meet peers, alumni, mentors, sponsors, and collaborators.</p></div>
            </div>
          </div>
          <div className="card">
            <SmartForm action={submitMembershipApplication} submitLabel="Apply For Membership">
              <div className="form-row">
                <div className="field"><label htmlFor="full_name">Full name</label><input id="full_name" name="full_name" required /></div>
                <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" required /></div>
                <div className="field"><label htmlFor="student_id">Student ID</label><input id="student_id" name="student_id" required /></div>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="program">Program</label><input id="program" name="program" required /></div>
                <div className="field"><label htmlFor="year">Year</label><input id="year" name="year" required /></div>
              </div>
              <div className="field"><label htmlFor="interests">Interests</label><textarea id="interests" name="interests" required /></div>
              <p className="form-consent">Submitting an application does not create a member account or guarantee acceptance. See our privacy notice for data handling details.</p>
            </SmartForm>
          </div>
        </div>
      </section>
    </>
  );
}
