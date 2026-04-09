"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

export default function EducationOutput() {
  const { education } = usePortfolioData();

  return (
    <div className="font-mono text-sm space-y-4">
      {education.map((edu, i) => (
        <div key={i} className="space-y-0.5">
          <div className="text-[var(--t-accent)] font-semibold">{edu.institution}</div>
          <div className="text-[var(--t-text-2)]">{edu.degree}</div>
          <div className="text-[var(--t-muted-2)] text-xs">{edu.period} · {edu.location}</div>
          <div className="text-[var(--t-muted-1)] text-xs">{edu.score}</div>
        </div>
      ))}
    </div>
  );
}
