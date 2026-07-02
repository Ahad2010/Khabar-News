"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "khabar:article-font-scale";
const STEPS = [0.9, 1, 1.15, 1.3];

export default function FontSizeControl({ label }: { label: string }) {
  const [stepIndex, setStepIndex] = useState(1);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    const index = STEPS.indexOf(stored);
    if (index >= 0) {
      // Restores the reader's saved preference from localStorage after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStepIndex(index);
      document.documentElement.style.setProperty("--article-font-scale", String(STEPS[index]));
    }
  }, []);

  function setIndex(next: number) {
    const clamped = Math.min(STEPS.length - 1, Math.max(0, next));
    setStepIndex(clamped);
    document.documentElement.style.setProperty("--article-font-scale", String(STEPS[clamped]));
    localStorage.setItem(STORAGE_KEY, String(STEPS[clamped]));
  }

  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => setIndex(stepIndex - 1)}
        disabled={stepIndex === 0}
        aria-label="Decrease text size"
        className="flex h-6 w-6 items-center justify-center border border-line text-ink hover:border-breaking hover:text-breaking disabled:opacity-40"
      >
        −
      </button>
      <button
        type="button"
        onClick={() => setIndex(stepIndex + 1)}
        disabled={stepIndex === STEPS.length - 1}
        aria-label="Increase text size"
        className="flex h-6 w-6 items-center justify-center border border-line text-ink hover:border-breaking hover:text-breaking disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
