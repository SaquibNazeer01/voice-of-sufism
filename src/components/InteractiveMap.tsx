import React, { useState, useEffect } from 'react';
import { HeritageSite, DistrictRegion, Article } from '../types';
import { SupabaseService } from '../services/supabaseService';
import { MapPin, Compass, Navigation, Info, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  onSelectArticleByLocation?: (locationName: string) => void;
  articles: Article[];
  onReadArticle: (article: Article) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  articles,
  onReadArticle
}) => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<DistrictRegion>('All Regions');

  useEffect(() => {
    setIsLoading(true);
    SupabaseService.getHeritageSites().then(data => {
      const siteList = data || [];
      setSites(siteList);
      if (siteList.length > 0) {
        setSelectedSite(siteList[0]);
      } else {
        setSelectedSite(null);
      }
      setIsLoading(false);
    }).catch(() => {
      setSites([]);
      setSelectedSite(null);
      setIsLoading(false);
    });
  }, []);

  const districts: DistrictRegion[] = [
    'All Regions',
    'Srinagar',
    'Budgam',
    'Anantnag',
    'Baramulla',
    'Ganderbal'
  ];

  const filteredSites = sites.filter(site => {
    if (selectedDistrictFilter === 'All Regions') return true;
    return site.district === selectedDistrictFilter;
  });

  // Find linked article for selected site if available
  const linkedArticle = selectedSite ? articles.find(a => 
    a.locationName?.toLowerCase().includes(selectedSite.name.toLowerCase().split(' ')[0]) ||
    selectedSite.name?.toLowerCase().includes(a.locationName?.toLowerCase().split(' ')[0])
  ) : null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-red-900 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Interactive Sacred Geography</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Kashmir Valley Heritage & Shrine Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Click on any sacred location pin below to discover its historical origins, architectural style, and visiting guidance.
          </p>
        </div>

        {/* District Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {districts.map(dist => (
            <button
              key={dist}
              onClick={() => setSelectedDistrictFilter(dist)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDistrictFilter === dist
                  ? 'bg-red-900 text-amber-300 shadow font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Map Canvas Container */}
        <div className="lg:col-span-7 bg-[#09090B] rounded-2xl p-6 text-white relative min-h-[420px] overflow-hidden shadow-xl border border-red-900/80 flex flex-col justify-between">
          
          {/* Map Top Badge */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider">
                Kashmir Valley Sacred Map (34°N 74°E)
              </span>
            </div>

            <span className="text-[10px] bg-red-950 px-2.5 py-1 rounded text-amber-300 border border-amber-500/30">
              Interactive Pins ({filteredSites.length})
            </span>
          </div>

          {/* Stylized Vector Valley Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px]"></div>

          {/* Map Pins Display Grid */}
          <div className="relative my-8 grid grid-cols-2 sm:grid-cols-3 gap-3 z-10">
            {filteredSites.map((site) => {
              const isSelected = selectedSite.id === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-lg scale-105 ring-2 ring-amber-200'
                      : 'bg-red-950/80 hover:bg-red-900 text-amber-100 border-red-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-black text-amber-300' : 'bg-black/60 text-amber-200'}`}>
                      {site.district}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-serif font-bold leading-tight truncate">
                      {site.name}
                    </p>
                    <p className={`text-[10px] ${isSelected ? 'text-black/80' : 'text-amber-200/80'}`}>
                      {site.distanceFromSrinagarKm} km from Srinagar
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer Note */}
          <div className="pt-4 border-t border-red-900/80 flex items-center justify-between text-[11px] text-amber-300/80 z-10">
            <span className="flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>Pir Panjal & Zabarwan Mountain Range Coordinates</span>
            </span>
            <span className="font-serif italic text-amber-300">Srinagar • Anantnag • Budgam</span>
          </div>

        </div>

        {/* Right Column: Selected Site Detail Card */}
        <div className="lg:col-span-5 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          
          {selectedSite ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-900 text-amber-300 border border-amber-500/30">
                    {selectedSite.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                    <Navigation className="w-3.5 h-3.5 text-red-700" />
                    <span>{selectedSite.distanceFromSrinagarKm} km from Srinagar</span>
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  {selectedSite.name}
                </h3>

                {selectedSite.kashmiriName && (
                  <p className="font-serif text-base text-red-800 font-bold dir-rtl">
                    {selectedSite.kashmiriName}
                  </p>
                )}
              </div>

              {/* Site Hero Image */}
              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 shadow bg-slate-950">
                <img
                  src={selectedSite.localImageFilename ? `/ziyarats/${selectedSite.localImageFilename}` : selectedSite.heroImage}
                  alt={selectedSite.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (selectedSite.heroImage && e.currentTarget.src !== selectedSite.heroImage) {
                      e.currentTarget.src = selectedSite.heroImage;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/90 px-2.5 py-1 rounded text-[11px] text-amber-300 font-semibold border border-amber-500/30">
                  Built: {selectedSite.builtYear}
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                <p><strong>Architecture Style:</strong> {selectedSite.architecturalStyle}</p>
                <p className="text-slate-600">{selectedSite.overview}</p>
              </div>

              {/* Visitation Etiquette */}
              {selectedSite.visitationEtiquette && selectedSite.visitationEtiquette.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 space-y-1.5 text-xs text-amber-950">
                  <div className="flex items-center space-x-1 font-bold text-amber-950">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
                    <span>Visiting Etiquette & Guidance</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900">
                    {selectedSite.visitationEtiquette.map((guide, idx) => (
                      <li key={idx}>{guide}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Link to Full Article if available */}
              {linkedArticle ? (
                <button
                  onClick={() => onReadArticle(linkedArticle)}
                  className="w-full py-3 rounded-xl bg-red-900 hover:bg-red-800 text-amber-300 font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow border border-amber-500/40"
                >
                  <span>Read In-Depth Research Paper</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs text-center">
                  Full historical essay in progress for this location
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-serif font-bold text-slate-800">No Heritage Sites Listed Yet</p>
              <p className="text-xs">Add sacred places and shrines from the Admin Dashboard.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
