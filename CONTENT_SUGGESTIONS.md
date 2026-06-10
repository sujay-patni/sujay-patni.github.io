# Content Suggestions (Notion edits)

Everything below is edited **in Notion**, then lands on the site via the daily sync
(or run `npm run sync:notion` to apply immediately). Delete this file once done.

## 1. Skills — curate the list

Current *Tools & Platforms* mixes strong and weak signals. Suggested edits:

- [ ] **Merge** `AI Automation` + `AI Agentic Workflows` → one entry: **`AI Agents & Automation`**.
      Two near-duplicates dilute both.
- [ ] **Rename or drop** `Antigravity` — unrecognizable to most readers. If kept:
      **`Google Antigravity (AI IDE)`**. With `Claude Code` already listed, one AI-IDE entry is enough.
- [ ] **Move or drop** `Agile` from *Backend & Frameworks* — it's a process, not a framework.
- [ ] **Consider dropping** `Postman` — weak signal next to Spring Boot / Elasticsearch.
- [ ] Optional: rename *Tools & Platforms* → **`AI & Tooling`**
      (Claude Code, AI Agents & Automation, Git, Linux) — 4 tight categories read better
      on the new skills cards.

## 2. Tagline — tighten for the hero (~160 words → ~55)

Keep the long version somewhere for a future `about` command, but for the hero:

> Hi, I'm Sujay — a Software Engineer at OfBusiness and a CS graduate from BITS Pilani.
> I build scalable backend systems and AI-powered products used by hundreds of thousands of users.
>
> My work spans Java, Spring Boot, distributed systems, AI agent workflows, and search —
> and I like solving problems from first principles and shipping things that create measurable impact.

## 3. Publications — add URL property

- [ ] Add a **`URL`** property (type: URL) to the Publications database, then fill:
  - *Enhancing security through continuous biometric authentication using wearable sensors*
    — Elsevier Internet of Things, Dec 2024 → DOI link
  - *Energy-minimizing workload splitting and frequency selection…* — ACM e-Energy, Jun 2024 → DOI link
- The publications page cards and the "Published in …" badges on experience/projects
  become clickable automatically once these exist.

## 4. Config — fill `currently_doing`

- [ ] Currently empty. It now appears in `whoami` **and** the new terminal status bar.
      Suggestion: `building AI-driven automation at OfBusiness`.
- `open_to_work` is intentionally **not** rendered anywhere in the UI — leave as is.

## 5. Project descriptions — consistency check

Summaries are already in a consistent "Built a…" voice — good. Two smaller items:

- [ ] *Query System for High-Speed IP Flow Analysis* is the only project without a link.
      If the code or a report is public anywhere, add it; otherwise fine.
- [ ] Check the long descriptions of the two academic projects (IP Flow, PPG Sensors)
      read in the same product voice as the personal projects (problem → approach → outcome),
      since they sit side by side on the projects page.
