import { SecretHelpOutput } from "./EasterEggOutput";

const pageCommands = [
  { name: "home", desc: "Home page — intro, experience, projects, resume" },
  { name: "experience [n]", desc: "Work history list; add number for detail" },
  { name: "projects [n]", desc: "Projects list; add number for detail" },
];

const otherCommands = [
  { name: "whoami", desc: "Personal info and contact details" },
  { name: "education", desc: "Academic background" },
  { name: "skills", desc: "Technical skills by category" },
  { name: "publications", desc: "Research publications" },
  { name: "resume", desc: "View or download resume PDF" },
  { name: "themes", desc: "Switch color theme" },
  { name: "timeline", desc: "Career and education timeline" },
  { name: "clear", desc: "Clear the terminal" },
  { name: "help", desc: "List all available commands" },
];

interface HelpOutputProps {
  secret?: boolean;
}

export default function HelpOutput({ secret }: HelpOutputProps) {
  if (secret) {
    return <SecretHelpOutput />;
  }

  return (
    <div className="text-base space-y-5">
      <div className="space-y-1">
        <p className="terminal-code text-[var(--t-accent)] mb-2">{'// pages'}</p>
        {pageCommands.map(({ name, desc }) => (
          <div key={name} className="grid grid-cols-1 sm:grid-cols-[18ch_1fr] gap-x-3">
            <span className="terminal-code text-[var(--t-text-2)]">{name}</span>
            <span className="text-[var(--t-muted-1)]">{desc}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <p className="terminal-code text-[var(--t-accent)] mb-2">{'// commands'}</p>
        {otherCommands.map(({ name, desc }) => (
          <div key={name} className="grid grid-cols-1 sm:grid-cols-[18ch_1fr] gap-x-3">
            <span className="terminal-code text-[var(--t-text-2)]">{name}</span>
            <span className="text-[var(--t-muted-1)]">{desc}</span>
          </div>
        ))}
      </div>
      <p className="text-[var(--t-muted-3)]">
        Use <span className="text-[var(--t-muted-1)]">Tab</span> to autocomplete.{" "}
        Use <span className="text-[var(--t-muted-1)]">↑ / ↓</span> to navigate history.{" "}
        Press <span className="text-[var(--t-muted-1)]">Ctrl+L</span> to clear.
      </p>
      <p className="terminal-code text-xs text-[var(--t-muted-3)]">
        hint: there&apos;s more than meets the eye — try{" "}
        <span className="text-[var(--t-muted-1)]">help --secret</span>
      </p>
    </div>
  );
}
