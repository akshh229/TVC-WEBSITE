import { Metadata } from "next";
import { GalleryTape, type GalleryTapeItem } from "@/components/gallery-tape";
import { PageHero } from "@/components/section";
import { instagramHighlights } from "@/lib/content";
import { getGalleryItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery"
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  const tapeItems: GalleryTapeItem[] = items.length
    ? items
    : instagramHighlights.map((item, index) => ({
      id: `instagram-${index}`,
      title: item.title,
      category: item.date,
      media_type: "image",
      media_url: item.src,
      alt_text: `${item.title} Instagram post from The Voyage Club`,
      caption: item.subtitle,
      href: item.href
    }));

  return (
    <>
      <PageHero eyebrow="Memories" title="Gallery And Video Highlights">
        Explore approved photographs and recap videos from club events, workshops, teams, and campus programs.
      </PageHero>
      <section className="section">
        <div className="container">
          <GalleryTape items={tapeItems} />
        </div>
      </section>
    </>
  );
}
