import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function POST(req: Request) {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload || !payload.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  if (newPassword.length < 6) {
    return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });
  }
  const res = await query<{ password_hash: string }>(
    "select password_hash from users where id = $1",
    [payload.id]
  );
  if (!res.rows.length) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  const ok = await verifyPassword(currentPassword, res.rows[0].password_hash);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid current password" }, { status: 401 });
  }
  const newHash = await hashPassword(newPassword);
  await query("update users set password_hash = $1 where id = $2", [
    newHash,
    payload.id,
  ]);
  return NextResponse.json({ ok: true });
}

