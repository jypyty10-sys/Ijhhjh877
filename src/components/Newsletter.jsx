import { useState } from 'react';
import { api } from '../lib/api.js';
import { useStore } from '../context/StoreContext.jsx';
import Icon from './Icon.jsx';

export default function Newsletter({ tone = 'light', title = 'Letters from the house', copy }) {
  const { pushToast } = useStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const dark = tone === 'dark';

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('loading');
    try {
      const data = await api.post('/newsletter', { email, source: 'newsletter' });
      setStatus('done');
      setEmail('');
      pushToast(data.message || 'You are on the list.');
    } catch (err) {
      setStatus('idle');
      setError(err.message);
    }
  };

  return (
    <div className={dark ? 'text-ivory' : 'text-ink'}>
      <p className={`label ${dark ? 'text-ivory/50' : 'text-ink/50'}`}>The Newsletter</p>
      <h3 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">{title}</h3>
      <p className={`mt-2 max-w-md text-[13px] leading-relaxed ${dark ? 'text-ivory/60' : 'text-charcoal/65'}`}>
        {copy || 'New collections, quiet restocks and stories from the workshop. No noise.'}
      </p>

      {status === 'done' ? (
        <p className={`mt-5 flex items-center gap-2 text-[12px] ${dark ? 'text-ivory/80' : 'text-charcoal/75'}`}>
          <Icon name="check" className="h-4 w-4" /> Welcome to the house.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5">
          <div className={`flex items-center gap-3 border-b pb-2 ${dark ? 'border-ivory/30' : 'border-ink/25'}`}>
            <label className="sr-only" htmlFor={`newsletter-${tone}`}>
              Email address
            </label>
            <input
              id={`newsletter-${tone}`}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className={`w-full bg-transparent text-[13px] focus:outline-none ${
                dark ? 'placeholder:text-ivory/40' : 'placeholder:text-warmgray'
              }`}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`shrink-0 text-[10px] font-medium uppercase tracking-label disabled:opacity-40 ${
                dark ? 'text-ivory' : 'text-ink'
              }`}
            >
              {status === 'loading' ? 'Sending…' : 'Subscribe'}
            </button>
          </div>
          {error ? <p className="mt-2 text-[11px] text-[#b4523f]">{error}</p> : null}
        </form>
      )}
    </div>
  );
}
