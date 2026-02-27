import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Client } = pg;

fileURLToPath(import.meta.url);

async function run() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("DATABASE_URL not set; skipping migrations");
    process.exit(0);
  }
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query(
    "create table if not exists schema_migrations (id serial primary key, name text unique not null, applied_at timestamptz default now())"
  );
  const dir = path.join(process.cwd(), "database", "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const name = file;
    const exists = await client.query(
      "select 1 from schema_migrations where name = $1",
      [name]
    );
    if (exists.rows.length) continue;
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    if (!sql.trim()) continue;
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query(
        "insert into schema_migrations (name) values ($1)",
        [name]
      );
      await client.query("commit");
      console.log("Applied", name);
    } catch (e) {
      await client.query("rollback");
      console.error("Failed", name, e.message);
      process.exit(1);
    }
  }
  await client.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
