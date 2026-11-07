import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/hooks.js';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="label text-gold">404</p>
      <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">This page has gone out of season.</h1>
      <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-charcoal/65">
        The page you were looking for is not here. The current collection certainly is.
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Link to="/" className="btn-dark">
          Back to the store
        </Link>
        <Link to="/shop" className="btn-light">
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
