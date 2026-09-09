import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Compass,
  Feather,
  Code,
  Globe,
  Info,
  ExternalLink,
  Terminal,
  Layers,
  Smartphone,
  Briefcase,
  Database,
  Brain,
  Server,
  FileCode,
  Check,
  BookOpen,
  Award,
  ShieldCheck,
  MapPin,
  Heart,
  Users,
  Building2,
  CheckCircle2,
  Copy,
  X,
  ArrowRight,
  Sparkles,
  Quote,
  Mail,
  Phone,
  BookmarkCheck,
  Library,
  Volume2,
  Trophy,
  Star,
  FileDown,
  TrendingUp,
  Cpu,
  Monitor,
  FolderGit2,
  Bot,
  Zap
} from 'lucide-react';

/* ── SVG Brand Icons for Developer & Founder ───────────────────────── */
const GitHubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

const YouTubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const PinterestIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.24-.19.291-.439.175-1.637-.762-2.66-3.153-2.66-5.074 0-4.133 3.003-7.929 8.665-7.929 4.549 0 8.086 3.242 8.086 7.576 0 4.52-2.849 8.161-6.804 8.161-1.328 0-2.576-.69-3.003-1.507l-.817 3.109c-.296 1.127-1.097 2.539-1.634 3.407C9.932 23.824 10.96 24 12.017 24c6.627 0 12-5.373 12-12S18.644 0 12.017 0z" />
  </svg>
);

interface AboutUsProps {
  themeMode?: 'ivory' | 'sepia' | 'dark';
}

export const AboutUs: React.FC<AboutUsProps> = ({ themeMode = 'ivory' }) => {
  const isDark = themeMode === 'dark';
  const isSepia = themeMode === 'sepia';

  const [selectedProfile, setSelectedProfile] = useState<'sahil' | 'saquib' | null>(null);
  const [activeSahilTab, setActiveSahilTab] = useState<'story' | 'initiatives' | 'philosophy' | 'contact'>('story');
  const [copiedMsme, setCopiedMsme] = useState(false);
  const [sahilImgError, setSahilImgError] = useState(false);
  const [saquibImgError, setSaquibImgError] = useState(false);

  // Close modal on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProfile(null);
      }
    };
    if (selectedProfile) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProfile]);

  const developerServices = [
    {
      icon: Layers,
      title: 'Web Apps',
      sub: 'Dynamic & Scalable Systems',
      badge: 'Full-Stack',
      desc: 'High-performance web applications, SaaS platforms, and responsive dashboards built with modern frameworks.',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    },
    {
      icon: Smartphone,
      title: 'Apps',
      sub: 'Android & Cross-Platform',
      badge: 'Mobile Systems',
      desc: 'Native and cross-platform mobile apps featuring fluid navigation, offline caching, and responsive UI.',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    },
    {
      icon: Monitor,
      title: 'Websites',
      sub: 'Business & Personal Portfolios',
      badge: 'UI/UX & Branding',
      desc: 'Tailored business showcase sites and bespoke personal portfolio portals built for conversion and SEO.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      icon: Server,
      title: 'Software Systems',
      sub: 'APIs & Backend Architecture',
      badge: 'Enterprise Backend',
      desc: 'Robust system architectures, secure RESTful APIs, database design, and cloud-ready digital backbones.',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
    },
    {
      icon: Bot,
      title: 'ChatBots',
      sub: 'Conversational Intelligence',
      badge: 'AI Assistants',
      desc: 'Context-aware interactive chatbots, customer support bots, and LLM-powered knowledge query agents.',
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      icon: Zap,
      title: 'Automations',
      sub: 'Workflows & Task Scripts',
      badge: 'Pipelines',
      desc: 'Custom automation scripts, scheduled data scrapers, automated sync pipelines, and operational workflows.',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
    }
  ];

  const copyRegistrationNumber = () => {
    navigator.clipboard.writeText('UDYAM-JK-11-0013563');
    setCopiedMsme(true);
    setTimeout(() => setCopiedMsme(false), 2000);
  };

  const corePillars = [
    {
      icon: MapPin,
      title: 'Sacred Shrines & Spatial Atlas',
      kashmiri: 'زیارات و آستان',
      description: 'Geographically mapping, photographing, and detailing the architectural geometry, local custody, and visitor guidelines of historical Ziyarats across Jammu & Kashmir.'
    },
    {
      icon: Feather,
      title: 'Manuscripts & Mystical Verse',
      kashmiri: 'صوفیانہ کلام و واکھ',
      description: 'Translating rare Kashmiri manuscript verses (Vakhs, Shruks, and Sufiana Kalam) of Lal Ded, Sheikh-ul-Alam, Shams Faqir, Wahab Khar, and Rasul Mir into contemporary English & Urdu.'
    },
    {
      icon: Library,
      title: 'Oral Histories & Vanishing Traditions',
      kashmiri: 'روایات و تذکرہ',
      description: 'Documenting unrecorded elder narratives, Khanqah chants, folk legends, and custodianship chronicles before they are eroded by rapid modernization.'
    },
    {
      icon: Heart,
      title: 'Reshi-Sufi Syncretism & Kashmiriyat',
      kashmiri: 'ریشی و تصوف',
      description: 'Celebrating Kashmir’s distinctive cultural soul—rooted in non-violence, mutual love, ecological mindfulness, and universal brotherhood across community lines.'
    }
  ];

  const archivalEthics = [
    {
      title: 'Strict Factual Authenticity',
      desc: 'We strictly differentiate between documented historical evidence and local devotional folklore. No spurious dates or unverified claims are published as historical fact.'
    },
    {
      title: '100% Free Public Commons',
      desc: 'All archives, translations, maps, and biographical directories are made available freely for scholars, students, travelers, and seekers worldwide without paywalls.'
    },
    {
      title: 'Community Respect & Custody',
      desc: 'Every shrine profile and oral history is cataloged with deep reverence for traditional caretakers (Mutawallis), preserving sacred sanctity and cultural sensitivity.'
    },
    {
      title: 'Preservation for Posterity',
      desc: 'Digitizing vulnerable manuscripts and recordings into durable, searchable digital formats accessible on modern web, tablet, and mobile devices.'
    }
  ];

  /* ── Guaranteed Theme Styles for Modals ────────────────────────── */
  const modalBg = isDark ? 'bg-[#0E0E12] text-slate-100 border-amber-400/60' : isSepia ? 'bg-[#FAF5EE] text-[#2B231B] border-amber-300' : 'bg-white text-slate-900 border-amber-300';
  const modalSubCardBg = isDark ? 'bg-[#17171C] border-slate-800' : isSepia ? 'bg-[#F2ECE1] border-amber-200' : 'bg-slate-50 border-slate-200';
  const modalTextMain = isDark ? 'text-white' : isSepia ? 'text-[#2B231B]' : 'text-slate-950';
  const modalTextMuted = isDark ? 'text-slate-300' : isSepia ? 'text-[#5C4D3C]' : 'text-slate-600';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fadeIn">

      {/* ══════════════════════════════════════════
          HERO BANNER: ABOUT VOICE OF SUFISM
      ══════════════════════════════════════════ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2b0808] via-[#450A0A] to-[#120404] text-white p-7 sm:p-12 border-2 border-amber-400/40 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
              <BookOpen className="w-4 h-4" />
              <span>Digital Cultural Heritage Archive</span>
            </div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Registered under MSME, Govt. of India</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              About <span className="gold-gradient-text">Voice of Sufism</span>
            </h1>
            <p className="text-xl sm:text-2xl font-serif text-amber-200/90 font-medium tracking-wide">
              صداۓ تصوف — Kashmir's Digital Living Sanctuary
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-amber-100/80 max-w-4xl leading-relaxed font-sans pt-1">
              Voice of Sufism is an independent, non-partisan digital humanities and cultural preservation initiative headquartered in Srinagar, Jammu & Kashmir. We are dedicated to systematically documenting, translating, and preserving Kashmir’s centuries-old mystical literature, sacred shrines, oral histories, and Reshi philosophy for future generations.
            </p>
          </div>
        </div>

        {/* ── Official MSME Accreditation Card in Hero ── */}
        <div className="relative z-10 rounded-2xl bg-black/50 backdrop-blur-md border border-amber-400/40 p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black flex-shrink-0 shadow-lg border-2 border-amber-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    Official Recognition
                  </span>
                  <span className="text-[11px] text-amber-300/80 font-medium">
                    Govt. of India
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-white leading-snug">
                  Registered under MSME, Government of India
                </p>
                <p className="text-xs text-slate-300">
                  Ministry of Micro, Small & Medium Enterprises • Srinagar, J&K
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-900/90 border border-amber-400/30 rounded-xl px-3.5 py-2.5 self-stretch sm:self-auto justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300/70 block">
                  Registration No.
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 tracking-wider">
                  UDYAM-JK-11-0013563
                </span>
              </div>
              <button
                type="button"
                onClick={copyRegistrationNumber}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${copiedMsme
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

      {/* ══════════════════════════════════════════
          SECTION 1: THE ESSENCE & MISSION
      ══════════════════════════════════════════ */}
      <section className={`rounded-3xl p-6 sm:p-10 border shadow-lg space-y-8 transition-colors ${isDark
        ? 'bg-[#09090B] border-red-900/80 text-white'
        : isSepia
          ? 'bg-[#FAF5EE] border-amber-300 text-[#2B231B]'
          : 'bg-white border-slate-200/90 text-slate-900'
        }`}>
        <div className="border-b border-red-900/20 pb-6 space-y-2">
          <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-red-900'}`}>
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Origins & Philosophical Genesis</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
            The Story & Purpose of Voice of Sufism
          </h2>
          <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-amber-300/90' : 'text-amber-900'}`}>
            Bridging centuries of oral mysticism, sacred geography, and digital accessibility
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className={`lg:col-span-7 space-y-5 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            <p className={`font-medium text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              For over seven centuries, Kashmir has been honored as <strong>Rishi-Vaer</strong>—the valley of saints and spiritual seekers. It was here that indigenous Shaivite contemplation, Quranic mysticism, and Persian Sufism harmonized into a unique cultural synthesis known as <strong>Kashmiriyat</strong>.
            </p>
            <p>
              Figures such as <strong>Lal Ded</strong> with her transformative <em>Vakhs</em>, <strong>Hazrat Sheikh Noor-ud-Din Wali (Nund Reshi)</strong> with his moral <em>Shruks</em>, and master luminaries like <strong>Mir Sayyid Ali Hamadani (Shah-e-Hamadan)</strong> planted the seeds of unconditional love, compassion for all living beings, and community solidarity.
            </p>
            <p>
              However, with rapid generational transitions and technological displacement, much of this invaluable cultural treasure has remained scattered across rare handwritten manuscripts in private archives, deteriorating village shrines, or retained only in the memory of aging traditional custodians.
            </p>
            <p>
              <strong>Voice of Sufism</strong> was established to meet this critical cultural calling: to build a permanent, digitally accessible, aesthetically refined home where anyone across the world can discover the authentic spiritual wisdom and heritage of Kashmir.
            </p>
          </div>

          {/* Side Panel: Mission Manifesto */}
          <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-5 ${isDark
            ? 'bg-[#121214] border-red-900/60 text-white'
            : 'bg-[#FAF8F5] border-amber-200 text-slate-900'
            }`}>
            <div className="flex items-center space-x-2 text-amber-600">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif font-bold text-lg">Our Mission Manifesto</h3>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Authentic Documentation:</strong> Record shrines, saints, and verses with rigorous historical integrity.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Accessible Translations:</strong> Bridge classical Kashmiri verse to modern English & Urdu with phonetic clarity.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Open Digital Commons:</strong> Safeguard cultural heritage as a non-commercial, publicly accessible knowledge base.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Interfaith Fellowship:</strong> Highlight the shared humanistic foundations of the Reshi and Sufi traditions.</span>
              </li>
            </ul>

            <div className={`pt-3 border-t text-xs italic font-serif ${isDark ? 'border-red-900/40 text-amber-300' : 'border-amber-300/30 text-amber-800'}`}>
              "To record a saint’s prayer or a poet’s verse is not merely an archival act; it is an act of spiritual stewardship for generations to come."
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: CORE PILLARS OF THE ARCHIVE
      ══════════════════════════════════════════ */}
      <section className={`rounded-3xl p-6 sm:p-10 border shadow-lg space-y-8 transition-colors ${isDark
        ? 'bg-[#09090B] border-red-900/80 text-white'
        : isSepia
          ? 'bg-[#FAF5EE] border-amber-300 text-[#2B231B]'
          : 'bg-white border-slate-200/90 text-slate-900'
        }`}>
        <div className="border-b border-red-900/20 pb-6 space-y-2">
          <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-red-900'}`}>
            <Layers className="w-4 h-4 text-amber-600" />
            <span>The Archival Work</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Four Pillars of Voice of Sufism
          </h2>
          <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-amber-300/90' : 'text-amber-900'}`}>
            How we systematically preserve Kashmir's cultural and spiritual patrimony
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all space-y-3 ${isDark
                  ? 'bg-[#121214] border-red-900/50 hover:border-amber-400/60'
                  : 'bg-[#FAF8F5] border-amber-200/80 hover:border-amber-400 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-950 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className={`font-serif text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    {pillar.kashmiri}
                  </span>
                </div>
                <h3 className={`font-serif font-bold text-lg sm:text-xl ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: ARCHIVAL STANDARDS & ETHICS
      ══════════════════════════════════════════ */}
      <section className={`rounded-3xl p-6 sm:p-10 border shadow-lg space-y-8 transition-colors ${isDark
        ? 'bg-[#09090B] border-red-900/80 text-white'
        : isSepia
          ? 'bg-[#FAF5EE] border-amber-300 text-[#2B231B]'
          : 'bg-white border-slate-200/90 text-slate-900'
        }`}>
        <div className="border-b border-red-900/20 pb-6 space-y-2">
          <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-red-900'}`}>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Commitment to Accuracy</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Our Archival Standards & Ethics
          </h2>
          <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-amber-300/90' : 'text-amber-900'}`}>
            Responsible, verified curation rooted in respect and factual integrity
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {archivalEthics.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-2.5 ${isDark
                ? 'bg-[#121214] border-red-900/40'
                : 'bg-[#FAF8F5] border-slate-200'
                }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-600 font-bold flex items-center justify-center text-xs font-mono">
                0{idx + 1}
              </div>
              <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {item.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: PEOPLE BEHIND VOICE OF SUFISM
          (Profile Cards Only - Click to open Modal)
      ══════════════════════════════════════════ */}
      <section className={`rounded-3xl p-6 sm:p-10 border shadow-lg space-y-8 transition-colors ${isDark
        ? 'bg-[#09090B] border-red-900/80 text-white'
        : isSepia
          ? 'bg-[#FAF5EE] border-amber-300 text-[#2B231B]'
          : 'bg-white border-slate-200/90 text-slate-900'
        }`}>
        <div className="border-b border-red-900/20 pb-6 space-y-2">
          <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-red-900'}`}>
            <Users className="w-4 h-4 text-amber-600" />
            <span>Leadership & Digital Architecture</span>
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
            The Minds Behind the Mission
          </h2>
          <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-amber-300/90' : 'text-amber-900'}`}>
            Click on either profile card below to discover their in-depth story, milestones, philosophy, and contributions
          </p>
        </div>

        {/* ── Two Prominent Profile Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

          {/* Card 1: Bhat Sahil (The Man Behind the Mission) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => { setSelectedProfile('sahil'); setActiveSahilTab('story'); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedProfile('sahil'); setActiveSahilTab('story'); } }}
            className={`group cursor-pointer rounded-2xl p-6 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between space-y-6 text-left relative overflow-hidden ${isDark
              ? 'bg-[#121214] border-red-900/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10'
              : 'bg-[#FAF8F5] border-amber-200 hover:border-amber-400 hover:shadow-xl'
              }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm">
                  The Man Behind the Mission
                </span>
                <span className="text-xs font-semibold text-amber-600 group-hover:underline flex items-center gap-1">
                  <span>Explore Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-red-900 to-black text-amber-400 font-serif font-bold flex items-center justify-center shadow-lg border-2 border-amber-400/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {!sahilImgError ? (
                    <img
                      src="/sahil-amin.jpeg"
                      alt="Bhat Sahil"
                      onError={() => setSahilImgError(true)}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <span className="text-amber-400 font-serif font-bold text-3xl">ص</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className={`font-serif font-bold text-2xl group-hover:text-amber-600 transition-colors ${isDark ? 'text-white' : 'text-slate-950'
                    }`}>
                    Bhat Sahil
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-amber-600">
                    Founder & Mission Director
                  </p>
                  <p className="text-xs text-slate-500">
                    Kulgam, Jammu & Kashmir
                  </p>
                </div>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                Deeply rooted in Kashmir's spiritual landscape, Bhat Sahil initiated Voice of Sufism after extensive field travels across all 20 districts to preserve dying oral lore, rare manuscripts, and shrine legacies into a perpetual living archive.
              </p>

              {/* Founder Social & Contact Badges */}
              <div className="flex items-center flex-wrap gap-2 pt-1">
                <a
                  href="https://youtube.com/@voicesaahil1913?si=4Roj1J0HVJGrjLzX"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-red-600/10 border border-red-600/30 text-red-600 hover:bg-red-600 hover:text-white transition-all hover:scale-105"
                  title="YouTube Channel"
                  aria-label="YouTube Channel"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.instagram.com/voice_of_sufism?stkn=ZHg3cTBjcXpvZGJv"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-pink-600/10 border border-pink-600/30 text-pink-600 hover:bg-pink-600 hover:text-white transition-all hover:scale-105"
                  title="Instagram Page"
                  aria-label="Instagram Page"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.facebook.com/share/1BgsXBbhqw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all hover:scale-105"
                  title="Facebook Page"
                  aria-label="Facebook Page"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://pin.it/46iHTerEz"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-[#E60023]/10 border border-[#E60023]/30 text-[#E60023] hover:bg-[#E60023] hover:text-white transition-all hover:scale-105"
                  title="Pinterest Gallery"
                  aria-label="Pinterest Gallery"
                >
                  <PinterestIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="mailto:mohmmadaminbhat1@gmail.com"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 hover:bg-amber-500 hover:text-slate-950 transition-all hover:scale-105"
                  title="Direct Email (mohmmadaminbhat1@gmail.com)"
                  aria-label="Direct Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://wa.me/919596154384"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-emerald-600/10 border border-emerald-600/30 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all hover:scale-105"
                  title="WhatsApp (+91 9596154384)"
                  aria-label="WhatsApp Founder"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-300/30 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Heritage Stewardship & Research
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedProfile('sahil'); setActiveSahilTab('story'); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold shadow-xs hover:bg-amber-300 transition-colors"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Saquib Nazeer (The Developer & Digital Architect) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedProfile('saquib')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedProfile('saquib'); }}
            className={`group cursor-pointer rounded-2xl p-6 sm:p-7 border-2 transition-all duration-300 flex flex-col justify-between space-y-5 text-left relative overflow-hidden ${isDark
              ? 'bg-[#121214] border-red-900/70 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10'
              : 'bg-[#FAF8F5] border-amber-200 hover:border-amber-400 hover:shadow-xl'
              }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-amber-300 border border-amber-400/40 shadow-sm">
                  Lead Software Architect
                </span>
                <span className="text-xs font-semibold text-amber-600 group-hover:underline flex items-center gap-1">
                  <span>Explore Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 via-red-900 to-black text-amber-400 font-serif font-bold flex items-center justify-center shadow-lg border-2 border-amber-400/50 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {!saquibImgError ? (
                    <img
                      src="/saquib_nazeer.jpg"
                      alt="Saquib Nazeer"
                      onError={() => setSaquibImgError(true)}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <span className="text-amber-400 font-sans font-black text-2xl">SN</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className={`font-serif font-bold text-2xl group-hover:text-amber-600 transition-colors ${isDark ? 'text-white' : 'text-slate-950'
                    }`}>
                    Saquib Nazeer
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-amber-600">
                    Full-Stack Developer & AI Engineer
                  </p>
                  <p className="text-xs text-slate-500">
                    Kulgam, Jammu & Kashmir
                  </p>
                </div>
              </div>

              {/* Concise Description */}
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                Full-Stack Developer & AI Engineer specializing in scalable web systems, computer vision, and modern intelligent UI/UX.
              </p>

              {/* Services Tags Preview */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Web Apps', 'Apps', 'Websites', 'Software Systems', 'ChatBots', 'Automations'].map((svc, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${isDark
                      ? 'bg-white/5 border-white/10 text-amber-300/90'
                      : 'bg-amber-500/10 border-amber-300 text-amber-900'
                      }`}
                  >
                    {svc}
                  </span>
                ))}
              </div>

              {/* Portfolio & Social / Contact Links as Logos/Icons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href="https://saquibb.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-xs hover:scale-105"
                  title="Visit saquibb.me"
                  aria-label="Portfolio saquibb.me"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://github.com/SaquibNazeer01"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/15 text-white' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                    }`}
                  title="GitHub Profile (@SaquibNazeer01)"
                  aria-label="GitHub Profile"
                >
                  <GitHubIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/saquib-nazeer-2b3043326"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-xl bg-[#0077b5]/10 border border-[#0077b5]/30 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all hover:scale-105"
                  title="LinkedIn Profile"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://www.youtube.com/@Bhat_Saakib019"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30 text-red-600 hover:bg-red-600 hover:text-white transition-all hover:scale-105"
                  title="YouTube Tech Channel (@Bhat_Saakib019)"
                  aria-label="YouTube Channel"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="mailto:bhatsaakib505@gmail.com"
                  onClick={(e) => e.stopPropagation()}
                  className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/15 text-amber-400' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-amber-700'
                    }`}
                  title="Email: bhatsaakib505@gmail.com"
                  aria-label="Email Developer"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://drive.google.com/file/d/1VI8GFt9X1iXj6tFWJChIkYm911kMwSHQ/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/30 text-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:scale-105"
                  title="Resume / CV"
                  aria-label="Resume Download"
                >
                  <FileDown className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-300/30 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                10+ Shipped Builds • AI & Web
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedProfile('saquib'); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold shadow-xs hover:bg-amber-300 transition-colors"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          REACT PORTAL MODALS (Rendered directly at document.body
          so they are NEVER trapped in parent stacking contexts)
      ════════════════════════════════════════════════════════════ */}
      {selectedProfile && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 sm:py-8 animate-fadeIn"
          onClick={() => setSelectedProfile(null)}
        >
          {/* Modal Box */}
          <div
            className={`relative w-full max-w-4xl my-auto sm:my-4 rounded-2xl sm:rounded-3xl shadow-2xl border-2 overflow-hidden flex flex-col ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Sticky Top Bar with Back, Title & Close ── */}
            <div className={`sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b backdrop-blur-xl ${isDark ? 'bg-[#0E0E12]/95 border-red-900/60' : isSepia ? 'bg-[#FAF5EE]/95 border-amber-300/80' : 'bg-white/95 border-slate-200'
              }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <span>← Go Back</span>
                </button>
                <span className={`text-xs sm:text-sm font-bold font-serif truncate max-w-[160px] sm:max-w-none ${isDark ? 'text-amber-300' : 'text-slate-900'}`}>
                  {selectedProfile === 'sahil' ? 'Founder Profile' : 'Developer Profile'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${isDark ? 'bg-white/10 hover:bg-red-600 text-white' : 'bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700'
                  }`}
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Modal Body Content ── */}
            <div className="p-5 sm:p-8 space-y-6">

              {/* ══════════════════════════════════════════
                  BHAT SAHIL PROFILE CONTENT
              ══════════════════════════════════════════ */}
              {selectedProfile === 'sahil' && (
                <div className="space-y-6">
                  {/* Header Area */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-200 dark:border-red-900/40 pb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-red-900 to-black text-amber-400 font-serif font-bold flex items-center justify-center shadow-xl border-2 border-amber-400/60 flex-shrink-0">
                      {!sahilImgError ? (
                        <img
                          src="/sahil-amin.jpeg"
                          alt="Bhat Sahil"
                          onError={() => setSahilImgError(true)}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <span className="text-amber-400 font-serif font-bold text-4xl">ص</span>
                      )}
                    </div>

                    <div className="text-center sm:text-left space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                          The Man Behind the Mission
                        </span>
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-950 text-amber-300 border border-amber-400/30">
                          Cultural Preservationist
                        </span>
                      </div>

                      <h2 className={`font-serif text-2xl sm:text-4xl font-extrabold ${modalTextMain}`}>
                        Bhat Sahil
                      </h2>
                      <p className="text-sm sm:text-base font-bold text-amber-600">
                        Founder & Mission Director — Voice of Sufism (صداۓ تصوف)
                      </p>
                      <p className={`text-xs ${modalTextMuted} flex items-center justify-center sm:justify-start gap-1`}>
                        <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span>Kulgam, Jammu & Kashmir • Valley-Wide Cultural Repository</span>
                      </p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-red-900/40 pb-3">
                    {[
                      { id: 'story', label: 'His Story & Calling', icon: BookOpen },
                      { id: 'initiatives', label: 'Field Expeditions & Work', icon: Compass },
                      { id: 'philosophy', label: 'Vision & Quotes', icon: Quote },
                      { id: 'contact', label: 'Direct Inquiries', icon: Mail }
                    ].map(tab => {
                      const TabIcon = tab.icon;
                      const isActive = activeSahilTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveSahilTab(tab.id as any)}
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : `${modalSubCardBg} ${modalTextMuted} hover:bg-amber-100 hover:text-slate-950`
                            }`}
                        >
                          <TabIcon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab 1: Story */}
                  {activeSahilTab === 'story' && (
                    <div className="space-y-4 text-sm leading-relaxed animate-fadeIn">
                      <h4 className={`font-serif font-bold text-lg ${modalTextMain}`}>
                        The Sacred Calling: Why Voice of Sufism was Born
                      </h4>
                      <p className={modalTextMuted}>
                        Born and raised in Kulgam amidst Kashmir’s historic Khanqahs and tranquil shrine courtyards, <strong>Bhat Sahil</strong> developed an early, profound reverence for the Valley's mystical geometry. He grew up hearing elder villagers recite profound Kashmiri Vakhs and Shruks from memory—verses that carried centuries of moral wisdom, universal brotherhood, and ecological harmony.
                      </p>
                      <p className={modalTextMuted}>
                        However, with modern rapid urbanization and digital media, Bhat Sahil observed a tragic trend: the younger generation was rapidly becoming disconnected from Kashmir’s indigenous spiritual heritage. Ancient hand-copied manuscripts in private houses were deteriorating; sacred Ziyarats across rural districts remained unmapped and unrecorded; and many oral folklore tales preserved only by elderly custodians were vanishing with every passing year.
                      </p>
                      <p className={modalTextMuted}>
                        Driven by a resolute personal calling, Bhat Sahil set out to create <strong>Voice of Sufism (صداۓ تصوف)</strong>—not as a commercial entity, but as a permanent, open-access, authoritative digital sanctuary. His vision was clear: to collect, translate, and verify Kashmir's mystical treasures using contemporary digital standards while preserving their sacred sanctity.
                      </p>

                      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-[#450A0A] to-slate-950 text-amber-100 border border-amber-400/40 space-y-3 shadow-lg mt-4">
                        <Quote className="w-8 h-8 text-amber-400/70" />
                        <p className="font-serif italic text-base sm:text-lg leading-relaxed text-amber-200">
                          "Preserving the oral history, mystical poetry, and sacred shrines of Kashmir is not just preserving our past—it is lighting a lamp of harmony and self-realization for future generations."
                        </p>
                        <p className="text-xs text-amber-400 font-bold uppercase tracking-wider text-right">
                          — Bhat Sahil (Founder & Mission Director)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Initiatives */}
                  {activeSahilTab === 'initiatives' && (
                    <div className="space-y-5 text-sm leading-relaxed animate-fadeIn">
                      <h4 className={`font-serif font-bold text-lg ${modalTextMain}`}>
                        Groundwork & Key Initiatives Led by Bhat Sahil
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-2xl border space-y-2 ${modalSubCardBg}`}>
                          <div className="flex items-center gap-2 font-serif font-bold text-sm text-amber-600">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span>Valley-Wide Field Expeditions</span>
                          </div>
                          <p className={`text-xs ${modalTextMuted} leading-relaxed`}>
                            Traveling across all 20 districts of Jammu & Kashmir—from Srinagar and Budgam to Kupwara, Anantnag, Pulwama, and Kishtwar—to personally inspect, photograph, and catalog historic Ziyarats.
                          </p>
                        </div>

                        <div className={`p-4 rounded-2xl border space-y-2 ${modalSubCardBg}`}>
                          <div className="flex items-center gap-2 font-serif font-bold text-sm text-amber-600">
                            <Feather className="w-4 h-4 text-amber-600" />
                            <span>Manuscript & Verse Translation</span>
                          </div>
                          <p className={`text-xs ${modalTextMuted} leading-relaxed`}>
                            Directing the systematic translation of classical Kashmiri poetry into English and Urdu prose, ensuring the nuanced spiritual idioms of Lal Ded, Nund Reshi, and Shams Faqir remain accurate.
                          </p>
                        </div>

                        <div className={`p-4 rounded-2xl border space-y-2 ${modalSubCardBg}`}>
                          <div className="flex items-center gap-2 font-serif font-bold text-sm text-amber-600">
                            <Library className="w-4 h-4 text-amber-600" />
                            <span>Oral Custodian Chronicles</span>
                          </div>
                          <p className={`text-xs ${modalTextMuted} leading-relaxed`}>
                            Interviewing hereditary shrine caretakers (*Mutawallis*), traditional singers, and local village elders to record living memories, Urs celebration traditions, and unwritten chronicles.
                          </p>
                        </div>

                        <div className={`p-4 rounded-2xl border space-y-2 ${modalSubCardBg}`}>
                          <div className="flex items-center gap-2 font-serif font-bold text-sm text-emerald-600">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Government Accreditation</span>
                          </div>
                          <p className={`text-xs ${modalTextMuted} leading-relaxed`}>
                            Successfully registered the initiative under the Ministry of MSME, Govt. of India (UDYAM-JK-11-0013563) to secure formal institutional validity, longevity, and public accountability.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Philosophy */}
                  {activeSahilTab === 'philosophy' && (
                    <div className="space-y-4 text-sm leading-relaxed animate-fadeIn">
                      <h4 className={`font-serif font-bold text-lg ${modalTextMain}`}>
                        The Reshi Philosophy & Kashmiriyat
                      </h4>
                      <p className={modalTextMuted}>
                        Bhat Sahil believes that Kashmir's deepest cultural strength is its historical synthesis. The Reshi movement, founded by Sheikh-ul-Alam (Nund Reshi) and enriched by Lal Ded, taught non-violence towards all living creatures, self-abnegation, respect for nature, and spiritual communion that embraced all people regardless of creed.
                      </p>
                      <p className={modalTextMuted}>
                        <em>"Our elders taught that the real shrine is not made of stone or timber alone; it is the inner sanctuary of the human heart purified by love and remembrance. Voice of Sufism exists to remind us of this supreme heritage."</em>
                      </p>

                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 space-y-2">
                        <p className={`font-serif font-bold text-sm ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                          Core Principles Upheld by Bhat Sahil:
                        </p>
                        <ul className={`space-y-1.5 text-xs ${modalTextMuted}`}>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span><strong>Historical Fact Over Legend:</strong> Eliminating fabricated timelines; presenting authentic records.</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span><strong>Sacred Reverence:</strong> Documenting shrines with dignity, respect, and local community blessing.</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span><strong>Universal Open Access:</strong> Resisting commercial monetization; keeping sacred archives free for all humanity.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Contact */}
                  {activeSahilTab === 'contact' && (
                    <div className="space-y-4 text-sm leading-relaxed animate-fadeIn">
                      <h4 className={`font-serif font-bold text-lg ${modalTextMain}`}>
                        Connect Directly with the Founder
                      </h4>
                      <p className={`text-xs sm:text-sm ${modalTextMuted}`}>
                        Scholars, researchers, shrine custodians, or cultural institutions wishing to collaborate, contribute manuscripts, or support the digital preservation initiative can reach Bhat Sahil directly through any of his official channels:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <a
                          href="mailto:mohmmadaminbhat1@gmail.com"
                          className={`p-4 rounded-2xl border hover:border-amber-400 transition-all flex items-center gap-3 group ${modalSubCardBg}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Direct Email</span>
                            <span className="text-xs font-bold group-hover:text-amber-500 transition-colors">
                              mohmmadaminbhat1@gmail.com
                            </span>
                          </div>
                        </a>

                        <a
                          href="https://wa.me/919596154384"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-4 rounded-2xl border hover:border-emerald-400 transition-all flex items-center gap-3 group ${modalSubCardBg}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Phone & WhatsApp</span>
                            <span className="text-xs font-bold group-hover:text-emerald-400 transition-colors">
                              +91 9596154384
                            </span>
                          </div>
                        </a>

                        <a
                          href="https://youtube.com/@voicesaahil1913?si=4Roj1J0HVJGrjLzX"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-4 rounded-2xl border hover:border-red-500 transition-all flex items-center gap-3 group ${modalSubCardBg}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                            <YouTubeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">YouTube Channel</span>
                            <span className="text-xs font-bold group-hover:text-red-500 transition-colors">
                              @voicesaahil1913
                            </span>
                          </div>
                        </a>

                        <a
                          href="https://www.instagram.com/voice_of_sufism?stkn=ZHg3cTBjcXpvZGJv"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-4 rounded-2xl border hover:border-pink-500 transition-all flex items-center gap-3 group ${modalSubCardBg}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                            <InstagramIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Instagram</span>
                            <span className="text-xs font-bold group-hover:text-pink-500 transition-colors">
                              @voice_of_sufism
                            </span>
                          </div>
                        </a>

                        <a
                          href="https://www.facebook.com/share/1BgsXBbhqw/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-4 rounded-2xl border hover:border-blue-500 transition-all flex items-center gap-3 group ${modalSubCardBg}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                            <FacebookIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Facebook</span>
                            <span className="text-xs font-bold group-hover:text-blue-500 transition-colors">
                              Voice of Sufism Page
                            </span>
                          </div>
                        </a>

                        <a
                          href="https://pin.it/46iHTerEz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-4 rounded-2xl border hover:border-red-600 transition-all flex items-center gap-3 group ${modalSubCardBg}`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#E60023] text-white flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                            <PinterestIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pinterest</span>
                            <span className="text-xs font-bold group-hover:text-red-500 transition-colors">
                              Voice of Sufism Board
                            </span>
                          </div>
                        </a>
                      </div>

                      <div className={`p-4 rounded-xl border text-xs space-y-1 ${modalSubCardBg}`}>
                        <p className={`font-bold ${modalTextMain}`}>Headquarters Base:</p>
                        <p className={modalTextMuted}>Voice of Sufism, Srinagar, Jammu & Kashmir (190001)</p>
                        <p className="text-amber-600 font-mono text-[11px] font-bold pt-1">
                          UDYAM Registration: UDYAM-JK-11-0013563
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ══════════════════════════════════════════
                  SAQUIB NAZEER PROFILE (CONCISE, EFFECTIVE & PROFESSIONAL)
              ══════════════════════════════════════════ */}
              {selectedProfile === 'saquib' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Header Area */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-200/80 dark:border-red-900/40 pb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 via-red-900 to-black text-amber-400 font-serif font-bold flex items-center justify-center shadow-xl border-2 border-amber-400/60 flex-shrink-0">
                      {!saquibImgError ? (
                        <img
                          src="/saquib_nazeer.jpg"
                          alt="Saquib Nazeer"
                          onError={() => setSaquibImgError(true)}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <span className="text-amber-400 font-sans font-black text-3xl">SN</span>
                      )}
                    </div>

                    <div className="text-center sm:text-left space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-amber-300 border border-amber-400/40">
                          Lead Software Architect
                        </span>
                      </div>

                      <h2 className={`font-serif text-2xl sm:text-3xl font-extrabold ${modalTextMain}`}>
                        Saquib Nazeer
                      </h2>
                      <p className="text-sm font-bold text-amber-600">
                        Full-Stack Developer & AI Engineer
                      </p>
                      <p className={`text-xs ${modalTextMuted} flex items-center justify-center sm:justify-start gap-1`}>
                        <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span>Kulgam, Jammu & Kashmir</span>
                      </p>

                      {/* Social and Contact Links as Logos/Icons */}
                      <div className="pt-2 flex items-center justify-center sm:justify-start flex-wrap gap-2">
                        {/* Portfolio */}
                        <a
                          href="https://saquibb.me"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-sm hover:scale-105"
                          title="Portfolio Website (saquibb.me)"
                          aria-label="Portfolio Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>

                        {/* GitHub */}
                        <a
                          href="https://github.com/SaquibNazeer01"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/15 text-white' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-900'
                            }`}
                          title="GitHub Profile (@SaquibNazeer01)"
                          aria-label="GitHub Profile"
                        >
                          <GitHubIcon className="w-4 h-4" />
                        </a>

                        {/* LinkedIn */}
                        <a
                          href="https://www.linkedin.com/in/saquibnazeer01"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-[#0077b5]/10 border border-[#0077b5]/30 hover:bg-[#0077b5] text-[#0077b5] hover:text-white transition-all hover:scale-105"
                          title="LinkedIn Profile"
                          aria-label="LinkedIn Profile"
                        >
                          <LinkedInIcon className="w-4 h-4" />
                        </a>

                        {/* YouTube */}
                        <a
                          href="https://www.youtube.com/@Bhat_Saakib019"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30 hover:bg-red-600 text-red-600 hover:text-white transition-all hover:scale-105"
                          title="YouTube Channel (@Bhat_Saakib019)"
                          aria-label="YouTube Channel"
                        >
                          <YouTubeIcon className="w-4 h-4" />
                        </a>

                        {/* Email */}
                        <a
                          href="mailto:bhatsaakib505@gmail.com"
                          className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/15 text-amber-400' : 'bg-white border-slate-200 hover:bg-slate-100 text-amber-600'
                            }`}
                          title="Email: bhatsaakib505@gmail.com"
                          aria-label="Email Saquib"
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        {/* Resume / CV */}
                        <a
                          href="https://drive.google.com/file/d/1VI8GFt9X1iXj6tFWJChIkYm911kMwSHQ/view?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/30 hover:bg-blue-600 text-blue-600 hover:text-white transition-all hover:scale-105"
                          title="Resume / CV"
                          aria-label="Resume Download"
                        >
                          <FileDown className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Concise Description */}
                  <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${modalSubCardBg}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      About
                    </h4>
                    <p className={`text-sm sm:text-base leading-relaxed font-medium ${modalTextMain}`}>
                      Full-Stack Developer & Applied AI Engineer specializing in scalable web systems, cross-platform apps, modern UI/UX design, and intelligent automated workflows. Architect and lead developer of Voice of Sufism (صداۓ تصوف).
                    </p>
                  </div>

                  {/* Services in Attractive Cards with Relevant Icons */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Services & Technical Expertise</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500">Available for Hire & Collaboration</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {developerServices.map((service, idx) => {
                        const Icon = service.icon;
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between space-y-3 ${modalSubCardBg} hover:border-amber-400/70`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${service.color}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-600 border border-amber-400/25">
                                {service.badge}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h5 className={`font-serif font-bold text-base ${modalTextMain}`}>
                                {service.title}
                              </h5>
                              <p className="text-[11px] font-semibold text-amber-600">
                                {service.sub}
                              </p>
                              <p className={`text-xs leading-relaxed pt-1 ${modalTextMuted}`}>
                                {service.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ── Modal Bottom Action Bar ── */}
            <div className={`p-4 sm:px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${isDark ? 'bg-[#0A0A0D] border-red-900/60' : isSepia ? 'bg-[#FAF5EE] border-amber-300/80' : 'bg-slate-50 border-slate-200'
              }`}>
              {selectedProfile === 'saquib' ? (
                <a
                  href="https://saquibb.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Developer Portfolio (saquibb.me)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <a
                  href="mailto:mohmmadaminbhat1@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Founder: mohmmadaminbhat1@gmail.com</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export const BehindTheMission = AboutUs;
export default AboutUs;
