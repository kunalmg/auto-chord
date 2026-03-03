import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

const useSsl =
  String(process.env.PGSSL || "").toLowerCase() === "true" ||
  !!process.env.RENDER ||
  process.env.NODE_ENV === "production";
if (!connectionString) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}
const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

if (pool) {
  pool
    .connect()
    .then((client) => {
      client.release();
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Database connection failed");
      console.error(error);
      process.exit(1);
    });
}

export { pool };
