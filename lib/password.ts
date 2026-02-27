import crypto from "crypto";

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const N = 16384, r = 8, p = 1, keylen = 64;
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, { N, r, p }, (err, buf) => {
      if (err) reject(err);
      else resolve(buf);
    });
  });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  try {
    const [scheme, Ns, rs, ps, saltHex, hashHex] = encoded.split(":");
    if (scheme !== "scrypt") return false;
    const N = Number(Ns), r = Number(rs), p = Number(ps);
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const keylen = expected.length;
    const derived = await new Promise<Buffer>((resolve, reject) => {
      crypto.scrypt(password, salt, keylen, { N, r, p }, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

