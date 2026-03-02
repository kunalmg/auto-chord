import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

const useSsl =
  String(process.env.PGSSL || "").toLowerCase() === "true" ||
  !!process.env.RENDER ||
  process.env.NODE_ENV === "production";
const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    })
  : null;

if (pool) {
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

export { pool };
