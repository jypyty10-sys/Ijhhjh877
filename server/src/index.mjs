import express from 'express';
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.PORT || 8000);
const DATABASE_URL = process.env.DATABASE_URL || '';
const DEFAULT_CONTENT_PATH =
  process.env.DEFAULT_CONTENT_PATH || '/workspace/src/content/default-content.json';

// In the sandbox preview a known development account lets the owner reach the
// dashboard. A real ADMIN_PASSWORD always wins; outside preview mode the
// fallback is never enabled.
const PREVIEW_MODE = process.env.BASE44_PREVIEW_MODE === '1';
const PREVIEW_USERNAME = 'admin';
const PREVIEW_PASSWORD = 'ad5x-preview';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || (PREVIEW_MODE ? PREVIEW_USERNAME : '');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (PREVIEW_MODE ? PREVIEW_PASSWORD : '');

const SESSION_COOKIE = 'ad5x_admin';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_CONTENT_BYTES = 3 * 1024 * 1024;

const REQUIRED_CONTENT_KEYS = [
  'version',
  'seo',
  'nav',
  'hero',
  'features',
  'showcase',
  'specs',
  'applications',
  'filaments',
  'gallery',
  'benefits',
  'why',
  'faq',
  'finalCta',
  'contact',
  'footer',
];

if (!DATABASE_URL) {
  console.error('[api] DATABASE_URL is not set');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 5 });

let defaultContent = null;

const sha256 = (value) => createHash('sha256').update(String(value)).digest('hex');

function safeEqual(a, b) {
  const left = Buffer.from(sha256(a), 'hex');
  const right = Buffer.from(sha256(b), 'hex');
  return timingSafeEqual(left, right);
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of String(header).split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return out;
}

function isHttps(req) {
  return (
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    Boolean(req.headers['cf-visitor'])
  );
}

function sessionCookie(req, token, maxAgeSeconds) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isHttps(req)) parts.push('Secure');
  return parts.join('; ');
}

async function ensureSchema() {
  await pool.query(`
    create table if not exists site_content (
      id integer primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);
  await pool.query(`
    create table if not exists leads (
      id serial primary key,
      name text not null,
      phone text not null,
      message text not null default '',
      source text not null default '',
      created_at timestamptz not null default now()
    )
  `);
  await pool.query(`
    create table if not exists admin_sessions (
      token_hash text primary key,
      username text not null,
      expires_at timestamptz not null
    )
  `);
}

async function loadDefaultContent() {
  const raw = await readFile(DEFAULT_CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

async function seedContent() {
  const { rows } = await pool.query('select id from site_content where id = 1');
  if (rows.length === 0) {
    await pool.query('insert into site_content (id, data) values (1, $1)', [
      JSON.stringify(defaultContent),
    ]);
    console.log('[api] seeded default content');
  }
}

async function readContentRow() {
  const { rows } = await pool.query('select data, updated_at from site_content where id = 1');
  if (!rows.length) return { content: defaultContent, updatedAt: null };
  return { content: rows[0].data, updatedAt: rows[0].updated_at };
}

async function writeContent(content) {
  const { rows } = await pool.query(
    `insert into site_content (id, data, updated_at) values (1, $1, now())
     on conflict (id) do update set data = excluded.data, updated_at = now()
     returning updated_at`,
    [JSON.stringify(content)],
  );
  return rows[0].updated_at;
}

async function currentSession(req) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  const { rows } = await pool.query(
    'select username, expires_at from admin_sessions where token_hash = $1',
    [sha256(token)],
  );
  if (!rows.length) return null;
  if (new Date(rows[0].expires_at).getTime() < Date.now()) {
    await pool.query('delete from admin_sessions where token_hash = $1', [sha256(token)]);
    return null;
  }
  return { username: rows[0].username };
}

async function requireAdmin(req, res, next) {
  try {
    const session = await currentSession(req);
    if (!session) {
      res.status(401).json({ message: 'unauthorized', code: 'unauthorized' });
      return;
    }
    req.admin = session;
    next();
  } catch (error) {
    next(error);
  }
}

// Simple in-memory throttle for the login endpoint.
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;

function loginThrottle(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 0, resetAt: now + LOGIN_WINDOW_MS });
    next();
    return;
  }
  if (entry.count >= LOGIN_MAX_ATTEMPTS) {
    res.status(429).json({
      message: 'too_many_attempts',
      code: 'rate_limited',
    });
    return;
  }
  entry.count += 1;
  next();
}

function validateContent(content) {
  if (!content || typeof content !== 'object' || Array.isArray(content)) return 'invalid_content';
  for (const key of REQUIRED_CONTENT_KEYS) {
    if (!(key in content)) return `missing_${key}`;
  }
  const size = Buffer.byteLength(JSON.stringify(content), 'utf8');
  if (size > MAX_CONTENT_BYTES) return 'content_too_large';
  return null;
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.json({ limit: '4mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('select 1');
    res.json({ ok: true });
  } catch (error) {
    res.status(503).json({ ok: false, message: 'database_unavailable' });
  }
});

app.get('/api/content', async (_req, res, next) => {
  try {
    res.json(await readContentRow());
  } catch (error) {
    next(error);
  }
});

app.post('/api/leads', async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').replace(/[^\d+]/g, '');
    const message = String(body.message || '').trim().slice(0, 800);
    const source = String(body.source || 'site').trim().slice(0, 60);

    if (name.length < 2 || name.length > 80) {
      res.status(400).json({ message: 'invalid_name' });
      return;
    }
    if (phone.replace(/\D/g, '').length < 8 || phone.length > 20) {
      res.status(400).json({ message: 'invalid_phone' });
      return;
    }

    const { rows } = await pool.query(
      'insert into leads (name, phone, message, source) values ($1, $2, $3, $4) returning id',
      [name, phone, message, source],
    );
    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/session', async (req, res, next) => {
  try {
    const session = await currentSession(req);
    res.json({
      authenticated: Boolean(session),
      username: session?.username,
      devFallback: PREVIEW_MODE && !process.env.ADMIN_PASSWORD,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/login', loginThrottle, async (req, res, next) => {
  try {
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      res.status(503).json({
        message: 'admin_not_configured',
        code: 'admin_not_configured',
      });
      return;
    }
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');

    const userOk = username.length > 0 && safeEqual(username.toLowerCase(), ADMIN_USERNAME.toLowerCase());
    const passOk = password.length > 0 && safeEqual(password, ADMIN_PASSWORD);
    if (!userOk || !passOk) {
      res.status(401).json({ message: 'invalid_credentials', code: 'invalid_credentials' });
      return;
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await pool.query(
      'insert into admin_sessions (token_hash, username, expires_at) values ($1, $2, $3)',
      [sha256(token), username, expiresAt],
    );
    res.setHeader('Set-Cookie', sessionCookie(req, token, Math.floor(SESSION_TTL_MS / 1000)));
    res.json({ ok: true, username });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/logout', async (req, res, next) => {
  try {
    const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
    if (token) {
      await pool.query('delete from admin_sessions where token_hash = $1', [sha256(token)]);
    }
    res.setHeader('Set-Cookie', sessionCookie(req, '', 0));
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/content', requireAdmin, async (req, res, next) => {
  try {
    const content = req.body?.content;
    const problem = validateContent(content);
    if (problem) {
      res.status(400).json({ message: problem, code: problem });
      return;
    }
    const updatedAt = await writeContent(content);
    res.json({ content, updatedAt });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/content/reset', requireAdmin, async (_req, res, next) => {
  try {
    const updatedAt = await writeContent(defaultContent);
    res.json({ content: defaultContent, updatedAt });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/leads', requireAdmin, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `select id, name, phone, message, source, created_at
         from leads order by created_at desc limit 200`,
    );
    res.json({
      leads: rows.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        message: row.message,
        source: row.source,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/leads/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'invalid_id' });
      return;
    }
    const { rowCount } = await pool.query('delete from leads where id = $1', [id]);
    if (!rowCount) {
      res.status(404).json({ message: 'not_found' });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error('[api]', error);
  if (res.headersSent) return;
  res.status(500).json({ message: 'server_error', code: 'server_error' });
});

async function start() {
  defaultContent = await loadDefaultContent();
  await ensureSchema();
  await seedContent();
  setInterval(() => {
    pool
      .query('delete from admin_sessions where expires_at < now()')
      .catch((error) => console.error('[api] session cleanup failed', error));
  }, 60 * 60 * 1000).unref();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[api] listening on ${PORT}`);
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.warn('[api] admin login is not configured (set ADMIN_USERNAME / ADMIN_PASSWORD)');
    }
  });
}

start().catch((error) => {
  console.error('[api] failed to start', error);
  process.exit(1);
});
