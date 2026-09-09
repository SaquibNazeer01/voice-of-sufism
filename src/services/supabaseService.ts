import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Article, SufiSaint, HeritageSite, PoemVerse, PhotoGalleryItem } from '../types';
import { CmsUser, CmsCategoryItem, CmsTagItem, KashmiriCultureItem, FolkloreStory, SiteSettings, ActivityLog, Advertisement, Sponsor } from '../types/cms';
import { ApiService } from './apiService';
import { FirebaseService } from './firebaseService';
import { MockCmsService } from './mockCmsService';

export class SupabaseService {
  // Check active backend mode
  static isUsingSupabase(): boolean {
    return isSupabaseConfigured && supabase !== null;
  }

  static isUsingFirebase(): boolean {
    return FirebaseService.isAvailable();
  }

  // ----------------------------------------------------
  // STORAGE BUCKET FILE UPLOADS
  // ----------------------------------------------------
  static async uploadFile(file: File, folder: string = 'media'): Promise<string> {
    if (this.isUsingFirebase()) {
      return await FirebaseService.uploadFile(file, folder);
    }
    if (!this.isUsingSupabase()) {
      return URL.createObjectURL(file);
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const bucketName = 'sufism-assets';

      const { data, error } = await supabase!.storage
        .from(bucketName)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Supabase Storage upload error:', error);
        return URL.createObjectURL(file);
      }

      const { data: publicUrlData } = supabase!.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('File upload exception:', err);
      return URL.createObjectURL(file);
    }
  }

  // ----------------------------------------------------
  // 1. ARTICLES CRUD
  // ----------------------------------------------------
  static async getArticles(): Promise<Article[]> {
    if (this.isUsingFirebase()) {
      try {
        const fbArticles = await FirebaseService.getArticles();
        if (fbArticles && fbArticles.length > 0) return fbArticles;
      } catch (e) {
        console.warn('Firebase getArticles error:', e);
      }
    }

    if (this.isUsingSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            title: item.title,
            titleUrdu: item.title_urdu,
            subtitle: item.subtitle,
            category: item.category,
            region: item.region,
            locationName: item.location_name,
            coordinates: { lat: item.lat || 34.0837, lng: item.lng || 74.7973 },
            author: item.author,
            authorRole: item.author_role,
            date: item.date,
            readTime: item.read_time,
            heroImage: item.hero_image,
            excerpt: item.excerpt,
            contentMarkdown: item.content_markdown,
            status: (item.status as 'Published' | 'Draft') || 'Published',
            featured: item.featured,
            trending: item.trending,
            editorPick: item.editor_pick,
            quotes: item.quotes || [],
            timelineEvents: item.timeline_events || [],
            galleryImages: item.gallery_images || [],
            relatedArticleIds: item.related_article_ids || [],
            audioKalamUrl: item.audio_kalam_url,
            tags: item.tags || []
          }));
        }
      } catch (err) {
        console.warn('Supabase articles query error:', err);
      }
    }

    const serverArticles = await ApiService.getArticles();
    if (serverArticles && serverArticles.length > 0) {
      return serverArticles;
    }
    return MockCmsService.getArticles();
  }

  static async saveArticle(article: Article): Promise<Article> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveArticle(article);
    }
    const saved = await ApiService.saveArticle(article);
    await MockCmsService.saveArticle(article);

    if (this.isUsingSupabase()) {
      try {
        const payload = {
          id: article.id || `article-${Date.now()}`,
          title: article.title,
          title_urdu: article.titleUrdu,
          subtitle: article.subtitle,
          category: article.category,
          region: article.region,
          location_name: article.locationName,
          lat: article.coordinates?.lat || 34.0837,
          lng: article.coordinates?.lng || 74.7973,
          author: article.author,
          author_role: article.authorRole,
          date: article.date,
          read_time: article.readTime,
          hero_image: article.heroImage,
          excerpt: article.excerpt,
          content_markdown: article.contentMarkdown,
          status: article.status || 'Published',
          featured: article.featured || false,
          trending: article.trending || false,
          editor_pick: article.editorPick || false,
          quotes: article.quotes || [],
          timeline_events: article.timelineEvents || [],
          gallery_images: article.galleryImages || [],
          related_article_ids: article.relatedArticleIds || [],
          audio_kalam_url: article.audioKalamUrl,
          tags: article.tags || [],
          updated_at: new Date().toISOString()
        };
        await supabase!.from('articles').upsert(payload);
      } catch (err) {}
    }
    return saved;
  }

  static async deleteArticle(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteArticle(id);
    }
    await ApiService.deleteArticle(id);
    await MockCmsService.deleteArticle(id);
    if (this.isUsingSupabase()) {
      try {
        await supabase!.from('articles').delete().eq('id', id);
      } catch (err) {}
    }
    return true;
  }

  static async clearAllArticles(): Promise<boolean> {
    await ApiService.clearAllArticles();
    await MockCmsService.clearAllArticles();
    if (this.isUsingSupabase()) {
      try {
        await supabase!.from('articles').delete().neq('id', '___NEVER_MATCH___');
      } catch (err) {}
    }
    return true;
  }

  static async clearAllFolklore(): Promise<boolean> {
    if (this.isUsingSupabase()) {
      try {
        await supabase!.from('folklore_stories').delete().neq('id', '___NEVER_MATCH___');
      } catch {}
    }
    return true;
  }

  static async clearAllData(): Promise<{ success: boolean; error?: string }> {
    await ApiService.clearAll();
    MockCmsService.purgeAll();
    if (!this.isUsingSupabase()) return { success: true };
    try {
      await Promise.allSettled([
        supabase!.from('articles').delete().neq('id', '___NEVER_MATCH___'),
        supabase!.from('folklore_stories').delete().neq('id', '___NEVER_MATCH___'),
        supabase!.from('sufi_saints').delete().neq('id', '___NEVER_MATCH___'),
        supabase!.from('heritage_sites').delete().neq('id', '___NEVER_MATCH___'),
        supabase!.from('poem_verses').delete().neq('id', '___NEVER_MATCH___'),
        supabase!.from('photo_gallery').delete().neq('id', '___NEVER_MATCH___'),
        supabase!.from('culture_items').delete().neq('id', '___NEVER_MATCH___'),
      ]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  }

  // ----------------------------------------------------
  // 2. SUFI SAINTS CRUD
  // ----------------------------------------------------
  static async getSaints(): Promise<SufiSaint[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getSaints();
      if (fb && fb.length > 0) return fb;
    }
    if (this.isUsingSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('sufi_saints')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            name: item.name,
            kashmiriName: item.kashmiri_name,
            titleUrdu: item.title_urdu,
            order: item.order,
            period: item.period,
            shrineLocation: item.shrine_location,
            district: item.district,
            biography: item.biography,
            corePhilosophy: item.core_philosophy,
            famousSaying: item.famous_saying || { kashmiri: '', transliteration: '', english: '' },
            impactOnKashmir: item.impact_on_kashmir,
            image: item.image,
            coordinates: { lat: item.lat || 34.0837, lng: item.lng || 74.7973 }
          }));
        }
      } catch (err) {}
    }
    const serverSaints = await ApiService.getSaints();
    if (serverSaints && serverSaints.length > 0) return serverSaints;
    return MockCmsService.getSaints();
  }

  static async saveSaint(saint: SufiSaint): Promise<SufiSaint> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveSaint(saint);
    }
    const saved = await ApiService.saveSaint(saint);
    await MockCmsService.saveSaint(saint);
    if (this.isUsingSupabase()) {
      try {
        const payload = {
          id: saint.id || `saint-${Date.now()}`,
          name: saint.name,
          kashmiri_name: saint.kashmiriName,
          title_urdu: saint.titleUrdu,
          order: saint.order,
          period: saint.period,
          shrine_location: saint.shrineLocation,
          district: saint.district,
          biography: saint.biography,
          core_philosophy: saint.corePhilosophy,
          famous_saying: saint.famousSaying,
          impact_on_kashmir: saint.impactOnKashmir,
          image: saint.image,
          lat: saint.coordinates?.lat || 34.0837,
          lng: saint.coordinates?.lng || 74.7973,
          updated_at: new Date().toISOString()
        };
        await supabase!.from('sufi_saints').upsert(payload);
      } catch (err) {}
    }
    return saved;
  }

  static async deleteSaint(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteSaint(id);
    }
    await ApiService.deleteSaint(id);
    await MockCmsService.deleteSaint(id);
    if (this.isUsingSupabase()) {
      try {
        await supabase!.from('sufi_saints').delete().eq('id', id);
      } catch (err) {}
    }
    return true;
  }

  // ----------------------------------------------------
  // 3. HERITAGE SITES CRUD
  // ----------------------------------------------------
  static async getHeritageSites(): Promise<HeritageSite[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getSites();
      if (fb && fb.length > 0) return fb;
    }
    if (this.isUsingSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('heritage_sites')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            name: item.name,
            kashmiriName: item.kashmiri_name,
            type: item.type,
            district: item.district,
            builtYear: item.built_year,
            architecturalStyle: item.architectural_style,
            overview: item.overview,
            visitationEtiquette: item.visitation_etiquette || [],
            heroImage: item.hero_image,
            coordinates: { lat: item.lat || 34.0837, lng: item.lng || 74.7973 },
            distanceFromSrinagarKm: item.distance_from_srinagar_km || 0
          }));
        }
      } catch (err) {}
    }
    const serverSites = await ApiService.getSites();
    if (serverSites && serverSites.length > 0) return serverSites;
    return MockCmsService.getSites();
  }

  static async saveHeritageSite(site: HeritageSite): Promise<HeritageSite> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveSite(site);
    }
    const saved = await ApiService.saveSite(site);
    await MockCmsService.saveSite(site);
    if (this.isUsingSupabase()) {
      try {
        const payload = {
          id: site.id || `site-${Date.now()}`,
          name: site.name,
          kashmiri_name: site.kashmiriName,
          type: site.type,
          district: site.district,
          built_year: site.builtYear,
          architectural_style: site.architecturalStyle,
          overview: site.overview,
          visitation_etiquette: site.visitationEtiquette || [],
          hero_image: site.heroImage,
          lat: site.coordinates?.lat || 34.0837,
          lng: site.coordinates?.lng || 74.7973,
          distance_from_srinagar_km: site.distanceFromSrinagarKm || 0,
          updated_at: new Date().toISOString()
        };
        await supabase!.from('heritage_sites').upsert(payload);
      } catch (err) {}
    }
    return saved;
  }

  static async deleteHeritageSite(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteSite(id);
    }
    await ApiService.deleteSite(id);
    await MockCmsService.deleteSite(id);
    if (this.isUsingSupabase()) {
      try {
        await supabase!.from('heritage_sites').delete().eq('id', id);
      } catch (err) {}
    }
    return true;
  }

  // ----------------------------------------------------
  // 4. POEM VERSES CRUD
  // ----------------------------------------------------
  static async getPoems(): Promise<PoemVerse[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getPoems();
      if (fb && fb.length > 0) return fb;
    }
    if (this.isUsingSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('poem_verses')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            poetName: item.poet_name,
            poetRole: item.poet_role,
            title: item.title,
            kashmiriScript: item.kashmiri_script,
            transliteration: item.transliteration,
            englishTranslation: item.english_translation,
            theme: item.theme,
            audioText: item.audio_text,
            historicalContext: item.historical_context,
            yearCentury: item.year_century
          }));
        }
      } catch (err) {}
    }
    const serverPoems = await ApiService.getPoems();
    if (serverPoems && serverPoems.length > 0) return serverPoems;
    return MockCmsService.getPoems();
  }

  static async savePoem(poem: PoemVerse): Promise<PoemVerse> {
    if (this.isUsingFirebase()) {
      await FirebaseService.savePoem(poem);
    }
    const saved = await ApiService.savePoem(poem);
    await MockCmsService.savePoem(poem);
    if (this.isUsingSupabase()) {
      try {
        const payload = {
          id: poem.id || `poem-${Date.now()}`,
          poet_name: poem.poetName,
          poet_role: poem.poetRole,
          title: poem.title,
          kashmiri_script: poem.kashmiriScript,
          transliteration: poem.transliteration,
          english_translation: poem.englishTranslation,
          theme: poem.theme,
          audio_text: poem.audioText,
          historical_context: poem.historicalContext,
          year_century: poem.yearCentury,
          updated_at: new Date().toISOString()
        };
        await supabase!.from('poem_verses').upsert(payload);
      } catch (err) {}
    }
    return saved;
  }

  static async deletePoem(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deletePoem(id);
    }
    await ApiService.deletePoem(id);
    await MockCmsService.deletePoem(id);
    if (this.isUsingSupabase()) {
      try {
        await supabase!.from('poem_verses').delete().eq('id', id);
      } catch (err) {}
    }
    return true;
  }

  // ----------------------------------------------------
  // 5. PHOTO GALLERY CRUD
  // ----------------------------------------------------
  static async getPhotos(): Promise<PhotoGalleryItem[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getPhotos();
      if (fb && fb.length > 0) return fb;
    }
    if (this.isUsingSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('photo_gallery')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            title: item.title,
            caption: item.caption,
            location: item.location,
            district: item.district,
            year: item.year,
            photographer: item.photographer,
            imageUrl: item.image_url,
            category: item.category
          }));
        }
      } catch (err) {}
    }
    const serverPhotos = await ApiService.getPhotos();
    if (serverPhotos && serverPhotos.length > 0) return serverPhotos;
    return MockCmsService.getPhotos();
  }

  static async savePhoto(photo: PhotoGalleryItem): Promise<PhotoGalleryItem> {
    if (this.isUsingFirebase()) {
      await FirebaseService.savePhoto(photo);
    }
    const saved = await ApiService.savePhoto(photo);
    await MockCmsService.savePhoto(photo);
    if (this.isUsingSupabase()) {
      try {
        const payload = {
          id: photo.id || `photo-${Date.now()}`,
          title: photo.title,
          caption: photo.caption,
          location: photo.location,
          district: photo.district,
          year: photo.year,
          photographer: photo.photographer,
          image_url: photo.imageUrl,
          category: photo.category,
          updated_at: new Date().toISOString()
        };
        await supabase!.from('photo_gallery').upsert(payload);
      } catch (err) {}
    }
    return saved;
  }

  static async deletePhoto(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deletePhoto(id);
    }
    await ApiService.deletePhoto(id);
    await MockCmsService.deletePhoto(id);
    if (this.isUsingSupabase()) {
      try {
        await supabase!.from('photo_gallery').delete().eq('id', id);
      } catch (err) {}
    }
    return true;
  }

  // ----------------------------------------------------
  // 6. KASHMIRI CULTURE ITEMS CRUD
  // ----------------------------------------------------
  static async getCultureItems(): Promise<KashmiriCultureItem[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getCultureItems();
      if (fb && fb.length > 0) return fb;
    }
    const serverCulture = await ApiService.getCultureItems();
    if (serverCulture && serverCulture.length > 0) return serverCulture;
    return MockCmsService.getCultureItems();
  }

  static async saveCultureItem(item: KashmiriCultureItem): Promise<KashmiriCultureItem> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveCultureItem(item);
    }
    const saved = await ApiService.saveCultureItem(item);
    await MockCmsService.saveCultureItem(item);
    return saved;
  }

  static async deleteCultureItem(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteCultureItem(id);
    }
    await ApiService.deleteCultureItem(id);
    await MockCmsService.deleteCultureItem(id);
    return true;
  }

  // ----------------------------------------------------
  // 7. FOLKLORE STORIES CRUD
  // ----------------------------------------------------
  static async getFolkloreStories(): Promise<FolkloreStory[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getFolkloreStories();
      if (fb && fb.length > 0) return fb;
    }
    const serverFolklore = await ApiService.getFolkloreStories();
    if (serverFolklore && serverFolklore.length > 0) return serverFolklore;
    return MockCmsService.getFolkloreStories();
  }

  static async saveFolkloreStory(story: FolkloreStory): Promise<FolkloreStory> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveFolkloreStory(story);
    }
    const saved = await ApiService.saveFolkloreStory(story);
    await MockCmsService.saveFolkloreStory(story);
    return saved;
  }

  static async deleteFolkloreStory(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteFolkloreStory(id);
    }
    await ApiService.deleteFolkloreStory(id);
    await MockCmsService.deleteFolkloreStory(id);
    return true;
  }

  // ----------------------------------------------------
  // 8. CATEGORIES & TAGS
  // ----------------------------------------------------
  static async getCategories(): Promise<CmsCategoryItem[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getCategories();
      if (fb && fb.length > 0) return fb;
    }
    const serverCategories = await ApiService.getCategories();
    if (serverCategories && serverCategories.length > 0) return serverCategories;
    return MockCmsService.getCategories();
  }

  static async saveCategory(category: CmsCategoryItem): Promise<CmsCategoryItem> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveCategory(category);
    }
    const saved = await ApiService.saveCategory(category);
    await MockCmsService.saveCategory(category);
    return saved;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteCategory(id);
    }
    await ApiService.deleteCategory(id);
    await MockCmsService.deleteCategory(id);
    return true;
  }

  // ----------------------------------------------------
  // 9. CMS USERS
  // ----------------------------------------------------
  static async getUsers(): Promise<CmsUser[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getUsers();
      if (fb && fb.length > 0) return fb;
    }
    const serverUsers = await ApiService.getUsers();
    if (serverUsers && serverUsers.length > 0) return serverUsers;
    return MockCmsService.getUsers();
  }

  static async saveUser(user: CmsUser): Promise<CmsUser> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveUser(user);
    }
    const saved = await ApiService.saveUser(user);
    await MockCmsService.saveUser(user);
    return saved;
  }

  static async deleteUser(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteUser(id);
    }
    await ApiService.deleteUser(id);
    await MockCmsService.deleteUser(id);
    return true;
  }

  // ----------------------------------------------------
  // 10. SITE SETTINGS
  // ----------------------------------------------------
  static async getSettings(): Promise<SiteSettings> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getSettings();
      if (fb) return fb;
    }
    const serverSettings = await ApiService.getSettings();
    if (serverSettings) return serverSettings;
    return MockCmsService.getSettings();
  }

  static async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveSettings(settings);
    }
    const saved = await ApiService.saveSettings(settings);
    await MockCmsService.saveSettings(settings);
    return saved;
  }

  static async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    return this.saveSettings(settings);
  }

  // ----------------------------------------------------
  // 11. ACTIVITY LOGS
  // ----------------------------------------------------
  static async getActivityLogs(): Promise<ActivityLog[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getLogs();
      if (fb && fb.length > 0) return fb;
    }
    const serverLogs = await ApiService.getLogs();
    if (serverLogs && serverLogs.length > 0) return serverLogs;
    return MockCmsService.getLogs();
  }

  static async addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    if (this.isUsingFirebase()) {
      await FirebaseService.logActivity(log.user, log.action, log.target, log.badgeType);
    }
    await ApiService.logActivity(log.user, log.action, log.target, log.badgeType);
    await MockCmsService.logActivity(log.user, log.action, log.target, log.badgeType);
  }

  // ----------------------------------------------------
  // 12. ADVERTISEMENTS CRUD
  // ----------------------------------------------------
  static async getAdvertisements(): Promise<Advertisement[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getAdvertisements();
      if (fb && fb.length > 0) return fb;
    }
    const serverAds = await ApiService.getAdvertisements();
    if (serverAds && serverAds.length > 0) return serverAds;
    return MockCmsService.getAdvertisements();
  }

  static async saveAdvertisement(ad: Advertisement): Promise<Advertisement> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveAdvertisement(ad);
    }
    const saved = await ApiService.saveAdvertisement(ad);
    await MockCmsService.saveAdvertisement(ad);
    return saved;
  }

  static async deleteAdvertisement(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteAdvertisement(id);
    }
    await ApiService.deleteAdvertisement(id);
    await MockCmsService.deleteAdvertisement(id);
    return true;
  }

  // ----------------------------------------------------
  // 13. SPONSORS CRUD
  // ----------------------------------------------------
  static async getSponsors(): Promise<Sponsor[]> {
    if (this.isUsingFirebase()) {
      const fb = await FirebaseService.getSponsors();
      if (fb && fb.length > 0) return fb;
    }
    const serverSponsors = await ApiService.getSponsors();
    if (serverSponsors && serverSponsors.length > 0) return serverSponsors;
    return MockCmsService.getSponsors();
  }

  static async saveSponsor(sponsor: Sponsor): Promise<Sponsor> {
    if (this.isUsingFirebase()) {
      await FirebaseService.saveSponsor(sponsor);
    }
    const saved = await ApiService.saveSponsor(sponsor);
    await MockCmsService.saveSponsor(sponsor);
    return saved;
  }

  static async deleteSponsor(id: string): Promise<boolean> {
    if (this.isUsingFirebase()) {
      await FirebaseService.deleteSponsor(id);
    }
    await ApiService.deleteSponsor(id);
    await MockCmsService.deleteSponsor(id);
    return true;
  }
}
