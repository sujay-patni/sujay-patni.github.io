"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

export default function PublicationsOutput() {
  const { publications } = usePortfolioData();

  return (
    <div className="font-mono text-sm space-y-4">
      {publications.map((pub, i) => (
        <div key={i} className="space-y-1">
          <div className="text-[var(--t-text-2)] leading-relaxed">{pub.title}</div>
          <div className="text-[var(--t-accent-2)] text-xs">{pub.venue}</div>
          <div className="text-[var(--t-muted-3)] text-xs">{pub.date}</div>
        </div>
      ))}
    </div>
  );
}
