import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../lib/firebaseClient';
import { Article, SufiSaint, HeritageSite, PoemVerse, PhotoGalleryItem } from '../types';
import { CmsUser, CmsCategoryItem, KashmiriCultureItem, FolkloreStory, SiteSettings, ActivityLog, Advertisement, Sponsor } from '../types/cms';

export interface FirebaseHealthStatus {
  isConfigured: boolean;
  isConnected: boolean;
  canRead: boolean;
  canWrite: boolean;
  errorCode?: string;
  errorMessage?: string;
}

// Recursively remove undefined values, normalize arrays, and sanitize objects for Cloud Firestore
export function cleanForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj
      .filter(item => item !== undefined)
      .map(item => cleanForFirestore(item));
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = cleanForFirestore(value);
    }
  }
  return cleaned;
}

export class FirebaseService {
  static isAvailable(): boolean {
    return isFirebaseConfigured && db !== null;
  }

  // Safe setter that strips undefined fields and enforces document limits
  private static async safeSetDoc(docRef: any, rawData: any, options: { merge?: boolean } = { merge: true }): Promise<void> {
    const cleaned = cleanForFirestore(rawData);
    
    // Safety check for Firestore 1MB document limit
    try {
      const jsonStr = JSON.stringify(cleaned);
      const approxBytes = new Blob([jsonStr]).size;
      if (approxBytes > 950000) {
        console.warn(`[FirebaseService] Document is close to 1MB Firestore limit (${(approxBytes / 1024).toFixed(1)} KB)`);
      }
      if (approxBytes > 1048000) {
        throw new Error(`Record size (${(approxBytes / 1024).toFixed(0)} KB) exceeds Cloud Firestore's 1MB limit. Please reduce image sizes or upload fewer pictures.`);
      }
    } catch (e: any) {
      if (e?.message?.includes('Firestore')) throw e;
    }

    await setDoc(docRef, cleaned, options);
  }

  // Diagnostic health check for Cloud Firestore
  static async checkHealth(): Promise<FirebaseHealthStatus> {
    if (!this.isAvailable()) {
      return {
        isConfigured: false,
        isConnected: false,
        canRead: false,
        canWrite: false,
        errorCode: 'not-configured',
        errorMessage: 'Firebase credentials are missing from environment variables (VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID).'
      };
    }

    let canRead = false;
    let canWrite = false;
    let errorCode: string | undefined;
    let errorMessage: string | undefined;

    // Test Read
    try {
      await getDocs(query(collection(db!, 'articles')));
      canRead = true;
    } catch (err: any) {
      console.warn('Firebase health read check error:', err);
      errorCode = err?.code || 'read-failed';
      errorMessage = err?.message || 'Read access denied';
    }

    // Test Write (Probe document in _health_check collection)
    try {
      const probeRef = doc(db!, '_health_check', 'connection_probe');
      await setDoc(probeRef, {
        probeTime: new Date().toISOString(),
        status: 'ok'
      }, { merge: true });
      canWrite = true;
    } catch (err: any) {
      console.warn('Firebase health write check error:', err);
      if (!errorCode) errorCode = err?.code || 'write-failed';
      if (!errorMessage) errorMessage = err?.message || 'Write access denied';
    }

    return {
      isConfigured: true,
      isConnected: canRead || canWrite,
      canRead,
      canWrite,
      errorCode: canWrite ? undefined : errorCode,
      errorMessage: canWrite ? undefined : errorMessage
    };
  }

  // Storage Uploads
  static async uploadFile(file: File, folder: string = 'media'): Promise<string> {
    if (!this.isAvailable() || !storage) {
      return URL.createObjectURL(file);
    }
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (err: any) {
      console.error('Firebase Storage upload error:', err);
      throw new Error(`Firebase Storage Upload Failed: ${err?.message || 'Check storage rules.'}`);
    }
  }

  // 1. ARTICLES CRUD
  static async getArticles(): Promise<Article[]> {
    if (!this.isAvailable()) return [];
    try {
      const q = query(collection(db!, 'articles'));
      const snapshot = await getDocs(q);
      const items: Article[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      console.error('Firebase getArticles error:', err);
      return [];
    }
  }

  static async saveArticle(article: Article): Promise<Article> {
    if (!this.isAvailable()) return article;
    try {
      const id = article.id || `art-${Date.now()}`;
      const docRef = doc(db!, 'articles', id);

      // Clean and normalize galleryImages to strictly valid objects
      const normalizedGallery = Array.isArray(article.galleryImages)
        ? article.galleryImages
            .filter((item: any) => item && (typeof item === 'string' ? item.trim() : item.url?.trim()))
            .map((item: any) => typeof item === 'string' ? { url: item, caption: '' } : { url: item.url, caption: item.caption || '' })
        : [];

      const payload = {
        ...article,
        id,
        galleryImages: normalizedGallery,
        updatedAt: new Date().toISOString()
      };
      await this.safeSetDoc(docRef, payload);
      return payload as Article;
    } catch (err: any) {
      console.error('Firebase saveArticle error:', err);
      throw err;
    }
  }

  static async deleteArticle(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'articles', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteArticle error:', err);
      throw err;
    }
  }

  // 2. SUFI SAINTS CRUD
  static async getSaints(): Promise<SufiSaint[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'sufi_saints'));
      const items: SufiSaint[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      console.error('Firebase getSaints error:', err);
      return [];
    }
  }

  static async saveSaint(saint: SufiSaint): Promise<SufiSaint> {
    if (!this.isAvailable()) return saint;
    try {
      const id = saint.id || `saint-${Date.now()}`;
      const docRef = doc(db!, 'sufi_saints', id);
      const payload = { ...saint, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as SufiSaint;
    } catch (err: any) {
      console.error('Firebase saveSaint error:', err);
      throw err;
    }
  }

  static async deleteSaint(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'sufi_saints', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteSaint error:', err);
      throw err;
    }
  }

  // 3. HERITAGE SITES CRUD
  static async getSites(): Promise<HeritageSite[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'heritage_sites'));
      const items: HeritageSite[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveSite(site: HeritageSite): Promise<HeritageSite> {
    if (!this.isAvailable()) return site;
    try {
      const id = site.id || `site-${Date.now()}`;
      const docRef = doc(db!, 'heritage_sites', id);
      const payload = { ...site, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as HeritageSite;
    } catch (err: any) {
      console.error('Firebase saveSite error:', err);
      throw err;
    }
  }

  static async deleteSite(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'heritage_sites', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteSite error:', err);
      throw err;
    }
  }

  // 4. POEMS CRUD
  static async getPoems(): Promise<PoemVerse[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'poem_verses'));
      const items: PoemVerse[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async savePoem(poem: PoemVerse): Promise<PoemVerse> {
    if (!this.isAvailable()) return poem;
    try {
      const id = poem.id || `poem-${Date.now()}`;
      const docRef = doc(db!, 'poem_verses', id);
      const payload = { ...poem, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as PoemVerse;
    } catch (err: any) {
      console.error('Firebase savePoem error:', err);
      throw err;
    }
  }

  static async deletePoem(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'poem_verses', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deletePoem error:', err);
      throw err;
    }
  }

  // 5. PHOTOS CRUD
  static async getPhotos(): Promise<PhotoGalleryItem[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'photo_gallery'));
      const items: PhotoGalleryItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async savePhoto(photo: PhotoGalleryItem): Promise<PhotoGalleryItem> {
    if (!this.isAvailable()) return photo;
    try {
      const id = photo.id || `photo-${Date.now()}`;
      const docRef = doc(db!, 'photo_gallery', id);
      const payload = { ...photo, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as PhotoGalleryItem;
    } catch (err: any) {
      console.error('Firebase savePhoto error:', err);
      throw err;
    }
  }

  static async deletePhoto(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'photo_gallery', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deletePhoto error:', err);
      throw err;
    }
  }

  // 6. CULTURE ITEMS CRUD
  static async getCultureItems(): Promise<KashmiriCultureItem[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'culture_items'));
      const items: KashmiriCultureItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveCultureItem(item: KashmiriCultureItem): Promise<KashmiriCultureItem> {
    if (!this.isAvailable()) return item;
    try {
      const id = item.id || `cult-${Date.now()}`;
      const docRef = doc(db!, 'culture_items', id);
      const payload = { ...item, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as KashmiriCultureItem;
    } catch (err: any) {
      console.error('Firebase saveCultureItem error:', err);
      throw err;
    }
  }

  static async deleteCultureItem(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'culture_items', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteCultureItem error:', err);
      throw err;
    }
  }

  // 7. FOLKLORE STORIES CRUD
  static async getFolkloreStories(): Promise<FolkloreStory[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'folklore_stories'));
      const items: FolkloreStory[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveFolkloreStory(story: FolkloreStory): Promise<FolkloreStory> {
    if (!this.isAvailable()) return story;
    try {
      const id = story.id || `folk-${Date.now()}`;
      const docRef = doc(db!, 'folklore_stories', id);
      const payload = { ...story, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as FolkloreStory;
    } catch (err: any) {
      console.error('Firebase saveFolkloreStory error:', err);
      throw err;
    }
  }

  static async deleteFolkloreStory(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'folklore_stories', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteFolkloreStory error:', err);
      throw err;
    }
  }

  // 8. CATEGORIES CRUD
  static async getCategories(): Promise<CmsCategoryItem[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'cms_categories'));
      const items: CmsCategoryItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveCategory(cat: CmsCategoryItem): Promise<CmsCategoryItem> {
    if (!this.isAvailable()) return cat;
    try {
      const id = cat.id || `cat-${Date.now()}`;
      const docRef = doc(db!, 'cms_categories', id);
      const payload = { ...cat, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as CmsCategoryItem;
    } catch (err: any) {
      console.error('Firebase saveCategory error:', err);
      throw err;
    }
  }

  static async deleteCategory(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'cms_categories', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteCategory error:', err);
      throw err;
    }
  }

  // 9. USERS CRUD
  static async getUsers(): Promise<CmsUser[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'cms_users'));
      const items: CmsUser[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveUser(user: CmsUser): Promise<CmsUser> {
    if (!this.isAvailable()) return user;
    try {
      const id = user.id || `user-${Date.now()}`;
      const docRef = doc(db!, 'cms_users', id);
      const payload = { ...user, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as CmsUser;
    } catch (err: any) {
      console.error('Firebase saveUser error:', err);
      throw err;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'cms_users', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteUser error:', err);
      throw err;
    }
  }

  // 10. ADVERTISEMENTS CRUD
  static async getAdvertisements(): Promise<Advertisement[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'cms_advertisements'));
      const items: Advertisement[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveAdvertisement(ad: Advertisement): Promise<Advertisement> {
    if (!this.isAvailable()) return ad;
    try {
      const id = ad.id || `ad-${Date.now()}`;
      const docRef = doc(db!, 'cms_advertisements', id);
      const payload = { ...ad, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as Advertisement;
    } catch (err: any) {
      console.error('Firebase saveAdvertisement error:', err);
      throw err;
    }
  }

  static async deleteAdvertisement(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'cms_advertisements', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteAdvertisement error:', err);
      throw err;
    }
  }

  // 11. SPONSORS CRUD
  static async getSponsors(): Promise<Sponsor[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'cms_sponsors'));
      const items: Sponsor[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveSponsor(sponsor: Sponsor): Promise<Sponsor> {
    if (!this.isAvailable()) return sponsor;
    try {
      const id = sponsor.id || `spons-${Date.now()}`;
      const docRef = doc(db!, 'cms_sponsors', id);
      const payload = { ...sponsor, id, updatedAt: new Date().toISOString() };
      await this.safeSetDoc(docRef, payload);
      return payload as Sponsor;
    } catch (err: any) {
      console.error('Firebase saveSponsor error:', err);
      throw err;
    }
  }

  static async deleteSponsor(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'cms_sponsors', id));
      return true;
    } catch (err: any) {
      console.error('Firebase deleteSponsor error:', err);
      throw err;
    }
  }

  // 12. SETTINGS CRUD
  static async getSettings(): Promise<SiteSettings | null> {
    if (!this.isAvailable()) return null;
    try {
      const docSnap = await getDoc(doc(db!, 'cms_settings', 'global_config'));
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  static async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (!this.isAvailable()) return settings;
    try {
      const docRef = doc(db!, 'cms_settings', 'global_config');
      await this.safeSetDoc(docRef, { ...settings, updatedAt: new Date().toISOString() });
      return settings;
    } catch (err: any) {
      console.error('Firebase saveSettings error:', err);
      throw err;
    }
  }

  // 13. ACTIVITY LOGS CRUD
  static async getActivityLogs(): Promise<ActivityLog[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'cms_activity_logs'));
      const items: ActivityLog[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    } catch (err) {
      return [];
    }
  }

  static async addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const id = `log-${Date.now()}`;
      const docRef = doc(db!, 'cms_activity_logs', id);
      const exactTimestamp = new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      });
      await this.safeSetDoc(docRef, { ...log, id, timestamp: exactTimestamp }, { merge: false });
    } catch (err) {
      console.warn('Failed to log activity to Firebase:', err);
    }
  }
}
