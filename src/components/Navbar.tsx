import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  Compass,
  Search,
  Bookmark,
  BookOpen,
  Feather,
  Image as ImageIcon,
  Menu,
  X,
  ShieldCheck,
  Info,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenAdminLogin: () => void;
  bookmarkedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenBookmarks,
  onOpenAdminLogin,
  bookmarkedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home',     label: 'Home',        icon: BookOpen   },
    { id: 'saints',   label: 'Sufi Saints', icon: Compass    },
    { id: 'poetry',   label: 'Poetry',      icon: Feather    },
    { id: 'gallery',  label: 'Gallery',     icon: ImageIcon  },
    { id: 'sponsors', label: 'Sponsors',    icon: Sparkles   },
    { id: 'about',    label: 'About',       icon: Info       },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070A]/98 backdrop-blur-xl shadow-2xl shadow-black/40'
          : 'bg-[#09090B]'
      } border-b border-white/[0.06]`}
    >
      {/* ── TOP ANNOUNCEMENT BAR ────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#3B0000] via-[#450A0A] to-[#3B0000] border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8 gap-4">

          {/* Marquee */}
          <div className="flex-1 overflow-hidden flex items-center min-w-0">
            <div className="animate-marquee text-[10px] sm:text-[11px] text-amber-200/70 font-ui font-medium tracking-wide whitespace-nowrap">
              <span className="mr-10">✦ Voice of Sufism — Documenting Kashmir's Sufi Shrines, Reshi Culture &amp; Mystical Poetry</span>
              <span className="mr-10">✦ "Ann poshi teli yeli wan poshi" — Sheikh-ul-Alam Nund Reshi, Patron Saint of Kashmir</span>
              <span className="mr-10">✦ Registered under MSME · Govt. of India · Authentic Heritage Publication</span>
              <span className="mr-10">✦ Voice of Sufism — Documenting Kashmir's Sufi Shrines, Reshi Culture &amp; Mystical Poetry</span>
              <span className="mr-10">✦ "Ann poshi teli yeli wan poshi" — Sheikh-ul-Alam Nund Reshi, Patron Saint of Kashmir</span>
            </div>
          </div>

          {/* Admin shortcut — icon only on desktop to keep it subtle */}
          <button
            onClick={onOpenAdminLogin}
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-ui font-semibold text-amber-400/80 hover:text-amber-300 hover:bg-white/5 transition-colors border border-white/[0.06]"
            title="Editorial CMS Login"
          >
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>

      {/* ── MAIN HEADER BAR ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px] sm:h-[68px] gap-4">

          {/* Brand / Logo */}
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
            aria-label="Voice of Sufism — Home"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-ui font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-amber-300 bg-amber-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/[0.06] text-[13px] font-ui font-medium"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-xs">Search</span>
            </button>

            {/* Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-all border border-white/[0.06]"
              aria-label="Saved Stories"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-bold font-ui flex items-center justify-center shadow">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg lg:hidden text-slate-400 hover:text-white hover:bg-white/5 border border-white/[0.06] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU DRAWER ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[92px] sm:top-[100px] bottom-0 bg-[#08080A]/98 backdrop-blur-2xl z-50 flex flex-col animate-fadeIn overflow-y-auto">

          {/* Search bar inside mobile menu */}
          <div className="px-5 pt-5">
            <button
              onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-slate-400 text-sm font-ui text-left"
            >
              <Search className="w-4 h-4 text-amber-400/70" />
              <span>Search stories, saints, shrines…</span>
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-5 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-ui font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
          </nav>

          {/* Footer strip */}
          <div className="px-5 pb-8 pt-4 border-t border-white/[0.06] space-y-3">
            <button
              onClick={() => { onOpenAdminLogin(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-ui font-bold shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin CMS Dashboard</span>
            </button>
            <p className="text-center font-editorial text-xs text-amber-300/50 italic">
              صداۓ تصوف — Kashmir's Sufi Heritage
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
