export type CategoryType = 
  | 'All'
  | 'Sufi Saints'
  | 'Sacred Shrines'
  | 'Language & Poetry'
  | 'Architecture & Heritage'
  | 'Culture & Folklore'
  | 'Crafts & Traditions';

export type DistrictRegion = 
  | 'All Regions'
  | 'Srinagar'
  | 'Budgam'
  | 'Anantnag'
  | 'Baramulla'
  | 'Ganderbal'
  | 'Pulwama'
  | 'Shopian'
  | 'Kupwara'
  | 'Bandipora'
  | 'Kulgam'
  | 'Jammu'
  | 'Kathua'
  | 'Udhampur'
  | 'Reasi'
  | 'Rajouri'
  | 'Poonch'
  | 'Doda'
  | 'Ramban'
  | 'Kishtwar'
  | 'Samba';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  titleUrdu?: string;
  subtitle: string;
  category: CategoryType;
  region: DistrictRegion;
  locationName: string;
  coordinates: { lat: number; lng: number };
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  heroImage: string;
  excerpt: string;
  contentMarkdown: string;
  status?: 'Published' | 'Draft';
  featured?: boolean;
  trending?: boolean;
  editorPick?: boolean;
  quotes?: { verse: string; translation: string; poet: string }[];
  timelineEvents?: TimelineEvent[];
  galleryImages?: { url: string; caption: string }[];
  relatedArticleIds?: string[];
  audioKalamUrl?: string;
  tags: string[];
}

export interface SufiSaint {
  id: string;
  name: string;
  kashmiriName?: string;
  titleUrdu?: string;
  order: 'Reshi' | 'Kubrawi' | 'Suhrawardi' | 'Qadiria' | 'Chisti' | 'Independent Mystic';
  period: string; // e.g. "1377–1438 AD"
  shrineLocation: string;
  district: DistrictRegion;
  biography: string;
  corePhilosophy: string;
  famousSaying: {
    kashmiri: string;
    transliteration: string;
    english: string;
  };
  impactOnKashmir: string;
  image: string;
  coordinates: { lat: number; lng: number };
}

export interface PoemVerse {
  id: string;
  poetName: string;
  poetRole: string;
  title: string;
  kashmiriScript: string;
  transliteration: string;
  englishTranslation: string;
  theme: 'Universal Harmony' | 'Nature & Ecology' | 'Inner Peace' | 'Divine Love' | 'Self Realization';
  audioText: string;
  historicalContext: string;
  yearCentury: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  kashmiriName?: string;
  type: 'Shrine (Ziyarat)' | 'Khanqah' | 'Mosque' | 'Heritage Site' | 'Ancient Temple' | 'Garden';
  district: DistrictRegion;
  builtYear: string;
  architecturalStyle: string;
  overview: string;
  visitationEtiquette: string[];
  heroImage: string;
  coordinates: { lat: number; lng: number };
  distanceFromSrinagarKm: number;
  slug?: string;
  spiritualLuminary?: string;
  historyStory?: string;
  architectureDetails?: string;
  ursTraditions?: string;
  localImageFilename?: string;
  locationAddress?: string;
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  caption: string;
  location: string;
  district: DistrictRegion;
  year: string;
  photographer: string;
  imageUrl: string;
  category: CategoryType;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: CategoryType;
  selectedRegion: DistrictRegion;
  selectedTag: string;
  onlyBookmarked: boolean;
}
