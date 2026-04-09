/**
 * Syncs Notion CMS data to public/notion-data.json
 * Run: npm run sync:notion
 * Requires only: NOTION_TOKEN
 *
 * Databases are auto-discovered by title — no IDs needed.
 * Expected database titles: Config, Personal, Experience, Projects, Skills, Education, Publications
 */

import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { writeFileSync } from "fs";
import { join } from "path";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// ─── Database discovery ──────────────────────────────────────────────────────

async function findDatabaseId(title: string): Promise<string> {
  const response = await notion.search({
    query: title,
    filter: { value: "data_source", property: "object" },
    page_size: 10,
  });

  for (const result of response.results) {
    const r = result as any;
    const dbTitle: string = (r.title ?? []).map((t: any) => t.plain_text).join("").trim();
    if (dbTitle.toLowerCase() === title.toLowerCase()) {
      return r.id as string;
    }
  }

  throw new Error(`Notion database not found: "${title}". Make sure the database title matches exactly and your integration has access to it.`);
}

// ─── Property extractors ─────────────────────────────────────────────────────

function getText(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (!prop) return "";
  if (prop.type === "title") return prop.title.map((t) => t.plain_text).join("");
  if (prop.type === "rich_text") return prop.rich_text.map((t) => t.plain_text).join("");
  if (prop.type === "email") return prop.email ?? "";
  if (prop.type === "url") return prop.url ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  if (prop.type === "number") return String(prop.number ?? "");
  return "";
}

function getBool(page: PageObjectResponse, key: string): boolean {
  const prop = page.properties[key];
  if (!prop || prop.type !== "checkbox") return false;
  return prop.checkbox;
}

function getDate(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (!prop || prop.type !== "date" || !prop.date) return "";
  return prop.date.start ?? "";
}

function dateToPeriod(start: string, end: string, current: boolean): string {
  const fmt = (d: string) => {
    const [year, month] = d.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  const s = start ? fmt(start) : "";
  const e = current ? "Present" : end ? fmt(end) : "";
  return s && e ? `${s} – ${e}` : s || e;
}

function getBullets(page: PageObjectResponse, key: string): string[] {
  return getText(page, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// ─── Database query helper ───────────────────────────────────────────────────

async function queryAll(dataSourceId: string): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (isFullPage(page)) pages.push(page);
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

// ─── Main sync ───────────────────────────────────────────────────────────────

async function main() {
  console.log("Discovering Notion databases...");

  const [
    configDbId,
    personalDbId,
    experienceDbId,
    projectsDbId,
    skillsDbId,
    educationDbId,
    publicationsDbId,
  ] = await Promise.all([
    findDatabaseId("Config"),
    findDatabaseId("Personal"),
    findDatabaseId("Experience"),
    findDatabaseId("Projects"),
    findDatabaseId("Skills"),
    findDatabaseId("Education"),
    findDatabaseId("Publications"),
  ]);

  console.log("Syncing data...");

  // Config — key/value rows: find each key and read its Value
  const configPages = await queryAll(configDbId);
  const configMap: Record<string, string> = {};
  for (const page of configPages) {
    const key = getText(page, "Key");
    const value = getText(page, "Value");
    if (key) configMap[key] = value;
  }
  const config = {
    active_design: configMap["active_design"] || "terminal",
    currently_doing: configMap["currently_doing"] || "",
    open_to_work: configMap["open_to_work"] === "true",
  };

  // Personal — single row
  const personalPages = await queryAll(personalDbId);
  const personalPage = personalPages[0];
  const personal = personalPage
    ? {
        name: getText(personalPage, "Name"),
        title: getText(personalPage, "title"),
        tagline: getText(personalPage, "tagline"),
        email: getText(personalPage, "email"),
        location: getText(personalPage, "location"),
        linkedin: getText(personalPage, "linkedin"),
        github: getText(personalPage, "github"),
      }
    : null;

  // Experience — newest first (by Start Date descending)
  const experience = (await queryAll(experienceDbId))
    .sort((a, b) => getDate(b, "Start Date").localeCompare(getDate(a, "Start Date")))
    .map((page) => ({
      role: getText(page, "Title"),
      company: getText(page, "Company"),
      team: getText(page, "team"),
      location: getText(page, "Location"),
      period: dateToPeriod(
        getDate(page, "Start Date"),
        getDate(page, "End Date"),
        getBool(page, "Current")
      ),
      bullets: getBullets(page, "bullets"),
    }));

  // Projects — newest first (by Start Date descending)
  const projects = (await queryAll(projectsDbId))
    .sort((a, b) => getDate(b, "Start Date").localeCompare(getDate(a, "Start Date")))
    .map((page) => ({
      name: getText(page, "Name"),
      period: dateToPeriod(getDate(page, "Start Date"), getDate(page, "End Date"), false),
      description: getText(page, "Description"),
      tech: getText(page, "tech")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      publication: getText(page, "publication") || null,
    }));

  // Skills — one row per skill, grouped by Category
  const skillPages = await queryAll(skillsDbId);
  const skillMap: Record<string, string[]> = {};
  const categoryOrder: string[] = [];
  for (const page of skillPages) {
    const category = getText(page, "Category");
    const skill = getText(page, "Skill");
    if (!category || !skill) continue;
    if (!skillMap[category]) {
      skillMap[category] = [];
      categoryOrder.push(category);
    }
    skillMap[category].push(skill);
  }
  const skills = categoryOrder.map((cat) => ({ category: cat, items: skillMap[cat] }));

  // Education — sorted by start date descending
  const education = (await queryAll(educationDbId))
    .sort((a, b) => {
      const da = getDate(a, "Start Date");
      const db = getDate(b, "Start Date");
      return db.localeCompare(da);
    })
    .map((page) => ({
      institution: getText(page, "Institution"),
      degree: getText(page, "Degree"),
      score: getText(page, "GPA"),
      period: dateToPeriod(
        getDate(page, "Start Date"),
        getDate(page, "End Date"),
        getBool(page, "Current")
      ),
      location: getText(page, "Location"),
    }));

  // Publications — sorted by date descending
  const publications = (await queryAll(publicationsDbId))
    .sort((a, b) => {
      const da = getDate(a, "Date");
      const db = getDate(b, "Date");
      return db.localeCompare(da);
    })
    .map((page) => {
      const dateStr = getDate(page, "Date");
      const date = dateStr
        ? new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "";
      return {
        title: getText(page, "Title"),
        venue: getText(page, "Publication"),
        date,
      };
    });

  const output = {
    _meta: {
      synced_at: new Date().toISOString(),
      source: "notion",
    },
    config,
    personal,
    experience,
    projects,
    skills,
    education,
    publications,
  };

  const outPath = join(process.cwd(), "public", "notion-data.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Done. Written to ${outPath}`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
