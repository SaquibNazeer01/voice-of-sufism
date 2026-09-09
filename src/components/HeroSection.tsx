import React, { useState } from 'react';
import { Article, CategoryType } from '../types';
import { BookOpen, MapPin, ArrowRight, Compass, ShieldCheck, Phone, Mail, Calendar, Building2, Copy, Check } from 'lucide-react';

interface HeroSectionProps {
  featuredArticle?: Article | null;
  onReadArticle: (article: Article) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/* ── Social icon SVGs ───────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
);

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredArticle,
  onReadArticle,
}) => {
  const [copiedMsme, setCopiedMsme] = useState(false);
  const phoneNumber = '+919596154384';
  const email = 'saahilahbhat1@gmail.com';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}`;
  const phoneUrl = `tel:${phoneNumber}`;
  const emailUrl = `mailto:${email}`;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <section className="bg-[#FAF8F5]">

      {/* ══════════════════════════════════════════════
          FULL-WIDTH COVER BANNER
          Natural 16:9 ratio, no height cap
      ══════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden bg-black shadow-2xl">
        <div style={{ paddingTop: '56.25%' }} className="relative w-full">
          <img
            src="/cover.png"
            alt="Voice of Sufism – Heritage Publication"
            className="absolute inset-0 w-full h-full object-cover object-top block"
            onError={(e) => {
              if (featuredArticle?.heroImage) {
                (e.currentTarget as HTMLImageElement).src = featuredArticle.heroImage;
              }
            }}
          />
          {/* Subtle bottom scrim for readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SOCIAL / CONTACT STRIP
          Clean icon-pill row below the banner
      ══════════════════════════════════════════════ */}
      <div className="bg-[#09090B] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">

          <a href="https://www.facebook.com/VoiceOfSufism" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 text-[11px] font-ui font-semibold transition-all hover:scale-105">
            <FacebookIcon /><span>Facebook</span>
          </a>

          <a href="https://www.instagram.com/voiceofsufism" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 text-[11px] font-ui font-semibold transition-all hover:scale-105">
            <InstagramIcon /><span>Instagram</span>
          </a>

          <a href="https://www.youtube.com/@VoiceOfSufism" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-ui font-semibold transition-all hover:scale-105">
            <YouTubeIcon /><span>YouTube</span>
          </a>

          <span className="hidden sm:block w-px h-4 bg-white/10" />

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-[11px] font-ui font-semibold transition-all hover:scale-105">
            <WhatsAppIcon /><span className="hidden sm:inline">WhatsApp</span><span className="sm:hidden">Chat</span>
          </a>

          <a href={phoneUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[11px] font-ui font-semibold transition-all hover:scale-105">
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+91 95961 54384</span>
            <span className="sm:hidden">Call</span>
          </a>

          <a href={emailUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[11px] font-ui font-semibold transition-all hover:scale-105">
            <Mail className="w-3.5 h-3.5" /><span className="hidden sm:inline">Email Us</span><span className="sm:hidden">Email</span>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MASTHEAD / PUBLICATION STRIP
      ══════════════════════════════════════════════ */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-ui font-bold uppercase tracking-widest bg-red-900 text-amber-300">
                Heritage Publication
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-ui font-bold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                MSME Registered · Govt. of India
              </span>
            </div>
            <p className="font-editorial text-sm text-slate-500 italic">
              Kashmir's Premier Digital Archive of Sufi Culture, Sacred Shrines &amp; Mystical Poetry
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-ui text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-red-800" />
            <span>{todayStr}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FEATURED ARTICLE EDITORIAL SECTION
      ══════════════════════════════════════════════ */}
      {featuredArticle && (
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

            {/* Section label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-red-900" />
              <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-red-900">
                Featured Cover Story
              </span>
              <span className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Two-column editorial layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

              {/* Left: text content */}
              <div className="lg:col-span-7 space-y-5 animate-fadeInUp">

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[10px] font-ui font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                    {featuredArticle.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-ui text-red-800">
                    <MapPin className="w-3 h-3 text-red-600" />
                    {featuredArticle.locationName}
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 leading-[1.1] tracking-tight">
                  {featuredArticle.title}
                </h1>

                {featuredArticle.titleUrdu && (
                  <p className="font-editorial text-lg text-red-800 font-medium italic" dir="rtl">
                    {featuredArticle.titleUrdu}
                  </p>
                )}

                <p className="font-ui text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                  {featuredArticle.excerpt}
                </p>

                {/* Author + CTA row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-900 text-amber-300 font-editorial font-bold flex items-center justify-center text-sm shadow-sm">
                      {featuredArticle.author?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="text-xs font-ui font-bold text-slate-900">{featuredArticle.author}</p>
                      <p className="text-[11px] font-ui text-slate-400">{featuredArticle.authorRole} · {featuredArticle.readTime}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onReadArticle(featuredArticle)}
                    className="sm:ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-red-900 hover:bg-red-800 text-white text-sm font-ui font-semibold shadow-lg shadow-red-900/20 hover:shadow-red-900/30 transition-all group border border-amber-500/20"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Read Feature Story</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right: article thumbnail */}
              <div className="lg:col-span-5">
                <div
                  onClick={() => onReadArticle(featuredArticle)}
                  className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border border-slate-200 bg-slate-950"
                >
                  <img
                    src={featuredArticle.heroImage}
                    alt={featuredArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-[260px] sm:h-[340px] lg:h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                    <p className="text-[10px] font-ui uppercase tracking-widest text-amber-400 font-bold">Cover Story</p>
                    <h3 className="font-editorial text-lg sm:text-xl font-bold leading-snug group-hover:text-amber-200 transition-colors">
                      {featuredArticle.subtitle}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-ui text-amber-400 font-semibold">
                      <span>Explore full story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Official MSME Government Registration Card ────────────────── */}
            <div className="mt-10 rounded-2xl bg-gradient-to-r from-slate-900 via-red-950 to-slate-950 border-2 border-amber-400/40 p-5 sm:p-6 text-white shadow-xl hover:border-amber-400/70 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left / Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-amber-300">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        Government Recognized Archive
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verified Active
                      </span>
                    </div>
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-white tracking-wide">
                      Registered Under MSME, Government of India
                    </h3>
                    <p className="text-xs text-slate-300">
                      Ministry of Micro, Small & Medium Enterprises • Srinagar, Jammu & Kashmir
                    </p>
                  </div>
                </div>

                {/* Right / Registration Number Card */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-black/40 border border-amber-400/30 rounded-xl p-3 sm:px-4 sm:py-3 self-stretch lg:self-auto justify-between lg:justify-end">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-amber-300/80">
                      Registration Number
                    </p>
                    <p className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider select-all">
                      UDYAM-JK-11-0013563
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('UDYAM-JK-11-0013563');
                      setCopiedMsme(true);
                      setTimeout(() => setCopiedMsme(false), 2000);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      copiedMsme
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                    title="Copy Registration Number"
                  >
                    {copiedMsme ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
