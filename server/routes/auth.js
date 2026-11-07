import { Router } from 'express';
import crypto from 'node:crypto';
import { one, query } from '../db.js';
import {
  createSession,
  destroySession,
  ensureGuestToken,
  guestToken,
  hashPassword,
  mergeGuestData,
  publicUser,
  verifyPassword,
} from '../auth.js';
import { loadCart, loadWishlist } from '../cartStore.js';

const router = Router();

function validateRegistration(body) {
  const errors = {};
  const firstName = String(body.firstName || '').trim();
  const lastName = String(body.lastName || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (firstName.length < 2) errors.firstName = 'Please enter your first name.';
  if (lastName.length < 2) errors.lastName = 'Please enter your last name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (password.length < 8) errors.password = 'Use at least 8 characters.';
  return { errors, firstName, lastName, email, password };
}

router.post('/register', async (req, res, next) => {
  try {
    const { errors, firstName, lastName, email, password } = validateRegistration(req.body || {});
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Please check the form.', errors });
    const existing = await one('SELECT id FROM users WHERE email = $1', [email]);
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });
    const created = await one(
      `INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1,$2,$3,$4) RETURNING *`,
      [firstName, lastName, email, hashPassword(password)]
    );
    await mergeGuestData(guestToken(req), created.id);
    await createSession(res, created.id);
    res.json({ user: publicUser(created) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' });
    const user = await one('SELECT * FROM users WHERE email = $1', [email]);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Those details do not match our records.' });
    }
    if (user.status !== 'active') return res.status(403).json({ error: 'This account has been suspended.' });
    await mergeGuestData(guestToken(req), user.id);
    await createSession(res, user.id);
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    await destroySession(req, res);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const user = await one('SELECT id FROM users WHERE email = $1', [email]);
    // Always answer the same way so the form cannot be used to probe accounts.
    if (user) {
      const token = crypto.randomBytes(24).toString('hex');
      console.log(`[auth] password reset requested for ${email} — token ${token}`);
    }
    res.json({
      ok: true,
      message: 'If an account exists for that email, a reset link is on its way.',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', async (req, res) => {
  if (!req.user) return res.json({ user: null });
  const token = req.cookies?.evora_guest || null;
  res.json({ user: req.user, guest: token });
});

// Called by the store after sign-in so the badge counts are fresh.
router.post('/session/sync', async (req, res, next) => {
  try {
    ensureGuestToken(req, res);
    const owner = { userId: req.user?.id, guest: guestToken(req) };
    res.json({ cart: await loadCart(owner), wishlist: await loadWishlist(owner) });
  } catch (error) {
    next(error);
  }
});

export default router;
