"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

export default function ProjectsOutput() {
  const { projects } = usePortfolioData();

  return (
    <div className="font-mono text-sm space-y-5">
      {projects.map((p, i) => (
        <div key={i} className="space-y-1.5">
          <div className="text-[var(--t-accent)] font-semibold">{p.name}</div>
          <div className="text-[var(--t-muted-3)] text-xs">{p.period}</div>
          <p className="text-[var(--t-muted-1)] leading-relaxed">{p.description}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {p.tech.map((t) => (
              <span key={t} className="text-xs text-[var(--t-muted-2)] border border-[var(--t-border)] rounded px-1.5 py-0.5">
                {t}
              </span>
            ))}
          </div>
          {p.publication && (
            <div className="text-xs text-[var(--t-accent-2)] mt-1">↗ {p.publication}</div>
          )}
        </div>
      ))}
    </div>
  );
}
