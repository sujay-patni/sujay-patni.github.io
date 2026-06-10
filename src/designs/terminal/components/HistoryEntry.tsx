"use client";

import { motion } from "framer-motion";
import type { HistoryEntry as HistoryEntryType } from "../types/terminal";
import TypedCommand from "./TypedCommand";

interface HistoryEntryProps {
  entry: HistoryEntryType;
}

export default function HistoryEntry({ entry }: HistoryEntryProps) {
  return (
    <motion.div
      // Boot lines pace their own appearance in BootSequence.
      initial={entry.isBootLine ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-2"
    >
      {!entry.isBootLine && entry.command && (
        <div className="terminal-code flex items-center gap-2">
          <span className="text-[var(--t-accent)] text-base select-none">$</span>
          <TypedCommand text={entry.command} />
        </div>
      )}
      {entry.output && (
        <div className="pl-0 text-base leading-relaxed">{entry.output}</div>
      )}
    </motion.div>
  );
}
