"use client";

import { useRef } from "react";

interface PromptRowProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  onTabComplete: (v: string) => string;
  commandHistory: string[];
  disabled: boolean;
}

export default function PromptRow({
  value,
  onChange,
  onSubmit,
  onTabComplete,
  commandHistory,
  disabled,
}: PromptRowProps) {
  const historyIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      onChange(onTabComplete(value));
      return;
    }

    if (e.key === "Enter") {
      if (value.trim()) {
        historyIndex.current = null;
        onSubmit(value.trim());
        onChange("");
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const idx =
        historyIndex.current === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex.current - 1);
      historyIndex.current = idx;
      onChange(commandHistory[idx] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex.current === null) return;
      const idx = historyIndex.current + 1;
      if (idx >= commandHistory.length) {
        historyIndex.current = null;
        onChange("");
      } else {
        historyIndex.current = idx;
        onChange(commandHistory[idx]);
      }
      return;
    }

    // Reset history navigation on any other key
    historyIndex.current = null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--t-border)] flex-shrink-0">
      <span className="text-[var(--t-accent)] font-mono text-sm sm:text-sm text-base select-none">
        $
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent text-[var(--t-text)] font-mono text-base sm:text-sm outline-none caret-[var(--t-accent)] placeholder-[var(--t-muted-3)] disabled:opacity-0"
        placeholder={disabled ? "" : "type a command or 'help'…"}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Terminal command input"
      />
    </div>
  );
}
