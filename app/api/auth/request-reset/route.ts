import { NextResponse } from "next/server";
import crypto from "crypto";
import { query } from "@/lib/db";
import { sendResetEmail } from "@/lib/mailer";

const ONE_HOUR = 60 * 60 * 1000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  const email = String(body.email || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });

  try {
    const userRes = await query<{ id: number }>("select id from users where email = $1", [email]);
    if (!userRes.rows.length) {
      // Respond success to avoid account enumeration
      return NextResponse.json({ ok: true });
    }
    const userId = userRes.rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + ONE_HOUR);
    await query(
      `create table if not exists password_reset_tokens (
        id serial primary key,
        user_id int not null references users(id) on delete cascade,
        token text not null unique,
        expires_at timestamptz not null,
        used_at timestamptz
      )`
    );
    await query(
      "insert into password_reset_tokens (user_id, token, expires_at) values ($1, $2, $3)",
      [userId, token, expiresAt.toISOString()]
    );
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset/${token}`;
    const sent = await sendResetEmail(email, resetUrl).catch(() => false);
    if (!sent) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ ok: true, resetUrl });
      }
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}
