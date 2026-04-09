"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

export default function MotdHeader() {
  const { personal } = usePortfolioData();

  return (
    <div className="flex-shrink-0 px-4 py-2.5 border-b border-[var(--t-border)] bg-[var(--t-surface)]" style={{ opacity: 0.9 }}>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs">
        <span className="text-[var(--t-accent)] font-semibold tracking-wide">
          {personal.name}
        </span>
        <span className="text-[var(--t-muted-4)] select-none">·</span>
        <span className="text-[var(--t-muted-1)]">{personal.title}</span>
        <span className="text-[var(--t-muted-4)] select-none">·</span>
        <span className="text-[var(--t-muted-2)]">OfBusiness</span>
        <span className="text-[var(--t-muted-4)] select-none">·</span>
        <span className="text-[var(--t-muted-3)]">{personal.location}</span>
      </div>
    </div>
  );
}
