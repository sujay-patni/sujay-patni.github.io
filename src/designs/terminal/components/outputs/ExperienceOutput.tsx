"use client";

import { experience } from "@/data/experience";
import AsciiProgressBar from "../AsciiProgressBar";

interface ExperienceOutputProps {
  verbose: boolean;
}

// Key metrics per job (by index in experience array)
const metrics: Record<number, Array<{ label: string; percent: number }>> = {
  0: [
    { label: "delivery efficiency ", percent: 40 },
    { label: "customer inquiries  ", percent: 120 },
  ],
  1: [
    { label: "search success rate ", percent: 108 },
    { label: "homepage performance", percent: 55 },
  ],
  2: [
    { label: "energy-delay product", percent: 80 },
  ],
};

export default function ExperienceOutput({ verbose }: ExperienceOutputProps) {
  if (!verbose) {
    return (
      <div className="font-mono text-sm space-y-1">
        {experience.map((job, i) => (
          <div key={i} className="grid grid-cols-[16ch_20ch_1fr] gap-x-3">
            <span className="text-zinc-500">[{job.period.split("–")[0].trim()}]</span>
            <span className="text-zinc-300">{job.role}</span>
            <span className="text-emerald-400">{job.company.split(" (")[0]}</span>
          </div>
        ))}
        <p className="text-zinc-600 mt-2">
          Use <span className="text-zinc-400">experience --verbose</span> for full detail.
        </p>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm space-y-6">
      {experience.map((job, i) => (
        <div key={i} className="space-y-2">
          <div>
            <span className="text-emerald-400 font-semibold">{job.role}</span>
            <span className="text-zinc-500"> @ </span>
            <span className="text-zinc-300">{job.company.split(" (")[0]}</span>
          </div>
          <div className="text-zinc-600 text-xs">{job.team} · {job.period}</div>
          <ul className="space-y-1 ml-2">
            {job.bullets.map((b, j) => (
              <li key={j} className="flex gap-2 text-zinc-400">
                <span className="text-zinc-600 flex-shrink-0">▸</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {metrics[i] && (
            <div className="mt-3 space-y-1.5 overflow-x-auto">
              {metrics[i].map((m) => (
                <AsciiProgressBar key={m.label} label={m.label} percent={m.percent} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
