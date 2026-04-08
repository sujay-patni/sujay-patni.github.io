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
      className="space-y-1"
    >
      {!entry.isBootLine && entry.command && (
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-sm select-none">$</span>
          <span className="text-zinc-300 text-sm">{entry.command}</span>
        </div>
      )}
      {entry.output && (
        <div className="pl-0 text-sm leading-relaxed">{entry.output}</div>
      )}
    </motion.div>
  );
}
