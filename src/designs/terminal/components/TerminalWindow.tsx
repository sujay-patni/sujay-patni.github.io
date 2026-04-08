import TitleBar from "./TitleBar";

interface TerminalWindowProps {
  children: React.ReactNode;
}

export default function TerminalWindow({ children }: TerminalWindowProps) {
  return (
    <div
      className="w-full max-w-6xl mx-auto flex flex-col bg-zinc-950 rounded-lg ring-1 ring-zinc-800 shadow-2xl overflow-hidden"
      style={{ height: "calc(100vh - 1rem)" }}
      role="application"
      aria-label="Interactive terminal portfolio"
    >
      <TitleBar />
      {children}
    </div>
  );
}
