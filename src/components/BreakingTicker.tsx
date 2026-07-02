import Link from "next/link";
import type { Article } from "@/lib/types";
import { categorySlug } from "@/lib/categories";

interface Props {
  articles: Article[];
}

export default function BreakingTicker({ articles }: Props) {
  if (articles.length === 0) return null;
  const items = articles.slice(0, 5);
  const doubled = [...items, ...items];

  return (
    <div className="flex items-stretch bg-breaking">
      <span className="z-10 flex shrink-0 items-center gap-2 bg-ink px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white">
        <span className="live-dot inline-block h-2 w-2 rounded-full bg-breaking" aria-hidden="true" />
        Breaking
      </span>
      <div className="flex-1 overflow-hidden whitespace-nowrap py-2.5">
        <div className="ticker-track inline-flex w-max gap-12 ps-6">
          {doubled.map((article, i) => (
            <Link
              key={`${article.id}-${i}`}
              href={`/${categorySlug(article.category)}/${article.slug}`}
              className="text-sm font-bold text-white hover:underline"
            >
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
