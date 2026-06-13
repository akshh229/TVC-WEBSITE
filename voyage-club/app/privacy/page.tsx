import type { Metadata } from "next";
import { PageHero } from "@/components/section";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="How We Handle Your Information">
        The Voyage Club collects only the information needed to answer inquiries, review applications, and manage event registrations.
      </PageHero>
      <section className="section">
        <div className="container prose">
          <h2>Information we collect</h2>
          <p>Forms may collect your name, email, phone number, academic details, interests, and the message or application you submit.</p>
          <h2>How it is used</h2>
          <p>Approved club administrators use this information only to respond, review participation, organize events, and operate club programs.</p>
          <h2>Access and retention</h2>
          <p>Submissions are not public. They are retained only while operationally useful and may be removed or anonymized after the relevant process ends.</p>
          <h2>Your choices</h2>
          <p>Use the contact form to request access, correction, or deletion of information you submitted.</p>
        </div>
      </section>
    </>
  );
}

