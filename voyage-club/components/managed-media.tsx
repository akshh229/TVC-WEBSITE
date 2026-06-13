import Image from "next/image";
import { ImageIcon, PlayCircle } from "lucide-react";

type ManagedMediaProps = {
  src?: string | null;
  alt: string;
  label?: string;
  priority?: boolean;
  className?: string;
  mediaType?: "image" | "video";
};

function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
      return `https://www.youtube-nocookie.com${parsed.pathname}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function ManagedMedia({
  src,
  alt,
  label = "Media coming soon",
  priority = false,
  className = "",
  mediaType = "image"
}: ManagedMediaProps) {
  if (src && mediaType === "video") {
    const embed = youtubeEmbedUrl(src);
    if (embed) {
      return (
        <div className={`managed-media ${className}`}>
          <iframe
            src={embed}
            title={alt}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  if (src) {
    return (
      <div className={`managed-media ${className}`}>
        <Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={priority} />
      </div>
    );
  }

  return (
    <div className={`media-empty ${className}`} role="img" aria-label={alt}>
      {mediaType === "video" ? <PlayCircle aria-hidden="true" /> : <ImageIcon aria-hidden="true" />}
      <span>{label}</span>
    </div>
  );
}

