import { getRecentForNewsSitemap } from "@/lib/articles";
import { categorySlug } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Google News sitemap: only articles published in the last 48 hours, with
 * <news:news> metadata. Submit alongside the regular sitemap in Search Console.
 */
export async function GET() {
  const rows = await getRecentForNewsSitemap();

  const entries = rows
    .map((row) => {
      const url = `${SITE_URL}/${categorySlug(row.category)}/${row.slug}`;
      return `  <url>
    <loc>${escapeXml(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${row.published_at}</news:publication_date>
      <news:title>${escapeXml(row.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
