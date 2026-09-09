import React, { useState } from 'react';
import { CategoryType, DistrictRegion } from '../types';
import { Search, MapPin, X, RotateCcw, ChevronDown } from 'lucide-react';

interface CategoryFilterProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  regions: DistrictRegion[];
  selectedRegion: DistrictRegion;
  setSelectedRegion: (region: DistrictRegion) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  availableTags: string[];
  themeMode?: 'ivory' | 'sepia' | 'dark';
}

// Category accent colors
const CATEGORY_COLORS: Record<string, string> = {
  'All':                    'bg-slate-900 text-white border-slate-900',
  'Sufi Saints':            'bg-violet-600 text-white border-violet-600',
  'Sacred Shrines':         'bg-red-700 text-white border-red-700',
  'Language & Poetry':      'bg-sky-700 text-white border-sky-700',
  'Architecture & Heritage':'bg-amber-700 text-white border-amber-700',
  'Culture & Folklore':     'bg-emerald-700 text-white border-emerald-700',
  'Crafts & Traditions':    'bg-rose-700 text-white border-rose-700',
};

const CATEGORY_INACTIVE: Record<string, string> = {
  'All':                    'text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900',
  'Sufi Saints':            'text-violet-700 border-violet-100 hover:border-violet-300 hover:bg-violet-50',
  'Sacred Shrines':         'text-red-700 border-red-100 hover:border-red-300 hover:bg-red-50',
  'Language & Poetry':      'text-sky-700 border-sky-100 hover:border-sky-300 hover:bg-sky-50',
  'Architecture & Heritage':'text-amber-700 border-amber-100 hover:border-amber-300 hover:bg-amber-50',
  'Culture & Folklore':     'text-emerald-700 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50',
  'Crafts & Traditions':    'text-rose-700 border-rose-100 hover:border-rose-300 hover:bg-rose-50',
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  regions,
  selectedRegion,
  setSelectedRegion,
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  availableTags,
  themeMode = 'ivory',
}) => {
  const [showRegion, setShowRegion] = useState(false);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedRegion !== 'All Regions' ||
    selectedTag !== '' ||
    searchQuery !== '';

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedRegion('All Regions');
    setSelectedTag('');
    setSearchQuery('');
    setShowRegion(false);
  };

  const isDark = themeMode === 'dark';

  return (
    <div className="space-y-4">
      {/* ── Search + Region Row ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, saints, shrines, or poems…"
            className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm font-ui focus:outline-none focus:ring-2 focus:ring-red-700/20 transition-colors ${
              isDark
                ? 'bg-[#18181B] text-white border-white/10 placeholder-slate-500 focus:border-red-700/50'
                : 'bg-white text-slate-900 border-slate-200 placeholder-slate-400 focus:border-red-300'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Selector */}
        <div className="relative sm:w-56">
          <MapPin className="w-4 h-4 text-red-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as DistrictRegion)}
            className={`w-full appearance-none pl-9 pr-9 py-2.5 rounded-xl border text-sm font-ui font-medium focus:outline-none focus:ring-2 focus:ring-red-700/20 cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#18181B] text-white border-white/10 focus:border-red-700/50'
                : 'bg-white text-slate-800 border-slate-200 focus:border-red-300'
            } ${selectedRegion !== 'All Regions' ? (isDark ? 'border-red-700/60 text-red-400' : 'border-red-300 text-red-800') : ''}`}
          >
            {regions.map((reg) => (
              <option key={reg} value={reg} className="bg-white text-slate-900">
                {reg === 'All Regions' ? 'All Kashmir Districts' : `District: ${reg}`}
              </option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-ui font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* ── Category Pills ──────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const activeClass = CATEGORY_COLORS[cat] || 'bg-slate-900 text-white border-slate-900';
          const inactiveClass = isDark
            ? 'text-slate-400 border-white/10 hover:border-white/20 hover:text-white bg-transparent'
            : (CATEGORY_INACTIVE[cat] || 'text-slate-600 border-slate-200 hover:border-slate-400');

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[12px] font-ui font-semibold whitespace-nowrap transition-all border flex-shrink-0 ${
                isSelected ? activeClass : inactiveClass + ' bg-transparent'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Active Tag badge ────────────────────────────── */}
      {selectedTag && (
        <div className="flex items-center gap-2 pt-1 text-xs font-ui">
          <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tag:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200">
            #{selectedTag}
            <button onClick={() => setSelectedTag('')} className="hover:text-red-700 ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
};
