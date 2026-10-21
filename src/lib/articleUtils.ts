import { Article } from '../types';

/**
 * Extracts a numeric timestamp from an article using its createdAt, updatedAt,
 * published date, or timestamp encoded in the ID.
 */
export function getArticleTimestamp(article: Partial<Article> | any): number {
  if (!article) return 0;

  // 1. Check createdAt ISO string
  if (article.createdAt) {
    const t = new Date(article.createdAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  // 2. Check updatedAt ISO string
  if (article.updatedAt) {
    const t = new Date(article.updatedAt).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  // 3. Check published date (handles 'October 21, 2026', '2026-10-21', etc.)
  if (article.date) {
    const t = new Date(article.date).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  // 4. Extract numeric epoch milliseconds from ID (e.g. art-1789030636147)
  const digits = String(article.id || '').replace(/\D/g, '');
  if (digits.length >= 10) {
    const t = parseInt(digits.substring(0, 13), 10);
    if (!isNaN(t) && t > 0) return t;
  }

  return 0;
}

/**
 * Sorts articles with the newest articles appearing at the top.
 */
export function sortArticlesNewestFirst<T extends Partial<Article>>(articles: T[]): T[] {
  return [...articles].sort((a, b) => {
    const scoreA = getArticleTimestamp(a);
    const scoreB = getArticleTimestamp(b);
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // descending: newest first
    }
    return String(b.id || '').localeCompare(String(a.id || ''));
  });
}
