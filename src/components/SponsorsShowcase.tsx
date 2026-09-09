import React, { useState, useEffect } from 'react';
import { Sponsor } from '../types/cms';
import { SupabaseService } from '../services/supabaseService';
import { 
  Sparkles, 
  ExternalLink, 
  Phone, 
  Mail, 
  Award, 
  Heart, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

interface SponsorsShowcaseProps {
  themeMode?: 'ivory' | 'sepia' | 'dark';
}

export const SponsorsShowcase: React.FC<SponsorsShowcaseProps> = ({ themeMode = 'ivory' }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    SupabaseService.getSponsors().then(data => {
      setSponsors(data || []);
      setIsLoading(false);
    }).catch(() => {
      setSponsors([]);
      setIsLoading(false);
    });
  }, []);

  const activeSponsors = sponsors.filter(s => s.status === 'Active');

  const tiers = [
    { title: 'Title Sponsors', badge: 'Title Sponsor', icon: CrownIcon, color: 'border-amber-400 bg-gradient-to-r from-amber-500/10 via-red-950/20 to-amber-500/10' },
    { title: 'Platinum Patrons', badge: 'Platinum Patron', icon: Award, color: 'border-slate-300 bg-slate-500/5' },
    { title: 'Gold Partners', badge: 'Gold Partner', icon: Sparkles, color: 'border-amber-600/60 bg-amber-500/5' },
    { title: 'Cultural Heritage Supporters', badge: 'Cultural Heritage Supporter', icon: Heart, color: 'border-emerald-600/60 bg-emerald-500/5' },
  ];

  function CrownIcon(props: any) {
    return <Award {...props} className="w-5 h-5 text-amber-400" />;
  }

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      
      {/* Hero Banner */}
      <section className={`rounded-3xl p-8 sm:p-12 border shadow-xl relative overflow-hidden transition-colors ${
        themeMode === 'dark' 
          ? 'bg-[#09090B] border-red-900 text-white' 
          : themeMode === 'sepia'
          ? 'bg-[#FAF5EE] border-amber-300 text-[#2B231B]'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Patrons & Cultural Partners</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold leading-tight">
            Our Esteemed Sponsors & Heritage Patrons
          </h1>

          <p className="text-sm sm:text-base opacity-80 leading-relaxed font-sans">
            We express our deepest gratitude to the organizations, philanthropists, and cultural patrons whose generous support empowers the digital preservation of Kashmir’s Sufi manuscripts, shrine archives, and artisanal heritage.
          </p>
        </div>
      </section>

      {/* Sponsors Grid Section */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading heritage partners...</p>
        </div>
      ) : activeSponsors.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-red-900/60 shadow-sm space-y-4">
          <Building2 className="w-12 h-12 text-amber-500 mx-auto opacity-70" />
          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Partner With Voice of Sufism</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Become a founding sponsor or institutional partner to support research field surveys, shrine photography, and educational publications across Kashmir.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/919596154384"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-900 to-[#450A0A] hover:from-red-800 hover:to-red-900 text-amber-300 font-bold text-xs shadow-lg transition-transform hover:scale-105"
            >
              <span>Inquire for Sponsorship</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {tiers.map((tier) => {
            const tierSponsors = activeSponsors.filter(s => s.tier === tier.badge);
            if (tierSponsors.length === 0) return null;

            const Icon = tier.icon;

            return (
              <div key={tier.badge} className="space-y-6">
                <div className="flex items-center space-x-3 border-b border-red-900/20 pb-3">
                  <Icon className="w-5 h-5 text-amber-500" />
                  <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-amber-200">
                    {tier.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tierSponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className={`p-6 rounded-3xl border shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${
                        themeMode === 'dark'
                          ? 'bg-[#141417] border-red-900/60 text-white'
                          : themeMode === 'sepia'
                          ? 'bg-[#FAF5EE] border-amber-300/80 text-[#2B231B]'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="space-y-4">
                        
                        {/* Logo and Tier Badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center flex-shrink-0">
                            {sponsor.logo ? (
                              <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                            ) : (
                              <Building2 className="w-8 h-8 text-slate-400" />
                            )}
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-black shadow-xs">
                            {sponsor.tier}
                          </span>
                        </div>

                        {/* Sponsor Info */}
                        <div className="space-y-1.5">
                          <h3 className="font-serif text-xl font-bold leading-snug">
                            {sponsor.name}
                          </h3>
                          {sponsor.tagline && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold italic">
                              {sponsor.tagline}
                            </p>
                          )}
                          <p className="text-xs opacity-80 leading-relaxed font-sans pt-1">
                            {sponsor.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Link / Contact */}
                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        {sponsor.websiteUrl ? (
                          <a
                            href={sponsor.websiteUrl.startsWith('http') ? sponsor.websiteUrl : `https://${sponsor.websiteUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 dark:text-amber-400 hover:underline"
                          >
                            <span>Visit Partner Website</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] opacity-60">Verified Cultural Patron</span>
                        )}

                        <div className="flex items-center space-x-2">
                          {sponsor.contactPhone && (
                            <a 
                              href={`tel:${sponsor.contactPhone}`} 
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-black transition-colors"
                              title="Call Partner"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {sponsor.contactEmail && (
                            <a 
                              href={`mailto:${sponsor.contactEmail}`} 
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-black transition-colors"
                              title="Email Partner"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Become a Sponsor CTA */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-red-950 via-[#450A0A] to-black text-white border-2 border-amber-400/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-amber-400 tracking-wider">
            <Heart className="w-4 h-4 text-amber-400" />
            <span>Support Kashmiri Heritage Documentation</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-200">
            Join Hands As An Institutional Patron
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Support field research, video archives, and authentic Kashmiri manuscript preservation. Contact our team to explore tailored sponsorship & partnership tiers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href="https://wa.me/919596154384"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-105"
          >
            <span>Partner on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="mailto:mohmmadaminbhat1@gmail.com"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-red-900/60 hover:bg-red-900 text-white font-bold text-xs border border-amber-400/40 flex items-center justify-center space-x-2 transition-colors"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Email Proposal</span>
          </a>
        </div>
      </section>

    </div>
  );
};
