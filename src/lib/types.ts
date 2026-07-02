export type RiskLevel = "low" | "high";

export type ArticleStatus = "pending" | "published" | "rejected";

export interface Article {
  id: number;
  raw_news_id: number | null;
  title: string;
  slug: string;
  body: string;
  meta_description: string | null;
  category: string | null;
  tags: string[] | null;
  risk_level: RiskLevel;
  status: ArticleStatus;
  source_attribution: string | null;
  created_at: string;
  published_at: string | null;
  reviewed_by: string | null;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface SitemapRow {
  slug: string;
  category: string | null;
  published_at: string | null;
}

export interface NewsSitemapRow extends SitemapRow {
  title: string;
}
