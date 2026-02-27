import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  const token = String(body.token || "").trim();
  const newPassword = String(body.newPassword || "");
  if (!token || newPassword.length < 6) {
    return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 });
  }
  try {
    const res = await query<{ user_id: number; expires_at: string; used_at: string | null }>(
      "select user_id, expires_at, used_at from password_reset_tokens where token = $1",
      [token]
    );
    if (!res.rows.length) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 400 });
    }
    const row = res.rows[0];
    if (row.used_at) {
      return NextResponse.json({ ok: false, error: "Token already used" }, { status: 400 });
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: "Token expired" }, { status: 400 });
    }
    const hash = await hashPassword(newPassword);
    await query("update users set password_hash = $1 where id = $2", [hash, row.user_id]);
    await query("update password_reset_tokens set used_at = now() where token = $1", [token]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}

