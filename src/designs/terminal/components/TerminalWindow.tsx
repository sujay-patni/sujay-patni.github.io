import TitleBar from "./TitleBar";
import type { PageName } from "../types/terminal";

interface TerminalWindowProps {
  children: React.ReactNode;
  onCommand: (cmd: string) => void;
  disabled: boolean;
  activePage?: PageName;
}

export default function TerminalWindow({ children, onCommand, disabled, activePage }: TerminalWindowProps) {
  return (
    <div
      className="w-full max-w-[min(1600px,calc(100vw-0.5rem))] mx-auto flex flex-col bg-[var(--t-bg)] sm:rounded-lg ring-1 ring-[var(--t-border)] shadow-2xl overflow-hidden"
      style={{ height: "calc(100dvh - 0.5rem)" }}
      role="application"
      aria-label="Interactive terminal portfolio"
    >
      <TitleBar onCommand={onCommand} disabled={disabled} activePage={activePage} />
      {children}
    </div>
  );
}
