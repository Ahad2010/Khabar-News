import type { MetadataRoute } from "next";
import { getAllPublishedForSitemap, getCategoryCounts } from "@/lib/articles";
import { categorySlug } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rows, categories] = await Promise.all([
    getAllPublishedForSitemap(),
    getCategoryCounts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/${categorySlug(c.category)}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = rows.map((row) => ({
    url: `${SITE_URL}/${categorySlug(row.category)}/${row.slug}`,
    lastModified: row.published_at ?? undefined,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
