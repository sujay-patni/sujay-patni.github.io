const commands = [
  { name: "help", desc: "List all available commands" },
  { name: "whoami", desc: "Personal info and contact details" },
  { name: "experience", desc: "Work history  (--verbose for full detail)" },
  { name: "projects", desc: "Side projects and research" },
  { name: "skills", desc: "Skill set  (--tree for ASCII tree view)" },
  { name: "publications", desc: "Research publications" },
  { name: "education", desc: "Academic background" },
  { name: "resume", desc: "View or download resume PDF" },
  { name: "themes", desc: "Switch color theme" },
  { name: "timeline", desc: "Career and education timeline" },
  { name: "clear", desc: "Clear the terminal" },
];

interface HelpOutputProps {
  secret?: boolean;
}

export default function HelpOutput({ secret }: HelpOutputProps) {
  if (secret) {
    const { SecretHelpOutput } = require("./EasterEggOutput");
    return <SecretHelpOutput />;
  }

  return (
    <div className="font-mono text-sm space-y-1">
      <p className="text-[var(--t-muted-2)] mb-2">Available commands:</p>
      {commands.map(({ name, desc }) => (
        <div key={name} className="grid grid-cols-[14ch_1fr] gap-x-3">
          <span className="text-[var(--t-accent)]">{name}</span>
          <span className="text-[var(--t-muted-1)]">{desc}</span>
        </div>
      ))}
      <p className="text-[var(--t-muted-3)] mt-3">
        Use <span className="text-[var(--t-muted-1)]">Tab</span> to autocomplete.{" "}
        Use <span className="text-[var(--t-muted-1)]">↑ / ↓</span> to navigate history.
      </p>
    </div>
  );
}
