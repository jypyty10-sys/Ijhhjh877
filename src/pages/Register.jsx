import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { usePageMeta } from '../lib/hooks.js';

const INITIAL = { firstName: '', lastName: '', email: '', password: '', confirm: '' };

export default function Register() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  usePageMeta('Create an account', 'Join EVORA STYLE for order history, saved addresses and wishlists.');

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.firstName.trim().length < 2) next.firstName = 'Enter your first name';
    if (form.lastName.trim().length < 2) next.lastName = 'Enter your last name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password.length < 8) next.password = 'At least 8 characters';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setError('');
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message);
      if (err.errors) setErrors(err.errors);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="The client register"
      title="Create an account"
      subtitle="Keep your orders, addresses and wishlist in one place."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="reg-first">
              First name
            </label>
            <input id="reg-first" className="field" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
            {errors.firstName ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.firstName}</p> : null}
          </div>
          <div>
            <label className="field-label" htmlFor="reg-last">
              Last name
            </label>
            <input id="reg-last" className="field" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
            {errors.lastName ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.lastName}</p> : null}
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="reg-email">
            Email
          </label>
          <input id="reg-email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" />
          {errors.email ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.email}</p> : null}
        </div>
        <div>
          <label className="field-label" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            className="field"
            value={form.password}
            onChange={set('password')}
            autoComplete="new-password"
          />
          {errors.password ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.password}</p> : null}
        </div>
        <div>
          <label className="field-label" htmlFor="reg-confirm">
            Confirm password
          </label>
          <input
            id="reg-confirm"
            type="password"
            className="field"
            value={form.confirm}
            onChange={set('confirm')}
            autoComplete="new-password"
          />
          {errors.confirm ? <p className="mt-1 text-[11px] text-[#b4523f]">{errors.confirm}</p> : null}
        </div>

        {error ? (
          <p role="alert" className="border border-[#b4523f]/30 bg-[#b4523f]/5 px-3 py-2 text-[11px] text-[#b4523f]">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className="btn-dark w-full">
          {busy ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-[10px] leading-relaxed text-ink/45">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2">
            terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </form>

      <p className="mt-5 text-[12px] text-charcoal/65">
        Already a client?{' '}
        <Link to="/login" className="underline underline-offset-4 hover:text-ink">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
