# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server (requires Node 20+)
npm run build        # production build → ./out (static export)
npm run lint         # ESLint
npm run sync:notion  # fetch Notion CMS data → public/notion-data.json (requires NOTION_TOKEN)
```

Node 20+ is required. If using nvm: `nvm use 20`.

## Architecture

This is a **static Next.js export** deployed to GitHub Pages. There is no server — everything renders client-side from `./out`.

### Data flow

```
Notion databases
  → scripts/sync-notion.ts (runs via GitHub Actions daily or npm run sync:notion)
  → public/notion-data.json

src/data/*.ts (static fallback)
  → src/lib/portfolio-data.tsx (PortfolioDataProvider)
  → usePortfolioData() hook
  → all output components + HiddenA11yContent
```

`PortfolioDataProvider` initialises with static data immediately (no loading flash), then fetches `/notion-data.json` on mount and replaces state if successful.

### Design system

Designs live in `src/designs/<name>/index.tsx`. Only `terminal` exists. To add a new design, create a new folder with a default export and register it in the `DESIGNS` map in `src/app/page.tsx`. The active design is controlled at runtime via the `active_design` key in the Notion Config database (or `config.active_design` in `notion-data.json`).

Theme switching is CSS-only via `data-theme` on `<html>`. All theme variables are defined inline in `src/app/layout.tsx` (not in CSS files — Turbopack strips `[data-theme]` blocks from `globals.css`). Theme persists to `localStorage` key `sp-theme`.

### Terminal design internals

- **Commands** are registered in `src/designs/terminal/lib/commands.tsx` via `initCommands()`, which lazy-loads all output components with `Promise.all` to avoid circular deps. Add new commands here.
- **Output components** live in `src/designs/terminal/components/outputs/`. Each is a `"use client"` component that calls `usePortfolioData()` for data.
- **`clear`** is a built-in command handled in `TerminalPage`, not in the registry.
- **URL deep linking**: `?run=<command>` auto-executes a command after boot.

### Notion CMS schema

The sync script auto-discovers databases by title via `notion.search()`. Property name mapping (Notion → code):

| Database | Key properties |
|---|---|
| Config | Key (title) + Value (text) — key/value rows |
| Personal | Name (title), title, tagline, email, location, linkedin, github |
| Experience | Title (title=role), Company, team, Location, bullets (newline-separated text), Start/End Date, Current (checkbox) |
| Projects | Name (title), Description, tech (comma-separated text), publication, Start/End Date |
| Skills | Skill (title), Category (select) — one row per skill, grouped by category in sync script |
| Education | Degree (title), Institution, GPA, Location, Start/End Date |
| Publications | Title (title), Publication (=venue), Date (date) |

### GitHub Actions

- `deploy.yml` — triggers on push to `main`, builds and deploys to GitHub Pages
- `sync-notion.yml` — runs daily at 6 AM UTC, commits updated `notion-data.json` to `main`, triggering a redeploy. Requires `NOTION_TOKEN` secret in repo settings.
