"use client";

import React, { useReducer, useRef, useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import type { TerminalState, TerminalAction, PageName } from "../types/terminal";
import { applyTheme, getStoredTheme } from "../lib/theme";
import { registry, initCommands, getCommandNames } from "../lib/commands";
import { TerminalNavProvider } from "../lib/nav-context";
import TerminalWindow from "./TerminalWindow";
import TerminalBody from "./TerminalBody";
import HistoryList from "./HistoryList";
import PromptRow from "./PromptRow";
import StatusBar from "./StatusBar";
import BootSequence from "./BootSequence";
import WelcomeScreen from "./WelcomeScreen";
import HomeOutput from "./outputs/HomeOutput";
import ExperienceOutput from "./outputs/ExperienceOutput";
import ExperienceDetailOutput from "./outputs/ExperienceDetailOutput";
import ProjectsOutput from "./outputs/ProjectsOutput";
import ProjectDetailOutput from "./outputs/ProjectDetailOutput";

function getPageOutput(page: PageName): React.ReactNode {
  if (page === "home") return <HomeOutput />;
  if (page === "experience") return <ExperienceOutput />;
  if (page === "projects") return <ProjectsOutput />;
  return null;
}

function getDetailOutput(
  page: "experience" | "projects",
  n: number
): React.ReactNode {
  if (page === "experience") return <ExperienceDetailOutput index={n} />;
  if (page === "projects") return <ProjectDetailOutput index={n} />;
  return null;
}

const PAGE_COMMANDS = new Set(["home", "experience", "projects"]);
const ALIASES: Record<string, string> = {
  exp: "experience",
  edu: "education",
  proj: "projects",
  pj: "projects",
  sk: "skills",
  pubs: "publications",
  pub: "publications",
};
// `resume` and `contact` are intentionally NOT routed: they run as plain
// commands that append their output at the end of the terminal, without owning
// a URL or a standalone page.
const ROUTED_COMMANDS = new Set([
  ...PAGE_COMMANDS,
  "education",
  "help",
  "timeline",
  "whoami",
  "skills",
  "publications",
]);
const WELCOME_SEEN_KEY = "terminal-welcome-seen-session-v1";

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

// The static export is always prerendered in the pre-welcome "booting" state —
// the server can't read sessionStorage, so it can't know the welcome was already
// seen this session. Every client render must therefore start from this same
// booting state or hydration mismatches. The mount effects below promote it to
// interactive and replay the current route once we're on the client.
function getInitialState(): TerminalState {
  return initialState;
}

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

function commandToPath(raw: string): string | null {
  const parts = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;

  const name = ALIASES[parts[0]] ?? parts[0];
  const firstArg = parts[1];

  if (name === "home") return "/";
  if (["experience", "projects"].includes(name)) {
    return firstArg && /^\d+$/.test(firstArg) ? `/${name}/${firstArg}/` : `/${name}/`;
  }
  if (ROUTED_COMMANDS.has(name)) return `/${name}/`;

  return null;
}

function pathnameToCommand(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const [page, detail] = segments;

  if (!page || page === "home") return "home";
  if (["experience", "projects"].includes(page)) {
    return detail && /^\d+$/.test(detail) ? `${page} ${detail}` : page;
  }
  if (ROUTED_COMMANDS.has(page)) return page;

  return "home";
}

function hasSeenWelcome(): boolean {
  try {
    return window.sessionStorage.getItem(WELCOME_SEEN_KEY) === "true";
  } catch {
    return false;
  }
}

function markWelcomeSeen() {
  try {
    window.sessionStorage.setItem(WELCOME_SEEN_KEY, "true");
  } catch {
    // Storage can be unavailable in private browsing; the intro still completes.
  }
}

export default function TerminalPage() {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(terminalReducer, getInitialState());
  const [inputValue, setInputValue] = useState("");
  const [commandsReady, setCommandsReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigatedRef = useRef(false);
  const shouldScrollToBottomRef = useRef(false);
  // The current route is applied by the deep-link effect after mount; history
  // always starts empty, so nothing has been applied yet.
  const lastAppliedRouteRef = useRef<string | null>(null);

  // Apply stored theme on mount
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  // Show the welcome overlay only once per tab session.
  useEffect(() => {
    if (hasSeenWelcome()) {
      dispatch({ type: "BOOT_COMPLETE" });
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
    }
  }, []);

  // Load command registry
  useEffect(() => {
    initCommands().then(() => setCommandsReady(true));
  }, []);

  // Ctrl+L clears the terminal, like a real shell. (Not Cmd+L — that's the
  // browser's address-bar shortcut.)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        navigatedRef.current = true;
        dispatch({ type: "CLEAR" });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Scroll to top on page navigation, bottom only when appending command output.
  useLayoutEffect(() => {
    if (navigatedRef.current) {
      const body = bodyRef.current;
      body?.scrollTo({ top: 0, behavior: "instant" });
      requestAnimationFrame(() => {
        body?.scrollTo({ top: 0, behavior: "instant" });
        requestAnimationFrame(() => body?.scrollTo({ top: 0, behavior: "instant" }));
      });
      navigatedRef.current = false;
    } else if (shouldScrollToBottomRef.current) {
      shouldScrollToBottomRef.current = false;
      const body = bodyRef.current;
      if (body) {
        const toBottom = () => body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
        toBottom();
        // The appended output can still be growing (lazy data/fonts) when the
        // smooth scroll starts, leaving it short of the new entry. Re-assert once
        // layout settles so the chip is fully revealed on the first click.
        requestAnimationFrame(() => requestAnimationFrame(toBottom));
      }
    }
  }, [state.history]);

  // URL deep-link on boot and browser back/forward.
  useEffect(() => {
    if (state.phase !== "interactive" || !commandsReady) return;
    const searchParams = new URLSearchParams(window.location.search);
    const routeCommand = searchParams.get("run") ?? pathnameToCommand(pathname);
    if (lastAppliedRouteRef.current === routeCommand) return;
    lastAppliedRouteRef.current = routeCommand;
    handleCommand(routeCommand, { updateUrl: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, commandsReady, pathname]);

  useEffect(() => {
    if (state.phase !== "interactive" || !commandsReady) return;

    function handlePopState() {
      const searchParams = new URLSearchParams(window.location.search);
      const routeCommand = searchParams.get("run") ?? pathnameToCommand(window.location.pathname);
      lastAppliedRouteRef.current = routeCommand;
      handleCommand(routeCommand, { updateUrl: false });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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

  function handleWelcomeComplete() {
    markWelcomeSeen();
    dispatch({ type: "BOOT_COMPLETE" });
    setShowWelcome(false);
  }

  function handleCommand(raw: string, options: { updateUrl?: boolean } = {}) {
    if (!commandsReady) return;
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return;
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);
    const shouldUpdateUrl = options.updateUrl ?? true;

    if (name === "clear") {
      navigatedRef.current = true;
      dispatch({ type: "CLEAR" });
      return;
    }

    const resolvedName = ALIASES[name] ?? name;
    const routedPath = shouldUpdateUrl ? commandToPath(raw) : null;

    if (routedPath && routedPath !== window.location.pathname) {
      lastAppliedRouteRef.current = raw.trim().toLowerCase();
      window.history.pushState({ command: raw }, "", routedPath);
    }

    if (PAGE_COMMANDS.has(resolvedName)) {
      const noSubPages = resolvedName === "home";
      if (noSubPages || args.length === 0) {
        navigate(resolvedName as PageName, getPageOutput(resolvedName as PageName));
      } else {
        const n = parseInt(args[0], 10);
        navigate(
          resolvedName as "experience" | "projects",
          getDetailOutput(resolvedName as "experience" | "projects", n)
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

    shouldScrollToBottomRef.current = true;
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
    <MotionConfig reducedMotion="user">
    <div className="terminal-readable flex-1 flex h-dvh w-screen flex-col bg-[var(--t-bg)] text-[var(--t-text)] overflow-hidden">
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen
            key="welcome"
            onComplete={handleWelcomeComplete}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: showWelcome ? 0 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex-1 flex min-h-0 flex-col"
      >
        <TerminalWindow
            onCommand={handleCommand}
            disabled={state.phase === "booting"}
            activePage={state.currentPage}
        >
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
          <StatusBar />
        </TerminalWindow>
      </motion.div>
    </div>
    </MotionConfig>
    </TerminalNavProvider>
  );
}
