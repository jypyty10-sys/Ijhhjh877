import { Router } from 'express';
import { many, one, query } from '../db.js';
import { loadSettings } from '../cartStore.js';

const router = Router();

const PRODUCT_SELECT = `
  SELECT p.*, c.name AS category_name,
    COALESCE((
      SELECT json_agg(json_build_object('url', i.url, 'alt', i.alt) ORDER BY i.position)
      FROM product_images i WHERE i.product_id = p.id
    ), '[]'::json) AS images
  FROM products p JOIN categories c ON c.slug = p.category_slug
`;

export function shapeProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_slug,
    categoryName: row.category_name,
    price: Number(row.price),
    comparePrice: row.compare_price ? Number(row.compare_price) : null,
    description: row.description,
    story: row.story,
    material: row.material,
    care: row.care,
    sizes: row.sizes || [],
    colors: row.colors || [],
    stock: Number(row.stock),
    badge: row.badge,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isBestseller: row.is_bestseller,
    popularity: row.popularity,
    active: row.active,
    createdAt: row.created_at,
    images: row.images || [],
  };
}

router.get('/categories', async (req, res, next) => {
  try {
    const rows = await many(`
      SELECT c.*, (SELECT count(*)::int FROM products p WHERE p.category_slug = c.slug AND p.active) AS product_count
      FROM categories c ORDER BY c.position, c.name
    `);
    res.json({
      categories: rows.map((row) => ({
        slug: row.slug,
        name: row.name,
        description: row.description,
        image: row.image_url,
        productCount: row.product_count,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/collections', async (req, res, next) => {
  try {
    const rows = await many('SELECT * FROM collections WHERE active ORDER BY position');
    res.json({
      collections: rows.map((row) => ({
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

router.get('/settings', async (req, res, next) => {
  try {
    res.json({ settings: await loadSettings() });
  } catch (error) {
    next(error);
  }
});

router.get('/products', async (req, res, next) => {
  try {
    const {
      category,
      q,
      minPrice,
      maxPrice,
      size,
      color,
      inStock,
      sort = 'featured',
      page = '1',
      limit = '12',
      featured,
      bestseller,
      new: isNew,
      collection,
    } = req.query;

    const where = ['p.active = true'];
    const params = [];
    const add = (sql, value) => {
      params.push(value);
      where.push(sql.replace('?', `$${params.length}`));
    };

    if (category && category !== 'all') add('p.category_slug = ?', String(category));
    if (q) add('(p.name ILIKE ? OR p.description ILIKE ? OR c.name ILIKE ?)'.replace(/\?/g, `$${params.length + 1}`), `%${q}%`);
    if (minPrice) add('p.price >= ?', Number(minPrice));
    if (maxPrice) add('p.price <= ?', Number(maxPrice));
    if (size) add('p.sizes && ?::text[]', String(size).split(',').filter(Boolean));
    if (color) {
      params.push(String(color).split(',').filter(Boolean));
      where.push(`EXISTS (SELECT 1 FROM jsonb_array_elements(p.colors) col WHERE col->>'name' = ANY($${params.length}))`);
    }
    if (inStock === '1' || inStock === 'true') where.push('p.stock > 0');
    if (featured === '1') where.push('p.is_featured = true');
    if (bestseller === '1') where.push('p.is_bestseller = true');
    if (isNew === '1') where.push('p.is_new = true');
    if (collection === 'english-vintage') where.push("p.category_slug IN ('suits','outerwear','waistcoats','flat-caps')");

    const sortSql = {
      'price-asc': 'p.price ASC',
      'price-desc': 'p.price DESC',
      newest: 'p.created_at DESC, p.id DESC',
      popular: 'p.popularity DESC',
      featured: 'p.is_featured DESC, p.popularity DESC',
    }[String(sort)] || 'p.is_featured DESC, p.popularity DESC';

    const whereSql = `WHERE ${where.join(' AND ')}`;
    const totalRow = await one(
      `SELECT count(*)::int AS count FROM products p JOIN categories c ON c.slug = p.category_slug ${whereSql}`,
      params
    );

    const perPage = Math.min(Math.max(Number(limit) || 12, 1), 48);
    const currentPage = Math.max(Number(page) || 1, 1);
    const rows = await many(
      `${PRODUCT_SELECT} ${whereSql} ORDER BY ${sortSql} LIMIT ${perPage} OFFSET ${(currentPage - 1) * perPage}`,
      params
    );

    const facetRows = await many(
      `SELECT sizes, colors, price FROM products WHERE active
       ${category && category !== 'all' ? `AND category_slug = '${String(category).replace(/'/g, "''")}'` : ''}`
    );
    const sizeSet = new Set();
    const colorMap = new Map();
    let lowest = null;
    let highest = null;
    for (const row of facetRows) {
      (row.sizes || []).forEach((value) => sizeSet.add(value));
      (row.colors || []).forEach((value) => colorMap.set(value.name, value.hex));
      const price = Number(row.price);
      lowest = lowest === null ? price : Math.min(lowest, price);
      highest = highest === null ? price : Math.max(highest, price);
    }

    res.json({
      items: rows.map(shapeProduct),
      total: totalRow.count,
      page: currentPage,
      pages: Math.max(1, Math.ceil(totalRow.count / perPage)),
      facets: {
        sizes: [...sizeSet],
        colors: [...colorMap.entries()].map(([name, hex]) => ({ name, hex })),
        price: { min: Math.floor(lowest ?? 0), max: Math.ceil(highest ?? 500) },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:slug', async (req, res, next) => {
  try {
    const row = await one(`${PRODUCT_SELECT} WHERE p.slug = $1 AND p.active`, [req.params.slug]);
    if (!row) return res.status(404).json({ error: 'Product not found.' });
    const product = shapeProduct(row);
    const related = await many(
      `${PRODUCT_SELECT} WHERE p.active AND p.category_slug = $1 AND p.id <> $2
       ORDER BY p.popularity DESC LIMIT 4`,
      [product.category, product.id]
    );
    res.json({ product, related: related.map(shapeProduct) });
  } catch (error) {
    next(error);
  }
});

router.get('/search/suggest', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ products: [], categories: [] });
    const products = await many(
      `${PRODUCT_SELECT} WHERE p.active AND (p.name ILIKE $1 OR c.name ILIKE $1)
       ORDER BY p.popularity DESC LIMIT 6`,
      [`%${q}%`]
    );
    const categories = await many(
      `SELECT slug, name FROM categories WHERE name ILIKE $1 ORDER BY position LIMIT 3`,
      [`%${q}%`]
    );
    res.json({ products: products.map(shapeProduct), categories });
  } catch (error) {
    next(error);
  }
});

router.post('/discounts/validate', async (req, res, next) => {
  try {
    const code = String(req.body?.code || '').trim().toUpperCase();
    const subtotal = Number(req.body?.subtotal || 0);
    if (!code) return res.status(400).json({ error: 'Enter a discount code.' });
    const row = await one('SELECT * FROM discount_codes WHERE code = $1 AND active', [code]);
    if (!row) return res.status(404).json({ error: 'That code is not recognised.' });
    if (Number(row.min_subtotal) > subtotal) {
      return res.status(400).json({ error: `Spend $${Number(row.min_subtotal).toFixed(0)} to use this code.` });
    }
    const amount =
      row.type === 'percent'
        ? Number(((subtotal * Number(row.value)) / 100).toFixed(2))
        : Number(row.value);
    res.json({ code: row.code, type: row.type, value: Number(row.value), amount: Math.min(amount, subtotal) });
  } catch (error) {
    next(error);
  }
});

router.post('/newsletter', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    await query(
      'INSERT INTO newsletter_subscribers (email, source) VALUES ($1,$2) ON CONFLICT (email) DO NOTHING',
      [email, req.body?.source || 'footer']
    );
    res.json({ ok: true, message: 'You are on the list. Welcome to EVORA.' });
  } catch (error) {
    next(error);
  }
});

export default router;
