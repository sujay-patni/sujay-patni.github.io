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
      <p className="terminal-code font-mono text-base text-[var(--t-error)]">
        error: no entry {index} — use &apos;projects&apos; to list all
      </p>
    );
  }

  return (
    <div className="text-base space-y-3 max-w-5xl">
      <div>
        <span className="text-[var(--t-accent)] font-semibold">{project.name}</span>
        <span className="terminal-code text-[var(--t-muted-3)] text-sm ml-2">{project.period}</span>
      </div>
      <p className="text-[var(--t-muted-1)] leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {project.tech.map((t) => (
          <span key={t} className="terminal-code text-sm text-[var(--t-muted-2)] border border-[var(--t-border)] rounded px-2 py-1">
            {t}
          </span>
        ))}
      </div>
      {project.publication && (
        <div className="text-sm text-[var(--t-accent-2)] mt-1">↗ {project.publication}</div>
      )}
    </div>
  );
}
