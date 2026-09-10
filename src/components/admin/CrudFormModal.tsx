import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  Heading, 
  Quote, 
  List, 
  Check, 
  FileText, 
  MapPin, 
  Feather,
  Link,
  ShieldCheck,
  Eye,
  Plus,
  Trash2,
  Camera,
  Sparkles
} from 'lucide-react';
import { Article, SufiSaint, HeritageSite, PoemVerse, PhotoGalleryItem } from '../../types';
import { KashmiriCultureItem, FolkloreStory, CmsUser, CmsCategoryItem } from '../../types/cms';
import { SupabaseService } from '../../services/supabaseService';

interface CrudFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  moduleType: 'articles' | 'saints' | 'sites' | 'poems' | 'photos' | 'culture' | 'folklore' | 'categories' | 'users' | 'ads' | 'sponsors';
  initialData?: any;
  onSave: (data: any) => void;
}

// Helper to convert uploaded files directly to optimized Base64 Data URLs
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Optimize to JPEG quality 0.85
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const CrudFormModal: React.FC<CrudFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  moduleType,
  initialData,
  onSave
}) => {
  const [formData, setFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState<string>('');
  const [newGalleryCaption, setNewGalleryCaption] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      const normalizedGallery = Array.isArray(initialData.galleryImages)
        ? initialData.galleryImages.map((item: any) => 
            typeof item === 'string' ? { url: item, caption: '' } : { url: item?.url || '', caption: item?.caption || '' }
          )
        : [];

      setFormData({
        ...initialData,
        author: initialData.author ?? (moduleType === 'articles' ? 'Admin' : ''),
        authorRole: initialData.authorRole ?? (moduleType === 'articles' ? 'Heritage Contributor' : ''),
        title: initialData.title ?? initialData.name ?? '',
        titleUrdu: initialData.titleUrdu ?? initialData.kashmiriName ?? initialData.kashmiriTitle ?? '',
        subtitle: initialData.subtitle ?? '',
        excerpt: initialData.excerpt ?? '',
        galleryImages: normalizedGallery,
      });
      setImagePreview(initialData.heroImage || initialData.image || initialData.imageUrl || '');
    } else {
      // Default blank values based on module
      const defaultId = `${moduleType}-${Date.now()}`;
      if (moduleType === 'articles') {
        setFormData({
          id: defaultId,
          title: '',
          titleUrdu: '',
          subtitle: '',
          category: 'Sufi Saints',
          region: 'Srinagar',
          locationName: 'Srinagar, Jammu & Kashmir',
          coordinates: { lat: 34.0837, lng: 74.7973 },
          author: 'Admin',
          authorRole: 'Heritage Contributor',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: '5 min read',
          heroImage: '',
          excerpt: '',
          contentMarkdown: '',
          tags: ['Heritage', 'Kashmir', 'Sufism'],
          featured: false,
          galleryImages: []
        });
        setImagePreview('');
      } else if (moduleType === 'saints') {
        setFormData({
          id: defaultId,
          name: '',
          kashmiriName: '',
          titleUrdu: '',
          order: 'Kubrawiya & Rishi Order',
          period: '14th–15th Century AD',
          shrineLocation: 'Charar-i-Sharief, Budgam',
          district: 'Budgam',
          biography: '',
          corePhilosophy: '',
          famousSaying: {
            kashmiri: '',
            transliteration: '',
            english: ''
          },
          impactOnKashmir: '',
          image: '',
          coordinates: { lat: 33.8631, lng: 74.7709 }
        });
        setImagePreview('');
      } else if (moduleType === 'sites') {
        setFormData({
          id: defaultId,
          name: '',
          kashmiriName: '',
          type: 'Shrine (Ziyarat)',
          district: 'Srinagar',
          builtYear: '',
          architecturalStyle: 'Traditional Kashmiri Wooden Pagoda',
          overview: '',
          visitationEtiquette: ['Remove footwear at entrance', 'Maintain respectful silence'],
          heroImage: '',
          coordinates: { lat: 34.0837, lng: 74.7973 },
          distanceFromSrinagarKm: 0
        });
        setImagePreview('');
      } else if (moduleType === 'poems') {
        setFormData({
          id: defaultId,
          poetName: '',
          poetRole: 'Sufi Mystic',
          title: '',
          kashmiriScript: '',
          transliteration: '',
          englishTranslation: '',
          theme: 'Divine Love & Harmony',
          audioText: '',
          historicalContext: '',
          yearCentury: ''
        });
      } else if (moduleType === 'culture') {
        setFormData({
          id: defaultId,
          title: '',
          kashmiriTitle: '',
          type: 'Traditional Craft',
          district: 'Srinagar',
          summary: '',
          historicalBackground: '',
          status: 'Published',
          heroImage: '',
          author: 'Admin',
          dateAdded: new Date().toISOString().split('T')[0]
        });
        setImagePreview('');
      } else if (moduleType === 'folklore') {
        setFormData({
          id: defaultId,
          title: '',
          titleUrdu: '',
          narrator: '',
          narratorAge: '',
          district: 'Srinagar',
          theme: 'Spiritual Legend',
          summary: '',
          fullNarrative: '',
          status: 'Published',
          audioRecordingAvailable: false,
          collectedBy: 'Admin',
          dateCollected: new Date().toISOString().split('T')[0]
        });
      } else if (moduleType === 'photos') {
        setFormData({
          id: defaultId,
          title: '',
          caption: '',
          location: 'Kashmir Valley',
          district: 'Srinagar',
          year: new Date().getFullYear().toString(),
          photographer: 'Admin',
          imageUrl: '',
          category: 'Architecture & Heritage'
        });
        setImagePreview('');
      } else if (moduleType === 'categories') {
        setFormData({
          id: defaultId,
          name: 'Architecture & Heritage',
          slug: 'architecture-heritage',
          description: '',
          itemCount: 0,
          colorBadge: 'bg-[#0F4C3A] text-amber-300'
        });
      } else if (moduleType === 'users') {
        setFormData({
          id: defaultId,
          name: '',
          email: '',
          role: 'Archive Contributor',
          status: 'Active',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          contributionsCount: 0,
          lastLogin: 'Never',
          districtLocation: 'Srinagar'
        });
      } else if (moduleType === 'ads') {
        setFormData({
          id: defaultId,
          title: '',
          advertiserName: '',
          bannerImage: '',
          description: '',
          targetType: 'whatsapp',
          targetUrl: '',
          contactNumber: '+91 ',
          contactEmail: '',
          status: 'Active',
          delaySeconds: 5,
          skipTimerSeconds: 5,
          clicksCount: 0
        });
        setImagePreview('');
      } else if (moduleType === 'sponsors') {
        setFormData({
          id: defaultId,
          name: '',
          tagline: '',
          logo: '',
          tier: 'Title Sponsor',
          description: '',
          websiteUrl: '',
          contactPhone: '',
          contactEmail: '',
          status: 'Active'
        });
        setImagePreview('');
      }
    }
  }, [initialData, moduleType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const insertTextFormatting = (syntax: string) => {
    const current = formData.contentMarkdown || formData.overview || formData.biography || '';
    setFormData({
      ...formData,
      contentMarkdown: current + syntax
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const base64Url = await convertFileToBase64(file);
        setImagePreview(base64Url);
        setFormData((prev: any) => ({
          ...prev,
          heroImage: base64Url,
          image: base64Url,
          imageUrl: base64Url,
          bannerImage: base64Url,
          logo: base64Url
        }));
      } catch (err) {
        console.error('File upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const newItems: { url: string; caption: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64Url = await convertFileToBase64(file);
        const defaultCaption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        newItems.push({ url: base64Url, caption: defaultCaption });
      }
      const existing = Array.isArray(formData.galleryImages) ? formData.galleryImages : [];
      const updated = [...existing, ...newItems];
      setFormData((prev: any) => ({ ...prev, galleryImages: updated }));
      if (!formData.heroImage && !formData.image && newItems.length > 0) {
        setImagePreview(newItems[0].url);
        setFormData((prev: any) => ({
          ...prev,
          heroImage: newItems[0].url,
          image: newItems[0].url,
          imageUrl: newItems[0].url,
          galleryImages: updated
        }));
      }
    } catch (err) {
      console.error('Multiple file upload failed:', err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const existing = Array.isArray(formData.galleryImages) ? formData.galleryImages : [];
    const updated = [...existing, { url: newGalleryUrl.trim(), caption: newGalleryCaption.trim() }];
    setFormData((prev: any) => ({ ...prev, galleryImages: updated }));
    setNewGalleryUrl('');
    setNewGalleryCaption('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    const existing = Array.isArray(formData.galleryImages) ? formData.galleryImages : [];
    const updated = existing.filter((_: any, idx: number) => idx !== index);
    setFormData((prev: any) => ({ ...prev, galleryImages: updated }));
  };

  const handleUpdateGalleryCaption = (index: number, caption: string) => {
    const existing = Array.isArray(formData.galleryImages) ? [...formData.galleryImages] : [];
    if (existing[index]) {
      existing[index] = { ...existing[index], caption };
      setFormData((prev: any) => ({ ...prev, galleryImages: existing }));
    }
  };

  const handleSetAsCoverImage = (url: string) => {
    setImagePreview(url);
    setFormData((prev: any) => ({
      ...prev,
      heroImage: url,
      image: url,
      imageUrl: url
    }));
  };

  const handleInsertGalleryIntoContent = (img: { url: string; caption?: string }) => {
    const markdownSnippet = `\n\n![${img.caption || 'Archival Image'}](${img.url})\n*${img.caption || ''}*\n\n`;
    setFormData((prev: any) => ({
      ...prev,
      contentMarkdown: (prev.contentMarkdown || '') + markdownSnippet
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="p-6 bg-[#0F4C3A] text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif font-bold text-xl text-amber-100">
                {mode === 'view' ? 'View Details' : mode === 'edit' ? 'Edit Content Record' : 'Create New Record'}
              </h3>
              <p className="text-xs text-emerald-200 capitalize">
                CMS Module: {moduleType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Form */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {mode === 'view' ? (
            <div className="space-y-6 text-xs text-slate-800">
              {imagePreview && (
                <div className="h-56 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-serif text-2xl font-bold text-slate-900">
                  {formData.title || formData.name || formData.poetName}
                </h4>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(formData, null, 2)}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              
              {/* DEDICATED POETRY FORM */}
              {moduleType === 'poems' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Poem / Verse Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title ?? ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Vakh: Gagan Tsarun / Shruk: Anposh"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Poet / Mystic Name</label>
                      <input
                        type="text"
                        required
                        value={formData.poetName ?? ''}
                        onChange={(e) => setFormData({ ...formData, poetName: e.target.value })}
                        placeholder="e.g. Sheikh-ul-Alam / Lal Ded / Habba Khatoon"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Poet Role / Title</label>
                      <input
                        type="text"
                        value={formData.poetRole ?? ''}
                        onChange={(e) => setFormData({ ...formData, poetRole: e.target.value })}
                        placeholder="e.g. 14th Century Mystic / Patron Reshi Saint"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Theme</label>
                      <select
                        value={formData.theme || 'Divine Love'}
                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700 font-medium"
                      >
                        <option value="Divine Love">Divine Love</option>
                        <option value="Universal Harmony">Universal Harmony</option>
                        <option value="Nature & Ecology">Nature & Ecology</option>
                        <option value="Inner Peace">Inner Peace</option>
                        <option value="Self Realization">Self Realization</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Era / Century</label>
                      <input
                        type="text"
                        value={formData.yearCentury ?? ''}
                        onChange={(e) => setFormData({ ...formData, yearCentury: e.target.value })}
                        placeholder="e.g. 14th Century AD"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Original Kashmiri / Urdu Script or Verse</label>
                    <textarea
                      rows={3}
                      value={formData.kashmiriScript ?? ''}
                      onChange={(e) => setFormData({ ...formData, kashmiriScript: e.target.value })}
                      placeholder="گگن ژھٲرُن تہٕ دیس ژھٲرُن..."
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-serif text-base text-right dir-rtl focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Phonetic Transliteration (Koshur)</label>
                    <textarea
                      rows={2}
                      value={formData.transliteration ?? ''}
                      onChange={(e) => setFormData({ ...formData, transliteration: e.target.value })}
                      placeholder="Gagan tsarun ta deys tsarun..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-serif italic text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">English Translation & Commentary</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.englishTranslation ?? ''}
                      onChange={(e) => setFormData({ ...formData, englishTranslation: e.target.value })}
                      placeholder="Explain the mystical meaning and English translation of the couplet..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Historical Context / Notes (Optional)</label>
                    <input
                      type="text"
                      value={formData.historicalContext ?? ''}
                      onChange={(e) => setFormData({ ...formData, historicalContext: e.target.value })}
                      placeholder="e.g. Composed during spiritual meditation..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              ) : moduleType === 'ads' ? (
                /* DEDICATED ADVERTISEMENT FORM */
                <div className="space-y-4">
                  
                  {/* Poster / Banner Image */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">Advertisement Banner Poster</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {imagePreview ? (
                        <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-300 flex-shrink-0 bg-slate-200">
                          <img src={imagePreview} alt="Ad Banner Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-40 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-white">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[10px]">No Banner Uploaded</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center space-x-2">
                          <label className="px-3 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold text-xs cursor-pointer hover:bg-emerald-800 flex items-center space-x-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Banner</span>
                            <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                          </label>
                          <span className="text-[11px] text-slate-500">or enter banner image URL</span>
                        </div>

                        <input
                          type="text"
                          value={formData.bannerImage ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setImagePreview(val);
                            setFormData({ ...formData, bannerImage: val });
                          }}
                          placeholder="https://images.unsplash.com/... or hosted poster link"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ad Title & Advertiser Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Campaign Headline / Title</label>
                      <input
                        type="text"
                        required
                        value={formData.title ?? ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Traditional Hand-Woven Pashmina Shawls 20% Off"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Advertiser / Brand Name</label>
                      <input
                        type="text"
                        required
                        value={formData.advertiserName ?? ''}
                        onChange={(e) => setFormData({ ...formData, advertiserName: e.target.value })}
                        placeholder="e.g. Kashmir Heritage Crafts Emporium"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  {/* Reach Destination Type & Target URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Visitor Reach Action (When Clicked)</label>
                      <select
                        value={formData.targetType || 'whatsapp'}
                        onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="whatsapp">💬 WhatsApp Chat Link</option>
                        <option value="website">🌐 External Website URL</option>
                        <option value="phone">📞 Direct Phone Call</option>
                        <option value="email">✉️ Email Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Target Link / URL / Number</label>
                      <input
                        type="text"
                        required
                        value={formData.targetUrl ?? ''}
                        onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                        placeholder="e.g. https://wa.me/919596154384 or https://mywebsite.com"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                      />
                    </div>
                  </div>

                  {/* Contact Number & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Advertiser Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={formData.contactNumber ?? ''}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        placeholder="+91 9596154384"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Advertiser Email</label>
                      <input
                        type="email"
                        value={formData.contactEmail ?? ''}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="contact@brand.com"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  {/* Ad Description */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Ad Copy / Offer Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description ?? ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the offer, special deals, or call-to-action message for visitors..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                    ></textarea>
                  </div>

                  {/* Timers & Status Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <div>
                      <label className="block font-bold text-slate-800 text-[11px] mb-1">Popup Delay (Secs)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={formData.delaySeconds || 5}
                        onChange={(e) => setFormData({ ...formData, delaySeconds: parseInt(e.target.value) || 5 })}
                        className="w-full p-2 rounded-xl border border-amber-300 bg-white font-mono text-xs"
                      />
                      <span className="text-[10px] text-slate-500">Initial appearance delay (seconds)</span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 text-[11px] mb-1">Skip Timer (Secs)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.skipTimerSeconds || 5}
                        onChange={(e) => setFormData({ ...formData, skipTimerSeconds: parseInt(e.target.value) || 5 })}
                        className="w-full p-2 rounded-xl border border-amber-300 bg-white font-mono text-xs"
                      />
                      <span className="text-[10px] text-slate-500">Time before skip ad button</span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 text-[11px] mb-1">Ad Status</label>
                      <select
                        value={formData.status || 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full p-2 rounded-xl border border-amber-300 bg-white font-bold text-xs"
                      >
                        <option value="Active">🟢 Active (Visible)</option>
                        <option value="Paused">⏸️ Paused (Hidden)</option>
                      </select>
                    </div>
                  </div>

                </div>
              ) : moduleType === 'sponsors' ? (
                /* DEDICATED SPONSORS FORM */
                <div className="space-y-4">
                  
                  {/* Logo Image */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block font-bold text-slate-800">Sponsor / Partner Logo</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {imagePreview ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-300 flex-shrink-0 bg-white p-2">
                          <img src={imagePreview} alt="Sponsor Logo Preview" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-white">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[10px]">No Logo</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center space-x-2">
                          <label className="px-3 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold text-xs cursor-pointer hover:bg-emerald-800 flex items-center space-x-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Logo</span>
                            <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                          </label>
                          <span className="text-[11px] text-slate-500">or enter logo URL</span>
                        </div>

                        <input
                          type="text"
                          value={formData.logo ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setImagePreview(val);
                            setFormData({ ...formData, logo: val });
                          }}
                          placeholder="https://images.unsplash.com/... or hosted logo"
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sponsor Name & Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Organization / Sponsor Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name ?? ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jammu & Kashmir Heritage Trust"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Sponsorship Tier</label>
                      <select
                        value={formData.tier || 'Title Sponsor'}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:ring-2 focus:ring-emerald-700"
                      >
                        <option value="Title Sponsor">👑 Title Sponsor</option>
                        <option value="Platinum Patron">💎 Platinum Patron</option>
                        <option value="Gold Partner">🥇 Gold Partner</option>
                        <option value="Cultural Heritage Supporter">🌿 Cultural Heritage Supporter</option>
                      </select>
                    </div>
                  </div>

                  {/* Tagline & Website URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Tagline / Short Slogan (Optional)</label>
                      <input
                        type="text"
                        value={formData.tagline ?? ''}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="e.g. Empowering Cultural Research in the Valley"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Official Website URL</label>
                      <input
                        type="text"
                        value={formData.websiteUrl ?? ''}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        placeholder="https://partner-website.org"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700 font-mono"
                      />
                    </div>
                  </div>

                  {/* Contact Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={formData.contactPhone ?? ''}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="+91 9596154384"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={formData.contactEmail ?? ''}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="info@sponsor.org"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">About Partner / Contribution Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description ?? ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the organization and their support towards Kashmiri cultural heritage..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                    ></textarea>
                  </div>

                  {/* Status Toggle */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-950 block text-xs">Sponsor Listing Status</span>
                      <span className="text-[10px] text-emerald-800">Show in public Sponsors tab</span>
                    </div>
                    <select
                      value={formData.status || 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="p-2 rounded-xl bg-white border border-emerald-300 font-bold text-xs"
                    >
                      <option value="Active">🟢 Active (Visible)</option>
                      <option value="Paused">⏸️ Paused (Hidden)</option>
                    </select>
                  </div>

                </div>
              ) : (
                <>
                  {/* Image Upload UI Component for Articles, Saints, Sites, Culture */}
                  {(moduleType === 'articles' || moduleType === 'saints' || moduleType === 'sites' || moduleType === 'culture' || moduleType === 'photos' || moduleType === 'folklore') && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <label className="block font-bold text-slate-800">Featured Media & Archival Photo</label>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {imagePreview ? (
                          <div className="w-32 h-24 rounded-xl overflow-hidden border border-slate-300 flex-shrink-0 bg-slate-200">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-32 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-white">
                            <ImageIcon className="w-6 h-6 mb-1" />
                            <span className="text-[10px]">No Image</span>
                          </div>
                        )}

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center space-x-2">
                            <label className="px-3 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold text-xs cursor-pointer hover:bg-emerald-800 flex items-center space-x-1">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                              <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                            </label>
                            <span className="text-[11px] text-slate-500">or enter image URL below</span>
                          </div>

                          <input
                            type="text"
                            value={formData.heroImage || formData.image || formData.imageUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImagePreview(val);
                              setFormData({ ...formData, heroImage: val, image: val, imageUrl: val });
                            }}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multi-Image Gallery Uploader for Articles, Sites, Culture */}
                  {(moduleType === 'articles' || moduleType === 'sites' || moduleType === 'culture') && (
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-amber-700" />
                            <span>Additional Photo Gallery & Story Images</span>
                          </label>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Add multiple images to this {moduleType === 'articles' ? 'article' : 'record'}. They appear in the Photo Essay gallery and can be inserted into the story.
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
                          {(formData.galleryImages || []).length} Photo{(formData.galleryImages || []).length === 1 ? '' : 's'}
                        </span>
                      </div>

                      {/* Upload buttons & URL input */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <label className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm transition-all flex-shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>+ Upload Multiple Files</span>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleMultipleGalleryUpload} 
                            className="hidden" 
                          />
                        </label>

                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            placeholder="Or paste external Image URL..."
                            className="flex-1 p-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-600"
                          />
                          <input
                            type="text"
                            value={newGalleryCaption}
                            onChange={(e) => setNewGalleryCaption(e.target.value)}
                            placeholder="Caption (optional)"
                            className="w-36 sm:w-44 p-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-600 hidden sm:block"
                          />
                          <button
                            type="button"
                            onClick={handleAddGalleryUrl}
                            disabled={!newGalleryUrl.trim()}
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      {isUploading && (
                        <div className="text-xs text-amber-800 font-semibold flex items-center gap-1.5 animate-pulse">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Compressing and attaching multiple images...</span>
                        </div>
                      )}

                      {/* Gallery thumbnails grid */}
                      {(formData.galleryImages || []).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                          {(formData.galleryImages || []).map((img: any, idx: number) => {
                            const url = typeof img === 'string' ? img : img?.url;
                            const caption = typeof img === 'string' ? '' : img?.caption || '';
                            return (
                              <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 relative group">
                                <div className="relative h-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                                  <img src={url} alt={caption || `Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(idx)}
                                    className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 shadow transition-all cursor-pointer"
                                    title="Remove this photo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={caption}
                                  onChange={(e) => handleUpdateGalleryCaption(idx, e.target.value)}
                                  placeholder="Photo caption..."
                                  className="w-full p-1.5 text-[11px] rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                                />
                                <div className="flex items-center justify-between gap-1 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsCoverImage(url)}
                                    className="text-emerald-800 hover:text-emerald-950 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                                    title="Make this the main cover photo"
                                  >
                                    <span>Set as Cover</span>
                                  </button>
                                  {moduleType === 'articles' && (
                                    <button
                                      type="button"
                                      onClick={() => handleInsertGalleryIntoContent({ url, caption })}
                                      className="text-amber-800 hover:text-amber-950 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                                      title="Insert image directly into article body"
                                    >
                                      <span>Insert in Story</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Title / Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Title / Name</label>
                      <input
                        type="text"
                        required
                        value={formData.title ?? formData.name ?? ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value, name: e.target.value })}
                        placeholder="Enter main heading or title"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Urdu / Kashmiri Title (Optional)</label>
                      <input
                        type="text"
                        value={formData.titleUrdu ?? formData.kashmiriName ?? formData.kashmiriTitle ?? ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          titleUrdu: e.target.value, 
                          kashmiriName: e.target.value,
                          kashmiriTitle: e.target.value 
                        })}
                        placeholder="e.g. علمدارِ کشمیر"
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 font-medium dir-rtl"
                      />
                    </div>
                  </div>

                  {/* District & Category Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Kashmir District</label>
                      <select
                        value={formData.district || formData.region || 'Srinagar'}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value, region: e.target.value, locationName: `${e.target.value}, Kashmir` })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 font-medium"
                      >
                        <optgroup label="— Kashmir Division —">
                          <option value="Srinagar">Srinagar</option>
                          <option value="Budgam">Budgam</option>
                          <option value="Anantnag">Anantnag</option>
                          <option value="Baramulla">Baramulla</option>
                          <option value="Ganderbal">Ganderbal</option>
                          <option value="Pulwama">Pulwama</option>
                          <option value="Shopian">Shopian</option>
                          <option value="Kupwara">Kupwara</option>
                          <option value="Bandipora">Bandipora</option>
                          <option value="Kulgam">Kulgam</option>
                        </optgroup>
                        <optgroup label="— Jammu Division —">
                          <option value="Jammu">Jammu</option>
                          <option value="Kathua">Kathua</option>
                          <option value="Udhampur">Udhampur</option>
                          <option value="Reasi">Reasi</option>
                          <option value="Rajouri">Rajouri</option>
                          <option value="Poonch">Poonch</option>
                          <option value="Doda">Doda</option>
                          <option value="Ramban">Ramban</option>
                          <option value="Kishtwar">Kishtwar</option>
                          <option value="Samba">Samba</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Category / Type</label>
                      {(() => {
                        let options: string[] = [];
                        const fieldKey = moduleType === 'saints' ? 'order' : moduleType === 'sites' ? 'type' : moduleType === 'culture' ? 'type' : 'category';
                        
                        if (moduleType === 'articles' || moduleType === 'photos') {
                          options = ['Sufi Saints', 'Sacred Shrines', 'Language & Poetry', 'Architecture & Heritage', 'Culture & Folklore', 'Crafts & Traditions'];
                        } else if (moduleType === 'saints') {
                          options = ['Reshi', 'Kubrawi', 'Suhrawardi', 'Qadiria', 'Chisti', 'Independent Mystic'];
                        } else if (moduleType === 'sites') {
                          options = ['Shrine (Ziyarat)', 'Khanqah', 'Mosque', 'Heritage Site', 'Ancient Temple', 'Garden'];
                        } else if (moduleType === 'culture') {
                          options = ['Traditional Craft', 'Culinary Art', 'Festival & Custom', 'Folk Music & Instrument'];
                        } else if (moduleType === 'folklore') {
                          options = ['Ascetic Miracle & Ecological Harmony', 'Healing & Faith', 'Oral Legend & Mystic Tradition', 'Village Customs', 'Mountain Folklore'];
                        }

                        const currentVal = formData[fieldKey] || formData.category || formData.type || formData.order || '';
                        const isCustom = currentVal && !options.includes(currentVal);

                        return (
                          <div className="space-y-2">
                            <select
                              value={isCustom ? '__other__' : currentVal}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '__other__') {
                                  setFormData({ ...formData, [fieldKey]: '', category: '', type: '', order: '' });
                                } else {
                                  setFormData({ ...formData, [fieldKey]: val, category: val, type: val });
                                }
                              }}
                              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 font-medium"
                            >
                              {options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                              <option value="__other__">— Other (Custom) —</option>
                            </select>
                            {(isCustom || currentVal === '') && (
                              <input
                                type="text"
                                value={isCustom ? currentVal : ''}
                                onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value, category: e.target.value, type: e.target.value })}
                                placeholder="Enter custom category or type..."
                                className="w-full p-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-amber-50 font-medium text-xs"
                              />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Author & Subtitle for Articles */}
                  {moduleType === 'articles' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Author Name</label>
                          <input
                            type="text"
                            value={formData.author ?? ''}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            placeholder="e.g. Admin, Bhat Sahil, Research Fellow..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">Author Role / Title</label>
                          <input
                            type="text"
                            value={formData.authorRole ?? ''}
                            onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                            placeholder="e.g. Heritage Contributor, Cultural Scholar..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Subtitle / Headline</label>
                        <input
                          type="text"
                          value={formData.subtitle ?? ''}
                          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          placeholder="e.g. Historical analysis of the Reshi movement across the Kashmir valley"
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Short Excerpt / Card Summary</label>
                        <textarea
                          rows={2}
                          value={formData.excerpt ?? ''}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          placeholder="A short 1-2 sentence preview summary shown on cards..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                    </>
                  )}

                  {/* Rich Text / Content Area with formatting toolbar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800">
                        {moduleType === 'articles' ? 'Full Article Content (Markdown Supported)' : 'Content & Overview'}
                      </label>

                      {/* Formatting Toolbar */}
                      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => insertTextFormatting(' **Bold Text** ')}
                          className="p-1 rounded hover:bg-white text-slate-700"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertTextFormatting(' *Italic Text* ')}
                          className="p-1 rounded hover:bg-white text-slate-700"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertTextFormatting('\n### Section Heading\n')}
                          className="p-1 rounded hover:bg-white text-slate-700"
                          title="Heading"
                        >
                          <Heading className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertTextFormatting('\n> "Kashmiri Sufi Quote Verse"\n')}
                          className="p-1 rounded hover:bg-white text-slate-700"
                          title="Quote"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={moduleType === 'articles' ? 8 : 5}
                      value={formData.contentMarkdown ?? (moduleType !== 'articles' ? (formData.biography ?? formData.overview ?? formData.summary ?? formData.fullNarrative ?? '') : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (moduleType === 'articles') {
                          setFormData({ ...formData, contentMarkdown: val });
                        } else if (moduleType === 'saints') {
                          setFormData({ ...formData, biography: val, contentMarkdown: val });
                        } else if (moduleType === 'sites') {
                          setFormData({ ...formData, overview: val, contentMarkdown: val });
                        } else {
                          setFormData({ ...formData, summary: val, contentMarkdown: val, fullNarrative: val });
                        }
                      }}
                      placeholder="Write the full detailed research article, story, or historical narrative..."
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-slate-50 font-mono text-xs"
                    ></textarea>
                  </div>
                </>
              )}

              {/* Publication Status & Feature Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <div>
                      <span className="font-bold text-slate-900 block">Editorial Status</span>
                      <span className="text-[11px] text-amber-900">Visibility on live website</span>
                    </div>
                  </div>

                  <select
                    value={formData.status || 'Published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="p-2 rounded-xl bg-white border border-amber-300 font-bold text-xs text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                {moduleType === 'articles' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-950 block">Feature on Homepage</span>
                      <span className="text-[11px] text-emerald-800">Set as main magazine cover story</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.featured === true}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 accent-emerald-800 rounded"
                    />
                  </div>
                )}
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#1B5E4B] text-amber-300 font-bold text-xs shadow-lg flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Record to CMS</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
