"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const CHIPS = [
  { label: "home" },
  { label: "experience" },
  { label: "projects" },
  { label: "publications" },
  { label: "skills" },
  { label: "resume" },
  { label: "contact" },
];

interface CommandChipsProps {
  onCommand: (cmd: string) => void;
  disabled: boolean;
}

export default function CommandChips({ onCommand, disabled }: CommandChipsProps) {
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
      className="flex flex-wrap gap-1.5 px-4 py-2.5 border-t border-[var(--t-border)] flex-shrink-0"
    >
      {CHIPS.map(({ label }) => (
        <button
          key={label}
          onClick={() => !disabled && onCommand(label)}
          disabled={disabled}
          className="font-mono text-xs px-2.5 py-1 rounded border border-[var(--t-border)] text-[var(--t-muted-2)] hover:border-[var(--t-accent)] hover:text-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] active:scale-95 transition-all duration-100 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
        >
          {label}
        </button>
      ))}
    </motion.div>
  );
}
