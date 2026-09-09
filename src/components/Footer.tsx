import React, { useState } from 'react';
import { Mail, Check, ExternalLink, Info, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { HERITAGE_SITES_DATA } from '../data/heritageSites';
import { ZiyaratDetailModal } from './ZiyaratDetailModal';
import { HeritageSite } from '../types';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenAdminLogin?: () => void;
}

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
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.24-.19.291-.439.175-1.637-.762-2.66-3.153-2.66-5.074 0-4.133 3.003-7.929 8.665-7.929 4.549 0 8.086 3.242 8.086 7.576 0 4.52-2.849 8.161-6.804 8.161-1.328 0-2.576-.69-3.003-1.507l-.817 3.109c-.296 1.127-1.097 2.539-1.634 3.407C9.932 23.824 10.96 24 12.017 24c6.627 0 12-5.373 12-12S18.644 0 12.017 0z"/>
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedZiyarat, setSelectedZiyarat] = useState<HeritageSite | null>(null);
  const [isZiyaratModalOpen, setIsZiyaratModalOpen] = useState(false);

  const handleOpenZiyarat = (site: HeritageSite) => {
    setSelectedZiyarat(site);
    setIsZiyaratModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const navLinks = [
    { id: 'home',     label: 'Home & Latest Stories' },
    { id: 'saints',   label: 'Sufi Saints & Reshi Masters' },
    { id: 'poetry',   label: 'Vakhs, Shruks & Poetry' },
    { id: 'gallery',  label: 'Archival Photo Gallery' },
    { id: 'sponsors', label: 'Sponsors & Patrons' },
    { id: 'about',    label: 'About Us & Mission' },
  ];

  const ziyarats = [
    'Charar-i-Sharief, Budgam',
    'Khanqah-e-Moula, Srinagar',
    'Dargah Hazratbal, Dal Lake',
    'Aishmuqam Shrine, Pahalgam',
    'Makhdoom Sahib, Hari Parbat',
    'Jamia Masjid, Nowhatta',
  ];

  const socials = [
    { label: 'Facebook',  href: 'https://www.facebook.com/share/1BgsXBbhqw/',                          icon: FacebookIcon,  color: 'hover:text-blue-400' },
    { label: 'Instagram', href: 'https://www.instagram.com/voice_of_sufism?stkn=ZHg3cTBjcXpvZGJv',         icon: InstagramIcon, color: 'hover:text-pink-400'  },
    { label: 'YouTube',   href: 'https://youtube.com/@voicesaahil1913?si=4Roj1J0HVJGrjLzX',            icon: YouTubeIcon,   color: 'hover:text-red-400'   },
    { label: 'Pinterest', href: 'https://pin.it/46iHTerEz',                                            icon: PinterestIcon, color: 'hover:text-red-500'   },
    { label: 'WhatsApp',  href: 'https://wa.me/919596154384',                                         icon: WhatsAppIcon,  color: 'hover:text-green-400' },
  ];

  return (
    <footer className="bg-[#07070A] text-white">

      {/* ── Newsletter Banner ──────────────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left copy */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-amber-400" />
                <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-amber-400">
                  Heritage Journal
                </span>
              </div>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-white leading-tight">
                Subscribe to Monthly<br />Kashmir Heritage Essays
              </h3>
              <p className="font-ui text-sm text-slate-400 max-w-md leading-relaxed">
                Receive curated research articles, rare archival photos, and translations of Kashmiri Sufi poetry — directly in your inbox.
              </p>
            </div>

            {/* Right form */}
            <div>
              {subscribed ? (
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 text-emerald-400">
                  <div className="w-9 h-9 rounded-full bg-emerald-700/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-ui font-bold text-sm text-emerald-300">You're subscribed!</p>
                    <p className="font-ui text-xs text-emerald-500">Thank you for joining the Heritage Journal.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm font-ui focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/40 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-ui font-bold text-sm whitespace-nowrap shadow-lg shadow-amber-400/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── Four Column Grid ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="space-y-5">
          <BrandLogo size="sm" />
          <p className="font-ui text-[13px] text-slate-400 leading-relaxed">
            An independent digital publication dedicated to preserving Kashmir's centuries-old Sufi traditions, sacred shrines, language, and cultural heritage.
          </p>
          <p className="font-editorial text-sm text-amber-400/70 italic">
            "Ann poshi teli yeli wan poshi"<br />
            <span className="text-[11px] text-slate-500 not-italic">— Sheikh-ul-Alam Nund Reshi</span>
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 pt-1">
            {socials.map(({ label, href, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.07] flex items-center justify-center text-slate-400 ${color} transition-all hover:scale-110`}
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Publication links */}
        <div className="space-y-4">
          <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-white/60">
            Publication
          </h4>
          <ul className="space-y-2.5">
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => onSelectTab(id)}
                  className="font-ui text-[13px] text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-amber-400 transition-all duration-200" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Ziyarats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-white/60">
              Featured Ziyarats
            </h4>
            <span className="text-[10px] text-amber-400/90 font-medium">Click to explore</span>
          </div>
          <ul className="space-y-2">
            {HERITAGE_SITES_DATA.map((site) => (
              <li key={site.id}>
                <button
                  type="button"
                  onClick={() => handleOpenZiyarat(site)}
                  className="font-ui text-[13px] text-slate-400 hover:text-amber-300 transition-all flex items-center justify-between w-full group py-1 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 group-hover:bg-amber-400 group-hover:scale-125 transition-all flex-shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform font-medium">
                      {site.name.split(' (')[0]}
                    </span>
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 group-hover:bg-amber-400/10 text-slate-400 group-hover:text-amber-300 transition-colors border border-white/5">
                    {site.district}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mission & Developer */}
        <div className="space-y-4">
          <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-white/60">
            Mission & Team
          </h4>
          <p className="font-ui text-[13px] text-slate-400 leading-relaxed">
            Founded by <span className="text-white font-semibold">Bhat Sahil</span> to preserve Kashmir's Sufi cultural identity for future generations.
          </p>
          <p className="font-ui text-[13px] text-slate-400 leading-relaxed">
            Digital platform designed &amp; developed by <span className="text-white font-semibold">Saquib Nazeer</span>.
          </p>
          <a
            href="https://saquibb.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/[0.08] text-amber-400 text-xs font-ui font-semibold transition-all hover:text-amber-300"
          >
            <span>saquibb.me</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="mt-1 block text-[12px] font-ui text-slate-500 hover:text-slate-300 transition-colors"
            >
              Admin CMS Portal
            </button>
          )}
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-ui text-slate-500">
          <p>
            © {new Date().getFullYear()} Voice of Sufism (صداۓ تصوف). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('about')} className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>About</span>
            </button>
            <span className="text-white/10">|</span>
            <a href="https://saquibb.me" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>Made by Saquib Nazeer</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Global Ziyarat Detailed Story Modal ── */}
      <ZiyaratDetailModal
        site={selectedZiyarat}
        isOpen={isZiyaratModalOpen}
        onClose={() => setIsZiyaratModalOpen(false)}
        allSites={HERITAGE_SITES_DATA}
        onSelectSite={(site) => setSelectedZiyarat(site)}
      />
    </footer>
  );
};
