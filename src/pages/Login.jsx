import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { usePageMeta } from '../lib/hooks.js';

export default function Login() {
  const { login, pushToast } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  usePageMeta('Sign in', 'Sign in to your EVORA STYLE account.');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' && redirect === '/account' ? '/admin' : redirect, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const quickFill = (email) => {
    setForm({ email, password: 'Evora2026!' });
    pushToast('Demo credentials filled in — press Sign In.');
  };

  return (
    <AuthShell
      eyebrow="Client area"
      title="Welcome back"
      subtitle="Sign in to review your orders, saved addresses and wishlist."
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            className="field"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="login-password">
              Password
            </label>
            <Link to="/forgot-password" className="mb-2 text-[10px] uppercase tracking-label text-ink/50 hover:text-ink">
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            className="field"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
        </div>

        {error ? (
          <p role="alert" className="border border-[#b4523f]/30 bg-[#b4523f]/5 px-3 py-2 text-[11px] text-[#b4523f]">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className="btn-dark w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-[12px] text-charcoal/65">
        New to the house?{' '}
        <Link to="/register" className="underline underline-offset-4 hover:text-ink">
          Create an account
        </Link>
      </p>

      <div className="mt-8 border border-ink/10 bg-paper px-4 py-3">
        <p className="text-[9px] uppercase tracking-label text-ink/40">Demo accounts</p>
        <div className="mt-2 space-y-1.5 text-[11px] text-charcoal/70">
          <button type="button" onClick={() => quickFill('james.whitfield@example.com')} className="block text-left hover:text-ink">
            Customer — james.whitfield@example.com
          </button>
          <button type="button" onClick={() => quickFill('admin@evorastyle.com')} className="block text-left hover:text-ink">
            Administrator — admin@evorastyle.com
          </button>
          <p className="pt-1 text-[10px] text-ink/40">Password for both seeded accounts: Evora2026!</p>
        </div>
      </div>
    </AuthShell>
  );
}
