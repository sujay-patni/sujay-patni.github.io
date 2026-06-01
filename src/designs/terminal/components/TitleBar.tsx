"use client";

import { useRef } from "react";
import type { PageName } from "../types/terminal";

const NAV_ITEMS = [
  { label: "home", page: "home" },
  { label: "experience", page: "experience" },
  { label: "projects", page: "projects" },
  { label: "publications", page: "publications" },
  { label: "skills", page: "skills" },
  { label: "resume" },
  { label: "contact" },
];

interface TitleBarProps {
  onCommand: (cmd: string) => void;
  disabled: boolean;
  activePage?: PageName;
}

export default function TitleBar({ onCommand, disabled, activePage }: TitleBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Tab") return;
    const buttons = Array.from(
      containerRef.current?.querySelectorAll("button:not(:disabled)") ?? []
    ) as HTMLElement[];
    if (buttons.length === 0) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--t-border)] bg-[var(--t-surface)] rounded-t-lg flex-shrink-0">
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500 opacity-90" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-90" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-90" aria-hidden="true" />
      </div>

      <span className="hidden md:inline-flex text-xs text-[var(--t-muted-2)] font-mono tracking-wide select-none whitespace-nowrap ml-3">
        sujay@portfolio:~
      </span>

      <nav
        ref={containerRef}
        onKeyDown={handleKeyDown}
        data-chips
        className="flex-1 flex items-center justify-end gap-1.5 overflow-x-auto"
        aria-label="Primary portfolio pages"
      >
        <span className="md:hidden text-xs text-[var(--t-muted-2)] font-mono tracking-wide select-none whitespace-nowrap mr-2">
          sujay@portfolio:~
        </span>
        {NAV_ITEMS.map(({ label, page }) => {
          const active = page === activePage;

          return (
            <button
              key={label}
              onClick={() => !disabled && onCommand(label)}
              disabled={disabled}
              aria-current={active ? "page" : undefined}
              className={`font-mono text-xs px-2.5 py-1 rounded-md border whitespace-nowrap active:scale-95 transition-all duration-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer ${
                active
                  ? "border-[var(--t-accent)] bg-[var(--t-accent-dim)] text-[var(--t-accent)] shadow-[0_0_0_1px_var(--t-accent-dim)]"
                  : "border-transparent text-[var(--t-muted-2)] hover:border-[var(--t-accent)] hover:text-[var(--t-accent)] hover:bg-[var(--t-accent-dim)]"
              }`}
            >
              <span className="text-[var(--t-muted-3)]">/</span>
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
