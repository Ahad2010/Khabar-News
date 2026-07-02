import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getArticlesByStatus } from "@/lib/admin";
import { categorySlug } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import { deleteArticleAction, unpublishArticleAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPublishedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const articles = await getArticlesByStatus("published", query);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Published ({articles.length})</h1>
        <form className="flex items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search titles…"
            className="rounded border border-slate-300 px-3 py-1.5 text-sm"
          />
          <button className="rounded bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700">
            Search
          </button>
        </form>
      </div>

      {articles.length === 0 && (
        <p className="mt-6 rounded border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          {query ? `No published articles match "${query}".` : "Nothing published yet."}
        </p>
      )}

      <div className="mt-4 flex flex-col divide-y divide-slate-200 rounded border border-slate-300 bg-white">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{article.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {article.category ?? "uncategorized"} · Published{" "}
                {formatDate(article.published_at)}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <a
                href={`/${categorySlug(article.category)}/${article.slug}`}
                target="_blank"
                className="rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
              >
                View ↗
              </a>
              <Link
                href={`/admin/${article.id}`}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
              >
                Edit
              </Link>
              <form action={unpublishArticleAction}>
                <input type="hidden" name="id" value={article.id} />
                <button className="rounded border border-amber-400 px-3 py-1.5 text-sm font-semibold text-amber-700 hover:bg-amber-50">
                  Unpublish
                </button>
              </form>
              <form action={deleteArticleAction}>
                <input type="hidden" name="id" value={article.id} />
                <button className="rounded border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
