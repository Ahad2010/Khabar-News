export const DEFAULT_CATEGORY_KEY = "general";

/** category column value -> { display label, accent hex } */
export const CATEGORY_META: Record<string, { label: string; accent: string }> = {
  pakistan: { label: "Pakistan", accent: "#0F5C46" },
  world: { label: "World", accent: "#303B6B" },
  sports: { label: "Sports", accent: "#B5651D" },
  politics: { label: "Politics", accent: "#8A1F2E" },
  business: { label: "Business", accent: "#1F5C66" },
  technology: { label: "Technology", accent: "#34508C" },
  tech: { label: "Technology", accent: "#34508C" },
  entertainment: { label: "Entertainment", accent: "#6B3568" },
  science: { label: "Science", accent: "#1A6E73" },
  weather: { label: "Weather", accent: "#3E6E8E" },
  lifestyle: { label: "Lifestyle", accent: "#8C4A5E" },
  health: { label: "Health", accent: "#4A7A3A" },
  general: { label: "General", accent: "#555B63" },
};

export function categoryLabel(category: string | null): string {
  const key = (category || DEFAULT_CATEGORY_KEY).toLowerCase();
  return CATEGORY_META[key]?.label ?? category ?? CATEGORY_META.general.label;
}

export function categoryAccent(category: string | null): string {
  const key = (category || DEFAULT_CATEGORY_KEY).toLowerCase();
  return CATEGORY_META[key]?.accent ?? CATEGORY_META.general.accent;
}

export function categorySlug(category: string | null): string {
  return (category || DEFAULT_CATEGORY_KEY).toLowerCase();
}

export function isKnownCategory(value: string): boolean {
  return value.toLowerCase() in CATEGORY_META;
}
