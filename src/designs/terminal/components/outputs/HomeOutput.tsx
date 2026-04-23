"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import TypewriterIntro from "../TypewriterIntro";
import ResumeOutput from "./ResumeOutput";
import { usePortfolioData } from "@/lib/portfolio-data";
import { useTerminalNav } from "../../lib/nav-context";
import { useListKeyNav } from "../../lib/use-list-key-nav";

const PAGES = [
  { cmd: "experience",   label: "experience"   },
  { cmd: "projects",     label: "projects"     },
  { cmd: "publications", label: "publications" },
  { cmd: "skills",       label: "skills"       },
  { cmd: "resume",       label: "resume"       },
  { cmd: "contact",      label: "contact"      },
] as const;

const RESUME_IDX  = PAGES.findIndex((p) => p.cmd === "resume");
const CONTACT_IDX = PAGES.findIndex((p) => p.cmd === "contact");

export default function HomeOutput() {
  const { personal } = usePortfolioData();
  const nav = useTerminalNav();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [resumeOpen,  setResumeOpen]  = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleSelect = useCallback(
    (i: number) => {
      if (i === RESUME_IDX)  { setResumeOpen((prev) => !prev);  return; }
      if (i === CONTACT_IDX) { setContactOpen((prev) => !prev); return; }
      nav(PAGES[i].cmd);
    },
    [nav]
  );

  const selected = useListKeyNav(PAGES.length, handleSelect);

  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="font-mono text-sm space-y-6">
      <TypewriterIntro />

      <section className="space-y-0.5">
        {PAGES.map(({ cmd, label }, i) => {
          const active     = selected === i;
          const isResume   = i === RESUME_IDX;
          const isContact  = i === CONTACT_IDX;
          const isToggle   = isResume || isContact;
          const isOpen     = isResume ? resumeOpen : isContact ? contactOpen : false;

          return (
            <div key={cmd}>
              <button
                ref={(el) => { itemRefs.current[i] = el; }}
                tabIndex={-1}
                onClick={() => {
                  if (isResume)  { setResumeOpen((prev) => !prev);  return; }
                  if (isContact) { setContactOpen((prev) => !prev); return; }
                  nav(cmd);
                }}
                className={`w-full text-left px-2 py-1.5 rounded border-l-2 transition-colors duration-100 cursor-pointer group flex items-center gap-3 ${
                  active
                    ? "bg-[var(--t-accent-dim)] border-[var(--t-accent)]"
                    : "border-transparent hover:bg-[var(--t-accent-dim)] hover:border-[var(--t-accent)]"
                }`}
              >
                <span className={`text-xs ${active ? "text-[var(--t-accent)]" : "text-[var(--t-muted-3)] group-hover:text-[var(--t-accent)]"}`}>
                  {isToggle ? (isOpen ? "▼" : "▷") : active ? "▶" : "▷"}
                </span>
                <span className={active ? "text-[var(--t-accent)]" : "text-[var(--t-text-2)]"}>
                  {label}
                </span>
              </button>

              {isResume && resumeOpen && (
                <div className="ml-6 mt-1 mb-1">
                  <ResumeOutput />
                </div>
              )}

              {isContact && contactOpen && (
                <div className="ml-6 mt-2 mb-1 space-y-1.5">
                  <div className="grid grid-cols-[10ch_1fr] gap-x-3">
                    <span className="text-[var(--t-muted-2)]">email</span>
                    <a href={`mailto:${personal.email}`} className="text-[var(--t-text-2)] hover:text-[var(--t-accent)] transition-colors underline underline-offset-2 break-all">
                      {personal.email}
                    </a>
                  </div>
                  {personal.phone && (
                    <div className="grid grid-cols-[10ch_1fr] gap-x-3">
                      <span className="text-[var(--t-muted-2)]">phone</span>
                      <a href={`tel:${personal.phone}`} className="text-[var(--t-text-2)] hover:text-[var(--t-accent)] transition-colors underline underline-offset-2">
                        {personal.phone}
                      </a>
                    </div>
                  )}
                  <div className="grid grid-cols-[10ch_1fr] gap-x-3">
                    <span className="text-[var(--t-muted-2)]">github</span>
                    <a href={personal.github} target="_blank" rel="noreferrer" className="text-[var(--t-text-2)] hover:text-[var(--t-accent)] transition-colors underline underline-offset-2 break-all">
                      {personal.github.replace("https://", "")}
                    </a>
                  </div>
                  <div className="grid grid-cols-[10ch_1fr] gap-x-3">
                    <span className="text-[var(--t-muted-2)]">linkedin</span>
                    <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-[var(--t-text-2)] hover:text-[var(--t-accent)] transition-colors underline underline-offset-2 break-all">
                      {personal.linkedin.replace("https://", "")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <p className="text-[var(--t-muted-3)] border-t border-[var(--t-border)] pt-3">
        ↑↓ to navigate · Enter or click to open · Esc to type ·{" "}
        <span className="text-[var(--t-muted-1)]">help</span> for all commands
      </p>
    </div>
  );
}
