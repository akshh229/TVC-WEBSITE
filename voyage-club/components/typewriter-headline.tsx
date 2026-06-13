"use client";

import { useEffect, useState } from "react";

type TypewriterHeadlineProps = {
  text: string;
  speed?: number;
  startDelay?: number;
};

export function TypewriterHeadline({ text, speed = 34, startDelay = 180 }: TypewriterHeadlineProps) {
  const [visibleText, setVisibleText] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function finish() {
      setVisibleText(text);
      setComplete(true);
    }

    function typeNextCharacter() {
      if (prefersReducedMotion || index >= text.length) {
        finish();
        return;
      }

      index += 1;
      setVisibleText(text.slice(0, index));
      timer = setTimeout(typeNextCharacter, text[index - 1] === "," ? speed * 6 : speed);
    }

    timer = setTimeout(typeNextCharacter, startDelay);

    return () => clearTimeout(timer);
  }, [speed, startDelay, text]);

  return (
    <h1 className="typewriter-heading" aria-label={text}>
      <span className="typewriter-ghost" aria-hidden="true" data-text={text} />
      <span className="typewriter-text" aria-hidden="true">
        {visibleText}
        <span className={`typewriter-caret${complete ? " done" : ""}`} />
      </span>
    </h1>
  );
}
