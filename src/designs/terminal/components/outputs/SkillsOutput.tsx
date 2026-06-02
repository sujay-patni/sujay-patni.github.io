"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

interface SkillsOutputProps {
  tree: boolean;
}

export default function SkillsOutput({ tree }: SkillsOutputProps) {
  const { skills } = usePortfolioData();

  if (tree) {
    const lines: string[] = ["skills/"];
    skills.forEach((cat, ci) => {
      const isLastCat = ci === skills.length - 1;
      lines.push(`${isLastCat ? "└──" : "├──"} ${cat.category}/`);
      cat.items.forEach((item, ii) => {
        const isLastItem = ii === cat.items.length - 1;
        const prefix = isLastCat ? "    " : "│   ";
        lines.push(`${prefix}${isLastItem ? "└──" : "├──"} ${item}`);
      });
    });

    return (
      <pre className="terminal-code font-mono text-base leading-relaxed overflow-x-auto">
        {lines.map((line, i) => {
          const isCategoryLine = line.match(/^[├└]──.+\/$/) !== null;
          return (
            <div key={i}>
              <span className={isCategoryLine ? "text-[var(--t-accent)]" : "text-[var(--t-muted-1)]"}>
                {line}
              </span>
            </div>
          );
        })}
      </pre>
    );
  }

  return (
    <div className="text-base space-y-4">
      {skills.map((cat) => (
        <div key={cat.category}>
          <div className="text-[var(--t-accent)] mb-1">{cat.category}</div>
          <div className="flex flex-wrap gap-2 ml-2">
            {cat.items.map((item) => (
              <span key={item} className="terminal-code text-[var(--t-muted-1)] border border-[var(--t-border)] rounded px-2.5 py-1 text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
