"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/types";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

interface Props {
  article: Article;
  label: string;
  className?: string;
}

export default function BookmarkButton({ article, label, className = "" }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Bookmark state lives in localStorage, which only exists on the client;
    // syncing it after hydration is the intended pattern here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(isBookmarked(article.id));
  }, [article.id]);

  function handleClick() {
    const next = toggleBookmark({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category,
      meta_description: article.meta_description,
      published_at: article.published_at,
    });
    setSaved(next);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
      </svg>
    </button>
  );
}
