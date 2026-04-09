"use client";

import { getStoredTheme } from "../../lib/theme";

// ─── sudo ────────────────────────────────────────────────────────────────────
export function SudoOutput() {
  return (
    <div className="font-mono text-sm space-y-0.5">
      <p className="text-[var(--t-danger)]">bash: sudo: Permission denied.</p>
      <p className="text-[var(--t-muted-2)]">You are not in the sudoers file.</p>
      <p className="text-[var(--t-muted-2)]">This incident will be reported.</p>
    </div>
  );
}

// ─── vim ─────────────────────────────────────────────────────────────────────
export function VimOutput() {
  return (
    <div className="font-mono text-sm">
      <div className="space-y-0 leading-tight">
        {Array.from({ length: 6 }).map((_, i) => (
          <p key={i} className="text-[var(--t-muted-3)]">~</p>
        ))}
        <p className="text-[var(--t-muted-2)]">&quot;portfolio.txt&quot; [readonly] — 1 line, 42 chars</p>
        <p className="text-[var(--t-muted-3)] text-xs mt-2">
          Hint: type <span className="text-[var(--t-accent)]">:q!</span> to exit.{" "}
          <span className="text-[var(--t-muted-3)]">(you are not actually in vim)</span>
        </p>
      </div>
    </div>
  );
}

// ─── neofetch ────────────────────────────────────────────────────────────────
export function NeofetchOutput() {
  const theme = getStoredTheme();
  const uptime = new Date().getFullYear() - 2024;
  const uptimeStr = uptime <= 0 ? "< 1 year" : `${uptime}+ year${uptime > 1 ? "s" : ""}`;

  const logo = [
    "  ██████╗ ██████╗ ",
    " ██╔════╝ ██╔══██╗",
    "  ╚████╗  ██████╔╝",
    "      ██╗ ██╔═══╝ ",
    " ╚█████╔╝ ██║     ",
    "  ╚════╝  ╚═╝     ",
  ];

  const info = [
    ["", "sujaypatni@portfolio"],
    ["", "────────────────────"],
    ["OS", "sujay-patni.github.io"],
    ["Shell", "js/browser"],
    ["Terminal", "custom built"],
    ["Theme", theme],
    ["Uptime", uptimeStr],
    ["Packages", "9 commands"],
    ["Memory", "☕ 100%"],
    ["", ""],
  ];

  return (
    <div className="font-mono text-sm">
      <div className="flex gap-6">
        <div className="space-y-0 leading-snug flex-shrink-0">
          {logo.map((line, i) => (
            <p key={i} className="text-[var(--t-accent)] font-bold">
              {line}
            </p>
          ))}
        </div>
        <div className="space-y-0 leading-snug">
          {info.map(([key, val], i) =>
            key === "" ? (
              <p key={i} className={val ? "text-[var(--t-text)]" : ""}>
                {val}
              </p>
            ) : (
              <p key={i}>
                <span className="text-[var(--t-accent)] font-semibold">{key}</span>
                <span className="text-[var(--t-muted-3)]">: </span>
                <span className="text-[var(--t-text-2)]">{val}</span>
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── rm -rf / ────────────────────────────────────────────────────────────────
export function RmOutput({ args }: { args: string[] }) {
  const isRmRf = args.some((a) => a.includes("r"));
  return (
    <div className="font-mono text-sm space-y-0.5">
      <p className="text-[var(--t-danger)]">
        {isRmRf
          ? "rm: /: Operation not permitted."
          : "rm: missing operand. Try 'help'."}
      </p>
      {isRmRf && (
        <p className="text-[var(--t-muted-2)]">(Nice try.)</p>
      )}
    </div>
  );
}

// ─── git log ─────────────────────────────────────────────────────────────────
const FAKE_LOG = [
  { hash: "a1b2c3d", msg: "fix: stopped overthinking and shipped it", date: "Mon Apr 7 02:15:00 2026" },
  { hash: "deadbef", msg: "feat: added coffee theme (personal necessity)", date: "Sun Apr 6 14:30:00 2026" },
  { hash: "cafe123", msg: "refactor: rewrote entire portfolio for the 4th time", date: "Sat Apr 5 11:00:00 2026" },
  { hash: "b0rked9", msg: "chore: removed 'available for work' badge (panic)", date: "Fri Apr 4 23:45:00 2026" },
  { hash: "f1r5t00", msg: "init: portfolio.exe has entered the chat", date: "Thu Jan 1 00:00:01 2026" },
];

export function GitLogOutput() {
  return (
    <div className="font-mono text-xs space-y-3">
      {FAKE_LOG.map((entry) => (
        <div key={entry.hash}>
          <p>
            <span className="text-[var(--t-accent)]">commit {entry.hash}</span>
            {entry.hash === "a1b2c3d" && (
              <span className="text-[var(--t-muted-3)]"> (HEAD → main)</span>
            )}
          </p>
          <p className="text-[var(--t-muted-2)]">Author: Sujay Patni &lt;sujaypatni@gmail.com&gt;</p>
          <p className="text-[var(--t-muted-2)]">Date:   {entry.date}</p>
          <p className="text-[var(--t-text-2)] mt-1 pl-4">{entry.msg}</p>
        </div>
      ))}
    </div>
  );
}

// ─── coffee ──────────────────────────────────────────────────────────────────
const COFFEE_ART = `
     ( (
      ) )
   .........
   |       |]
   \\       /
    \`-----'
`.trimStart();

export function CoffeeOutput() {
  return (
    <div className="font-mono text-sm">
      <pre className="text-[var(--t-accent)] leading-snug">{COFFEE_ART}</pre>
      <p className="text-[var(--t-muted-2)] text-xs mt-1">
        &quot;First, solve the problem. Then, write the code.&quot;
      </p>
    </div>
  );
}

// ─── ping ────────────────────────────────────────────────────────────────────
export function PingOutput() {
  return (
    <div className="font-mono text-sm space-y-0.5">
      <p className="text-[var(--t-muted-2)]">PING sujay.patni (0.0.0.0) 56 bytes of data.</p>
      <p className="text-[var(--t-text-2)]">
        64 bytes from sujay.patni: icmp_seq=0 ttl=64{" "}
        <span className="text-[var(--t-accent)]">time=0.001 ms</span>
      </p>
      <p className="text-[var(--t-muted-2)] mt-1">--- sujay.patni ping statistics ---</p>
      <p className="text-[var(--t-muted-2)]">1 packet transmitted, 1 received, 0% packet loss</p>
      <p className="text-[var(--t-accent)]">Status: available for work.</p>
    </div>
  );
}

// ─── ls ──────────────────────────────────────────────────────────────────────
const LS_COMMANDS = [
  "help", "whoami", "experience", "projects",
  "skills", "publications", "education", "resume",
  "themes", "timeline", "clear",
];

export function LsOutput() {
  return (
    <div className="font-mono text-sm">
      <div className="grid grid-cols-4 gap-x-4 gap-y-0.5">
        {LS_COMMANDS.map((cmd) => (
          <span key={cmd} className="text-[var(--t-accent)]">{cmd}</span>
        ))}
      </div>
    </div>
  );
}

// ─── help --secret ────────────────────────────────────────────────────────────
export function SecretHelpOutput() {
  const hidden = ["sudo", "vim", "neofetch", "rm -rf /", "git log", "coffee", "ping", "ls"];
  return (
    <div className="font-mono text-sm space-y-1">
      <p className="text-[var(--t-muted-2)] mb-2 text-xs">shhh — hidden commands:</p>
      <div className="grid grid-cols-4 gap-x-4 gap-y-0.5">
        {hidden.map((cmd) => (
          <span key={cmd} className="text-[var(--t-accent-2)]">{cmd}</span>
        ))}
      </div>
    </div>
  );
}
