import fs from "node:fs/promises";
import path from "node:path";
import { query } from "@/lib/db";

const contentPath = path.join(process.cwd(), "data", "content.json");

export type SiteContent = {
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
};

export async function getSiteContent(): Promise<SiteContent> {
  const defaults: SiteContent = {
    siteTitle: "AutoChord",
    heroTitle: "Your Guitar. Your Key. Your Song — Instantly.",
    heroSubtitle:
      "AUTOCHORD generates perfectly aligned chords + lyrics with clean formatting and instant transposition.",
    ctaText: "Get Started",
  };
  // Try DB first
  try {
    const res = await query<{
      site_title: string;
      hero_title: string;
      hero_subtitle: string;
      cta_text: string;
    }>("select site_title, hero_title, hero_subtitle, cta_text from content where id = 1");
    if (res.rows.length) {
      const row = res.rows[0];
      return {
        siteTitle: row.site_title,
        heroTitle: row.hero_title,
        heroSubtitle: row.hero_subtitle,
        ctaText: row.cta_text,
      };
    }
  } catch {
    // fall back to file
  }
  try {
    const json = await fs.readFile(contentPath, "utf8");
    const data = JSON.parse(json);
    return { ...defaults, ...data };
  } catch {
    return defaults;
  }
}
