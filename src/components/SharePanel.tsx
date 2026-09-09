import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Article } from '../types';
import { getShareLinks } from '../lib/shareUtils';
import { Share2, Copy, Check, X, ExternalLink } from 'lucide-react';

/* ── Platform SVG icons ─────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

/* ── Types ──────────────────────────────────────────────────── */
interface SharePanelProps {
  article: Article;
  /** Where to anchor the panel — 'top' renders above the trigger, 'bottom' below */
  position?: 'top' | 'bottom';
  /** Trigger element style variant */
  variant?: 'icon' | 'button' | 'full';
  /** Optional extra class on the trigger button */
  triggerClassName?: string;
  /** Called when panel opens/closes */
  onToggle?: (open: boolean) => void;
}

export const SharePanel: React.FC<SharePanelProps> = ({
  article,
  position = 'top',
  variant = 'icon',
  triggerClassName = '',
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* Close when clicking outside */
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        onToggle?.(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isOpen;
    setIsOpen(next);
    onToggle?.(next);
  }, [isOpen, onToggle]);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const links = getShareLinks(article);
    try {
      await navigator.clipboard.writeText(links.articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback */
      const ta = document.createElement('textarea');
      ta.value = links.articleUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const openLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const links = getShareLinks(article);

  /* ── Platform buttons config ──────────────────────────────── */
  const platforms = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: WhatsAppIcon,
      url: links.whatsapp,
      bg: 'bg-[#25D366] hover:bg-[#20b858]',
      text: 'text-white',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: FacebookIcon,
      url: links.facebook,
      bg: 'bg-[#1877F2] hover:bg-[#1664d8]',
      text: 'text-white',
    },
    {
      id: 'twitter',
      label: 'Twitter / X',
      icon: TwitterXIcon,
      url: links.twitter,
      bg: 'bg-[#0F1419] hover:bg-[#1a1f24]',
      text: 'text-white',
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: TelegramIcon,
      url: links.telegram,
      bg: 'bg-[#2AABEE] hover:bg-[#1e9ad6]',
      text: 'text-white',
    },
  ];

  /* ── Trigger button rendering ─────────────────────────────── */
  const triggerLabel = variant === 'full'
    ? 'Share This Story'
    : variant === 'button'
    ? 'Share'
    : undefined;

  return (
    <div className="relative flex-shrink-0">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Share this article"
        className={`flex items-center gap-1.5 transition-all ${
          isOpen
            ? 'text-amber-400'
            : 'text-slate-400 hover:text-amber-400'
        } ${triggerClassName}`}
      >
        <Share2 className="w-4 h-4 flex-shrink-0" />
        {triggerLabel && (
          <span className="text-[12px] font-ui font-semibold whitespace-nowrap">{triggerLabel}</span>
        )}
      </button>

      {/* Share panel popover */}
      {isOpen && (
        <div
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 right-0 w-72 animate-fadeInUp
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="font-ui text-xs font-bold text-white uppercase tracking-wider">Share This Story</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); onToggle?.(false); }}
              className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Article preview strip */}
          <div className="px-4 py-3 border-b border-white/[0.07] flex items-start gap-3">
            {article.heroImage && (
              <img
                src={article.heroImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-white/10"
              />
            )}
            <div className="min-w-0">
              <p className="font-editorial text-sm font-bold text-white line-clamp-2 leading-snug">{article.title}</p>
              <p className="font-ui text-[11px] text-slate-500 mt-0.5">{article.category} · {article.locationName}</p>
            </div>
          </div>

          {/* Platform buttons */}
          <div className="p-3 grid grid-cols-2 gap-2">
            {platforms.map(({ id, label, icon: Icon, url, bg, text }) => (
              <button
                key={id}
                onClick={(e) => openLink(e, url)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${bg} ${text} text-[12px] font-ui font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] shadow-sm`}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Copy link section */}
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <div className="flex-1 min-w-0">
                <p className="font-ui text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Article Link</p>
                <p className="font-ui text-[11px] text-slate-300 truncate">{links.articleUrl}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-ui font-bold transition-all ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/20'
                }`}
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5" /><span>Copied!</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
                )}
              </button>
            </div>
          </div>

          {/* Branded footer */}
          <div className="px-4 pb-3 text-center">
            <p className="font-ui text-[10px] text-slate-600 font-medium">
              Voice of Sufism · Kashmir Heritage Archive
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Standalone Share Bar (used inside ReadingViewModal body) ── */
interface ShareBarProps {
  article: Article;
}

export const ShareBar: React.FC<ShareBarProps> = ({ article }) => {
  const [copied, setCopied] = useState(false);
  const links = getShareLinks(article);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(links.articleUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = links.articleUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const platforms = [
    { label: 'WhatsApp', url: links.whatsapp, icon: WhatsAppIcon,  bg: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/20' },
    { label: 'Facebook', url: links.facebook, icon: FacebookIcon,  bg: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/20' },
    { label: 'Twitter',  url: links.twitter,  icon: TwitterXIcon,  bg: 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'              },
    { label: 'Telegram', url: links.telegram, icon: TelegramIcon,  bg: 'bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 text-[#2AABEE] border-[#2AABEE]/20' },
  ];

  return (
    <div className="py-6 border-t border-white/[0.07]">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-amber-400" />
        <span className="font-ui text-xs font-bold text-amber-400 uppercase tracking-widest">Share This Story</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {platforms.map(({ label, url, icon: Icon, bg }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12px] font-ui font-semibold transition-all hover:scale-105 active:scale-95 ${bg}`}
          >
            <Icon />
            <span>{label}</span>
          </a>
        ))}
      </div>

      {/* Copy link row */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <span className="flex-1 font-ui text-[11px] text-slate-400 truncate">{links.articleUrl}</span>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-ui font-bold transition-all ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/20'
          }`}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};
