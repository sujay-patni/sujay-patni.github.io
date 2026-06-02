/**
 * Syncs GitHub contribution data → public/github-data.json
 * Run: npm run sync:github
 *
 * Token: prefers GH_PAT, falls back to GITHUB_TOKEN.
 *   • To include private/organization contributions (e.g. work repos) the token
 *     must be the user's OWN PAT (classic, scope `read:user`) and the profile
 *     setting "Include private contributions on my profile" should be ON.
 *   • The auto-provided Actions GITHUB_TOKEN (github-actions[bot]) can only see
 *     PUBLIC contributions, so set the GH_PAT secret to avoid the numbers
 *     shrinking to public-only on the scheduled sync.
 *
 * Only contribution-based data is collected (heatmap + streaks + totals) — all of
 * which count organization/private work when the token can see it. Repo and
 * language data are intentionally not pulled.
 */

import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const TOKEN = process.env.GH_PAT || process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error("Missing GH_PAT / GITHUB_TOKEN. Aborting GitHub sync.");
  process.exit(1);
}

const PUBLIC_DIR = join(process.cwd(), "public");

function resolveLogin(): string {
  if (process.env.GITHUB_LOGIN) return process.env.GITHUB_LOGIN;
  try {
    const notion = JSON.parse(
      readFileSync(join(PUBLIC_DIR, "notion-data.json"), "utf8")
    );
    const url: string = notion?.personal?.github ?? "";
    const m = url.match(/github\.com\/([^/]+)/i);
    if (m) return m[1];
  } catch {
    /* fall through */
  }
  return "sujay-patni";
}

interface ContributionDay {
  date: string;
  contributionCount: number;
}
interface Calendar {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

// ─── GraphQL helper ───────────────────────────────────────────────────────────

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "sujay-patni-portfolio-sync",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("GitHub API returned no data");
  return json.data;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

interface MainResponse {
  user: {
    contributionsCollection: {
      contributionYears: number[];
      restrictedContributionsCount: number;
      contributionCalendar: Calendar;
    };
  };
}

async function fetchMain(login: string): Promise<MainResponse> {
  return gql<MainResponse>(
    `query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionYears
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }`,
    { login }
  );
}

interface YearResponse {
  user: { contributionsCollection: { contributionCalendar: Calendar } };
}

async function fetchYear(login: string, year: number): Promise<Calendar> {
  const data = await gql<YearResponse>(
    `query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }`,
    { login, from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` }
  );
  return data.user.contributionsCollection.contributionCalendar;
}

// ─── Derivations ────────────────────────────────────────────────────────────

/** Longest run of consecutive calendar days (date n, n+1, …) that each had ≥1. */
function longestStreak(days: ContributionDay[]): number {
  let longest = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of days) {
    const t = Date.parse(d.date);
    const consecutive = prev !== null && t - prev === 86_400_000;
    if (d.contributionCount > 0) {
      run = consecutive ? run + 1 : 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    prev = t;
  }
  return longest;
}

/** Current streak: consecutive days up to today with ≥1 (today may be empty). */
function currentStreak(days: ContributionDay[]): number {
  let streak = 0;
  let prev: number | null = null;
  for (let i = days.length - 1; i >= 0; i--) {
    const t = Date.parse(days[i].date);
    if (prev !== null && prev - t !== 86_400_000) break;
    if (days[i].contributionCount > 0) streak++;
    else if (streak === 0 && i === days.length - 1) {
      prev = t;
      continue; // allow today itself to be empty without breaking the streak
    } else break;
    prev = t;
  }
  return streak;
}

async function main() {
  const login = resolveLogin();
  console.log(`Fetching GitHub data for @${login}…`);

  const main = await fetchMain(login);
  const collection = main.user?.contributionsCollection;
  if (!collection) throw new Error(`No GitHub user found for "${login}"`);

  const lastYearCal = collection.contributionCalendar;
  const weeks = lastYearCal.weeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
  );

  if (collection.restrictedContributionsCount === 0) {
    console.warn(
      "⚠ restrictedContributionsCount is 0 — private/org contributions are NOT " +
        "visible to this token. Set GH_PAT (read:user) to include them."
    );
  }

  // All-time: pull each contribution year's calendar, then merge days by date.
  const years = collection.contributionYears; // newest → oldest
  const yearCals = await Promise.all(years.map((y) => fetchYear(login, y)));
  const allDaysMap = new Map<string, number>();
  let totalAllTime = 0;
  // The current-year calendar includes future dates (count 0); exclude them so
  // they don't anchor the current-streak calculation past today.
  const today = new Date().toISOString().slice(0, 10);
  for (const cal of yearCals) {
    totalAllTime += cal.totalContributions;
    for (const w of cal.weeks)
      for (const d of w.contributionDays) {
        if (d.date > today) continue;
        allDaysMap.set(d.date, (allDaysMap.get(d.date) ?? 0) + d.contributionCount);
      }
  }
  const allDays = [...allDaysMap.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, contributionCount]) => ({ date, contributionCount }));

  const out = {
    login,
    generatedAt: new Date().toISOString(),
    totalContributions: lastYearCal.totalContributions, // last 12 months (heatmap context)
    totalContributionsAllTime: totalAllTime,
    currentStreak: currentStreak(allDays),
    longestStreak: longestStreak(allDays),
    weeks,
  };

  mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(
    join(PUBLIC_DIR, "github-data.json"),
    JSON.stringify(out, null, 2) + "\n"
  );

  console.log(
    `Wrote public/github-data.json — ${out.totalContributionsAllTime} all-time ` +
      `(${out.totalContributions} last year, ${collection.restrictedContributionsCount} private), ` +
      `${out.currentStreak}-day current / ${out.longestStreak}-day longest streak.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
