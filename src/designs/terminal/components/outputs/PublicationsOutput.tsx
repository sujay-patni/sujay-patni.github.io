"use client";

import { ExternalLink } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-data";
import Reveal from "../Reveal";

const PILL =
  "terminal-code inline-flex w-fit items-center rounded-md border border-[var(--t-accent-2)] px-2 py-1 text-xs leading-snug text-[var(--t-accent-2)]";

export default function PublicationsOutput() {
  const { publications } = usePortfolioData();

  return (
    <div className="text-base space-y-5">
      <div className="terminal-code flex items-center gap-3 text-sm text-[var(--t-muted-3)]">
        <span className="text-[var(--t-accent)]">$</span>
        <span>cat publications.txt</span>
        <span className="h-px flex-1 bg-[var(--t-border)]" />
      </div>

      <div className="space-y-4 max-w-3xl">
        {publications.map((pub, i) => {
          const card = (
            <div className="home-card group rounded-xl border border-[var(--t-border)] bg-[var(--t-surface)]/45 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:shadow-[0_8px_30px_rgba(var(--t-accent-rgb),0.12)]">
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <span className="terminal-code text-xs text-[var(--t-muted-3)] select-none">
                  [{i + 1}]
                </span>
                <span className={PILL} style={{ backgroundColor: "var(--t-accent-dim)" }}>
                  {pub.venue}
                </span>
                <span className="terminal-code ml-auto text-xs text-[var(--t-muted-2)]">
                  {pub.date}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold leading-snug text-[var(--t-text)] transition-colors group-hover:text-[var(--t-accent)]">
                  {pub.title}
                </span>
                {pub.url && (
                  <ExternalLink className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-[var(--t-accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
            </div>
          );

          return (
            <Reveal key={pub.title} delay={i * 70}>
              {pub.url ? (
                <a href={pub.url} target="_blank" rel="noopener noreferrer" className="block">
                  {card}
                </a>
              ) : (
                card
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
