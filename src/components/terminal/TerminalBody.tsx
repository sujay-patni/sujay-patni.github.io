import type { RefObject } from "react";

interface TerminalBodyProps {
  children: React.ReactNode;
  bodyRef: RefObject<HTMLDivElement | null>;
}

export default function TerminalBody({ children, bodyRef }: TerminalBodyProps) {
  return (
    <div
      ref={bodyRef}
      className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden px-4 py-4 gap-1 min-h-0"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {children}
    </div>
  );
}
