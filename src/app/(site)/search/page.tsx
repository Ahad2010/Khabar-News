import type { Metadata } from "next";
import { searchArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const articles = query ? await searchArticles(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
        <span className="inline-block h-7 w-2 shrink-0 bg-breaking" aria-hidden="true" />
        <h1 className="headline-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
          Search{query ? `: "${query}"` : ""}
        </h1>
      </div>
      {articles.length === 0 ? (
        <div className="mt-6">
          {query ? (
            <p className="border border-dashed border-line bg-card px-6 py-16 text-center text-ink-muted">
              No results found
            </p>
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      )}
    </div>
  );
}
