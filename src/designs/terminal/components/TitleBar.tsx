export default function TitleBar() {
  return (
    <div className="flex items-center px-4 py-3 border-b border-[var(--t-border)] bg-[var(--t-surface)] rounded-t-lg flex-shrink-0">
      <div className="flex items-center gap-2 w-16">
        <span className="w-3 h-3 rounded-full bg-red-500 opacity-90" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-90" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-90" aria-hidden="true" />
      </div>
      <span className="flex-1 text-center text-xs text-[var(--t-muted-2)] font-mono tracking-wide select-none">
        sujay@portfolio:~
      </span>
      <div className="w-16" aria-hidden="true" />
    </div>
  );
}
