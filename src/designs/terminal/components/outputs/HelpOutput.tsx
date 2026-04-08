const commands = [
  { name: "help", desc: "List all available commands" },
  { name: "whoami", desc: "Personal info and contact details" },
  { name: "experience", desc: "Work history  (--verbose for full detail)" },
  { name: "projects", desc: "Side projects and research" },
  { name: "skills", desc: "Skill set  (--tree for ASCII tree view)" },
  { name: "publications", desc: "Research publications" },
  { name: "education", desc: "Academic background" },
  { name: "resume", desc: "View or download resume PDF" },
  { name: "clear", desc: "Clear the terminal" },
];

export default function HelpOutput() {
  return (
    <div className="font-mono text-sm space-y-1">
      <p className="text-zinc-500 mb-2">Available commands:</p>
      {commands.map(({ name, desc }) => (
        <div key={name} className="grid grid-cols-[14ch_1fr] gap-x-3">
          <span className="text-emerald-400">{name}</span>
          <span className="text-zinc-400">{desc}</span>
        </div>
      ))}
      <p className="text-zinc-600 mt-3">
        Use <span className="text-zinc-400">Tab</span> to autocomplete.{" "}
        Use <span className="text-zinc-400">↑ / ↓</span> to navigate history.
      </p>
    </div>
  );
}
