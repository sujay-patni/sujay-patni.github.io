"use client";

import { useCallback, useRef, useState } from "react";
import { Mail, Phone, MapPin, ArrowUpRight, Copy, Check } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-data";

function GithubGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function LinkedinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

type Entry = {
  key: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  /** Show a copy-to-clipboard button (for plain values like email/phone). */
  copyable?: boolean;
  icon: React.ReactNode;
};

export default function ContactOutput() {
  const { personal } = usePortfolioData();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  function handleCopy(e: React.MouseEvent, entry: Entry) {
    // The button lives inside an <a> card — don't trigger the link.
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(entry.value).then(() => {
      setCopiedKey(entry.key);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedKey(null), 1500);
    });
  }

  const iconCls = "h-5 w-5";
  const entries: Entry[] = [
    personal.email && {
      key: "email",
      label: "Email",
      value: personal.email,
      href: `mailto:${personal.email}`,
      copyable: true,
      icon: <Mail className={iconCls} />,
    },
    personal.phone && {
      key: "phone",
      label: "Phone",
      value: personal.phone,
      href: `tel:${personal.phone}`,
      copyable: true,
      icon: <Phone className={iconCls} />,
    },
    personal.github && {
      key: "github",
      label: "GitHub",
      value: personal.github.replace(/^https?:\/\//, ""),
      href: personal.github,
      external: true,
      icon: <GithubGlyph className={iconCls} />,
    },
    personal.linkedin && {
      key: "linkedin",
      label: "LinkedIn",
      value: personal.linkedin.replace(/^https?:\/\//, ""),
      href: personal.linkedin,
      external: true,
      icon: <LinkedinGlyph className={iconCls} />,
    },
  ].filter(Boolean) as Entry[];

  return (
    <div className="text-base space-y-5">
      <div className="terminal-code flex items-center gap-3 text-sm text-[var(--t-muted-3)]">
        <span className="text-[var(--t-accent)]">$</span>
        <span>cat contact.txt</span>
        <span className="h-px flex-1 bg-[var(--t-border)]" />
      </div>

      <p className="max-w-2xl text-[var(--t-muted-1)]">
        Always happy to talk about backend systems, AI workflows, or a good
        engineering problem. Reach me through any of these — I reply quickly.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 max-w-3xl">
        {entries.map((e) => (
          <a
            key={e.key}
            href={e.href}
            onMouseMove={onMove}
            {...(e.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="home-card group flex items-center gap-4 rounded-xl border border-[var(--t-border)] bg-[var(--t-surface)]/45 p-4 sm:p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:shadow-[0_12px_30px_-18px_rgba(var(--t-accent-rgb),0.55)]"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--t-border)] bg-[var(--t-bg)]/60 text-[var(--t-muted-1)] transition-colors group-hover:border-[var(--t-accent)] group-hover:text-[var(--t-accent)]">
              {e.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="terminal-code block text-[0.7rem] uppercase tracking-[0.16em] text-[var(--t-muted-3)]">
                {e.label}
              </span>
              <span className="mt-1 block truncate text-[var(--t-text-2)] transition-colors group-hover:text-[var(--t-accent)]">
                {e.value}
              </span>
            </span>
            {e.copyable && (
              <button
                type="button"
                onClick={(ev) => handleCopy(ev, e)}
                aria-label={copiedKey === e.key ? `${e.label} copied` : `Copy ${e.label.toLowerCase()}`}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--t-border)] text-[var(--t-muted-3)] transition-colors hover:border-[var(--t-accent)] hover:text-[var(--t-accent)]"
              >
                {copiedKey === e.key ? (
                  <Check className="h-4 w-4 text-[var(--t-accent)]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            )}
            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-[var(--t-muted-3)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--t-accent)]" />
          </a>
        ))}
      </div>

      {personal.location && (
        <div className="terminal-code flex items-center gap-2 text-sm text-[var(--t-muted-2)]">
          <MapPin className="h-4 w-4 text-[var(--t-muted-3)]" />
          {personal.location}
        </div>
      )}
    </div>
  );
}
