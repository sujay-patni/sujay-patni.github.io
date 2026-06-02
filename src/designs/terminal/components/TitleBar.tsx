"use client";

import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  function runCommand(label: string) {
    if (disabled) return;
    setMenuOpen(false);
    onCommand(label);
  }

  return (
    <div className="border-b border-[var(--t-border)] bg-[var(--t-surface)] flex-shrink-0">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-90" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-90" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-90" aria-hidden="true" />
        </div>

        <span className="terminal-code min-w-0 flex-1 truncate text-sm text-[var(--t-muted-2)] font-mono tracking-wide select-none whitespace-nowrap md:ml-3 md:flex-none">
          sujay@portfolio:~
        </span>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          disabled={disabled}
          aria-expanded={menuOpen}
          aria-controls="mobile-terminal-menu"
          className="terminal-code inline-flex items-center gap-2 rounded-md border border-[var(--t-border)] px-3 py-2 text-sm text-[var(--t-text-2)] transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-20 hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:text-[var(--t-accent)] md:hidden"
        >
          {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>

        <nav
          ref={containerRef}
          onKeyDown={handleKeyDown}
          data-chips
          className="hidden flex-1 items-center justify-end gap-1.5 overflow-x-auto md:flex"
          aria-label="Primary portfolio pages"
        >
          {NAV_ITEMS.map(({ label, page }) => {
            const active = page === activePage;

            return (
              <button
                key={label}
                onClick={() => runCommand(label)}
                disabled={disabled}
                aria-current={active ? "page" : undefined}
                aria-label={`Open ${label}`}
                className={`terminal-code font-mono text-sm px-3 py-1.5 rounded-md border whitespace-nowrap active:scale-95 transition-all duration-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer ${
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

      <div
        id="mobile-terminal-menu"
        className={`md:hidden overflow-hidden border-t border-[var(--t-border)] bg-[var(--t-bg)]/85 transition-[max-height,opacity] duration-200 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="grid grid-cols-2 gap-2 p-3" aria-label="Mobile portfolio pages">
          {NAV_ITEMS.map(({ label, page }) => {
            const active = page === activePage;

            return (
              <button
                key={label}
              onClick={() => runCommand(label)}
              disabled={disabled}
              aria-current={active ? "page" : undefined}
              aria-label={`Open ${label}`}
              className={`min-h-12 rounded-lg border px-3 py-2 text-left transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-20 ${
                  active
                    ? "border-[var(--t-accent)] bg-[var(--t-accent-dim)] text-[var(--t-accent)]"
                    : "border-[var(--t-border)] bg-[var(--t-surface)]/55 text-[var(--t-text-2)] hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:text-[var(--t-accent)]"
                }`}
              >
                <span className="terminal-code block text-xs text-[var(--t-muted-3)]" aria-hidden="true">
                  /{label}
                </span>
                <span className="block text-base font-medium capitalize">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
