import { many } from './db.js';

export function ownerClause({ userId, guest }) {
  if (userId) return { where: 'user_id = $1', params: [userId] };
  if (guest) return { where: 'guest_token = $1', params: [guest] };
  return null;
}

const CART_SELECT = `
  SELECT ci.id, ci.quantity, ci.size, ci.color,
         p.id AS product_id, p.slug, p.name, p.price, p.compare_price, p.stock,
         c.name AS category_name,
         (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image,
         (SELECT alt FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image_alt
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  JOIN categories c ON c.slug = p.category_slug
`;

function shapeItem(row) {
  return {
    id: row.id,
    quantity: Number(row.quantity),
    size: row.size,
    color: row.color,
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    comparePrice: row.compare_price ? Number(row.compare_price) : null,
    stock: Number(row.stock),
    category: row.category_name,
    image: row.image,
    imageAlt: row.image_alt,
  };
}

export async function loadCart(owner) {
  const clause = ownerClause(owner);
  if (!clause) return { items: [], count: 0, subtotal: 0 };
  const rows = await many(`${CART_SELECT} WHERE ci.${clause.where} ORDER BY ci.id DESC`, clause.params);
  const items = rows.map(shapeItem);
  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)),
  };
}

export async function loadWishlist(owner) {
  const clause = ownerClause(owner);
  if (!clause) return { items: [], ids: [], count: 0 };
  const rows = await many(
    `SELECT w.id, p.id AS product_id, p.slug, p.name, p.price, p.compare_price,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image,
            (SELECT alt FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image_alt,
            p.stock, p.sizes, p.colors
     FROM wishlist_items w JOIN products p ON p.id = w.product_id
     WHERE w.${clause.where.includes('user_id') ? 'user_id' : 'guest_token'} = $1
     ORDER BY w.id DESC`,
    clause.params
  );
  const items = rows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    comparePrice: row.compare_price ? Number(row.compare_price) : null,
    image: row.image,
    imageAlt: row.image_alt,
    stock: Number(row.stock),
    sizes: row.sizes,
    colors: row.colors,
  }));
  return { items, ids: items.map((item) => item.productId), count: items.length };
}

export async function loadSettings() {
  const rows = await many('SELECT key, value FROM settings');
  const settings = {};
  for (const row of rows) settings[row.key] = row.value;
  return settings;
}
