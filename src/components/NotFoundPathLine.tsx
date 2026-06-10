"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Echoes the requested pathname on the 404 page. Read client-side because the
 * prerendered 404.html is served for every unknown URL on GitHub Pages, so the
 * path is only known in the browser.
 */
export default function NotFoundPathLine() {
  const path =
    useSyncExternalStore(
      emptySubscribe,
      () => window.location.pathname,
      () => null
    ) ?? "…";

  return (
    <>
      <p>
        <span className="text-[var(--t-accent)] select-none">$ </span>
        <span className="text-[var(--t-text-2)]">open {path}</span>
      </p>
      <p className="text-[var(--t-danger)] break-all">
        zsh: no such file or directory: {path}
      </p>
    </>
  );
}
