import { Metadata } from "next";
import { SmartForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/section";
import { submitContactInquiry } from "@/lib/actions";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk To The Voyage Club">
        Reach the team for general questions, collaborations, sponsorship, speaker sessions, or event partnerships.
      </PageHero>
      <section className="section">
        <div className="container grid two">
          <div>
            <SectionHeader eyebrow="Channels" title="Reach The Right Team">
              Use the inquiry form for questions, partnerships, sponsorships, speaker sessions, and event collaboration.
            </SectionHeader>
            <div className="grid">
              {siteConfig.email ? <div className="card"><h3>Email</h3><p>{siteConfig.email}</p></div> : null}
              <div className="card"><h3>Best channel</h3><p>The form routes your message into the club&apos;s private review queue.</p></div>
              <div className="card"><h3>Response time</h3><p>Recommended operating standard: 24-48 working hours.</p></div>
            </div>
          </div>
          <div className="card">
            <SmartForm action={submitContactInquiry} submitLabel="Send Inquiry">
              <div className="field">
                <label htmlFor="kind">Inquiry type</label>
                <select id="kind" name="kind">
                  <option value="general">General</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="sponsorship">Sponsorship</option>
                </select>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required /></div>
                <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
              </div>
              <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" /></div>
              <div className="field"><label htmlFor="subject">Subject</label><input id="subject" name="subject" required /></div>
              <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" required /></div>
              <p className="form-consent">Your details are used only to respond to this inquiry and manage the requested collaboration.</p>
            </SmartForm>
          </div>
        </div>
      </section>
    </>
  );
}
