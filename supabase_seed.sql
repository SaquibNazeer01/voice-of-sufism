-- ==========================================
-- VOICE OF SUFISM - SUPABASE SEED DATA SCRIPT
-- Execute this SQL script in your Supabase SQL Editor
-- (Database -> SQL Editor -> New Query)
-- AFTER executing supabase_schema.sql
-- ==========================================

-- ------------------------------------------
-- 1. SEED CATEGORIES
-- ------------------------------------------
INSERT INTO public.cms_categories (id, name, slug, description, item_count, color_badge) VALUES
('cat-1', 'Sufi Saints', 'sufi-saints', 'Biographies, orders, and spiritual teachings of Kashmir Sufis & Reshis', 12, 'bg-[#0F4C3A] text-amber-300'),
('cat-2', 'Sacred Shrines', 'sacred-shrines', 'Architectural surveys, ziyarats, khanqahs and pilgrimage maps', 18, 'bg-emerald-800 text-white'),
('cat-3', 'Language & Poetry', 'language-poetry', 'Vakhs of Lal Ded, Shruks of Sheikh-ul-Alam, and classic Koshur verse', 24, 'bg-amber-600 text-white'),
('cat-4', 'Architecture & Heritage', 'architecture-heritage', 'Wooden pagodas, papier-mâché ceilings, khatamband ceilings, and stone masonry', 9, 'bg-stone-800 text-amber-200'),
('cat-5', 'Culture & Folklore', 'culture-folklore', 'Oral folk stories, elder legends, and traditional Valley customs', 15, 'bg-teal-800 text-white'),
('cat-6', 'Crafts & Traditions', 'crafts-traditions', 'Pashmina weaving, Kani shawls, copperware (tuntun), and wood carving', 11, 'bg-indigo-900 text-amber-200')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------
-- 2. SEED USERS
-- ------------------------------------------
INSERT INTO public.cms_users (id, name, email, role, status, avatar, contributions_count, last_login, district_location) VALUES
('user-1', 'Peerzada Tariq Ahmad', 'admin@voiceofsufism.org', 'Super Admin', 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 28, 'Today at 09:42 AM', 'Srinagar'),
('user-2', 'Dr. Shahida Reshi', 'shahida.reshi@kashmirheritage.org', 'Senior Editor', 'Active', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 19, 'Yesterday at 04:15 PM', 'Budgam'),
('user-3', 'Ghulam Hassan Mir', 'ghulam.mir@archive.kashmir.gov.in', 'Cultural Scholar', 'Active', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 14, '3 days ago', 'Anantnag'),
('user-4', 'Amina Bano', 'amina.bano@sufipublishing.org', 'Archive Contributor', 'Active', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 6, '1 week ago', 'Baramulla')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------
-- 3. SEED SUFI SAINTS
-- ------------------------------------------
INSERT INTO public.sufi_saints (id, name, kashmiri_name, title_urdu, "order", period, shrine_location, district, biography, core_philosophy, famous_saying, impact_on_kashmir, image, lat, lng) VALUES
(
  'nund-reshi',
  'Sheikh Noor-ud-din Wali (Nund Reshi)',
  'نند رِشؠ / علمدارِ کٲشُر',
  'علامدارِ کشمیر شیخ العالم',
  'Reshi',
  '1377–1438 AD',
  'Charar-i-Sharief, Budgam',
  'Budgam',
  'Founder of the indigenous Kashmiri Reshi Order of Sufism. Nund Reshi was a saint, poet, and ecological philosopher whose Shruks form the moral backbone of Kashmiri culture.',
  'Ecological stewardship, universal non-violence, vegetarianism, total devotion to One Divine Creator without caste or creed distinction.',
  '{"kashmiri": "Ann poshi teli yeli wan poshi.", "transliteration": "Ann poshi teli yeli wan poshi.", "english": "Food will thrive only as long as the forests thrive."}'::jsonb,
  'Transformed Kashmir into a land of peaceful humanism, establishing shrines that served as community kitchens (Langars) for the needy.',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  33.8631, 74.7709
),
(
  'shah-e-hamadan',
  'Mir Syed Ali Hamadani (Shah-e-Hamadan)',
  'میر سَیِّد علی ہَمدانی',
  'شاہِ ہمدان امیرِ کبیر',
  'Kubrawi',
  '1314–1384 AD',
  'Khanqah-e-Moula, Srinagar',
  'Srinagar',
  'A revered Persian Sufi scholar who visited Kashmir three times with 700 artisans, introducing Islam alongside Central Asian arts and crafts.',
  'Combining high spiritual asceticism with economic self-reliance through artisan crafts and trade mastery.',
  '{"kashmiri": "Haq shuda zinda az baraye khuda.", "transliteration": "Haq shuda zinda az baraye khuda.", "english": "Truth lives eternally for the sake of the Divine Light."}'::jsonb,
  'Revolutionized the Kashmir valley economy by introducing Shawl weaving, Papier-mâché, Woodcarving, and Calligraphy.',
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
  34.0898, 74.8080
),
(
  'lal-ded',
  'Lalleshwari (Lal Ded)',
  'لال دٔد',
  'ماتا لال دِید',
  'Independent Mystic',
  '1320–1392 AD',
  'Padgampora / Pampore',
  'Pulwama',
  '14th-century mystic poet who laid the foundation of Kashmiri vernacular literature through four-line poetic stanzas called Vakhs.',
  'Non-dualism (Shaivite-Sufi synthesis), inner self-realization, rejection of outward ritualism.',
  '{"kashmiri": "Goran ditsnam kunuy vatsun, Nebra dopnam andrey atsun.", "transliteration": "Goran ditsnam kunuy vatsun...", "english": "My master gave me but one precept: Turn your gaze from the outer world to the inner self."}'::jsonb,
  'Her poetic Vakhs bridged indigenous Kashmiri philosophy with incoming Islamic Sufism, creating a shared vocabulary of love.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  33.9926, 74.9317
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------
-- 4. SEED HERITAGE SITES
-- ------------------------------------------
INSERT INTO public.heritage_sites (id, name, kashmiri_name, type, district, built_year, architectural_style, overview, visitation_etiquette, hero_image, lat, lng, distance_from_srinagar_km) VALUES
(
  'site-1',
  'Khanqah-e-Moula',
  'خانقاہِ معلیٰ',
  'Khanqah',
  'Srinagar',
  '1395 AD',
  'Traditional Kashmiri Wooden Pagoda Style',
  'Situated on the right bank of the River Jhelum in Srinagar, this Khanqah is one of the oldest wooden monuments in Kashmir, famed for its Khatamband ceilings and painted Papier-mâché walls.',
  '["Remove footwear prior to entering courtyard", "Modest attire covering shoulders and knees", "Silence maintained during prayer recitations"]'::jsonb,
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80',
  34.0898, 74.8080, 0
),
(
  'site-2',
  'Charar-i-Sharief Shrine',
  'چَرارِ شَریف',
  'Shrine (Ziyarat)',
  'Budgam',
  '1438 AD (Rebuilt 1990s)',
  'Modern Tiered Wooden Shrine Architecture',
  'Resting on a high hill slope in Budgam, Charar-i-Sharief is the resting place of Sheikh-ul-Alam Nund Reshi, drawing pilgrims from all faith traditions.',
  '["Head covering recommended", "Photography restricted inside inner sanctum"]'::jsonb,
  'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=1200&auto=format&fit=crop&q=80',
  33.8631, 74.7709, 28
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------
-- 5. SEED POEM VERSES
-- ------------------------------------------
INSERT INTO public.poem_verses (id, poet_name, poet_role, title, kashmiri_script, transliteration, english_translation, theme, audio_text, historical_context, year_century) VALUES
(
  'poem-1',
  'Lal Ded (Lalleshwari)',
  '14th Century Mystic Poetess',
  'Vakh: The Inner Mirror',
  'سۄیی یُس پنُن مَن زینی ، تَمِسِی پٔرِیو گِیانہِ جۄت',
  'Suh yus panun man zeni, tamisey pariyav gyane jot.',
  'He who masters his own mind, radiates the true divine light of inner wisdom.',
  'Self Realization',
  'Suh yus panun man zeni, tamisey pariyav gyane jot...',
  'Composed during the early 14th century when Lal Ded traveled through Kashmir villages, reciting spontaneous Vakhs.',
  '14th Century'
),
(
  'poem-2',
  'Sheikh-ul-Alam Nund Reshi',
  'Founder of Kashmir Reshi Order',
  'Shruk: The Sacred Forest',
  'اَن پۆشِ تِلِ یِلِ وۆن پۆشِ',
  'Ann poshi teli yeli wan poshi.',
  'Food will thrive only as long as the forests thrive.',
  'Nature & Ecology',
  'Ann poshi teli yeli wan poshi...',
  'Proclaimed in the forests of Budgam to teach villagers the sacred connection between environmental care and human survival.',
  '15th Century'
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------
-- 6. SEED SITE SETTINGS
-- ------------------------------------------
INSERT INTO public.site_settings (id, site_title, urdu_title, tagline, meta_description, contact_email, editorial_board, maintenance_mode, enable_ambient_audio, allow_public_submissions, require_editorial_review, items_per_page, api_backend_status, storage_endpoint, last_backup_date) VALUES
(
  'global_settings',
  'Voice of Sufism (صداۓ تصوف)',
  'صداۓ تصوف - کشمیری روایات',
  'A Living Digital Archive of Kashmiri Reshi Traditions, Sufi Literature & Heritage',
  'Preserving the sacred poetry, shrines, crafts, and oral folklore of the Kashmir Valley.',
  'contact@voiceofsufism.org',
  'Kashmir Sufism Heritage Foundation & Jammu & Kashmir Cultural Academy',
  false, true, true, true, 12,
  'Connected (Supabase PostgreSQL)',
  'Supabase Storage (sufism-assets)',
  'Aug 04, 2026'
)
ON CONFLICT (id) DO NOTHING;
