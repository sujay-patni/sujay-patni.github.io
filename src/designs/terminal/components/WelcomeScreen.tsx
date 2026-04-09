"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onComplete: () => void;
}

const STATUS_LINES = [
  { text: "[ OK ] Loading identity manifest ...", delay: 700 },
  { text: "[ OK ] Resolving experience entries ...", delay: 1050 },
  { text: "[ OK ] Mounting publications ...", delay: 1400 },
  { text: "[ OK ] Initializing command registry ...", delay: 1750 },
  { text: "[ READY ] System nominal.", delay: 2150, highlight: true },
];

const CURSOR_DELAY = 2450;
const COMPLETE_DELAY = 3300;

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [scanDone, setScanDone] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const cancelled = useRef(false);
  const completeCalled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    completeCalled.current = false;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = prefersReduced ? 0.05 : 1;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        if (!cancelled.current) setScanDone(true);
      }, 520 * s)
    );

    STATUS_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled.current) setVisibleLines(i + 1);
        }, line.delay * s)
      );
    });

    timers.push(
      setTimeout(() => {
        if (!cancelled.current) setShowCursor(true);
      }, CURSOR_DELAY * s)
    );

    timers.push(
      setTimeout(() => {
        if (!cancelled.current && !completeCalled.current) {
          completeCalled.current = true;
          onComplete();
        }
      }, COMPLETE_DELAY * s)
    );

    function handleKey() {
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }

    window.addEventListener("keydown", handleKey, { once: true });
    window.addEventListener("pointerdown", handleKey, { once: true });

    return () => {
      cancelled.current = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handleKey);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(6px)", scale: 1.015 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[var(--t-bg)] flex flex-col items-center justify-center overflow-hidden"
      aria-label="Loading portfolio"
      aria-live="polite"
    >
      {/* Scanlines overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none" />

      {/* CRT vignette */}
      <div className="crt-vignette absolute inset-0 pointer-events-none" />

      {/* Scan beam that sweeps down on load */}
      {!scanDone && (
        <motion.div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: "120px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(var(--t-accent-rgb),0.06) 40%, rgba(var(--t-accent-rgb),0.12) 50%, rgba(var(--t-accent-rgb),0.06) 60%, transparent 100%)",
            top: 0,
          }}
          initial={{ y: "-120px" }}
          animate={{ y: "calc(100vh + 120px)" }}
          transition={{ duration: 0.52, ease: "linear" }}
        />
      )}

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        {/* Name block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scanDone ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center gap-3"
        >
          <h1
            className="font-mono font-bold tracking-[0.18em] text-[var(--t-accent)] select-none"
            style={{
              fontSize: "clamp(2rem, 8vw, 5.5rem)",
              textShadow:
                "0 0 30px rgba(var(--t-accent-rgb),0.45), 0 0 70px rgba(var(--t-accent-rgb),0.2), 0 0 120px rgba(var(--t-accent-rgb),0.08)",
            }}
          >
            SUJAY PATNI
          </h1>
          <p
            className="font-mono text-[var(--t-muted-2)] tracking-[0.45em] uppercase"
            style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.85rem)" }}
          >
            Software Engineer
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: scanDone ? 1 : 0, opacity: scanDone ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="h-px w-80 bg-[var(--t-border)] origin-center"
        />

        {/* Boot status lines */}
        <div className="font-mono text-xs text-left w-full max-w-sm space-y-1.5 min-h-[7rem]">
          {STATUS_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className={line.highlight ? "text-[var(--t-accent)]" : "text-[var(--t-muted-3)]"}
            >
              {line.text}
            </motion.p>
          ))}

          {showCursor && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-[var(--t-muted-4)] pt-2"
            >
              press any key to continue
              <span className="cursor-blink ml-0.5">_</span>
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
