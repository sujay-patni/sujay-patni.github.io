"use client";

import { Database, Code2, Server, Wrench, Cpu } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-data";
import Reveal from "../Reveal";

// Categories come from Notion and can be renamed — match loosely.
function categoryIcon(category: string) {
  const c = category.toLowerCase();
  const cls = "h-4 w-4";
  if (c.includes("database")) return <Database className={cls} />;
  if (c.includes("language")) return <Code2 className={cls} />;
  if (c.includes("backend") || c.includes("framework")) return <Server className={cls} />;
  if (c.includes("tool") || c.includes("platform")) return <Wrench className={cls} />;
  return <Cpu className={cls} />;
}

export default function SkillsOutput() {
  const { skills } = usePortfolioData();
  const total = skills.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="text-base space-y-5">
      <div className="terminal-code flex items-center gap-3 text-sm text-[var(--t-muted-3)]">
        <span className="text-[var(--t-accent)]">$</span>
        <span>cat skills.txt</span>
        <span className="h-px flex-1 bg-[var(--t-border)]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 70}>
            <div className="home-card h-full rounded-xl border border-[var(--t-border)] bg-[var(--t-surface)]/45 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:shadow-[0_8px_30px_rgba(var(--t-accent-rgb),0.12)]">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--t-border)] text-[var(--t-accent)]" style={{ backgroundColor: "var(--t-accent-dim)" }}>
                  {categoryIcon(group.category)}
                </span>
                <span className="font-semibold text-[var(--t-accent)]">
                  {group.category}
                </span>
                <span className="terminal-code ml-auto text-xs text-[var(--t-muted-3)]">
                  [{group.items.length}]
                </span>
              </div>
              <div className="chips">
                {group.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="terminal-code text-xs text-[var(--t-muted-3)]">
        {"// "}{total} skills across {skills.length} categories
      </p>
    </div>
  );
}
