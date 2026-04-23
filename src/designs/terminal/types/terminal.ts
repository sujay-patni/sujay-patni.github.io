import type React from "react";

export type OutputNode = React.ReactNode;

export interface HistoryEntry {
  id: string;
  command: string;
  output: OutputNode;
  isBootLine?: boolean;
}

export type TerminalPhase = "booting" | "interactive";

export type PageName = "home" | "experience" | "projects" | "publications" | "skills";

export interface TerminalState {
  phase: TerminalPhase;
  history: HistoryEntry[];
  currentPage: PageName;
}

export type TerminalAction =
  | { type: "BOOT_COMPLETE" }
  | { type: "APPEND_BOOT_LINE"; entry: HistoryEntry }
  | { type: "RUN_COMMAND"; entry: HistoryEntry }
  | { type: "CLEAR" }
  | { type: "NAVIGATE"; page: PageName; entry: HistoryEntry };
