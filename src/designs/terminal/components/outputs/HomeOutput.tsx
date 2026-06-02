"use client";

import { useRef, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";
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
      className="grid grid-cols-1 min-[460px]:grid-cols-2 xl:grid-cols-4 gap-px border border-[var(--t-border)] rounded-lg overflow-hidden bg-[var(--t-border)]"
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="min-w-0 bg-[color-mix(in_srgb,var(--t-surface)_35%,var(--t-bg))] p-4 sm:p-5"
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
            <span>ls -la summary</span>
            <span className="h-px flex-1 bg-[var(--t-border)]" />
          </div>
        </Reveal>

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          {homeCards.map((card, i) => {
            const active = selected === i;
            const { cmd, label, path, eyebrow, title, summary, meta } = card;

            return (
              <Reveal key={cmd} delay={i * 90} className="h-full min-w-0">
                <button
                  ref={(el) => { itemRefs.current[i] = el; }}
                  tabIndex={-1}
                  onMouseEnter={() => setSelected(i)}
                  onMouseMove={onCardMove}
                  onClick={() => nav(cmd)}
                  className={`home-card min-h-[220px] min-[460px]:min-h-[188px] h-full min-w-0 w-full text-left rounded-lg border p-4 sm:p-5 transition-all duration-150 cursor-pointer group flex flex-col ${
                    active
                      ? "bg-[var(--t-accent-dim)] border-[var(--t-accent)] shadow-[0_0_0_1px_var(--t-accent-dim)]"
                      : "bg-[var(--t-surface)]/45 border-[var(--t-border)] hover:bg-[var(--t-accent-dim)] hover:border-[var(--t-accent)]"
                  }`}
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
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
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[var(--t-muted-1)] line-clamp-5 min-[460px]:line-clamp-4 sm:line-clamp-3">
                    {summary}
                  </p>

                  <div className="terminal-code mt-auto flex min-w-0 items-center justify-between gap-3 border-t border-[var(--t-border)]/70 pt-3 text-[0.875rem] leading-[1.2]">
                    <span className="min-w-0 truncate text-[var(--t-muted-3)]">{path}</span>
                    <span className={`${active ? "text-[var(--t-accent)]" : "text-[var(--t-accent-2)] group-hover:text-[var(--t-accent)]"} inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap`}>
                      <span>{meta}</span>
                      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[var(--t-border)] pt-4 text-sm leading-relaxed text-[var(--t-muted-3)] sm:text-base">
          <span className="sm:hidden">Tap a summary to open it.</span>
          <span className="hidden sm:inline">Use keyboard or click to scan summaries</span>
          <span className="hidden text-[var(--t-muted-4)] sm:inline">·</span>
          <span className="hidden sm:inline">Enter opens the selected card</span>
          <span className="text-[var(--t-muted-4)]">·</span>
          <span>
            <span className="text-[var(--t-muted-1)]">help</span> for commands
          </span>
        </p>
      </Reveal>
    </div>
  );
}
