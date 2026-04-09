"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

function parseStartYear(period: string): number {
  const match = period.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

type TimelineItem = {
  type: "experience" | "education";
  year: number;
  title: string;
  subtitle: string;
  period: string;
};

export default function TimelineOutput() {
  const { experience, education } = usePortfolioData();

  const items: TimelineItem[] = [
    ...experience.map((e) => ({
      type: "experience" as const,
      year: parseStartYear(e.period),
      title: e.role,
      subtitle: e.company.split(" (")[0],
      period: e.period,
    })),
    ...education.map((e) => ({
      type: "education" as const,
      year: parseStartYear(e.period),
      title: e.degree,
      subtitle: e.institution,
      period: e.period,
    })),
  ].sort((a, b) => b.year - a.year || (a.type === "education" ? 1 : -1));

  return (
    <div className="font-mono text-sm space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="text-[var(--t-muted-3)] text-xs w-10 pt-0.5 flex-shrink-0 text-right select-none">
            {item.year}
          </div>
          <div className="flex flex-col gap-0.5 border-l border-[var(--t-border)] pl-4 pb-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs select-none ${
                  item.type === "experience"
                    ? "text-[var(--t-accent)]"
                    : "text-[var(--t-muted-1)]"
                }`}
              >
                ●
              </span>
              <span
                className={
                  item.type === "experience"
                    ? "text-[var(--t-accent)] font-semibold"
                    : "text-[var(--t-muted-1)] font-semibold"
                }
              >
                {item.title}
              </span>
              {item.type === "education" && (
                <span className="text-[var(--t-muted-3)] text-xs">[edu]</span>
              )}
            </div>
            <div className="text-[var(--t-muted-2)] text-xs pl-4">{item.subtitle}</div>
            <div className="text-[var(--t-muted-3)] text-xs pl-4">{item.period}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
