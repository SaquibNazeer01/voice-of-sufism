import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
  ChevronLeft,
  Maximize2,
  ZoomIn,
  Camera,
  Image as ImageIcon
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
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Normalize all photos for this article (cover + gallery photos)
  const allArticlePhotos = useMemo(() => {
    if (!article) return [];
    const list: { url: string; caption: string }[] = [];
    if (article.heroImage) {
      list.push({ url: article.heroImage, caption: article.title || 'Main Feature Cover' });
    }
    if (Array.isArray(article.galleryImages)) {
      article.galleryImages.forEach((img: any, idx: number) => {
        const url = typeof img === 'string' ? img : img?.url;
        const caption = typeof img === 'string' ? '' : img?.caption || '';
        if (url && (!article.heroImage || url !== article.heroImage)) {
          list.push({ url, caption: caption || `Archival View #${idx + 1}` });
        }
      });
    }
    return list;
  }, [article]);

  // Reset photo indices when opening a new article
  useEffect(() => {
    setActivePhotoIndex(0);
    setLightboxIndex(null);
  }, [article?.id]);

  // Close on Escape key, lightbox keyboard navigation & cleanup speech
  useEffect(() => {
    if (!article) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Lightbox keyboard navigation
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') {
          setLightboxIndex(null);
        } else if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev !== null && prev < allArticlePhotos.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allArticlePhotos.length - 1));
        }
        return;
      }

      // Close modal on Escape if lightbox is not open
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
  }, [article, onClose, lightboxIndex, allArticlePhotos]);

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

          {/* Hero Banner Image & Interactive Photo Showcase */}
          <div className="space-y-3">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-black bg-slate-950 group">
              <img
                src={allArticlePhotos[activePhotoIndex]?.url || article.heroImage}
                alt={allArticlePhotos[activePhotoIndex]?.caption || article.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 sm:h-[440px] object-cover transition-all duration-500 cursor-pointer"
                onClick={() => setLightboxIndex(activePhotoIndex)}
              />

              {/* Gradient Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

              {/* Top Controls: Photo Counter & Fullscreen Lightbox Button */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                {allArticlePhotos.length > 1 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30 flex items-center gap-1.5 shadow-md">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Photo {activePhotoIndex + 1} of {allArticlePhotos.length}</span>
                  </span>
                ) : <span />}

                <button
                  type="button"
                  onClick={() => setLightboxIndex(activePhotoIndex)}
                  className="p-2 rounded-full bg-black/70 hover:bg-black text-amber-300 hover:text-white border border-white/20 backdrop-blur-md pointer-events-auto transition-all shadow-md cursor-pointer hover:scale-105"
                  title="View Fullscreen Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Prev / Next Navigation Arrows (when multiple photos exist) */}
              {allArticlePhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : allArticlePhotos.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black text-white hover:text-amber-300 border border-white/20 backdrop-blur-md transition-all shadow-lg cursor-pointer hover:scale-110 opacity-90 hover:opacity-100"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev < allArticlePhotos.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black text-white hover:text-amber-300 border border-white/20 backdrop-blur-md transition-all shadow-lg cursor-pointer hover:scale-110 opacity-90 hover:opacity-100"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom Caption Overlay */}
              {allArticlePhotos[activePhotoIndex]?.caption && (
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white text-xs sm:text-sm font-serif italic border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="line-clamp-2">
                    {allArticlePhotos[activePhotoIndex].caption}
                  </span>
                  <span className="text-[10px] uppercase font-sans tracking-wider text-amber-300/80 font-bold flex-shrink-0 flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" /> Click to Zoom
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Thumbnail Filmstrip (when multiple photos exist) */}
            {allArticlePhotos.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                  <span className="flex items-center gap-1 font-semibold text-amber-900 dark:text-amber-300">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Visual Filmstrip ({allArticlePhotos.length} photos in story)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 italic">Click any photo to inspect</span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {allArticlePhotos.map((photo, pIdx) => {
                    const isActive = pIdx === activePhotoIndex;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setActivePhotoIndex(pIdx)}
                        className={`relative h-16 w-24 sm:h-20 sm:w-28 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105'
                            : 'border-slate-300 dark:border-white/15 opacity-60 hover:opacity-100 hover:border-amber-300'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || `Thumbnail ${pIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />
                        )}
                        <span className="absolute bottom-1 right-1 px-1 rounded text-[9px] font-mono font-bold bg-black/80 text-white">
                          #{pIdx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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

          {/* Photo Essay & Visual Archives Section */}
          {allArticlePhotos.length > 1 && (
            <div className="my-8 sm:my-12 pt-8 border-t-2 border-amber-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className={`font-serif text-xl sm:text-2xl font-extrabold flex items-center gap-2 ${themeMode === 'dark' ? 'text-amber-300' : 'text-red-950'}`}>
                    <Camera className="w-6 h-6 text-amber-600" />
                    <span>Photo Essay & Visual Archives</span>
                  </h3>
                  <p className={`text-xs mt-1 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    High-definition archival photography documenting the spiritual geography, architecture, and sacred atmosphere.
                  </p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/80">
                  {allArticlePhotos.length} Archival Photographs
                </span>
              </div>

              {/* Magazine Editorial Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {allArticlePhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActivePhotoIndex(idx);
                      setLightboxIndex(idx);
                    }}
                    className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-950 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-900">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Archive Photo ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      {/* Photo Badge & Zoom Pill on Hover */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/70 text-amber-300 border border-white/15 backdrop-blur-xs">
                        #{idx + 1}
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-400/40 shadow-xl">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>View Fullscreen</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950/95 border-t border-white/10 flex-1 flex flex-col justify-between space-y-1">
                      <p className="text-xs font-serif italic text-slate-200 line-clamp-2">
                        {photo.caption || `Archival perspective #${idx + 1} from ${article.locationName || article.title}`}
                      </p>
                      <span className="text-[10px] text-amber-400 font-ui font-semibold flex items-center gap-1 pt-1">
                        <span>Inspect in Lightbox</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
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

      {/* ══════════════════════════════════════════════
          FULLSCREEN HIGH-RES LIGHTBOX MODAL
      ══════════════════════════════════════════════ */}
      {lightboxIndex !== null && allArticlePhotos[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Lightbox Top Control Bar */}
          <div 
            className="flex items-center justify-between text-white z-10 max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Photo {lightboxIndex + 1} of {allArticlePhotos.length}</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-md font-serif">
                {article.title}
              </span>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-amber-300 transition-colors cursor-pointer border border-white/15"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Image & Floating Arrows */}
          <div 
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {allArticlePhotos.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allArticlePhotos.length - 1))}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black text-white hover:text-amber-300 border border-white/25 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-2xl"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={allArticlePhotos[lightboxIndex].url}
              alt={allArticlePhotos[lightboxIndex].caption || 'Archival view'}
              className="max-h-[75vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-white/15 transition-all duration-300"
            />

            {allArticlePhotos.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev !== null && prev < allArticlePhotos.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black text-white hover:text-amber-300 border border-white/25 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-2xl"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Caption Bar */}
          <div 
            className="max-w-4xl w-full mx-auto text-center space-y-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {allArticlePhotos[lightboxIndex].caption && (
              <p className="text-sm sm:text-base font-serif italic text-amber-100 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 max-w-2xl mx-auto">
                "{allArticlePhotos[lightboxIndex].caption}"
              </p>
            )}
            <p className="text-[11px] text-slate-400 font-mono">
              Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-300">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-300">→</kbd> arrow keys to navigate • <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-300">ESC</kbd> to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

