const RESUME_PATH = "/SujayPatni_Resume_2026.pdf";

export default function ResumeOutput() {
  return (
    <div className="font-mono text-sm space-y-3">
      <p className="text-zinc-400">
        Sujay Patni — Resume <span className="text-zinc-600">(PDF, 2026)</span>
      </p>
      <div className="flex gap-4">
        <a
          href={RESUME_PATH}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors"
        >
          ↗ view
        </a>
        <a
          href={RESUME_PATH}
          download="SujayPatni_Resume_2026.pdf"
          className="text-zinc-400 underline underline-offset-2 hover:text-zinc-200 transition-colors"
        >
          ↓ download
        </a>
      </div>
    </div>
  );
}
