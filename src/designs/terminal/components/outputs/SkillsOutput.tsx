import { skills } from "@/data/skills";

interface SkillsOutputProps {
  tree: boolean;
}

export default function SkillsOutput({ tree }: SkillsOutputProps) {
  if (tree) {
    const lines: string[] = ["skills/"];
    skills.forEach((cat, ci) => {
      const isLastCat = ci === skills.length - 1;
      lines.push(`${isLastCat ? "└──" : "├──"} ${cat.category}/`);
      cat.items.forEach((item, ii) => {
        const isLastItem = ii === cat.items.length - 1;
        const prefix = isLastCat ? "    " : "│   ";
        lines.push(`${prefix}${isLastItem ? "└──" : "├──"} ${item}`);
      });
    });

    return (
      <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
        {lines.map((line, i) => {
          const isCategoryLine = line.match(/^[├└]──.+\/$/) !== null;
          return (
            <div key={i}>
              <span className={isCategoryLine ? "text-emerald-400" : "text-zinc-400"}>
                {line}
              </span>
            </div>
          );
        })}
      </pre>
    );
  }

  return (
    <div className="font-mono text-sm space-y-3">
      {skills.map((cat) => (
        <div key={cat.category}>
          <div className="text-emerald-400 mb-1">{cat.category}</div>
          <div className="flex flex-wrap gap-2 ml-2">
            {cat.items.map((item) => (
              <span key={item} className="text-zinc-400 border border-zinc-700 rounded px-2 py-0.5 text-xs">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
