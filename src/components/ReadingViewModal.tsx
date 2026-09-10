import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { 
  X, 
  ArrowLeft,
  Bookmark, 
  Volume2, 
  VolumeX, 
  Clock, 
  MapPin, 
  Feather, 
  Type, 
  Moon, 
  Sun, 
  BookOpen, 
  Compass, 
  ChevronRight
} from 'lucide-react';
import { SharePanel, ShareBar } from './SharePanel';

interface ReadingViewModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const ReadingViewModal: React.FC<ReadingViewModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  allArticles,
  onSelectArticle
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [themeMode, setThemeMode] = useState<'ivory' | 'sepia' | 'dark'>('ivory');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Close on Escape key & cleanup speech
  useEffect(() => {
    if (!article) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [article, onClose]);

  if (!article) return null;

  const handleClose = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    onClose();
  };

  // Audio Narration using SpeechSynthesis
  const handleToggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead = `${article.title}. ${article.excerpt}. ${article.contentMarkdown.replace(/[*#>`]/g, '')}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const cycleTheme = () => {
    if (themeMode === 'ivory') setThemeMode('sepia');
    else if (themeMode === 'sepia') setThemeMode('dark');
    else setThemeMode('ivory');
  };

  const getThemeBg = () => {
    switch (themeMode) {
      case 'sepia': return 'bg-[#F4EFEA] text-[#2B231B]';
      case 'dark': return 'bg-[#111B18] text-[#E2ECE8]';
      default: return 'bg-[#FAF8F5] text-[#1F2937]';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs sm:text-sm leading-relaxed';
      case 'lg': return 'text-base sm:text-lg leading-relaxed';
      case 'xl': return 'text-lg sm:text-xl leading-relaxed';
      default: return 'text-sm sm:text-base leading-relaxed';
    }
  };

  const relatedArticles = allArticles
    .filter(a => a.id !== article.id && (a.category === article.category || a.region === article.region))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex justify-center sm:p-4 md:p-6 animate-fadeIn overflow-hidden">
      
      {/* Reader Modal Card - Full Screen on Mobile, Centered Box on Desktop */}
      <div className={`w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border-0 sm:border sm:border-red-900/60 transition-colors ${getThemeBg()}`}>
        
        {/* Sticky Control Header Bar */}
        <div className="sticky top-0 z-20 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-[#09090B] text-white flex items-center justify-between border-b border-red-900 shadow-md flex-shrink-0 gap-2">
          
          {/* Top Left: PROMINENT Back Button & Brand Tag */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-black hover:bg-amber-300 transition-colors font-bold text-xs sm:text-sm shadow-sm flex-shrink-0"
              title="Return to Main Page"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back</span>
            </button>

            <div className="hidden xs:flex items-center space-x-2 border-l border-red-800/80 pl-2.5 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-serif text-xs sm:text-sm font-bold text-amber-300 truncate max-w-[130px] sm:max-w-none">
                Voice of Sufism
              </span>
            </div>
          </div>

          {/* Top Right: Compact Reading Customization Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 overflow-x-auto no-scrollbar py-0.5">
            
            {/* Font Size Selector */}
            <div className="hidden md:flex items-center bg-red-950/80 rounded-lg p-0.5 border border-red-800 text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'sm' ? 'bg-amber-400 text-black' : 'text-amber-200'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'base' ? 'bg-amber-400 text-black' : 'text-amber-200'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-1.5 py-0.5 rounded font-bold ${fontSize === 'lg' ? 'bg-amber-400 text-black' : 'text-amber-200'}`}
              >
                A+
              </button>
            </div>

            {/* Font Family Toggle */}
            <button
              onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
              className="p-1.5 sm:p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-amber-300 border border-red-800 text-xs font-semibold flex items-center space-x-1"
              title="Toggle Serif / Sans-Serif"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">{fontFamily === 'serif' ? 'Serif' : 'Sans'}</span>
            </button>

            {/* Compact Theme Cycle Button */}
            <button
              onClick={cycleTheme}
              className="p-1.5 sm:p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-amber-300 border border-red-800 text-xs flex items-center space-x-1"
              title={`Theme: ${themeMode} (Click to switch)`}
            >
              {themeMode === 'ivory' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
              {themeMode === 'sepia' && <BookOpen className="w-3.5 h-3.5 text-amber-300" />}
              {themeMode === 'dark' && <Moon className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline capitalize text-xs">{themeMode}</span>
            </button>

            {/* Audio Narration Button */}
            <button
              onClick={handleToggleSpeech}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                isSpeaking 
                  ? 'bg-amber-400 text-black border-amber-300 animate-pulse font-bold' 
                  : 'bg-red-950/80 hover:bg-red-900 text-amber-300 border-red-800'
              }`}
              title="Audio Speech Narration"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors ${
                isBookmarked 
                  ? 'bg-amber-400 text-black border-amber-300' 
                  : 'bg-red-950/80 hover:bg-red-900 text-amber-200 border-red-800'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
            >
              <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share button — full SharePanel popover */}
            <SharePanel
              article={article}
              position="bottom"
              variant="icon"
              triggerClassName="p-1.5 sm:p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-amber-200 border border-red-800 hover:text-amber-400 transition-colors"
            />

            {/* Secondary X Button */}
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-lg bg-red-950/60 hover:bg-red-900 text-amber-200 hover:text-white transition-colors border border-red-800"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Modal Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 space-y-6 sm:space-y-8">
          
          {/* Header Metadata */}
          <div className="space-y-3 sm:space-y-4 text-center max-w-3xl mx-auto border-b border-red-900/10 pb-6 sm:pb-8">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-red-900 text-amber-300 border border-amber-400/30">
              <span>{article.category}</span>
              <span>•</span>
              <span>{article.region} District</span>
            </div>

            <h1 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${themeMode === 'dark' ? 'text-white' : 'text-slate-950'} ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
              {article.title}
            </h1>

            {article.titleUrdu && (
              <p className="font-serif text-lg sm:text-2xl text-red-800 font-bold dir-rtl">
                {article.titleUrdu}
              </p>
            )}

            <p className={`text-sm sm:text-lg font-medium leading-relaxed font-serif italic ${themeMode === 'dark' ? 'text-amber-100/90' : 'text-slate-700'}`}>
              "{article.subtitle}"
            </p>

            <div className={`pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold ${themeMode === 'dark' ? 'text-amber-200/80' : 'text-slate-600'}`}>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-700" />
                <span>{article.locationName}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{article.readTime}</span>
              </span>
              <span>•</span>
              <span>By {article.author} ({article.authorRole})</span>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 sm:border-4 border-black bg-slate-950">
            <img
              src={article.heroImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-48 sm:h-[400px] object-cover"
            />
          </div>

          {/* Embedded Poetry Quote Card if available */}
          {article.quotes && article.quotes.length > 0 && (
            <div className="my-4 sm:my-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-red-950 to-black text-amber-100 shadow-xl border border-amber-400/40 space-y-3">
              <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Feather className="w-4 h-4 text-amber-400" />
                <span>Kashmiri Sufi Verse Accent</span>
              </div>
              {article.quotes.map((q, idx) => (
                <div key={idx} className="space-y-1 font-serif">
                  <p className="text-lg sm:text-2xl font-bold text-amber-300 dir-rtl">
                    "{q.verse}"
                  </p>
                  <p className="text-xs sm:text-sm text-amber-100 italic">
                    — {q.translation}
                  </p>
                  <p className="text-[10px] sm:text-xs text-amber-400 font-bold uppercase pt-1">
                    Poet: {q.poet}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Article Main Text Content */}
          <div className={`max-w-3xl mx-auto space-y-4 sm:space-y-6 ${getFontSizeClass()} ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
            {article.contentMarkdown.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className={`text-xl sm:text-3xl font-extrabold pt-4 pb-2 border-b font-serif ${themeMode === 'dark' ? 'text-amber-400 border-red-900/60' : 'text-red-900 border-red-900/20'}`}>
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={index} className={`text-lg sm:text-xl font-bold pt-2 font-serif ${themeMode === 'dark' ? 'text-amber-300' : 'text-amber-900'}`}>
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className={`pl-3 sm:pl-4 py-2 border-l-4 italic my-4 rounded-r-lg text-xs sm:text-base ${themeMode === 'dark' ? 'border-amber-400 text-amber-200 bg-amber-400/10' : 'border-red-800 text-red-950 bg-amber-500/10'}`}>
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return (
                <p key={index} className={`leading-relaxed ${themeMode === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                  {paragraph.replace(/\*\*/g, '')}
                </p>
              );
            })}
          </div>

          {/* Historical Timeline Section if present */}
          {article.timelineEvents && article.timelineEvents.length > 0 && (
            <div className={`my-8 sm:my-10 p-4 sm:p-8 rounded-2xl border space-y-4 ${themeMode === 'dark' ? 'bg-slate-900/80 border-red-900/60 text-white' : 'bg-white/80 border-slate-200/80 text-slate-900'}`}>
              <h3 className={`font-serif text-lg sm:text-xl font-bold flex items-center space-x-2 ${themeMode === 'dark' ? 'text-amber-300' : 'text-red-900'}`}>
                <Compass className="w-5 h-5 text-amber-600" />
                <span>Historical Chronology</span>
              </h3>
              <div className="space-y-4 relative border-l-2 border-red-700/40 pl-4 sm:pl-6 ml-2 sm:ml-3">
                {article.timelineEvents.map((evt, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[23px] sm:-left-[31px] top-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-400 border-2 border-red-900"></div>
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${themeMode === 'dark' ? 'text-amber-300' : 'text-amber-800'}`}>{evt.year}</span>
                    <h4 className={`font-serif font-bold text-sm sm:text-base ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{evt.title}</h4>
                    <p className={`text-xs sm:text-sm ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Grid if present */}
          {article.galleryImages && article.galleryImages.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <h3 className={`font-serif text-lg sm:text-xl font-bold flex items-center gap-2 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <span>📸 Photo Essay Archives</span>
                  <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/60">
                    {article.galleryImages.length} Photo{article.galleryImages.length === 1 ? '' : 's'}
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.galleryImages.map((img: any, idx: number) => {
                  const url = typeof img === 'string' ? img : img?.url;
                  const caption = typeof img === 'string' ? '' : img?.caption;
                  if (!url) return null;
                  return (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm bg-slate-900 group flex flex-col">
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img 
                          src={url} 
                          alt={caption || `Archival Photo ${idx + 1}`} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      {caption && (
                        <p className="p-3 text-xs text-slate-200 italic font-serif bg-slate-950/90 border-t border-white/5">
                          {caption}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Share This Story — prominent bar before Return button */}
          <div className={`rounded-2xl p-5 sm:p-6 border ${themeMode === 'dark' ? 'bg-[#0c0c0e] border-white/[0.07]' : themeMode === 'sepia' ? 'bg-[#F4EFEA] border-amber-200/60' : 'bg-[#09090B] border-white/[0.06]'}`}>
            <ShareBar article={article} />
          </div>

          {/* Prominent Return Button at bottom of article */}
          <div className="pt-6 pb-4 text-center border-t border-red-900/10">
            <button
              onClick={handleClose}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-red-900 hover:bg-red-800 text-amber-300 font-bold text-xs sm:text-sm shadow-lg border border-amber-400/40 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>Close Reader & Return to Main Page</span>
            </button>
          </div>

          {/* Related Stories Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 sm:pt-10 border-t border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-serif text-base sm:text-xl font-bold flex items-center space-x-2 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />
                  <span>More Stories from {article.region} & {article.category}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {relatedArticles.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all space-y-2 group ${themeMode === 'dark' ? 'bg-slate-900/90 border-red-900/60 hover:border-amber-400' : 'bg-white border-slate-200/80 hover:border-red-700 shadow-sm hover:shadow-md'}`}
                  >
                    <span className="text-[10px] font-bold text-amber-900 uppercase bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      {rel.category}
                    </span>
                    <h4 className={`font-serif font-bold text-xs sm:text-sm line-clamp-2 transition-colors ${themeMode === 'dark' ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-red-700'}`}>
                      {rel.title}
                    </h4>
                    <span className="text-xs text-amber-700 font-semibold flex items-center space-x-1">
                      <span>Read Story</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar inside modal */}
        <div className="px-4 sm:px-6 py-3 bg-[#09090B] text-amber-200/80 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-red-900 flex-shrink-0">
          <span className="text-center sm:text-left text-[11px] sm:text-xs">
            Voice of Sufism Digital Publication • Kashmir Heritage Project
          </span>
          <button
            onClick={handleClose}
            className="text-amber-300 hover:text-amber-200 font-bold flex items-center space-x-1 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
            <span>Back to Main Page</span>
          </button>
        </div>

      </div>
    </div>
  );
};

