"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

interface PublicationDetailOutputProps {
  index: number;
}

export default function PublicationDetailOutput({ index }: PublicationDetailOutputProps) {
  const { publications } = usePortfolioData();
  const pub = publications[index - 1];

  if (!pub) {
    return (
      <p className="terminal-code font-mono text-base text-[var(--t-error)]">
        error: no entry {index} — use &apos;publications&apos; to list all
      </p>
    );
  }

  return (
    <div className="text-base space-y-2 max-w-5xl">
      <div className="text-[var(--t-text-2)] leading-relaxed">{pub.title}</div>
      <div className="text-[var(--t-accent-2)] text-sm">{pub.venue}</div>
      <div className="terminal-code text-[var(--t-muted-3)] text-sm">{pub.date}</div>
    </div>
  );
}
