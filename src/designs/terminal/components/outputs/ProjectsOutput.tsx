"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useInView } from "../../lib/use-animations";
import PublicationLink from "../PublicationLink";
import type { ProjectItem, ProjectCategory, ProjectIllustration } from "@/types/portfolio";

const SECTIONS = [
  { key: "product", label: "Featured Projects", blurb: "Products and systems built end-to-end" },
  { key: "tool", label: "Tools & Utilities", blurb: "Smaller dev tools and automation" },
  { key: "research", label: "Research", blurb: "Academic and experimental work" },
] as const satisfies ReadonlyArray<{ key: ProjectCategory; label: string; blurb: string }>;

// Short badge label shown in the meta panel.
const CATEGORY_BADGE: Record<ProjectCategory, string> = {
  product: "Featured",
  tool: "Tool",
  research: "Research",
};

// Projects without a Notion Category default to the top section.
function resolveCategory(project: ProjectItem): ProjectCategory {
  return project.category ?? "product";
}

const METRIC_RE =
  /(₹\s?[\d,]+\s?Cr\+?|\d[\d,]*\.?\d*%|\d{1,3}(?:,\d{3})+\+?|\d{1,3}K\+?|\d+\+)/g;

const SURFACE = "color-mix(in srgb, var(--t-surface) 52%, transparent)";
const SOFT_SURFACE = "color-mix(in srgb, var(--t-surface) 34%, transparent)";
const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

type ProjectStory = {
  compact: string;
  expanded: string[];
  problem: string;
  approach: string;
  outcome: string;
  illustration: ProjectIllustration;
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

function getProjectStartTime(period: string): number {
  const [start] = period.split(/[–-]/);
  const normalized = start.trim().toLowerCase();
  const yearMatch = normalized.match(/\b(20\d{2}|19\d{2})\b/);

  if (!yearMatch) return 0;

  const monthName = Object.keys(MONTHS).find((month) => normalized.includes(month));
  const month = monthName ? MONTHS[monthName] : 0;
  const dayMatch = monthName
    ? normalized.match(new RegExp(`${monthName}\\s+(\\d{1,2})`))
    : null;
  const day = dayMatch ? Number(dayMatch[1]) : 1;

  return new Date(Number(yearMatch[0]), month, day).getTime();
}

function getProjectStory(project: ProjectItem): ProjectStory {
  return {
    compact: project.lead || project.summary || project.description,
    expanded:
      project.expanded?.length
        ? project.expanded
        : project.summary && project.summary !== project.description
          ? [project.description]
          : [],
    problem: project.problem ?? "",
    approach: project.approach ?? project.tech.slice(0, 4).join(", "),
    outcome: project.outcome ?? "",
    illustration: project.illustration ?? "tool",
  };
}

function ProjectIllustration({ type }: { type: ProjectStory["illustration"] }) {
  const nodesByType: Record<ProjectStory["illustration"], string[]> = {
    flow: ["Flow", "Store", "Query", "Answer"],
    biometric: ["Signal", "Window", "LSTM", "Identity"],
    app: ["Plan", "Track", "Review", "PWA"],
    secure: ["Secret", "Key", "Vault", "Backup"],
    tool: ["Config", "Shim", "Launch", "Session"],
    sync: ["Notion", "Tree", "Assets", "GitHub"],
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
              className={`terminal-code grid h-12 w-12 place-items-center rounded-full border text-[0.62rem] ${
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

function ProjectMetaPanel({
  project,
  story,
  expanded,
}: {
  project: ProjectItem;
  story: ProjectStory;
  expanded: boolean;
}) {
  if (!expanded) {
    return (
      <aside
        className="order-first space-y-3 rounded-md border border-[var(--t-border)] p-4 lg:order-none"
        style={{ backgroundColor: SURFACE }}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className="terminal-code rounded-md border border-[var(--t-accent)] px-2 py-0.5 text-xs text-[var(--t-accent)]"
            style={{ backgroundColor: "var(--t-accent-dim)" }}
          >
            {CATEGORY_BADGE[resolveCategory(project)]}
          </span>
          <span className="terminal-code text-xs text-[var(--t-muted-2)]">{project.period}</span>
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Focus</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{story.problem}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="terminal-code rounded-md border border-[var(--t-border)] px-2 py-0.5 text-xs text-[var(--t-muted-2)]"
            >
              {tech}
            </span>
          ))}
        </div>
        {project.publication && (
          <div onClick={(event) => event.stopPropagation()}>
            <PublicationLink label={project.publication} url={project.publicationUrl} />
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className="order-first space-y-4 lg:order-none">
      <ProjectIllustration type={story.illustration} />

      {project.publication && (
        <div onClick={(event) => event.stopPropagation()}>
          <PublicationLink label={project.publication} url={project.publicationUrl} />
        </div>
      )}

      <div className="grid gap-3 rounded-md border border-[var(--t-border)] p-4" style={{ backgroundColor: SURFACE }}>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Category</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{CATEGORY_BADGE[resolveCategory(project)]}</p>
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Timeline</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{project.period}</p>
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Problem</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{story.problem}</p>
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Approach</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{story.approach}</p>
        </div>
        <div>
          <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Outcome</p>
          <p className="mt-1 leading-snug text-[var(--t-text-2)]">{highlightMetrics(story.outcome)}</p>
        </div>
      </div>

      {project.tech.length > 0 && (
        <div>
          <p className="terminal-code mb-2 text-xs uppercase text-[var(--t-muted-3)]">Stack</p>
          <div className="chips">
            {project.tech.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

    </aside>
  );
}

function ProjectStoryCard({
  project,
  index,
  animIndex,
  expanded,
  onToggle,
}: {
  project: ProjectItem;
  index: number;
  animIndex: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [ref, seen] = useInView<HTMLElement>();
  const story = useMemo(() => getProjectStory(project), [project]);
  const sectionId = `project-story-${animIndex}`;
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
      style={{ ["--d" as string]: `${animIndex * 70}ms`, backgroundColor: SOFT_SURFACE }}
    >
      <div className="grid h-full gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,28vw)] lg:p-6 xl:gap-8 xl:p-8 2xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <span className="terminal-code mt-1 hidden text-xs text-[var(--t-muted-3)] sm:inline">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">
                {project.period}
              </p>
              <h3 className="mt-1 text-xl font-semibold leading-tight text-[var(--t-accent)] sm:text-2xl">
                {project.name}
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

              {project.content?.length ? (
                <div className="grid gap-3 pt-1 md:grid-cols-2">
                  {project.content.map((block, blockIndex) =>
                    block.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={`${block.src}-${blockIndex}`}
                        src={block.src}
                        alt={block.alt ?? ""}
                        className="max-w-full rounded-md border border-[var(--t-border)]"
                      />
                    ) : (
                      <div
                        key={`${block.text}-${blockIndex}`}
                        className="rounded-md border border-[var(--t-border)] p-4"
                        style={{ backgroundColor: SURFACE }}
                      >
                        <p className="terminal-code mb-2 text-xs uppercase text-[var(--t-muted-3)]">
                          Note
                        </p>
                        <p className="leading-relaxed text-[var(--t-text-2)]">
                          {highlightMetrics(block.text)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : null}
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

        <ProjectMetaPanel project={project} story={story} expanded={expanded} />
      </div>
    </article>
  );
}

export default function ProjectsOutput() {
  const { projects } = usePortfolioData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");

  // Bucket projects by resolved category, then order each bucket by manual rank
  // (ascending), falling back to newest-first date then original order.
  const grouped = useMemo(() => {
    const buckets = new Map<ProjectCategory, ProjectItem[]>();
    projects.forEach((project) => {
      const key = resolveCategory(project);
      const list = buckets.get(key) ?? [];
      list.push(project);
      buckets.set(key, list);
    });

    const originalIndex = new Map(projects.map((p, i) => [p.name, i]));
    return SECTIONS.map((section) => {
      const items = (buckets.get(section.key) ?? []).slice().sort((a, b) => {
        const rankA = a.rank ?? Number.POSITIVE_INFINITY;
        const rankB = b.rank ?? Number.POSITIVE_INFINITY;
        return (
          rankA - rankB ||
          getProjectStartTime(b.period) - getProjectStartTime(a.period) ||
          (originalIndex.get(a.name) ?? 0) - (originalIndex.get(b.name) ?? 0)
        );
      });
      return { ...section, items };
    }).filter((section) => section.items.length > 0);
  }, [projects]);

  const visibleSections = grouped.filter(
    (section) => filter === "all" || section.key === filter
  );

  // Running counter across visible sections for animation stagger.
  let cardIndex = 0;

  return (
    <section
      className="w-full space-y-5 text-base"
      style={{ maxWidth: "min(1760px, calc(100vw - 4rem))" }}
    >
      <header className="border-b border-[var(--t-border)] pb-5">
        <p className="terminal-code text-sm text-[var(--t-muted-3)]">
          {projects.length} {projects.length === 1 ? "project" : "projects"} · products, systems, tools, automation, research
        </p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--t-text)] sm:text-3xl">
          What I&apos;ve built
        </h2>
        <p className="mt-3 max-w-[78ch] text-[var(--t-muted-1)] leading-relaxed">
          A few products I rely on every day, some small tools I made to fix my own workflow,
          and research from my time at university.
        </p>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {([
            { key: "all", label: "All", count: projects.length },
            ...grouped.map((section) => ({
              key: section.key,
              label: section.label,
              count: section.items.length,
            })),
          ] as { key: "all" | ProjectCategory; label: string; count: number }[]).map(({ key, label, count }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(key)}
                className={`terminal-code rounded-md border px-3 py-1 text-xs transition-colors ${
                  active
                    ? "border-[var(--t-accent)] text-[var(--t-accent)]"
                    : "border-[var(--t-border)] text-[var(--t-muted-2)] hover:border-[var(--t-accent)] hover:text-[var(--t-accent)]"
                }`}
                style={active ? { backgroundColor: "var(--t-accent-dim)" } : undefined}
              >
                {label} <span className="text-[var(--t-muted-3)]">({count})</span>
              </button>
            );
          })}
        </div>
      </header>

      {visibleSections.map((section) => (
        <div key={section.key} className="space-y-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-2">
            <h3 className="text-lg font-semibold text-[var(--t-text)] sm:text-xl">
              {section.label}
            </h3>
            <span className="terminal-code text-xs text-[var(--t-muted-3)]">
              {section.items.length} · {section.blurb}
            </span>
          </div>

          {section.items.map((project, sectionIndex) => {
            const animIndex = cardIndex++;
            return (
              <ProjectStoryCard
                key={project.name}
                project={project}
                index={sectionIndex}
                animIndex={animIndex}
                expanded={expanded === project.name}
                onToggle={() =>
                  setExpanded((current) =>
                    current === project.name ? null : project.name
                  )
                }
              />
            );
          })}
        </div>
      ))}
    </section>
  );
}
