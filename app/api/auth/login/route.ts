import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const adminUser = process.env.ADMIN_USER || "";
  const adminPass = process.env.ADMIN_PASS || "";
  if (!adminUser || !adminPass) {
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }
  if (!(username === adminUser && password === adminPass)) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }
  const token = signToken(username, "admin");
  if (!token) {
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
  }
  const jar = await cookies();
  jar.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return NextResponse.json({ ok: true });
}
