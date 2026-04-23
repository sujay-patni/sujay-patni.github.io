"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

interface ExperienceDetailOutputProps {
  index: number;
}

export default function ExperienceDetailOutput({ index }: ExperienceDetailOutputProps) {
  const { experience } = usePortfolioData();
  const job = experience[index - 1];

  if (!job) {
    return (
      <p className="font-mono text-sm text-[var(--t-error)]">
        error: no entry {index} — use &apos;experience&apos; to list all
      </p>
    );
  }

  return (
    <div className="font-mono text-sm space-y-2">
      <div>
        <span className="text-[var(--t-accent)] font-semibold">{job.role}</span>
        <span className="text-[var(--t-muted-2)]"> @ </span>
        <span className="text-[var(--t-text-2)]">{job.company.split(" (")[0]}</span>
      </div>
      <div className="text-[var(--t-muted-3)] text-xs">
        {job.team} · {job.period} · {job.location}
      </div>
      <ul className="space-y-1 ml-2 mt-2">
        {job.bullets.map((b, j) => (
          <li key={j} className="flex gap-2 text-[var(--t-muted-1)]">
            <span className="text-[var(--t-muted-3)] flex-shrink-0">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
