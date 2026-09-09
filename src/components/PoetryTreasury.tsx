import React, { useState, useEffect } from 'react';
import { PoemVerse } from '../types';
import { SupabaseService } from '../services/supabaseService';
import { Feather, Volume2, VolumeX, Copy, Check, BookOpen, Search, Share2 } from 'lucide-react';

export const PoetryTreasury: React.FC = () => {
  const [poems, setPoems] = useState<PoemVerse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('All');
  const [poetrySearch, setPoetrySearch] = useState<string>('');
  const [playingPoemId, setPlayingPoemId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    SupabaseService.getPoems().then(data => {
      setPoems(data || []);
      setIsLoading(false);
    }).catch(() => {
      setPoems([]);
      setIsLoading(false);
    });
  }, []);

  const themes = ['All', 'Nature & Ecology', 'Universal Harmony', 'Inner Peace', 'Divine Love', 'Self Realization'];

  const filteredPoems = poems.filter(poem => {
    const matchesTheme = selectedTheme === 'All' || poem.theme === selectedTheme;
    const matchesSearch = 
      poem.poetName.toLowerCase().includes(poetrySearch.toLowerCase()) ||
      poem.title.toLowerCase().includes(poetrySearch.toLowerCase()) ||
      poem.englishTranslation.toLowerCase().includes(poetrySearch.toLowerCase()) ||
      poem.transliteration.toLowerCase().includes(poetrySearch.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  const handlePlayRecitation = (poem: PoemVerse) => {
    if ('speechSynthesis' in window) {
      if (playingPoemId === poem.id) {
        window.speechSynthesis.cancel();
        setPlayingPoemId(null);
      } else {
        window.speechSynthesis.cancel();
        const textToSpeak = `${poem.title} by ${poem.poetName}. Transliteration: ${poem.transliteration}. English translation: ${poem.englishTranslation}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.9;
        utterance.onend = () => setPlayingPoemId(null);
        utterance.onerror = () => setPlayingPoemId(null);
        window.speechSynthesis.speak(utterance);
        setPlayingPoemId(poem.id);
      }
    } else {
      alert('Audio recitation is not supported on this device.');
    }
  };

  const handleCopyPoem = (poem: PoemVerse) => {
    const textToCopy = `"${poem.transliteration}"\n\n${poem.englishTranslation}\n\n— ${poem.poetName} (Voice of Sufism Archive)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(poem.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-900/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-red-800 uppercase tracking-wider">
            <Feather className="w-4 h-4 text-red-800" />
            <span>Kashmiri Mystical Treasury</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Vakhs, Shruks & Kalam Treasury
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            Immerse yourself in original Kashmiri manuscripts, phonetic English transliterations, and spiritual commentaries of Lal Ded, Nund Reshi, and Habba Khatoon.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={poetrySearch}
            onChange={(e) => setPoetrySearch(e.target.value)}
            placeholder="Search verses by poet, word..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-red-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Theme Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {themes.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTheme(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTheme === t
                ? 'bg-red-900 text-amber-300 shadow border border-amber-400/40 font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Poetry Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 font-serif">
          <p>Loading poetry treasury...</p>
        </div>
      ) : filteredPoems.length === 0 ? (
        <div className="rounded-3xl p-12 text-center border border-slate-200 bg-white space-y-3">
          <Feather className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-slate-800">No Poetry Verses Cataloged Yet</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            The poetry treasury is currently clean. Add new Vakhs, Shruks, and mystical couplets from the Admin Dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPoems.map((poem) => {
          const isPlaying = playingPoemId === poem.id;
          const isCopied = copiedId === poem.id;

          return (
            <div
              key={poem.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-800 via-amber-400 to-red-950"></div>

              <div className="space-y-3 pt-2">
                
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    {poem.theme}
                  </span>
                  <span className="text-slate-400 font-serif italic text-[11px]">
                    {poem.yearCentury}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {poem.title}
                </h3>

                {/* Kashmiri Script Display Box */}
                <div className="p-4 rounded-xl bg-black text-amber-300 text-right font-serif text-xl sm:text-2xl leading-loose dir-rtl shadow-inner border border-red-900">
                  {poem.kashmiriScript}
                </div>

                {/* Transliteration */}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Transliteration (Koshur)
                  </p>
                  <p className="font-serif italic text-base text-slate-800 font-medium">
                    "{poem.transliteration}"
                  </p>
                </div>

                {/* English Translation */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <p className="text-xs font-bold text-red-900 uppercase tracking-wider">
                    English Translation
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {poem.englishTranslation}
                  </p>
                </div>

                {/* Historical Context */}
                <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>Context:</strong> {poem.historicalContext}
                </p>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{poem.poetName}</p>
                  <p className="text-[10px] text-slate-500">{poem.poetRole}</p>
                </div>

                <div className="flex items-center space-x-2">
                  
                  {/* Recite Audio Button */}
                  <button
                    onClick={() => handlePlayRecitation(poem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      isPlaying 
                        ? 'bg-amber-400 text-black font-bold animate-pulse' 
                        : 'bg-red-950 hover:bg-red-900 text-amber-300 border border-amber-400/30'
                    }`}
                    title="Recite verse audio using native browser voice synthesis (No API key required)"
                  >
                    {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isPlaying ? 'Stop' : 'Recite (Browser Speech)'}</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyPoem(poem)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Copy Verse Text"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                </div>
              </div>

            </div>
          );
        })}
      </div>
      )}

    </div>
  );
};
