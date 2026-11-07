import express from 'express';
import cookieParser from 'cookie-parser';
import { many, one, pool, query, SCHEMA } from './db.js';
import { attachUser, ensureGuestToken, guestToken } from './auth.js';
import { loadCart, loadSettings, loadWishlist } from './cartStore.js';
import { seed } from './seed.js';
import catalogRoutes from './routes/catalog.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import accountRoutes from './routes/account.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = Number(process.env.API_PORT || 4000);

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(attachUser);

app.get('/api/health', async (req, res) => {
  try {
    await one('SELECT 1');
    res.json({ ok: true, database: 'up' });
  } catch (error) {
    res.status(503).json({ ok: false, database: 'down' });
  }
});

app.get('/api/bootstrap', async (req, res, next) => {
  try {
    ensureGuestToken(req, res);
    const owner = { userId: req.user?.id ?? null, guest: guestToken(req) };
    const [cart, wishlist, settings, categories, collections] = await Promise.all([
      loadCart(owner),
      loadWishlist(owner),
      loadSettings(),
      many('SELECT slug, name, description, image_url AS image FROM categories ORDER BY position'),
      many('SELECT * FROM collections WHERE active ORDER BY position'),
    ]);
    res.json({
      user: req.user,
      cart,
      wishlist,
      settings,
      categories,
      collections: collections.map((row) => ({
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        image: row.image_url,
        ctaLabel: row.cta_label,
        ctaHref: row.cta_href,
      })),
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api', catalogRoutes);
app.use('/api', cartRoutes);
app.use('/api', accountRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

app.use((error, req, res, next) => {
  console.error('[api]', req.method, req.originalUrl, error);
  if (res.headersSent) return next(error);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
});

async function bootstrapDatabase(attempt = 1) {
  try {
    await query(SCHEMA);
    await seed();
    console.log('[api] database ready');
  } catch (error) {
    if (attempt >= 20) throw error;
    console.log(`[api] database not ready (attempt ${attempt}) — retrying…`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return bootstrapDatabase(attempt + 1);
  }
}

async function main() {
  await bootstrapDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[api] listening on http://0.0.0.0:${PORT}`);
  });
}

process.on('SIGTERM', async () => {
  await pool.end().catch(() => {});
  process.exit(0);
});

main().catch((error) => {
  console.error('[api] failed to start', error);
  process.exit(1);
});
