import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }
    let row: { id: number; email: string; username: string; password_hash: string; role: string } | null = null;
    try {
      const res = await query<{ id: number; email: string; username: string; password_hash: string; role: string }>(
        "select id, email, username, password_hash, role from users where email = $1",
        [email]
      );
      row = res.rows[0] ?? null;
    } catch (err) {
      const msg = (err as Error).message || "";
      if (msg.includes('column "role"') || msg.includes("column role")) {
        const res2 = await query<{ id: number; email: string; username: string; password_hash: string }>(
          "select id, email, username, password_hash from users where email = $1",
          [email]
        );
        if (res2.rows[0]) {
          row = { ...res2.rows[0], role: "user" } as unknown as {
            id: number;
            email: string;
            username: string;
            password_hash: string;
            role: string;
          };
        }
      } else {
        throw err;
      }
    }
    if (!row) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }
    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }
    const token = signToken(row.username, row.role || "user", { id: row.id, e: row.email });
    if (!token) {
      return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
    }
    const jar = await cookies();
    jar.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    const payload = { user: { id: row.id, email: row.email, name: row.username, role: row.role || "user" } };
    return NextResponse.json({ ok: true, data: payload }, { status: 200 });
  } catch (e) {
    // Avoid leaking internals; return a clean error
    const msg = (e as Error).message || "";
    if (msg.includes("DATABASE_URL")) {
      return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
    }
    if (msg.includes('column "role"') || msg.includes("column role")) {
      return NextResponse.json({ ok: false, error: "Server configuration error" }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
