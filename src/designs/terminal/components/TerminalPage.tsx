"use client";

import React, { useReducer, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TerminalState, TerminalAction, PageName } from "../types/terminal";
import { applyTheme, getStoredTheme } from "../lib/theme";
import { registry, initCommands, getCommandNames } from "../lib/commands";
import { TerminalNavProvider } from "../lib/nav-context";
import TerminalWindow from "./TerminalWindow";
import TerminalBody from "./TerminalBody";
import HistoryList from "./HistoryList";
import PromptRow from "./PromptRow";
import BootSequence from "./BootSequence";
import WelcomeScreen from "./WelcomeScreen";
import MotdHeader from "./MotdHeader";
import CommandChips from "./CommandChips";
import HomeOutput from "./outputs/HomeOutput";
import ExperienceOutput from "./outputs/ExperienceOutput";
import ExperienceDetailOutput from "./outputs/ExperienceDetailOutput";
import ProjectsOutput from "./outputs/ProjectsOutput";
import ProjectDetailOutput from "./outputs/ProjectDetailOutput";
import PublicationsOutput from "./outputs/PublicationsOutput";
import PublicationDetailOutput from "./outputs/PublicationDetailOutput";
import SkillsOutput from "./outputs/SkillsOutput";

function getPageOutput(page: PageName): React.ReactNode {
  if (page === "home") return <HomeOutput />;
  if (page === "experience") return <ExperienceOutput />;
  if (page === "projects") return <ProjectsOutput />;
  if (page === "publications") return <PublicationsOutput />;
  if (page === "skills") return <SkillsOutput tree={false} />;
  return null;
}

function getDetailOutput(
  page: "experience" | "projects" | "publications",
  n: number
): React.ReactNode {
  if (page === "experience") return <ExperienceDetailOutput index={n} />;
  if (page === "projects") return <ProjectDetailOutput index={n} />;
  if (page === "publications") return <PublicationDetailOutput index={n} />;
  return null;
}

const PAGE_COMMANDS = new Set(["home", "experience", "projects", "publications", "skills"]);
const ALIASES: Record<string, string> = { exp: "experience", pubs: "publications" };

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
    case "NAVIGATE":
      return { ...state, currentPage: action.page, history: [action.entry] };
  }
}

const initialState: TerminalState = { phase: "booting", history: [], currentPage: "home" };

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
  const [showWelcome, setShowWelcome] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigatedRef = useRef(false);

  // Apply stored theme on mount
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  // Load command registry
  useEffect(() => {
    initCommands().then(() => setCommandsReady(true));
  }, []);

  // Scroll to top on page navigation, bottom when appending commands
  useEffect(() => {
    if (navigatedRef.current) {
      bodyRef.current?.scrollTo({ top: 0, behavior: "instant" });
      navigatedRef.current = false;
    } else {
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [state.history]);

  // URL deep-link or auto-navigate home on boot complete
  useEffect(() => {
    if (state.phase !== "interactive" || !commandsReady) return;
    const params = new URLSearchParams(window.location.search);
    const cmd = params.get("run");
    if (cmd) {
      handleCommand(cmd);
    } else {
      navigate("home", getPageOutput("home"));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, commandsReady]);

  function navigate(page: PageName, output: React.ReactNode) {
    navigatedRef.current = true;
    dispatch({
      type: "NAVIGATE",
      page,
      entry: { id: String(Date.now() + Math.random()), command: page, output },
    });
  }

  function handleCommand(raw: string) {
    if (!commandsReady) return;
    const parts = raw.trim().split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (name === "clear") {
      dispatch({ type: "CLEAR" });
      return;
    }

    const resolvedName = ALIASES[name] ?? name;

    if (PAGE_COMMANDS.has(resolvedName)) {
      const noSubPages = resolvedName === "home" || resolvedName === "skills";
      if (noSubPages || args.length === 0) {
        navigate(resolvedName as PageName, getPageOutput(resolvedName as PageName));
      } else {
        const n = parseInt(args[0], 10);
        navigate(
          resolvedName as "experience" | "projects" | "publications",
          getDetailOutput(resolvedName as "experience" | "projects" | "publications", n)
        );
      }
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
    <TerminalNavProvider value={handleCommand}>
    <div className="flex-1 flex flex-col bg-[var(--t-bg)] text-[var(--t-text)] font-mono overflow-hidden">
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            key="welcome"
            onComplete={() => setShowWelcome(false)}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: showWelcome ? 0 : 1, scale: showWelcome ? 0.98 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex-1 flex flex-col items-center justify-center p-2 min-h-0"
      >
        <TerminalWindow>
          <MotdHeader />
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
          <CommandChips
            onCommand={handleCommand}
            disabled={state.phase === "booting"}
          />
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
    </div>
    </TerminalNavProvider>
  );
}
