"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import WhoamiOutput from "./outputs/WhoamiOutput";
import { usePortfolioData } from "@/lib/portfolio-data";

interface BootSequenceProps {
  onComplete: () => void;
}

const WHOAMI_DELAY = 1700;
const COMPLETE_DELAY = 3000;

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const { experience, publications } = usePortfolioData();
  const bootLines = useMemo(
    () => [
      { text: "Booting portfolio workspace ...", color: "text-[var(--t-accent)]", delay: 0 },
      { text: "[OK] Loading identity ...", color: "text-[var(--t-accent-2)]", delay: 350 },
      { text: `[OK] Resolving ${experience.length} experience entries ...`, color: "text-[var(--t-accent-2)]", delay: 700 },
      { text: `[OK] Mounting ${publications.length} publications ...`, color: "text-[var(--t-accent-2)]", delay: 1050 },
      { text: "$ whoami", color: "text-[var(--t-muted-1)]", delay: 1500 },
    ],
    [experience.length, publications.length]
  );
  const [visibleLines, setVisibleLines] = useState(0);
  const [showWhoami, setShowWhoami] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scale = prefersReduced ? 0.05 : 1;
    const timers: ReturnType<typeof setTimeout>[] = [];

    bootLines.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled.current) setVisibleLines(i + 1);
        }, line.delay * scale)
      );
    });

    timers.push(
      setTimeout(() => {
        if (!cancelled.current) setShowWhoami(true);
      }, WHOAMI_DELAY * scale)
    );

    timers.push(
      setTimeout(() => {
        if (!cancelled.current) onComplete();
      }, COMPLETE_DELAY * scale)
    );

    return () => {
      cancelled.current = true;
      timers.forEach(clearTimeout);
    };
  }, [bootLines, onComplete]);

  return (
    <div className="space-y-1 mb-2">
      {bootLines.slice(0, visibleLines).map((line, i) => (
        <p key={i} className={`font-mono text-sm ${line.color}`}>
          {line.text}
        </p>
      ))}
      {showWhoami && (
        <div className="mt-3">
          <WhoamiOutput />
        </div>
      )}
    </div>
  );
}
