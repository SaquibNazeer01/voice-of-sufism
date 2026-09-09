import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtext = true 
}) => {
  const [imgError, setImgError] = useState(false);

  // Size mapping for fallback badge
  const badgeSize = size === 'sm' 
    ? 'w-8 h-8 text-sm' 
    : size === 'lg' 
    ? 'w-14 h-14 text-2xl' 
    : 'w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl';

  const logoImgSize = size === 'sm' 
    ? 'max-h-8 sm:max-h-9' 
    : size === 'lg' 
    ? 'max-h-14 sm:max-h-16' 
    : 'max-h-10 sm:max-h-12';

  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 group focus:outline-none min-w-0 ${className}`}>
      
      {/* Custom Image Logo with graceful fallback */}
      {!imgError ? (
        <img
          src="/logo.png"
          alt="Voice of Sufism Logo"
          onError={() => setImgError(true)}
          className={`${logoImgSize} w-auto object-contain transition-transform group-hover:scale-105 rounded-lg`}
        />
      ) : (
        <div className={`${badgeSize} rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-red-950 p-0.5 shadow-md group-hover:scale-105 transition-transform flex-shrink-0`}>
          <div className="w-full h-full bg-[#09090B] rounded-[10px] flex items-center justify-center p-1 border border-amber-500/30">
            <span className="text-amber-400 font-serif font-bold leading-none">
              ص
            </span>
          </div>
        </div>
      )}

      {/* Brand Typography Header */}
      <div className="flex flex-col min-w-0">
        <span className="font-serif font-black text-sm xs:text-base sm:text-lg tracking-wider text-white block leading-tight truncate group-hover:text-amber-300 transition-colors">
          VOICE OF SUFISM
        </span>
        {showSubtext && (
          <span className="font-serif text-[10px] sm:text-xs text-amber-400/90 font-medium tracking-tight truncate">
            Cultural Heritage Archive
          </span>
        )}
      </div>

    </div>
  );
};
