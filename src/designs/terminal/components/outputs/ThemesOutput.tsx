"use client";

import { useState } from "react";
import { applyTheme, getStoredTheme, THEMES, type Theme } from "../../lib/theme";

interface ThemesOutputProps {
  applyNow?: Theme;
}

export default function ThemesOutput({ applyNow }: ThemesOutputProps) {
  const [current, setCurrent] = useState<Theme>(() => {
    if (applyNow && THEMES.find((t) => t.id === applyNow)) {
      applyTheme(applyNow);
      return applyNow;
    }
    return getStoredTheme();
  });

  function switchTheme(t: Theme) {
    applyTheme(t);
    setCurrent(t);
  }

  return (
    <div className="font-mono text-sm space-y-2">
      <p className="text-[var(--t-muted-2)] mb-3 text-xs">select a theme:</p>
      {THEMES.map((t) => {
        const active = current === t.id;
        return (
          <button
            key={t.id}
            tabIndex={-1}
            onClick={() => switchTheme(t.id)}
            className={`block w-full text-left px-3 py-2 rounded border transition-all duration-150 cursor-pointer ${
              active
                ? "border-[var(--t-accent)] text-[var(--t-accent)] bg-[var(--t-accent-dim)]"
                : "border-[var(--t-border)] text-[var(--t-muted-1)] hover:border-[var(--t-accent)] hover:text-[var(--t-accent)]"
            }`}
          >
            <span className="mr-2">{active ? "▶" : " "}</span>
            <span className="font-semibold">{t.id}</span>
            <span className="ml-3 text-[var(--t-muted-3)] text-xs">{t.description}</span>
          </button>
        );
      })}
    </div>
  );
}
