import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminStats, getArticlesByStatus } from "@/lib/admin";
import { excerpt, formatDate } from "@/lib/format";
import { approveArticleAction, rejectArticleAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [stats, pending] = await Promise.all([
    getAdminStats(),
    getArticlesByStatus("pending"),
  ]);

  const cards = [
    { label: "Pending review", value: stats.pending, href: "/admin" },
    { label: "Published", value: stats.published, href: "/admin/published" },
    { label: "Published today", value: stats.publishedToday, href: "/admin/published" },
    { label: "Rejected", value: stats.rejected, href: "/admin/rejected" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded border border-slate-300 bg-white p-4 hover:border-slate-400"
          >
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-bold">Pending review ({pending.length})</h2>
      <p className="mt-1 text-sm text-slate-500">
        Nothing publishes automatically. Approve, edit, or reject each item below.
      </p>

      {pending.length === 0 && (
        <p className="mt-4 rounded border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          Queue is empty — no articles awaiting review.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {pending.map((article) => (
          <div key={article.id} className="rounded border border-slate-300 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase">
                {article.category ?? "uncategorized"}
              </span>
              {article.risk_level === "high" && (
                <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
                  High risk — review carefully
                </span>
              )}
              <span className="ml-auto text-xs text-slate-400">
                {formatDate(article.created_at)}
              </span>
            </div>

            <h3 className="mt-2 text-lg font-semibold">{article.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{excerpt(article.body)}</p>
            {article.source_attribution && (
              <p className="mt-1 text-xs italic text-slate-500">{article.source_attribution}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <form action={approveArticleAction}>
                <input type="hidden" name="id" value={article.id} />
                <button className="rounded bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800">
                  Approve &amp; Publish
                </button>
              </form>
              <Link
                href={`/admin/${article.id}`}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
              >
                Edit
              </Link>
              <form action={rejectArticleAction}>
                <input type="hidden" name="id" value={article.id} />
                <button className="rounded border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
