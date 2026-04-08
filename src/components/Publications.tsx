"use client";

import { motion } from "framer-motion";
import { publications } from "@/data/resume";

export default function Publications() {
  return (
    <section id="publications" className="py-24 px-6 bg-zinc-900/40">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-zinc-100 mb-12"
        >
          Publications
        </motion.h2>

        <div className="space-y-5">
          {publications.map((pub, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
            >
              <p className="text-zinc-100 font-medium leading-snug mb-2">{pub.title}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-emerald-400 text-xs font-medium">{pub.venue}</span>
                <span className="text-zinc-600 text-xs">·</span>
                <span className="text-zinc-500 text-xs">{pub.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
