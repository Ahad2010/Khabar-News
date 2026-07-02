import type { Article } from "./types";
import { categoryLabel, categorySlug } from "./categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

export function articleUrl(article: Pick<Article, "category" | "slug">): string {
  return `${SITE_URL}/${categorySlug(article.category)}/${article.slug}`;
}

function publisher() {
  return {
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  };
}

/**
 * NewsArticle JSON-LD — built fresh at render time (never from stale stored
 * schema) so URLs, publisher and dates always match what's actually served.
 * The `speakable` block marks the headline + summary for voice assistants (AEO).
 */
export function newsArticleJsonLd(article: Article) {
  const url = articleUrl(article);
  const published = article.published_at ?? article.created_at;
  const words = article.body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.meta_description ?? undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: published,
    dateModified: published,
    inLanguage: "en",
    articleSection: categoryLabel(article.category),
    keywords: article.tags?.length ? article.tags.join(", ") : undefined,
    wordCount: words.length,
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: `${SITE_NAME} Editorial Team`, url: SITE_URL },
    publisher: publisher(),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-summary"],
    },
  };
}

export function breadcrumbJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel(article.category),
        item: `${SITE_URL}/${categorySlug(article.category)}`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl(article) },
    ],
  };
}

/** WebSite schema with a SearchAction — enables the sitelinks search box. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: publisher(),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    ...publisher(),
    description: SITE_DESCRIPTION,
  };
}

/** ItemList of headlines for the homepage — helps answer engines pick up top stories. */
export function itemListJsonLd(articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: article.title,
      url: articleUrl(article),
    })),
  };
}

/** Renders a JSON-LD object for embedding in a <script type="application/ld+json">. */
export function jsonLdString(data: unknown): string {
  // "<" must be escaped so article titles can never break out of the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
