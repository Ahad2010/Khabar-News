import Link from "next/link";
import type { CategoryCount } from "@/lib/types";
import { SITE_NAME, TAGLINE } from "@/lib/site";
import { categoryLabel, categorySlug } from "@/lib/categories";

interface Props {
  categories: CategoryCount[];
}

export default function Footer({ categories }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 bg-brand-dark text-white/70">
      <div className="signature-stripe" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 text-sm sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2.5">
            <span className="inline-block h-5 w-1.5 shrink-0 bg-breaking" aria-hidden="true" />
            <span className="headline-en text-lg font-extrabold tracking-tight text-white">
              {SITE_NAME}
            </span>
          </p>
          <p className="mt-3 max-w-xs text-white/60">{TAGLINE}</p>
        </div>

        {categories.length > 0 && (
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-white">
              Sections
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <li key={c.category}>
                  <Link href={`/${categorySlug(c.category)}`} className="hover:text-signal">
                    {categoryLabel(c.category)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-white">
            Quick Links
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link href="/" className="hover:text-signal">
                Home
              </Link>
            </li>
            <li>
              <Link href="/saved" className="hover:text-signal">
                Saved stories
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/45">
          © {year} {SITE_NAME}. Articles are AI-assisted and based on reporting from credited
          sources.
        </p>
      </div>
    </footer>
  );
}
