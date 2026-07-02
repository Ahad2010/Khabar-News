import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getArticleByIdForAdmin } from "@/lib/admin";
import { categorySlug, CATEGORY_META } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import {
  deleteArticleAction,
  rejectArticleAction,
  saveAndPublishAction,
  saveArticleAction,
  unpublishArticleAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) notFound();

  const article = await getArticleByIdForAdmin(articleId);
  if (!article) notFound();

  const categories = Object.keys(CATEGORY_META).filter((key) => key !== "tech");
  const publicUrl = `/${categorySlug(article.category)}/${article.slug}`;

  return (
    <div>
      <Link href="/admin" className="text-sm text-slate-500 hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold">Edit article #{article.id}</h1>
        <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold uppercase">
          {article.status}
        </span>
        {article.risk_level === "high" && (
          <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
            High risk
          </span>
        )}
        {article.status === "published" && (
          <a href={publicUrl} target="_blank" className="text-sm font-semibold text-blue-700 hover:underline">
            View live ↗
          </a>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">
        <div>
          <dt className="font-semibold">Story ID</dt>
          <dd>{article.raw_news_id ?? "manual"}</dd>
        </div>
        <div>
          <dt className="font-semibold">Created</dt>
          <dd>{formatDate(article.created_at)}</dd>
        </div>
        <div>
          <dt className="font-semibold">Published</dt>
          <dd>{article.published_at ? formatDate(article.published_at) : "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold">Source</dt>
          <dd className="truncate">{article.source_attribution ?? "—"}</dd>
        </div>
      </dl>

      <form action={saveArticleAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="id" value={article.id} />

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Title</span>
          <input
            name="title"
            defaultValue={article.title}
            required
            className="rounded border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Slug (changing it changes the URL)</span>
            <input
              name="slug"
              defaultValue={article.slug}
              className="rounded border border-slate-300 px-3 py-2 font-mono text-sm"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Category</span>
            <select
              name="category"
              defaultValue={categorySlug(article.category)}
              className="rounded border border-slate-300 px-3 py-2"
            >
              {categories.map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_META[key].label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Tags (comma separated)</span>
          <input
            name="tags"
            defaultValue={(article.tags ?? []).join(", ")}
            className="rounded border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Meta description (SEO, ~155 chars)</span>
          <textarea
            name="meta_description"
            defaultValue={article.meta_description ?? ""}
            rows={2}
            className="rounded border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Body (HTML)</span>
          <textarea
            name="body"
            defaultValue={article.body}
            rows={18}
            className="rounded border border-slate-300 px-3 py-2 font-mono text-sm"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
          <button
            type="submit"
            className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Save
          </button>
          {article.status !== "published" && (
            <button
              type="submit"
              formAction={saveAndPublishAction}
              className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Save &amp; Publish
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
        {article.status === "published" && (
          <form action={unpublishArticleAction}>
            <input type="hidden" name="id" value={article.id} />
            <button className="rounded border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">
              Unpublish (back to pending)
            </button>
          </form>
        )}
        {article.status !== "rejected" && (
          <form action={rejectArticleAction}>
            <input type="hidden" name="id" value={article.id} />
            <input type="hidden" name="redirectTo" value="/admin" />
            <button className="rounded border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
              Reject
            </button>
          </form>
        )}
        <form action={deleteArticleAction}>
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="redirectTo" value="/admin" />
          <button className="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
            Delete permanently
          </button>
        </form>
      </div>
    </div>
  );
}
