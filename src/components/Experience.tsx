"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/resume";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-zinc-100 mb-12"
        >
          Experience
        </motion.h2>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-12">
            {experience.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="pl-8 relative"
              >
                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-emerald-400" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                  <div>
                    <h3 className="text-zinc-100 font-semibold text-lg leading-tight">{job.role}</h3>
                    <p className="text-emerald-400 text-sm font-medium">{job.company}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{job.team} · {job.location}</p>
                  </div>
                  <span className="text-zinc-500 text-sm whitespace-nowrap mt-1 sm:mt-0">{job.period}</span>
                </div>

                <ul className="mt-3 space-y-2">
                  {job.bullets.map((bullet, j) => (
                    <li key={j} className="text-zinc-400 text-sm leading-relaxed flex gap-2">
                      <span className="text-emerald-500 mt-1.5 shrink-0">▸</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
