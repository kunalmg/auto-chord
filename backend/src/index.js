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
function verifyToken(token) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  const expected = base64url(crypto.createHmac("sha256", secret).update(payloadB64).digest("base64"));
  if (expected !== sigB64) return null;
  try {
    const json = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/") + "==", "base64").toString("utf8");
    const payload = JSON.parse(json);
    return payload;
  } catch {
    return null;
  }
}
function getCookie(req, name) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(name + "=")) return decodeURIComponent(p.slice(name.length + 1));
  }
  return undefined;
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
    const session = getCookie(req, "session");
    const payload = verifyToken(session);
    const all = payload && payload.r === "admin" && String(req.query.all || "") === "1";
    const where = all ? "" : " where owner_id = $1 ";
    const params = all ? [] : [payload?.id ?? -1];
    const sql =
      "select id, title, artist, created_at, updated_at, key_scale, difficulty, genre, owner_id from songs" +
      where +
      "order by coalesce(updated_at, created_at) desc";
    const result = await pool.query(sql, params);
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
      `select id, title, artist, key_scale as key, capo, difficulty, tempo, tuning, genre, tags,
              description, strumming_pattern, chord_progression, body as sheet_body,
              created_at, updated_at, owner_id
       from songs where id = $1`,
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
  const session = getCookie(req, "session");
  const payload = verifyToken(session);
  if (!payload || !payload.id) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  const body = req.body ?? null;
  if (!body) {
    res.status(400).json({ ok: false, error: "Invalid JSON" });
    return;
  }
  const title = String(body.title || "").trim();
  const artist = body.artist ? String(body.artist).trim() : null;
  const sheet = body.body ? String(body.body) : null;
  const fields = {
    key_scale: body.key_scale ? String(body.key_scale) : null,
    capo: body.capo !== undefined ? Number(body.capo) : null,
    difficulty: body.difficulty ? String(body.difficulty) : null,
    tempo: body.tempo !== undefined ? Number(body.tempo) : null,
    strumming_pattern: body.strumming_pattern ? String(body.strumming_pattern) : null,
    tuning: body.tuning ? String(body.tuning) : null,
    genre: body.genre ? String(body.genre) : null,
    tags: Array.isArray(body.tags) ? body.tags.map((t) => String(t)) : null,
    description: body.description ? String(body.description) : null,
    chord_progression: body.chord_progression ? String(body.chord_progression) : null,
    youtube_link: body.youtube_link ? String(body.youtube_link) : null,
    reference_link: body.reference_link ? String(body.reference_link) : null,
    formatted: body.formatted ? String(body.formatted) : null,
    release_date: body.release_date ? String(body.release_date) : null,
  };
  if (!title) {
    res.status(400).json({ ok: false, error: "Title is required" });
    return;
  }
  try {
    const dup = await pool.query(
      "select id from songs where lower(title) = lower($1) and coalesce(lower(artist),'') = coalesce(lower($2),'') and owner_id = $3",
      [title, artist, payload.id]
    );
    if (dup.rows.length) {
      res.status(409).json({ ok: false, error: "Sheet already exists" });
      return;
    }
    const result = await pool.query(
      `insert into songs (title, artist, body, key_scale, capo, difficulty, tempo, strumming_pattern, tuning, genre, tags, description, chord_progression, youtube_link, reference_link, formatted, release_date, updated_at, owner_id)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, now(), $18)
       returning id, title, artist, body, created_at`,
      [
        title,
        artist,
        sheet,
        fields.key_scale,
        fields.capo,
        fields.difficulty,
        fields.tempo,
        fields.strumming_pattern,
        fields.tuning,
        fields.genre,
        fields.tags,
        fields.description,
        fields.chord_progression,
        fields.youtube_link,
        fields.reference_link,
        fields.formatted,
        fields.release_date,
        payload.id ?? null,
      ]
    );
    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    const msg = (error && error.message) || "";
    console.error(error);
    if (msg.includes("songs_title_artist_uniq") || msg.includes("duplicate key")) {
      res.status(409).json({ ok: false, error: "Sheet already exists" });
      return;
    }
    if (msg.includes("owner_id")) {
      res.status(503).json({ ok: false, error: "Database not configured" });
      return;
    }
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

app.delete("/api/songs/:id", async (req, res) => {
  if (!pool) {
    res.status(503).json({ ok: false, error: "Database not configured" });
    return;
  }
  const session = getCookie(req, "session");
  const payload = verifyToken(session);
  if (!payload) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ ok: false, error: "Invalid id" });
    return;
  }
  try {
    const exists = await pool.query("select id, owner_id from songs where id = $1", [id]);
    if (!exists.rows.length) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    const ownerId = exists.rows[0].owner_id;
    if (payload.r === "admin" || (payload.id && payload.id === ownerId)) {
      await pool.query("delete from songs where id = $1", [id]);
      res.json({ ok: true, data: { id } });
      return;
    }
    res.status(403).json({ ok: false, error: "You can only delete your own sheet." });
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

app.post("/api/auth/signup", async (req, res) => {
  try {
    const body = req.body ?? null;
    if (!body) {
      res.status(400).json({ ok: false, error: "Invalid JSON" });
      return;
    }
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!name || !email || !password) {
      res.status(400).json({ ok: false, error: "Name, email and password are required" });
      return;
    }
    if (!pool) {
      res.status(503).json({ ok: false, error: "Database not configured" });
      return;
    }
    const dup = await pool.query("select id from users where email = $1", [email]);
    if (dup.rows.length) {
      res.status(409).json({ ok: false, error: "Email already registered" });
      return;
    }
    // scrypt hashing (consistent with existing project)
    const salt = crypto.randomBytes(16);
    const N = 16384, r = 8, p = 1, keylen = 64;
    const derived = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, keylen, { N, r, p }, (err, buf) => {
        if (err) reject(err);
        else resolve(buf);
      });
    });
    const password_hash = `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${Buffer.from(derived).toString("hex")}`;
    await pool.query(
      `create table if not exists users (
        id serial primary key,
        email text not null unique,
        username text not null,
        password_hash text not null,
        role text default 'user',
        created_at timestamptz default now()
      )`
    );
    const result = await pool.query(
      "insert into users (email, username, password_hash, role) values ($1, $2, $3, $4) returning id, email, username, role",
      [email, name, password_hash, "user"]
    );
    res.status(201).json({ ok: true, data: { user: { id: result.rows[0].id, email: result.rows[0].email, name, role: result.rows[0].role } } });
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
