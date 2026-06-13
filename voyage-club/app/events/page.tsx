import { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { ManagedMedia } from "@/components/managed-media";
import { SmartForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/section";
import { submitEventRegistration } from "@/lib/actions";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events"
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHero eyebrow="Programs" title="Talks, Circles, And Campus Gatherings">
        TVC programs are built around leadership, Indian knowledge systems, public confidence, service, and useful
        student networks.
      </PageHero>
      <section className="section">
        <div className="container event-timeline">
          {events.map((event, index) => (
            <article className="card event-card" key={event.id}>
              <div className="event-step">{String(index + 1).padStart(2, "0")}</div>
              <div className="date-badge">
                <strong>{new Date(event.date).toLocaleDateString("en-US", { day: "2-digit" })}</strong>
                <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</span>
              </div>
              <ManagedMedia src={event.poster_url} alt={`${event.title} event poster`} label="Event poster coming soon" />
              <div className="event-meta-row">
                <span className="badge cyan">{event.category}</span>
                <span className={`badge ${event.registration_status === "open" ? "success" : "purple"}`}>
                  <CalendarClock size={13} aria-hidden="true" />
                  {event.registration_status === "open" ? "Registration open" : event.registration_status}
                </span>
              </div>
              <h3 style={{ marginTop: 14 }}>{event.title}</h3>
              <p style={{ marginTop: 8 }}>{event.summary}</p>
              <p style={{ marginTop: 12 }}>{new Date(event.date).toLocaleDateString()} · {event.location}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section alt">
        <div className="container grid two">
          <SectionHeader eyebrow="Register" title="Event Registration">
            Register for an upcoming TVC program. The team uses these details only to coordinate participation and
            communicate event updates.
          </SectionHeader>
          <div className="card">
            <SmartForm action={submitEventRegistration} submitLabel="Submit Registration">
              <div className="field">
                <label htmlFor="event_id">Event</label>
                <select id="event_id" name="event_id" required>
                  {events.filter((event) => event.registration_status !== "closed").map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="full_name">Full name</label><input id="full_name" name="full_name" required /></div>
                <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required /></div>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" required /></div>
                <div className="field"><label htmlFor="program">Program / year</label><input id="program" name="program" required /></div>
              </div>
              <p className="form-consent">By submitting, you agree that approved club administrators may use these details to manage this registration.</p>
            </SmartForm>
          </div>
        </div>
      </section>
    </>
  );
}
