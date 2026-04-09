"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

export default function WhoamiOutput() {
  const { personal, config } = usePortfolioData();

  const rows: Array<[string, React.ReactNode]> = [
    ["name", personal.name],
    ["title", personal.title],
    ...(config.currently_doing ? [["currently", config.currently_doing] as [string, React.ReactNode]] : []),
    ["tagline", personal.tagline],
    ["location", personal.location],
    ["email", <a key="email" href={`mailto:${personal.email}`} className="underline underline-offset-2 hover:text-[var(--t-text)] transition-colors">{personal.email}</a>],
    ["github", <a key="github" href={personal.github} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[var(--t-text)] transition-colors">{personal.github.replace("https://", "")}</a>],
    ["linkedin", <a key="linkedin" href={personal.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[var(--t-text)] transition-colors">{personal.linkedin.replace("https://", "")}</a>],
  ];

  return (
    <div className="font-mono text-sm space-y-0.5">
      {rows.map(([key, value]) => (
        <div key={key} className="grid grid-cols-[10ch_1fr] gap-x-3">
          <span className="text-[var(--t-muted-2)]">{key}</span>
          <span className="text-[var(--t-text-2)]">{value}</span>
        </div>
      ))}
    </div>
  );
}
