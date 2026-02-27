import crypto from "crypto";

const base64url = (input: Buffer | string) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const fromBase64url = (input: string) =>
  Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + "==", "base64").toString("utf8");

export function signToken(
  username: string,
  role: string = "admin",
  extra?: Record<string, unknown>
) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const payload = {
    u: username,
    r: role,
    iat: Math.floor(Date.now() / 1000),
    ...(extra || {}),
  };
  const payloadB64 = base64url(JSON.stringify(payload));
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64");
  const sigB64 = base64url(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifyToken(token: string | undefined) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  const expected = base64url(
    crypto.createHmac("sha256", secret).update(payloadB64).digest("base64")
  );
  if (expected !== sigB64) return null;
  try {
    const json = fromBase64url(payloadB64);
    const payload = JSON.parse(json) as {
      u: string;
      r: string;
      iat: number;
      id?: number;
      e?: string;
    };
    return payload;
  } catch {
    return null;
  }
}
