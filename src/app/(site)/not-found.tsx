import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-xs font-extrabold uppercase tracking-wider text-breaking">404</p>
      <h1 className="headline-display mt-2 text-4xl font-extrabold text-ink">
        Page not found
      </h1>
      <p className="mt-3 text-ink-muted">
        The story you&apos;re looking for may have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block border border-line px-6 py-2 text-sm font-bold uppercase tracking-wide text-ink hover:border-breaking hover:text-breaking"
      >
        Back to homepage
      </Link>
    </div>
  );
}
