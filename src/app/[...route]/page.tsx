import Home from "../page";
import portfolioData from "../../../public/notion-data.json";

type RouteParams = {
  route: string[];
};

// `resume` and `contact` are intentionally omitted: they are not standalone
// pages — they append their output at the end of the terminal when invoked.
const STATIC_COMMAND_ROUTES = [
  "home",
  "experience",
  "projects",
  "education",
  "help",
  "timeline",
  "whoami",
];

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  const detailRoutes = [
    ...portfolioData.experience.map((_, index) => ({
      route: ["experience", String(index + 1)],
    })),
    ...portfolioData.projects.map((_, index) => ({
      route: ["projects", String(index + 1)],
    })),
  ];

  return [
    ...STATIC_COMMAND_ROUTES.map((route) => ({ route: [route] })),
    ...detailRoutes,
  ];
}

export default function RoutePage() {
  return <Home />;
}
