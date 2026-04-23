"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

interface ProjectDetailOutputProps {
  index: number;
}

export default function ProjectDetailOutput({ index }: ProjectDetailOutputProps) {
  const { projects } = usePortfolioData();
  const project = projects[index - 1];

  if (!project) {
    return (
      <p className="font-mono text-sm text-[var(--t-error)]">
        error: no entry {index} — use &apos;projects&apos; to list all
      </p>
    );
  }

  return (
    <div className="font-mono text-sm space-y-2">
      <div>
        <span className="text-[var(--t-accent)] font-semibold">{project.name}</span>
        <span className="text-[var(--t-muted-3)] text-xs ml-2">{project.period}</span>
      </div>
      <p className="text-[var(--t-muted-1)] leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {project.tech.map((t) => (
          <span key={t} className="text-xs text-[var(--t-muted-2)] border border-[var(--t-border)] rounded px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>
      {project.publication && (
        <div className="text-xs text-[var(--t-accent-2)] mt-1">↗ {project.publication}</div>
      )}
    </div>
  );
}
