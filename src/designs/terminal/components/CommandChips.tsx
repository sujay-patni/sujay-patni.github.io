"use client";

import { motion } from "framer-motion";

const CHIPS = [
  { label: "whoami" },
  { label: "experience" },
  { label: "projects" },
  { label: "skills" },
  { label: "publications" },
  { label: "education" },
  { label: "resume" },
  { label: "themes" },
  { label: "help" },
];

interface CommandChipsProps {
  onCommand: (cmd: string) => void;
  disabled: boolean;
}

export default function CommandChips({ onCommand, disabled }: CommandChipsProps) {
  return (
    <motion.div
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
