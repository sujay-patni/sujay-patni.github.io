"use client";

import { useRef, useEffect, useCallback } from "react";
import TypewriterIntro from "../TypewriterIntro";
import Reveal from "../Reveal";
import HeroHeader from "./home/HeroHeader";
import HeatmapPlusStack from "./home/RightPanel";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useTerminalNav } from "../../lib/nav-context";
import { useListKeyNav } from "../../lib/use-list-key-nav";
import { useInView, useCountUp, splitLeadingInt } from "../../lib/use-animations";
import type { HomeMetric } from "@/types/portfolio";

/* One metric cell — counts the leading number up once scrolled into view. */
function Metric({ metric, run }: { metric: HomeMetric; run: boolean }) {
  const parts = splitLeadingInt(metric.value);
  const n = useCountUp(parts?.num ?? 0, run);
  return (
    <>
      <div className="text-2xl sm:text-3xl leading-none text-[var(--t-accent)] font-semibold tracking-tight tabular-nums">
        {parts ? `${parts.prefix}${n}${parts.suffix}` : metric.value}
      </div>
      <div className="mt-2 text-[var(--t-text-2)] text-sm sm:text-base">{metric.label}</div>
      <div className="mt-1 text-[var(--t-muted-3)] text-sm leading-relaxed">{metric.note}</div>
    </>
  );
}

function Metrics({ metrics }: { metrics: HomeMetric[] }) {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.35 });
  return (
    <section
      ref={ref}
      className="grid grid-cols-2 xl:grid-cols-4 border border-[var(--t-border)] rounded-lg overflow-hidden bg-[var(--t-surface)]/35"
    >
      {metrics.map((metric, i) => (
        <div
          key={metric.label}
          className={`p-4 sm:p-5 ${i % 2 === 0 ? "border-r" : ""} xl:border-r border-[var(--t-border)] ${i < 2 ? "border-b xl:border-b-0" : ""} ${i === metrics.length - 1 ? "xl:border-r-0" : ""}`}
        >
          <Metric metric={metric} run={seen} />
        </div>
      ))}
    </section>
  );
}

export default function HomeOutput() {
  const { homeMetrics, homeCards } = usePortfolioData();
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

  const onCardMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div className="text-base space-y-10">
      <div className="home-grid">
        {/* LEFT — identity hero + typed intro */}
        <div>
          <Reveal>
            <HeroHeader />
          </Reveal>
          <Reveal delay={60}>
            <TypewriterIntro />
          </Reveal>
        </div>

        {/* RIGHT — git heatmap + tech stack (fills the empty space) */}
        <Reveal delay={140} className="right-col">
          <HeatmapPlusStack />
        </Reveal>
      </div>

      {/* metrics — full width, count-up on scroll */}
      <Reveal>
        <Metrics metrics={homeMetrics} />
      </Reveal>

      <section className="space-y-3">
        <Reveal>
          <div className="terminal-code flex items-center gap-3 text-sm text-[var(--t-muted-3)]">
            <span className="text-[var(--t-accent)]">$</span>
            <span>ls -la recruiter-summary</span>
            <span className="h-px flex-1 bg-[var(--t-border)]" />
          </div>
        </Reveal>

        <div className="grid gap-3 lg:grid-cols-2">
          {homeCards.map((card, i) => {
            const active = selected === i;
            const { cmd, label, path, eyebrow, title, summary, meta } = card;

            return (
              <Reveal key={cmd} delay={i * 90} className="h-full">
                <button
                  ref={(el) => { itemRefs.current[i] = el; }}
                  tabIndex={-1}
                  onMouseEnter={() => setSelected(i)}
                  onMouseMove={onCardMove}
                  onClick={() => nav(cmd)}
                  className={`home-card min-h-[164px] h-full w-full text-left rounded-lg border p-4 sm:p-5 transition-all duration-150 cursor-pointer group flex flex-col ${
                    active
                      ? "bg-[var(--t-accent-dim)] border-[var(--t-accent)] shadow-[0_0_0_1px_var(--t-accent-dim)]"
                      : "bg-[var(--t-surface)]/45 border-[var(--t-border)] hover:bg-[var(--t-accent-dim)] hover:border-[var(--t-accent)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="terminal-code text-xs uppercase tracking-[0.16em] text-[var(--t-muted-3)]">
                        {eyebrow}
                      </div>
                      <div className={`mt-2 text-xl leading-snug font-semibold ${active ? "text-[var(--t-accent)]" : "text-[var(--t-text)] group-hover:text-[var(--t-accent)]"}`}>
                        {label}
                      </div>
                    </div>
                    <span className={`text-xs ${active ? "text-[var(--t-accent)]" : "text-[var(--t-muted-3)] group-hover:text-[var(--t-accent)]"}`}>
                      {active ? ">" : "/"}
                    </span>
                  </div>

                  <div className="mt-4 text-[var(--t-text-2)] leading-relaxed">{title}</div>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--t-muted-1)] line-clamp-3">
                    {summary}
                  </p>

                  <div className="terminal-code mt-auto pt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="text-[var(--t-muted-3)] truncate">{path}</span>
                    <span className={`${active ? "text-[var(--t-accent)]" : "text-[var(--t-accent-2)] group-hover:text-[var(--t-accent)]"} whitespace-nowrap`}>
                      {meta} -&gt;
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal>
        <p className="text-[var(--t-muted-3)] border-t border-[var(--t-border)] pt-4">
          ↑↓ to scan summaries · Enter or click to open · Esc to type ·{" "}
          <span className="text-[var(--t-muted-1)]">help</span> for all commands
        </p>
      </Reveal>
    </div>
  );
}
