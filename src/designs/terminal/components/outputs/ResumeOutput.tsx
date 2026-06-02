"use client";

import { FileText, ExternalLink, Download } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-data";

export default function ResumeOutput() {
  const { config, personal } = usePortfolioData();
  const resumePath = config.resume_path;
  const downloadName = config.resume_download_name || "resume.pdf";

  if (!resumePath) {
    return (
      <p className="terminal-code text-sm text-[var(--t-danger)]">
        resume is not configured in Notion
      </p>
    );
  }

  const fileName = downloadName.endsWith(".pdf") ? downloadName : `${downloadName}.pdf`;

  return (
    <div className="text-base space-y-5">
      <div className="terminal-code flex items-center gap-3 text-sm text-[var(--t-muted-3)]">
        <span className="text-[var(--t-accent)]">$</span>
        <span>open resume.pdf</span>
        <span className="h-px flex-1 bg-[var(--t-border)]" />
      </div>

      <div className="max-w-md overflow-hidden rounded-xl border border-[var(--t-border)] bg-[var(--t-surface)]/45">
        {/* window chrome — mirrors the terminal panels */}
        <div className="flex items-center gap-2 border-b border-[var(--t-border)] bg-[var(--t-surface)]/70 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
          <span className="terminal-code ml-2 text-xs text-[var(--t-muted-2)]">~/resume</span>
        </div>

        <div className="flex items-start gap-4 p-5">
          <span className="flex h-14 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--t-border)] bg-[var(--t-bg)]/60 text-[var(--t-accent)]">
            <FileText className="h-6 w-6" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="terminal-code truncate text-[var(--t-text-2)]">{fileName}</div>
            <div className="mt-1 text-sm text-[var(--t-muted-3)]">
              PDF{personal.name ? ` · ${personal.name}` : ""} · résumé
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={resumePath}
                target="_blank"
                rel="noreferrer"
                className="terminal-code inline-flex items-center gap-2 rounded-lg border border-[var(--t-accent)] bg-[var(--t-accent)] px-4 py-2 text-sm font-medium text-[var(--t-bg)] transition-all hover:bg-[var(--t-accent-2)] hover:border-[var(--t-accent-2)] active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </a>
              <a
                href={resumePath}
                download={downloadName}
                className="terminal-code inline-flex items-center gap-2 rounded-lg border border-[var(--t-border)] px-4 py-2 text-sm text-[var(--t-muted-1)] transition-all hover:border-[var(--t-accent)] hover:bg-[var(--t-accent-dim)] hover:text-[var(--t-accent)] active:scale-95"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
