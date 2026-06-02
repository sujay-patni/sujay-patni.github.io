"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useInView } from "../../lib/use-animations";
import PublicationLink from "../PublicationLink";
import type { ProjectItem } from "@/types/portfolio";

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
  illustration: "flow" | "biometric" | "app" | "secure" | "tool" | "sync";
  metrics: string[];
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

function extractMetrics(project: ProjectItem): string[] {
  const seen = new Set<string>();
  const source = [project.summary, project.description, project.publication ?? ""].filter(Boolean).join(" ");
  METRIC_RE.lastIndex = 0;

  for (const match of source.matchAll(METRIC_RE)) {
    seen.add(match[0]);
  }

  return Array.from(seen).slice(0, 4);
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
  const metrics = extractMetrics(project);

  if (project.name === "Query System for High-Speed IP Flow Analysis") {
    return {
      compact:
        "This project explored how to query high-speed network flow data more efficiently, using a 3-tier processing framework with nProbe exports and ClickHouse-backed analysis.",
      expanded: [
        "Network flow data becomes difficult to inspect when packet-derived records arrive quickly and analysts need specific answers rather than raw dumps. I worked on a query-processing framework that made the path from flow export to analysis more structured and repeatable.",
        "The system separated collection, storage, and query execution into a 3-tier flow. nProbe handled flow export, ClickHouse handled analytical storage, and the query layer focused on making high-volume inspection easier to reason about.",
        "The result was a 5% reduction in query latency and a stronger understanding of how observability systems depend on storage design, query shape, and clean data movement between layers.",
      ],
      problem: "Fast inspection of high-speed network flow records",
      approach: "nProbe exports, ClickHouse analysis, 3-tier query flow",
      outcome: "5% faster query performance",
      illustration: "flow",
      metrics,
    };
  }

  if (project.name === "Continuous Authentication via PPG Sensors") {
    return {
      compact:
        "This research project used wearable PPG biosignals for continuous authentication, building an LSTM model that learned biometric patterns from sensor data collected across volunteers.",
      expanded: [
        "The project explored authentication as a continuous signal instead of a one-time unlock. PPG data from wearable sensors carries physiological patterns over time, and the goal was to test whether those patterns could support identity verification.",
        "I worked with data from 15 volunteers and built an LSTM model to learn temporal biometric features from noisy biosignals. The modeling work had to balance signal quality, confidence thresholds, and the risk of false identity decisions.",
        "The system reached 82% accuracy at a 0.75 confidence threshold and later became part of an Elsevier Internet of Things publication, giving the work both experimental depth and a clear security use case.",
      ],
      problem: "Continuous identity verification from wearable sensor data",
      approach: "PPG biosignals, LSTM modeling, confidence-threshold evaluation",
      outcome: "82% accuracy at 0.75 confidence threshold",
      illustration: "biometric",
      metrics,
    };
  }

  if (project.name === "Routine Manager") {
    return {
      compact:
        project.summary ??
        "Routine is a personal daily-system web app for habits, events, tasks, deadlines, and tracked progress backed by Postgres.",
      expanded: [
        "Routine came from a very ordinary pain point: personal planning tools often split habits, tasks, calendars, and progress logs into separate workflows. I built it as a single daily operating system centered on a focused Today view.",
        "The app models habits, completions, events, skips, groups, settings, vacations, and day logs in Postgres instead of treating them as loose client state. That made recurring schedules, progress units, actual-time tracking, and historical review feel dependable.",
        "The result is a private PWA that works well on mobile, supports passphrase protection and Health Connect webhook sync, and gives a self-hosted routine system enough structure to survive real daily use.",
      ],
      problem: "Managing personal routines, tasks, deadlines, and progress in one private daily hub",
      approach: "Next.js App Router, Postgres, Drizzle ORM, recurring schedules, and PWA support",
      outcome: "A mobile-ready personal system for daily planning, tracking, and review",
      illustration: "app",
      metrics,
    };
  }

  if (project.name === "Vault Offline Secrets Manager") {
    return {
      compact:
        project.summary ??
        "Vault is an Android-first offline encrypted vault for passwords, notes, recovery codes, API keys, cards, IDs, Wi-Fi secrets, and finance records.",
      expanded: [
        "Vault is built around a strict privacy constraint: secrets should stay on the device, encrypted, and independent of account servers, analytics, cloud sync, or network access. That constraint shaped both the product scope and the implementation.",
        "The app supports several record types, including passwords, notes, recovery codes, API keys, cards, IDs, Wi-Fi secrets, and finance records. Search, tags, favorites, export, and restore are designed around one local encrypted vault file.",
        "The security model uses Argon2id-derived unlock keys, keeps decrypted data only while the app is unlocked, and verifies that release builds do not request Android Internet permission. It is intentionally small, auditable, and offline-first.",
      ],
      problem: "Keeping everyday secrets private without relying on cloud sync or account infrastructure",
      approach: "Flutter Android app, offline-first design, encrypted vault payloads, and Argon2id key derivation",
      outcome: "A small local-first password and secrets manager with encrypted backup support",
      illustration: "secure",
      metrics,
    };
  }

  if (project.name === "Claude Multi-Account Switcher") {
    return {
      compact:
        project.summary ??
        "claude-multi-account lets multiple Claude Code accounts run side by side on macOS with separate OAuth state per account.",
      expanded: [
        "Claude Code’s macOS credential storage creates a practical workflow problem: different accounts still collide through the same Keychain-backed credential entry. Separate config directories alone do not fully isolate sessions.",
        "This tool creates per-account overlays that share stable configuration through symlinks while keeping runtime state and OAuth credentials separate. A scoped security shim changes credential resolution only inside the launched Claude session.",
        "The result is a small shell utility that lets personal and work Claude Code sessions run side by side in different terminals, with explicit account selection and no repeated logout/login cycle.",
      ],
      problem: "Running multiple Claude Code accounts on one Mac without shared credential collisions",
      approach: "Shell wrappers, per-account config overlays, symlinked shared settings, and a scoped macOS security shim",
      outcome: "Side-by-side Claude Code sessions with isolated OAuth state",
      illustration: "tool",
      metrics,
    };
  }

  if (project.name === "Notion-to-GitHub Sync CLI") {
    return {
      compact:
        project.summary ??
        "notion-sync is a CLI tool that exports Notion page trees into GitHub repos as Markdown, with local assets and rewritten internal links.",
      expanded: [
        "notion-sync solves the gap between writing notes in Notion and preserving them as GitHub-friendly Markdown. The tool walks recursive page trees, mirrors the hierarchy as folders, and converts each page into a durable repository structure.",
        "The tricky parts are the ones manual exports usually leave messy: Notion image URLs expire, and internal Notion links do not work once content moves to GitHub. The CLI downloads assets locally and rewrites internal links into relative Markdown paths.",
        "It can sync one configured repo, a single page subtree, or all 6 knowledge repos, with dry-run support before committing and pushing. The result is a repeatable personal knowledge sync instead of a one-off export chore.",
      ],
      problem: "Keeping Notion notes mirrored into GitHub repos without manual export cleanup",
      approach: "Node.js CLI, Notion API, notion-to-md conversion, local asset downloads, and relative link rewriting",
      outcome: "Automated sync for 6 configured knowledge repos with Markdown output and GitHub commits",
      illustration: "sync",
      metrics,
    };
  }

  return {
    compact: project.summary ?? project.description,
    expanded: project.summary && project.summary !== project.description ? [project.description] : [],
    problem: "Turning a focused technical need into a usable project",
    approach: project.tech.slice(0, 4).join(", ") || "Purpose-built implementation",
    outcome: project.summary ?? "A working project with a clear implementation path",
    illustration: "tool",
    metrics,
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
      <aside className="rounded-md border border-[var(--t-border)] p-4" style={{ backgroundColor: SURFACE }}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="terminal-code text-xs uppercase text-[var(--t-muted-3)]">Project</span>
          <span className="text-[var(--t-muted-4)]">/</span>
          <span className="terminal-code text-xs text-[var(--t-muted-2)]">{project.period}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="terminal-code rounded-md border border-[var(--t-border)] px-2 py-0.5 text-xs text-[var(--t-muted-2)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <ProjectIllustration type={story.illustration} />

      <div className="grid gap-3 rounded-md border border-[var(--t-border)] p-4" style={{ backgroundColor: SURFACE }}>
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

      {story.metrics.length > 0 && (
        <div>
          <p className="terminal-code mb-2 text-xs uppercase text-[var(--t-muted-3)]">Impact signals</p>
          <div className="flex flex-wrap gap-2">
            {story.metrics.map((metric) => (
              <span
                key={metric}
                className="terminal-code rounded-md border border-[var(--t-accent)] px-2.5 py-1 text-xs text-[var(--t-accent)]"
                style={{ backgroundColor: "var(--t-accent-dim)" }}
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      )}

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

      {project.publication && (
        <PublicationLink label={project.publication} url={project.publicationUrl} />
      )}
    </aside>
  );
}

function ProjectStoryCard({
  project,
  index,
  expanded,
  onToggle,
}: {
  project: ProjectItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [ref, seen] = useInView<HTMLElement>();
  const story = useMemo(() => getProjectStory(project), [project]);
  const sectionId = `project-story-${index}`;
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
  const sortedProjects = useMemo(
    () =>
      projects
        .map((project, originalIndex) => ({ project, originalIndex }))
        .sort(
          (a, b) =>
            getProjectStartTime(b.project.period) -
              getProjectStartTime(a.project.period) ||
            a.originalIndex - b.originalIndex
        ),
    [projects]
  );

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
          Projects where the build had to prove something
        </h2>
        <p className="mt-3 max-w-[78ch] text-[var(--t-muted-1)] leading-relaxed">
          A closer look at practical builds and research work: personal productivity systems,
          offline-first security tools, developer workflow utilities, automation, network
          analysis, and biometric authentication. Each project starts from a concrete problem
          and turns it into something measurable or usable.
        </p>
      </header>

      {sortedProjects.map(({ project }, i) => (
        <ProjectStoryCard
          key={project.name}
          project={project}
          index={i}
          expanded={expanded === project.name}
          onToggle={() =>
            setExpanded((current) => (current === project.name ? null : project.name))
          }
        />
      ))}
    </section>
  );
}
