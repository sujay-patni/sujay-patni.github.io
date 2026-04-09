export type Theme = "terminal" | "coffee" | "amber" | "nord" | "latte";

const KEY = "sp-theme";
const DEFAULT: Theme = "terminal";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT;
  return (localStorage.getItem(KEY) as Theme) ?? DEFAULT;
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(KEY, theme);
}

export const THEMES: { id: Theme; label: string; description: string }[] = [
  { id: "terminal", label: "terminal", description: "dark — zinc & emerald" },
  { id: "nord", label: "nord", description: "dark — polar night & frost" },
  { id: "amber", label: "amber", description: "dark — onyx & amber" },
  { id: "coffee", label: "coffee", description: "light — cream & brown" },
  { id: "latte", label: "latte", description: "light — catppuccin latte" },
];
