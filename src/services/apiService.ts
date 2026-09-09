import { Article, SufiSaint, HeritageSite, PoemVerse, PhotoGalleryItem } from '../types';
import { CmsUser, CmsCategoryItem, KashmiriCultureItem, FolkloreStory, SiteSettings, ActivityLog, Advertisement, Sponsor } from '../types/cms';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}:`, err);
    return null;
  }
}

export class ApiService {
  // Articles
  static async getArticles(): Promise<Article[]> {
    const data = await fetchJson<Article[]>(`${BASE_URL}/articles`);
    return data || [];
  }

  static async saveArticle(article: Article): Promise<Article> {
    const res = await fetchJson<Article>(`${BASE_URL}/articles`, {
      method: 'POST',
      body: JSON.stringify(article)
    });
    return res || article;
  }

  static async deleteArticle(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/articles/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  static async clearAllArticles(): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/articles`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Saints
  static async getSaints(): Promise<SufiSaint[]> {
    const data = await fetchJson<SufiSaint[]>(`${BASE_URL}/saints`);
    return data || [];
  }

  static async saveSaint(saint: SufiSaint): Promise<SufiSaint> {
    const res = await fetchJson<SufiSaint>(`${BASE_URL}/saints`, {
      method: 'POST',
      body: JSON.stringify(saint)
    });
    return res || saint;
  }

  static async deleteSaint(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/saints/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Heritage Sites
  static async getHeritageSites(): Promise<HeritageSite[]> {
    const data = await fetchJson<HeritageSite[]>(`${BASE_URL}/sites`);
    return data || [];
  }

  static async getSites(): Promise<HeritageSite[]> {
    return this.getHeritageSites();
  }

  static async saveHeritageSite(site: HeritageSite): Promise<HeritageSite> {
    const res = await fetchJson<HeritageSite>(`${BASE_URL}/sites`, {
      method: 'POST',
      body: JSON.stringify(site)
    });
    return res || site;
  }

  static async saveSite(site: HeritageSite): Promise<HeritageSite> {
    return this.saveHeritageSite(site);
  }

  static async deleteHeritageSite(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/sites/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  static async deleteSite(id: string): Promise<boolean> {
    return this.deleteHeritageSite(id);
  }

  // Poems
  static async getPoems(): Promise<PoemVerse[]> {
    const data = await fetchJson<PoemVerse[]>(`${BASE_URL}/poems`);
    return data || [];
  }

  static async savePoem(poem: PoemVerse): Promise<PoemVerse> {
    const res = await fetchJson<PoemVerse>(`${BASE_URL}/poems`, {
      method: 'POST',
      body: JSON.stringify(poem)
    });
    return res || poem;
  }

  static async deletePoem(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/poems/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Photos
  static async getPhotos(): Promise<PhotoGalleryItem[]> {
    const data = await fetchJson<PhotoGalleryItem[]>(`${BASE_URL}/photos`);
    return data || [];
  }

  static async savePhoto(photo: PhotoGalleryItem): Promise<PhotoGalleryItem> {
    const res = await fetchJson<PhotoGalleryItem>(`${BASE_URL}/photos`, {
      method: 'POST',
      body: JSON.stringify(photo)
    });
    return res || photo;
  }

  static async deletePhoto(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/photos/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Culture
  static async getCultureItems(): Promise<KashmiriCultureItem[]> {
    const data = await fetchJson<KashmiriCultureItem[]>(`${BASE_URL}/culture`);
    return data || [];
  }

  static async saveCultureItem(item: KashmiriCultureItem): Promise<KashmiriCultureItem> {
    const res = await fetchJson<KashmiriCultureItem>(`${BASE_URL}/culture`, {
      method: 'POST',
      body: JSON.stringify(item)
    });
    return res || item;
  }

  static async deleteCultureItem(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/culture/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Folklore
  static async getFolkloreStories(): Promise<FolkloreStory[]> {
    const data = await fetchJson<FolkloreStory[]>(`${BASE_URL}/folklore`);
    return data || [];
  }

  static async saveFolkloreStory(story: FolkloreStory): Promise<FolkloreStory> {
    const res = await fetchJson<FolkloreStory>(`${BASE_URL}/folklore`, {
      method: 'POST',
      body: JSON.stringify(story)
    });
    return res || story;
  }

  static async deleteFolkloreStory(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/folklore/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Categories
  static async getCategories(): Promise<CmsCategoryItem[]> {
    const data = await fetchJson<CmsCategoryItem[]>(`${BASE_URL}/categories`);
    return data || [];
  }

  static async saveCategory(category: CmsCategoryItem): Promise<CmsCategoryItem> {
    const res = await fetchJson<CmsCategoryItem>(`${BASE_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(category)
    });
    return res || category;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Users
  static async getUsers(): Promise<CmsUser[]> {
    const data = await fetchJson<CmsUser[]>(`${BASE_URL}/users`);
    return data || [];
  }

  static async saveUser(user: CmsUser): Promise<CmsUser> {
    const res = await fetchJson<CmsUser>(`${BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(user)
    });
    return res || user;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Advertisements
  static async getAdvertisements(): Promise<Advertisement[]> {
    const data = await fetchJson<Advertisement[]>(`${BASE_URL}/ads`);
    return data || [];
  }

  static async saveAdvertisement(ad: Advertisement): Promise<Advertisement> {
    const res = await fetchJson<Advertisement>(`${BASE_URL}/ads`, {
      method: 'POST',
      body: JSON.stringify(ad)
    });
    return res || ad;
  }

  static async deleteAdvertisement(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/ads/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Sponsors
  static async getSponsors(): Promise<Sponsor[]> {
    const data = await fetchJson<Sponsor[]>(`${BASE_URL}/sponsors`);
    return data || [];
  }

  static async saveSponsor(sponsor: Sponsor): Promise<Sponsor> {
    const res = await fetchJson<Sponsor>(`${BASE_URL}/sponsors`, {
      method: 'POST',
      body: JSON.stringify(sponsor)
    });
    return res || sponsor;
  }

  static async deleteSponsor(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/sponsors/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return Boolean(res?.success);
  }

  // Settings
  static async getSettings(): Promise<SiteSettings | null> {
    return await fetchJson<SiteSettings>(`${BASE_URL}/settings`);
  }

  static async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    const res = await fetchJson<SiteSettings>(`${BASE_URL}/settings`, {
      method: 'POST',
      body: JSON.stringify(settings)
    });
    return res || settings;
  }

  // Logs
  static async getLogs(): Promise<ActivityLog[]> {
    const data = await fetchJson<ActivityLog[]>(`${BASE_URL}/logs`);
    return data || [];
  }

  static async logActivity(user: string, action: string, target: string, badgeType: string = 'update') {
    await fetchJson(`${BASE_URL}/logs`, {
      method: 'POST',
      body: JSON.stringify({ user, action, target, badgeType })
    });
  }

  // Clear All
  static async clearAll(): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${BASE_URL}/clear-all`, {
      method: 'POST'
    });
    return Boolean(res?.success);
  }
}
