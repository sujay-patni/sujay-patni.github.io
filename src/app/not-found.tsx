import Link from "next/link";
import NotFoundPathLine from "@/components/NotFoundPathLine";

const LINK_CLS =
  "terminal-code inline-flex items-center rounded-md border border-[var(--t-border)] px-3 py-2 text-sm text-[var(--t-text-2)] transition-colors hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:text-[var(--t-accent)]";

export default function NotFound() {
  return (
    <div className="terminal-readable relative flex h-dvh w-screen flex-col items-center justify-center bg-[var(--t-bg)] px-4 text-[var(--t-text)]">
      <div className="scanlines pointer-events-none absolute inset-0" />

      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--t-border)] bg-[var(--t-surface)]/45 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 border-b border-[var(--t-border)] bg-[var(--t-surface)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 opacity-90" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-yellow-400 opacity-90" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-emerald-500 opacity-90" aria-hidden="true" />
          </div>
          <span className="terminal-code truncate text-sm text-[var(--t-muted-2)] select-none">
            sujay@portfolio:~
          </span>
        </div>

        <div className="terminal-code space-y-3 px-5 py-6 text-sm sm:text-base">
          <NotFoundPathLine />
          <p className="text-[var(--t-muted-3)]">{"// exit code 404"}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/" className={LINK_CLS}>cd /</Link>
            <Link href="/help/" className={LINK_CLS}>help</Link>
          </div>

          <p className="pt-2">
            <span className="text-[var(--t-accent)] select-none">$ </span>
            <span className="cursor-blink text-[var(--t-accent)]">█</span>
          </p>
        </div>
      </div>
    </div>
  );
}
