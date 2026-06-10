"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_DELAY = 18;
// Long commands (deep links, pasted text) jump straight to full text.
const MAX_ANIMATED_LENGTH = 40;

/** Echoes a submitted command as if it were being typed. */
export default function TypedCommand({ text }: { text: string }) {
  const skipAnimation =
    text.length > MAX_ANIMATED_LENGTH ||
    (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [visibleChars, setVisibleChars] = useState(skipAnimation ? text.length : 0);
  const cancelled = useRef(false);

  useEffect(() => {
    if (skipAnimation) return;
    cancelled.current = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= text.length; i++) {
      timers.push(
        setTimeout(() => {
          if (!cancelled.current) setVisibleChars(i);
        }, i * CHAR_DELAY)
      );
    }
    return () => {
      cancelled.current = true;
      timers.forEach(clearTimeout);
    };
  }, [text, skipAnimation]);

  const typing = visibleChars < text.length;

  return (
    <span className="text-[var(--t-text-2)] text-base">
      {/* Per-character updates would spam screen readers via the aria-live
          terminal body — expose the full command once instead. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, visibleChars)}
        {typing && <span className="cursor-blink text-[var(--t-accent)]">█</span>}
      </span>
    </span>
  );
}
