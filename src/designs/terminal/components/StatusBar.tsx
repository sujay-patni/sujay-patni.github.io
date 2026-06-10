"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePortfolioData } from "@/lib/portfolio-data";

// Theme lives only on <html data-theme>; subscribe so switches show live.
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export default function StatusBar() {
  const { config } = usePortfolioData();
  const theme = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.getAttribute("data-theme"),
    () => null
  );
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    const initial = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 border-t border-[var(--t-border)] px-4 py-1.5 terminal-code text-xs text-[var(--t-muted-3)] flex-shrink-0 select-none">
      {theme && <span>theme:{theme}</span>}
      {config.currently_doing && (
        <span className="hidden sm:inline min-w-0 truncate">
          ▸ {config.currently_doing}
        </span>
      )}
      {time && (
        <span aria-hidden="true" className="ml-auto tabular-nums hidden min-[420px]:inline">
          {time}
        </span>
      )}
    </div>
  );
}
