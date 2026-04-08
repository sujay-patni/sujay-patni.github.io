import { education } from "@/data/resume";

export default function EducationOutput() {
  return (
    <div className="font-mono text-sm space-y-4">
      {education.map((edu, i) => (
        <div key={i} className="space-y-0.5">
          <div className="text-emerald-400 font-semibold">{edu.institution}</div>
          <div className="text-zinc-300">{edu.degree}</div>
          <div className="text-zinc-500 text-xs">{edu.period} · {edu.location}</div>
          <div className="text-zinc-400 text-xs">{edu.score}</div>
        </div>
      ))}
    </div>
  );
}
