import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarClock, Handshake, Landmark, Network, Quote, ShieldCheck, Users } from "lucide-react";
import { CountUpStat } from "@/components/count-up-stat";
import { ManagedMedia } from "@/components/managed-media";
import { SectionHeader } from "@/components/section";
import { TypewriterHeadline } from "@/components/typewriter-headline";
import { instagramHighlights, instagramProfile, memberSpotlights } from "@/lib/content";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getEvents, getGalleryItems, getSponsors, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const [events, gallery, sponsors, testimonials] = await Promise.all([
    getEvents(),
    getGalleryItems(),
    getSponsors(),
    getTestimonials()
  ]);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Chandigarh University · The Voyage Club</span>
            <TypewriterHeadline text="Knowledge From The Past, Power For The Future" />
            <p style={{ fontSize: "1.08rem", marginTop: 20, maxWidth: 620 }}>
              A warm, student-led space to explore Bharat&apos;s history, practice leadership, build public confidence,
              and create work that feels useful beyond a certificate.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" href="/membership">
                Become a Member <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="btn secondary" href="/recruitment">Explore Teams</Link>
            </div>
            <div className="stats-row">
              <CountUpStat value={instagramProfile.followers} label="Instagram followers" />
              <CountUpStat value={instagramProfile.following} label="Following" />
              <CountUpStat value={8} label="Domains" />
              <CountUpStat value="CU" label="Campus community" />
            </div>
          </div>
          <div className="social-showcase" aria-label="Recent Instagram posts from The Voyage Club">
            <div className="showcase-main">
              <Image
                src={instagramHighlights[0].src}
                alt={`${instagramHighlights[0].title} Instagram post`}
                fill
                sizes="(max-width: 760px) 88vw, 430px"
                priority
              />
            </div>
            <div className="showcase-card">
              <Image src={instagramProfile.logo} alt="" width={54} height={54} />
              <div>
                <strong>{instagramProfile.name}</strong>
                <span>{instagramProfile.handle}</span>
              </div>
            </div>
            <div className="showcase-stack" aria-hidden="true">
              {instagramHighlights.slice(2, 5).map((item) => (
                <div className="showcase-thumb" key={item.href}>
                  <Image src={item.src} alt="" fill sizes="120px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeader eyebrow="What we stand for" title="Patriotism With Thought, Not Noise" center>
            TVC works at the intersection of history, leadership, service, and campus culture. The point is to become
            articulate, responsible, and useful.
          </SectionHeader>
          <div className="grid four">
            {[
              ["Bharat Studies", "Explore civilizational ideas, public life, and stories that still shape us.", "Members prepare briefs, quizzes, and conversations rooted in context.", Landmark],
              ["Leadership", "Own real projects, teams, and on-ground outcomes.", "Students lead meetings, schedules, volunteers, and public-facing programs.", Users],
              ["Civic Service", "Learn responsibility through sessions on nation-building and community work.", "Events connect discipline, public duty, and practical contribution.", ShieldCheck],
              ["Networks", "Connect with peers, mentors, alumni, speakers, and collaborators.", "Every event becomes a room where useful relationships can begin.", Network]
            ].map(([title, body, practice, Icon]) => (
              <article className="card value-card" key={String(title)}>
                <Icon size={26} color="var(--saffron)" aria-hidden="true" />
                <h3 style={{ marginTop: 16 }}>{title as string}</h3>
                <p style={{ marginTop: 10 }}>{body as string}</p>
                <div className="practice-line">
                  <strong>What this means in practice</strong>
                  <span>{practice as string}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Programs" title="Sessions With Substance" />
          {events.length ? (
            <div className="event-timeline">
              {events.slice(0, 3).map((event, index) => (
                <article className="card event-card" key={event.id}>
                  <div className="event-step">{String(index + 1).padStart(2, "0")}</div>
                  <div className="date-badge">
                    <strong>{new Date(event.date).toLocaleDateString("en-US", { day: "2-digit" })}</strong>
                    <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</span>
                  </div>
                  <ManagedMedia src={event.poster_url} alt={`${event.title} event poster`} label="Event poster coming soon" />
                  <div className="event-meta-row">
                    <span className="badge cyan">{event.category}</span>
                    <span className="badge success"><CalendarClock size={13} aria-hidden="true" /> Upcoming</span>
                  </div>
                  <h3 style={{ marginTop: 14 }}>{event.title}</h3>
                  <p style={{ marginTop: 8 }}>{event.summary}</p>
                  <p style={{ marginTop: 14 }}>{new Date(event.date).toLocaleDateString()} · {event.location}</p>
                  <Link href="/events" className="btn ghost" style={{ marginTop: 18 }}>View event</Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Upcoming sessions and events will be announced here soon.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section spotlight-section">
        <div className="container">
          <SectionHeader eyebrow="Member voices" title="What Voyage Builds" />
          <div className="spotlight-rail">
            {memberSpotlights.map((item) => (
              <article className="spotlight-card" key={item.name}>
                <Quote size={28} aria-hidden="true" />
                <p>{item.quote}</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
                <em>{item.lesson}</em>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <ScrollReveal animation="clip">
            <SectionHeader eyebrow="From Instagram" title="Real Posts, Real Momentum">
              Recent TVC posts now load directly from local site assets, including recruitment, National Youth Parliament,
              Rashtrapati Bhavan, and campus achievement highlights.
            </SectionHeader>
          </ScrollReveal>
          <ScrollReveal as="div" className="instagram-grid" animation="scale" staggerChildren staggerDelay={50}>
            {instagramHighlights.map((item, index) => (
              <a className={`insta-card${index === 0 ? " wide" : ""}`} href={item.href} key={item.href} target="_blank" rel="noreferrer">
                <Image src={item.src} alt={`${item.title} post from The Voyage Club`} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 50vw, 25vw"} />
                <span className="insta-overlay">
                  <strong>{item.title}</strong>
                  <span>{item.date} · {item.metric}</span>
                </span>
              </a>
            ))}
          </ScrollReveal>
          <ScrollReveal as="div" className="grid three moodboard" animation="fade" staggerChildren staggerDelay={60}>
            <article className="card feature-card"><BookOpenText aria-hidden="true" /><h3>Explore Bharat&apos;s Past</h3><p>Recruitment language points to a community interested in history, culture, and future-ready growth.</p></article>
            <article className="card feature-card"><ShieldCheck aria-hidden="true" /><h3>Soldier Talks</h3><p>A public program around military learning, discipline, patriotism, modern leadership, and civic responsibility.</p></article>
            <article className="card feature-card"><Handshake aria-hidden="true" /><h3>Learn, Lead, Network</h3><p>The recruitment promise is practical: meet people, build confidence, take responsibility, and create impact.</p></article>
          </ScrollReveal>
          {gallery.length ? <ScrollReveal as="div" className="grid four" animation="blur" staggerChildren staggerDelay={40}>
            {gallery.slice(0, 4).map((item) => (
              <article className="card" key={item.id}>
                <ManagedMedia
                  src={item.media_type === "video" ? item.thumbnail_url : item.media_url}
                  alt={item.alt_text || item.title}
                  label="Gallery media coming soon"
                />
                <h3 style={{ marginTop: 14 }}>{item.title}</h3>
                <p>{item.category}</p>
              </article>
            ))}
          </ScrollReveal> : <div className="empty-state"><p>Approved club highlights will appear here after the first media upload.</p><Link className="btn secondary" href="/events">Explore upcoming events</Link></div>}
        </div>
      </section>

      {testimonials.length ? (
        <section className="section">
          <div className="container">
            <SectionHeader eyebrow="Community voices" title="What Voyagers Say" />
            <div className="grid three">
              {testimonials.slice(0, 3).map((item) => (
                <blockquote className="card testimonial" key={item.id}>
                  <p>“{item.quote}”</p>
                  <footer><strong>{item.name}</strong>{item.role ? <span>{item.role}</span> : null}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {sponsors.length ? (
        <section className="section alt compact">
          <div className="container">
            <SectionHeader eyebrow="Partners" title="Supported By" center />
            <div className="sponsor-row">
              {sponsors.map((sponsor) => (
                <a key={sponsor.id} href={sponsor.website_url || "#"} className="sponsor-item">
                  <ManagedMedia src={sponsor.logo_url} alt={sponsor.logo_alt || `${sponsor.name} logo`} label={sponsor.name} />
                  <span>{sponsor.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
