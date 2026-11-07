import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useStore } from '../context/StoreContext.jsx';
import { usePageMeta } from '../lib/hooks.js';
import ProductCard from '../components/ProductCard.jsx';
import QuickView from '../components/QuickView.jsx';
import Icon from '../components/Icon.jsx';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useStore();
  const query = searchParams.get('q') || '';
  const [term, setTerm] = useState(query);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);

  usePageMeta(query ? `Search: ${query}` : 'Search', 'Search the EVORA STYLE collection.');

  useEffect(() => {
    setTerm(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get(`/products?q=${encodeURIComponent(query)}&limit=48`)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
        setTotal(data.total || 0);
      })
      .catch(() => !cancelled && setItems([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query]);

  const submit = (event) => {
    event.preventDefault();
    const value = term.trim();
    setSearchParams(value ? { q: value } : {});
  };

  return (
    <div className="shell pt-8 lg:pt-12">
      <p className="label text-gold">Search</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">
        {query ? `Results for “${query}”` : 'Find a piece'}
      </h1>
      {query ? (
        <p className="mt-3 text-[11px] uppercase tracking-label text-ink/45">
          {total} {total === 1 ? 'piece' : 'pieces'} found
        </p>
      ) : null}

      <form onSubmit={submit} className="mt-6 flex max-w-xl gap-2">
        <label className="sr-only" htmlFor="search-input">
          Search products
        </label>
        <div className="flex flex-1 items-center gap-3 border-b border-ink/25 pb-2">
          <Icon name="search" className="h-4 w-4 text-ink/40" />
          <input
            id="search-input"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search coats, tailoring, caps…"
            className="w-full bg-transparent py-2 text-[14px] placeholder:text-warmgray focus:outline-none"
          />
        </div>
        <button type="submit" className="btn-dark px-6 py-3">
          Search
        </button>
      </form>

      {loading ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] w-full bg-beige/50" />
              <div className="mt-3 h-3 w-2/3 bg-beige/50" />
            </div>
          ))}
        </div>
      ) : items.length ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-ink/10 px-6 py-14 text-center">
          <Icon name="search" className="mx-auto h-8 w-8 text-ink/25" />
          <h2 className="mt-5 font-display text-2xl">
            {query ? `No pieces match “${query}”` : 'Search the collection'}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-charcoal/65">
            {query
              ? 'Try a different word, or browse the categories below — tailoring, outerwear, caps and shoes.'
              : 'Enter a word above, or start from one of our categories.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className="border border-ink/20 px-4 py-2 text-[10px] uppercase tracking-label hover:border-ink"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <Link to="/shop" className="btn-dark mt-7">
            Browse everything
          </Link>
        </div>
      )}

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
