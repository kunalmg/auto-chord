import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

// Minimal CORS for cross-origin frontend
app.use((req, res, next) => {
  const origin =
    process.env.CORS_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Auth token helpers (HMAC-based)
import crypto from "crypto";
function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
function signToken(username, role = "user", extra = {}) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const payload = {
    u: username,
    r: role,
    iat: Math.floor(Date.now() / 1000),
    ...extra,
  };
  const payloadB64 = base64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64");
  const sigB64 = base64url(sig);
  return `${payloadB64}.${sigB64}`;
}
async function verifyPassword(password, encoded) {
  try {
    const [scheme, Ns, rs, ps, saltHex, hashHex] = String(encoded).split(":");
    if (scheme !== "scrypt") return false;
    const N = Number(Ns), r = Number(rs), p = Number(ps);
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const keylen = expected.length;
    const derived = await new Promise((resolve, reject) => {
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

app.get("/health", (req, res) => {
  res.json({ ok: true, data: { status: "ok" } });
});

// Alias for consistency with other services
app.get("/api/health", (req, res) => {
  res.json({ ok: true, data: { status: "ok" } });
});

app.get("/api/status", async (req, res) => {
  if (!pool) {
    res.json({ ok: true, data: { database: "not_configured" } });
    return;
  }
  try {
    const result = await pool.query("select now()");
    res.json({ ok: true, data: { database: "connected", now: result.rows[0].now } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

app.get("/api/songs", async (req, res) => {
  if (!pool) {
    res.status(503).json({ ok: false, error: "Database not configured" });
    return;
  }
  try {
    const result = await pool.query(
      "select id, title, artist, created_at from songs order by id desc"
    );
    res.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

app.get("/api/songs/:id", async (req, res) => {
  if (!pool) {
    res.status(503).json({ ok: false, error: "Database not configured" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ ok: false, error: "Invalid id" });
    return;
  }
  try {
    const result = await pool.query(
      "select id, title, artist, created_at from songs where id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

app.post("/api/songs", async (req, res) => {
  if (!pool) {
    res.status(503).json({ ok: false, error: "Database not configured" });
    return;
  }
  const { title, artist } = req.body ?? {};
  if (!title || typeof title !== "string") {
    res.status(400).json({ ok: false, error: "Title is required" });
    return;
  }
  try {
    const result = await pool.query(
      "insert into songs (title, artist) values ($1, $2) returning id, title, artist, created_at",
      [title, typeof artist === "string" ? artist : null]
    );
    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

app.delete("/api/songs/:id", async (req, res) => {
  if (!pool) {
    res.status(503).json({ ok: false, error: "Database not configured" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ ok: false, error: "Invalid id" });
    return;
  }
  try {
    const exists = await pool.query("select id from songs where id = $1", [id]);
    if (!exists.rows.length) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    await pool.query("delete from songs where id = $1", [id]);
    res.json({ ok: true, data: { id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  try {
    const body = req.body ?? null;
    if (!body) {
      res.status(400).json({ ok: false, error: "Invalid JSON" });
      return;
    }
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) {
      res.status(400).json({ ok: false, error: "Email and password are required" });
      return;
    }
    if (!pool) {
      res.status(503).json({ ok: false, error: "Database not configured" });
      return;
    }
    let row = null;
    try {
      const result = await pool.query(
        "select id, email, username, password_hash, coalesce(role, 'user') as role from users where email = $1",
        [email]
      );
      row = result.rows[0] ?? null;
    } catch (err) {
      throw err;
    }
    if (!row) {
      res.status(401).json({ ok: false, error: "Invalid email or password" });
      return;
    }
    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) {
      res.status(401).json({ ok: false, error: "Invalid email or password" });
      return;
    }
    const token = signToken(row.username, row.role || "user", { id: row.id, e: row.email });
    if (!token) {
      res.status(500).json({ ok: false, error: "Server configuration error" });
      return;
    }
    res.cookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    res.json({ ok: true, data: { user: { id: row.id, email: row.email, name: row.username, role: row.role || "user" } } });
  } catch (e) {
    console.error(e);
    const msg = (e && e.message) || "";
    if (msg.includes("DATABASE_URL")) {
      res.status(503).json({ ok: false, error: "Database not configured" });
      return;
    }
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`AutoChord backend running on ${port}`);
  if (!process.env.AUTH_SECRET) {
    console.log("AUTH_SECRET not set");
  }
});
