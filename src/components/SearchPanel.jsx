import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { api } from '../lib/api.js';
import { money } from '../lib/format.js';
import Icon from './Icon.jsx';

const SUGGESTED = ['Overcoat', 'Tweed', 'Flat Cap', 'Brogue', 'Waistcoat'];

export default function SearchPanel() {
  const { searchOpen, setSearchOpen } = useStore();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchOpen) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (event) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const query = term.trim();
    if (query.length < 2) {
      setResults({ products: [], categories: [] });
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      api
        .get(`/search/suggest?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((data) => setResults({ products: data.products || [], categories: data.categories || [] }))
        .catch((error) => {
          if (error.name !== 'AbortError') setResults({ products: [], categories: [] });
        })
        .finally(() => setLoading(false));
    }, 220);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [term, searchOpen]);

  if (!searchOpen) return null;

  const go = (path) => {
    setSearchOpen(false);
    setTerm('');
    navigate(path);
  };

  const submit = (event) => {
    event.preventDefault();
    const query = term.trim();
    go(query ? `/search?q=${encodeURIComponent(query)}` : '/shop');
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" aria-label="Close search" className="absolute inset-0 bg-ink/50" onClick={() => setSearchOpen(false)} />
      <div className="absolute inset-x-0 top-0 max-h-[92vh] overflow-y-auto bg-ivory">
        <div className="shell py-6">
          <div className="flex items-center justify-between">
            <p className="label text-ink/50">Search the house</p>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="flex h-9 w-9 items-center justify-center"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={submit} className="mt-6">
            <div className="flex items-center gap-4 border-b border-ink/25 pb-3">
              <Icon name="search" className="h-5 w-5 text-ink/40" />
              <input
                ref={inputRef}
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search coats, tailoring, caps…"
                aria-label="Search products"
                className="w-full bg-transparent font-display text-2xl placeholder:font-sans placeholder:text-base placeholder:text-warmgray focus:outline-none sm:text-3xl"
              />
            </div>
          </form>

          {term.trim().length < 2 ? (
            <div className="mt-6">
              <p className="label text-ink/40">Suggested</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setTerm(suggestion)}
                    className="border border-ink/15 px-4 py-2 text-[10px] uppercase tracking-label text-charcoal/80 transition-colors hover:border-ink hover:text-ink"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 pb-8">
              {loading && results.products.length === 0 ? (
                <p className="label text-ink/40">Searching…</p>
              ) : null}

              {results.categories.length > 0 ? (
                <div className="mb-5 flex flex-wrap gap-2">
                  {results.categories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => go(`/shop?category=${category.slug}`)}
                      className="border border-ink/15 px-3 py-1.5 text-[10px] uppercase tracking-label hover:border-ink"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              ) : null}

              {results.products.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.products.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => go(`/product/${product.slug}`)}
                        className="group flex w-full items-center gap-4 text-left"
                      >
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.images?.[0]?.alt || product.name}
                          className="h-20 w-16 shrink-0 object-cover"
                          loading="lazy"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium group-hover:underline">
                            {product.name}
                          </span>
                          <span className="mt-1 block text-[10px] uppercase tracking-label text-ink/50">
                            {product.categoryName}
                          </span>
                          <span className="mt-1 block text-[13px] tabular-nums">{money(product.price)}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {!loading && results.products.length === 0 ? (
                <div className="py-6">
                  <p className="font-display text-xl">No pieces match “{term.trim()}”.</p>
                  <p className="mt-2 text-[13px] text-charcoal/65">
                    Try a category such as tailoring or outerwear, or browse everything.
                  </p>
                  <Link to="/shop" onClick={() => setSearchOpen(false)} className="btn-dark mt-5">
                    Browse the collection
                  </Link>
                </div>
              ) : null}

              {results.products.length > 0 ? (
                <button type="button" onClick={submit} className="link-line mt-6 text-[10px]">
                  View all results for “{term.trim()}”
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
