import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload || !payload.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const res = await query<{ id: number; email: string; username: string }>(
    "select id, email, username from users where id = $1",
    [payload.id]
  );
  if (!res.rows.length) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, data: res.rows[0] });
}

