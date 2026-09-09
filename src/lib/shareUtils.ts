import { Article } from '../types';

/**
 * Converts an article title into a URL-safe slug.
 * e.g. "Charar-i-Sharief: The Eternal Flame" → "charar-i-sharief-the-eternal-flame"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric except spaces & hyphens
    .trim()
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .slice(0, 80);                   // cap at 80 chars
}

/**
 * Returns the full shareable URL for an article.
 * Uses the current origin + hash-based routing (#/article/<slug>)
 */
export function getArticleUrl(article: Article): string {
  const slug = generateSlug(article.title);
  const base = window.location.origin + window.location.pathname;
  return `${base}#/article/${slug}`;
}

/**
 * Returns share URLs for each supported platform.
 */
export interface ShareLinks {
  whatsapp: string;
  facebook: string;
  twitter: string;
  telegram: string;
  articleUrl: string;
}

export function getShareLinks(article: Article): ShareLinks {
  const articleUrl = getArticleUrl(article);
  const text = `${article.title} — Voice of Sufism Heritage Archive`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedText = encodeURIComponent(text);

  return {
    articleUrl,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&via=VoiceOfSufism`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };
}

/**
 * Finds an article by matching its generated slug.
 * Used when opening a shared link.
 */
export function findArticleBySlug(articles: Article[], slug: string): Article | null {
  return articles.find(a => generateSlug(a.title) === slug) ?? null;
}

/**
 * Parses the window.location.hash and returns an article slug if present.
 * e.g. "#/article/charar-i-sharief" → "charar-i-sharief"
 */
export function parseArticleSlugFromHash(hash: string): string | null {
  const match = hash.match(/^#\/article\/(.+)$/);
  return match ? match[1] : null;
}
