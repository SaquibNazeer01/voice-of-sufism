import React, { useState, useEffect, useCallback } from 'react';
import { Article, CategoryType, DistrictRegion } from './types';
import { SiteSettings, CmsUser } from './types/cms';
import { SupabaseService } from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { AlertTriangle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ArticleCard } from './components/ArticleCard';
import { ReadingViewModal } from './components/ReadingViewModal';
import { PoetryTreasury } from './components/PoetryTreasury';
import { SaintsDirectory } from './components/SaintsDirectory';
import { PhotoGallery } from './components/PhotoGallery';
import { SponsorsShowcase } from './components/SponsorsShowcase';
import { AdvertisementPopup } from './components/AdvertisementPopup';
import { AboutUs } from './components/AboutUs';
import { BookmarkDrawer } from './components/BookmarkDrawer';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboardLayout } from './components/admin/AdminDashboardLayout';
import { AppearanceToggleModal, ThemeMode, FontSize, FontFamily } from './components/AppearanceToggleModal';
import { SufiChatbotWidget } from './components/SufiChatbotWidget';
import { Search, X, Compass, BookOpen, Feather, Filter, ShieldCheck, Sliders } from 'lucide-react';
import { parseArticleSlugFromHash, findArticleBySlug, generateSlug } from './lib/shareUtils';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isArticlesLoading, setIsArticlesLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedRegion, setSelectedRegion] = useState<DistrictRegion>('All Regions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Admin CMS State with localStorage persistence across browser refresh
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [authenticatedAdminUser, setAuthenticatedAdminUser] = useState<CmsUser | null>(() => {
    try {
      const saved = localStorage.getItem('voice_of_sufism_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isShowingAdminDashboard, setIsShowingAdminDashboard] = useState<boolean>(() => {
    try {
      const inAdmin = localStorage.getItem('voice_of_sufism_in_admin_mode');
      const hasSession = localStorage.getItem('voice_of_sufism_admin_session');
      return inAdmin === 'true' && Boolean(hasSession);
    } catch {
      return false;
    }
  });

  // Fetch live articles and settings from Supabase (clean slate: no dummy data)
  const refreshArticles = useCallback(async () => {
    setIsArticlesLoading(true);
    try {
      const data = await SupabaseService.getArticles();
      setArticles(data || []);
    } catch {
      setArticles([]);
    } finally {
      setIsArticlesLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshArticles();
    SupabaseService.getSettings().then(settings => setSiteSettings(settings));
  }, [refreshArticles, isShowingAdminDashboard]);
  
  // Global Appearance & Reader Theme State with localStorage persistence
  const [globalTheme, setGlobalTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('voice_of_sufism_theme') as ThemeMode;
      return (saved === 'ivory' || saved === 'sepia' || saved === 'dark') ? saved : 'ivory';
    } catch {
      return 'ivory';
    }
  });

  const [globalFontSize, setGlobalFontSize] = useState<FontSize>(() => {
    try {
      const saved = localStorage.getItem('voice_of_sufism_fontsize') as FontSize;
      return (saved === 'sm' || saved === 'md' || saved === 'lg' || saved === 'xl') ? saved : 'md';
    } catch {
      return 'md';
    }
  });

  const [globalFontFamily, setGlobalFontFamily] = useState<FontFamily>(() => {
    try {
      const saved = localStorage.getItem('voice_of_sufism_fontfamily') as FontFamily;
      return (saved === 'serif' || saved === 'sans') ? saved : 'serif';
    } catch {
      return 'serif';
    }
  });

  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState<boolean>(false);

  const [selectedArticleForReading, setSelectedArticleForReading] = useState<Article | null>(null);

  // ── URL hash deep-linking ─────────────────────────────────
  // When articles are loaded, check if the URL hash points to a specific article.
  // Also listens to browser popstate (back/forward navigation).
  useEffect(() => {
    if (articles.length === 0) return;
    const tryOpenFromHash = (hash: string) => {
      const slug = parseArticleSlugFromHash(hash);
      if (slug) {
        const found = findArticleBySlug(articles, slug);
        if (found) setSelectedArticleForReading(found);
      }
    };
    // Check on load
    tryOpenFromHash(window.location.hash);
    // Listen to popstate (browser back/forward)
    const onPopState = () => tryOpenFromHash(window.location.hash);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [articles]);

  // Update URL hash when an article is opened or closed
  const openArticle = useCallback((article: Article) => {
    const slug = generateSlug(article.title);
    window.history.pushState(null, '', `#/article/${slug}`);
    setSelectedArticleForReading(article);
  }, []);

  const closeArticle = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    setSelectedArticleForReading(null);
  }, []);

  // Sync theme & typography to localStorage & document root
  useEffect(() => {
    try {
      localStorage.setItem('voice_of_sufism_theme', globalTheme);
      localStorage.setItem('voice_of_sufism_fontsize', globalFontSize);
      localStorage.setItem('voice_of_sufism_fontfamily', globalFontFamily);
      
      // Update document root classes for global inheritance
      document.documentElement.classList.remove('theme-ivory', 'theme-sepia', 'theme-dark');
      document.documentElement.classList.add(`theme-${globalTheme}`);
    } catch {}
  }, [globalTheme, globalFontSize, globalFontFamily]);

  useEffect(() => {
    try {
      if (authenticatedAdminUser) {
        localStorage.setItem('voice_of_sufism_admin_session', JSON.stringify(authenticatedAdminUser));
      } else {
        localStorage.removeItem('voice_of_sufism_admin_session');
      }
    } catch {}
  }, [authenticatedAdminUser]);

  useEffect(() => {
    try {
      if (isShowingAdminDashboard && authenticatedAdminUser) {
        localStorage.setItem('voice_of_sufism_in_admin_mode', 'true');
      } else {
        localStorage.setItem('voice_of_sufism_in_admin_mode', 'false');
      }
    } catch {}
  }, [isShowingAdminDashboard, authenticatedAdminUser]);
  
  // Bookmarks saved in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('voice_of_sufism_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('voice_of_sufism_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [bookmarkedIds]);

  const handleToggleBookmark = (articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleClearAllBookmarks = () => {
    setBookmarkedIds([]);
  };

  // Filter articles
  const categoriesList: CategoryType[] = [
    'All',
    'Sufi Saints',
    'Sacred Shrines',
    'Language & Poetry',
    'Architecture & Heritage',
    'Culture & Folklore',
    'Crafts & Traditions'
  ];

  const regionsList: DistrictRegion[] = [
    'All Regions',
    'Srinagar',
    'Budgam',
    'Anantnag',
    'Baramulla',
    'Ganderbal',
    'Pulwama',
    'Shopian',
    'Kupwara',
    'Bandipora',
    'Kulgam',
    'Jammu',
    'Kathua',
    'Udhampur',
    'Reasi',
    'Rajouri',
    'Poonch',
    'Doda',
    'Ramban',
    'Kishtwar',
    'Samba'
  ];

  const availableTags = Array.from(
    new Set(articles.flatMap(a => a.tags || []))
  );

  const filteredArticles = articles.filter(article => {
    if (!article) return false;
    // Hide drafts from public site
    if (article.status === 'Draft') return false;
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesRegion = selectedRegion === 'All Regions' || article.region === selectedRegion;
    const matchesTag = !selectedTag || (article.tags && article.tags.includes(selectedTag));
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (article.title || '').toLowerCase().includes(searchLower) ||
      (article.subtitle || '').toLowerCase().includes(searchLower) ||
      (article.excerpt || '').toLowerCase().includes(searchLower) ||
      (article.locationName || '').toLowerCase().includes(searchLower) ||
      (article.author || '').toLowerCase().includes(searchLower) ||
      (article.contentMarkdown || '').toLowerCase().includes(searchLower);

    return matchesCategory && matchesRegion && matchesTag && matchesSearch;
  });

  const featuredStory = articles.find(a => a.featured) || articles[0] || null;
  const bookmarkedArticles = articles.filter(a => bookmarkedIds.includes(a.id));

  const isMaintenanceMode = siteSettings?.maintenanceMode === true;

  const getGlobalThemeClass = () => {
    switch (globalTheme) {
      case 'sepia': return 'bg-[#F4EFEA] text-[#2B231B]';
      case 'dark': return 'bg-[#09090B] text-slate-100';
      default: return 'bg-[#FAF8F5] text-slate-900';
    }
  };

  const getGlobalFontSizeClass = () => {
    switch (globalFontSize) {
      case 'sm': return 'text-xs sm:text-sm';
      case 'lg': return 'text-base sm:text-lg';
      case 'xl': return 'text-lg sm:text-xl';
      default: return 'text-sm sm:text-base';
    }
  };

  // If active in CMS Dashboard Mode
  if (isShowingAdminDashboard && authenticatedAdminUser) {
    return (
      <AdminDashboardLayout
        currentUser={authenticatedAdminUser}
        onUpdateCurrentUser={(updatedUser) => setAuthenticatedAdminUser(updatedUser)}
        onLogout={() => {
          setAuthenticatedAdminUser(null);
          setIsShowingAdminDashboard(false);
        }}
        onReturnToPublicSite={() => {
          setIsShowingAdminDashboard(false);
          // Re-fetch all public data so changes are immediately visible
          refreshArticles();
          SupabaseService.getSettings().then(settings => setSiteSettings(settings));
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen theme-${globalTheme} font-size-${globalFontSize} font-family-${globalFontFamily} antialiased selection:bg-amber-300 selection:text-slate-900 flex flex-col justify-between transition-colors duration-300`}>

      {/* Maintenance Mode Banner */}
      {isMaintenanceMode && (
        <div className="bg-amber-500 text-black px-4 py-3 text-center font-bold text-sm flex items-center justify-center space-x-2 z-50 relative">
          <AlertTriangle className="w-5 h-5" />
          <span>🚧 This site is currently under maintenance. Some features may be temporarily unavailable. We'll be back shortly!</span>
          <AlertTriangle className="w-5 h-5" />
        </div>
      )}
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenAdminLogin={() => {
          if (authenticatedAdminUser) {
            setIsShowingAdminDashboard(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        bookmarkedCount={bookmarkedIds.length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-0 pb-20">
            
            {/* Magazine Cover Hero */}
            <HeroSection
              featuredArticle={featuredStory}
              onReadArticle={openArticle}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className={`border-t ${globalTheme === 'dark' ? 'border-white/[0.06]' : 'border-slate-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              
              {/* Category & Region Filter Controls */}
              <CategoryFilter
                categories={categoriesList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                regions={regionsList}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                availableTags={availableTags}
                themeMode={globalTheme}
              />

              {/* Section Header */}
              <div className={`flex items-center justify-between pb-4 border-b ${globalTheme === 'dark' ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                <div className="space-y-0.5">
                  <div className={`flex items-center gap-2 text-[11px] font-ui font-bold uppercase tracking-widest ${globalTheme === 'dark' ? 'text-amber-400' : 'text-red-800'}`}>
                    <Feather className="w-3.5 h-3.5" />
                    <span>Curated Stories &amp; Research</span>
                  </div>
                  <h2 className={`font-editorial text-2xl sm:text-3xl font-bold ${globalTheme === 'dark' ? 'text-white' : globalTheme === 'sepia' ? 'text-[#2B231B]' : 'text-slate-900'}`}>
                    {selectedCategory === 'All' ? 'Latest Heritage Articles' : `${selectedCategory} Stories`}
                  </h2>
                </div>

                <span className={`text-[11px] font-ui font-semibold px-3 py-1.5 rounded-full border ${globalTheme === 'dark' ? 'bg-white/5 text-slate-300 border-white/10' : globalTheme === 'sepia' ? 'bg-[#FAF5EE] text-[#2B231B] border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'Story' : 'Stories'}
                </span>
              </div>

              {/* Articles Grid */}
              {filteredArticles.length === 0 ? (
                <div className={`rounded-3xl p-12 text-center border space-y-4 ${globalTheme === 'dark' ? 'bg-[#121214] border-red-900 text-white' : globalTheme === 'sepia' ? 'bg-[#FAF5EE] border-amber-300 text-[#2B231B]' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className={`font-serif text-2xl font-bold ${globalTheme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {articles.length === 0 ? 'No Articles Published Yet' : 'No stories found'}
                  </h3>
                  <p className={`text-sm max-w-md mx-auto ${globalTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {articles.length === 0
                      ? 'The archive database is clean. Log in to the Admin Dashboard to publish your first authentic research article or cultural story.'
                      : 'Try adjusting your category filter, district region, or search query.'}
                  </p>
                  {articles.length === 0 ? (
                    <button
                      onClick={() => {
                        if (authenticatedAdminUser) {
                          setIsShowingAdminDashboard(true);
                        } else {
                          setIsAdminLoginOpen(true);
                        }
                      }}
                      className="px-6 py-3 rounded-xl bg-red-900 hover:bg-red-800 text-amber-300 font-bold text-xs shadow-lg border border-amber-400/40 inline-flex items-center space-x-2 transition-transform hover:scale-105"
                    >
                      <Feather className="w-4 h-4 text-amber-300" />
                      <span>Create New Article in Dashboard</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedRegion('All Regions');
                        setSearchQuery('');
                        setSelectedTag('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-red-900 text-amber-300 font-bold text-xs shadow border border-amber-400/40"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredArticles.map(art => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      onReadArticle={openArticle}
                      isBookmarked={bookmarkedIds.includes(art.id)}
                      onToggleBookmark={handleToggleBookmark}
                      themeMode={globalTheme}
                    />
                  ))}
                </div>
              )}

              {/* Poetry Spotlight Banner */}
              <div className={`relative overflow-hidden rounded-2xl border ${globalTheme === 'dark' ? 'bg-[#0D0A00] border-amber-500/10' : 'bg-gradient-to-r from-[#1A0000] to-[#200505] border-amber-500/10'} p-8 sm:p-10`}>
                {/* Background geometric pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, #FBBF24 1px, transparent 1px)', backgroundSize: '28px 28px'}} />
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Feather className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-amber-400">Sufi Poetry Treasury</span>
                    </div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                      "Ann poshi teli yeli wan poshi"
                    </h3>
                    <p className="font-ui text-sm text-amber-200/70 leading-relaxed">
                      Explore Sheikh Noor-ud-Din Wali's ecological couplets and Lal Ded's mystic Vakhs — translated from original Koshur manuscripts.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('poetry')}
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-ui font-bold text-sm shadow-lg shadow-amber-400/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Feather className="w-4 h-4" />
                    <span>Open Poetry Treasury</span>
                  </button>
                </div>
              </div>

            </div>
            </div>

          </div>
        )}

        {/* Tab 2: Saints & Reshi Masters */}
        {activeTab === 'saints' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SaintsDirectory />
          </div>
        )}

        {/* Tab 3: Vakhs & Shruks Poetry */}
        {activeTab === 'poetry' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PoetryTreasury />
          </div>
        )}



        {/* Tab 5: Archival Photo Gallery */}
        {activeTab === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PhotoGallery />
          </div>
        )}

        {/* Tab 6: Sponsors & Heritage Patrons */}
        {activeTab === 'sponsors' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SponsorsShowcase themeMode={globalTheme} />
          </div>
        )}

        {/* Tab 7: About Us (The Story, Founder & Developer) */}
        {(activeTab === 'about' || activeTab === 'mission') && (
          <AboutUs themeMode={globalTheme} />
        )}
      </main>

      {/* Global Reading View Modal */}
      <ReadingViewModal
        article={selectedArticleForReading}
        onClose={closeArticle}
        isBookmarked={selectedArticleForReading ? bookmarkedIds.includes(selectedArticleForReading.id) : false}
        onToggleBookmark={handleToggleBookmark}
        allArticles={articles}
        onSelectArticle={openArticle}
      />

      {/* Saved Stories Drawer */}
      <BookmarkDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedArticles={bookmarkedArticles}
        onReadArticle={openArticle}
        onRemoveBookmark={(id) => handleToggleBookmark(id)}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Global Quick Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2 text-slate-800">
                <Search className="w-5 h-5 text-red-900" />
                <span className="font-serif font-bold text-lg">Search Voice of Sufism</span>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by saint name, shrine, district, or poem title..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-700 bg-slate-50 text-slate-900"
            />

            <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
              {filteredArticles.slice(0, 5).map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    openArticle(art);
                    setIsSearchModalOpen(false);
                  }}
                  className="p-3.5 rounded-xl hover:bg-red-50 cursor-pointer border border-transparent hover:border-red-200 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] font-bold text-red-900 uppercase">{art.category}</p>
                    <p className="font-serif font-bold text-sm text-slate-900">{art.title}</p>
                    <p className="text-xs text-slate-500">{art.locationName}</p>
                  </div>
                  <span className="text-xs font-bold text-red-900">Read</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdminLogin={() => {
          if (authenticatedAdminUser) {
            setIsShowingAdminDashboard(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(user) => {
          setAuthenticatedAdminUser(user);
          setIsAdminLoginOpen(false);
          setIsShowingAdminDashboard(true);
        }}
      />

      {/* Global Display Theme & Font Preferences Modal */}
      <AppearanceToggleModal
        isOpen={isAppearanceModalOpen}
        onClose={() => setIsAppearanceModalOpen(false)}
        themeMode={globalTheme}
        setThemeMode={setGlobalTheme}
        fontSize={globalFontSize}
        setFontSize={setGlobalFontSize}
        fontFamily={globalFontFamily}
        setFontFamily={setGlobalFontFamily}
      />

      {/* Floating Display Theme & Font Size Quick Trigger */}
      <button
        onClick={() => setIsAppearanceModalOpen(!isAppearanceModalOpen)}
        className="fixed bottom-6 left-5 z-40 px-3.5 py-2.5 rounded-full bg-[#09090B] text-amber-300 border border-amber-400/60 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 backdrop-blur-md group hover:bg-red-950"
        title="Change Global Theme & Font Size"
        aria-label="Theme and Typography Settings"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        <span className="font-serif font-black text-sm text-amber-400">Aa</span>
        <span className="text-xs font-bold text-amber-200 hidden sm:inline group-hover:text-white transition-colors">
          Theme
        </span>
      </button>

      {/* Interactive AI Chatbot Assistant Widget (Website, Owner, Developer, Heritage) */}
      <SufiChatbotWidget 
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Timed Visitor Advertisement Banner Modal (5-10s delay with 5s skip timer) */}
      <AdvertisementPopup />

    </div>
  );
}
