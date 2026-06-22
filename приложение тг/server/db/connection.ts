import pg from "pg";
import { env } from "../config/env.js";
import { memoryDb } from "./memory.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool | null {
  if (env.USE_MEMORY_DB) return null;
  if (!pool) {
    pool = new Pool({ connectionString: env.DATABASE_URL });
  }
  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  if (env.USE_MEMORY_DB) {
    return memoryDb.query(text, params) as Promise<pg.QueryResult<T>>;
  }
  const p = getPool()!;
  return p.query<T>(text, params);
}

export async function initDb(): Promise<void> {
  if (env.USE_MEMORY_DB) {
    console.log("📦 Using in-memory database (set DATABASE_URL for PostgreSQL)");
    memoryDb.seed();
    return;
  }
  const p = getPool()!;
  const fs = await import("fs");
  const path = await import("path");
  const { fileURLToPath } = await import("url");
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await p.query(schema);
  console.log("✅ PostgreSQL schema initialized");
}
