import "dotenv/config";
import express from "express";
import { pool } from "./db.js";
const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/status", async (req, res) => {
  if (!pool) {
    res.json({ status: "ok", database: "not_configured" });
    return;
  }
  try {
    const result = await pool.query("select now()");
    res.json({ status: "ok", database: "connected", now: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", database: "failed" });
  }
});

app.get("/api/songs", async (req, res) => {
  if (!pool) {
    res.status(503).json({ status: "error", message: "database not configured" });
    return;
  }
  try {
    const result = await pool.query(
      "select id, title, artist, created_at from songs order by id desc"
    );
    res.json({ status: "ok", data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error" });
  }
});

app.get("/api/songs/:id", async (req, res) => {
  if (!pool) {
    res.status(503).json({ status: "error", message: "database not configured" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ status: "error", message: "invalid id" });
    return;
  }
  try {
    const result = await pool.query(
      "select id, title, artist, created_at from songs where id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ status: "error", message: "not found" });
      return;
    }
    res.json({ status: "ok", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error" });
  }
});

app.post("/api/songs", async (req, res) => {
  if (!pool) {
    res.status(503).json({ status: "error", message: "database not configured" });
    return;
  }
  const { title, artist } = req.body ?? {};
  if (!title || typeof title !== "string") {
    res.status(400).json({ status: "error", message: "title is required" });
    return;
  }
  try {
    const result = await pool.query(
      "insert into songs (title, artist) values ($1, $2) returning id, title, artist, created_at",
      [title, typeof artist === "string" ? artist : null]
    );
    res.status(201).json({ status: "ok", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error" });
  }
});

app.listen(port, () => {
  console.log(`AutoChord backend running on ${port}`);
});
