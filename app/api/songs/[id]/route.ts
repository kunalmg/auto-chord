import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  try {
    const res = await query(
      `select id, title, artist, key_scale as key, capo, difficulty, tempo, tuning, genre, tags,
              description, strumming_pattern, chord_progression, body as sheet_body,
              created_at, updated_at, owner_id
         from songs where id = $1`,
      [id]
    );
    if (!res.rows.length) return NextResponse.json({ ok: false, error: "Sheet not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: res.rows[0] });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  try {
    const res = await query<{ owner_id: number }>("select owner_id from songs where id = $1", [id]);
    if (!res.rows.length) {
      return NextResponse.json({ ok: false, error: "Sheet not found" }, { status: 404 });
    }
    const ownerId = res.rows[0].owner_id;
    if (payload.r === "admin" || (payload.id && payload.id === ownerId)) {
      await query("delete from songs where id = $1", [id]);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "You can only delete your own sheet." }, { status: 403 });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  const allowed = [
    "title","artist","body","key_scale","capo","difficulty","tempo","strumming_pattern","tuning","genre",
    "tags","description","chord_progression","youtube_link","reference_link","formatted","release_date"
  ] as const;
  const updates: string[] = [];
  const params: unknown[] = [];
  let idx = 1;
  for (const k of allowed) {
    if (k in body) {
      updates.push(`${k} = $${idx++}`);
      if (k === "tags" && Array.isArray(body[k])) {
        params.push(body[k].map((t: unknown) => String(t)));
      } else {
        params.push(body[k]);
      }
    }
  }
  updates.push(`updated_at = now()`);
  if (updates.length === 1) return NextResponse.json({ ok: true });
  params.push(id);
  try {
    await query(`update songs set ${updates.join(", ")} where id = $${idx}`, params);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = (e as Error).message || "";
    if (msg.includes("songs_title_artist_uniq") || msg.includes("duplicate key")) {
      return NextResponse.json({ ok: false, error: "Sheet already exists" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}
