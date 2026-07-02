"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryLabel, categorySlug } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import { BOOKMARKS_CHANGED_EVENT, getBookmarks, removeBookmark, type SavedArticle } from "@/lib/bookmarks";

export default function SavedPage() {
  const [items, setItems] = useState<SavedArticle[]>([]);

  useEffect(() => {
    const load = () => setItems(getBookmarks());
    load();
    window.addEventListener(BOOKMARKS_CHANGED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(BOOKMARKS_CHANGED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
        <span className="inline-block h-7 w-2 shrink-0 bg-breaking" aria-hidden="true" />
        <h1 className="headline-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
          Saved
        </h1>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 border border-dashed border-line bg-card px-6 py-16 text-center text-ink-muted">
          <span className="block font-bold text-ink">No saved stories</span>
          <span className="mt-1 block text-sm">
            Tap the bookmark icon on any story to save it here for later.
          </span>
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 border-b border-line pb-3 last:border-0">
              <div className="flex-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-breaking">
                  {categoryLabel(item.category)}
                </span>
                <Link
                  href={`/${categorySlug(item.category)}/${item.slug}`}
                  className="block headline-en text-lg font-bold leading-snug text-ink hover:text-breaking"
                >
                  {item.title}
                </Link>
                <time className="mt-1 block text-xs text-ink-muted">
                  {formatDate(item.published_at)}
                </time>
              </div>
              <button
                type="button"
                onClick={() => removeBookmark(item.id)}
                className="shrink-0 border border-line px-2.5 py-1 text-xs font-semibold text-ink-muted hover:border-breaking hover:text-breaking"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
