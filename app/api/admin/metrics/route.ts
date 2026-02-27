import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const data = {
    time: now.toISOString(),
    requestsToday: Math.floor(Math.random() * 1000),
    contactSubmissions: Math.floor(Math.random() * 20),
    uptimeMinutes: Math.floor(process.uptime() / 60),
  };
  return NextResponse.json({ ok: true, data });
}

