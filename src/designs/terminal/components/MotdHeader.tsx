import { personal } from "@/data/personal";

export default function MotdHeader() {
  return (
    <div className="flex-shrink-0 px-4 py-2.5 border-b border-zinc-800/70 bg-zinc-900/25">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs">
        <span className="text-emerald-400 font-semibold tracking-wide">
          {personal.name}
        </span>
        <span className="text-zinc-700 select-none">·</span>
        <span className="text-zinc-400">{personal.title}</span>
        <span className="text-zinc-700 select-none">·</span>
        <span className="text-zinc-500">OfBusiness</span>
        <span className="text-zinc-700 select-none">·</span>
        <span className="text-zinc-600">{personal.location}</span>
      </div>
    </div>
  );
}
