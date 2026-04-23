"use client";

import { useState, useEffect } from "react";

interface AsciiProgressBarProps {
  label: string;
  percent: number;
  width?: number;
  animationDuration?: number;
}

export default function AsciiProgressBar({
  label,
  percent,
  width = 16,
  animationDuration = 900,
}: AsciiProgressBarProps) {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilled(percent);
      return;
    }

    const startTime = performance.now();
    let raf: number;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setFilled(Math.max(0, Math.round(eased * percent)));
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [percent, animationDuration]);

  const displayPercent = Math.max(0, Math.min(filled, 100));
  const filledCount = Math.max(0, Math.min(Math.round((displayPercent / 100) * width), width));
  const emptyCount = Math.max(0, width - filledCount);
  const bar = "█".repeat(filledCount) + "░".repeat(emptyCount);

  return (
    <div className="font-mono text-sm whitespace-nowrap">
      <span className="text-[var(--t-muted-2)] mr-2 inline-block min-w-[21ch]">{label}</span>
      <span className="text-[var(--t-muted-3)]">[</span>
      <span className="text-[var(--t-accent)]">{bar}</span>
      <span className="text-[var(--t-muted-3)]">]</span>
      <span className="text-[var(--t-text-2)] ml-1">{filled}%</span>
    </div>
  );
}
