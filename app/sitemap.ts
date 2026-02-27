import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();
  const paths = [
    "",
    "/about",
    "/features",
    "/how-it-works",
    "/tech-stack",
    "/use-cases",
    "/contact",
    "/signin",
    "/signup",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p ? 0.6 : 1.0,
  }));
}

