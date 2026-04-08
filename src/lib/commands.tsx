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
    { default: ExperienceOutput },
    { default: ProjectsOutput },
    { default: SkillsOutput },
    { default: PublicationsOutput },
    { default: EducationOutput },
    { default: NotFoundOutput },
  ] = await Promise.all([
    import("@/components/terminal/outputs/HelpOutput"),
    import("@/components/terminal/outputs/WhoamiOutput"),
    import("@/components/terminal/outputs/ExperienceOutput"),
    import("@/components/terminal/outputs/ProjectsOutput"),
    import("@/components/terminal/outputs/SkillsOutput"),
    import("@/components/terminal/outputs/PublicationsOutput"),
    import("@/components/terminal/outputs/EducationOutput"),
    import("@/components/terminal/outputs/NotFoundOutput"),
  ]);

  register({
    name: "help",
    description: "List all available commands",
    run: () => <HelpOutput />,
  });

  register({
    name: "whoami",
    description: "Personal info and contact details",
    run: () => <WhoamiOutput />,
  });

  register({
    name: "experience",
    aliases: ["exp"],
    description: "Work history  (--verbose for full detail)",
    run: (args) => <ExperienceOutput verbose={args.includes("--verbose")} />,
  });

  register({
    name: "projects",
    description: "Side projects and research",
    run: () => <ProjectsOutput />,
  });

  register({
    name: "skills",
    description: "Skill set  (--tree for ASCII tree view)",
    run: (args) => <SkillsOutput tree={args.includes("--tree")} />,
  });

  register({
    name: "publications",
    aliases: ["pubs"],
    description: "Research publications",
    run: () => <PublicationsOutput />,
  });

  register({
    name: "education",
    aliases: ["edu"],
    description: "Academic background",
    run: () => <EducationOutput />,
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
