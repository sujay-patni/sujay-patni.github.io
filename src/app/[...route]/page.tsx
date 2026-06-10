import Home from "../page";
import { getAllRoutes } from "@/lib/routes";

type RouteParams = {
  route: string[];
};

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return getAllRoutes().map((route) => ({ route }));
}

export default function RoutePage() {
  return <Home />;
}
