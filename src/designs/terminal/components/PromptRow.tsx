"use client";

import { useRef, useEffect } from "react";

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

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (document.activeElement === inputRef.current) {
        // Already in input — move focus to first chip so Tab resumes
        const firstChip = document.querySelector("[data-chips] button:not(:disabled)") as HTMLElement | null;
        firstChip?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, []);

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
    <div className="flex items-center gap-2 px-4 py-3.5 border-t border-[var(--t-border)] flex-shrink-0">
      <span className="terminal-code text-[var(--t-accent)] font-mono text-base select-none">
        $
      </span>
      <div className="relative flex-1">
        {/* Blinking block cursor while the prompt is empty; the native accent
            caret takes over as soon as the user types. */}
        {!disabled && value === "" && (
          <span
            aria-hidden="true"
            className="cursor-blink pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[1.2em] w-[0.6em] bg-[var(--t-accent)]"
          />
        )}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          tabIndex={-1}
          className={`terminal-code w-full bg-transparent text-[var(--t-text)] font-mono text-base outline-none placeholder-[var(--t-muted-3)] disabled:opacity-0 ${
            value === "" ? "caret-transparent pl-[0.85em]" : "caret-[var(--t-accent)]"
          }`}
          placeholder={disabled ? "" : "type a command or 'help'…"}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
      </div>
    </div>
  );
}
