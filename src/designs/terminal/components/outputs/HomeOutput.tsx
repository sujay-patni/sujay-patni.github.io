"use client";

import { useRef, useEffect, useCallback } from "react";
import TypewriterIntro from "../TypewriterIntro";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useTerminalNav } from "../../lib/nav-context";
import { useListKeyNav } from "../../lib/use-list-key-nav";

export default function HomeOutput() {
  const { personal, homeMetrics, homeCards } = usePortfolioData();
  const nav = useTerminalNav();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasMounted = useRef(false);

  const handleSelect = useCallback(
    (i: number) => {
      const card = homeCards[i];
      if (card) nav(card.cmd);
    },
    [homeCards, nav]
  );

  const [selected, setSelected] = useListKeyNav(homeCards.length, handleSelect);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="font-mono text-sm space-y-7">
      <section className="max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs">
          {personal.name ? (
            <span className="text-[var(--t-accent)] font-semibold tracking-wide">
              {personal.name}
            </span>
          ) : null}
          {personal.title ? (
            <>
              <span className="text-[var(--t-muted-4)] select-none">·</span>
              <span className="text-[var(--t-muted-1)]">{personal.title}</span>
            </>
          ) : null}
          {personal.company ? (
            <>
              <span className="text-[var(--t-muted-4)] select-none">·</span>
              <span className="text-[var(--t-muted-2)]">{personal.company}</span>
            </>
          ) : null}
          {personal.location ? (
            <>
              <span className="text-[var(--t-muted-4)] select-none">·</span>
              <span className="text-[var(--t-muted-3)]">{personal.location}</span>
            </>
          ) : null}
        </div>
        <div className="text-[var(--t-muted-3)] text-xs mb-3">
          <span className="text-[var(--t-accent)]">$</span> whoami
        </div>
        <TypewriterIntro />
      </section>

      <section className="grid grid-cols-2 xl:grid-cols-4 border border-[var(--t-border)] rounded-lg overflow-hidden bg-[var(--t-surface)]/35">
        {homeMetrics.map((metric, i) => (
          <div
            key={metric.label}
            className={`p-4 sm:p-5 ${i % 2 === 0 ? "border-r" : ""} xl:border-r border-[var(--t-border)] ${i < 2 ? "border-b xl:border-b-0" : ""} ${i === homeMetrics.length - 1 ? "xl:border-r-0" : ""}`}
          >
            <div className="text-2xl sm:text-3xl leading-none text-[var(--t-accent)] font-semibold tracking-tight">
              {metric.value}
            </div>
            <div className="mt-2 text-[var(--t-text-2)] text-xs sm:text-sm">{metric.label}</div>
            <div className="mt-1 text-[var(--t-muted-3)] text-[11px] leading-relaxed">{metric.note}</div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3 text-xs text-[var(--t-muted-3)]">
          <span className="text-[var(--t-accent)]">$</span>
          <span>ls -la recruiter-summary</span>
          <span className="h-px flex-1 bg-[var(--t-border)]" />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {homeCards.map((card, i) => {
            const active = selected === i;
            const { cmd, label, path, eyebrow, title, summary, meta } = card;

            return (
              <button
                key={cmd}
                ref={(el) => { itemRefs.current[i] = el; }}
                tabIndex={-1}
                onMouseEnter={() => setSelected(i)}
                onClick={() => nav(cmd)}
                className={`min-h-[164px] w-full text-left rounded-lg border p-4 sm:p-5 transition-all duration-150 cursor-pointer group flex flex-col ${
                  active
                    ? "bg-[var(--t-accent-dim)] border-[var(--t-accent)] shadow-[0_0_0_1px_var(--t-accent-dim)]"
                    : "bg-[var(--t-surface)]/45 border-[var(--t-border)] hover:bg-[var(--t-accent-dim)] hover:border-[var(--t-accent)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--t-muted-3)]">
                      {eyebrow}
                    </div>
                    <div className={`mt-2 text-lg leading-snug font-semibold ${active ? "text-[var(--t-accent)]" : "text-[var(--t-text)] group-hover:text-[var(--t-accent)]"}`}>
                      {label}
                    </div>
                  </div>
                  <span className={`text-xs ${active ? "text-[var(--t-accent)]" : "text-[var(--t-muted-3)] group-hover:text-[var(--t-accent)]"}`}>
                    {active ? ">" : "/"}
                  </span>
                </div>

                <div className="mt-4 text-[var(--t-text-2)] leading-relaxed">{title}</div>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[var(--t-muted-1)] line-clamp-3">
                  {summary}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[var(--t-muted-3)] truncate">{path}</span>
                  <span className={`${active ? "text-[var(--t-accent)]" : "text-[var(--t-accent-2)] group-hover:text-[var(--t-accent)]"} whitespace-nowrap`}>
                    {meta} -&gt;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-[var(--t-muted-3)] border-t border-[var(--t-border)] pt-4">
        ↑↓ to scan summaries · Enter or click to open · Esc to type ·{" "}
        <span className="text-[var(--t-muted-1)]">help</span> for all commands
      </p>
    </div>
  );
}
