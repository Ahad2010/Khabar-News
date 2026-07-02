import type { Metadata } from "next";
import { getArticlesByTag } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import LoadMore from "@/components/LoadMore";

export const revalidate = 300;

const PAGE_SIZE = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Stories tagged "${decoded}" on ${SITE_NAME}.`,
    alternates: { canonical: `${SITE_URL}/tag/${encodeURIComponent(decoded)}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const fetched = await getArticlesByTag(decodedTag, PAGE_SIZE + 1);
  const articles = fetched.slice(0, PAGE_SIZE);
  const hasMore = fetched.length > PAGE_SIZE;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
        <span className="inline-block h-7 w-2 shrink-0 bg-breaking" aria-hidden="true" />
        <h1 className="headline-display text-4xl font-extrabold leading-none text-ink sm:text-5xl">
          #{decodedTag}
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
            mode="tag"
            value={decodedTag}
            initialOffset={PAGE_SIZE}
            initialHasMore={hasMore}
          />
        </>
      )}
    </div>
  );
}
