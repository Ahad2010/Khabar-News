import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { CATEGORY_META } from "@/lib/categories";
import { createAndPublishAction, createArticleAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminNewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const categories = Object.keys(CATEGORY_META).filter((key) => key !== "tech");

  return (
    <div>
      <Link href="/admin" className="text-sm text-slate-500 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 text-xl font-bold">New article</h1>
      <p className="mt-1 text-sm text-slate-500">
        Write an article by hand — it goes through the same pending/published flow as
        pipeline articles.
      </p>

      {error === "title" && (
        <p className="mt-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          A title is required.
        </p>
      )}

      <form action={createArticleAction} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Title</span>
          <input name="title" required className="rounded border border-slate-300 px-3 py-2" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Slug (optional — generated from title)</span>
            <input
              name="slug"
              placeholder="my-article-slug"
              className="rounded border border-slate-300 px-3 py-2 font-mono text-sm"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Category</span>
            <select name="category" defaultValue="general" className="rounded border border-slate-300 px-3 py-2">
              {categories.map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_META[key].label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Tags (comma separated)</span>
            <input name="tags" className="rounded border border-slate-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Source attribution (optional)</span>
            <input
              name="source_attribution"
              placeholder="Based on reporting from …"
              className="rounded border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Meta description (SEO, ~155 chars)</span>
          <textarea
            name="meta_description"
            rows={2}
            className="rounded border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold">Body (HTML — use &lt;p&gt; for paragraphs)</span>
          <textarea
            name="body"
            rows={16}
            className="rounded border border-slate-300 px-3 py-2 font-mono text-sm"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
          <button
            type="submit"
            className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Save as pending
          </button>
          <button
            type="submit"
            formAction={createAndPublishAction}
            className="rounded bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Publish now
          </button>
        </div>
      </form>
    </div>
  );
}
