import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getArticlesByStatus } from "@/lib/admin";
import { formatDate } from "@/lib/format";
import { deleteArticleAction, restoreArticleAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminRejectedPage() {
  await requireAdmin();
  const articles = await getArticlesByStatus("rejected");

  return (
    <div>
      <h1 className="text-2xl font-bold">Rejected ({articles.length})</h1>
      <p className="mt-1 text-sm text-slate-500">
        Restore sends an article back to the pending queue. Delete removes it permanently.
      </p>

      {articles.length === 0 && (
        <p className="mt-6 rounded border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          No rejected articles.
        </p>
      )}

      <div className="mt-4 flex flex-col divide-y divide-slate-200 rounded border border-slate-300 bg-white">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{article.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {article.category ?? "uncategorized"} · Created {formatDate(article.created_at)}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Link
                href={`/admin/${article.id}`}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
              >
                Edit
              </Link>
              <form action={restoreArticleAction}>
                <input type="hidden" name="id" value={article.id} />
                <button className="rounded border border-emerald-400 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                  Restore
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
