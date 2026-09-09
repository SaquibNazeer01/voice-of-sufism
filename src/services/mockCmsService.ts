import { Article, SufiSaint, PoemVerse, HeritageSite, PhotoGalleryItem } from '../types';
import { CmsUser, CmsCategoryItem, CmsTagItem, KashmiriCultureItem, FolkloreStory, SiteSettings, ActivityLog, Advertisement, Sponsor } from '../types/cms';

// Initial Active Admin Users
const INITIAL_USERS: CmsUser[] = [
  {
    id: 'admin-sahil',
    name: 'Sahil Amin',
    email: 'saahilahbhat1@gmail.com',
    role: 'Super Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    contributionsCount: 28,
    lastLogin: 'Active Now',
    districtLocation: 'Srinagar'
  },
  {
    id: 'admin-saakib',
    name: 'Saquib Nazeer',
    email: 'bhatsaakib505@gmail.com',
    role: 'Super Admin',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    contributionsCount: 14,
    lastLogin: 'Active Now',
    districtLocation: 'Srinagar'
  }
];

// Initial Categories
const INITIAL_CATEGORIES: CmsCategoryItem[] = [
  { id: 'cat-1', name: 'Sufi Saints', slug: 'sufi-saints', description: 'Biographies, orders, and spiritual teachings of Kashmir Sufis & Reshis', itemCount: 0, colorBadge: 'bg-[#0F4C3A] text-amber-300' },
  { id: 'cat-2', name: 'Sacred Shrines', slug: 'sacred-shrines', description: 'Architectural surveys, ziyarats, khanqahs and pilgrimage maps', itemCount: 0, colorBadge: 'bg-emerald-800 text-white' },
  { id: 'cat-3', name: 'Language & Poetry', slug: 'language-poetry', description: 'Vakhs of Lal Ded, Shruks of Sheikh-ul-Alam, and classic Koshur verse', itemCount: 0, colorBadge: 'bg-amber-600 text-white' },
  { id: 'cat-4', name: 'Architecture & Heritage', slug: 'architecture-heritage', description: 'Wooden pagodas, papier-mâché ceilings, khatamband ceilings, and stone masonry', itemCount: 0, colorBadge: 'bg-stone-800 text-amber-200' },
  { id: 'cat-5', name: 'Culture & Folklore', slug: 'culture-folklore', description: 'Oral folk stories, elder legends, and traditional Valley customs', itemCount: 0, colorBadge: 'bg-teal-800 text-white' },
  { id: 'cat-6', name: 'Crafts & Traditions', slug: 'crafts-traditions', description: 'Pashmina weaving, Kani shawls, copperware (tuntun), and wood carving', itemCount: 0, colorBadge: 'bg-indigo-900 text-amber-200' },
];

// Initial Site Settings
const INITIAL_SETTINGS: SiteSettings = {
  siteTitle: 'Voice of Sufism (صداۓ تصوف)',
  urduTitle: 'صداۓ تصوف - کشمیری روایات',
  tagline: 'Documenting Kashmir’s Sufi Shrines, Reshi Culture & Mystical Poetry',
  metaDescription: 'A dedicated digital archive preserving Kashmir’s centuries-old Sufi saints, wooden shrine architecture, Vakhs, Shruks, and oral folk history.',
  contactEmail: 'contact@voiceofsufism.org',
  editorialBoard: 'Kashmir Cultural Heritage Research Cell, Srinagar',
  maintenanceMode: false,
  enableAmbientAudio: true,
  allowPublicSubmissions: false,
  requireEditorialReview: false,
  itemsPerPage: 12,
  apiBackendStatus: 'Mock Storage (Active)',
  storageEndpoint: 'Voice of Sufism Engine',
  lastBackupDate: new Date().toISOString()
};

const delay = (ms: number = 50) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockCmsService {
  private static STORAGE_PREFIX = 'voice_sufism_cms_';
  private static IS_CLEANSED = false;

  // Automatically purge legacy dummy data from browser localStorage once
  private static ensureCleanStorage() {
    if (this.IS_CLEANSED || typeof window === 'undefined' || !window.localStorage) return;
    try {
      const storedArticles = localStorage.getItem(this.STORAGE_PREFIX + 'articles');
      if (storedArticles && (storedArticles.includes('The Light of Kashmir') || storedArticles.includes('nund-reshi-legacy') || storedArticles.includes('Peerzada Tariq Ahmad'))) {
        console.log('🧹 Cleansing legacy mock dummy data from browser storage...');
        localStorage.removeItem(this.STORAGE_PREFIX + 'articles');
        localStorage.removeItem(this.STORAGE_PREFIX + 'saints');
        localStorage.removeItem(this.STORAGE_PREFIX + 'sites');
        localStorage.removeItem(this.STORAGE_PREFIX + 'poems');
        localStorage.removeItem(this.STORAGE_PREFIX + 'photos');
        localStorage.removeItem(this.STORAGE_PREFIX + 'culture');
        localStorage.removeItem(this.STORAGE_PREFIX + 'folklore');
        localStorage.removeItem(this.STORAGE_PREFIX + 'logs');
      }
      this.IS_CLEANSED = true;
    } catch {
      this.IS_CLEANSED = true;
    }
  }

  // LocalStorage generic getters/setters
  private static getItem<T>(key: string, defaultValue: T): T {
    this.ensureCleanStorage();
    try {
      const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }

  // Log activity helper
  static async logActivity(user: string, action: string, target: string, badgeType: ActivityLog['badgeType']) {
    const logs = this.getItem<ActivityLog[]>('logs', []);
    const exactTimestamp = new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      user,
      action,
      target,
      timestamp: exactTimestamp,
      badgeType
    };
    const updated = [newLog, ...logs.slice(0, 99)];
    this.setItem('logs', updated);
  }

  // --- ARTICLES CRUD ---
  static async getArticles(): Promise<Article[]> {
    await delay();
    return this.getItem<Article[]>('articles', []);
  }

  static async saveArticle(article: Article): Promise<Article> {
    await delay();
    const articles = await this.getArticles();
    const existingIndex = articles.findIndex(a => a.id === article.id);
    let updated: Article[];
    if (existingIndex >= 0) {
      updated = [...articles];
      updated[existingIndex] = article;
      await this.logActivity('Admin User', 'Updated Article', article.title, 'update');
    } else {
      updated = [article, ...articles];
      await this.logActivity('Admin User', 'Created New Article', article.title, 'create');
    }
    this.setItem('articles', updated);
    return article;
  }

  static async deleteArticle(id: string): Promise<boolean> {
    await delay();
    const articles = await this.getArticles();
    const target = articles.find(a => a.id === id);
    const filtered = articles.filter(a => a.id !== id);
    this.setItem('articles', filtered);
    if (target) {
      await this.logActivity('Admin User', 'Deleted Article', target.title, 'delete');
    }
    return true;
  }

  static async clearAllArticles(): Promise<boolean> {
    this.setItem('articles', []);
    return true;
  }

  // --- SAINTS CRUD ---
  static async getSaints(): Promise<SufiSaint[]> {
    await delay();
    return this.getItem<SufiSaint[]>('saints', []);
  }

  static async saveSaint(saint: SufiSaint): Promise<SufiSaint> {
    await delay();
    const saints = await this.getSaints();
    const idx = saints.findIndex(s => s.id === saint.id);
    let updated: SufiSaint[];
    if (idx >= 0) {
      updated = [...saints];
      updated[idx] = saint;
      await this.logActivity('Admin User', 'Updated Saint Profile', saint.name, 'update');
    } else {
      updated = [saint, ...saints];
      await this.logActivity('Admin User', 'Added Sufi Saint', saint.name, 'create');
    }
    this.setItem('saints', updated);
    return saint;
  }

  static async deleteSaint(id: string): Promise<boolean> {
    await delay();
    const saints = await this.getSaints();
    const target = saints.find(s => s.id === id);
    const filtered = saints.filter(s => s.id !== id);
    this.setItem('saints', filtered);
    if (target) {
      await this.logActivity('Admin User', 'Deleted Saint Record', target.name, 'delete');
    }
    return true;
  }

  // --- HERITAGE SITES CRUD ---
  static async getSites(): Promise<HeritageSite[]> {
    await delay();
    return this.getItem<HeritageSite[]>('sites', []);
  }

  static async getHeritageSites(): Promise<HeritageSite[]> {
    return this.getSites();
  }

  static async saveSite(site: HeritageSite): Promise<HeritageSite> {
    await delay();
    const sites = await this.getSites();
    const idx = sites.findIndex(s => s.id === site.id);
    let updated: HeritageSite[];
    if (idx >= 0) {
      updated = [...sites];
      updated[idx] = site;
      await this.logActivity('Admin User', 'Updated Shrine / Site', site.name, 'update');
    } else {
      updated = [site, ...sites];
      await this.logActivity('Admin User', 'Added Sacred Shrine', site.name, 'create');
    }
    this.setItem('sites', updated);
    return site;
  }

  static async saveHeritageSite(site: HeritageSite): Promise<HeritageSite> {
    return this.saveSite(site);
  }

  static async deleteSite(id: string): Promise<boolean> {
    await delay();
    const sites = await this.getSites();
    const target = sites.find(s => s.id === id);
    const filtered = sites.filter(s => s.id !== id);
    this.setItem('sites', filtered);
    if (target) {
      await this.logActivity('Admin User', 'Deleted Shrine Record', target.name, 'delete');
    }
    return true;
  }

  static async deleteHeritageSite(id: string): Promise<boolean> {
    return this.deleteSite(id);
  }

  // --- POEMS CRUD ---
  static async getPoems(): Promise<PoemVerse[]> {
    await delay();
    return this.getItem<PoemVerse[]>('poems', []);
  }

  static async savePoem(poem: PoemVerse): Promise<PoemVerse> {
    await delay();
    const poems = await this.getPoems();
    const idx = poems.findIndex(p => p.id === poem.id);
    let updated: PoemVerse[];
    if (idx >= 0) {
      updated = [...poems];
      updated[idx] = poem;
      await this.logActivity('Admin User', 'Updated Poetry Verse', poem.title, 'update');
    } else {
      updated = [poem, ...poems];
      await this.logActivity('Admin User', 'Added Poetry Verse', poem.title, 'create');
    }
    this.setItem('poems', updated);
    return poem;
  }

  static async deletePoem(id: string): Promise<boolean> {
    await delay();
    const poems = await this.getPoems();
    const target = poems.find(p => p.id === id);
    const filtered = poems.filter(p => p.id !== id);
    this.setItem('poems', filtered);
    if (target) {
      await this.logActivity('Admin User', 'Deleted Verse Record', target.title, 'delete');
    }
    return true;
  }

  // --- PHOTOS CRUD ---
  static async getPhotos(): Promise<PhotoGalleryItem[]> {
    await delay();
    return this.getItem<PhotoGalleryItem[]>('photos', []);
  }

  static async savePhoto(photo: PhotoGalleryItem): Promise<PhotoGalleryItem> {
    await delay();
    const photos = await this.getPhotos();
    const idx = photos.findIndex(p => p.id === photo.id);
    let updated: PhotoGalleryItem[];
    if (idx >= 0) {
      updated = [...photos];
      updated[idx] = photo;
      await this.logActivity('Admin User', 'Updated Archival Photo', photo.title, 'update');
    } else {
      updated = [photo, ...photos];
      await this.logActivity('Admin User', 'Added Archival Photo', photo.title, 'create');
    }
    this.setItem('photos', updated);
    return photo;
  }

  static async deletePhoto(id: string): Promise<boolean> {
    await delay();
    const photos = await this.getPhotos();
    const target = photos.find(p => p.id === id);
    const filtered = photos.filter(p => p.id !== id);
    this.setItem('photos', filtered);
    if (target) {
      await this.logActivity('Admin User', 'Deleted Photo Record', target.title, 'delete');
    }
    return true;
  }

  // --- CULTURE & FOLKLORE ---
  static async getCultureItems(): Promise<KashmiriCultureItem[]> {
    await delay();
    return this.getItem<KashmiriCultureItem[]>('culture', []);
  }

  static async saveCultureItem(item: KashmiriCultureItem): Promise<KashmiriCultureItem> {
    await delay();
    const list = await this.getCultureItems();
    const idx = list.findIndex(c => c.id === item.id);
    let updated: KashmiriCultureItem[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = item;
    } else {
      updated = [item, ...list];
    }
    this.setItem('culture', updated);
    return item;
  }

  static async deleteCultureItem(id: string): Promise<boolean> {
    await delay();
    const list = await this.getCultureItems();
    this.setItem('culture', list.filter(c => c.id !== id));
    return true;
  }

  static async getFolkloreStories(): Promise<FolkloreStory[]> {
    await delay();
    return this.getItem<FolkloreStory[]>('folklore', []);
  }

  static async saveFolkloreStory(story: FolkloreStory): Promise<FolkloreStory> {
    await delay();
    const list = await this.getFolkloreStories();
    const idx = list.findIndex(f => f.id === story.id);
    let updated: FolkloreStory[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = story;
    } else {
      updated = [story, ...list];
    }
    this.setItem('folklore', updated);
    return story;
  }

  static async deleteFolkloreStory(id: string): Promise<boolean> {
    await delay();
    const list = await this.getFolkloreStories();
    this.setItem('folklore', list.filter(f => f.id !== id));
    return true;
  }

  // --- CATEGORIES CRUD ---
  static async getCategories(): Promise<CmsCategoryItem[]> {
    await delay();
    return this.getItem<CmsCategoryItem[]>('categories', INITIAL_CATEGORIES);
  }

  static async saveCategory(category: CmsCategoryItem): Promise<CmsCategoryItem> {
    await delay();
    const categories = await this.getCategories();
    const idx = categories.findIndex(c => c.id === category.id);
    let updated: CmsCategoryItem[];
    if (idx >= 0) {
      updated = [...categories];
      updated[idx] = category;
    } else {
      updated = [category, ...categories];
    }
    this.setItem('categories', updated);
    return category;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    await delay();
    const categories = await this.getCategories();
    this.setItem('categories', categories.filter(c => c.id !== id));
    return true;
  }

  // --- USERS CRUD ---
  static async getUsers(): Promise<CmsUser[]> {
    await delay();
    return this.getItem<CmsUser[]>('users', INITIAL_USERS);
  }

  static async saveUser(user: CmsUser): Promise<CmsUser> {
    await delay();
    const users = await this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    let updated: CmsUser[];
    if (idx >= 0) {
      updated = [...users];
      updated[idx] = user;
    } else {
      updated = [user, ...users];
    }
    this.setItem('users', updated);
    return user;
  }

  static async deleteUser(id: string): Promise<boolean> {
    await delay();
    const users = await this.getUsers();
    this.setItem('users', users.filter(u => u.id !== id));
    return true;
  }

  // --- SETTINGS CRUD ---
  static async getSettings(): Promise<SiteSettings> {
    await delay();
    return this.getItem<SiteSettings>('settings', INITIAL_SETTINGS);
  }

  static async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    await delay();
    this.setItem('settings', settings);
    return settings;
  }

  // --- LOGS ---
  static async getLogs(): Promise<ActivityLog[]> {
    await delay();
    return this.getItem<ActivityLog[]>('logs', []);
  }

  static async getActivityLogs(): Promise<ActivityLog[]> {
    return this.getLogs();
  }

  // --- ADVERTISEMENTS CRUD ---
  static async getAdvertisements(): Promise<Advertisement[]> {
    await delay();
    return this.getItem<Advertisement[]>('ads', []);
  }

  static async saveAdvertisement(ad: Advertisement): Promise<Advertisement> {
    await delay();
    const ads = await this.getAdvertisements();
    const idx = ads.findIndex(a => a.id === ad.id);
    let updated: Advertisement[];
    if (idx >= 0) {
      updated = [...ads];
      updated[idx] = ad;
      await this.logActivity('Admin User', 'Updated Advertisement', ad.title, 'update');
    } else {
      updated = [ad, ...ads];
      await this.logActivity('Admin User', 'Created Advertisement', ad.title, 'create');
    }
    this.setItem('ads', updated);
    return ad;
  }

  static async deleteAdvertisement(id: string): Promise<boolean> {
    await delay();
    const ads = await this.getAdvertisements();
    const target = ads.find(a => a.id === id);
    const filtered = ads.filter(a => a.id !== id);
    this.setItem('ads', filtered);
    if (target) {
      await this.logActivity('Admin User', 'Deleted Advertisement', target.title, 'delete');
    }
    return true;
  }

  // --- SPONSORS CRUD ---
  static async getSponsors(): Promise<Sponsor[]> {
    await delay();
    return this.getItem<Sponsor[]>('sponsors', []);
  }

  static async saveSponsor(sponsor: Sponsor): Promise<Sponsor> {
    await delay();
    const list = await this.getSponsors();
    const idx = list.findIndex(s => s.id === sponsor.id);
    let updated: Sponsor[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = sponsor;
      await this.logActivity('Admin User', 'Updated Sponsor', sponsor.name, 'update');
    } else {
      updated = [sponsor, ...list];
      await this.logActivity('Admin User', 'Added Sponsor', sponsor.name, 'create');
    }
    this.setItem('sponsors', updated);
    return sponsor;
  }

  static async deleteSponsor(id: string): Promise<boolean> {
    await delay();
    const list = await this.getSponsors();
    const target = list.find(s => s.id === id);
    const filtered = list.filter(s => s.id !== id);
    this.setItem('sponsors', filtered);
    if (target) {
      await this.logActivity('Admin User', 'Deleted Sponsor', target.name, 'delete');
    }
    return true;
  }

  // --- PURGE ALL CACHE ---
  static purgeAll() {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + 'articles');
      localStorage.removeItem(this.STORAGE_PREFIX + 'saints');
      localStorage.removeItem(this.STORAGE_PREFIX + 'sites');
      localStorage.removeItem(this.STORAGE_PREFIX + 'poems');
      localStorage.removeItem(this.STORAGE_PREFIX + 'photos');
      localStorage.removeItem(this.STORAGE_PREFIX + 'culture');
      localStorage.removeItem(this.STORAGE_PREFIX + 'folklore');
      localStorage.removeItem(this.STORAGE_PREFIX + 'ads');
      localStorage.removeItem(this.STORAGE_PREFIX + 'sponsors');
      localStorage.removeItem(this.STORAGE_PREFIX + 'logs');
      localStorage.removeItem('voice_of_sufism_bookmarks');
    } catch (e) {
      console.error('Purge error', e);
    }
  }
}
