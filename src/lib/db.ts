import { Pool, types } from "pg";

// articles.created_at/published_at are TIMESTAMP (no tz) columns, stored as
// UTC instants by convention. pg parses these into JS Date objects by
// default, but our Article type treats them as ISO strings (used directly in
// <time dateTime> and OpenGraph publishedTime, which require ISO 8601, not
// Date#toString() or Postgres's "YYYY-MM-DD HH:MM:SS" text).
types.setTypeParser(types.builtins.TIMESTAMP, (value) => new Date(`${value.replace(" ", "T")}Z`).toISOString());
types.setTypeParser(types.builtins.TIMESTAMPTZ, (value) => new Date(value).toISOString());

declare global {
  var _pgPool: Pool | undefined;
}

// Reuse the pool across hot reloads in dev so we don't exhaust Neon's
// connection limit; in production each server instance gets its own pool.
const pool =
  globalThis._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._pgPool = pool;
}

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

export default pool;
