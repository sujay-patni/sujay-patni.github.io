import TitleBar from "./TitleBar";

interface TerminalWindowProps {
  children: React.ReactNode;
}

export default function TerminalWindow({ children }: TerminalWindowProps) {
  return (
    <div
      className="w-full max-w-7xl mx-auto flex flex-col bg-[var(--t-bg)] sm:rounded-lg ring-1 ring-[var(--t-border)] shadow-2xl overflow-hidden"
      style={{ height: "calc(100dvh - 1rem)" }}
      role="application"
      aria-label="Interactive terminal portfolio"
    >
      <TitleBar />
      {children}
    </div>
  );
}
