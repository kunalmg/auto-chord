import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const res = await query<{ id: number; email: string; username: string; password_hash: string }>(
      "select id, email, username, password_hash from users where email = $1",
      [email]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }
    const row = res.rows[0];
    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }
    const token = signToken(row.username, "user", { id: row.id, e: row.email });
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
  } catch (e) {
    const msg = (e as Error).message || "";
    if (msg.includes("DATABASE_URL")) {
      return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
