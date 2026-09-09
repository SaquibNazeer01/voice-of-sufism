import React from 'react';
import { Volume2, VolumeX, Music, X } from 'lucide-react';

interface AudioKalaamBarProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioKalaamBar: React.FC<AudioKalaamBarProps> = ({ isPlaying, onToggle }) => {
  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 bg-[#09090B] text-amber-200 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-2xl border border-red-800/80 flex items-center justify-between sm:justify-start space-x-3 backdrop-blur-md max-w-sm sm:max-w-none mx-auto sm:mx-0">
      <div className="flex items-center space-x-3 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-black font-bold flex items-center justify-center animate-pulse flex-shrink-0">
          <Music className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="text-xs space-y-0.5 min-w-0">
          <div className="flex items-center space-x-1 font-serif font-bold text-amber-300 truncate">
            <Volume2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate text-xs">Kashmiri Rabab & Sufi Melody</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-200/80 italic truncate">
            Ambient background active
          </p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-amber-400 border border-amber-500/30 transition-colors ml-2 flex-shrink-0"
        title="Stop Music"
      >
        <VolumeX className="w-4 h-4" />
      </button>
    </div>
  );
};
