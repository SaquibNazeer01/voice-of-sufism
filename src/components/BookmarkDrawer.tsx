import React from 'react';
import { Article } from '../types';
import { Bookmark, X, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface BookmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticles: Article[];
  onReadArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
  onClearAll: () => void;
}

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedArticles,
  onReadArticle,
  onRemoveBookmark,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200"
      >
        
        {/* Header */}
        <div className="p-6 bg-[#09090B] text-white flex items-center justify-between border-b border-red-900">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100">
                Saved Stories ({bookmarkedArticles.length})
              </h3>
              <p className="text-xs text-amber-200/80">
                Offline reading list stored on your device
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-950 hover:bg-red-900 text-amber-300 border border-amber-500/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {bookmarkedArticles.length === 0 ? (
            <div className="text-center py-12 space-y-3 text-slate-500">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-serif text-lg font-bold text-slate-700">No saved stories yet</p>
              <p className="text-xs max-w-xs mx-auto">
                Click the bookmark icon on any article card to save it here for quiet reading later.
              </p>
            </div>
          ) : (
            bookmarkedArticles.map((art) => (
              <div
                key={art.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-700 transition-colors space-y-2 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                    {art.category}
                  </span>
                  
                  <button
                    onClick={() => onRemoveBookmark(art.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    title="Remove story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 
                  onClick={() => { onReadArticle(art); onClose(); }}
                  className="font-serif font-bold text-sm text-slate-900 group-hover:text-red-900 cursor-pointer line-clamp-2"
                >
                  {art.title}
                </h4>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{art.readTime}</span>
                  <button
                    onClick={() => { onReadArticle(art); onClose(); }}
                    className="text-red-900 font-bold flex items-center space-x-1 hover:underline"
                  >
                    <span>Read Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarkedArticles.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-red-700 font-bold hover:underline"
            >
              Clear Reading List
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-red-900 text-amber-300 text-xs font-bold shadow border border-amber-400/40"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
