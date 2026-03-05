import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return NextResponse.json(
        { ok: false, error: "Server not configured" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON" },
        { status: 400 }
      );
    }
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const text =
      `New website inquiry:` +
      `\nName: ${name}` +
      `\nEmail: ${email}` +
      `\nMessage:\n${message}`;

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      }
    );

    if (!res.ok) {
      let msg = "Messaging service error";
      try {
        const j = (await res.json()) as { description?: string; error_code?: number } | null;
        const desc = j?.description || "";
        if (desc.toLowerCase().includes("chat not found")) {
          msg = "Contact service not configured";
        } else if (desc) {
          msg = "Messaging service error";
        }
      } catch {
        // ignore
      }
      return NextResponse.json({ ok: false, error: msg }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
