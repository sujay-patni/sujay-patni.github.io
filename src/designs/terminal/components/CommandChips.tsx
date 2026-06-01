"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { PageName } from "../types/terminal";

const CHIPS = [
  { label: "home", page: "home" },
  { label: "experience", page: "experience" },
  { label: "projects", page: "projects" },
  { label: "publications", page: "publications" },
  { label: "skills", page: "skills" },
  { label: "resume" },
  { label: "contact" },
];

interface CommandChipsProps {
  onCommand: (cmd: string) => void;
  disabled: boolean;
  activePage?: PageName;
}

export default function CommandChips({ onCommand, disabled, activePage }: CommandChipsProps) {
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
    <motion.div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      data-chips
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-[var(--t-border)] bg-[var(--t-surface)]/70 flex-shrink-0 overflow-x-auto"
      role="navigation"
      aria-label="Primary portfolio pages"
    >
      <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--t-muted-3)] mr-1 whitespace-nowrap">
        pages
      </span>
      {CHIPS.map(({ label, page }) => {
        const active = page === activePage;

        return (
          <button
            key={label}
            onClick={() => !disabled && onCommand(label)}
            disabled={disabled}
            aria-current={active ? "page" : undefined}
            className={`font-mono text-xs px-3 py-1.5 rounded-md border whitespace-nowrap active:scale-95 transition-all duration-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer ${
              active
                ? "border-[var(--t-accent)] bg-[var(--t-accent-dim)] text-[var(--t-accent)] shadow-[0_0_0_1px_var(--t-accent-dim)]"
                : "border-[var(--t-border)] text-[var(--t-muted-2)] hover:border-[var(--t-accent)] hover:text-[var(--t-accent)] hover:bg-[var(--t-accent-dim)]"
            }`}
          >
            <span className="text-[var(--t-muted-3)]">/</span>
            {label}
          </button>
        );
      })}
    </motion.div>
  );
}
