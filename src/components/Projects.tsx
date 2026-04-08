"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/resume";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-zinc-900/40">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-zinc-100 mb-12"
        >
          Projects
        </motion.h2>

        <div className="grid gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                <h3 className="text-zinc-100 font-semibold text-lg">{project.name}</h3>
                <span className="text-zinc-500 text-xs whitespace-nowrap mt-1 sm:mt-0">{project.period}</span>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{project.description}</p>

              {project.publication && (
                <p className="text-emerald-400 text-xs mb-4 font-medium">
                  📄 {project.publication}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
