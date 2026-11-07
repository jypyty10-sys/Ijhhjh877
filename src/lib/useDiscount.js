import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

const KEY = 'evora_discount_code';

export function useDiscount(subtotal) {
  const [code, setCode] = useState(() => {
    try {
      return window.localStorage.getItem(KEY) || '';
    } catch {
      return '';
    }
  });
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const validate = useCallback(
    async (value) => {
      const trimmed = String(value || '').trim().toUpperCase();
      if (!trimmed) {
        setError('Enter a discount code.');
        return null;
      }
      setPending(true);
      setError('');
      try {
        const data = await api.post('/discounts/validate', { code: trimmed, subtotal });
        setApplied(data);
        setCode(data.code);
        try {
          window.localStorage.setItem(KEY, data.code);
        } catch {
          /* storage unavailable */
        }
        return data;
      } catch (err) {
        setApplied(null);
        setError(err.message);
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          /* storage unavailable */
        }
        return null;
      } finally {
        setPending(false);
      }
    },
    [subtotal]
  );

  // Re-check a remembered code whenever the basket subtotal changes.
  useEffect(() => {
    if (applied && subtotal !== applied.subtotal) {
      validate(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const clear = () => {
    setApplied(null);
    setCode('');
    setError('');
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
  };

  const amount = applied ? Math.min(applied.amount, subtotal) : 0;

  return { code, setCode, applied, amount, error, pending, validate, clear };
}
