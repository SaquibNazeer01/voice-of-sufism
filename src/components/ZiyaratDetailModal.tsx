import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  MapPin, 
  Calendar, 
  Compass, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Navigation, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ShieldCheck, 
  Clock,
  Info
} from 'lucide-react';
import { HeritageSite } from '../types';

interface ZiyaratDetailModalProps {
  site: HeritageSite | null;
  isOpen: boolean;
  onClose: () => void;
  allSites?: HeritageSite[];
  onSelectSite?: (site: HeritageSite) => void;
}

export const ZiyaratDetailModal: React.FC<ZiyaratDetailModalProps> = ({
  site,
  isOpen,
  onClose,
  allSites = [],
  onSelectSite
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'architecture' | 'urs' | 'visiting'>('story');
  const [imgError, setImgError] = useState(false);
  const [useLocalFirst, setUseLocalFirst] = useState(true);

  // Reset image state when active site changes
  useEffect(() => {
    setImgError(false);
    setUseLocalFirst(true);
    setActiveTab('story');
  }, [site?.id]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !site) return null;

  // Next / Previous navigation
  const currentIndex = allSites.findIndex(s => s.id === site.id);
  const prevSite = currentIndex > 0 ? allSites[currentIndex - 1] : allSites[allSites.length - 1];
  const nextSite = currentIndex < allSites.length - 1 ? allSites[currentIndex + 1] : allSites[0];

  // Image source logic:
  // 1. Try local image path `/ziyarats/${site.localImageFilename}`
  // 2. On error, fallback to curated cloud image `site.heroImage`
  const localImgSrc = site.localImageFilename ? `/ziyarats/${site.localImageFilename}` : null;
  const currentImgSrc = (useLocalFirst && localImgSrc) ? localImgSrc : site.heroImage;

  const handleImageError = () => {
    if (useLocalFirst && localImgSrc) {
      // Fallback from local to cloud heroImage
      setUseLocalFirst(false);
    } else {
      // Fallback completely to geometric monogram
      setImgError(true);
    }
  };

  const getShortArchitecture = (s: HeritageSite): string => {
    switch (s.id) {
      case 'charar-i-sharief':
        return 'Kashmiri Reshi Wooden Pagoda';
      case 'khanqah-e-moula':
        return 'Kashmiri Timber & Khatamband';
      case 'hazratbal-shrine':
        return 'Neoclassical Kashmiri-Mughal';
      case 'aishmuqam-shrine':
        return 'Hilltop Stone & Cave Sanctum';
      case 'makhdoom-sahib':
        return 'Pre-Mughal Wooden Hypostyle';
      case 'jamia-masjid':
        return 'Indo-Saracenic 378 Pillars';
      default:
        return s.architecturalStyle
          .replace(/ Architecture$/i, '')
          .replace(/ Craftsmanship$/i, '');
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.coordinates.lat},${site.coordinates.lng}`;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl my-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 bg-[#0E0E12] text-slate-100 flex flex-col max-h-[94vh] sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header Navigation Bar ── */}
        <div className="flex items-center justify-between px-3.5 py-3 sm:px-5 sm:py-3.5 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-amber-400 min-w-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
            <span className="uppercase tracking-wider sm:tracking-widest text-[10px] sm:text-[11px] font-bold truncate">Featured Ziyarat</span>
            {allSites.length > 0 && (
              <span className="text-slate-500 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
                ({currentIndex + 1} of {allSites.length})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {allSites.length > 1 && onSelectSite && (
              <div className="flex items-center gap-1 mr-1 sm:mr-2">
                <button
                  type="button"
                  onClick={() => onSelectSite(prevSite)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Previous Ziyarat"
                  aria-label="Previous Ziyarat"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSite(nextSite)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Next Ziyarat"
                  aria-label="Next Ziyarat"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
              title="Close Modal"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Modal Body ── */}
        <div className="overflow-y-auto flex-1 space-y-4 sm:space-y-6 p-3.5 sm:p-6 md:p-7">
          
          {/* ── Ziyarat Identity Header (Separated from photo for clean, unobstructed viewing) ── */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                {site.type}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-red-950/70 text-amber-300 border border-amber-400/30">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>District {site.district}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/10 text-slate-300 border border-white/10">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Est. {site.builtYear}</span>
              </span>
            </div>

            <div>
              <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {site.name}
              </h2>
              {site.kashmiriName && (
                <p className="font-serif text-base sm:text-2xl text-amber-300 font-medium pt-1 dir-rtl">
                  {site.kashmiriName}
                </p>
              )}
            </div>

            {site.spiritualLuminary && (
              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-xs sm:text-sm font-medium text-amber-200/90 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Associated Luminary: <strong className="text-white font-semibold">{site.spiritualLuminary}</strong></span>
              </div>
            )}
          </div>

          {/* ── Clear, High-Resolution Dedicated Photograph Showcase (Unobstructed) ── */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-amber-500/25 bg-black shadow-2xl group">
            {!imgError ? (
              <div className="relative w-full h-56 xs:h-64 sm:h-80 md:h-96 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={currentImgSrc}
                  alt={site.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle, non-intrusive corner tags */}
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-medium text-amber-300 flex items-center gap-1.5 shadow-md pointer-events-none">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Sacred Sanctum View</span>
                </div>

                <a
                  href={currentImgSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 hover:border-amber-400/40 text-[10px] sm:text-xs font-medium text-slate-200 hover:text-amber-300 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  title="Open full photograph"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden xs:inline">Full Photo</span>
                </a>
              </div>
            ) : (
              <div className="w-full h-56 sm:h-72 flex flex-col items-center justify-center bg-gradient-to-br from-red-950/60 to-black p-6 text-center space-y-2">
                <span className="font-serif text-6xl text-amber-400/30 select-none">
                  {site.kashmiriName ? site.kashmiriName.slice(0, 2) : 'ز'}
                </span>
                <p className="text-xs text-slate-400 font-serif">
                  {site.name}
                </p>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar - Fully Responsive Across All Screens */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {/* Card 1: Distance */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-h-[78px] sm:min-h-[86px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Distance</span>
              <p className="font-serif font-bold text-xs sm:text-sm text-white my-auto py-1">
                {site.distanceFromSrinagarKm === 0 ? 'City Center' : `${site.distanceFromSrinagarKm} km`}
              </p>
              <span className="text-[10px] text-slate-500 block">From Srinagar</span>
            </div>

            {/* Card 2: Coordinates */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-h-[78px] sm:min-h-[86px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Coordinates</span>
              <p className="font-mono font-bold text-[10px] sm:text-xs text-amber-400 my-auto py-1 leading-tight break-words">
                {site.coordinates.lat.toFixed(3)}°N, {site.coordinates.lng.toFixed(3)}°E
              </p>
              <span className="text-[10px] text-slate-500 block">GPS Geo-Location</span>
            </div>

            {/* Card 3: District */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-h-[78px] sm:min-h-[86px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">District</span>
              <p className="font-serif font-bold text-xs sm:text-sm text-white my-auto py-1">
                {site.district}
              </p>
              <span className="text-[10px] text-slate-500 block">Kashmir Valley</span>
            </div>

            {/* Card 4: Architecture */}
            <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center min-h-[78px] sm:min-h-[86px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Architecture</span>
              <p 
                className="font-serif font-bold text-[11px] sm:text-xs text-emerald-400 my-auto py-1 leading-snug break-words" 
                title={site.architecturalStyle}
              >
                {getShortArchitecture(site)}
              </p>
              <span className="text-[10px] text-slate-500 block">Heritage Craft</span>
            </div>
          </div>

          {/* Navigation Tabs - Responsive with Compact Labels on Mobile */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-white/[0.08] pb-2.5 sm:pb-3">
            {[
              { id: 'story', shortLabel: 'Story & History', label: 'Historical Story & Genesis', icon: BookOpen },
              { id: 'architecture', shortLabel: 'Architecture', label: 'Sacred Architecture', icon: Layers },
              { id: 'urs', shortLabel: 'Urs Traditions', label: 'Urs & Living Traditions', icon: Sparkles },
              { id: 'visiting', shortLabel: 'Visitor Guide', label: 'Location & Visitor Guide', icon: Compass }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="inline sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* ── TAB CONTENT ── */}
          <div className="space-y-4">
            
            {/* Tab 1: Historical Story */}
            {activeTab === 'story' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Overview Summary</span>
                  </h4>
                  <p className="text-sm text-amber-100/90 leading-relaxed">
                    {site.overview}
                  </p>
                </div>

                <div className="space-y-3.5 text-sm text-slate-200 leading-relaxed">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                    The Chronicle & Spiritual Origins
                  </h3>
                  {site.historyStory?.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Architecture */}
            {activeTab === 'architecture' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Architectural Style & Materials</span>
                  </h4>
                  <p className="text-sm font-semibold text-white">
                    {site.architecturalStyle}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                    Engineering, Timber Craft & Spatial Layout
                  </h3>
                  {site.architectureDetails ? (
                    site.architectureDetails.split('\n').map((line, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p>Documented under the classical Kashmiri deodar timber building tradition.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Urs & Traditions */}
            {activeTab === 'urs' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Annual Commemoration</span>
                  </h4>
                  <p className="text-sm font-serif font-bold text-white">
                    {site.ursTraditions?.split('\n')[0] || 'Annual Urs Gathering of Devotees'}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                    Sacred Litanies, Langar & Congregation
                  </h3>
                  {site.ursTraditions ? (
                    site.ursTraditions.split('\n').slice(1).map((line, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p>Annual congregation celebrated with collective recitation and communal charity.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Location & Visiting Guide */}
            {activeTab === 'visiting' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Precise Location & Address</span>
                    </span>
                    <p className="text-xs sm:text-sm text-white font-medium">
                      {site.locationAddress || `${site.name}, District ${site.district}, Jammu & Kashmir`}
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pilgrimage Timings</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Open daily from Fajr (dawn prayers) through Isha (night prayers). Fridays and annual Urs periods experience high congregational attendance.
                    </p>
                  </div>
                </div>

                {/* Visitation Etiquette Checklist */}
                {site.visitationEtiquette && site.visitationEtiquette.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Visitor Etiquette & Sacred Sanctity Guidelines</span>
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {site.visitationEtiquette.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>



        </div>

        {/* ── Modal Footer Action Bar ── */}
        <div className="p-4 sm:px-6 border-t border-white/[0.08] bg-black/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-all flex-1 sm:flex-initial"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
