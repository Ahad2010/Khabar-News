export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="headline-en flex items-center gap-2.5 border-b-2 border-ink pb-2.5 text-xl font-extrabold tracking-tight text-ink">
      <span className="inline-block h-4 w-1.5 shrink-0 bg-breaking" aria-hidden="true" />
      {children}
    </h2>
  );
}
