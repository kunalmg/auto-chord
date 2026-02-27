import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

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
  const username = String(body.username || "").trim();
  if (!username) {
    return NextResponse.json({ ok: false, error: "Invalid username" }, { status: 400 });
    }
  await query("update users set username = $1 where id = $2", [username, payload.id]);
  return NextResponse.json({ ok: true });
}

