import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }
    const res = await query<{ exists: boolean }>(
      "select exists(select 1 from users where email = $1) as exists",
      [email]
    );
    const exists = res.rows[0]?.exists === true;
    return NextResponse.json({ ok: true, available: !exists });
  } catch {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
}
