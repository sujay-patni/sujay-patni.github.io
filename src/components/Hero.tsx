"use client";

import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { personal } from "@/data/resume";

const items = [
  { delay: 0 },
  { delay: 0.12 },
  { delay: 0.24 },
  { delay: 0.36 },
  { delay: 0.48 },
  { delay: 0.60 },
];

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-3xl w-full">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items[0].delay, duration: 0.5 }}
          className="text-emerald-400 text-sm font-medium mb-3 tracking-wide"
        >
          Hi, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items[1].delay, duration: 0.5 }}
          className="text-5xl sm:text-7xl font-bold text-zinc-100 mb-4 tracking-tight"
        >
          {personal.name}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items[2].delay, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-semibold text-zinc-400 mb-6"
        >
          {personal.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items[3].delay, duration: 0.5 }}
          className="text-zinc-400 text-lg max-w-2xl mb-3"
        >
          {personal.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items[4].delay, duration: 0.5 }}
          className="flex items-center gap-1.5 text-zinc-500 text-sm mb-10"
        >
          <MapPin size={14} />
          {personal.location}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: items[5].delay, duration: 0.5 }}
          className="flex flex-wrap items-center gap-4"
        >
          <a
            href={`mailto:${personal.email}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg text-sm transition-colors"
          >
            <Mail size={16} />
            Get in touch
          </a>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 rounded-lg text-sm transition-colors"
          >
            <GithubIcon size={16} />
            GitHub
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-zinc-700 hover:border-emerald-500 text-zinc-300 hover:text-emerald-400 rounded-lg text-sm transition-colors"
          >
            <LinkedinIcon size={16} />
            LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
}
