import { Router } from 'express';
import { one, query } from '../db.js';
import { ensureGuestToken, guestToken } from '../auth.js';
import { loadCart, loadWishlist } from '../cartStore.js';

const router = Router();

function owner(req, res) {
  if (req.user) return { userId: req.user.id, guest: null };
  return { userId: null, guest: ensureGuestToken(req, res) };
}

async function payload(req, res) {
  const who = owner(req, res);
  return { cart: await loadCart(who), wishlist: await loadWishlist(who) };
}

router.post('/cart/items', async (req, res, next) => {
  try {
    const productId = Number(req.body?.productId);
    const quantity = Math.max(1, Math.min(Number(req.body?.quantity) || 1, 20));
    const product = await one('SELECT * FROM products WHERE id = $1 AND active', [productId]);
    if (!product) return res.status(404).json({ error: 'Product not available.' });
    if (product.stock < 1) return res.status(409).json({ error: 'This piece is currently out of stock.' });

    const size = String(req.body?.size || product.sizes?.[0] || 'One Size');
    const color = String(req.body?.color || product.colors?.[0]?.name || 'Default');
    if (product.sizes?.length && !product.sizes.includes(size)) {
      return res.status(400).json({ error: 'Please choose an available size.' });
    }

    const who = owner(req, res);
    const existing = await one(
      `SELECT * FROM cart_items
       WHERE product_id = $1 AND size = $2 AND color = $3
         AND ${who.userId ? 'user_id = $4' : 'guest_token = $4 AND user_id IS NULL'}`,
      [productId, size, color, who.userId ?? who.guest]
    );

    if (existing) {
      const nextQty = Math.min(existing.quantity + quantity, Math.min(product.stock, 20));
      await query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [nextQty, existing.id]);
    } else {
      await query(
        'INSERT INTO cart_items (user_id, guest_token, product_id, size, color, quantity) VALUES ($1,$2,$3,$4,$5,$6)',
        [who.userId, who.guest, productId, size, color, Math.min(quantity, product.stock)]
      );
    }

    const data = await payload(req, res);
    res.json({ ...data, message: `${product.name} added to your bag.` });
  } catch (error) {
    next(error);
  }
});

router.patch('/cart/items/:id', async (req, res, next) => {
  try {
    const who = owner(req, res);
    const quantity = Math.max(0, Math.min(Number(req.body?.quantity) || 0, 20));
    const item = await one(
      `SELECT ci.*, p.stock FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.id = $1 AND ${who.userId ? 'ci.user_id = $2' : 'ci.guest_token = $2'}`,
      [Number(req.params.id), who.userId ?? who.guest]
    );
    if (!item) return res.status(404).json({ error: 'Item not found in your bag.' });
    if (quantity === 0) {
      await query('DELETE FROM cart_items WHERE id = $1', [item.id]);
    } else {
      await query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [Math.min(quantity, item.stock), item.id]);
    }
    res.json(await payload(req, res));
  } catch (error) {
    next(error);
  }
});

router.delete('/cart/items/:id', async (req, res, next) => {
  try {
    const who = owner(req, res);
    await query(
      `DELETE FROM cart_items WHERE id = $1 AND ${who.userId ? 'user_id = $2' : 'guest_token = $2'}`,
      [Number(req.params.id), who.userId ?? who.guest]
    );
    res.json(await payload(req, res));
  } catch (error) {
    next(error);
  }
});

router.delete('/cart', async (req, res, next) => {
  try {
    const who = owner(req, res);
    await query(`DELETE FROM cart_items WHERE ${who.userId ? 'user_id = $1' : 'guest_token = $1'}`, [
      who.userId ?? who.guest,
    ]);
    res.json(await payload(req, res));
  } catch (error) {
    next(error);
  }
});

router.post('/wishlist/toggle', async (req, res, next) => {
  try {
    const productId = Number(req.body?.productId);
    const product = await one('SELECT name FROM products WHERE id = $1 AND active', [productId]);
    if (!product) return res.status(404).json({ error: 'Product not available.' });
    const who = owner(req, res);
    const existing = await one(
      `SELECT id FROM wishlist_items WHERE product_id = $1
         AND ${who.userId ? 'user_id = $2' : 'guest_token = $2'}`,
      [productId, who.userId ?? who.guest]
    );
    let saved;
    if (existing) {
      await query('DELETE FROM wishlist_items WHERE id = $1', [existing.id]);
      saved = false;
    } else {
      await query('INSERT INTO wishlist_items (user_id, guest_token, product_id) VALUES ($1,$2,$3)', [
        who.userId,
        who.guest,
        productId,
      ]);
      saved = true;
    }
    const data = await payload(req, res);
    res.json({
      ...data,
      saved,
      message: saved ? `${product.name} saved to your wishlist.` : `${product.name} removed from your wishlist.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
