"use client";

import { useState, useEffect, useRef } from "react";

// Keyboard navigation for list pages (Up/Down to move, Enter to select).
// Uses capture phase so it fires before the prompt's onKeyDown.
// Bails out when the prompt input has text so command-history nav still works.
export function useListKeyNav(
  count: number,
  onSelect: (index: number) => void
): number {
  const [selected, setSelected] = useState(0);
  const selectedRef = useRef(0);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(0);
    selectedRef.current = 0;
  }, [count]);

  useEffect(() => {
    if (count === 0) return;

    function handler(e: KeyboardEvent) {
      // Let the prompt handle keys when the user is typing
      const active = document.activeElement;
      if (active instanceof HTMLInputElement && active.value.length > 0) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        setSelected((prev) => {
          const next = prev <= 0 ? count - 1 : prev - 1;
          selectedRef.current = next;
          return next;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        setSelected((prev) => {
          const next = prev >= count - 1 ? 0 : prev + 1;
          selectedRef.current = next;
          return next;
        });
      } else if (e.key === "Enter") {
        if (selectedRef.current >= 0) {
          e.preventDefault();
          e.stopPropagation();
          onSelectRef.current(selectedRef.current);
        }
      }
    }

    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [count]);

  return selected;
}
