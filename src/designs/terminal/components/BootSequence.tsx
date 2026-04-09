"use client";

import { useState, useEffect, useRef } from "react";
import WhoamiOutput from "./outputs/WhoamiOutput";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "Booting sujay-patni.github.io ...", color: "text-[var(--t-accent)]", delay: 0 },
  { text: "[OK] Loading identity ...", color: "text-[var(--t-accent-2)]", delay: 350 },
  { text: "[OK] Resolving 4 experience entries ...", color: "text-[var(--t-accent-2)]", delay: 700 },
  { text: "[OK] Mounting 2 publications ...", color: "text-[var(--t-accent-2)]", delay: 1050 },
  { text: "$ whoami", color: "text-[var(--t-muted-1)]", delay: 1500 },
];

const WHOAMI_DELAY = 1700;
const COMPLETE_DELAY = 3000;

export default function BootSequence({ onComplete }: BootSequenceProps) {
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

    BOOT_LINES.forEach((line, i) => {
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-1 mb-2">
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
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
