"use client";

import { usePortfolioData } from "@/lib/portfolio-data";

/**
 * Large identity hero — evolves the old compact identity line into the page's
 * anchor: a `$ whoami --full` eyebrow, a glowing mono name, a meta row, and a
 * gradient rule. Reads the same personal data the compact line did.
 */
export default function HeroHeader() {
  const { personal } = usePortfolioData();
  const { name, title, company, location } = personal;

  return (
    <header className="mb-7">
      <div className="terminal-code text-sm tracking-wide text-[var(--t-muted-2)]">
        <span className="text-[var(--t-accent)]">$</span> whoami{" "}
        <span className="text-[var(--t-muted-4)]">--full</span>
      </div>

      {name ? <h1 className="hero-name mt-3">{name}</h1> : null}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-base sm:text-lg">
        {title ? (
          <span className="font-semibold text-[var(--t-accent)]">{title}</span>
        ) : null}
        {title && company ? (
          <span className="text-[var(--t-muted-3)]">@</span>
        ) : null}
        {company ? <span className="text-[var(--t-text-2)]">{company}</span> : null}
        {company && location ? (
          <span
            className="inline-block h-1 w-1 rounded-full bg-[var(--t-muted-4)]"
            aria-hidden="true"
          />
        ) : null}
        {location ? <span className="text-[var(--t-muted-1)]">{location}</span> : null}
      </div>

      <div className="hero-rule mt-6" aria-hidden="true" />
    </header>
  );
}
