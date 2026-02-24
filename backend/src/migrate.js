import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "..", "..", "database", "migrations");

const loadMigrations = async () => {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();
};

const main = async () => {
  if (!pool) {
    console.log("DATABASE_URL not set");
    process.exit(1);
  }

  await pool.query(
    "create table if not exists schema_migrations (id text primary key, applied_at timestamptz default now())"
  );

  const applied = await pool.query("select id from schema_migrations");
  const appliedSet = new Set(applied.rows.map((row) => row.id));
  const migrations = await loadMigrations();

  for (const file of migrations) {
    if (appliedSet.has(file)) {
      continue;
    }
    const fullPath = path.join(migrationsDir, file);
    const sql = await fs.readFile(fullPath, "utf8");
    await pool.query("begin");
    try {
      await pool.query(sql);
      await pool.query("insert into schema_migrations (id) values ($1)", [file]);
      await pool.query("commit");
      console.log(`Applied ${file}`);
    } catch (error) {
      await pool.query("rollback");
      console.error(error);
      process.exit(1);
    }
  }

  await pool.end();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
