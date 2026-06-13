"use client";

import { useEffect, useRef, useState } from "react";

type CountUpStatProps = {
  value: number | string;
  label: string;
  suffix?: string;
};

export function CountUpStat({ value, label, suffix = "" }: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(typeof value === "number" ? 0 : value);

  useEffect(() => {
    if (typeof value !== "number") return;
    const targetValue = value;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
          setDisplayValue(targetValue);
          observer.disconnect();
          return;
        }

        const duration = 1100;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.round(targetValue * eased));

          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="stat hero-stat" ref={ref}>
      <strong>{displayValue}{typeof value === "number" ? suffix : ""}</strong>
      <span>{label}</span>
    </div>
  );
}
