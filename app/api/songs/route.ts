import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const res = await query<{
      id: number;
      title: string;
      artist: string | null;
      body: string | null;
      created_at: string;
      updated_at: string | null;
      key_scale: string | null;
      difficulty: string | null;
      genre: string | null;
    }>(
      "select id, title, artist, body, created_at, updated_at, key_scale, difficulty, genre from songs order by coalesce(updated_at, created_at) desc"
    );
    return NextResponse.json({ ok: true, data: res.rows });
  } catch {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  const title = String(body.title || "").trim();
  const artist = body.artist ? String(body.artist).trim() : null;
  const sheet = body.body ? String(body.body) : null;
  const fields = {
    key_scale: body.key_scale ? String(body.key_scale) : null,
    capo: body.capo !== undefined ? Number(body.capo) : null,
    difficulty: body.difficulty ? String(body.difficulty) : null,
    tempo: body.tempo !== undefined ? Number(body.tempo) : null,
    strumming_pattern: body.strumming_pattern ? String(body.strumming_pattern) : null,
    tuning: body.tuning ? String(body.tuning) : null,
    genre: body.genre ? String(body.genre) : null,
    tags: Array.isArray(body.tags) ? body.tags.map((t: unknown) => String(t)) : null,
    description: body.description ? String(body.description) : null,
    chord_progression: body.chord_progression ? String(body.chord_progression) : null,
    youtube_link: body.youtube_link ? String(body.youtube_link) : null,
    reference_link: body.reference_link ? String(body.reference_link) : null,
    formatted: body.formatted ? String(body.formatted) : null,
    release_date: body.release_date ? String(body.release_date) : null,
  };
  if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
  try {
    const exists = await query<{ id: number }>(
      "select id from songs where lower(title) = lower($1) and coalesce(lower(artist),'') = coalesce(lower($2),'')",
      [title, artist]
    );
    if (exists.rows.length) {
      return NextResponse.json({ ok: false, error: "Sheet already exists" }, { status: 409 });
    }
    const res = await query<{
      id: number;
      title: string;
      artist: string | null;
      body: string | null;
      created_at: string;
    }>(
      `insert into songs (title, artist, body, key_scale, capo, difficulty, tempo, strumming_pattern, tuning, genre, tags, description, chord_progression, youtube_link, reference_link, formatted, release_date, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, now())
       returning id, title, artist, body, created_at`,
      [
        title,
        artist,
        sheet,
        fields.key_scale,
        fields.capo,
        fields.difficulty,
        fields.tempo,
        fields.strumming_pattern,
        fields.tuning,
        fields.genre,
        fields.tags,
        fields.description,
        fields.chord_progression,
        fields.youtube_link,
        fields.reference_link,
        fields.formatted,
        fields.release_date,
      ]
    );
    return NextResponse.json({ ok: true, data: res.rows[0] }, { status: 201 });
  } catch (e) {
    const msg = (e as Error).message || "";
    if (msg.includes("songs_title_artist_uniq") || msg.includes("duplicate key")) {
      return NextResponse.json({ ok: false, error: "Sheet already exists" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}
