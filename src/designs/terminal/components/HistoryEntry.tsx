"use client";

import { motion } from "framer-motion";
import type { HistoryEntry as HistoryEntryType } from "../types/terminal";

interface HistoryEntryProps {
  entry: HistoryEntryType;
}

export default function HistoryEntry({ entry }: HistoryEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="space-y-2"
    >
      {!entry.isBootLine && entry.command && (
        <div className="terminal-code flex items-center gap-2">
          <span className="text-[var(--t-accent)] text-base select-none">$</span>
          <span className="text-[var(--t-text-2)] text-base">{entry.command}</span>
        </div>
      )}
      {entry.output && (
        <div className="pl-0 text-base leading-relaxed">{entry.output}</div>
      )}
    </motion.div>
  );
}
