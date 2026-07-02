"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";
import ArticleCard from "./ArticleCard";

interface Props {
  mode: "category" | "tag" | "latest";
  value?: string;
  initialOffset: number;
  initialHasMore: boolean;
}

export default function LoadMore({ mode, value, initialOffset, initialHasMore }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ mode, offset: String(offset) });
      if (value) params.set("value", value);
      const res = await fetch(`/api/articles?${params.toString()}`);
      const data: { articles: Article[]; hasMore: boolean } = await res.json();
      setArticles((prev) => [...prev, ...data.articles]);
      setOffset((prev) => prev + data.articles.length);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {articles.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="border border-line px-6 py-2 text-sm font-bold uppercase tracking-wide text-ink hover:border-breaking hover:text-breaking disabled:opacity-50"
          >
            {loading ? "…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
