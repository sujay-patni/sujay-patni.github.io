"use client";

import { useState, useEffect, useRef } from "react";
import { usePortfolioData } from "@/lib/portfolio-data";

const CHAR_DELAY = 10;

// Module-level flag — persists across re-renders, resets only on page reload
let introHasAnimated = false;

export default function TypewriterIntro() {
  const { personal } = usePortfolioData();
  const intro = personal.tagline;

  // Capture at mount time so re-renders from parent don't change this value
  const willAnimate = useRef(!introHasAnimated);
  const [displayed, setDisplayed] = useState(() => (introHasAnimated ? intro : ""));
  const [done, setDone] = useState(() => introHasAnimated);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!willAnimate.current) return;

    introHasAnimated = true;
    cancelled.current = false;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayed(intro);
      setDone(true);
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled.current) return;
      i++;
      setDisplayed(intro.slice(0, i));
      if (i < intro.length) {
        timer = setTimeout(tick, CHAR_DELAY);
      } else {
        setDone(true);
      }
    }

    timer = setTimeout(tick, 120);

    return () => {
      cancelled.current = true;
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <p className="font-mono text-sm text-[var(--t-muted-1)] leading-relaxed mb-4">
      {done ? intro : displayed}
      {!done && (
        <span className="cursor-blink inline-block w-[7px] h-[13px] bg-[var(--t-accent)] ml-0.5 align-middle" />
      )}
    </p>
  );
}
