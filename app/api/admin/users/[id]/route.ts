import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload || payload.r !== "admin") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  try {
    await query("delete from users where id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const admin = verifyToken(token);
  if (!admin || admin.r !== "admin") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  const username = typeof body.username === "string" ? body.username.trim() : undefined;
  const newPassword = typeof body.password === "string" ? body.password : undefined;
  try {
    if (username !== undefined) {
      await query("update users set username = $1 where id = $2", [username, id]);
    }
    if (newPassword !== undefined && newPassword.length > 0) {
      const hash = await hashPassword(newPassword);
      await query("update users set password_hash = $1 where id = $2", [hash, id]);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}
