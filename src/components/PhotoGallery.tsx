import React, { useState, useEffect } from 'react';
import { PhotoGalleryItem, CategoryType } from '../types';
import { SupabaseService } from '../services/supabaseService';
import { PHOTO_GALLERY_DATA } from '../data/galleries';
import { Image as ImageIcon, MapPin, Maximize2, X, Camera } from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoGalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');

  useEffect(() => {
    setIsLoading(true);
    SupabaseService.getPhotos().then(data => {
      setPhotos(data && data.length > 0 ? data : PHOTO_GALLERY_DATA);
      setIsLoading(false);
    }).catch(() => {
      setPhotos(PHOTO_GALLERY_DATA);
      setIsLoading(false);
    });
  }, []);

  const categories: CategoryType[] = [
    'All',
    'Sacred Shrines',
    'Crafts & Traditions',
    'Language & Poetry',
    'Architecture & Heritage',
    'Culture & Folklore'
  ];

  const filteredPhotos = photos.filter(photo => {
    if (activeCategory === 'All') return true;
    return photo.category === activeCategory;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-red-900 uppercase tracking-wider">
            <Camera className="w-4 h-4 text-amber-600" />
            <span>Visual Heritage Archives</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Kashmir Cultural & Architectural Photo Essays
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            High-resolution photography capturing Khatamband woodwork, medieval shrines, manuscript calligraphies, and autumn landscapes across the valley.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-red-900 text-amber-300 shadow font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Masonry Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 font-serif">
          <p>Loading photo gallery...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="rounded-3xl p-12 text-center border border-slate-200 bg-[#FAF8F5] space-y-3">
          <Camera className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-slate-800">No Archival Photos Uploaded Yet</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            The photo archive is currently clean. Upload high-resolution photographs from the Admin Dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

            <div className="absolute top-3 left-3 bg-red-950/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-amber-300 uppercase tracking-wider border border-amber-500/30">
              {item.category}
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <h3 className="font-serif font-bold text-base text-amber-100 group-hover:text-amber-300 transition-colors leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-amber-200 font-medium flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{item.location}</span>
              </p>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 text-black p-2 rounded-full shadow font-bold">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-[#09090B] text-white rounded-3xl overflow-hidden border border-red-900 shadow-2xl space-y-4">
            
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-red-950 text-amber-300 hover:text-white hover:bg-red-900 z-10 border border-amber-500/30"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-900 text-amber-300 border border-amber-500/30">
                  {selectedPhoto.category}
                </span>
                <span className="text-xs text-slate-400 font-serif italic">
                  Photographer: {selectedPhoto.photographer} ({selectedPhoto.year})
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-amber-300">
                {selectedPhoto.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {selectedPhoto.caption}
              </p>

              <div className="pt-2 flex items-center space-x-2 text-xs text-amber-300 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Location: {selectedPhoto.location} (District {selectedPhoto.district})</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
