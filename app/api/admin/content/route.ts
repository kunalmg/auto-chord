import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import fs from "node:fs/promises";
import path from "node:path";
import { query } from "@/lib/db";

const contentPath = path.join(process.cwd(), "data", "content.json");

const defaults = {
  siteTitle: "AutoChord",
  heroTitle: "Your Guitar. Your Key. Your Song — Instantly.",
  heroSubtitle:
    "AUTOCHORD generates perfectly aligned chords + lyrics with clean formatting and instant transposition.",
  ctaText: "Get Started",
};

async function ensureDir() {
  const dir = path.dirname(contentPath);
  await fs.mkdir(dir, { recursive: true }).catch(() => {});
}

export async function GET() {
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
      return NextResponse.json({
        ok: true,
        data: {
          siteTitle: row.site_title,
          heroTitle: row.hero_title,
          heroSubtitle: row.hero_subtitle,
          ctaText: row.cta_text,
        },
      });
    }
  } catch {
    // fall through to file
  }
  // Fallback to file
  try {
    const json = await fs.readFile(contentPath, "utf8").catch(() => "");
    if (!json) return NextResponse.json({ ok: true, data: defaults });
    const data = JSON.parse(json);
    return NextResponse.json({ ok: true, data: { ...defaults, ...data } });
  } catch {
    return NextResponse.json({ ok: true, data: defaults });
  }
}

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload || payload.r !== "admin") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const data = {
    siteTitle: String(body.siteTitle || defaults.siteTitle),
    heroTitle: String(body.heroTitle || defaults.heroTitle),
    heroSubtitle: String(body.heroSubtitle || defaults.heroSubtitle),
    ctaText: String(body.ctaText || defaults.ctaText),
  };
  // Try DB upsert
  try {
    await query(
      `create table if not exists content (
        id int primary key default 1,
        site_title text not null,
        hero_title text not null,
        hero_subtitle text not null,
        cta_text text not null,
        updated_at timestamptz default now()
      )`
    );
    await query(
      `insert into content (id, site_title, hero_title, hero_subtitle, cta_text)
       values (1, $1, $2, $3, $4)
       on conflict (id) do update set
         site_title = excluded.site_title,
         hero_title = excluded.hero_title,
         hero_subtitle = excluded.hero_subtitle,
         cta_text = excluded.cta_text,
         updated_at = now()`,
      [data.siteTitle, data.heroTitle, data.heroSubtitle, data.ctaText]
    );
    return NextResponse.json({ ok: true, data });
  } catch {
    // Fallback to file
    await ensureDir();
    await fs.writeFile(contentPath, JSON.stringify(data, null, 2), "utf8");
    return NextResponse.json({ ok: true, data });
  }
}
