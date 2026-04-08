import { publications } from "@/data/publications";

export default function PublicationsOutput() {
  return (
    <div className="font-mono text-sm space-y-4">
      {publications.map((pub, i) => (
        <div key={i} className="space-y-1">
          <div className="text-zinc-200 leading-relaxed">{pub.title}</div>
          <div className="text-emerald-600 text-xs">{pub.venue}</div>
          <div className="text-zinc-600 text-xs">{pub.date}</div>
        </div>
      ))}
    </div>
  );
}
