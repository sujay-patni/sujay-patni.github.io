import type React from "react";

export interface CommandDef {
  name: string;
  aliases?: string[];
  description: string;
  run: (args: string[]) => React.ReactNode;
}

export type CommandRegistry = Map<string, CommandDef>;

export const registry: CommandRegistry = new Map();

function register(def: CommandDef) {
  registry.set(def.name, def);
  def.aliases?.forEach((a) => registry.set(a, def));
}

// Commands are registered lazily so output components can be imported
// without circular deps. Call initCommands() once on the client.
let initialized = false;

export async function initCommands() {
  if (initialized) return;
  initialized = true;

  const [
    { default: HelpOutput },
    { default: WhoamiOutput },
    { default: ContactOutput },
    { default: EducationOutput },
    { default: ResumeOutput },
    { default: ThemesOutput },
    { default: TimelineOutput },
    { default: NotFoundOutput },
    {
      SudoOutput,
      VimOutput,
      NeofetchOutput,
      RmOutput,
      GitLogOutput,
      CoffeeOutput,
      PingOutput,
      LsOutput,
    },
  ] = await Promise.all([
    import("../components/outputs/HelpOutput"),
    import("../components/outputs/WhoamiOutput"),
    import("../components/outputs/ContactOutput"),
    import("../components/outputs/EducationOutput"),
    import("../components/outputs/ResumeOutput"),
    import("../components/outputs/ThemesOutput"),
    import("../components/outputs/TimelineOutput"),
    import("../components/outputs/NotFoundOutput"),
    import("../components/outputs/EasterEggOutput"),
  ]);

  register({
    name: "help",
    description: "List all available commands",
    run: (args) => <HelpOutput secret={args.includes("--secret")} />,
  });

  register({
    name: "home",
    description: "Go to home page",
    run: () => null,
  });

  register({
    name: "experience",
    aliases: ["exp"],
    description: "Work history list; add number for detail",
    run: () => null,
  });

  register({
    name: "projects",
    description: "Projects list; add number for detail",
    run: () => null,
  });

  register({
    name: "publications",
    aliases: ["pubs"],
    description: "Publications list; add number for detail",
    run: () => null,
  });

  register({
    name: "whoami",
    description: "Personal info and contact details",
    run: () => <WhoamiOutput />,
  });

  register({
    name: "contact",
    description: "Contact links",
    run: () => <ContactOutput />,
  });

  register({
    name: "skills",
    description: "Skill set",
    run: () => null,
  });

  register({
    name: "education",
    aliases: ["edu"],
    description: "Academic background",
    run: () => <EducationOutput />,
  });

  register({
    name: "resume",
    description: "View or download resume PDF",
    run: () => <ResumeOutput />,
  });

  register({
    name: "themes",
    description: "Switch color theme",
    run: (args) => {
      type Theme = "terminal" | "coffee" | "amber" | "nord" | "latte";
      const valid: Theme[] = ["terminal", "coffee", "amber", "nord", "latte"];
      const arg = args[0] as Theme | undefined;
      const applyNow = arg && valid.includes(arg) ? arg : undefined;
      return <ThemesOutput applyNow={applyNow} />;
    },
  });

  register({
    name: "timeline",
    description: "Career and education timeline",
    run: () => <TimelineOutput />,
  });

  // ─── Easter eggs ───────────────────────────────────────────────────────────

  register({
    name: "sudo",
    description: "",
    run: () => <SudoOutput />,
  });

  register({
    name: "vim",
    aliases: ["vi"],
    description: "",
    run: () => <VimOutput />,
  });

  register({
    name: "neofetch",
    description: "",
    run: () => <NeofetchOutput />,
  });

  register({
    name: "rm",
    description: "",
    run: (args) => <RmOutput args={args} />,
  });

  register({
    name: "git",
    description: "",
    run: (args) => {
      if (args[0] === "log") return <GitLogOutput />;
      return <span className="text-[var(--t-muted-2)] font-mono text-sm">git: try &apos;git log&apos;</span>;
    },
  });

  register({
    name: "coffee",
    description: "",
    run: () => <CoffeeOutput />,
  });

  register({
    name: "ping",
    description: "",
    run: () => <PingOutput />,
  });

  register({
    name: "ls",
    description: "",
    run: () => <LsOutput />,
  });

  // NotFoundOutput is not a command — stored separately for use in TerminalPage
  registry.set("__notfound__", {
    name: "__notfound__",
    description: "",
    run: (args) => <NotFoundOutput command={args[0] ?? ""} />,
  });
}

export function getCommandNames(): string[] {
  return [...new Set(
    Array.from(registry.values())
      .filter((d) => !d.name.startsWith("__"))
      .map((d) => d.name)
  )].concat(["clear"]);
}
