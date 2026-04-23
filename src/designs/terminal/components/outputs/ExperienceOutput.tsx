"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useTerminalNav } from "../../lib/nav-context";
import { useListKeyNav } from "../../lib/use-list-key-nav";

export default function ExperienceOutput() {
  const { experience } = usePortfolioData();
  const nav = useTerminalNav();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (i: number) => nav(`experience ${i + 1}`),
    [nav]
  );
  const selected = useListKeyNav(experience.length, handleSelect);

  // Scroll selected item into view on keyboard navigation
  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="font-mono text-sm space-y-0.5">
      {experience.map((job, i) => (
        <button
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
          tabIndex={-1}
          onClick={() => nav(`experience ${i + 1}`)}
          className={`w-full text-left px-1 py-1 rounded border-l-2 transition-colors duration-100 cursor-pointer ${
            selected === i
              ? "bg-[var(--t-accent-dim)] border-[var(--t-accent)]"
              : "border-transparent hover:bg-[var(--t-accent-dim)] hover:border-[var(--t-accent)]"
          }`}
        >
          <div className="flex flex-col gap-0.5 sm:grid sm:grid-cols-[4ch_16ch_20ch_1fr] sm:gap-x-3 sm:gap-y-0">
            <div className="flex gap-2 sm:contents">
              <span className={`${selected === i ? "text-[var(--t-accent)]" : "text-[var(--t-muted-3)]"}`}>
                [{i + 1}]
              </span>
              <span className="text-[var(--t-muted-2)]">[{job.period.split("–")[0].trim()}]</span>
            </div>
            <div className="flex gap-2 sm:contents">
              <span className="text-[var(--t-text-2)]">{job.role}</span>
              <span className="text-[var(--t-accent)]">{job.company.split(" (")[0]}</span>
            </div>
          </div>
        </button>
      ))}
      <p className="text-[var(--t-muted-3)] mt-2 px-1">
        ↑↓ to navigate · Enter or click to open
      </p>
    </div>
  );
}
