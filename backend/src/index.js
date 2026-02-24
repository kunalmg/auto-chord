import "dotenv/config";
import express from "express";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  pool
    .connect()
    .then((client) => {
      client.release();
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Database connection failed");
      console.error(error);
    });
} else {
  console.log("DATABASE_URL not set");
}

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

app.listen(port, () => {
  console.log(`AutoChord backend running on ${port}`);
});
