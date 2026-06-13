import { Metadata } from "next";
import { ManagedMedia } from "@/components/managed-media";
import { PageHero, SectionHeader } from "@/components/section";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About TVC" title="A Voyage Through Bharat, Leadership, And Service">
        The Voyage Club is a Chandigarh University student community shaped around one idea: understand where we
        come from, then use that confidence to build responsibly.
      </PageHero>
      <section className="section">
        <div className="container grid two">
          <div>
            <SectionHeader eyebrow="Our story" title="From Curiosity To Campus Impact">
              TVC brings students together for public conversations, research, cultural learning, leadership roles,
              outreach, and programs that make patriotism thoughtful and practical.
            </SectionHeader>
            <div className="grid two">
              <div className="card"><h3>Vision</h3><p>Build a student community that carries Indian knowledge, discipline, and leadership into future work.</p></div>
              <div className="card"><h3>Mission</h3><p>Create spaces where students learn, lead, network, speak clearly, and create visible impact.</p></div>
            </div>
          </div>
          <ManagedMedia alt="Voyage Club members working together during a campus program" label="Approved club photographs will appear here" />
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHeader eyebrow="Signals" title="What TVC Is Building" center />
          <div className="grid four">
            <div className="stat"><strong>TVC</strong><span>CU club identity</span></div>
            <div className="stat"><strong>17</strong><span>LinkedIn members</span></div>
            <div className="stat"><strong>49</strong><span>LinkedIn followers</span></div>
            <div className="stat"><strong>8</strong><span>Recruitment domains</span></div>
          </div>
        </div>
      </section>
    </>
  );
}
