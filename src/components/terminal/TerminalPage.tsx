"use client";

import { useReducer, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TerminalState, TerminalAction } from "@/types/terminal";
import { registry, initCommands, getCommandNames } from "@/lib/commands";
import TerminalWindow from "./TerminalWindow";
import TerminalBody from "./TerminalBody";
import HistoryList from "./HistoryList";
import PromptRow from "./PromptRow";
import BootSequence from "./BootSequence";

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case "APPEND_BOOT_LINE":
      return { ...state, history: [...state.history, action.entry] };
    case "BOOT_COMPLETE":
      return { ...state, phase: "interactive" };
    case "RUN_COMMAND":
      return { ...state, history: [...state.history, action.entry] };
    case "CLEAR":
      return { ...state, history: [] };
  }
}

const initialState: TerminalState = { phase: "booting", history: [] };

function tabComplete(current: string): string {
  const lower = current.toLowerCase().trim();
  if (!lower) return current;

  const names = getCommandNames();
  const matches = names.filter((n) => n.startsWith(lower));
  if (matches.length === 0) return current;
  if (matches.length === 1) return matches[0];

  // Longest common prefix
  const lcp = matches.reduce((acc, m) => {
    let i = 0;
    while (i < acc.length && i < m.length && acc[i] === m[i]) i++;
    return acc.slice(0, i);
  });
  return lcp;
}

export default function TerminalPage() {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const [inputValue, setInputValue] = useState("");
  const [commandsReady, setCommandsReady] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<{ focus: () => void } | null>(null);

  // Load command registry
  useEffect(() => {
    initCommands().then(() => setCommandsReady(true));
  }, []);

  // Auto-scroll on history change
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [state.history]);

  function handleCommand(raw: string) {
    if (!commandsReady) return;
    const parts = raw.trim().split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (name === "clear") {
      dispatch({ type: "CLEAR" });
      return;
    }

    const def = registry.get(name);
    let output: React.ReactNode;
    if (def) {
      output = def.run(args);
    } else {
      const notFound = registry.get("__notfound__");
      output = notFound ? notFound.run([name]) : null;
    }

    dispatch({
      type: "RUN_COMMAND",
      entry: { id: String(Date.now() + Math.random()), command: raw, output },
    });
  }

  const commandHistory = state.history
    .filter((e) => !e.isBootLine && e.command)
    .map((e) => e.command);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center p-4 min-h-0"
    >
      <TerminalWindow>
        <TerminalBody bodyRef={bodyRef}>
          {state.phase === "booting" && commandsReady && (
            <BootSequence
              onComplete={() => dispatch({ type: "BOOT_COMPLETE" })}
            />
          )}
          {state.phase === "interactive" && (
            <HistoryList entries={state.history} />
          )}
          {/* Spacer to push content up when history is short */}
          <div className="flex-1" />
        </TerminalBody>
        <PromptRow
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleCommand}
          onTabComplete={tabComplete}
          commandHistory={commandHistory}
          disabled={state.phase === "booting"}
        />
      </TerminalWindow>
    </motion.div>
  );
}
