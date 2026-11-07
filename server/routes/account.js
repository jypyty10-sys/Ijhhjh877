import { Router } from 'express';
import { many, one, query } from '../db.js';
import { hashPassword, requireUser, verifyPassword } from '../auth.js';
import { loadCart, loadSettings } from '../cartStore.js';
import { ensureGuestToken, guestToken } from '../auth.js';

const router = Router();

function shapeAddress(row) {
  return {
    id: row.id,
    label: row.label,
    fullName: row.full_name,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    postcode: row.postcode,
    country: row.country,
    phone: row.phone,
    isDefault: row.is_default,
  };
}

function shapeOrder(row, items = []) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    deliveryMethod: row.delivery_method,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    discount: Number(row.discount),
    total: Number(row.total),
    currency: row.currency,
    email: row.email,
    customer: row.customer,
    shippingAddress: row.shipping_address,
    discountCode: row.discount_code,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  };
}

function shapeOrderItem(row) {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    size: row.size,
    color: row.color,
    quantity: row.quantity,
    image: row.image_url,
  };
}

router.get('/account/profile', requireUser, async (req, res, next) => {
  try {
    const row = await one('SELECT * FROM users WHERE id = $1', [req.user.id]);
    res.json({
      profile: {
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/account/profile', requireUser, async (req, res, next) => {
  try {
    const firstName = String(req.body?.firstName || '').trim();
    const lastName = String(req.body?.lastName || '').trim();
    const phone = String(req.body?.phone || '').trim() || null;
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (firstName.length < 2 || lastName.length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const clash = await one('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, req.user.id]);
    if (clash) return res.status(409).json({ error: 'That email is already in use.' });
    const updated = await one(
      `UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *`,
      [firstName, lastName, email, phone, req.user.id]
    );
    res.json({
      profile: {
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        phone: updated.phone,
      },
      message: 'Your details have been saved.',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/account/password', requireUser, async (req, res, next) => {
  try {
    const current = String(req.body?.currentPassword || '');
    const next = String(req.body?.newPassword || '');
    if (next.length < 8) return res.status(400).json({ error: 'Use at least 8 characters.' });
    const row = await one('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (!verifyPassword(current, row.password_hash)) {
      return res.status(400).json({ error: 'Your current password is not correct.' });
    }
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashPassword(next), req.user.id]);
    res.json({ message: 'Your password has been updated.' });
  } catch (error) {
    next(error);
  }
});

router.get('/account/addresses', requireUser, async (req, res, next) => {
  try {
    const rows = await many('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC', [
      req.user.id,
    ]);
    res.json({ addresses: rows.map(shapeAddress) });
  } catch (error) {
    next(error);
  }
});

router.post('/account/addresses', requireUser, async (req, res, next) => {
  try {
    const body = req.body || {};
    const required = ['fullName', 'line1', 'city', 'postcode'];
    for (const field of required) {
      if (!String(body[field] || '').trim()) return res.status(400).json({ error: 'Please complete every required field.' });
    }
    if (body.isDefault) {
      await query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id]);
    }
    const row = await one(
      `INSERT INTO addresses (user_id, label, full_name, line1, line2, city, postcode, country, phone, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        req.user.id,
        body.label || 'Home',
        body.fullName,
        body.line1,
        body.line2 || null,
        body.city,
        body.postcode,
        body.country || 'United Kingdom',
        body.phone || null,
        Boolean(body.isDefault),
      ]
    );
    res.json({ address: shapeAddress(row), message: 'Address saved.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/account/addresses/:id', requireUser, async (req, res, next) => {
  try {
    const body = req.body || {};
    if (body.isDefault) {
      await query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id]);
    }
    const row = await one(
      `UPDATE addresses SET
         label = COALESCE($1, label), full_name = COALESCE($2, full_name), line1 = COALESCE($3, line1),
         line2 = COALESCE($4, line2), city = COALESCE($5, city), postcode = COALESCE($6, postcode),
         country = COALESCE($7, country), phone = COALESCE($8, phone), is_default = COALESCE($9, is_default)
       WHERE id = $10 AND user_id = $11 RETURNING *`,
      [
        body.label ?? null,
        body.fullName ?? null,
        body.line1 ?? null,
        body.line2 ?? null,
        body.city ?? null,
        body.postcode ?? null,
        body.country ?? null,
        body.phone ?? null,
        typeof body.isDefault === 'boolean' ? body.isDefault : null,
        Number(req.params.id),
        req.user.id,
      ]
    );
    if (!row) return res.status(404).json({ error: 'Address not found.' });
    res.json({ address: shapeAddress(row), message: 'Address updated.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/account/addresses/:id', requireUser, async (req, res, next) => {
  try {
    await query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [Number(req.params.id), req.user.id]);
    res.json({ ok: true, message: 'Address removed.' });
  } catch (error) {
    next(error);
  }
});

router.get('/orders', requireUser, async (req, res, next) => {
  try {
    const rows = await many('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    const ids = rows.map((row) => row.id);
    let items = [];
    if (ids.length) {
      items = await many('SELECT * FROM order_items WHERE order_id = ANY($1::int[])', [ids]);
    }
    const grouped = new Map();
    for (const item of items) {
      if (!grouped.has(item.order_id)) grouped.set(item.order_id, []);
      grouped.get(item.order_id).push(shapeOrderItem(item));
    }
    res.json({ orders: rows.map((row) => shapeOrder(row, grouped.get(row.id) || [])) });
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:number', async (req, res, next) => {
  try {
    const row = await one('SELECT * FROM orders WHERE order_number = $1', [req.params.number]);
    if (!row) return res.status(404).json({ error: 'Order not found.' });
    const email = String(req.query.email || '').toLowerCase();
    const isOwner = req.user && row.user_id === req.user.id;
    const isGuestLookup = !row.user_id && email && email === String(row.email).toLowerCase();
    if (!isOwner && !isGuestLookup && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have access to this order.' });
    }
    const items = await many('SELECT * FROM order_items WHERE order_id = $1', [row.id]);
    res.json({ order: shapeOrder(row, items.map(shapeOrderItem)) });
  } catch (error) {
    next(error);
  }
});

router.post('/orders', async (req, res, next) => {
  const client = await (await import('../db.js')).pool.connect();
  try {
    const body = req.body || {};
    const customer = {
      firstName: String(body.customer?.firstName || '').trim(),
      lastName: String(body.customer?.lastName || '').trim(),
      email: String(body.customer?.email || '').trim().toLowerCase(),
      phone: String(body.customer?.phone || '').trim(),
    };
    const address = body.shippingAddress || {};
    const errors = {};
    if (customer.firstName.length < 2) errors.firstName = 'Required';
    if (customer.lastName.length < 2) errors.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)) errors.email = 'Enter a valid email';
    if (!address.line1) errors.line1 = 'Required';
    if (!address.city) errors.city = 'Required';
    if (!address.postcode) errors.postcode = 'Required';
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'Please complete your details.', errors });
    }

    const who = req.user ? { userId: req.user.id, guest: null } : { userId: null, guest: guestToken(req) };
    const cart = await loadCart(who);
    if (!cart.items.length) return res.status(400).json({ error: 'Your bag is empty.' });

    const settings = await loadSettings();
    const deliveryMethod = body.deliveryMethod === 'express' ? 'express' : 'standard';
    const paymentMethod = ['card', 'invoice', 'paypal'].includes(body.paymentMethod) ? body.paymentMethod : 'invoice';
    const threshold = Number(settings.free_shipping_threshold ?? 250);
    const shipping =
      deliveryMethod === 'express'
        ? Number(settings.shipping_express ?? 24)
        : cart.subtotal >= threshold
          ? 0
          : Number(settings.shipping_standard ?? 12);

    let discount = 0;
    let discountCode = null;
    if (body.discountCode) {
      const row = await one('SELECT * FROM discount_codes WHERE code = $1 AND active', [
        String(body.discountCode).toUpperCase(),
      ]);
      if (row && Number(row.min_subtotal) <= cart.subtotal) {
        discountCode = row.code;
        discount =
          row.type === 'percent'
            ? Number(((cart.subtotal * Number(row.value)) / 100).toFixed(2))
            : Math.min(Number(row.value), cart.subtotal);
      }
    }

    const total = Number((cart.subtotal + shipping - discount).toFixed(2));
    const orderNumber = `EV-${Date.now().toString().slice(-6)}`;

    await client.query('BEGIN');
    const inserted = await client.query(
      `INSERT INTO orders (order_number, user_id, email, status, payment_status, payment_method,
         delivery_method, subtotal, shipping, discount, total, customer, shipping_address, discount_code)
       VALUES ($1,$2,$3,'awaiting_confirmation','not_charged',$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        orderNumber,
        req.user?.id ?? null,
        customer.email,
        paymentMethod,
        deliveryMethod,
        cart.subtotal,
        shipping,
        discount,
        total,
        JSON.stringify(customer),
        JSON.stringify(address),
        discountCode,
      ]
    );

    for (const item of cart.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, slug, price, size, color, quantity, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [inserted.rows[0].id, item.productId, item.name, item.slug, item.price, item.size, item.color, item.quantity, item.image]
      );
      await client.query('UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id = $2', [
        item.quantity,
        item.productId,
      ]);
    }

    await client.query(
      `DELETE FROM cart_items WHERE ${who.userId ? 'user_id = $1' : 'guest_token = $1'}`,
      [who.userId ?? who.guest]
    );
    if (discountCode) {
      await client.query('UPDATE discount_codes SET usage_count = usage_count + 1 WHERE code = $1', [discountCode]);
    }
    await client.query('COMMIT');

    const items = await many('SELECT * FROM order_items WHERE order_id = $1', [inserted.rows[0].id]);
    res.status(201).json({
      order: shapeOrder(inserted.rows[0], items.map(shapeOrderItem)),
      notice:
        'Your order has been recorded and is awaiting confirmation. No payment has been taken — no payment provider is connected to this store yet.',
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    next(error);
  } finally {
    client.release();
  }
});

export default router;
