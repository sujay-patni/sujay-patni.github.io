import type { MetadataRoute } from "next";
import { SITE_URL, getAllRoutes } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, priority: 1 },
    ...getAllRoutes()
      .filter((segments) => segments[0] !== "home")
      .map((segments) => ({
        url: `${SITE_URL}/${segments.join("/")}/`,
        lastModified,
        priority: segments.length > 1 ? 0.6 : 0.8,
      })),
  ];
}
