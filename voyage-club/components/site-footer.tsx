import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Camera, Network, Send } from "lucide-react";
import { instagramProfile, siteConfig } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cta">
          <div>
            <span className="eyebrow">Ready to join the voyage?</span>
            <h2>Bring your curiosity. Build with the team.</h2>
          </div>
          <div className="footer-actions">
            <Link className="btn primary" href="/membership">
              Apply now <Send size={16} aria-hidden="true" />
            </Link>
            <a className="back-to-top" href="#main-content" aria-label="Back to top">
              <ArrowUp size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="brand-mark image-mark">
                <Image src={instagramProfile.logo} alt="" fill sizes="48px" />
              </span>
              <span>
                <span className="brand-name">The Voyage Club</span>
                <span className="brand-sub">Chandigarh University</span>
              </span>
            </div>
            <p style={{ marginTop: 16, maxWidth: 360 }}>
              Knowledge from the Past, Power for the Future. A CU student community for leadership, culture,
              civic responsibility, and meaningful campus impact.
            </p>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/team">Team</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get involved</h4>
            <ul>
              <li><Link href="/recruitment">Recruitment</Link></li>
              <li><Link href="/membership">Membership</Link></li>
              <li><Link href="/contact">Collaborate</Link></li>
              <li><Link href="/admin">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              {siteConfig.email ? <li><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li> : null}
              {siteConfig.instagram ? <li><a href={siteConfig.instagram}>Instagram</a></li> : null}
              {siteConfig.linkedin ? <li><a href={siteConfig.linkedin}>LinkedIn</a></li> : null}
              {siteConfig.youtube ? <li><a href={siteConfig.youtube}>YouTube</a></li> : null}
              <li><Link href="/contact">Send an inquiry</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
            <div className="social-strip">
              {siteConfig.instagram ? <a href={siteConfig.instagram} aria-label="Instagram"><Camera size={16} aria-hidden="true" /></a> : null}
              {siteConfig.linkedin ? <a href={siteConfig.linkedin} aria-label="LinkedIn"><Network size={16} aria-hidden="true" /></a> : null}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 The Voyage Club. All rights reserved.</p>
          <p>Built by the TVC team.</p>
        </div>
      </div>
    </footer>
  );
}
