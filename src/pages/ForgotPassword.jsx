import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { api } from '../lib/api.js';
import { usePageMeta } from '../lib/hooks.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  usePageMeta('Reset your password', 'Request a password reset for your EVORA STYLE account.');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Client area"
      title="Reset your password"
      subtitle="Enter the email on your account and we will send a secure reset link."
    >
      {message ? (
        <div className="border border-ink/15 bg-paper px-4 py-5">
          <p className="text-[13px] leading-relaxed text-charcoal/75">{message}</p>
          <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
            Note: this development store has no email provider connected, so the reset link is written to the
            server log instead.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="reset-email">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              className="field"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {error ? (
            <p role="alert" className="border border-[#b4523f]/30 bg-[#b4523f]/5 px-3 py-2 text-[11px] text-[#b4523f]">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy} className="btn-dark w-full">
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="mt-5 text-[12px] text-charcoal/65">
        <Link to="/login" className="underline underline-offset-4 hover:text-ink">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
