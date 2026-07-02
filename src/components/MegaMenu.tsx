"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CategoryCount } from "@/lib/types";
import { categoryLabel, categorySlug } from "@/lib/categories";

interface Props {
  categories: CategoryCount[];
}

export default function MegaMenu({ categories }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Menu"
        className="flex shrink-0 items-center gap-2 text-white"
      >
        <span className="flex h-4 w-5 flex-col justify-between" aria-hidden="true">
          <span className="block h-[2px] w-full bg-white" />
          <span className="block h-[2px] w-full bg-white" />
          <span className="block h-[2px] w-full bg-white" />
        </span>
        <span className="hidden text-sm font-bold uppercase tracking-wide sm:inline">
          Menu
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-full max-w-sm flex-col overflow-y-auto bg-brand-dark p-6 text-white shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="self-end text-2xl leading-none text-white/70 hover:text-white"
            >
              &times;
            </button>
            <nav className="mt-4 flex flex-col gap-1 text-lg font-bold">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 hover:text-signal"
              >
                Home
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.category}
                  href={`/${categorySlug(c.category)}`}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/10 py-3 hover:text-signal"
                >
                  {categoryLabel(c.category)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
