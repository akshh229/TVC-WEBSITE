import { Metadata } from "next";
import Image from "next/image";
import { ManagedMedia } from "@/components/managed-media";
import { PageHero } from "@/components/section";
import { instagramHighlights } from "@/lib/content";
import { getGalleryItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery"
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <PageHero eyebrow="Memories" title="Gallery And Video Highlights">
        Explore approved photographs and recap videos from club events, workshops, teams, and campus programs.
      </PageHero>
      <section className="section">
        <div className="container">
          {items.length ? <div className="grid four">{items.map((item) => (
            <article className="card" key={item.id}>
              <ManagedMedia src={item.media_url} mediaType={item.media_type} alt={item.alt_text || item.title} label="Media coming soon" />
              <span className="badge cyan" style={{ marginTop: 16 }}>{item.media_type}</span>
              <h3 style={{ marginTop: 12 }}>{item.title}</h3>
              <p>{item.category}</p>
              {item.caption ? <p style={{ marginTop: 8 }}>{item.caption}</p> : null}
            </article>
          ))}</div> : <div className="instagram-grid gallery-social">
            {instagramHighlights.map((item, index) => (
              <a className={`insta-card${index === 0 ? " wide" : ""}`} href={item.href} key={item.href} target="_blank" rel="noreferrer">
                <Image src={item.src} alt={`${item.title} post from The Voyage Club`} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 50vw, 25vw"} />
                <span className="insta-overlay">
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </span>
              </a>
            ))}
          </div>}
        </div>
      </section>
    </>
  );
}
