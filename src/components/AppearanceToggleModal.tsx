import React from 'react';
import { Type, Sun, Moon, BookOpen, X, Check } from 'lucide-react';

export type ThemeMode = 'ivory' | 'sepia' | 'dark';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type FontFamily = 'serif' | 'sans';

interface AppearanceToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

export const AppearanceToggleModal: React.FC<AppearanceToggleModalProps> = ({
  isOpen,
  onClose,
  themeMode,
  setThemeMode,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily
}) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-end justify-start p-4 pb-24 sm:pb-24 sm:pl-6 animate-fadeIn"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[320px] bg-[#09090B] text-white rounded-3xl shadow-2xl border border-red-900/80 overflow-hidden p-5 space-y-4 animate-scaleIn border-t-2 border-t-amber-400"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-black text-amber-400 text-base">Aa</span>
            <div>
              <h4 className="font-serif font-bold text-xs text-amber-100 uppercase tracking-wider">
                Display & Theme
              </h4>
              <p className="text-[10px] text-amber-300/70">Customize reading experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Theme Color Row */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Theme Palette
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            
            {/* Ivory */}
            <button
              onClick={() => setThemeMode('ivory')}
              className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center space-y-1 border transition-all ${
                themeMode === 'ivory'
                  ? 'bg-[#FAF8F5] text-slate-950 border-amber-400 ring-2 ring-amber-400 shadow-md font-extrabold scale-105'
                  : 'bg-[#FAF8F5]/10 text-slate-300 border-slate-800 hover:bg-[#FAF8F5]/20'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Ivory</span>
            </button>

            {/* Sepia */}
            <button
              onClick={() => setThemeMode('sepia')}
              className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center space-y-1 border transition-all ${
                themeMode === 'sepia'
                  ? 'bg-[#F4EFEA] text-[#2B231B] border-amber-500 ring-2 ring-amber-400 shadow-md font-extrabold scale-105'
                  : 'bg-[#F4EFEA]/10 text-amber-200/80 border-slate-800 hover:bg-[#F4EFEA]/20'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Sepia</span>
            </button>

            {/* Dark */}
            <button
              onClick={() => setThemeMode('dark')}
              className={`py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center space-y-1 border transition-all ${
                themeMode === 'dark'
                  ? 'bg-black text-amber-300 border-amber-400 ring-2 ring-amber-400 shadow-md font-extrabold scale-105'
                  : 'bg-black/60 text-slate-400 border-slate-800 hover:bg-black/90'
              }`}
            >
              <Moon className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Dark</span>
            </button>

          </div>
        </div>

        {/* 2. Text Font Size Segment */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Font Scale
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
            {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((size) => {
              const labels = { sm: 'A-', md: 'A', lg: 'A+', xl: 'A++' };
              const isActive = fontSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`py-2 rounded-xl text-center border transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-900 to-red-800 text-amber-300 border-amber-400 font-extrabold shadow scale-105'
                      : 'bg-red-950/40 text-amber-100/70 border-red-900/50 hover:bg-red-950'
                  }`}
                >
                  {labels[size]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Typography Segment */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Font Family
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setFontFamily('serif')}
              className={`py-2 px-3 rounded-2xl flex items-center justify-center space-x-2 border font-serif transition-all ${
                fontFamily === 'serif'
                  ? 'bg-gradient-to-r from-red-900 to-red-800 text-amber-300 border-amber-400 font-bold shadow scale-105'
                  : 'bg-red-950/40 text-amber-100/70 border-red-900/50 hover:bg-red-950'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>Classical Serif</span>
            </button>

            <button
              onClick={() => setFontFamily('sans')}
              className={`py-2 px-3 rounded-2xl flex items-center justify-center space-x-2 border font-sans transition-all ${
                fontFamily === 'sans'
                  ? 'bg-gradient-to-r from-red-900 to-red-800 text-amber-300 border-amber-400 font-bold shadow scale-105'
                  : 'bg-red-950/40 text-amber-100/70 border-red-900/50 hover:bg-red-950'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>Modern Sans</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
