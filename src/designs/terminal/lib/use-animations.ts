"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll hook. Returns a ref + a boolean that flips to true the first
 * time the element scrolls into view, then stays true. Off-screen content inside
 * the scrollable terminal body is clipped, so the IntersectionObserver reports it
 * as not-intersecting until the user scrolls it in.
 */
export function useInView<T extends Element = HTMLDivElement>(
  opts?: IntersectionObserverInit
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSeen(true);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px", ...opts }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, opts]);

  return [ref, seen];
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates a count from 0 up to `target` once `run` is true, with a cubic
 * ease-out. Honors prefers-reduced-motion (jumps straight to the target).
 */
export function useCountUp(target: number, run: boolean, ms = 900): number {
  const [n, setN] = useState(0);
  const animate = run && target !== 0 && !prefersReducedMotion();

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, target, ms]);

  // While not animating (idle, reduced-motion, or zero) just show the target.
  return animate ? n : target;
}

/**
 * Splits a metric string like "20+ skills" into the leading integer and the
 * surrounding text so the number can be counted up while the rest is preserved.
 * Returns null when there is no leading integer to animate.
 */
export function splitLeadingInt(
  value: string
): { prefix: string; num: number; suffix: string } | null {
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], num: parseInt(m[2], 10), suffix: m[3] };
}
