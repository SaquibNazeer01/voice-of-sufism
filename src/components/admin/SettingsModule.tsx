import React, { useState } from 'react';
import { SiteSettings } from '../../types/cms';
import { 
  Globe, 
  ShieldCheck, 
  Database, 
  CheckCircle, 
  Save, 
  Trash2, 
  RefreshCw, 
  Phone, 
  Mail, 
  Share2, 
  Volume2, 
  AlertTriangle,
  Sliders,
  Sparkles
} from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';
import { MockCmsService } from '../../services/mockCmsService';

interface SettingsModuleProps {
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({ settings, onSaveSettings }) => {
  const [formData, setFormData] = useState<SiteSettings>({
    contactPhone: '+919596154384',
    whatsappNumber: '+919596154384',
    facebookUrl: 'https://www.facebook.com/VoiceOfSufism',
    instagramUrl: 'https://www.instagram.com/voiceofsufism',
    youtubeUrl: 'https://www.youtube.com/@voiceofsufism',
    ...settings
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleClearArticlesAndStories = async () => {
    const confirmation = window.prompt(
      '⚠️ This will permanently remove all articles and stories from the database.\n\nType "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') return;

    setIsClearing(true);
    setClearMessage(null);
    try {
      await SupabaseService.clearAllArticles();
      await SupabaseService.clearAllFolklore();
      setClearMessage('✅ All articles and stories were removed successfully.');
    } catch (err: any) {
      setClearMessage(`❌ Failed to clear: ${err?.message || err}`);
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearAllData = async () => {
    const confirmation = window.prompt(
      '🚨 DANGER: This will wipe all database content records (articles, saints, shrines, poems, photos).\n\nType "WIPE" to confirm:'
    );
    if (confirmation !== 'WIPE') return;

    setIsClearing(true);
    setClearMessage(null);
    try {
      await SupabaseService.clearAllData();
      setClearMessage('✅ All database collections wiped clean.');
    } catch (err: any) {
      setClearMessage(`❌ Failed to wipe data: ${err?.message || err}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            System Settings & Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure site metadata, contact & social channels, features, and database operations.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#0F4C3A] hover:from-emerald-700 hover:to-emerald-900 text-amber-300 font-bold text-xs shadow-md hover:shadow-emerald-900/20 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center space-x-2.5 animate-fadeIn shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>Settings saved successfully! Changes are updated across the website.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
        
        {/* Section 1: General Site Identity */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-serif font-bold text-base border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span>General Site Branding & Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Website Title</label>
              <input
                type="text"
                required
                value={formData.siteTitle || ''}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Urdu / Kashmiri Title</label>
              <input
                type="text"
                required
                value={formData.urduTitle || ''}
                onChange={(e) => setFormData({ ...formData, urduTitle: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs dir-rtl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tagline / Slogan</label>
            <input
              type="text"
              required
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-medium text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Editorial Board / Publisher</label>
              <input
                type="text"
                value={formData.editorialBoard || ''}
                onChange={(e) => setFormData({ ...formData, editorialBoard: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Items Per Page (Pagination)</label>
              <input
                type="number"
                min="4"
                max="50"
                value={formData.itemsPerPage || 12}
                onChange={(e) => setFormData({ ...formData, itemsPerPage: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 font-mono text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">SEO Meta Description</label>
            <textarea
              rows={2}
              value={formData.metaDescription || ''}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Contact Channels & Social Media */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-serif font-bold text-base border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <span>Contact Channels & Social Outreach</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone / WhatsApp Number</span>
              </label>
              <input
                type="text"
                value={formData.contactPhone || formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value, whatsappNumber: e.target.value })}
                placeholder="+919596154384"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebookUrl || ''}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://www.facebook.com/VoiceOfSufism"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://www.instagram.com/voiceofsufism"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Features & Maintenance Mode */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-serif font-bold text-base border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <span>Site Mode & Audio Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block flex items-center space-x-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>Ambient Audio Kalaam</span>
                </span>
                <span className="text-[11px] text-slate-500">Enable ambient Sufi background music</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableAmbientAudio === true}
                onChange={(e) => setFormData({ ...formData, enableAmbientAudio: e.target.checked })}
                className="w-4 h-4 accent-emerald-800 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-900 block flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>Maintenance Mode</span>
                </span>
                <span className="text-[11px] text-rose-700">Display maintenance notice to visitors</span>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode === true}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-4 h-4 accent-rose-700 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Live Database Status */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-serif font-bold text-base border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <span>Database Architecture</span>
          </div>

          <div className="p-4 rounded-2xl border text-xs space-y-2 bg-emerald-50/70 border-emerald-200 text-emerald-900">
            <div className="flex items-center space-x-2 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PostgreSQL & Cloud Firestore — Connected & Live</span>
            </div>
            <p className="opacity-90 leading-relaxed text-[11px]">
              All content records, user authorizations, and settings update directly in PostgreSQL & Cloud Firestore in real time across all devices and browsers.
            </p>
          </div>
        </div>

        {/* Section 5: Clean Slate / Reset Data */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 text-rose-900 font-serif font-bold text-base border-b border-rose-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <span>Clean Slate & Content Reset</span>
          </div>

          <p className="text-xs text-slate-600">
            Need to start fresh? You can clear all articles or wipe demo records at any time.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleClearArticlesAndStories}
              disabled={isClearing}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? 'Clearing...' : 'Clear All Articles & Stories'}</span>
            </button>

            <button
              type="button"
              onClick={handleClearAllData}
              disabled={isClearing}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-50 text-rose-300 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Wipe Entire Database</span>
            </button>

            <button
              type="button"
              onClick={() => {
                MockCmsService.purgeAll();
                window.location.reload();
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Purge Browser Cache</span>
            </button>
          </div>

          {clearMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs animate-fadeIn">
              {clearMessage}
            </div>
          )}
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#0F4C3A] hover:from-emerald-700 hover:to-emerald-900 text-amber-300 font-bold text-xs shadow-lg flex items-center space-x-2 transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save All Configuration Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
