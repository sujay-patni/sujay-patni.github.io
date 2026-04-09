const RESUME_PATH = "/SujayPatni_Resume_2026.pdf";

export default function ResumeOutput() {
  return (
    <div className="font-mono text-sm space-y-3">
      <p className="text-[var(--t-muted-1)]">
        Sujay Patni — Resume <span className="text-[var(--t-muted-3)]">(PDF, 2026)</span>
      </p>
      <div className="flex gap-4">
        <a
          href={RESUME_PATH}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--t-accent)] underline underline-offset-2 hover:text-[var(--t-accent-2)] transition-colors"
        >
          ↗ view
        </a>
        <a
          href={RESUME_PATH}
          download="SujayPatni_Resume_2026.pdf"
          className="text-[var(--t-muted-1)] underline underline-offset-2 hover:text-[var(--t-text)] transition-colors"
        >
          ↓ download
        </a>
      </div>
    </div>
  );
}
