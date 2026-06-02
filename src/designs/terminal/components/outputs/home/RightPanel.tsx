"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useInView, useCountUp } from "../../../lib/use-animations";
import Reveal from "../../Reveal";

/* ── GitHub contribution data (written by scripts/sync-github.ts) ─────────── */
interface GitHubDay {
  date: string;
  count: number;
}
interface GitHubData {
  totalContributions: number;
  totalContributionsAllTime?: number;
  currentStreak: number;
  longestStreak?: number;
  /** weeks → 7 days each (Sun..Sat), oldest week first */
  weeks: GitHubDay[][];
}

// Target width (px) per week column incl. gap — used to pick how many weeks fit.
const WEEK_PX = 18;
const MIN_WEEKS = 10;
// Opacity ramp for contribution levels 0..4.
const ALPHA = [0, 0.28, 0.5, 0.74, 1];

function levelFor(count: number, max: number): number {
  if (count <= 0) return 0;
  const r = count / Math.max(max, 1);
  if (r > 0.66) return 4;
  if (r > 0.4) return 3;
  if (r > 0.15) return 2;
  return 1;
}

function Heatmap({ data }: { data: GitHubData }) {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(19);

  // Show as many trailing weeks as comfortably fill the panel's current width.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (!w) return;
      const n = Math.floor(w / WEEK_PX);
      setCols(Math.max(MIN_WEEKS, Math.min(data.weeks.length, n)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data.weeks.length]);

  const weeks = data.weeks.slice(-cols);
  const flat = weeks.flat();
  const max = flat.reduce((m, d) => Math.max(m, d.count), 0);

  // Render column-major (grid-auto-flow: column) so each column is one week.
  const cells: { lvl: number; w: number; r: number }[] = [];
  weeks.forEach((week, w) => {
    week.forEach((day, r) => cells.push({ lvl: levelFor(day.count, max), w, r }));
  });

  const allTime = data.totalContributionsAllTime ?? data.totalContributions;
  const total = useCountUp(allTime, seen, 1400);

  const bg = (lvl: number) =>
    lvl === 0
      ? "color-mix(in srgb, var(--t-muted-4) 55%, transparent)"
      : `rgba(var(--t-accent-rgb), ${ALPHA[lvl]})`;

  return (
    <div className="panel" ref={ref}>
      <div className="panel-bar">
        <span className="pdot bg-emerald-500" />
        <span className="ttl">~/git · last {weeks.length} weeks</span>
      </div>
      <div className="panel-body">
        <div
          className="heat"
          ref={gridRef}
          style={{ "--weeks": weeks.length } as CSSProperties}
        >
          {cells.map((c, i) => (
            <span
              key={i}
              className={`heat-cell ${seen ? "lit" : ""}`}
              style={{
                background: bg(c.lvl),
                transitionDelay: `${c.w * 26 + c.r * 4}ms`,
              }}
            />
          ))}
        </div>
        <div className="heat-legend">
          <span>less</span>
          {ALPHA.map((_, i) => (
            <span key={i} className="sw" style={{ background: bg(i) }} />
          ))}
          <span>more</span>
        </div>

        <div className="gh-total">
          <div className="gh-total-figure">
            <span className="gh-total-num">{total.toLocaleString()}</span>
            <span className="gh-total-unit">contributions</span>
          </div>
          <div className="gh-total-sub">
            <span className="gh-total-dot" aria-hidden="true" />
            {data.totalContributions.toLocaleString()} in the last year
          </div>
        </div>
      </div>
    </div>
  );
}

function TechStack() {
  const { skills } = usePortfolioData();
  let n = 0;
  return (
    <div className="panel">
      <div className="panel-bar">
        <span className="pdot bg-emerald-500" />
        <span className="ttl">~/skills · stack</span>
      </div>
      <div className="panel-body">
        {skills.map((group) => (
          <div className="stack-group" key={group.category}>
            <div className="stack-cat">{group.category}</div>
            <div className="chips">
              {group.items.map((item) => (
                <Reveal as="span" className="chip" delay={n++ * 35} key={item}>
                  {item}
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Fills the empty space beside the home intro: the GitHub contribution heatmap
 * stacked above the tech-stack chips. The heatmap only renders once real data
 * loads from /github-data.json — if it is missing (e.g. local dev before the
 * first sync) we cleanly show the tech stack alone rather than fabricated stats.
 */
export default function HeatmapPlusStack() {
  const [data, setData] = useState<GitHubData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/github-data.json")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((json: GitHubData | null) => {
        if (!cancelled && json && Array.isArray(json.weeks) && json.weeks.length) {
          setData(json);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="panel-stack">
      {data ? <Heatmap data={data} /> : null}
      <TechStack />
    </div>
  );
}
