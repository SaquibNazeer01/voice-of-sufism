import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Article, HeritageSite, SufiSaint, PoemVerse, PhotoGalleryItem } from '../types';
import { HERITAGE_SITES_DATA } from '../data/heritageSites';
import { SAINTS_DATA } from '../data/saints';
import { POEMS_DATA } from '../data/poems';
import { PHOTO_GALLERY_DATA } from '../data/galleries';
import {
  Search, X, Clock, Sparkles, MapPin, Feather, Compass,
  BookOpen, Camera, Building2, User, ArrowRight, CornerDownLeft,
  ChevronRight, Trash2, Heart, Award
} from 'lucide-react';

export type SearchEntityType = 'all' | 'shrine' | 'article' | 'saint' | 'poem' | 'photo' | 'page';

interface SearchResultItem {
  id: string;
  type: SearchEntityType;
  typeLabel: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  image?: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel: string;
  score: number;
  onSelect: () => void;
}

interface SuggestedGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: { text: string; category?: SearchEntityType }[];
}

const SUGGESTED_SEARCH_GROUPS: SuggestedGroup[] = [
  {
    label: 'Revered Sufi Saints & Masters',
    icon: Compass,
    color: 'text-violet-400 border-violet-500/20 bg-violet-500/10 hover:bg-violet-500/20',
    items: [
      { text: 'Sheikh-ul-Alam (Nund Reshi)', category: 'saint' },
      { text: 'Lal Ded (Lalleshwari)', category: 'saint' },
      { text: 'Shah-e-Hamadan', category: 'saint' },
      { text: 'Makhdoom Sahib', category: 'saint' },
      { text: 'Baba Zain-ud-Din Wali', category: 'saint' },
      { text: 'Bulbul Shah', category: 'saint' },
    ]
  },
  {
    label: 'Sacred Shrines & Ziyarats',
    icon: Building2,
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20',
    items: [
      { text: 'Charar-i-Sharief', category: 'shrine' },
      { text: 'Khanqah-e-Moula', category: 'shrine' },
      { text: 'Dargah Hazratbal', category: 'shrine' },
      { text: 'Aishmuqam Cave Shrine', category: 'shrine' },
      { text: 'Jamia Masjid Srinagar', category: 'shrine' },
    ]
  },
  {
    label: 'Mystical Poetry, Vakhs & Kalam',
    icon: Feather,
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20',
    items: [
      { text: 'Ann poshi teli yeli wan poshi', category: 'poem' },
      { text: 'Kashmiri Vakhs', category: 'poem' },
      { text: 'Reshi Shruks', category: 'poem' },
      { text: 'Habba Khatoon', category: 'poem' },
      { text: 'Sufiana Kalam', category: 'poem' },
    ]
  },
  {
    label: 'Living Heritage, Architecture & Crafts',
    icon: Camera,
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20',
    items: [
      { text: 'Wooden Pagoda Architecture', category: 'all' },
      { text: 'Khatamband Ceilings', category: 'all' },
      { text: 'Papier-mâché & Wood Carving', category: 'all' },
      { text: 'Pashmina & Kani Weaving', category: 'all' },
      { text: 'Kashmiriyat & Reshi Order', category: 'all' },
    ]
  },
  {
    label: 'Leadership, Mission & Certification',
    icon: Award,
    color: 'text-rose-400 border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20',
    items: [
      { text: 'Bhat Sahil (Founder)', category: 'page' },
      { text: 'Saquib Nazeer (Developer)', category: 'page' },
      { text: 'MSME Registration UDYAM-JK-11-0013563', category: 'page' },
      { text: 'About Voice of Sufism Digital Sanctuary', category: 'page' },
    ]
  }
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onReadArticle: (article: Article) => void;
  onOpenZiyarat: (site: HeritageSite) => void;
  onSelectTab: (tab: string) => void;
  themeMode?: 'ivory' | 'sepia' | 'dark';
}

const RECENT_SEARCHES_KEY = 'vos_recent_searches_v2';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onReadArticle,
  onOpenZiyarat,
  onSelectTab,
  themeMode = 'ivory',
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchEntityType>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 8));
      }
    } catch {
      setRecentSearches([]);
    }
  }, [isOpen]);

  const saveToRecentSearches = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    try {
      const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  // Keyboard navigation & Shortcuts (ESC, Arrow keys, Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1 < filteredResults.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        if (filteredResults[selectedIndex]) {
          e.preventDefault();
          filteredResults[selectedIndex].onSelect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent if state controlled
        }
      }
    };
    window.addEventListener('keydown', handleGlobalShortcut);
    return () => window.removeEventListener('keydown', handleGlobalShortcut);
  }, [isOpen, onClose]);

  // ─────────────────────────────────────────────────────────────
  // OMNI-SEARCH INDEX & TOKEN MATCHING ENGINE
  // ─────────────────────────────────────────────────────────────
  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Shrines / Ziyarats (from HERITAGE_SITES_DATA)
    HERITAGE_SITES_DATA.forEach(site => {
      items.push({
        id: `shrine-${site.id}`,
        type: 'shrine',
        typeLabel: 'Sacred Shrine',
        title: site.name,
        subtitle: `${site.district} · ${site.builtYear} · ${site.type}`,
        description: site.overview || site.historyStory?.slice(0, 160) || '',
        badge: site.district,
        image: site.heroImage,
        icon: Building2,
        actionLabel: 'Open Ziyarat',
        score: 0,
        onSelect: () => {
          saveToRecentSearches(site.name);
          onOpenZiyarat(site);
          onClose();
        }
      });
    });

    // 2. Articles (from prop)
    articles.forEach(art => {
      items.push({
        id: `article-${art.id}`,
        type: 'article',
        typeLabel: 'Curated Story',
        title: art.title,
        subtitle: `${art.category} · ${art.locationName || art.region} · By ${art.author}`,
        description: art.excerpt || art.subtitle || '',
        badge: art.category,
        image: art.heroImage,
        icon: BookOpen,
        actionLabel: 'Read Article',
        score: 0,
        onSelect: () => {
          saveToRecentSearches(art.title);
          onReadArticle(art);
          onClose();
        }
      });
    });

    // 3. Sufi Saints (from SAINTS_DATA)
    SAINTS_DATA.forEach(saint => {
      items.push({
        id: `saint-${saint.id}`,
        type: 'saint',
        typeLabel: 'Sufi Saint',
        title: saint.name,
        subtitle: `${saint.order} Order · ${saint.period} · ${saint.shrineLocation}`,
        description: `${saint.biography.slice(0, 140)}... "${saint.famousSaying.english}"`,
        badge: `${saint.order} Silsila`,
        image: saint.image,
        icon: Compass,
        actionLabel: 'Explore Saint',
        score: 0,
        onSelect: () => {
          saveToRecentSearches(saint.name);
          onSelectTab('saints');
          onClose();
        }
      });
    });

    // 4. Mystical Poetry (from POEMS_DATA)
    POEMS_DATA.forEach(poem => {
      items.push({
        id: `poem-${poem.id}`,
        type: 'poem',
        typeLabel: 'Kashmiri Poetry',
        title: `"${poem.title}"`,
        subtitle: `${poem.poetName} · ${poem.theme}`,
        description: `${poem.englishTranslation} (${poem.historicalContext || ''})`,
        badge: poem.theme,
        icon: Feather,
        actionLabel: 'Recite Kalam',
        score: 0,
        onSelect: () => {
          saveToRecentSearches(poem.title);
          onSelectTab('poetry');
          onClose();
        }
      });
    });

    // 5. Photo Gallery (from PHOTO_GALLERY_DATA)
    PHOTO_GALLERY_DATA.forEach(photo => {
      items.push({
        id: `photo-${photo.id}`,
        type: 'photo',
        typeLabel: 'Archival Photo',
        title: photo.title,
        subtitle: `${photo.location} · ${photo.district} · ${photo.category}`,
        description: photo.caption,
        badge: photo.category,
        image: photo.imageUrl,
        icon: Camera,
        actionLabel: 'View Gallery',
        score: 0,
        onSelect: () => {
          saveToRecentSearches(photo.title);
          onSelectTab('gallery');
          onClose();
        }
      });
    });

    // 6. Platform & Leadership Pages
    items.push({
      id: 'page-founder-sahil',
      type: 'page',
      typeLabel: 'Founder & Visionary',
      title: 'Bhat Sahil (Founder & Director)',
      subtitle: 'Voice of Sufism (صداۓ تصوف) Digital Sanctuary',
      description: 'Dedicated to the perpetual preservation, research, and documentation of Kashmir’s mystical shrines, wooden architecture, and Reshi heritage.',
      badge: 'Founder',
      icon: User,
      actionLabel: 'About Founder',
      score: 0,
      onSelect: () => {
        saveToRecentSearches('Bhat Sahil');
        onSelectTab('about');
        onClose();
      }
    });

    items.push({
      id: 'page-developer-saquib',
      type: 'page',
      typeLabel: 'Lead Software Architect',
      title: 'Saquib Nazeer (Software Engineer)',
      subtitle: 'Technical Architecture & Digital Sanctuary Design',
      description: 'Built with high-performance responsive web architecture to showcase Kashmir’s centuries-old mystical tradition to global seekers.',
      badge: 'Developer',
      icon: User,
      actionLabel: 'Developer Profile',
      score: 0,
      onSelect: () => {
        saveToRecentSearches('Saquib Nazeer');
        onSelectTab('about');
        onClose();
      }
    });

    items.push({
      id: 'page-msme-reg',
      type: 'page',
      typeLabel: 'Legal Entity & Recognition',
      title: 'MSME Registered Entity (UDYAM-JK-11-0013563)',
      subtitle: 'Govt. of India Certified Non-Profit Heritage Publication',
      description: 'Recognized research body safeguarding the cultural, architectural, and spiritual legacy of Jammu & Kashmir.',
      badge: 'Govt. of India',
      icon: Award,
      actionLabel: 'View Accreditation',
      score: 0,
      onSelect: () => {
        saveToRecentSearches('MSME Registration');
        onSelectTab('about');
        onClose();
      }
    });

    items.push({
      id: 'page-about-sanctuary',
      type: 'page',
      typeLabel: 'Digital Sanctuary',
      title: 'About Voice of Sufism (صداۓ تصوف)',
      subtitle: 'Independent Cultural Heritage Preservation Archive',
      description: 'Comprehensive biographies of Reshi, Kubrawi, Suhrawardi, and Qadiri masters, Vakhs, Shruks, and wooden pagoda shrines.',
      badge: 'About Us',
      icon: Heart,
      actionLabel: 'Our Story',
      score: 0,
      onSelect: () => {
        saveToRecentSearches('Voice of Sufism');
        onSelectTab('about');
        onClose();
      }
    });

    return items;
  }, [articles, onReadArticle, onOpenZiyarat, onSelectTab, onClose]);

  // Compute search matches with ranking
  const filteredResults = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return [];

    const tokens = raw.split(/\s+/).filter(t => t.length > 0);

    const scored = allSearchableItems
      .map(item => {
        const titleLower = item.title.toLowerCase();
        const subtitleLower = (item.subtitle || '').toLowerCase();
        const descLower = item.description.toLowerCase();
        const badgeLower = (item.badge || '').toLowerCase();
        const typeLower = item.typeLabel.toLowerCase();

        const combined = `${titleLower} ${subtitleLower} ${descLower} ${badgeLower} ${typeLower}`;

        // Check if every token is matched somewhere
        const matchesAllTokens = tokens.every(token => combined.includes(token));
        if (!matchesAllTokens) return null;

        // Calculate relevance score
        let score = 0;
        if (titleLower === raw) score += 150;
        else if (titleLower.startsWith(raw)) score += 100;
        else if (titleLower.includes(raw)) score += 70;

        tokens.forEach(token => {
          if (titleLower.includes(token)) score += 30;
          if (badgeLower.includes(token)) score += 20;
          if (subtitleLower.includes(token)) score += 15;
          if (descLower.includes(token)) score += 5;
        });

        // Slight priority to Shrines and Articles
        if (item.type === 'shrine') score += 10;
        if (item.type === 'article') score += 8;

        return { ...item, score };
      })
      .filter((item): item is SearchResultItem => item !== null)
      .sort((a, b) => b.score - a.score);

    // Apply category filter if active
    if (activeFilter === 'all') return scored;
    return scored.filter(item => item.type === activeFilter);
  }, [query, activeFilter, allSearchableItems]);

  // Count items per category
  const filterCounts = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return { all: 0, shrine: 0, article: 0, saint: 0, poem: 0, photo: 0, page: 0 };

    const tokens = raw.split(/\s+/).filter(t => t.length > 0);
    const counts: Record<SearchEntityType, number> = {
      all: 0, shrine: 0, article: 0, saint: 0, poem: 0, photo: 0, page: 0
    };

    allSearchableItems.forEach(item => {
      const combined = `${item.title} ${item.subtitle || ''} ${item.description} ${item.badge || ''} ${item.typeLabel}`.toLowerCase();
      if (tokens.every(token => combined.includes(token))) {
        counts.all++;
        counts[item.type]++;
      }
    });

    return counts;
  }, [query, allSearchableItems]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Text highlight helper
  const renderHighlighted = (text: string) => {
    if (!query.trim()) return text;
    const tokens = query.trim().split(/\s+/).filter(t => t.length > 0);
    const regex = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-400/30 text-amber-300 font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-start justify-center p-3 sm:p-6 md:p-10 animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search"
    >
      <div className="w-full max-w-3xl bg-[#0F0F12] border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">

        {/* ── SEARCH INPUT HEADER ── */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-[#18181D] to-[#121216] border-b border-white/[0.08] space-y-3">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-amber-400">
                Voice of Sufism — Omni Search
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-ui text-slate-400">
                <span>ESC</span> to close
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search anything: saint, shrine, poem, vakh, district, craft, founder…"
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-black/50 border border-amber-500/30 text-white placeholder-slate-400 text-sm sm:text-base font-ui focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all shadow-inner"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills when query is active */}
          {query.trim().length > 0 && filterCounts.all > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All Results' },
                  { id: 'shrine', label: 'Shrines' },
                  { id: 'article', label: 'Articles' },
                  { id: 'saint', label: 'Saints' },
                  { id: 'poem', label: 'Poetry' },
                  { id: 'photo', label: 'Photos' },
                  { id: 'page', label: 'Leadership' },
                ] as const
              ).map((f) => {
                const count = filterCounts[f.id];
                if (f.id !== 'all' && count === 0) return null;
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveFilter(f.id);
                      setSelectedIndex(0);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-ui font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/[0.06]'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── MODAL CONTENT BODY ── */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[60vh] scrollbar-thin scrollbar-thumb-white/10"
        >
          {/* STATE 1: SUGGESTED SEARCHES & RECENT HISTORY (WHEN QUERY IS EMPTY) */}
          {query.trim().length === 0 ? (
            <div className="space-y-6">

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-ui font-bold uppercase tracking-wider text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      onClick={clearAllRecentSearches}
                      className="text-[11px] font-ui text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          saveToRecentSearches(term);
                        }}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.08] hover:border-amber-400/40 text-slate-200 text-xs font-ui transition-all hover:scale-105"
                      >
                        <Clock className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        <span>{term}</span>
                        <span
                          onClick={(e) => removeRecentSearch(term, e)}
                          className="text-slate-500 hover:text-red-400 p-0.5 rounded hover:bg-white/10 transition-colors"
                          title="Remove"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorized Suggested Searches */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-ui font-bold uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suggested Searches &amp; Revered Topics</span>
                </div>

                <div className="space-y-4">
                  {SUGGESTED_SEARCH_GROUPS.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                      <div key={group.label} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-ui font-medium text-slate-400">
                          <GroupIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span>{group.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <button
                              key={item.text}
                              onClick={() => {
                                setQuery(item.text);
                                saveToRecentSearches(item.text);
                                if (item.category && item.category !== 'all') {
                                  setActiveFilter(item.category);
                                }
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-ui font-medium transition-all duration-200 hover:scale-105 ${group.color}`}
                            >
                              <span>{item.text}</span>
                              <ChevronRight className="w-3 h-3 opacity-60" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : filteredResults.length === 0 ? (
            /* STATE 2: NO RESULTS FOUND */
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-400">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-editorial text-xl font-bold text-white">
                  No sacred records found for "{query}"
                </h4>
                <p className="font-ui text-xs text-slate-400 max-w-sm mx-auto">
                  Try searching with keywords like <span className="text-amber-300">Sheikh-ul-Alam</span>, <span className="text-amber-300">Charar-i-Sharief</span>, <span className="text-amber-300">Hazratbal</span>, or <span className="text-amber-300">Vakhs</span>.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['Charar-i-Sharief', 'Sheikh-ul-Alam', 'Lal Ded', 'Kashmiri Vakhs', 'Khanqah-e-Moula'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/10 text-xs font-ui transition-colors"
                  >
                    Try "{term}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* STATE 3: MATCHING RESULTS LIST */
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-ui text-slate-400 pb-1">
                <span>Found {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}</span>
                <span className="hidden sm:inline">Use ↑ ↓ keys to navigate · Enter to select</span>
              </div>

              {filteredResults.map((item, idx) => {
                const ItemIcon = item.icon;
                const isSelected = selectedIndex === idx;

                return (
                  <div
                    key={item.id}
                    data-index={idx}
                    onClick={item.onSelect}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400/60 shadow-lg shadow-amber-500/5 translate-x-1'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      
                      {/* Image or Icon Preview */}
                      {item.image ? (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
                          <ItemIcon className="w-6 h-6" />
                        </div>
                      )}

                      {/* Content details */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-ui font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.type === 'shrine'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.type === 'article'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : item.type === 'saint'
                              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                              : item.type === 'poem'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : item.type === 'photo'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {item.typeLabel}
                          </span>

                          {item.badge && (
                            <span className="text-[10px] font-ui text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/[0.06]">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="font-editorial text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {renderHighlighted(item.title)}
                        </h4>

                        {item.subtitle && (
                          <p className="font-ui text-xs text-slate-400 truncate">
                            {renderHighlighted(item.subtitle)}
                          </p>
                        )}

                        <p className="font-ui text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {renderHighlighted(item.description)}
                        </p>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-ui font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                      <span className="hidden sm:inline">{item.actionLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── FOOTER HINT BAR ── */}
        <div className="px-5 py-3 bg-[#0A0A0C] border-t border-white/[0.08] flex items-center justify-between text-xs font-ui text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-amber-400" />
              <span>Select item</span>
            </span>
            <span className="hidden sm:inline text-white/10">|</span>
            <span className="hidden sm:inline">Ctrl + K to toggle search</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Voice of Sufism Digital Archive</span>
          </div>
        </div>

      </div>
    </div>
  );
};
