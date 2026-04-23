/**
 * Syncs Notion CMS data to public/notion-data.json
 * Run: npm run sync:notion
 * Requires only: NOTION_TOKEN
 *
 * Databases are auto-discovered by title — no IDs needed.
 * Expected database titles: Config, Personal, Experience, Projects, Skills, Education, Publications
 */

import "dotenv/config";
import { Client, isFullPage, isFullBlock } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  DataSourceObjectResponse,
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
  ImageBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { writeFileSync, mkdirSync } from "fs";
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
    if (!("title" in result)) continue;
    const r = result as DataSourceObjectResponse;
    const dbTitle = r.title.map((t) => t.plain_text).join("").trim();
    if (dbTitle.toLowerCase() === title.toLowerCase()) {
      return r.id;
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
  if (prop.type === "phone_number") return prop.phone_number ?? "";
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

// ─── Block fetching helpers ──────────────────────────────────────────────────

async function fetchPageBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      if (isFullBlock(block) && !block.in_trash) blocks.push(block);
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

function blockText(richText: Array<{ plain_text: string }>): string {
  return richText.map((t) => t.plain_text).join("");
}

function extractBullets(blocks: BlockObjectResponse[]): string[] {
  const results: string[] = [];
  for (const b of blocks) {
    if (b.type === "bulleted_list_item") {
      const text = blockText((b as BulletedListItemBlockObjectResponse).bulleted_list_item.rich_text);
      if (text) results.push(text);
    } else if (b.type === "numbered_list_item") {
      const text = blockText((b as NumberedListItemBlockObjectResponse).numbered_list_item.rich_text);
      if (text) results.push(text);
    }
  }
  return results;
}

async function downloadNotionImage(url: string, blockId: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image ${blockId}: ${response.statusText}`);

  const contentType = response.headers.get("content-type") ?? "";
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  const ext = extMap[contentType.split(";")[0].trim()] ?? "jpg";

  const dir = join(process.cwd(), "public", "images", "notion");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${blockId}.${ext}`), Buffer.from(await response.arrayBuffer()));

  return `/images/notion/${blockId}.${ext}`;
}

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt?: string };

async function extractContent(blocks: BlockObjectResponse[]): Promise<ContentBlock[]> {
  const result: ContentBlock[] = [];

  for (const b of blocks) {
    if (b.type === "paragraph") {
      const text = blockText((b as ParagraphBlockObjectResponse).paragraph.rich_text);
      if (text) result.push({ type: "paragraph", text });
    } else if (b.type === "image") {
      const img = (b as ImageBlockObjectResponse).image;
      const isHosted = img.type === "file";
      const url: string = isHosted ? img.file.url : img.external.url;
      const alt = img.caption?.length ? blockText(img.caption) : undefined;

      let src: string;
      if (isHosted) {
        try {
          src = await downloadNotionImage(url, b.id);
        } catch (err) {
          console.warn(`Skipping image ${b.id}:`, (err as Error).message);
          continue;
        }
      } else {
        src = url;
      }

      result.push({ type: "image", src, ...(alt ? { alt } : {}) });
    }
  }

  return result;
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
        phone: getText(personalPage, "phone"),
        location: getText(personalPage, "location"),
        linkedin: getText(personalPage, "linkedin"),
        github: getText(personalPage, "github"),
      }
    : null;

  // Experience — newest first (by Start Date descending)
  const experiencePages = (await queryAll(experienceDbId))
    .sort((a, b) => getDate(b, "Start Date").localeCompare(getDate(a, "Start Date")));

  const experience = await Promise.all(
    experiencePages.map(async (page) => {
      const blocks = await fetchPageBlocks(page.id);
      const blockBullets = extractBullets(blocks);
      return {
        role: getText(page, "Title"),
        company: getText(page, "Company"),
        team: getText(page, "team"),
        location: getText(page, "Location"),
        period: dateToPeriod(
          getDate(page, "Start Date"),
          getDate(page, "End Date"),
          getBool(page, "Current")
        ),
        bullets: blockBullets.length > 0 ? blockBullets : getBullets(page, "bullets"),
      };
    })
  );

  // Projects — newest first (by Start Date descending)
  const projectPages = (await queryAll(projectsDbId))
    .sort((a, b) => getDate(b, "Start Date").localeCompare(getDate(a, "Start Date")));

  const projects = await Promise.all(
    projectPages.map(async (page) => {
      const blocks = await fetchPageBlocks(page.id);
      const content = await extractContent(blocks);
      const paragraphText = content
        .filter((b): b is { type: "paragraph"; text: string } => b.type === "paragraph")
        .map((b) => b.text)
        .join(" ");
      return {
        name: getText(page, "Name"),
        period: dateToPeriod(getDate(page, "Start Date"), getDate(page, "End Date"), false),
        description: paragraphText || getText(page, "Description"),
        tech: getText(page, "tech")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        publication: getText(page, "publication") || null,
        content,
      };
    })
  );

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
  const educationPages = (await queryAll(educationDbId))
    .sort((a, b) => {
      const da = getDate(a, "Start Date");
      const db = getDate(b, "Start Date");
      return db.localeCompare(da);
    });

  const education = await Promise.all(
    educationPages.map(async (page) => {
      const blocks = await fetchPageBlocks(page.id);
      return {
        institution: getText(page, "Institution"),
        degree: getText(page, "Degree"),
        score: getText(page, "GPA"),
        period: dateToPeriod(
          getDate(page, "Start Date"),
          getDate(page, "End Date"),
          getBool(page, "Current")
        ),
        location: getText(page, "Location"),
        content: await extractContent(blocks),
      };
    })
  );

  // Publications — sorted by date descending
  const publicationPages = (await queryAll(publicationsDbId))
    .sort((a, b) => {
      const da = getDate(a, "Date");
      const db = getDate(b, "Date");
      return db.localeCompare(da);
    });

  const publications = await Promise.all(
    publicationPages.map(async (page) => {
      const blocks = await fetchPageBlocks(page.id);
      const dateStr = getDate(page, "Date");
      const date = dateStr
        ? new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "";
      return {
        title: getText(page, "Title"),
        venue: getText(page, "Publication"),
        date,
        content: await extractContent(blocks),
      };
    })
  );

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
