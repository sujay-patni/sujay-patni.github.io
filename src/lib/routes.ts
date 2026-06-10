import portfolioData from "../../public/notion-data.json";

export const SITE_URL = "https://sujay-patni.github.io";

// `resume` and `contact` are intentionally omitted: they are not standalone
// pages — they append their output at the end of the terminal when invoked.
export const STATIC_COMMAND_ROUTES = [
  "home",
  "experience",
  "projects",
  "education",
  "help",
  "timeline",
  "whoami",
  "skills",
  "publications",
];

/** Every route segment list the site exports, shared by the catch-all page
 *  and the sitemap so they can never drift apart. */
export function getAllRoutes(): string[][] {
  return [
    ...STATIC_COMMAND_ROUTES.map((route) => [route]),
    ...portfolioData.experience.map((_, index) => ["experience", String(index + 1)]),
    ...portfolioData.projects.map((_, index) => ["projects", String(index + 1)]),
  ];
}
