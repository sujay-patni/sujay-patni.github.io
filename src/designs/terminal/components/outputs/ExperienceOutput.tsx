"use client";

import React from "react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useInView } from "../../lib/use-animations";
import PublicationLink from "../PublicationLink";
import type { ExperienceItem } from "@/types/portfolio";

/**
 * Matches impact metrics so they can be emphasized inline: currency (₹50 Cr+),
 * percentages (120%), comma-grouped counts (10,000+), K-counts (500K+, 10K),
 * and plain "+" counts (25+). Ordered longest-first so alternation wins greedily.
 */
const METRIC_RE =
  /(₹\s?[\d,]+\s?Cr\+?|\d[\d,]*\.?\d*%|\d{1,3}(?:,\d{3})+\+?|\d{1,3}K\+?|\d+\+)/g;

function highlightMetrics(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let last = 0;
  METRIC_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = METRIC_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <span key={m.index} className="font-semibold text-[var(--t-accent)]">
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const SURFACE = "color-mix(in srgb, var(--t-surface) 55%, transparent)";
const SOFT_SURFACE = "color-mix(in srgb, var(--t-surface) 38%, transparent)";

function RoleCard({ job, index }: { job: ExperienceItem; index: number }) {
  const [ref, seen] = useInView<HTMLElement>();
  const company = job.company.split(" (")[0];
  const isCurrent = /present/i.test(job.period);

  return (
    <article
      ref={ref}
      className={`reveal ${seen ? "in" : ""} rounded-lg border border-[var(--t-border)] px-5 py-5 transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--t-accent)_55%,var(--t-border))] sm:px-6 sm:py-6`}
      style={{ ["--d" as string]: `${index * 70}ms`, backgroundColor: SOFT_SURFACE }}
    >
      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight text-[var(--t-accent)] sm:text-lg">
              {job.role}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--t-text-2)]">
              <span className="font-medium">{company}</span>
              {job.team ? <span className="text-[var(--t-muted-3)]"> · {job.team}</span> : null}
              {job.location ? (
                <span className="text-[var(--t-muted-3)]"> · {job.location}</span>
              ) : null}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span
              className="terminal-code rounded-md border border-[var(--t-border)] px-2.5 py-1 text-xs text-[var(--t-muted-2)]"
              style={{ backgroundColor: SURFACE }}
            >
              {job.period}
            </span>
            {isCurrent && (
              <span
                className="terminal-code inline-flex items-center gap-1.5 rounded-md border border-[var(--t-accent)] px-2.5 py-1 text-xs text-[var(--t-accent)]"
                style={{ backgroundColor: "var(--t-accent-dim)" }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--t-accent)]" />
                Current
              </span>
            )}
          </div>
        </div>

        {job.summary && (
          <p className="mt-4 max-w-4xl leading-relaxed text-[var(--t-muted-1)]">{job.summary}</p>
        )}

        <ul className="mt-4 grid gap-2.5 border-t border-[var(--t-border)] pt-4">
          {job.bullets.map((b, j) => (
            <li key={j} className="flex gap-3 text-[var(--t-text-2)]">
              <span
                aria-hidden
                className="mt-[0.7em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--t-accent)] opacity-80"
              >
                {" "}
              </span>
              <span className="leading-relaxed">{highlightMetrics(b)}</span>
            </li>
          ))}
        </ul>

        {job.publication && (
          <div className="mt-4">
            <PublicationLink label={job.publication} url={job.publicationUrl} />
          </div>
        )}
      </div>
    </article>
  );
}

export default function ExperienceOutput() {
  const { experience } = usePortfolioData();

  return (
    <div className="max-w-5xl space-y-4 text-base">
      <header className="terminal-code border-b border-[var(--t-border)] pb-3 text-sm text-[var(--t-muted-3)]">
        {experience.length} {experience.length === 1 ? "role" : "roles"} · most recent first
      </header>
      {experience.map((job, i) => (
        <RoleCard key={i} job={job} index={i} />
      ))}
    </div>
  );
}
