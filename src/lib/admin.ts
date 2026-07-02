import pool from "./db";
import type { Article, ArticleStatus } from "./types";

const FIELDS = `id, raw_news_id, title, slug, body, meta_description,
  category, tags, risk_level, status, source_attribution,
  created_at, published_at, reviewed_by`;

// Admin manages the English site only; legacy rows in other languages stay hidden.
const LANG = `language = 'en'`;

export interface AdminStats {
  pending: number;
  published: number;
  rejected: number;
  publishedToday: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { rows } = await pool.query<{
    pending: number;
    published: number;
    rejected: number;
    published_today: number;
  }>(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
       COUNT(*) FILTER (WHERE status = 'published')::int AS published,
       COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected,
       COUNT(*) FILTER (WHERE status = 'published'
         AND published_at >= date_trunc('day', NOW() AT TIME ZONE 'Asia/Karachi') AT TIME ZONE 'Asia/Karachi')::int
         AS published_today
     FROM articles
     WHERE ${LANG}`,
  );
  const row = rows[0];
  return {
    pending: row?.pending ?? 0,
    published: row?.published ?? 0,
    rejected: row?.rejected ?? 0,
    publishedToday: row?.published_today ?? 0,
  };
}

export async function getArticlesByStatus(
  status: ArticleStatus,
  query = "",
  limit = 100,
): Promise<Article[]> {
  const orderBy =
    status === "published" ? "published_at DESC NULLS LAST" : "created_at DESC";
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${LANG} AND status = $1
       AND ($2 = '' OR title ILIKE '%' || $2 || '%')
     ORDER BY ${orderBy}
     LIMIT $3`,
    [status, query, limit],
  );
  return rows;
}

/** Unlike the public getArticleBySlug, this ignores status — admins need to see pending/rejected rows too. */
export async function getArticleByIdForAdmin(id: number): Promise<Article | null> {
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 FROM articles WHERE ${LANG} AND slug = $1 AND ($2::int IS NULL OR id != $2) LIMIT 1`,
    [slug, excludeId ?? null],
  );
  return rows.length > 0;
}
