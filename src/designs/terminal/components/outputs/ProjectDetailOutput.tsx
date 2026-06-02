"use client";

import React from "react";
import { usePortfolioData } from "@/lib/portfolio-data";

interface ProjectDetailOutputProps {
  index: number;
}

const METRIC_RE =
  /(₹\s?[\d,]+\s?Cr\+?|\d[\d,]*\.?\d*%|\d{1,3}(?:,\d{3})+\+?|\d{1,3}K\+?|\d+\+)/g;

function highlightMetrics(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let last = 0;
  METRIC_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = METRIC_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <span key={m.index} className="font-semibold text-[var(--t-accent)]">
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
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
      {project.summary && (
        <p className="text-[var(--t-muted-1)] leading-relaxed">{highlightMetrics(project.summary)}</p>
      )}
      <p className={project.summary ? "text-[var(--t-text-2)] leading-relaxed" : "text-[var(--t-muted-1)] leading-relaxed"}>
        {highlightMetrics(project.description)}
      </p>
      {project.publication && (
        <div className="mt-1">
          <span
            className="terminal-code inline-flex items-center gap-1 rounded-full border border-[var(--t-accent-2)] px-2 py-0.5 text-xs text-[var(--t-accent-2)]"
            style={{ backgroundColor: "var(--t-accent-dim)" }}
          >
            ↗ {project.publication}
          </span>
        </div>
      )}
      <div className="chips mt-1">
        {project.tech.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
