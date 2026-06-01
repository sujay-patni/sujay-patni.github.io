import { usePortfolioData } from "@/lib/portfolio-data";

export default function ResumeOutput() {
  const { config, personal } = usePortfolioData();
  const resumePath = config.resume_path;
  const downloadName = config.resume_download_name || "resume.pdf";

  if (!resumePath) {
    return (
      <p className="font-mono text-sm text-[var(--t-danger)]">
        resume is not configured in Notion
      </p>
    );
  }

  return (
    <div className="font-mono text-sm space-y-3">
      <p className="text-[var(--t-muted-1)]">
        {personal.name ? `${personal.name} - ` : ""}Resume <span className="text-[var(--t-muted-3)]">(PDF)</span>
      </p>
      <div className="flex gap-4">
        <a
          href={resumePath}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--t-accent)] underline underline-offset-2 hover:text-[var(--t-accent-2)] transition-colors"
        >
          ↗ view
        </a>
        <a
          href={resumePath}
          download={downloadName}
          className="text-[var(--t-muted-1)] underline underline-offset-2 hover:text-[var(--t-text)] transition-colors"
        >
          ↓ download
        </a>
      </div>
    </div>
  );
}
