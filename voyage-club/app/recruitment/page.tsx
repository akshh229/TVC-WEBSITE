import { Metadata } from "next";
import { SmartForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/section";
import { submitRecruitmentApplication } from "@/lib/actions";
import { domainDescriptions, domains } from "@/lib/content";

export const metadata: Metadata = {
  title: "Recruitment"
};

export default function RecruitmentPage() {
  return (
    <>
      <PageHero eyebrow="Recruitment" title="Learn, Lead, Network, Create Impact">
        Join a domain where you can do real work for the club: write, design, research, organize, reach out, lead
        teams, and help build programs with a clear purpose.
      </PageHero>
      <section className="section">
        <div className="container grid four">
          {domains.map((domain) => (
            <article className="card" key={domain}>
              <span className="badge cyan">Openings</span>
              <h3 style={{ marginTop: 16 }}>{domain}</h3>
              <p style={{ marginTop: 10 }}>{domainDescriptions[domain]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container grid two">
          <SectionHeader eyebrow="Apply" title="Recruitment Application">
            Tell the team where you want to contribute and what you are ready to learn. Applications are reviewed by
            approved club administrators.
          </SectionHeader>
          <div className="card">
            <SmartForm action={submitRecruitmentApplication} submitLabel="Submit Application" buttonClassName="btn purple">
              <div className="form-row">
                <div className="field"><label htmlFor="full_name">Full name</label><input id="full_name" name="full_name" required /></div>
                <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" required /></div>
                <div className="field"><label htmlFor="department">Department</label><input id="department" name="department" required /></div>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="year">Year</label><input id="year" name="year" required /></div>
                <div className="field">
                  <label htmlFor="preferred_domain">Preferred domain</label>
                  <select id="preferred_domain" name="preferred_domain" required>
                    {domains.map((domain) => <option key={domain}>{domain}</option>)}
                  </select>
                </div>
              </div>
              <div className="field"><label htmlFor="motivation">Why do you want to join?</label><textarea id="motivation" name="motivation" required /></div>
              <p className="form-consent">Submitting an application does not guarantee selection. Your details are visible only to approved reviewers.</p>
            </SmartForm>
          </div>
        </div>
      </section>
    </>
  );
}
