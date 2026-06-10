export type Theme = "terminal" | "coffee" | "amber" | "nord" | "latte";

const KEY = "sp-theme";
const DEFAULT: Theme = "terminal";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT;
  return (localStorage.getItem(KEY) as Theme) ?? DEFAULT;
}

let transitionTimer: ReturnType<typeof setTimeout> | undefined;

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const prev = root.getAttribute("data-theme");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Crossfade colors only on an actual switch — never on first paint, where
  // the boot script has already set the same theme.
  if (prev && prev !== theme && !prefersReduced) {
    clearTimeout(transitionTimer);
    root.classList.add("theme-transition");
    transitionTimer = setTimeout(() => root.classList.remove("theme-transition"), 400);
  }

  root.setAttribute("data-theme", theme);
  localStorage.setItem(KEY, theme);
}

export const THEMES: { id: Theme; label: string; description: string }[] = [
  { id: "terminal", label: "terminal", description: "dark — zinc & emerald" },
  { id: "nord", label: "nord", description: "dark — polar night & frost" },
  { id: "amber", label: "amber", description: "dark — onyx & amber" },
  { id: "coffee", label: "coffee", description: "light — cream & brown" },
  { id: "latte", label: "latte", description: "light — catppuccin latte" },
];
