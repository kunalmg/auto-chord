import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const res = await query<{ id: number; title: string; artist: string | null; body: string | null; created_at: string }>(
      "select id, title, artist, body, created_at from songs order by id desc"
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
  if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
  try {
    const res = await query<{ id: number; title: string; artist: string | null; body: string | null; created_at: string }>(
      "insert into songs (title, artist, body) values ($1, $2, $3) returning id, title, artist, body, created_at",
      [title, artist, sheet]
    );
    return NextResponse.json({ ok: true, data: res.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}

