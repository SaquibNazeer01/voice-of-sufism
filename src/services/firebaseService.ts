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

export class FirebaseService {
  static isAvailable(): boolean {
    return isFirebaseConfigured && db !== null;
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
    } catch (err) {
      console.error('Firebase Storage upload error:', err);
      return URL.createObjectURL(file);
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
      const payload = {
        ...article,
        id,
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, payload, { merge: true });
      return payload as Article;
    } catch (err) {
      console.error('Firebase saveArticle error:', err);
      return article;
    }
  }

  static async deleteArticle(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'articles', id));
      return true;
    } catch (err) {
      console.error('Firebase deleteArticle error:', err);
      return false;
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
      await setDoc(docRef, payload, { merge: true });
      return payload as SufiSaint;
    } catch (err) {
      console.error('Firebase saveSaint error:', err);
      return saint;
    }
  }

  static async deleteSaint(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'sufi_saints', id));
      return true;
    } catch (err) {
      return false;
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
      await setDoc(docRef, payload, { merge: true });
      return payload as HeritageSite;
    } catch (err) {
      return site;
    }
  }

  static async deleteSite(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'heritage_sites', id));
      return true;
    } catch (err) {
      return false;
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
      await setDoc(docRef, payload, { merge: true });
      return payload as PoemVerse;
    } catch (err) {
      return poem;
    }
  }

  static async deletePoem(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'poem_verses', id));
      return true;
    } catch (err) {
      return false;
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
      await setDoc(docRef, payload, { merge: true });
      return payload as PhotoGalleryItem;
    } catch (err) {
      return photo;
    }
  }

  static async deletePhoto(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'photo_gallery', id));
      return true;
    } catch (err) {
      return false;
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
      await setDoc(docRef, payload, { merge: true });
      return payload as KashmiriCultureItem;
    } catch (err) {
      return item;
    }
  }

  static async deleteCultureItem(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'culture_items', id));
      return true;
    } catch (err) {
      return false;
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
      await setDoc(docRef, payload, { merge: true });
      return payload as FolkloreStory;
    } catch (err) {
      return story;
    }
  }

  static async deleteFolkloreStory(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'folklore_stories', id));
      return true;
    } catch (err) {
      return false;
    }
  }

  // 8. SETTINGS
  static async getSettings(): Promise<SiteSettings | null> {
    if (!this.isAvailable()) return null;
    try {
      const docSnap = await getDoc(doc(db!, 'settings', 'global'));
      return docSnap.exists() ? (docSnap.data() as SiteSettings) : null;
    } catch (err) {
      return null;
    }
  }

  static async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (!this.isAvailable()) return settings;
    try {
      await setDoc(doc(db!, 'settings', 'global'), settings, { merge: true });
      return settings;
    } catch (err) {
      return settings;
    }
  }

  // 10. CATEGORIES CRUD
  static async getCategories(): Promise<CmsCategoryItem[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'categories'));
      const items: CmsCategoryItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async saveCategory(category: CmsCategoryItem): Promise<CmsCategoryItem> {
    if (!this.isAvailable()) return category;
    try {
      const id = category.id || `cat-${Date.now()}`;
      const docRef = doc(db!, 'categories', id);
      const payload = { ...category, id };
      await setDoc(docRef, payload, { merge: true });
      return payload as CmsCategoryItem;
    } catch (err) {
      return category;
    }
  }

  static async deleteCategory(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'categories', id));
      return true;
    } catch (err) {
      return false;
    }
  }

  // 11. USERS CRUD
  static async getUsers(): Promise<CmsUser[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'users'));
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
      const docRef = doc(db!, 'users', id);
      const payload = { ...user, id };
      await setDoc(docRef, payload, { merge: true });
      return payload as CmsUser;
    } catch (err) {
      return user;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'users', id));
      return true;
    } catch (err) {
      return false;
    }
  }

  // 12. LOGS
  static async getLogs(): Promise<ActivityLog[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'activity_logs'));
      const items: ActivityLog[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return items;
    } catch (err) {
      return [];
    }
  }

  static async logActivity(user: string, action: string, target: string, badgeType: string = 'update') {
    if (!this.isAvailable()) return;
    try {
      const id = `log-${Date.now()}`;
      const exactTimestamp = new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      });
      await setDoc(doc(db!, 'activity_logs', id), {
        id,
        user,
        action,
        target,
        timestamp: exactTimestamp,
        badgeType
      });
    } catch (err) {}
  }

  // 13. ADVERTISEMENTS CRUD
  static async getAdvertisements(): Promise<Advertisement[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'advertisements'));
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
      const docRef = doc(db!, 'advertisements', id);
      const payload = { ...ad, id, updatedAt: new Date().toISOString() };
      await setDoc(docRef, payload, { merge: true });
      return payload as Advertisement;
    } catch (err) {
      return ad;
    }
  }

  static async deleteAdvertisement(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'advertisements', id));
      return true;
    } catch (err) {
      return false;
    }
  }

  // 14. SPONSORS CRUD
  static async getSponsors(): Promise<Sponsor[]> {
    if (!this.isAvailable()) return [];
    try {
      const snapshot = await getDocs(collection(db!, 'sponsors'));
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
      const id = sponsor.id || `sp-${Date.now()}`;
      const docRef = doc(db!, 'sponsors', id);
      const payload = { ...sponsor, id, updatedAt: new Date().toISOString() };
      await setDoc(docRef, payload, { merge: true });
      return payload as Sponsor;
    } catch (err) {
      return sponsor;
    }
  }

  static async deleteSponsor(id: string): Promise<boolean> {
    if (!this.isAvailable()) return true;
    try {
      await deleteDoc(doc(db!, 'sponsors', id));
      return true;
    } catch (err) {
      return false;
    }
  }
}

