import pool from "./db";
import type { Article, CategoryCount, NewsSitemapRow, SitemapRow } from "./types";

const FIELDS = `id, raw_news_id, title, slug, body, meta_description,
  category, tags, risk_level, status, source_attribution,
  created_at, published_at, reviewed_by`;

// The site is English-only; the pipeline only writes language = 'en' rows,
// and this filter keeps any legacy rows in other languages off the site.
const PUBLISHED = `status = 'published' AND language = 'en'`;

export async function getBreakingArticles(limit = 5): Promise<Article[]> {
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${PUBLISHED}
     ORDER BY published_at DESC NULLS LAST
     LIMIT $1`,
    [limit],
  );
  return rows;
}

export async function getLatestArticles(limit = 20, offset = 0): Promise<Article[]> {
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${PUBLISHED}
     ORDER BY published_at DESC NULLS LAST
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return rows;
}

export async function getArticlesByCategory(
  category: string,
  limit = 30,
  offset = 0,
): Promise<Article[]> {
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${PUBLISHED} AND category = $1
     ORDER BY published_at DESC NULLS LAST
     LIMIT $2 OFFSET $3`,
    [category, limit, offset],
  );
  return rows;
}

export async function getArticlesByTag(
  tag: string,
  limit = 30,
  offset = 0,
): Promise<Article[]> {
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${PUBLISHED} AND $1 = ANY(tags)
     ORDER BY published_at DESC NULLS LAST
     LIMIT $2 OFFSET $3`,
    [tag, limit, offset],
  );
  return rows;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${PUBLISHED} AND slug = $1
     LIMIT 1`,
    [slug],
  );
  return rows[0] ?? null;
}

export async function getRelatedArticles(
  category: string | null,
  excludeId: number,
  limit = 4,
): Promise<Article[]> {
  if (!category) return [];
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${PUBLISHED} AND category = $1 AND id != $2
     ORDER BY published_at DESC NULLS LAST
     LIMIT $3`,
    [category, excludeId, limit],
  );
  return rows;
}

export async function searchArticles(query: string, limit = 30): Promise<Article[]> {
  const { rows } = await pool.query<Article>(
    `SELECT ${FIELDS} FROM articles
     WHERE ${PUBLISHED}
       AND (title ILIKE $1 OR meta_description ILIKE $1)
     ORDER BY published_at DESC NULLS LAST
     LIMIT $2`,
    [`%${query}%`, limit],
  );
  return rows;
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const { rows } = await pool.query<CategoryCount>(
    `SELECT category, COUNT(*)::int AS count FROM articles
     WHERE ${PUBLISHED} AND category IS NOT NULL
     GROUP BY category
     ORDER BY count DESC, category ASC`,
  );
  return rows;
}

export async function getAllPublishedForSitemap(): Promise<SitemapRow[]> {
  const { rows } = await pool.query<SitemapRow>(
    `SELECT slug, category, published_at FROM articles
     WHERE ${PUBLISHED}
     ORDER BY published_at DESC NULLS LAST`,
  );
  return rows;
}

/** Articles from the last 48 hours — the window Google News sitemaps care about. */
export async function getRecentForNewsSitemap(): Promise<NewsSitemapRow[]> {
  const { rows } = await pool.query<NewsSitemapRow>(
    `SELECT title, slug, category, published_at FROM articles
     WHERE ${PUBLISHED} AND published_at >= NOW() - INTERVAL '48 hours'
     ORDER BY published_at DESC
     LIMIT 1000`,
  );
  return rows;
}
