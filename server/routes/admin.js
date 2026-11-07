import { Router } from 'express';
import { many, one, query } from '../db.js';
import { requireAdmin } from '../auth.js';
import { loadSettings } from '../cartStore.js';

const router = Router();
router.use(requireAdmin);

function toProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_slug,
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
    active: row.active,
    popularity: row.popularity,
    images: row.images || [],
  };
}

const productQuery = `
  SELECT p.*, COALESCE((
    SELECT json_agg(json_build_object('url', i.url, 'alt', i.alt) ORDER BY i.position)
    FROM product_images i WHERE i.product_id = p.id
  ), '[]'::json) AS images
  FROM products p
`;

router.get('/stats', async (req, res, next) => {
  try {
    const totals = await one(`
      SELECT
        (SELECT count(*)::int FROM orders) AS orders,
        (SELECT count(*)::int FROM products WHERE active) AS products,
        (SELECT count(*)::int FROM users WHERE role = 'customer') AS customers,
        (SELECT COALESCE(sum(total), 0)::float FROM orders WHERE status <> 'cancelled') AS revenue
    `);
    const recent = await many(`
      SELECT o.*, (SELECT COALESCE(sum(quantity),0)::int FROM order_items WHERE order_id = o.id) AS item_count
      FROM orders o ORDER BY o.created_at DESC LIMIT 6`);
    const bestSellers = await many(`
      SELECT oi.name, oi.slug, sum(oi.quantity)::int AS sold, max(oi.image_url) AS image
      FROM order_items oi JOIN orders o ON o.id = oi.order_id
      WHERE o.status <> 'cancelled'
      GROUP BY oi.name, oi.slug ORDER BY sold DESC LIMIT 5`);
    const monthly = await many(`
      SELECT to_char(date_trunc('month', created_at), 'Mon') AS label,
             date_trunc('month', created_at) AS month,
             COALESCE(sum(total), 0)::float AS revenue,
             count(*)::int AS orders
      FROM orders WHERE created_at > now() - interval '6 months'
      GROUP BY 1, 2 ORDER BY 2`);
    const statuses = await many('SELECT status, count(*)::int AS count FROM orders GROUP BY status');
    res.json({
      totals,
      recentOrders: recent.map((row) => ({
        id: row.id,
        orderNumber: row.order_number,
        email: row.email,
        status: row.status,
        total: Number(row.total),
        itemCount: row.item_count,
        createdAt: row.created_at,
      })),
      bestSellers,
      monthly,
      statuses,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/products', async (req, res, next) => {
  try {
    const rows = await many(`${productQuery} ORDER BY p.created_at DESC, p.id DESC`);
    res.json({ products: rows.map(toProduct) });
  } catch (error) {
    next(error);
  }
});

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

router.post('/products', async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.category) return res.status(400).json({ error: 'Name and category are required.' });
    const price = Number(body.price);
    if (!price || price <= 0) return res.status(400).json({ error: 'Enter a valid price.' });
    const slug = slugify(body.slug || body.name);
    const clash = await one('SELECT id FROM products WHERE slug = $1', [slug]);
    if (clash) return res.status(409).json({ error: 'A product with that name already exists.' });
    const row = await one(
      `INSERT INTO products (slug, name, category_slug, price, compare_price, description, story, material, care,
        sizes, colors, stock, badge, is_new, is_featured, is_bestseller, popularity, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
      [
        slug,
        body.name,
        body.category,
        price,
        body.comparePrice || null,
        body.description || '',
        body.story || '',
        body.material || '',
        body.care || '',
        body.sizes || [],
        JSON.stringify(body.colors || []),
        Number(body.stock) || 0,
        body.badge || null,
        Boolean(body.isNew),
        Boolean(body.isFeatured),
        Boolean(body.isBestseller),
        Number(body.popularity) || 0,
        body.active !== false,
      ]
    );
    const images = Array.isArray(body.images) ? body.images : [];
    let position = 0;
    for (const image of images) {
      if (!image?.url) continue;
      await query('INSERT INTO product_images (product_id, url, alt, position) VALUES ($1,$2,$3,$4)', [
        row.id,
        image.url,
        image.alt || body.name,
        position++,
      ]);
    }
    const created = await one(`${productQuery} WHERE p.id = $1`, [row.id]);
    res.status(201).json({ product: toProduct(created), message: 'Product created.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/products/:id', async (req, res, next) => {
  try {
    const body = req.body || {};
    const id = Number(req.params.id);
    const existing = await one('SELECT * FROM products WHERE id = $1', [id]);
    if (!existing) return res.status(404).json({ error: 'Product not found.' });
    await query(
      `UPDATE products SET
         name = $1, category_slug = $2, price = $3, compare_price = $4, description = $5, story = $6,
         material = $7, care = $8, sizes = $9, colors = $10, stock = $11, badge = $12,
         is_new = $13, is_featured = $14, is_bestseller = $15, active = $16, popularity = $17
       WHERE id = $18`,
      [
        body.name ?? existing.name,
        body.category ?? existing.category_slug,
        body.price !== undefined ? Number(body.price) : existing.price,
        body.comparePrice === null || body.comparePrice === '' ? null : (body.comparePrice ?? existing.compare_price),
        body.description ?? existing.description,
        body.story ?? existing.story,
        body.material ?? existing.material,
        body.care ?? existing.care,
        body.sizes ?? existing.sizes,
        JSON.stringify(body.colors ?? existing.colors),
        body.stock !== undefined ? Number(body.stock) : existing.stock,
        body.badge ?? existing.badge,
        body.isNew ?? existing.is_new,
        body.isFeatured ?? existing.is_featured,
        body.isBestseller ?? existing.is_bestseller,
        body.active ?? existing.active,
        body.popularity !== undefined ? Number(body.popularity) : existing.popularity,
        id,
      ]
    );
    if (Array.isArray(body.images)) {
      await query('DELETE FROM product_images WHERE product_id = $1', [id]);
      let position = 0;
      for (const image of body.images) {
        if (!image?.url) continue;
        await query('INSERT INTO product_images (product_id, url, alt, position) VALUES ($1,$2,$3,$4)', [
          id,
          image.url,
          image.alt || body.name || existing.name,
          position++,
        ]);
      }
    }
    const updated = await one(`${productQuery} WHERE p.id = $1`, [id]);
    res.json({ product: toProduct(updated), message: 'Product updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM products WHERE id = $1', [Number(req.params.id)]);
    res.json({ ok: true, message: 'Product removed.' });
  } catch (error) {
    next(error);
  }
});

router.get('/orders', async (req, res, next) => {
  try {
    const search = String(req.query.q || '').trim();
    const params = [];
    let where = 'WHERE 1=1';
    if (search) {
      params.push(`%${search}%`);
      where += ' AND (o.order_number ILIKE $1 OR o.email ILIKE $1)';
    }
    if (req.query.status) {
      params.push(String(req.query.status));
      where += ` AND o.status = $${params.length}`;
    }
    const rows = await many(
      `SELECT o.*, (SELECT COALESCE(sum(quantity),0)::int FROM order_items WHERE order_id = o.id) AS item_count
       FROM orders o ${where} ORDER BY o.created_at DESC`,
      params
    );
    res.json({
      orders: rows.map((row) => ({
        id: row.id,
        orderNumber: row.order_number,
        email: row.email,
        status: row.status,
        paymentStatus: row.payment_status,
        paymentMethod: row.payment_method,
        deliveryMethod: row.delivery_method,
        total: Number(row.total),
        itemCount: row.item_count,
        customer: row.customer,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', async (req, res, next) => {
  try {
    const row = await one('SELECT * FROM orders WHERE id = $1', [Number(req.params.id)]);
    if (!row) return res.status(404).json({ error: 'Order not found.' });
    const items = await many('SELECT * FROM order_items WHERE order_id = $1', [row.id]);
    res.json({
      order: {
        id: row.id,
        orderNumber: row.order_number,
        email: row.email,
        status: row.status,
        paymentStatus: row.payment_status,
        paymentMethod: row.payment_method,
        deliveryMethod: row.delivery_method,
        subtotal: Number(row.subtotal),
        shipping: Number(row.shipping),
        discount: Number(row.discount),
        total: Number(row.total),
        customer: row.customer,
        shippingAddress: row.shipping_address,
        discountCode: row.discount_code,
        adminNotes: row.admin_notes,
        createdAt: row.created_at,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: Number(item.price),
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          image: item.image_url,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

const ORDER_STATUSES = ['awaiting_confirmation', 'processing', 'shipped', 'delivered', 'cancelled'];

router.patch('/orders/:id', async (req, res, next) => {
  try {
    const body = req.body || {};
    const id = Number(req.params.id);
    const existing = await one('SELECT * FROM orders WHERE id = $1', [id]);
    if (!existing) return res.status(404).json({ error: 'Order not found.' });
    const status = body.status && ORDER_STATUSES.includes(body.status) ? body.status : existing.status;
    await query('UPDATE orders SET status = $1, admin_notes = $2, updated_at = now() WHERE id = $3', [
      status,
      body.adminNotes ?? existing.admin_notes,
      id,
    ]);
    res.json({ ok: true, status, message: 'Order updated.' });
  } catch (error) {
    next(error);
  }
});

router.get('/customers', async (req, res, next) => {
  try {
    const rows = await many(`
      SELECT u.*,
        (SELECT count(*)::int FROM orders o WHERE o.user_id = u.id) AS order_count,
        (SELECT COALESCE(sum(total), 0)::float FROM orders o WHERE o.user_id = u.id AND o.status <> 'cancelled') AS spent
      FROM users u ORDER BY u.created_at DESC`);
    res.json({
      customers: rows.map((row) => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        role: row.role,
        status: row.status,
        phone: row.phone,
        orderCount: row.order_count,
        spent: row.spent,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/customers/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = req.body || {};
    if (id === req.user.id) return res.status(400).json({ error: 'You cannot change your own admin account.' });
    const status = ['active', 'suspended'].includes(body.status) ? body.status : null;
    const role = ['customer', 'admin'].includes(body.role) ? body.role : null;
    await query('UPDATE users SET status = COALESCE($1, status), role = COALESCE($2, role) WHERE id = $3', [
      status,
      role,
      id,
    ]);
    res.json({ ok: true, message: 'Customer updated.' });
  } catch (error) {
    next(error);
  }
});

router.get('/discounts', async (req, res, next) => {
  try {
    const rows = await many('SELECT * FROM discount_codes ORDER BY created_at DESC');
    res.json({
      discounts: rows.map((row) => ({
        id: row.id,
        code: row.code,
        type: row.type,
        value: Number(row.value),
        minSubtotal: Number(row.min_subtotal),
        active: row.active,
        usageCount: row.usage_count,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/discounts', async (req, res, next) => {
  try {
    const code = String(req.body?.code || '').trim().toUpperCase();
    if (!/^[A-Z0-9-]{3,20}$/.test(code)) return res.status(400).json({ error: 'Use 3–20 letters, numbers or dashes.' });
    const value = Number(req.body?.value);
    if (!value || value <= 0) return res.status(400).json({ error: 'Enter a discount value.' });
    const row = await one(
      `INSERT INTO discount_codes (code, type, value, min_subtotal, active)
       VALUES ($1,$2,$3,$4,$5) ON CONFLICT (code) DO NOTHING RETURNING *`,
      [code, req.body?.type === 'fixed' ? 'fixed' : 'percent', value, Number(req.body?.minSubtotal) || 0, true]
    );
    if (!row) return res.status(409).json({ error: 'That code already exists.' });
    res.status(201).json({ message: 'Discount created.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/discounts/:id', async (req, res, next) => {
  try {
    await query('UPDATE discount_codes SET active = $1 WHERE id = $2', [
      Boolean(req.body?.active),
      Number(req.params.id),
    ]);
    res.json({ message: 'Discount updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/discounts/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM discount_codes WHERE id = $1', [Number(req.params.id)]);
    res.json({ message: 'Discount removed.' });
  } catch (error) {
    next(error);
  }
});

router.get('/subscribers', async (req, res, next) => {
  try {
    const rows = await many('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');
    res.json({ subscribers: rows });
  } catch (error) {
    next(error);
  }
});

router.delete('/subscribers/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM newsletter_subscribers WHERE id = $1', [Number(req.params.id)]);
    res.json({ message: 'Subscriber removed.' });
  } catch (error) {
    next(error);
  }
});

router.get('/collections', async (req, res, next) => {
  try {
    const rows = await many('SELECT * FROM collections ORDER BY position');
    res.json({
      collections: rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        image: row.image_url,
        ctaLabel: row.cta_label,
        ctaHref: row.cta_href,
        active: row.active,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/collections/:id', async (req, res, next) => {
  try {
    const body = req.body || {};
    await query(
      `UPDATE collections SET title = COALESCE($1,title), subtitle = COALESCE($2,subtitle),
        description = COALESCE($3,description), image_url = COALESCE($4,image_url),
        cta_label = COALESCE($5,cta_label), active = COALESCE($6,active) WHERE id = $7`,
      [
        body.title ?? null,
        body.subtitle ?? null,
        body.description ?? null,
        body.image ?? null,
        body.ctaLabel ?? null,
        typeof body.active === 'boolean' ? body.active : null,
        Number(req.params.id),
      ]
    );
    res.json({ message: 'Collection updated.' });
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

router.put('/settings', async (req, res, next) => {
  try {
    const body = req.body || {};
    for (const [key, value] of Object.entries(body)) {
      await query(
        'INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
        [key, JSON.stringify(value)]
      );
    }
    res.json({ settings: await loadSettings(), message: 'Store settings saved.' });
  } catch (error) {
    next(error);
  }
});

export default router;
