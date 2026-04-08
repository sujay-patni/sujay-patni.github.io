import { personal } from "@/data/personal";

const rows: Array<[string, React.ReactNode, string?]> = [
  ["name", personal.name],
  ["title", personal.title],
  ["tagline", personal.tagline],
  ["location", personal.location],
  ["email", <a key="email" href={`mailto:${personal.email}`} className="underline underline-offset-2 hover:text-zinc-100 transition-colors">{personal.email}</a>],
  ["github", <a key="github" href={personal.github} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-zinc-100 transition-colors">{personal.github.replace("https://", "")}</a>],
  ["linkedin", <a key="linkedin" href={personal.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-zinc-100 transition-colors">{personal.linkedin.replace("https://", "")}</a>],
];

export default function WhoamiOutput() {
  return (
    <div className="font-mono text-sm space-y-0.5">
      {rows.map(([key, value]) => (
        <div key={key} className="grid grid-cols-[10ch_1fr] gap-x-3">
          <span className="text-zinc-500">{key}</span>
          <span className="text-zinc-200">{value}</span>
        </div>
      ))}
    </div>
  );
}
