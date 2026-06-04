"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useInView } from "../../lib/use-animations";
import PublicationLink from "../PublicationLink";
import type { ExperienceItem, ExperienceIllustration } from "@/types/portfolio";

const METRIC_RE =
  /(₹\s?[\d,]+\s?Cr\+?|\d[\d,]*\.?\d*%|\d{1,3}(?:,\d{3})+\+?|\d{1,3}K\+?|\d+\+)/g;

const SURFACE = "color-mix(in srgb, var(--t-surface) 52%, transparent)";
const SOFT_SURFACE = "color-mix(in srgb, var(--t-surface) 34%, transparent)";

type Story = {
  compact: string;
  expanded: string[];
  focus: string;
  illustration: ExperienceIllustration;
};

function highlightMetrics(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let last = 0;
  METRIC_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = METRIC_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span key={match.index} className="font-semibold text-[var(--t-accent)]">
        {match[0]}
      </span>
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function getStory(job: ExperienceItem): Story {
  return {
    compact: job.lead || job.summary || "",
    expanded: job.expanded ?? [],
    focus: job.focus ?? "",
    illustration: job.illustration ?? "systems",
  };
}

function StoryIllustration({ type }: { type: Story["illustration"] }) {
  const nodesByType: Record<Story["illustration"], string[]> = {
    systems: ["AI", "Ops", "Portal", "Invoices"],
    search: ["Query", "Map", "Rank", "Click"],
    research: ["Workload", "Core", "Energy", "Paper"],
    quality: ["Scan", "Test", "Migrate", "Ship"],
  };

  return (
    <div
      aria-hidden="true"
      className="relative h-28 overflow-hidden rounded-md border border-[var(--t-border)]"
      style={{ backgroundColor: "color-mix(in srgb, var(--t-surface) 62%, transparent)" }}
    >
      <div className="absolute inset-x-5 top-1/2 h-px bg-[var(--t-border)]" />
      <div className="absolute inset-0 grid grid-cols-4 items-center gap-2 px-4">
        {nodesByType[type].map((node, i) => (
          <div key={node} className="relative flex justify-center">
            <span
              className={`terminal-code grid h-12 w-12 place-items-center rounded-full border text-[0.68rem] ${
                i === 0 || i === nodesByType[type].length - 1
                  ? "border-[var(--t-accent)] text-[var(--t-accent)]"
                  : "border-[var(--t-border)] text-[var(--t-muted-2)]"
              }`}
              style={{ backgroundColor: "var(--t-bg)" }}
            >
              {node}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetaPanel({
  job,
  story,
  isCurrent,
  expanded,
}: {
  job: ExperienceItem;
  story: Story;
  isCurrent: boolean;
  expanded: boolean;
}) {
  const company = job.company.split(" (")[0];

  if (!expanded) {
    return (
      <aside className="space-y-3 rounded-md border border-[var(--t-border)] p-4" style={{ backgroundColor: SURFACE }}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">
            {company}
          </span>
          <span className="text-[var(--t-muted-4)]">/</span>
          <span className="terminal-code text-xs text-[var(--t-muted-2)]">{job.period}</span>
          {isCurrent && (
            <>
              <span className="text-[var(--t-muted-4)]">/</span>
              <span className="terminal-code inline-flex items-center gap-1.5 text-xs text-[var(--t-accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--t-accent)]" />
                Current
              </span>
            </>
          )}
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Focus</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{story.focus}</p>
        </div>
        {job.publication && (
          <div onClick={(event) => event.stopPropagation()}>
            <PublicationLink label={job.publication} url={job.publicationUrl} />
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <StoryIllustration type={story.illustration} />

      {job.publication && (
        <div onClick={(event) => event.stopPropagation()}>
          <PublicationLink label={job.publication} url={job.publicationUrl} />
        </div>
      )}

      <div className="grid gap-3 rounded-md border border-[var(--t-border)] p-4" style={{ backgroundColor: SURFACE }}>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Company</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{company}</p>
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Period</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{job.period}</p>
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Scope</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{story.focus}</p>
        </div>
        {isCurrent && (
          <div
            className="terminal-code inline-flex w-fit items-center gap-1.5 rounded-md border border-[var(--t-accent)] px-2.5 py-1 text-xs text-[var(--t-accent)]"
            style={{ backgroundColor: "var(--t-accent-dim)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--t-accent)]" />
            Current role
          </div>
        )}
      </div>

    </aside>
  );
}

function ExperienceStoryCard({
  job,
  index,
  expanded,
  onToggle,
}: {
  job: ExperienceItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [ref, seen] = useInView<HTMLElement>();
  const story = useMemo(() => getStory(job), [job]);
  const isCurrent = /present/i.test(job.period);
  const sectionId = `experience-story-${index}`;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onToggle();
  };

  return (
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={sectionId}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`reveal ${seen ? "in" : ""} cursor-pointer overflow-hidden rounded-lg border border-[var(--t-border)] transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--t-accent)_50%,var(--t-border))] focus:outline-none focus-visible:border-[var(--t-accent)] focus-visible:ring-2 focus-visible:ring-[var(--t-accent-dim)] ${expanded ? "xl:min-h-[42dvh]" : ""}`}
      style={{ ["--d" as string]: `${index * 70}ms`, backgroundColor: SOFT_SURFACE }}
    >
      <div className="grid h-full gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,28vw)] lg:p-6 xl:gap-8 xl:p-8 2xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <span className="terminal-code mt-1 hidden text-xs text-[var(--t-muted-3)] sm:inline">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">
                {job.team} · {job.location}
              </p>
              <h3 className="mt-1 text-xl font-semibold leading-tight text-[var(--t-accent)] sm:text-2xl">
                {job.role}
              </h3>
            </div>
          </div>

          <p className="mt-5 max-w-[76ch] text-[var(--t-muted-1)] leading-relaxed">
            {highlightMetrics(story.compact)}
          </p>

          {expanded && (
            <div
              id={sectionId}
              className="mt-5 space-y-4 border-t border-[var(--t-border)] pt-5"
            >
              {story.expanded.map((paragraph) => (
                <p key={paragraph} className="max-w-[78ch] leading-relaxed text-[var(--t-text-2)]">
                  {highlightMetrics(paragraph)}
                </p>
              ))}

              <div className="grid gap-3 pt-1 md:grid-cols-2">
                {job.bullets.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-md border border-[var(--t-border)] p-4"
                    style={{ backgroundColor: SURFACE }}
                  >
                    <p className="terminal-code mb-2 text-xs uppercase text-[var(--t-muted-3)]">
                      Evidence
                    </p>
                    <p className="leading-relaxed text-[var(--t-text-2)]">
                      {highlightMetrics(detail)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            aria-expanded={expanded}
            aria-controls={sectionId}
            className="terminal-code mt-5 inline-flex items-center gap-2 rounded-md border border-[var(--t-border)] px-3 py-2 text-sm text-[var(--t-text-2)] transition-colors hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:text-[var(--t-accent)]"
          >
            {expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
            {expanded ? "Show less" : "Read more"}
          </button>
        </div>

        <MetaPanel job={job} story={story} isCurrent={isCurrent} expanded={expanded} />
      </div>
    </article>
  );
}

export default function ExperienceOutput() {
  const { experience } = usePortfolioData();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section
      className="w-full space-y-5 text-base"
      style={{ maxWidth: "min(1760px, calc(100vw - 4rem))" }}
    >
      <header className="border-b border-[var(--t-border)] pb-5">
        <p className="terminal-code text-sm text-[var(--t-muted-3)]">
          {experience.length} {experience.length === 1 ? "role" : "roles"} · backend, AI, systems
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--t-text)] sm:text-3xl">
          Where I&apos;ve worked
        </h2>
        <p className="mt-3 max-w-[78ch] text-[var(--t-muted-1)] leading-relaxed">
          Backend systems at OfBusiness, a stint on search and performance, and energy-aware
          scheduling research at IISc &mdash; plus the early internships that taught me to care
          about quality.
        </p>
      </header>

      {experience.map((job, i) => (
        <ExperienceStoryCard
          key={`${job.role}-${job.company}`}
          job={job}
          index={i}
          expanded={expanded === i}
          onToggle={() => setExpanded((current) => (current === i ? null : i))}
        />
      ))}
    </section>
  );
}
