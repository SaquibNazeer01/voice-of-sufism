import React from 'react';
import { Article } from '../types';
import { Bookmark, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { SharePanel } from './SharePanel';

interface ArticleCardProps {
  article: Article;
  onReadArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string, e: React.MouseEvent) => void;
  themeMode?: 'ivory' | 'sepia' | 'dark';
}

// Maps category → accent color for the top border stripe
const CATEGORY_ACCENT: Record<string, string> = {
  'Sufi Saints':             'from-violet-500 to-violet-600',
  'Sacred Shrines':          'from-red-700 to-red-800',
  'Language & Poetry':       'from-sky-600 to-sky-700',
  'Architecture & Heritage': 'from-amber-600 to-amber-700',
  'Culture & Folklore':      'from-emerald-600 to-emerald-700',
  'Crafts & Traditions':     'from-rose-600 to-rose-700',
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onReadArticle,
  isBookmarked,
  onToggleBookmark,
  themeMode = 'ivory',
}) => {
  const isDark = themeMode === 'dark';
  const isSepia = themeMode === 'sepia';

  const cardBg = isDark
    ? 'bg-[#141417] border-white/[0.07] hover:border-white/[0.14]'
    : isSepia
    ? 'bg-[#FAF5EE] border-amber-200/60 hover:border-amber-400/80'
    : 'bg-white border-slate-200/80 hover:border-slate-300';

  const titleColor = isDark
    ? 'text-white group-hover:text-amber-300'
    : isSepia
    ? 'text-[#2B231B] group-hover:text-red-900'
    : 'text-slate-900 group-hover:text-red-900';

  const excerptColor = isDark ? 'text-slate-400' : isSepia ? 'text-[#5C4B3C]' : 'text-slate-500';
  const metaColor   = isDark ? 'border-white/[0.07] text-slate-500' : isSepia ? 'border-amber-200/40 text-slate-400' : 'border-slate-100 text-slate-400';

  const accentGradient = CATEGORY_ACCENT[article.category] || 'from-slate-400 to-slate-500';

  return (
    <article
      onClick={() => onReadArticle(article)}
      className={`group rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer card-hover relative ${cardBg}`}
    >
      {/* Category accent stripe */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${accentGradient}`} />

      {/* Thumbnail */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-900 flex-shrink-0">
        <img
          src={article.heroImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'}
          alt={article.title || 'Sufi Heritage Story'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

        {/* Top: category badge + bookmark */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-ui font-bold uppercase tracking-wider bg-gradient-to-r ${accentGradient} text-white shadow-sm`}>
            {article.category || 'Heritage'}
          </span>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(article.id, e); }}
            className={`p-2 rounded-full backdrop-blur-md pointer-events-auto transition-all shadow ${
              isBookmarked
                ? 'bg-amber-400 text-black'
                : 'bg-black/60 text-white hover:bg-black hover:text-amber-300'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Save story'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom: location + read time */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-ui">
          <span className="flex items-center gap-1 text-amber-200/90 drop-shadow">
            <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate max-w-[160px]">{article.locationName || article.region || 'Kashmir'}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
            {article.readTime || '5 min read'}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className={`p-5 flex-1 flex flex-col gap-3 ${isDark ? '' : ''}`}>
        <div className="flex-1 space-y-2">
          <h3 className={`font-editorial text-[19px] sm:text-xl font-bold leading-snug line-clamp-2 transition-colors ${titleColor}`}>
            {article.title}
          </h3>

          {article.titleUrdu && (
            <p className="font-editorial text-xs text-red-800 font-medium italic dir-rtl truncate" dir="rtl">
              {article.titleUrdu}
            </p>
          )}

          <p className={`font-ui text-[13px] leading-relaxed line-clamp-2 ${excerptColor}`}>
            {article.excerpt}
          </p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded text-[10px] font-ui font-medium ${
                  isDark
                    ? 'bg-white/5 text-slate-400 border border-white/[0.07]'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={`pt-3 border-t flex items-center justify-between text-[12px] font-ui ${metaColor}`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-900 text-amber-300 font-editorial font-bold text-[10px] flex items-center justify-center flex-shrink-0">
              {(article.author || 'Sufi Voice').charAt(0).toUpperCase()}
            </div>
            <span className={`truncate max-w-[100px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {article.author || 'Editorial Team'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Share button */}
            <SharePanel
              article={article}
              position="top"
              variant="icon"
              triggerClassName={`${isDark ? 'text-slate-500 hover:text-amber-400' : 'text-slate-400 hover:text-amber-500'}`}
            />

            <span className="flex items-center gap-0.5 text-amber-600 font-semibold group-hover:text-red-800 transition-colors">
              Read
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
