import { projects } from "@/data/resume";

export default function ProjectsOutput() {
  return (
    <div className="font-mono text-sm space-y-5">
      {projects.map((p, i) => (
        <div key={i} className="space-y-1.5">
          <div className="text-emerald-400 font-semibold">{p.name}</div>
          <div className="text-zinc-600 text-xs">{p.period}</div>
          <p className="text-zinc-400 leading-relaxed">{p.description}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {p.tech.map((t) => (
              <span key={t} className="text-xs text-zinc-500 border border-zinc-700 rounded px-1.5 py-0.5">
                {t}
              </span>
            ))}
          </div>
          {p.publication && (
            <div className="text-xs text-emerald-600 mt-1">↗ {p.publication}</div>
          )}
        </div>
      ))}
    </div>
  );
}
