import fs from 'fs';
import path from 'path';
import type { Plugin, ViteDevServer } from 'vite';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DB_DIR, 'database.json');

interface DatabaseSchema {
  articles: any[];
  saints: any[];
  sites: any[];
  poems: any[];
  photos: any[];
  culture: any[];
  folklore: any[];
  categories: any[];
  users: any[];
  ads: any[];
  sponsors: any[];
  settings: any;
  logs: any[];
}

const DEFAULT_DB: DatabaseSchema = {
  articles: [],
  saints: [],
  sites: [],
  poems: [],
  photos: [],
  culture: [],
  folklore: [],
  ads: [],
  sponsors: [],
  categories: [
    { id: 'cat-1', name: 'Sufi Saints', slug: 'sufi-saints', description: 'Biographies, orders, and spiritual teachings of Kashmir Sufis & Reshis', itemCount: 0, colorBadge: 'bg-[#0F4C3A] text-amber-300' },
    { id: 'cat-2', name: 'Sacred Shrines', slug: 'sacred-shrines', description: 'Architectural surveys, ziyarats, khanqahs and pilgrimage maps', itemCount: 0, colorBadge: 'bg-emerald-800 text-white' },
    { id: 'cat-3', name: 'Language & Poetry', slug: 'language-poetry', description: 'Vakhs of Lal Ded, Shruks of Sheikh-ul-Alam, and classic Koshur verse', itemCount: 0, colorBadge: 'bg-amber-600 text-white' },
    { id: 'cat-4', name: 'Architecture & Heritage', slug: 'architecture-heritage', description: 'Wooden pagodas, papier-mâché ceilings, khatamband ceilings, and stone masonry', itemCount: 0, colorBadge: 'bg-stone-800 text-amber-200' },
    { id: 'cat-5', name: 'Culture & Folklore', slug: 'culture-folklore', description: 'Oral folk stories, elder legends, and traditional Valley customs', itemCount: 0, colorBadge: 'bg-teal-800 text-white' },
    { id: 'cat-6', name: 'Crafts & Traditions', slug: 'crafts-traditions', description: 'Pashmina weaving, Kani shawls, copperware (tuntun), and wood carving', itemCount: 0, colorBadge: 'bg-indigo-900 text-amber-200' }
  ],
  users: [
    {
      id: 'user-admin-1',
      name: 'Bhat Sahil',
      email: 'admin@voiceofsufism.org',
      role: 'Super Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      contributionsCount: 0,
      lastLogin: 'Active Now',
      districtLocation: 'Srinagar'
    }
  ],
  settings: {
    siteTitle: 'Voice of Sufism (صداۓ تصوف)',
    urduTitle: 'صداۓ تصوف - کشمیری روایات',
    tagline: 'Documenting Kashmir’s Sufi Shrines, Reshi Culture & Mystical Poetry',
    metaDescription: 'A dedicated digital archive preserving Kashmir’s centuries-old Sufi saints, wooden shrine architecture, Vakhs, Shruks, and oral folk history.',
    contactEmail: 'contact@voiceofsufism.org',
    editorialBoard: 'Kashmir Cultural Heritage Research Cell, Srinagar',
    maintenanceMode: false,
    enableAmbientAudio: true,
    allowPublicSubmissions: false,
    requireEditorialReview: false,
    itemsPerPage: 12,
    apiBackendStatus: 'Shared Server Database (Active)',
    storageEndpoint: 'Server JSON Storage (data/database.json)',
    lastBackupDate: new Date().toISOString()
  },
  logs: []
};

// Safe Database File Reader & Writer
function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return { ...DEFAULT_DB, ...parsed };
  } catch (err) {
    console.error('Database read error:', err);
    return DEFAULT_DB;
  }
}

function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Database write error:', err);
  }
}

// Request body helper
function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: any, data: any, statusCode: number = 200) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

export function databasePlugin(): Plugin {
  return {
    name: 'voice-of-sufism-database-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const method = req.method || 'GET';

        if (method === 'OPTIONS') {
          return sendJson(res, { ok: true });
        }

        if (!url.startsWith('/api/')) {
          return next();
        }

        const pathWithoutQuery = url.split('?')[0];
        const parts = pathWithoutQuery.replace('/api/', '').split('/');
        const resource = parts[0];
        const resourceId = parts[1] ? decodeURIComponent(parts[1]) : null;

        const db = getDatabase();

        // 1. ARTICLES
        if (resource === 'articles') {
          if (method === 'GET') {
            return sendJson(res, db.articles || []);
          }
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.articles || [];
            const idx = list.findIndex((a: any) => a.id === body.id);
            if (idx >= 0) {
              list[idx] = body;
            } else {
              list.unshift(body);
            }
            db.articles = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE') {
            if (resourceId) {
              db.articles = (db.articles || []).filter((a: any) => a.id !== resourceId);
            } else {
              db.articles = [];
            }
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 2. SAINTS
        if (resource === 'saints') {
          if (method === 'GET') return sendJson(res, db.saints || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.saints || [];
            const idx = list.findIndex((s: any) => s.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.saints = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.saints = (db.saints || []).filter((s: any) => s.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 3. SITES
        if (resource === 'sites') {
          if (method === 'GET') return sendJson(res, db.sites || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.sites || [];
            const idx = list.findIndex((s: any) => s.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.sites = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.sites = (db.sites || []).filter((s: any) => s.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 4. POEMS
        if (resource === 'poems') {
          if (method === 'GET') return sendJson(res, db.poems || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.poems || [];
            const idx = list.findIndex((p: any) => p.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.poems = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.poems = (db.poems || []).filter((p: any) => p.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 5. PHOTOS
        if (resource === 'photos') {
          if (method === 'GET') return sendJson(res, db.photos || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.photos || [];
            const idx = list.findIndex((p: any) => p.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.photos = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.photos = (db.photos || []).filter((p: any) => p.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 6. CULTURE
        if (resource === 'culture') {
          if (method === 'GET') return sendJson(res, db.culture || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.culture || [];
            const idx = list.findIndex((c: any) => c.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.culture = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.culture = (db.culture || []).filter((c: any) => c.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 7. FOLKLORE
        if (resource === 'folklore') {
          if (method === 'GET') return sendJson(res, db.folklore || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.folklore || [];
            const idx = list.findIndex((f: any) => f.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.folklore = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.folklore = (db.folklore || []).filter((f: any) => f.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 8. CATEGORIES
        if (resource === 'categories') {
          if (method === 'GET') return sendJson(res, db.categories || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.categories || [];
            const idx = list.findIndex((c: any) => c.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.push(body);
            db.categories = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.categories = (db.categories || []).filter((c: any) => c.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 9. USERS
        if (resource === 'users') {
          if (method === 'GET') return sendJson(res, db.users || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.users || [];
            const idx = list.findIndex((u: any) => u.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.push(body);
            db.users = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.users = (db.users || []).filter((u: any) => u.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 10. SETTINGS
        if (resource === 'settings') {
          if (method === 'GET') return sendJson(res, db.settings || DEFAULT_DB.settings);
          if (method === 'POST') {
            const body = await parseBody(req);
            db.settings = { ...db.settings, ...body };
            saveDatabase(db);
            return sendJson(res, db.settings);
          }
        }

        // 11. LOGS
        if (resource === 'logs') {
          if (method === 'GET') return sendJson(res, db.logs || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const logs = db.logs || [];
            const exactTimestamp = new Date().toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit', 
              hour12: true 
            });
            logs.unshift({
              id: 'log-' + Date.now(),
              user: body.user || 'Admin',
              action: body.action || 'Updated Content',
              target: body.target || 'Record',
              timestamp: exactTimestamp,
              badgeType: body.badgeType || 'update'
            });
            db.logs = logs.slice(0, 100);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 12. ADVERTISEMENTS
        if (resource === 'ads') {
          if (method === 'GET') return sendJson(res, db.ads || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.ads || [];
            const idx = list.findIndex((a: any) => a.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.ads = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.ads = (db.ads || []).filter((a: any) => a.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 13. SPONSORS
        if (resource === 'sponsors') {
          if (method === 'GET') return sendJson(res, db.sponsors || []);
          if (method === 'POST') {
            const body = await parseBody(req);
            const list = db.sponsors || [];
            const idx = list.findIndex((s: any) => s.id === body.id);
            if (idx >= 0) list[idx] = body;
            else list.unshift(body);
            db.sponsors = list;
            saveDatabase(db);
            return sendJson(res, body);
          }
          if (method === 'DELETE' && resourceId) {
            db.sponsors = (db.sponsors || []).filter((s: any) => s.id !== resourceId);
            saveDatabase(db);
            return sendJson(res, { success: true });
          }
        }

        // 14. CLEAR ALL
        if (resource === 'clear-all' && method === 'POST') {
          db.articles = [];
          db.saints = [];
          db.sites = [];
          db.poems = [];
          db.photos = [];
          db.culture = [];
          db.folklore = [];
          db.ads = [];
          db.sponsors = [];
          db.logs = [];
          saveDatabase(db);
          return sendJson(res, { success: true });
        }

        // Fallback 404
        return sendJson(res, { error: 'Not found' }, 404);
      });
    }
  };
}
