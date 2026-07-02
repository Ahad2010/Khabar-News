export default function EmptyState() {
  return (
    <div className="border border-dashed border-line bg-card px-6 py-16 text-center">
      <p className="headline-en text-xl font-bold text-ink">No stories yet</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        Our newsroom publishes a handful of carefully verified stories each day. Check back
        shortly.
      </p>
    </div>
  );
}
