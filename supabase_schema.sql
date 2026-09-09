-- ==========================================
-- VOICE OF SUFISM - SUPABASE DATABASE SCHEMA
-- ==========================================
-- SETUP INSTRUCTIONS (do this once):
-- 1. Open Supabase Dashboard → your project → SQL Editor
-- 2. Click "New Query"
-- 3. Paste THIS ENTIRE FILE and click "Run"
-- 4. Then go to Admin Dashboard → Settings → "Seed Database"
--    to push all local content into Supabase
-- ==========================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. ARTICLES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_urdu TEXT,
  subtitle TEXT,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  location_name TEXT,
  lat DOUBLE PRECISION DEFAULT 34.0837,
  lng DOUBLE PRECISION DEFAULT 74.7973,
  author TEXT,
  author_role TEXT,
  date TEXT,
  read_time TEXT,
  hero_image TEXT,
  excerpt TEXT,
  content_markdown TEXT,
  status TEXT DEFAULT 'Published', -- 'Published' or 'Draft'
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  editor_pick BOOLEAN DEFAULT FALSE,
  quotes JSONB DEFAULT '[]'::jsonb,
  timeline_events JSONB DEFAULT '[]'::jsonb,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  related_article_ids JSONB DEFAULT '[]'::jsonb,
  audio_kalam_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: add status column to existing articles table (safe to run on existing DBs)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Published';


-- ------------------------------------------
-- 2. SUFI SAINTS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.sufi_saints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kashmiri_name TEXT,
  title_urdu TEXT,
  "order" TEXT NOT NULL,
  period TEXT,
  shrine_location TEXT,
  district TEXT NOT NULL,
  biography TEXT,
  core_philosophy TEXT,
  famous_saying JSONB DEFAULT '{}'::jsonb,
  impact_on_kashmir TEXT,
  image TEXT,
  lat DOUBLE PRECISION DEFAULT 34.0837,
  lng DOUBLE PRECISION DEFAULT 74.7973,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 3. HERITAGE SITES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.heritage_sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kashmiri_name TEXT,
  type TEXT NOT NULL,
  district TEXT NOT NULL,
  built_year TEXT,
  architectural_style TEXT,
  overview TEXT,
  visitation_etiquette JSONB DEFAULT '[]'::jsonb,
  hero_image TEXT,
  lat DOUBLE PRECISION DEFAULT 34.0837,
  lng DOUBLE PRECISION DEFAULT 74.7973,
  distance_from_srinagar_km NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 4. POEM VERSES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.poem_verses (
  id TEXT PRIMARY KEY,
  poet_name TEXT NOT NULL,
  poet_role TEXT,
  title TEXT NOT NULL,
  kashmiri_script TEXT,
  transliteration TEXT,
  english_translation TEXT,
  theme TEXT NOT NULL,
  audio_text TEXT,
  historical_context TEXT,
  year_century TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 5. PHOTO GALLERY TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.photo_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  location TEXT,
  district TEXT NOT NULL,
  year TEXT,
  photographer TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 6. CULTURE ITEMS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.culture_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kashmiri_title TEXT,
  type TEXT NOT NULL,
  district TEXT NOT NULL,
  summary TEXT,
  historical_background TEXT,
  status TEXT DEFAULT 'Published',
  hero_image TEXT,
  master_artisans TEXT,
  author TEXT,
  date_added TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 7. FOLKLORE STORIES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.folklore_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_urdu TEXT,
  narrator TEXT NOT NULL,
  narrator_age TEXT,
  district TEXT NOT NULL,
  theme TEXT,
  summary TEXT,
  full_narrative TEXT,
  status TEXT DEFAULT 'Published',
  audio_recording_available BOOLEAN DEFAULT FALSE,
  collected_by TEXT,
  date_collected TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 8. CMS CATEGORIES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  item_count INT DEFAULT 0,
  color_badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 9. CMS TAGS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 10. CMS USERS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Archive Contributor',
  status TEXT NOT NULL DEFAULT 'Active',
  avatar TEXT,
  contributions_count INT DEFAULT 0,
  last_login TEXT,
  district_location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 11. SITE SETTINGS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  site_title TEXT NOT NULL,
  urdu_title TEXT,
  tagline TEXT,
  meta_description TEXT,
  contact_email TEXT,
  editorial_board TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  enable_ambient_audio BOOLEAN DEFAULT TRUE,
  allow_public_submissions BOOLEAN DEFAULT TRUE,
  require_editorial_review BOOLEAN DEFAULT TRUE,
  items_per_page INT DEFAULT 12,
  api_backend_status TEXT DEFAULT 'Connected (Supabase PostgreSQL)',
  storage_endpoint TEXT DEFAULT 'Supabase Storage (sufism-assets)',
  last_backup_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 12. ACTIVITY LOGS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  "user" TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  badge_type TEXT DEFAULT 'create'
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable read access to everyone & write access to authenticated/anon for CMS management
-- ==========================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sufi_saints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poem_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folklore_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Read Saints" ON public.sufi_saints FOR SELECT USING (true);
CREATE POLICY "Public Read Sites" ON public.heritage_sites FOR SELECT USING (true);
CREATE POLICY "Public Read Poems" ON public.poem_verses FOR SELECT USING (true);
CREATE POLICY "Public Read Photos" ON public.photo_gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Culture" ON public.culture_items FOR SELECT USING (true);
CREATE POLICY "Public Read Folklore" ON public.folklore_stories FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.cms_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Tags" ON public.cms_tags FOR SELECT USING (true);
CREATE POLICY "Public Read Users" ON public.cms_users FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Logs" ON public.activity_logs FOR SELECT USING (true);

-- Allow insert/update/delete for full management
CREATE POLICY "Manage Articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Saints" ON public.sufi_saints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Sites" ON public.heritage_sites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Poems" ON public.poem_verses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Photos" ON public.photo_gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Culture" ON public.culture_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Folklore" ON public.folklore_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Categories" ON public.cms_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Tags" ON public.cms_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Users" ON public.cms_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Manage Logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- SUPABASE STORAGE BUCKET SETUP INSTRUCTIONS
-- ==========================================
-- In Supabase Dashboard -> Storage -> Create a new public bucket named: `sufism-assets`
-- Policy: Enable Public Read Access & Public Insert/Update Access for uploaded assets.
