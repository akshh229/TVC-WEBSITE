import type { GalleryItem } from "@/lib/types";
import { ManagedMedia } from "@/components/managed-media";

export type GalleryTapeItem = Pick<
  GalleryItem,
  "id" | "title" | "category" | "media_type" | "media_url" | "thumbnail_url" | "alt_text" | "caption"
> & {
  href?: string;
};

function TapeCard({ item }: { item: GalleryTapeItem }) {
  const mediaSrc = item.media_type === "video" ? item.thumbnail_url : item.media_url;
  const cardContent = (
    <>
      <ManagedMedia
        src={mediaSrc}
        mediaType={item.media_type}
        alt={item.alt_text || item.title}
        label="Gallery media coming soon"
        className="gallery-tape-media"
      />
      <div className="gallery-tape-caption">
        <span>{item.category}</span>
        <h3>{item.title}</h3>
        {item.caption ? <p>{item.caption}</p> : null}
      </div>
    </>
  );

  if (item.href) {
    return (
      <a className="gallery-tape-card" href={item.href} target="_blank" rel="noreferrer">
        {cardContent}
      </a>
    );
  }

  return (
    <article className="gallery-tape-card">
      {cardContent}
    </article>
  );
}

function TapeLane({ items, className = "" }: { items: GalleryTapeItem[]; className?: string }) {
  return (
    <div className={`gallery-tape-lane ${className}`}>
      <div className="gallery-tape-track">
        <div className="gallery-tape-set">
          {items.map((item, index) => <TapeCard item={item} key={`${item.id}-${index}`} />)}
        </div>
        <div className="gallery-tape-set" aria-hidden="true">
          {items.map((item, index) => <TapeCard item={item} key={`${item.id}-${index}-copy`} />)}
        </div>
      </div>
    </div>
  );
}

export function GalleryTape({ items }: { items: GalleryTapeItem[] }) {
  if (!items.length) {
    return null;
  }

  const repeatCount = Math.max(1, Math.ceil(6 / items.length));
  const tapeItems = Array.from({ length: repeatCount }, () => items).flat();
  const laneCount = Math.min(3, Math.max(1, items.length));
  const lanes = Array.from({ length: laneCount }, (_, lane) =>
    tapeItems.filter((_, index) => index % laneCount === lane),
  );

  return (
    <div className="gallery-tape" aria-label="Voyage Club photo highlights">
      <div className={`gallery-tape-desktop gallery-tape-desktop-${laneCount}`}>
        {lanes.map((laneItems, index) => (
          <TapeLane items={laneItems} className={`gallery-tape-lane-${index + 1}`} key={index} />
        ))}
      </div>
      <div className="gallery-tape-mobile">
        <TapeLane items={items} />
      </div>
    </div>
  );
}
