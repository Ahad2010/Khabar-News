import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/articles";
import { categoryLabel, isKnownCategory } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import LoadMore from "@/components/LoadMore";

export const revalidate = 300;

const PAGE_SIZE = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isKnownCategory(category)) return {};
  const label = categoryLabel(category);
  return {
    title: `${label} News`,
    description: `The latest ${label.toLowerCase()} news, headlines and analysis from ${SITE_NAME}.`,
    alternates: { canonical: `${SITE_URL}/${category.toLowerCase()}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const fetched = await getArticlesByCategory(category, PAGE_SIZE + 1);
  // Unknown segment with no matching articles -> real 404, not an empty page.
  if (fetched.length === 0 && !isKnownCategory(category)) notFound();

  const articles = fetched.slice(0, PAGE_SIZE);
  const hasMore = fetched.length > PAGE_SIZE;
  const label = categoryLabel(category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
        <span className="inline-block h-7 w-2 shrink-0 bg-breaking" aria-hidden="true" />
        <h1 className="headline-display text-4xl font-extrabold leading-none text-ink sm:text-5xl">
          {label}
        </h1>
      </div>
      {articles.length === 0 ? (
        <div className="mt-6">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>
          <LoadMore
            mode="category"
            value={category}
            initialOffset={PAGE_SIZE}
            initialHasMore={hasMore}
          />
        </>
      )}
    </div>
  );
}
