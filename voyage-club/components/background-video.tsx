"use client";

import { useEffect, useState } from "react";

// Renders the ambient background video only when the user has not asked to
// reduce motion. The gradient on `.site-bg-video` is the static fallback, so
// reduced-motion users never pay the video download or the autoplay cost.
export function BackgroundVideo() {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPlayVideo(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div className="site-bg-video" aria-hidden="true">
      {playVideo && (
        <video autoPlay loop muted playsInline preload="metadata">
          <source src="/backgrounds/grainient-background.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}
