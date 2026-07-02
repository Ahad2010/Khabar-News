import { NextRequest, NextResponse } from "next/server";
import { getArticlesByCategory, getArticlesByTag, getLatestArticles } from "@/lib/articles";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("mode") ?? "latest";
  const value = params.get("value") ?? "";
  const offset = Math.max(0, Number(params.get("offset") ?? "0") || 0);

  let articles;
  if (mode === "category" && value) {
    articles = await getArticlesByCategory(value, PAGE_SIZE + 1, offset);
  } else if (mode === "tag" && value) {
    articles = await getArticlesByTag(value, PAGE_SIZE + 1, offset);
  } else {
    articles = await getLatestArticles(PAGE_SIZE + 1, offset);
  }

  const hasMore = articles.length > PAGE_SIZE;
  return NextResponse.json({ articles: articles.slice(0, PAGE_SIZE), hasMore });
}
