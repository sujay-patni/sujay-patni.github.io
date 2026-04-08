"use client";

import { useState, useEffect, useRef } from "react";

const INTRO =
  "Hi — I'm Sujay, a backend engineer at OfBusiness in Gurugram. I build scalable microservices, trading infrastructure, and AI-powered products. Currently shipping systems that handle crores in daily transactions.";

const CHAR_DELAY = 16; // ms per character

export default function TypewriterIntro() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayed(INTRO);
      setDone(true);
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled.current) return;
      i++;
      setDisplayed(INTRO.slice(0, i));
      if (i < INTRO.length) {
        timer = setTimeout(tick, CHAR_DELAY);
      } else {
        setDone(true);
      }
    }

    timer = setTimeout(tick, 120); // brief pause before starting

    return () => {
      cancelled.current = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <p className="font-mono text-sm text-zinc-400 leading-relaxed mb-4">
      {displayed}
      {!done && (
        <span className="cursor-blink inline-block w-[7px] h-[13px] bg-emerald-400 ml-0.5 align-middle" />
      )}
    </p>
  );
}
