"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useTerminalNav } from "../../lib/nav-context";
import { useListKeyNav } from "../../lib/use-list-key-nav";

export default function ProjectsOutput() {
  const { projects } = usePortfolioData();
  const nav = useTerminalNav();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (i: number) => nav(`projects ${i + 1}`),
    [nav]
  );
  const selected = useListKeyNav(projects.length, handleSelect);

  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="font-mono text-sm space-y-1">
      {projects.map((p, i) => (
        <button
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
          tabIndex={-1}
          onClick={() => nav(`projects ${i + 1}`)}
          className={`w-full text-left space-y-1 px-1 py-2 rounded border-l-2 transition-colors duration-100 cursor-pointer ${
            selected === i
              ? "bg-[var(--t-accent-dim)] border-[var(--t-accent)]"
              : "border-transparent hover:bg-[var(--t-accent-dim)] hover:border-[var(--t-accent)]"
          }`}
        >
          <div className="flex gap-3 items-baseline">
            <span className={`flex-shrink-0 ${selected === i ? "text-[var(--t-accent)]" : "text-[var(--t-muted-3)]"}`}>
              [{i + 1}]
            </span>
            <span className="text-[var(--t-accent)] font-semibold">{p.name}</span>
            <span className="text-[var(--t-muted-3)] text-xs">{p.period}</span>
          </div>
          <p className="text-[var(--t-muted-1)] leading-relaxed ml-[4ch] text-xs">{p.description}</p>
        </button>
      ))}
      <p className="text-[var(--t-muted-3)] mt-1 px-1">
        ↑↓ to navigate · Enter or click to open
      </p>
    </div>
  );
}
