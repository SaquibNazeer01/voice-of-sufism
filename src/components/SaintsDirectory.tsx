import React, { useState, useEffect } from 'react';
import { SufiSaint } from '../types';
import { SupabaseService } from '../services/supabaseService';
import {
  Compass, MapPin, Feather, X, BookOpen, Heart, ArrowRight, ChevronLeft
} from 'lucide-react';

/* ── Saint Detail Modal ──────────────────────────────────────── */
interface SaintDetailModalProps {
  saint: SufiSaint;
  onClose: () => void;
}

const SaintDetailModal: React.FC<SaintDetailModalProps> = ({ saint, onClose }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 animate-fadeIn overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-4 sm:my-8">

        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[#09090B] border-b border-red-900/60">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-ui font-bold text-xs transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-red-800/60" />
            <span className="font-editorial text-sm font-bold text-amber-300 truncate max-w-[180px] sm:max-w-none">
              Voice of Sufism — Saints Directory
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero image */}
        <div className="relative h-52 sm:h-72 bg-slate-950 overflow-hidden">
          <img
            src={saint.image}
            alt={saint.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
            {saint.order && (
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-ui font-bold uppercase tracking-wider bg-red-900 text-amber-300 border border-amber-500/20 mb-1">
                {saint.order} Order
              </span>
            )}
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-amber-200 leading-tight">
              {saint.name}
            </h1>
            {saint.kashmiriName && (
              <p className="font-editorial text-sm text-amber-400 font-medium" dir="rtl">
                {saint.kashmiriName}
              </p>
            )}
            {saint.titleUrdu && (
              <p className="font-ui text-xs text-slate-300 font-medium" dir="rtl">
                {saint.titleUrdu}
              </p>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-10 space-y-8">

          {/* Location meta row */}
          <div className="flex flex-wrap items-center gap-3">
            {saint.shrineLocation && (
              <span className="flex items-center gap-1.5 text-xs font-ui font-semibold text-red-900 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                {saint.shrineLocation}
              </span>
            )}
            {saint.district && saint.district !== 'All Regions' && (
              <span className="text-xs font-ui font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full">
                District {saint.district}
              </span>
            )}
            {saint.period && (
              <span className="text-xs font-ui text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                {saint.period}
              </span>
            )}
          </div>

          {/* Biography */}
          {saint.biography && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-px bg-red-800" />
                <h2 className="font-ui text-[11px] font-bold uppercase tracking-widest text-red-800">
                  Biography
                </h2>
              </div>
              <p className="font-ui text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {saint.biography}
              </p>
            </section>
          )}

          {/* Core Philosophy */}
          {saint.corePhilosophy && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-px bg-amber-600" />
                <h2 className="font-ui text-[11px] font-bold uppercase tracking-widest text-amber-800">
                  Core Philosophy &amp; Teachings
                </h2>
              </div>
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="font-ui text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {saint.corePhilosophy}
                </p>
              </div>
            </section>
          )}

          {/* Famous Saying */}
          {saint.famousSaying?.english && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Feather className="w-3.5 h-3.5 text-red-700" />
                <h2 className="font-ui text-[11px] font-bold uppercase tracking-widest text-red-800">
                  Key Teaching / Famous Saying
                </h2>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950 to-[#1A0000] border border-red-800/60 space-y-3">
                {saint.famousSaying.kashmiri && (
                  <p className="font-editorial text-base text-amber-300 font-bold" dir="rtl">
                    {saint.famousSaying.kashmiri}
                  </p>
                )}
                {saint.famousSaying.transliteration && (
                  <p className="font-editorial text-sm text-amber-400/80 italic">
                    {saint.famousSaying.transliteration}
                  </p>
                )}
                <p className="font-editorial text-base text-white font-medium italic">
                  "{saint.famousSaying.english}"
                </p>
              </div>
            </section>
          )}

          {/* Impact on Kashmir */}
          {saint.impactOnKashmir && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-red-700" />
                <h2 className="font-ui text-[11px] font-bold uppercase tracking-widest text-red-800">
                  Impact on Kashmir
                </h2>
              </div>
              <p className="font-ui text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {saint.impactOnKashmir}
              </p>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-10 py-5 bg-[#09090B] border-t border-red-900/40 flex items-center justify-between">
          <p className="font-ui text-xs text-slate-500">
            Voice of Sufism — Kashmir Heritage Archive
          </p>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-ui font-bold text-xs transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Directory
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Saints Directory (Public Page) ─────────────────────────── */
export const SaintsDirectory: React.FC = () => {
  const [saints, setSaints] = useState<SufiSaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSaint, setSelectedSaint] = useState<SufiSaint | null>(null);

  useEffect(() => {
    setIsLoading(true);
    SupabaseService.getSaints()
      .then(data => {
        setSaints(data || []);
        setIsLoading(false);
      })
      .catch(() => {
        setSaints([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">

        {/* Title Header */}
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2 text-[11px] font-ui font-bold text-red-900 uppercase tracking-widest mb-1">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Biographical Directory</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Sufi Saints, Reshis &amp; Mystics of Kashmir
          </h2>
          <p className="font-ui text-sm text-slate-500 max-w-2xl mt-2">
            Discover the spiritual luminaries whose teachings, poetry, and social reforms shaped Kashmir's unique ethos of harmony and peace.
          </p>
        </div>

        {/* Saints Card Grid */}
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-2 border-red-900 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-ui text-sm text-slate-400">Loading saints directory…</p>
          </div>
        ) : saints.length === 0 ? (
          <div className="rounded-3xl p-14 text-center border border-slate-200 bg-[#FAF8F5] space-y-4">
            <Compass className="w-14 h-14 text-slate-200 mx-auto" />
            <h3 className="font-editorial text-2xl font-bold text-slate-800">No Saints Cataloged Yet</h3>
            <p className="font-ui text-sm text-slate-500 max-w-md mx-auto">
              The saints catalog is currently empty. Add new Sufi masters and Reshi biographies from the Admin Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saints.map((saint) => (
              <div
                key={saint.id}
                onClick={() => setSelectedSaint(saint)}
                className="bg-[#FAF8F5] rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer card-hover"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <img
                    src={saint.image}
                    alt={saint.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-editorial text-lg font-bold text-amber-200 leading-snug">
                      {saint.name}
                    </p>
                    {saint.kashmiriName && (
                      <p className="font-editorial text-xs text-amber-400 font-medium" dir="rtl">
                        {saint.kashmiriName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col gap-4">

                  {/* Order badge only — NO period/century shown */}
                  {saint.order && (
                    <span className="self-start px-3 py-1 rounded-full text-[10px] font-ui font-bold uppercase tracking-wider bg-red-900 text-amber-300 border border-amber-500/20">
                      {saint.order} Order
                    </span>
                  )}

                  {/* Biography excerpt */}
                  {saint.biography && (
                    <p className="font-ui text-[13px] text-slate-600 leading-relaxed line-clamp-3 flex-1">
                      {saint.biography}
                    </p>
                  )}

                  {/* Famous quote */}
                  {saint.famousSaying?.english && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-[10px] font-ui font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                        <Feather className="w-3 h-3 text-red-700" />
                        Key Teaching
                      </p>
                      <p className="font-editorial italic text-amber-950 text-xs font-semibold line-clamp-2">
                        "{saint.famousSaying.english}"
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {saint.shrineLocation ? (
                      <span className="flex items-center gap-1 text-red-900 font-ui font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{saint.shrineLocation}</span>
                      </span>
                    ) : <span />}

                    <span className="flex items-center gap-1 font-ui font-semibold text-amber-700 group-hover:text-red-800 transition-colors">
                      Read Story
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSaint && (
        <SaintDetailModal
          saint={selectedSaint}
          onClose={() => setSelectedSaint(null)}
        />
      )}
    </>
  );
};
