import type { RefObject } from "react";

interface TerminalBodyProps {
  children: React.ReactNode;
  bodyRef: RefObject<HTMLDivElement | null>;
}

export default function TerminalBody({ children, bodyRef }: TerminalBodyProps) {
  return (
    <div
      ref={bodyRef}
      className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pt-5 lg:px-8 lg:pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pt-6 gap-1 min-h-0 scroll-pb-[calc(6rem+env(safe-area-inset-bottom))] [overflow-anchor:none]"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {children}
    </div>
  );
}
