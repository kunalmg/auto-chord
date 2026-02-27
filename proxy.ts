import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Payload = { r?: string } | null;

function decodePayload(token: string | undefined): Payload {
  if (!token) return null;
  const [payloadB64] = token.split(".");
  if (!payloadB64) return null;
  try {
    const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(b64 + pad);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session")?.value;
  const payload = decodePayload(session);

  if (pathname.startsWith("/dashboard")) {
    if (!payload) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!payload || payload.r !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};

