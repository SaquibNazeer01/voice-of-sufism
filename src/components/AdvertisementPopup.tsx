import React, { useState, useEffect, useRef } from 'react';
import { Advertisement } from '../types/cms';
import { SupabaseService } from '../services/supabaseService';
import { 
  X, 
  ExternalLink, 
  Phone, 
  Mail, 
  Sparkles, 
  Clock 
} from 'lucide-react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const AdvertisementPopup: React.FC = () => {
  const [activeAds, setActiveAds] = useState<Advertisement[]>([]);
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load all active advertisements from database
  const loadAdvertisements = async () => {
    try {
      const ads = await SupabaseService.getAdvertisements();
      const filtered = (ads || []).filter(a => a.status === 'Active');
      setActiveAds(filtered);
      return filtered;
    } catch {
      return [];
    }
  };

  // Helper to trigger a random advertisement popup
  const showRandomAd = (adsPool: Advertisement[]) => {
    if (!adsPool || adsPool.length === 0) return;

    // Pick a random advertisement from the pool
    const randomIndex = Math.floor(Math.random() * adsPool.length);
    const selectedAd = adsPool[randomIndex];
    
    setCurrentAd(selectedAd);
    const skipSecs = selectedAd.skipTimerSeconds || 5;
    setCountdown(skipSecs);
    setCanSkip(false);
    setIsVisible(true);
  };

  // Schedule next advertisement display after a randomized interval of 3 to 5 minutes (180,000 to 300,000 ms)
  const scheduleNextAd = (adsPool: Advertisement[]) => {
    if (!adsPool || adsPool.length === 0) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    // Random interval between 3 and 5 minutes (180,000 ms to 300,000 ms)
    const minMs = 3 * 60 * 1000; // 180,000 ms (3 minutes)
    const maxMs = 5 * 60 * 1000; // 300,000 ms (5 minutes)
    const randomIntervalMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

    timerRef.current = setTimeout(() => {
      showRandomAd(adsPool);
    }, randomIntervalMs);
  };

  useEffect(() => {
    loadAdvertisements().then((ads) => {
      if (!ads || ads.length === 0) return;

      // Initial prompt delay: first 5 seconds
      const initialDelayMs = ((ads[0]?.delaySeconds || 5) * 1000);
      
      timerRef.current = setTimeout(() => {
        showRandomAd(ads);
      }, initialDelayMs);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 5-second countdown timer for Skip button
  useEffect(() => {
    if (!isVisible) return;
    if (countdown <= 0) {
      setCanSkip(true);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, countdown]);

  if (!isVisible || !currentAd) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    // Schedule the next random ad after interval
    scheduleNextAd(activeAds);
  };

  const getTargetUrl = () => {
    if (currentAd.targetType === 'whatsapp') {
      const num = (currentAd.contactNumber || currentAd.targetUrl || '').replace(/[^0-9]/g, '');
      return `https://wa.me/${num}`;
    }
    if (currentAd.targetType === 'phone') {
      const num = currentAd.contactNumber || currentAd.targetUrl;
      return `tel:${num}`;
    }
    if (currentAd.targetType === 'email') {
      const mail = currentAd.contactEmail || currentAd.targetUrl;
      return `mailto:${mail}`;
    }
    return currentAd.targetUrl.startsWith('http') ? currentAd.targetUrl : `https://${currentAd.targetUrl}`;
  };

  const handleAdClick = () => {
    if (currentAd.id) {
      SupabaseService.saveAdvertisement({
        ...currentAd,
        clicksCount: (currentAd.clicksCount || 0) + 1
      }).catch(() => {});
    }
    const url = getTargetUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    handleDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-y-auto">
      
      <div className="relative w-full max-w-lg bg-[#09090B] text-white rounded-3xl border-2 border-amber-400/80 shadow-2xl overflow-hidden animate-scaleIn max-h-[92vh] flex flex-col my-auto">
        
        {/* Top Header Bar with Sponsor Badge & Skip Timer */}
        <div className="bg-[#450A0A] px-4 py-2.5 border-b border-red-900/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-400 text-black shadow-xs flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Sponsored</span>
            </span>
            <span className="text-xs font-semibold text-amber-200 truncate max-w-[200px]">
              {currentAd.advertiserName || 'Partner Showcase'}
            </span>
          </div>

          {/* Skip Button / Timer */}
          <div>
            {canSkip ? (
              <button
                onClick={handleDismiss}
                className="flex items-center space-x-1 px-3 py-1 rounded-full bg-black/80 hover:bg-red-950 text-amber-300 hover:text-white text-xs font-bold border border-amber-400/60 transition-colors shadow-sm cursor-pointer"
              >
                <span>Skip Ad</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 text-slate-300 text-[11px] font-mono border border-slate-700">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Skip in {countdown}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Ad Media / Banner Image (Fully visible, responsive, object-contain) */}
          {currentAd.bannerImage && (
            <div 
              onClick={handleAdClick}
              className="w-full bg-[#050505] p-2 sm:p-3 flex items-center justify-center cursor-pointer border-b border-red-950/60 group relative"
            >
              <img
                src={currentAd.bannerImage}
                alt={currentAd.title}
                className="w-full max-h-[300px] sm:max-h-[380px] object-contain rounded-xl shadow-lg group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          )}

          {/* Ad Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <h3 
                onClick={handleAdClick}
                className="font-serif font-extrabold text-lg sm:text-xl text-amber-300 hover:text-amber-200 cursor-pointer transition-colors leading-tight"
              >
                {currentAd.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentAd.description}
              </p>
            </div>

            {/* Contact Details Info if available */}
            {(currentAd.contactNumber || currentAd.contactEmail) && (
              <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-1 border-t border-slate-800">
                {currentAd.contactNumber && (
                  <span className="flex items-center space-x-1 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentAd.contactNumber}</span>
                  </span>
                )}
                {currentAd.contactEmail && (
                  <span className="flex items-center space-x-1 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentAd.contactEmail}</span>
                  </span>
                )}
              </div>
            )}

            {/* Action CTA Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleAdClick}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                {currentAd.targetType === 'whatsapp' ? (
                  <>
                    <WhatsAppIcon />
                    <span>Connect on WhatsApp</span>
                  </>
                ) : currentAd.targetType === 'phone' ? (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </>
                ) : currentAd.targetType === 'email' ? (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Email Inquiry</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Official Website</span>
                  </>
                )}
              </button>

              {canSkip && (
                <button
                  onClick={handleDismiss}
                  className="py-3 px-4 rounded-2xl bg-[#18181B] hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
