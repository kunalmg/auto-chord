import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/password";

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    const email = String(body.email || "").trim().toLowerCase();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (!email || !validEmail(email) || !username || password.length < 6) {
      return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 });
    }
    const pwHash = await hashPassword(password);
    // Ensure table exists (defensive; migrations also create it)
    await query(
      `create table if not exists users (
        id serial primary key,
        email text not null unique,
        username text not null,
        password_hash text not null,
        created_at timestamptz default now()
      )`
    );
    const res = await query(
      "insert into users (email, username, password_hash) values ($1, $2, $3) returning id, email, username, created_at",
      [email, username, pwHash]
    );
    return NextResponse.json({ ok: true, data: res.rows[0] }, { status: 201 });
  } catch (e) {
    const msg = (e as Error).message || "";
    if (msg.includes("DATABASE_URL")) {
      return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
    }
    if (msg.includes("duplicate key")) {
      return NextResponse.json({ ok: false, error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
