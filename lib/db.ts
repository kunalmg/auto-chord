import pg, { QueryResult } from "pg";

const { Pool } = pg as unknown as { Pool: typeof import("pg").Pool };

let pool: import("pg").Pool | null = null;

export function getPool() {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  pool = new Pool({ connectionString: url });
  return pool;
}

export async function query<T = unknown>(sql: string, params: readonly unknown[] = []): Promise<QueryResult<T>> {
  const p = getPool();
  if (!p) throw new Error("DATABASE_URL not set");
  const res = await p.query<T>(sql, params as readonly unknown[]);
  return res;
}
