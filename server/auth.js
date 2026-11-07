import crypto from 'node:crypto';
import { one, query } from './db.js';

const SESSION_COOKIE = 'evora_sid';
const GUEST_COOKIE = 'evora_guest';
const SESSION_DAYS = 30;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored) return false;
  const [scheme, salt, hash] = String(stored).split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    status: row.status,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query('INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)', [token, userId, expires]);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    expires,
  });
  return token;
}

export async function destroySession(req, res) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) await query('DELETE FROM sessions WHERE token = $1', [token]);
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}

export function ensureGuestToken(req, res) {
  let token = req.cookies?.[GUEST_COOKIE];
  if (!token) {
    token = crypto.randomBytes(18).toString('hex');
    res.cookie(GUEST_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 180,
    });
  }
  return token;
}

export function guestToken(req) {
  return req.cookies?.[GUEST_COOKIE] || null;
}

export async function attachUser(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    req.user = null;
    if (token) {
      const row = await one(
        `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.token = $1 AND s.expires_at > now() AND u.status = 'active'`,
        [token]
      );
      if (row) req.user = publicUser(row);
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' });
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Please sign in to continue.' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Administrator access only.' });
  next();
}

// Moves a guest cart / wishlist onto the signed-in account.
export async function mergeGuestData(guest, userId) {
  if (!guest) return;
  await query(
    `INSERT INTO cart_items (user_id, product_id, size, color, quantity)
     SELECT $1, product_id, size, color, quantity FROM cart_items WHERE guest_token = $2
     ON CONFLICT (user_id, product_id, size, color) WHERE user_id IS NOT NULL
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [userId, guest]
  );
  await query('DELETE FROM cart_items WHERE guest_token = $1', [guest]);
  await query(
    `INSERT INTO wishlist_items (user_id, product_id)
     SELECT $1, product_id FROM wishlist_items WHERE guest_token = $2
     ON CONFLICT (user_id, product_id) WHERE user_id IS NOT NULL DO NOTHING`,
    [userId, guest]
  );
  await query('DELETE FROM wishlist_items WHERE guest_token = $1', [guest]);
}
