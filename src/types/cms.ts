import { CategoryType, DistrictRegion, Article, SufiSaint, PoemVerse, HeritageSite, PhotoGalleryItem } from '../types';

export type UserRole = 'Super Admin' | 'Senior Editor' | 'Cultural Scholar' | 'Archive Contributor';
export type ContentStatus = 'Published' | 'Draft' | 'Under Review' | 'Archived';

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Suspended';
  avatar: string;
  contributionsCount: number;
  lastLogin: string;
  districtLocation?: string;
  password?: string;
}

export interface CmsCategoryItem {
  id: string;
  name: CategoryType;
  slug: string;
  description: string;
  itemCount: number;
  colorBadge: string;
}

export interface CmsTagItem {
  id: string;
  name: string;
  usageCount: number;
}

export interface KashmiriCultureItem {
  id: string;
  title: string;
  kashmiriTitle?: string;
  type: 'Traditional Craft' | 'Culinary Art' | 'Festival & Custom' | 'Folk Music & Instrument';
  district: DistrictRegion;
  summary: string;
  historicalBackground: string;
  status: ContentStatus;
  heroImage: string;
  masterArtisans?: string;
  author: string;
  dateAdded: string;
}

export interface FolkloreStory {
  id: string;
  title: string;
  titleUrdu?: string;
  narrator: string;
  narratorAge?: string;
  district: DistrictRegion;
  theme: string;
  summary: string;
  fullNarrative: string;
  status: ContentStatus;
  audioRecordingAvailable: boolean;
  collectedBy: string;
  dateCollected: string;
  heroImage?: string;
}

export interface SiteSettings {
  siteTitle: string;
  urduTitle: string;
  tagline: string;
  metaDescription: string;
  contactEmail: string;
  contactPhone?: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  pinterestUrl?: string;
  editorialBoard: string;
  maintenanceMode: boolean;
  enableAmbientAudio: boolean;
  allowPublicSubmissions: boolean;
  requireEditorialReview: boolean;
  itemsPerPage: number;
  apiBackendStatus: 'Mock Storage (Active)' | 'Connected (REST API)' | 'Connected (GraphQL)' | 'Connected (Firebase)' | 'Connected (Supabase PostgreSQL)';
  storageEndpoint: string;
  lastBackupDate: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  badgeType: 'create' | 'update' | 'delete' | 'publish' | 'security';
}

export interface Advertisement {
  id: string;
  title: string;
  advertiserName: string;
  bannerImage: string;
  description: string;
  targetType: 'website' | 'whatsapp' | 'phone' | 'email';
  targetUrl: string;
  contactNumber?: string;
  contactEmail?: string;
  status: 'Active' | 'Paused';
  delaySeconds?: number;
  skipTimerSeconds?: number;
  clicksCount?: number;
  dateCreated?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tagline?: string;
  logo: string;
  tier: 'Title Sponsor' | 'Platinum Patron' | 'Gold Partner' | 'Cultural Heritage Supporter';
  description: string;
  websiteUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  status: 'Active' | 'Paused';
  dateAdded?: string;
}
