import Link from "next/link";
import type { Article } from "@/lib/types";
import { categoryLabel, categorySlug } from "@/lib/categories";
import { formatDate } from "@/lib/format";
import BookmarkButton from "./BookmarkButton";

interface Props {
  article: Article;
  variant?: "hero" | "default" | "compact";
}

export default function ArticleCard({ article, variant = "default" }: Props) {
  const href = `/${categorySlug(article.category)}/${article.slug}`;
  const label = categoryLabel(article.category);

  if (variant === "hero") {
    return (
      <article className="card-hover border-b-2 border-ink pb-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-breaking">
            {label}
          </span>
          <BookmarkButton article={article} label="Save" className="text-ink-muted hover:text-breaking" />
        </div>
        <h1 className="headline-display mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          <Link href={href} className="card-headline-link">
            {article.title}
          </Link>
        </h1>
        {article.meta_description && (
          <p className="mt-3 max-w-2xl text-lg leading-snug text-ink-muted">
            {article.meta_description}
          </p>
        )}
        <time
          className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          dateTime={article.published_at ?? undefined}
        >
          {formatDate(article.published_at)}
        </time>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="flex gap-3 border-b border-line py-3 last:border-0">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-breaking" />
        <div>
          <Link href={href} className="font-semibold text-ink hover:text-breaking">
            {article.title}
          </Link>
          <time className="mt-1 block text-xs text-ink-muted" dateTime={article.published_at ?? undefined}>
            {formatDate(article.published_at)}
          </time>
        </div>
      </article>
    );
  }

  return (
    <article className="card-hover flex h-full flex-col border-t-2 border-line pt-3">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-breaking">
            {label}
          </span>
          <BookmarkButton article={article} label="Save" className="text-ink-muted hover:text-breaking" />
        </div>
        <h2 className="headline-en mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-ink">
          <Link href={href} className="card-headline-link">
            {article.title}
          </Link>
        </h2>
        {article.meta_description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{article.meta_description}</p>
        )}
        <time
          className="mt-auto pt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted"
          dateTime={article.published_at ?? undefined}
        >
          {formatDate(article.published_at)}
        </time>
      </div>
    </article>
  );
}
