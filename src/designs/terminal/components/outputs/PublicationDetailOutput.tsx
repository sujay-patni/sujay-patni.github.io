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
      <p className="font-mono text-sm text-[var(--t-error)]">
        error: no entry {index} — use &apos;publications&apos; to list all
      </p>
    );
  }

  return (
    <div className="font-mono text-sm space-y-2">
      <div className="text-[var(--t-text-2)] leading-relaxed">{pub.title}</div>
      <div className="text-[var(--t-accent-2)] text-xs">{pub.venue}</div>
      <div className="text-[var(--t-muted-3)] text-xs">{pub.date}</div>
    </div>
  );
}
