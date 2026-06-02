const BASE =
  "terminal-code mt-0.5 inline-flex w-fit items-start gap-1 rounded-md border border-[var(--t-accent-2)] px-2 py-1 text-xs leading-snug text-[var(--t-accent-2)]";

/**
 * A "Published in …" badge. Renders as an external link when a url is given,
 * otherwise as a static pill. Used to associate a publication with the project
 * or role it came out of (publications no longer have a standalone page).
 */
export default function PublicationLink({ label, url }: { label: string; url?: string }) {
  if (!url) {
    return (
      <span className={BASE} style={{ backgroundColor: "var(--t-accent-dim)" }}>
        <span aria-hidden className="mt-px flex-shrink-0">
          ↗
        </span>
        <span>{label}</span>
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} transition-colors hover:border-[var(--t-accent)] hover:text-[var(--t-accent)]`}
      style={{ backgroundColor: "var(--t-accent-dim)" }}
    >
      <span aria-hidden className="mt-px flex-shrink-0">
        ↗
      </span>
      <span className="underline decoration-dotted underline-offset-2">{label}</span>
    </a>
  );
}
