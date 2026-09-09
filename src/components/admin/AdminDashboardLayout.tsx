import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Compass, 
  Landmark, 
  Feather, 
  BookOpen, 
  Image as ImageIcon, 
  FolderTree, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Search, 
  Plus,
  Megaphone,
  Sparkles
} from 'lucide-react';

import { Article, SufiSaint, HeritageSite, PoemVerse, PhotoGalleryItem } from '../../types';
import { CmsUser, CmsCategoryItem, KashmiriCultureItem, FolkloreStory, SiteSettings, ActivityLog, Advertisement, Sponsor } from '../../types/cms';
import { SupabaseService } from '../../services/supabaseService';

import { OverviewTab } from './OverviewTab';
import { CrudTableModule, ColumnDef } from './CrudTableModule';
import { CrudFormModal } from './CrudFormModal';
import { UsersModule } from './UsersModule';
import { SettingsModule } from './SettingsModule';
import { Toast, useToast } from './Toast';
import { FirebaseStatusGuide } from './FirebaseStatusGuide';

interface AdminDashboardLayoutProps {
  currentUser: CmsUser;
  onUpdateCurrentUser: (user: CmsUser) => void;
  onLogout: () => void;
  onReturnToPublicSite: () => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onLogout,
  onReturnToPublicSite
}) => {
  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string') return 'SA';
    const trimmed = name.trim();
    if (!trimmed) return 'SA';
    const parts = trimmed.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return trimmed.substring(0, 2).toUpperCase();
  };

  // State loaded from SupabaseService
  const [articles, setArticles] = useState<Article[]>([]);
  const [saints, setSaints] = useState<SufiSaint[]>([]);
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [poems, setPoems] = useState<PoemVerse[]>([]);
  const [photos, setPhotos] = useState<PhotoGalleryItem[]>([]);
  const [culture, setCulture] = useState<KashmiriCultureItem[]>([]);
  const [folklore, setFolklore] = useState<FolkloreStory[]>([]);
  const [categories, setCategories] = useState<CmsCategoryItem[]>([]);
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Toast notifications
  const { toasts, addToast, dismiss } = useToast();

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [formModalModule, setFormModalModule] = useState<any>('articles');
  const [formInitialData, setFormInitialData] = useState<any>(null);

  // Load all data on mount
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [
        artList,
        saintList,
        siteList,
        poemList,
        photoList,
        cultureList,
        folkList,
        catList,
        userList,
        adList,
        sponsorList,
        settList,
        logList
      ] = await Promise.all([
        SupabaseService.getArticles().catch(() => []),
        SupabaseService.getSaints().catch(() => []),
        SupabaseService.getHeritageSites().catch(() => []),
        SupabaseService.getPoems().catch(() => []),
        SupabaseService.getPhotos().catch(() => []),
        SupabaseService.getCultureItems().catch(() => []),
        SupabaseService.getFolkloreStories().catch(() => []),
        SupabaseService.getCategories().catch(() => []),
        SupabaseService.getUsers().catch(() => []),
        SupabaseService.getAdvertisements().catch(() => []),
        SupabaseService.getSponsors().catch(() => []),
        SupabaseService.getSettings().catch(() => null),
        SupabaseService.getActivityLogs().catch(() => [])
      ]);

      setArticles(artList || []);
      setSaints(saintList || []);
      setSites(siteList || []);
      setPoems(poemList || []);
      setPhotos(photoList || []);
      setCulture(cultureList || []);
      setFolklore(folkList || []);
      setCategories(catList || []);
      setUsers(userList || []);
      setAds(adList || []);
      setSponsors(sponsorList || []);
      setSettings(settList || null);
      setLogs(logList || []);
    } catch (err) {
      console.error('Dashboard data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for modal opening
  const handleOpenAdd = (moduleType: string) => {
    setFormModalMode('add');
    setFormModalModule(moduleType);
    setFormInitialData(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (moduleType: string, item: any) => {
    setFormModalMode('edit');
    setFormModalModule(moduleType);
    setFormInitialData(item);
    setIsFormModalOpen(true);
  };

  const handleOpenView = (moduleType: string, item: any) => {
    setFormModalMode('view');
    setFormModalModule(moduleType);
    setFormInitialData(item);
    setIsFormModalOpen(true);
  };

  // Handlers for Save
  const handleSaveItem = async (data: any) => {
    try {
      const label = data.title || data.name || data.poetName || data.advertiserName || 'Record';
      if (formModalModule === 'articles') {
        await SupabaseService.saveArticle({
          ...data,
          status: data.status || 'Published',
          featured: data.featured === true,
          date: data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: data.readTime || '5 min read',
          tags: data.tags || ['Heritage', 'Kashmir', 'Sufism']
        });
      } else if (formModalModule === 'saints') {
        await SupabaseService.saveSaint(data);
      } else if (formModalModule === 'sites') {
        await SupabaseService.saveHeritageSite(data);
      } else if (formModalModule === 'poems') {
        await SupabaseService.savePoem(data);
      } else if (formModalModule === 'photos') {
        await SupabaseService.savePhoto(data);
      } else if (formModalModule === 'culture') {
        await SupabaseService.saveCultureItem(data);
      } else if (formModalModule === 'categories') {
        await SupabaseService.saveCategory(data);
      } else if (formModalModule === 'ads') {
        await SupabaseService.saveAdvertisement(data);
      } else if (formModalModule === 'sponsors') {
        await SupabaseService.saveSponsor(data);
      }

      const moduleLabels: Record<string, string> = {
        articles: 'Article',
        saints: 'Sufi Saint',
        sites: 'Shrine & Ziyarat',
        poems: 'Vakh & Poetry',
        photos: 'Archival Photo',
        culture: 'Cultural Heritage Item',
        folklore: 'Folklore Story',
        categories: 'Category',
        ads: 'Advertisement',
        sponsors: 'Sponsor'
      };
      const friendlyType = moduleLabels[formModalModule] || formModalModule;
      const actionText = formModalMode === 'add' ? `Created ${friendlyType}` : `Updated ${friendlyType}`;
      const badge = formModalMode === 'add' ? 'create' : 'update';

      // Log the activity
      await SupabaseService.addActivityLog({
        user: currentUser?.name || 'Admin',
        action: actionText,
        target: label,
        badgeType: badge
      }).catch(() => {});

      addToast('success', formModalMode === 'add' ? 'Published Successfully' : 'Changes Saved', `"${label}" was saved to database.`);
      await refreshData();
    } catch (err: any) {
      console.error('Save error:', err);
      const isPermissionDenied = err?.code === 'permission-denied' || String(err).includes('permission') || String(err).includes('PERMISSION_DENIED');
      const errorMsg = isPermissionDenied
        ? 'Firebase Permission Denied! Firestore security rules are blocking writes. Open Firebase Console > Firestore Database > Rules and set "allow read, write: if true;"'
        : err?.message || 'An error occurred while saving to database.';
      addToast('error', 'Save Failed', errorMsg);
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (moduleType: string, item: any) => {
    const moduleLabels: Record<string, string> = {
      articles: 'Article',
      culture: 'Cultural Item',
      folklore: 'Folklore Story',
      ads: 'Advertisement',
      sponsors: 'Sponsor'
    };
    const friendlyType = moduleLabels[moduleType] || moduleType;

    try {
      if (moduleType === 'ads') {
        const nextStatus = item.status === 'Active' ? 'Paused' : 'Active';
        await SupabaseService.saveAdvertisement({ ...item, status: nextStatus });
        addToast('info', 'Status Updated', `Ad "${item.title}" is now ${nextStatus}.`);
        await SupabaseService.addActivityLog({
          user: currentUser?.name || 'Admin',
          action: `Set ${friendlyType} to ${nextStatus}`,
          target: item.title,
          badgeType: 'update'
        }).catch(() => {});
      } else if (moduleType === 'sponsors') {
        const nextStatus = item.status === 'Active' ? 'Paused' : 'Active';
        await SupabaseService.saveSponsor({ ...item, status: nextStatus });
        addToast('info', 'Status Updated', `Sponsor "${item.name}" is now ${nextStatus}.`);
        await SupabaseService.addActivityLog({
          user: currentUser?.name || 'Admin',
          action: `Set ${friendlyType} to ${nextStatus}`,
          target: item.name,
          badgeType: 'update'
        }).catch(() => {});
      } else {
        const nextStatus = item.status === 'Published' ? 'Draft' : 'Published';
        const updated = { ...item, status: nextStatus };
        if (moduleType === 'articles') {
          await SupabaseService.saveArticle({ ...updated, excerpt: updated.excerpt || '' });
        } else if (moduleType === 'culture') {
          await SupabaseService.saveCultureItem(updated);
        }
        addToast('info', 'Status Updated', `"${item.title || item.name}" is now ${nextStatus}.`);
        await SupabaseService.addActivityLog({
          user: currentUser?.name || 'Admin',
          action: `Set ${friendlyType} to ${nextStatus}`,
          target: item.title || item.name || 'Record',
          badgeType: 'update'
        }).catch(() => {});
      }
      
      await refreshData();
    } catch (err: any) {
      addToast('error', 'Status Toggle Failed', err?.message || 'Could not update status.');
    }
  };

  // Handlers for Deletion
  const handleDeleteItem = async (moduleType: string, id: string) => {
    const moduleLabels: Record<string, string> = {
      articles: 'Article',
      saints: 'Sufi Saint',
      sites: 'Shrine & Ziyarat',
      poems: 'Vakh & Poetry',
      photos: 'Archival Photo',
      culture: 'Cultural Item',
      folklore: 'Folklore Story',
      categories: 'Category',
      ads: 'Advertisement',
      sponsors: 'Sponsor'
    };
    const friendlyType = moduleLabels[moduleType] || moduleType;

    const label = (() => {
      if (moduleType === 'articles') return articles.find(a => a.id === id)?.title;
      if (moduleType === 'saints') return saints.find(s => s.id === id)?.name;
      if (moduleType === 'sites') return sites.find(s => s.id === id)?.name;
      if (moduleType === 'poems') return poems.find(p => p.id === id)?.title;
      if (moduleType === 'photos') return photos.find(p => p.id === id)?.title;
      if (moduleType === 'culture') return culture.find(c => c.id === id)?.title;
      if (moduleType === 'folklore') return folklore.find(f => f.id === id)?.title;
      if (moduleType === 'categories') return categories.find(c => c.id === id)?.name;
      if (moduleType === 'ads') return ads.find(a => a.id === id)?.title;
      if (moduleType === 'sponsors') return sponsors.find(s => s.id === id)?.name;
      return id;
    })() || id;

    try {
      if (moduleType === 'articles') {
        await SupabaseService.deleteArticle(id);
        const folkId = id.replace('article-sub-', 'public-sub-');
        await SupabaseService.deleteFolkloreStory(folkId);
      } else if (moduleType === 'folklore') {
        await SupabaseService.deleteFolkloreStory(id);
        const articleId = id.replace('public-sub-', 'article-sub-');
        await SupabaseService.deleteArticle(articleId);
      } else if (moduleType === 'saints') {
        await SupabaseService.deleteSaint(id);
      } else if (moduleType === 'sites') {
        await SupabaseService.deleteHeritageSite(id);
      } else if (moduleType === 'poems') {
        await SupabaseService.deletePoem(id);
      } else if (moduleType === 'photos') {
        await SupabaseService.deletePhoto(id);
      } else if (moduleType === 'culture') {
        await SupabaseService.deleteCultureItem(id);
      } else if (moduleType === 'categories') {
        await SupabaseService.deleteCategory(id);
      } else if (moduleType === 'ads') {
        await SupabaseService.deleteAdvertisement(id);
      } else if (moduleType === 'sponsors') {
        await SupabaseService.deleteSponsor(id);
      }

      await SupabaseService.addActivityLog({
        user: currentUser?.name || 'Admin',
        action: `Deleted ${friendlyType}`,
        target: label,
        badgeType: 'delete'
      }).catch(() => {});

      addToast('warning', 'Record Deleted', `"${label}" was permanently deleted.`);
      await refreshData();
    } catch (err: any) {
      addToast('error', 'Delete Failed', err?.message || 'Could not delete record.');
    }
  };

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  // Categorized navigation groups
  const navGroups = [
    {
      groupTitle: 'Core',
      items: [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      groupTitle: 'Heritage & Content',
      items: [
        { id: 'articles', label: 'Articles & Stories', icon: FileText, badge: (articles || []).length },
        { id: 'saints', label: 'Sufi Saints & Reshis', icon: Compass, badge: (saints || []).length },
        { id: 'sites', label: 'Shrines & Ziyarats', icon: Landmark, badge: (sites || []).length },
        { id: 'poems', label: 'Vakhs & Poetry', icon: Feather, badge: (poems || []).length },
        { id: 'photos', label: 'Photo Archive', icon: ImageIcon, badge: (photos || []).length },
        { id: 'culture', label: 'Kashmiri Culture', icon: BookOpen, badge: (culture || []).length },
        { id: 'folklore', label: 'Folklore & Oral History', icon: Sparkles, badge: (folklore || []).length },
        { id: 'categories', label: 'Categories & Tags', icon: FolderTree, badge: (categories || []).length }
      ]
    },
    {
      groupTitle: 'Outreach & Monetization',
      items: [
        { id: 'ads', label: 'Advertisements', icon: Megaphone, badge: (ads || []).length },
        { id: 'sponsors', label: 'Sponsors & Patrons', icon: Sparkles, badge: (sponsors || []).length }
      ]
    },
    {
      groupTitle: 'Administration',
      items: [
        { id: 'users', label: isSuperAdmin ? 'CMS Users & Roles' : 'My User Profile', icon: Users, badge: isSuperAdmin ? (users || []).length : null },
        ...(isSuperAdmin ? [{ id: 'settings', label: 'System Settings', icon: Settings, badge: null }] : [])
      ]
    }
  ];

  // Flattened nav items for lookup
  const allNavItems = navGroups.flatMap(g => g.items);
  const activeNavItem = allNavItems.find(n => n.id === activeTab) || allNavItems[0];

  // Column definitions for CRUD Tables
  const articleColumns: ColumnDef<Article>[] = [
    {
      header: 'Article & Location',
      accessor: (a) => (
        <div className="flex items-center space-x-3.5 max-w-sm">
          <img 
            src={a.heroImage} 
            alt={a.title} 
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-xs border border-slate-200" 
          />
          <div className="min-w-0">
            <p className="font-serif font-bold text-slate-900 truncate max-w-[240px] text-sm leading-snug">{a.title}</p>
            <p className="text-[11px] text-slate-500 truncate max-w-[240px] mt-0.5">{a.locationName || a.region}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Category', 
      accessor: (a) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
          {a.category}
        </span>
      ) 
    },
    { 
      header: 'District', 
      accessor: (a) => (
        <span className="font-semibold text-xs text-slate-700">
          {a.region}
        </span>
      ) 
    },
    { 
      header: 'Author', 
      accessor: (a) => (
        <span className="text-xs text-slate-600 font-medium">{a.author}</span>
      ) 
    },
    { 
      header: 'Published Date', 
      accessor: (a) => (
        <span className="text-slate-500 font-mono text-[11px]">{a.date}</span>
      ) 
    }
  ];

  const saintColumns: ColumnDef<SufiSaint>[] = [
    {
      header: 'Saint & Title',
      accessor: (s) => (
        <div className="flex items-center space-x-3.5">
          <img 
            src={s.image} 
            alt={s.name} 
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-xs border border-amber-200" 
          />
          <div>
            <p className="font-serif font-bold text-slate-900 text-sm">{s.name}</p>
            <p className="text-[11px] text-amber-800 dir-rtl font-medium">{s.titleUrdu || s.kashmiriName}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Sufi Order', 
      accessor: (s) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 font-bold text-xs">
          {s.order}
        </span>
      ) 
    },
    { 
      header: 'Era / Period', 
      accessor: (s) => (
        <span className="font-mono text-xs text-slate-600">{s.period}</span>
      ) 
    },
    { 
      header: 'Shrine Location', 
      accessor: (s) => (
        <span className="text-xs text-slate-700">{s.shrineLocation}</span>
      ) 
    },
    { 
      header: 'District', 
      accessor: (s) => (
        <span className="font-bold text-xs text-emerald-800">{s.district}</span>
      ) 
    }
  ];

  const siteColumns: ColumnDef<HeritageSite>[] = [
    {
      header: 'Heritage Site / Shrine',
      accessor: (s) => (
        <div className="flex items-center space-x-3.5 max-w-sm">
          <img 
            src={s.heroImage} 
            alt={s.name} 
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-xs border border-teal-200" 
          />
          <div>
            <p className="font-serif font-bold text-slate-900 text-sm">{s.name}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.architecturalStyle}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: (s) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200/80 font-semibold text-xs">
          {s.type}
        </span>
      ) 
    },
    { 
      header: 'Built Year', 
      accessor: (s) => (
        <span className="font-mono text-xs text-slate-600">{s.builtYear}</span>
      ) 
    },
    { 
      header: 'District', 
      accessor: (s) => (
        <span className="font-bold text-xs text-slate-800">{s.district}</span>
      ) 
    }
  ];

  const cultureColumns: ColumnDef<KashmiriCultureItem>[] = [
    {
      header: 'Tradition / Craft Title',
      accessor: (c) => (
        <div className="flex items-center space-x-3.5">
          <img 
            src={c.heroImage} 
            alt={c.title} 
            className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-xs border border-indigo-200" 
          />
          <div>
            <p className="font-serif font-bold text-slate-900 text-sm">{c.title}</p>
            <p className="text-[11px] text-amber-800 dir-rtl font-medium">{c.kashmiriTitle}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Type', 
      accessor: (c) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs">
          {c.type}
        </span>
      ) 
    },
    { 
      header: 'District', 
      accessor: (c) => (
        <span className="font-bold text-xs text-slate-800">{c.district}</span>
      ) 
    },
    { 
      header: 'Master Artisan', 
      accessor: (c) => (
        <span className="text-xs text-slate-600">{c.masterArtisans || 'Valley Guild'}</span>
      ) 
    }
  ];

  const poemColumns: ColumnDef<PoemVerse>[] = [
    {
      header: 'Poem Verse Title',
      accessor: (p) => (
        <div>
          <p className="font-serif font-bold text-slate-900 text-sm">{p.title}</p>
          <p className="text-[11px] text-emerald-800 italic mt-0.5">"{p.transliteration}"</p>
        </div>
      )
    },
    { 
      header: 'Poet / Mystic', 
      accessor: (p) => (
        <span className="font-bold text-xs text-slate-800">{p.poetName}</span>
      ) 
    },
    { 
      header: 'Theme', 
      accessor: (p) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 font-bold text-xs">
          {p.theme}
        </span>
      ) 
    },
    { 
      header: 'Century', 
      accessor: (p) => (
        <span className="font-mono text-xs text-slate-500">{p.yearCentury}</span>
      ) 
    }
  ];

  const folkloreColumns: ColumnDef<FolkloreStory>[] = [
    {
      header: 'Story Headline',
      accessor: (f) => (
        <div>
          <p className="font-serif font-bold text-slate-900 text-sm">{f.title}</p>
          {f.collectedBy && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 inline-block mt-1">
              Submitted by: {f.collectedBy}
            </span>
          )}
        </div>
      )
    },
    { 
      header: 'Narrator / Credit', 
      accessor: (f) => (
        <span className="font-bold text-xs text-slate-800">{f.narrator}</span>
      ) 
    },
    { 
      header: 'District', 
      accessor: (f) => (
        <span className="font-bold text-xs text-emerald-800">{f.district}</span>
      ) 
    },
    { 
      header: 'Status', 
      accessor: (f) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
          f.status === 'Published' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          f.status === 'Under Review' ? 'bg-amber-50 text-amber-900 border border-amber-300' :
          'bg-slate-100 text-slate-700'
        }`}>
          {f.status || 'Published'}
        </span>
      )
    }
  ];

  const photoColumns: ColumnDef<PhotoGalleryItem>[] = [
    {
      header: 'Photo & Details',
      accessor: (p) => (
        <div className="flex items-center space-x-3.5">
          <img 
            src={p.imageUrl} 
            alt={p.title} 
            className="w-12 h-11 rounded-xl object-cover flex-shrink-0 shadow-xs border border-slate-200" 
          />
          <div>
            <p className="font-serif font-bold text-slate-900 text-sm">{p.title}</p>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">{p.caption}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'District', 
      accessor: (p) => (
        <span className="font-bold text-xs text-slate-800">{p.district}</span>
      ) 
    },
    { 
      header: 'Year', 
      accessor: (p) => (
        <span className="font-mono text-xs text-slate-600">{p.year}</span>
      ) 
    },
    { 
      header: 'Photographer', 
      accessor: (p) => (
        <span className="text-xs text-slate-600 font-medium">{p.photographer}</span>
      ) 
    }
  ];

  const categoryColumns: ColumnDef<CmsCategoryItem>[] = [
    {
      header: 'Category Name',
      accessor: (c) => (
        <div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${c.colorBadge}`}>
            {c.name}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">{c.description}</p>
        </div>
      )
    },
    { 
      header: 'Slug', 
      accessor: (c) => (
        <span className="font-mono text-xs text-slate-600">{c.slug}</span>
      ) 
    },
    { 
      header: 'Items Count', 
      accessor: (c) => (
        <span className="font-bold text-xs text-emerald-800 font-mono">{c.itemCount} Items</span>
      ) 
    }
  ];

  const adColumns: ColumnDef<Advertisement>[] = [
    {
      header: 'Campaign & Advertiser',
      accessor: (a) => (
        <div className="flex items-center space-x-3.5 max-w-sm">
          {a.bannerImage ? (
            <img 
              src={a.bannerImage} 
              alt={a.title} 
              className="w-12 h-11 rounded-xl object-cover flex-shrink-0 border border-slate-200 shadow-xs" 
            />
          ) : (
            <div className="w-12 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs flex-shrink-0 border border-amber-200">
              AD
            </div>
          )}
          <div>
            <p className="font-serif font-bold text-slate-900 truncate max-w-[220px] text-sm">{a.title}</p>
            <p className="text-[11px] text-amber-800 font-semibold">{a.advertiserName}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Action Type', 
      accessor: (a) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
          a.targetType === 'whatsapp' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          a.targetType === 'phone' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
          a.targetType === 'email' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
          'bg-slate-100 text-slate-800'
        }`}>
          {a.targetType}
        </span>
      ) 
    },
    { 
      header: 'Target Link / Reach', 
      accessor: (a) => (
        <span className="font-mono text-xs text-slate-700 truncate max-w-[180px] block" title={a.targetUrl}>
          {a.targetUrl || a.contactNumber || a.contactEmail}
        </span>
      ) 
    },
    { 
      header: 'Timers', 
      accessor: (a) => (
        <span className="text-xs text-slate-600 font-mono">
          Show: {a.delaySeconds || 5}s • Skip: {a.skipTimerSeconds || 5}s
        </span>
      ) 
    },
    { 
      header: 'Clicks', 
      accessor: (a) => (
        <span className="font-bold text-emerald-700 font-mono text-xs">{a.clicksCount || 0}</span>
      ) 
    }
  ];

  const sponsorColumns: ColumnDef<Sponsor>[] = [
    {
      header: 'Partner & Logo',
      accessor: (s) => (
        <div className="flex items-center space-x-3.5 max-w-sm">
          {s.logo ? (
            <img 
              src={s.logo} 
              alt={s.name} 
              className="w-11 h-11 rounded-xl object-contain bg-white border border-slate-200 p-1 flex-shrink-0 shadow-xs" 
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-bold text-xs flex-shrink-0">
              {s.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-serif font-bold text-slate-900 text-sm">{s.name}</p>
            <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{s.tagline}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Sponsorship Tier', 
      accessor: (s) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
          {s.tier}
        </span>
      ) 
    },
    { 
      header: 'Website / Reach', 
      accessor: (s) => (
        <span className="text-xs text-slate-600 truncate max-w-[180px] block font-mono">
          {s.websiteUrl || s.contactEmail || s.contactPhone || '—'}
        </span>
      ) 
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col lg:flex-row antialiased">
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Modern Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#090D16] text-slate-100 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-out flex flex-col justify-between border-r border-slate-800/80 shadow-2xl`}>
        
        {/* Scrollable Nav Content */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Voice of Sufism"
                  className="w-10 h-10 rounded-xl object-cover shadow-md border border-amber-400/40 flex-shrink-0"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#090D16] rounded-full"></span>
              </div>
              <div>
                <span className="font-serif font-bold text-base tracking-wide text-white block leading-tight">
                  VOICE OF SUFISM
                </span>
                <span className="text-[11px] font-medium text-amber-400 flex items-center space-x-1">
                  <span>CMS Portal</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 text-[10px]">Live</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Quick Card */}
          <div 
            onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}
            className="p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-900/50 hover:from-slate-850 hover:to-slate-900 border border-slate-800 hover:border-amber-400/40 text-xs flex items-center justify-between cursor-pointer group transition-all shadow-sm"
            title="Click to view & edit your profile"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-serif font-bold text-xs flex items-center justify-center border border-amber-300 shadow-md flex-shrink-0">
                {getInitials(currentUser?.name)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                  {currentUser?.name || 'Bhat Sahil'}
                </p>
                <p className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span>{currentUser?.role || 'Super Admin'}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-slate-800/80 text-amber-300 px-2 py-1 rounded-lg border border-slate-700/80 font-bold group-hover:border-amber-400/40 transition-colors flex-shrink-0">
              Profile
            </span>
          </div>

          {/* Categorized Navigation List */}
          <div className="space-y-5">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                  {group.groupTitle}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive 
                            ? 'bg-gradient-to-r from-emerald-900/70 to-emerald-950/90 text-amber-300 border border-emerald-500/40 shadow-sm font-bold' 
                            : 'text-slate-300 hover:bg-slate-850/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== null && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                            isActive 
                              ? 'bg-amber-400 text-slate-950' 
                              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Sidebar Footer Buttons */}
        <div className="p-4 bg-[#06080F] border-t border-slate-800/80 space-y-2 flex-shrink-0">
          <button
            onClick={onReturnToPublicSite}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-800/60 transition-colors shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-800 hover:border-rose-900/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Session</span>
          </button>
        </div>

      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Sleek Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
          
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider hidden sm:inline">
                  Editorial CMS /
                </span>
                <h1 className="font-serif font-bold text-base sm:text-lg text-slate-900 truncate">
                  {activeNavItem.label}
                </h1>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">
                Voice of Sufism Digital Archives & Publishing Suite
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
            <button
              onClick={onReturnToPublicSite}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200/80 transition-colors shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Preview Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className="flex items-center space-x-2.5 pl-2 sm:pl-3 border-l border-slate-200 hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
              title="Click to manage users and update your profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C3A] to-emerald-900 text-amber-300 font-serif font-bold text-xs flex items-center justify-center border border-emerald-600/60 shadow-xs flex-shrink-0">
                {getInitials(currentUser?.name)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser?.name || 'Bhat Sahil'}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">{currentUser?.role || 'Super Admin'}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Tab Content Workspace */}
        <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto space-y-6">

          {/* Cloud Database Diagnostic Banner */}
          <FirebaseStatusGuide />
          
          {activeTab === 'overview' && (
            <OverviewTab
              articles={articles}
              saints={saints}
              sites={sites}
              photos={photos}
              culture={culture}
              folklore={folklore}
              users={users}
              categories={categories}
              logs={logs}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenCreateModal={(mod) => handleOpenAdd(mod)}
            />
          )}

          {activeTab === 'articles' && (
            <CrudTableModule
              title="Articles & Research Papers"
              subtitle="Manage cultural essays, historical studies, and published magazine stories"
              items={articles}
              columns={articleColumns}
              searchPlaceholder="Search articles by title, author, or district..."
              filterOptions={[
                { label: 'Category', key: 'category', values: ['Sufi Saints', 'Sacred Shrines', 'Language & Poetry', 'Architecture & Heritage'] },
                { label: 'District', key: 'region', values: ['Srinagar', 'Budgam', 'Anantnag', 'Baramulla', 'Ganderbal'] }
              ]}
              onAddNew={() => handleOpenAdd('articles')}
              onEdit={(item) => handleOpenEdit('articles', item)}
              onView={(item) => handleOpenView('articles', item)}
              onDelete={(id) => handleDeleteItem('articles', id)}
              onToggleStatus={(item) => handleToggleStatus('articles', item)}
              statusAccessor={(item) => item.status || 'Published'}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'saints' && (
            <CrudTableModule
              title="Sufi Saints & Reshi Masters Catalog"
              subtitle="Biographical records, mystical philosophies, and shrine locations of Kashmir Sufis"
              items={saints}
              columns={saintColumns}
              searchPlaceholder="Search saints by name, order, or district..."
              filterOptions={[
                { label: 'Sufi Order', key: 'order', values: ['Reshi', 'Kubrawi', 'Suhrawardi', 'Qadiria', 'Chisti'] },
                { label: 'District', key: 'district', values: ['Budgam', 'Srinagar', 'Anantnag', 'Baramulla'] }
              ]}
              onAddNew={() => handleOpenAdd('saints')}
              onEdit={(item) => handleOpenEdit('saints', item)}
              onView={(item) => handleOpenView('saints', item)}
              onDelete={(id) => handleDeleteItem('saints', id)}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'sites' && (
            <CrudTableModule
              title="Sacred Shrines & Heritage Places"
              subtitle="Ziyarats, khanqahs, ancient pagodas, and pilgrimage destinations"
              items={sites}
              columns={siteColumns}
              searchPlaceholder="Search shrines by name, architectural style, or location..."
              filterOptions={[
                { label: 'Type', key: 'type', values: ['Shrine (Ziyarat)', 'Khanqah', 'Mosque', 'Heritage Site'] },
                { label: 'District', key: 'district', values: ['Srinagar', 'Budgam', 'Anantnag', 'Baramulla', 'Ganderbal'] }
              ]}
              onAddNew={() => handleOpenAdd('sites')}
              onEdit={(item) => handleOpenEdit('sites', item)}
              onView={(item) => handleOpenView('sites', item)}
              onDelete={(id) => handleDeleteItem('sites', id)}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'culture' && (
            <CrudTableModule
              title="Kashmiri Culture & Crafts Directory"
              subtitle="Traditional crafts, Kani shawl weaving, khatamband ceilings, and culinary heritage"
              items={culture}
              columns={cultureColumns}
              searchPlaceholder="Search crafts by title or artisan..."
              filterOptions={[
                { label: 'District', key: 'district', values: ['Srinagar', 'Budgam', 'Anantnag', 'All Regions'] }
              ]}
              onAddNew={() => handleOpenAdd('culture')}
              onEdit={(item) => handleOpenEdit('culture', item)}
              onView={(item) => handleOpenView('culture', item)}
              onDelete={(id) => handleDeleteItem('culture', id)}
              onToggleStatus={(item) => handleToggleStatus('culture', item)}
              statusAccessor={(item) => item.status}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'poems' && (
            <CrudTableModule
              title="Kashmiri Poetry, Vakhs & Shruks Treasury"
              subtitle="Translations and original Koshur manuscripts of Lal Ded and Sheikh-ul-Alam"
              items={poems}
              columns={poemColumns}
              searchPlaceholder="Search poetry by poet, theme, or verse..."
              filterOptions={[
                { label: 'Theme', key: 'theme', values: ['Universal Harmony', 'Nature & Ecology', 'Inner Peace', 'Divine Love'] }
              ]}
              onAddNew={() => handleOpenAdd('poems')}
              onEdit={(item) => handleOpenEdit('poems', item)}
              onView={(item) => handleOpenView('poems', item)}
              onDelete={(id) => handleDeleteItem('poems', id)}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'folklore' && (
            <CrudTableModule
              title="Elder Oral History & Folklore Archive"
              subtitle="Recorded stories, village legends, and elder oral traditions across Valley districts"
              items={folklore}
              columns={folkloreColumns}
              searchPlaceholder="Search stories by narrator, title, or district..."
              filterOptions={[
                { label: 'District', key: 'district', values: ['Budgam', 'Anantnag', 'Srinagar', 'Baramulla'] }
              ]}
              onAddNew={() => handleOpenAdd('folklore')}
              onEdit={(item) => handleOpenEdit('folklore', item)}
              onView={(item) => handleOpenView('folklore', item)}
              onDelete={(id) => handleDeleteItem('folklore', id)}
              onToggleStatus={(item) => handleToggleStatus('folklore', item)}
              statusAccessor={(item) => item.status}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'photos' && (
            <CrudTableModule
              title="Photo Gallery & Archival Images"
              subtitle="High-resolution photography of shrines, landscapes, and craft workshops"
              items={photos}
              columns={photoColumns}
              searchPlaceholder="Search photos by title, photographer, or district..."
              filterOptions={[
                { label: 'District', key: 'district', values: ['Srinagar', 'Budgam', 'Anantnag', 'Ganderbal'] }
              ]}
              onAddNew={() => handleOpenAdd('photos')}
              onEdit={(item) => handleOpenEdit('photos', item)}
              onView={(item) => handleOpenView('photos', item)}
              onDelete={(id) => handleDeleteItem('photos', id)}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'ads' && (
            <CrudTableModule
              title="Clickable Popup Advertisements"
              subtitle="Manage promotional banners, reach destinations (WhatsApp, Website, Call, Email), and 5-10s timed popups"
              items={ads}
              columns={adColumns}
              searchPlaceholder="Search ads by headline, brand, or reach link..."
              filterOptions={[
                { label: 'Action Type', key: 'targetType', values: ['whatsapp', 'website', 'phone', 'email'] },
                { label: 'Status', key: 'status', values: ['Active', 'Paused'] }
              ]}
              onAddNew={() => handleOpenAdd('ads')}
              onEdit={(item) => handleOpenEdit('ads', item)}
              onView={(item) => handleOpenView('ads', item)}
              onDelete={(id) => handleDeleteItem('ads', id)}
              onToggleStatus={(item) => handleToggleStatus('ads', item)}
              statusAccessor={(item) => item.status || 'Active'}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'sponsors' && (
            <CrudTableModule
              title="Heritage Sponsors & Patrons"
              subtitle="Manage cultural foundations, institutional partners, and public sponsor directory showcase"
              items={sponsors}
              columns={sponsorColumns}
              searchPlaceholder="Search sponsors by name, tier, or website..."
              filterOptions={[
                { label: 'Tier', key: 'tier', values: ['Title Sponsor', 'Platinum Patron', 'Gold Partner', 'Cultural Heritage Supporter'] },
                { label: 'Status', key: 'status', values: ['Active', 'Paused'] }
              ]}
              onAddNew={() => handleOpenAdd('sponsors')}
              onEdit={(item) => handleOpenEdit('sponsors', item)}
              onView={(item) => handleOpenView('sponsors', item)}
              onDelete={(id) => handleDeleteItem('sponsors', id)}
              onToggleStatus={(item) => handleToggleStatus('sponsors', item)}
              statusAccessor={(item) => item.status || 'Active'}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'categories' && (
            <CrudTableModule
              title="Taxonomy Categories & Tags"
              subtitle="Organize site navigation categories and tag metadata"
              items={categories}
              columns={categoryColumns}
              searchPlaceholder="Search categories..."
              onAddNew={() => handleOpenAdd('categories')}
              onEdit={(item) => handleOpenEdit('categories', item)}
              onView={(item) => handleOpenView('categories', item)}
              onDelete={(id) => handleDeleteItem('categories', id)}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'users' && (
            <UsersModule
              users={users}
              currentUser={currentUser}
              onSaveUser={async (user) => {
                try {
                  await SupabaseService.saveUser(user);
                  if ((user.id && currentUser?.id && user.id === currentUser.id) || (user.email && currentUser?.email && user.email.toLowerCase() === currentUser.email.toLowerCase())) {
                    onUpdateCurrentUser(user);
                  }
                  await SupabaseService.addActivityLog({
                    user: currentUser?.name || 'Admin',
                    action: `Saved User Profile (${user.role})`,
                    target: user.name,
                    badgeType: 'update'
                  }).catch(() => {});
                  addToast('success', 'User Saved', `${user.name}'s profile was updated.`);
                  await refreshData();
                } catch (err: any) {
                  addToast('error', 'Save Failed', err?.message || 'Could not save user.');
                }
              }}
              onDeleteUser={async (id) => {
                try {
                  const uName = users.find(u => u.id === id)?.name || id;
                  await SupabaseService.deleteUser(id);
                  await SupabaseService.addActivityLog({
                    user: currentUser?.name || 'Admin',
                    action: 'Deleted User Profile',
                    target: uName,
                    badgeType: 'delete'
                  }).catch(() => {});
                  addToast('warning', 'User Removed', `${uName} was removed.`);
                  await refreshData();
                } catch (err: any) {
                  addToast('error', 'Delete Failed', err?.message || 'Could not delete user.');
                }
              }}
              onUpdateCurrentUser={onUpdateCurrentUser}
            />
          )}

          {activeTab === 'settings' && settings && (
            <SettingsModule
              settings={settings}
              onSaveSettings={async (st) => {
                await SupabaseService.updateSettings(st);
                await SupabaseService.addActivityLog({
                  user: currentUser?.name || 'Admin',
                  action: 'Updated System Settings',
                  target: 'Site Configuration',
                  badgeType: 'update'
                }).catch(() => {});
                addToast('success', 'Settings Saved', 'System configuration has been updated.');
                await refreshData();
              }}
            />
          )}

        </main>

      </div>

      {/* Global Form & Detail View Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formModalMode}
        moduleType={formModalModule}
        initialData={formInitialData}
        onSave={handleSaveItem}
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismiss} />

    </div>
  );
};
