const STORAGE_KEY = "khabar:bookmarks";
export const BOOKMARKS_CHANGED_EVENT = "bookmarks-changed";

export interface SavedArticle {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  meta_description: string | null;
  published_at: string | null;
  savedAt: string;
}

function read(): SavedArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedArticle[]) : [];
  } catch {
    return [];
  }
}

function write(items: SavedArticle[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(BOOKMARKS_CHANGED_EVENT));
}

export function getBookmarks(): SavedArticle[] {
  return read();
}

export function isBookmarked(id: number): boolean {
  return read().some((item) => item.id === id);
}

export function addBookmark(article: Omit<SavedArticle, "savedAt">) {
  const items = read().filter((item) => item.id !== article.id);
  items.unshift({ ...article, savedAt: new Date().toISOString() });
  write(items);
}

export function removeBookmark(id: number) {
  write(read().filter((item) => item.id !== id));
}

export function toggleBookmark(article: Omit<SavedArticle, "savedAt">): boolean {
  if (isBookmarked(article.id)) {
    removeBookmark(article.id);
    return false;
  }
  addBookmark(article);
  return true;
}
