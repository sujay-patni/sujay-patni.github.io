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
  const [selected, setSelected] = useListKeyNav(projects.length, handleSelect);

  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="text-base space-y-2">
      {projects.map((p, i) => (
        <button
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
          tabIndex={-1}
          onMouseEnter={() => setSelected(i)}
          onClick={() => nav(`projects ${i + 1}`)}
          className={`w-full text-left space-y-2 px-2 py-3 rounded border-l-2 transition-colors duration-100 cursor-pointer ${
            selected === i
              ? "bg-[var(--t-accent-dim)] border-[var(--t-accent)]"
              : "border-transparent hover:bg-[var(--t-accent-dim)] hover:border-[var(--t-accent)]"
          }`}
        >
          <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline">
            <span className={`flex-shrink-0 ${selected === i ? "text-[var(--t-accent)]" : "text-[var(--t-muted-3)]"}`}>
              [{i + 1}]
            </span>
            <span className="text-[var(--t-accent)] font-semibold">{p.name}</span>
            <span className="terminal-code text-[var(--t-muted-3)] text-sm">{p.period}</span>
          </div>
          <p className="text-[var(--t-muted-1)] leading-relaxed sm:ml-[4ch] text-sm sm:text-base">{p.description}</p>
        </button>
      ))}
      <p className="text-[var(--t-muted-3)] mt-1 px-1">
        ↑↓ to navigate · Enter or click to open
      </p>
    </div>
  );
}
