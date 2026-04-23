"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

export default function ContactOutput() {
  const { personal } = usePortfolioData();

  return (
    <div className="font-mono text-sm space-y-0.5">
      <div className="grid grid-cols-[10ch_1fr] gap-x-3">
        <span className="text-[var(--t-muted-2)]">email</span>
        <a href={`mailto:${personal.email}`} className="text-[var(--t-text-2)] underline underline-offset-2 hover:text-[var(--t-accent)] transition-colors break-all">
          {personal.email}
        </a>
      </div>
      {personal.phone && (
        <div className="grid grid-cols-[10ch_1fr] gap-x-3">
          <span className="text-[var(--t-muted-2)]">phone</span>
          <a href={`tel:${personal.phone}`} className="text-[var(--t-text-2)] underline underline-offset-2 hover:text-[var(--t-accent)] transition-colors">
            {personal.phone}
          </a>
        </div>
      )}
      <div className="grid grid-cols-[10ch_1fr] gap-x-3">
        <span className="text-[var(--t-muted-2)]">github</span>
        <a href={personal.github} target="_blank" rel="noreferrer" className="text-[var(--t-text-2)] underline underline-offset-2 hover:text-[var(--t-accent)] transition-colors break-all">
          {personal.github.replace("https://", "")}
        </a>
      </div>
      <div className="grid grid-cols-[10ch_1fr] gap-x-3">
        <span className="text-[var(--t-muted-2)]">linkedin</span>
        <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-[var(--t-text-2)] underline underline-offset-2 hover:text-[var(--t-accent)] transition-colors break-all">
          {personal.linkedin.replace("https://", "")}
        </a>
      </div>
    </div>
  );
}
