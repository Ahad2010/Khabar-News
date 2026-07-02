import type { Metadata } from "next";
import { getLatestArticles } from "@/lib/articles";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import { itemListJsonLd, jsonLdString } from "@/lib/seo";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import SectionHeading from "@/components/SectionHeading";
import LoadMore from "@/components/LoadMore";

export const revalidate = 300;

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const fetched = await getLatestArticles(14);
  const articles = fetched.slice(0, 13);
  const hasMore = fetched.length > 13;

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <EmptyState />
      </div>
    );
  }

  const [lead, ...rest] = articles;
  const secondary = rest.slice(0, 2);
  const grid = rest.slice(2, 8);
  const sidebar = rest.slice(8, 13);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(itemListJsonLd(articles.slice(0, 10))) }}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ArticleCard article={lead} variant="hero" />
        </div>
        <div className="flex flex-col gap-4">
          {secondary.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      </div>

      {grid.length > 0 && (
        <section className="mt-12">
          <SectionHeading>Latest News</SectionHeading>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        </section>
      )}

      {sidebar.length > 0 && (
        <section className="mt-12 border border-line bg-card p-5">
          {sidebar.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </section>
      )}

      <LoadMore mode="latest" initialOffset={13} initialHasMore={hasMore} />
    </div>
  );
}
