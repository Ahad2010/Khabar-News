import Link from "next/link";
import Image from "next/image";
import type { CategoryCount } from "@/lib/types";
import { categoryLabel, categorySlug } from "@/lib/categories";
import { SITE_NAME } from "@/lib/site";
import MegaMenu from "./MegaMenu";
import SearchBox from "./SearchBox";
import ThemeToggle from "./ThemeToggle";

interface Props {
  categories: CategoryCount[];
}

export default function Header({ categories }: Props) {
  const primary = categories.slice(0, 9);

  return (
    <header className="sticky top-0 z-30 bg-brand-dark text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-4 px-4 py-1.5 text-xs">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            <MegaMenu categories={categories} />
          </div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-header.png"
              alt={SITE_NAME}
              width={631}
              height={540}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/saved"
            aria-label="Saved stories"
            title="Saved stories"
            className="flex items-center text-white hover:text-signal"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
            </svg>
          </Link>
          <SearchBox placeholder="Search" />
        </div>
      </div>
      <nav className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 py-2.5 text-sm font-bold">
          <Link href="/" className="shrink-0 text-white hover:text-signal">
            Home
          </Link>
          {primary.map((c) => (
            <Link
              key={c.category}
              href={`/${categorySlug(c.category)}`}
              className="shrink-0 text-white/80 hover:text-signal"
            >
              {categoryLabel(c.category)}
            </Link>
          ))}
        </div>
      </nav>
      <div className="signature-stripe" />
    </header>
  );
}
