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
      className="flex h-full w-full flex-col overflow-hidden bg-[var(--t-bg)] ring-1 ring-inset ring-[var(--t-border)] shadow-2xl"
      role="application"
      aria-label="Interactive terminal portfolio"
    >
      <TitleBar onCommand={onCommand} disabled={disabled} activePage={activePage} />
      {children}
    </div>
  );
}
