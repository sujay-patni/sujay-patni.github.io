"use client";

import React from "react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useInView } from "../../lib/use-animations";
import PublicationLink from "../PublicationLink";
import type { ProjectItem } from "@/types/portfolio";

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

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const [ref, seen] = useInView<HTMLElement>();
  const lead = project.summary ?? project.description;
  const hasDistinctDescription =
    !!project.summary && project.description && project.description !== project.summary;

  return (
    <article
      ref={ref}
      className={`reveal ${seen ? "in" : ""} rounded-lg border border-[var(--t-border)] px-5 py-5 transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--t-accent)_55%,var(--t-border))] sm:px-6 sm:py-6`}
      style={{ ["--d" as string]: `${index * 70}ms`, backgroundColor: SOFT_SURFACE }}
    >
      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="max-w-3xl text-base font-semibold leading-tight text-[var(--t-accent)] sm:text-lg">
            {project.name}
          </h3>
          <span
            className="terminal-code w-fit shrink-0 rounded-md border border-[var(--t-border)] px-2.5 py-1 text-xs text-[var(--t-muted-2)]"
            style={{ backgroundColor: SURFACE }}
          >
            {project.period}
          </span>
        </div>

        <p className="mt-4 max-w-4xl leading-relaxed text-[var(--t-muted-1)]">
          {highlightMetrics(lead)}
        </p>

        {hasDistinctDescription && (
          <p className="mt-3 max-w-4xl leading-relaxed text-[var(--t-text-2)]">
            {highlightMetrics(project.description)}
          </p>
        )}

        {project.content?.length ? (
          <div className="mt-4 space-y-3 border-t border-[var(--t-border)] pt-4">
            {project.content.map((block, j) =>
              block.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={j}
                  src={block.src}
                  alt={block.alt ?? ""}
                  className="rounded border border-[var(--t-border)] max-w-full"
                />
              ) : (
                <p key={j} className="text-[var(--t-text-2)] leading-relaxed">
                  {highlightMetrics(block.text)}
                </p>
              )
            )}
          </div>
        ) : null}

        {project.publication && (
          <div className="mt-4">
            <PublicationLink label={project.publication} url={project.publicationUrl} />
          </div>
        )}

        {project.tech.length > 0 && (
          <div className="chips mt-5 border-t border-[var(--t-border)] pt-4">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function ProjectsOutput() {
  const { projects } = usePortfolioData();

  return (
    <div className="max-w-5xl space-y-4 text-base">
      <header className="terminal-code border-b border-[var(--t-border)] pb-3 text-sm text-[var(--t-muted-3)]">
        {projects.length} {projects.length === 1 ? "project" : "projects"} · most recent first
      </header>
      {projects.map((p, i) => (
        <ProjectCard key={i} project={p} index={i} />
      ))}
    </div>
  );
}
