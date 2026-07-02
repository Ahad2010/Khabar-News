"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
  placeholder: string;
}

export default function SearchBox({ placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={placeholder}
        className="flex shrink-0 items-center text-white hover:text-signal"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2">
      <input
        ref={inputRef}
        type="search"
        name="q"
        placeholder={placeholder}
        className="w-36 border-b border-white/40 bg-transparent py-1 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none sm:w-52"
        onBlur={(e) => {
          if (!e.currentTarget.value) setOpen(false);
        }}
      />
      <button type="submit" aria-label={placeholder} className="text-white hover:text-signal">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
