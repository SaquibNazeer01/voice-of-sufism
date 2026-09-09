/**
 * seedSupabase.ts
 * One-time seeder that pushes all local static data into Supabase tables.
 * Triggered from the admin Settings module via "Seed Database" button.
 * Uses upsert so it's safe to run multiple times.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ARTICLES_DATA } from '../data/articles';
import { SAINTS_DATA } from '../data/saints';
import { POEMS_DATA } from '../data/poems';
import { HERITAGE_SITES_DATA } from '../data/heritageSites';
import { PHOTO_GALLERY_DATA } from '../data/galleries';

export interface SeedResult {
  success: boolean;
  seeded: { table: string; count: number }[];
  errors: { table: string; error: string }[];
}

export async function seedSupabaseDatabase(): Promise<SeedResult> {
  const result: SeedResult = { success: true, seeded: [], errors: [] };

  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      seeded: [],
      errors: [{ table: 'all', error: 'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env' }]
    };
  }

  // ─── 1. Articles ─────────────────────────────────────────────────────────
  try {
    const articles = ARTICLES_DATA.map(a => ({
      id: a.id,
      title: a.title,
      title_urdu: a.titleUrdu ?? null,
      subtitle: a.subtitle,
      category: a.category,
      region: a.region,
      location_name: a.locationName,
      lat: a.coordinates?.lat ?? 34.0837,
      lng: a.coordinates?.lng ?? 74.7973,
      author: a.author,
      author_role: a.authorRole,
      date: a.date,
      read_time: a.readTime,
      hero_image: a.heroImage,
      excerpt: a.excerpt,
      content_markdown: a.contentMarkdown,
      status: 'Published',
      featured: a.featured ?? false,
      trending: a.trending ?? false,
      editor_pick: a.editorPick ?? false,
      quotes: a.quotes ?? [],
      timeline_events: a.timelineEvents ?? [],
      gallery_images: a.galleryImages ?? [],
      related_article_ids: a.relatedArticleIds ?? [],
      audio_kalam_url: a.audioKalamUrl ?? null,
      tags: a.tags ?? [],
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('articles').upsert(articles, { onConflict: 'id' });
    if (error) {
      result.errors.push({ table: 'articles', error: error.message });
      result.success = false;
    } else {
      result.seeded.push({ table: 'articles', count: articles.length });
    }
  } catch (err: any) {
    result.errors.push({ table: 'articles', error: String(err?.message ?? err) });
    result.success = false;
  }

  // ─── 2. Sufi Saints ──────────────────────────────────────────────────────
  try {
    const saints = SAINTS_DATA.map(s => ({
      id: s.id,
      name: s.name,
      kashmiri_name: s.kashmiriName ?? null,
      title_urdu: s.titleUrdu ?? null,
      order: s.order,
      period: s.period,
      shrine_location: s.shrineLocation,
      district: s.district,
      biography: s.biography,
      core_philosophy: s.corePhilosophy,
      famous_saying: s.famousSaying ?? {},
      impact_on_kashmir: s.impactOnKashmir,
      image: s.image,
      lat: s.coordinates?.lat ?? 34.0837,
      lng: s.coordinates?.lng ?? 74.7973,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('sufi_saints').upsert(saints, { onConflict: 'id' });
    if (error) {
      result.errors.push({ table: 'sufi_saints', error: error.message });
      result.success = false;
    } else {
      result.seeded.push({ table: 'sufi_saints', count: saints.length });
    }
  } catch (err: any) {
    result.errors.push({ table: 'sufi_saints', error: String(err?.message ?? err) });
    result.success = false;
  }

  // ─── 3. Heritage Sites ───────────────────────────────────────────────────
  try {
    const sites = HERITAGE_SITES_DATA.map(s => ({
      id: s.id,
      name: s.name,
      kashmiri_name: s.kashmiriName ?? null,
      type: s.type,
      district: s.district,
      built_year: s.builtYear,
      architectural_style: s.architecturalStyle,
      overview: s.overview,
      visitation_etiquette: s.visitationEtiquette ?? [],
      hero_image: s.heroImage,
      lat: s.coordinates?.lat ?? 34.0837,
      lng: s.coordinates?.lng ?? 74.7973,
      distance_from_srinagar_km: s.distanceFromSrinagarKm ?? 0,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('heritage_sites').upsert(sites, { onConflict: 'id' });
    if (error) {
      result.errors.push({ table: 'heritage_sites', error: error.message });
      result.success = false;
    } else {
      result.seeded.push({ table: 'heritage_sites', count: sites.length });
    }
  } catch (err: any) {
    result.errors.push({ table: 'heritage_sites', error: String(err?.message ?? err) });
    result.success = false;
  }

  // ─── 4. Poems ────────────────────────────────────────────────────────────
  try {
    const poems = POEMS_DATA.map(p => ({
      id: p.id,
      poet_name: p.poetName,
      poet_role: p.poetRole,
      title: p.title,
      kashmiri_script: p.kashmiriScript,
      transliteration: p.transliteration,
      english_translation: p.englishTranslation,
      theme: p.theme,
      audio_text: p.audioText,
      historical_context: p.historicalContext,
      year_century: p.yearCentury,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('poem_verses').upsert(poems, { onConflict: 'id' });
    if (error) {
      result.errors.push({ table: 'poem_verses', error: error.message });
      result.success = false;
    } else {
      result.seeded.push({ table: 'poem_verses', count: poems.length });
    }
  } catch (err: any) {
    result.errors.push({ table: 'poem_verses', error: String(err?.message ?? err) });
    result.success = false;
  }

  // ─── 5. Photos ───────────────────────────────────────────────────────────
  try {
    const photos = PHOTO_GALLERY_DATA.map(p => ({
      id: p.id,
      title: p.title,
      caption: p.caption,
      location: p.location,
      district: p.district,
      year: p.year,
      photographer: p.photographer,
      image_url: p.imageUrl,
      category: p.category,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('photo_gallery').upsert(photos, { onConflict: 'id' });
    if (error) {
      result.errors.push({ table: 'photo_gallery', error: error.message });
      result.success = false;
    } else {
      result.seeded.push({ table: 'photo_gallery', count: photos.length });
    }
  } catch (err: any) {
    result.errors.push({ table: 'photo_gallery', error: String(err?.message ?? err) });
    result.success = false;
  }

  // ─── 6. Site Settings (initial row) ──────────────────────────────────────
  try {
    const { error } = await supabase.from('site_settings').upsert({
      id: 'global_settings',
      site_title: 'Voice of Sufism',
      urdu_title: 'صداۓ تصوف',
      tagline: 'Preserving the Spiritual Heritage of Kashmir',
      meta_description: 'Voice of Sufism — an independent digital archive documenting Kashmiri Sufi traditions, sacred shrines, oral histories, and mystical poetry.',
      contact_email: 'admin@voiceofsufism.org',
      editorial_board: 'Sahil Amin (Founder), Saquib Nazeer (Developer)',
      maintenance_mode: false,
      enable_ambient_audio: false,
      allow_public_submissions: true,
      require_editorial_review: true,
      items_per_page: 12,
      api_backend_status: 'Connected (Supabase PostgreSQL)',
      storage_endpoint: 'Supabase Storage (sufism-assets)',
      last_backup_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      result.errors.push({ table: 'site_settings', error: error.message });
    } else {
      result.seeded.push({ table: 'site_settings', count: 1 });
    }
  } catch (err: any) {
    result.errors.push({ table: 'site_settings', error: String(err?.message ?? err) });
  }

  return result;
}
