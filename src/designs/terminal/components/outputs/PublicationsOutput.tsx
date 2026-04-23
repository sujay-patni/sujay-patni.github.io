"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useTerminalNav } from "../../lib/nav-context";
import { useListKeyNav } from "../../lib/use-list-key-nav";

export default function PublicationsOutput() {
  const { publications } = usePortfolioData();
  const nav = useTerminalNav();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = useCallback(
    (i: number) => nav(`publications ${i + 1}`),
    [nav]
  );
  const selected = useListKeyNav(publications.length, handleSelect);

  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="font-mono text-sm space-y-1">
      {publications.map((pub, i) => (
        <button
          key={i}
          ref={(el) => { itemRefs.current[i] = el; }}
          tabIndex={-1}
          onClick={() => nav(`publications ${i + 1}`)}
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
            <span className="text-[var(--t-text-2)] leading-relaxed">{pub.title}</span>
          </div>
          <div className="ml-[4ch] space-y-0.5">
            <div className="text-[var(--t-accent-2)] text-xs">{pub.venue}</div>
            <div className="text-[var(--t-muted-3)] text-xs">{pub.date}</div>
          </div>
        </button>
      ))}
      <p className="text-[var(--t-muted-3)] mt-1 px-1">
        ↑↓ to navigate · Enter or click to open
      </p>
    </div>
  );
}
