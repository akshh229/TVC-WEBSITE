"use client";

import { useEffect, useRef, useState } from "react";

type AnimationVariant = "fade" | "clip" | "blur" | "scale";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: AnimationVariant;
  staggerChildren?: boolean;
  staggerDelay?: number; // ms
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  animation = "fade",
  staggerChildren = false,
  staggerDelay = 40,
  as: Component = "div",
  className = "",
  ...props
}: ScrollRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Respect system accessibility preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // Stop observing once revealed
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        // Trigger right before it enters the main viewing area
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const variantClass = staggerChildren ? `stagger-parent stagger-${animation}` : `reveal-base reveal-${animation}`;
  const activeClass = isRevealed ? (staggerChildren ? "stagger-active" : "reveal-active") : "";

  return (
    <Component
      ref={containerRef}
      className={`${variantClass} ${activeClass} ${className}`.trim()}
      style={
        staggerChildren
          ? { "--stagger-delay": `${staggerDelay}ms` } as React.CSSProperties
          : undefined
      }
      {...props}
    >
      {children}
    </Component>
  );
}
