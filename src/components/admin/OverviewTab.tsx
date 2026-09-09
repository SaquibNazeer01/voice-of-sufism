import React, { useState } from 'react';
import { 
  FileText, 
  Compass, 
  MapPin, 
  Feather, 
  Image as ImageIcon, 
  Users, 
  Eye, 
  Plus, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FolderTree,
  BookOpen,
  Landmark,
  ShieldCheck,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Activity,
  Layers
} from 'lucide-react';
import { Article, SufiSaint, HeritageSite, PhotoGalleryItem } from '../../types';
import { CmsUser, CmsCategoryItem, KashmiriCultureItem, FolkloreStory, ActivityLog } from '../../types/cms';
import { AuditLogModal } from './AuditLogModal';

interface OverviewTabProps {
  articles: Article[];
  saints: SufiSaint[];
  sites: HeritageSite[];
  photos: PhotoGalleryItem[];
  culture: KashmiriCultureItem[];
  folklore: FolkloreStory[];
  users: CmsUser[];
  categories: CmsCategoryItem[];
  logs: ActivityLog[];
  onNavigateTab: (tabId: string) => void;
  onOpenCreateModal: (moduleType: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  articles = [],
  saints = [],
  sites = [],
  photos = [],
  culture = [],
  folklore = [],
  users = [],
  categories = [],
  logs = [],
  onNavigateTab,
  onOpenCreateModal
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const safeArticles = articles || [];
  const safeSaints = saints || [];
  const safeSites = sites || [];
  const safePhotos = photos || [];
  const safeCulture = culture || [];
  const safeFolklore = folklore || [];
  const safeUsers = users || [];

  // Stats calculation
  const totalArticles = safeArticles.length;
  const publishedArticles = safeArticles.filter(a => !(a.excerpt && a.excerpt.toLowerCase().includes('draft'))).length;
  const totalSaints = safeSaints.length;
  const totalShrines = safeSites.length;
  const totalPhotos = safePhotos.length;
  const totalCulture = safeCulture.length;
  const totalFolklore = safeFolklore.length;

  // District distribution calculation
  const districts = ['Srinagar', 'Budgam', 'Anantnag', 'Baramulla', 'Ganderbal', 'Pulwama'];
  const districtCounts = districts.map(d => ({
    name: d,
    count: safeArticles.filter(a => a.region === d).length + safeSites.filter(s => s.district === d).length
  }));
  const maxDistrictCount = Math.max(...districtCounts.map(d => d.count), 1);

  // Time-based greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      
      {/* Hero Welcome & Quick Actions Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#091510] via-[#0D281F] to-[#0A1B14] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/3 -mb-16 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>Editorial Command</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PostgreSQL Cloud Sync</span>
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {getGreeting()}, Editorial Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-sans">
              Manage Kashmir's sacred heritage archives, Sufi saint biographies, shrine mapping, poetry manuscripts, and high-resolution photo exhibitions.
            </p>
          </div>

          {/* Quick Create Action Buttons */}
          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => onOpenCreateModal('articles')}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>✍️ New Article</span>
            </button>

            <button
              onClick={() => onOpenCreateModal('saints')}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 text-amber-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>+ Add Saint</span>
            </button>

            <button
              onClick={() => onOpenCreateModal('sites')}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 text-amber-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>+ Add Shrine</span>
            </button>
          </div>

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Articles */}
        <div 
          onClick={() => onNavigateTab('articles')}
          className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {publishedArticles} Live
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalArticles}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Articles & Research Stories</p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium flex items-center justify-between">
            <span>Historical & Spiritual</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 2: Sufi Saints */}
        <div 
          onClick={() => onNavigateTab('saints')}
          className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-amber-400/60 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60">
              Reshi & Sufi Orders
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalSaints}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Cataloged Sufi Saints</p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-medium flex items-center justify-between">
            <span>Reshi, Kubrawi & Suhrawardi</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 3: Shrines & Ziyarats */}
        <div 
          onClick={() => onNavigateTab('sites')}
          className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-teal-400/60 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
              All 10 Districts
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalShrines}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Shrines & Heritage Sites</p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-teal-700 font-medium flex items-center justify-between">
            <span>GPS Mapped Locations</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 4: Photo Gallery & Oral History */}
        <div 
          onClick={() => onNavigateTab('photos')}
          className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-indigo-400/60 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200/60">
              {totalPhotos} Archival Photos
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalPhotos + totalFolklore}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Visual & Oral Archives</p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-indigo-700 font-medium flex items-center justify-between">
            <span>Photos & Oral History</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

      </div>

      {/* Analytics Charts & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
        
        {/* Left Column: Interactive District Distribution */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Heritage Records by District
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of published articles, shrines, and folklore across Kashmir
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60">
              6 Active Regions
            </span>
          </div>

          {/* District Progress Bars */}
          <div className="space-y-4">
            {districtCounts.map((d) => {
              const percentage = Math.round((d.count / maxDistrictCount) * 100);
              return (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="flex items-center space-x-1.5 font-bold text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{d.name}</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{d.count} Heritage Records</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(percentage, 12)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Categories Grid Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Published Taxonomies
              </h4>
              <button
                onClick={() => onNavigateTab('categories')}
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                View All Categories →
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(categories || []).map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => onNavigateTab('categories')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 text-xs flex items-center space-x-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <span className={`w-2 h-2 rounded-full ${cat.colorBadge.split(' ')[0]}`}></span>
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({cat.itemCount})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activity Feed & Quick Actions */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                    Editorial Activity
                  </h3>
                  <p className="text-[11px] text-slate-500">Live action history</p>
                </div>
              </div>

              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>Full Audit Log</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Activity Stream List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {(!logs || logs.length === 0) ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No activity records logged yet.
                </div>
              ) : (
                logs.slice(0, 8).map((log) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-xs space-y-1.5 hover:border-slate-300 hover:bg-slate-50 transition-all">
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0F4C3A] to-emerald-900 text-amber-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {(log.user || 'U').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 truncate">{log.user}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pl-8">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        log.badgeType === 'security' ? 'bg-indigo-50 text-indigo-900 border border-indigo-200' :
                        log.badgeType === 'publish' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        log.badgeType === 'create' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                        log.badgeType === 'delete' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                        'bg-slate-200/80 text-slate-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-slate-700 font-medium truncate max-w-[180px]" title={log.target}>
                        {log.target}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* CMS Users Quick Access Widget */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Editorial Board ({(users || []).length})
              </span>
              <button 
                onClick={() => onNavigateTab('users')}
                className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
              >
                Manage Roles
              </button>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
              {(users || []).map((u) => {
                const safeName = u.name || 'User';
                const parts = safeName.trim().split(' ').filter(Boolean);
                const initials = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : safeName.substring(0, 2).toUpperCase();
                return (
                  <div key={u.id} className="flex items-center space-x-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex-shrink-0 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C3A] to-emerald-950 text-amber-300 font-serif font-bold text-xs flex items-center justify-center border border-emerald-600/60 shadow-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div className="text-[11px]">
                      <p className="font-bold text-slate-900 leading-tight truncate max-w-[100px]">{u.name}</p>
                      <p className="text-emerald-800 font-medium text-[10px]">{u.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={logs}
      />

    </div>
  );
};
