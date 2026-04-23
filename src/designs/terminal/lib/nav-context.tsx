"use client";

import { createContext, useContext } from "react";

// Provides handleCommand to output components so they can trigger navigation
const TerminalNavContext = createContext<(cmd: string) => void>(() => {});

export const TerminalNavProvider = TerminalNavContext.Provider;

export function useTerminalNav() {
  return useContext(TerminalNavContext);
}
