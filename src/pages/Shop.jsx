import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useStore } from '../context/StoreContext.jsx';
import { usePageMeta } from '../lib/hooks.js';
import ProductCard from '../components/ProductCard.jsx';
import QuickView from '../components/QuickView.jsx';
import Icon from '../components/Icon.jsx';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const PRICE_PRESETS = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: '$200 – $300', min: 200, max: 300 },
  { label: '$300 +', min: 300, max: 1000 },
];

function FilterPanel({ params, update, facets, categories, onClear }) {
  const activeSizes = params.size ? params.size.split(',') : [];
  const activeColors = params.color ? params.color.split(',') : [];

  return (
    <div className="space-y-8">
      <div>
        <p className="label mb-3 text-ink/50">Category</p>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => update({ category: null })}
              className={`text-[12px] transition-colors ${!params.category ? 'text-ink underline underline-offset-4' : 'text-charcoal/65 hover:text-ink'}`}
            >
              All pieces
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <button
                type="button"
                onClick={() => update({ category: category.slug })}
                className={`text-[12px] transition-colors ${
                  params.category === category.slug
                    ? 'text-ink underline underline-offset-4'
                    : 'text-charcoal/65 hover:text-ink'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="label mb-3 text-ink/50">Price</p>
        <div className="space-y-2">
          {PRICE_PRESETS.map((preset) => {
            const active = Number(params.minPrice) === preset.min && Number(params.maxPrice) === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => update({ minPrice: active ? null : preset.min, maxPrice: active ? null : preset.max })}
                className={`block text-[12px] transition-colors ${
                  active ? 'text-ink underline underline-offset-4' : 'text-charcoal/65 hover:text-ink'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {facets.sizes?.length ? (
        <div>
          <p className="label mb-3 text-ink/50">Size</p>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((sizeOption) => {
              const active = activeSizes.includes(sizeOption);
              return (
                <button
                  key={sizeOption}
                  type="button"
                  onClick={() => {
                    const next = active ? activeSizes.filter((value) => value !== sizeOption) : [...activeSizes, sizeOption];
                    update({ size: next.length ? next.join(',') : null });
                  }}
                  className={`min-w-[40px] border px-2.5 py-1.5 text-[10px] uppercase tracking-wide transition-colors ${
                    active ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-charcoal/75 hover:border-ink'
                  }`}
                >
                  {sizeOption}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {facets.colors?.length ? (
        <div>
          <p className="label mb-3 text-ink/50">Colour</p>
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((colorOption) => {
              const active = activeColors.includes(colorOption.name);
              return (
                <button
                  key={colorOption.name}
                  type="button"
                  title={colorOption.name}
                  aria-label={colorOption.name}
                  aria-pressed={active}
                  onClick={() => {
                    const next = active
                      ? activeColors.filter((value) => value !== colorOption.name)
                      : [...activeColors, colorOption.name];
                    update({ color: next.length ? next.join(',') : null });
                  }}
                  className={`h-7 w-7 rounded-full border transition-all ${
                    active ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-ivory' : 'border-ink/20'
                  }`}
                  style={{ backgroundColor: colorOption.hex }}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <p className="label mb-3 text-ink/50">Availability</p>
        <button
          type="button"
          onClick={() => update({ inStock: params.inStock ? null : '1' })}
          className="flex items-center gap-2 text-[12px] text-charcoal/75"
          aria-pressed={Boolean(params.inStock)}
        >
          <span
            className={`flex h-4 w-4 items-center justify-center border ${
              params.inStock ? 'border-ink bg-ink text-ivory' : 'border-ink/30'
            }`}
          >
            {params.inStock ? <Icon name="check" className="h-2.5 w-2.5" strokeWidth={2} /> : null}
          </span>
          In stock only
        </button>
      </div>

      <button type="button" onClick={onClear} className="link-line text-[10px] text-ink/60 hover:text-ink">
        Clear all filters
      </button>
    </div>
  );
}

export default function Shop() {
  const { categories, settings } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 });
  const [facets, setFacets] = useState({ sizes: [], colors: [], price: { min: 0, max: 500 } });
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);

  const categoryLabel = categories.find((category) => category.slug === params.category)?.name;
  const pageTitle = params.q
    ? `Results for “${params.q}”`
    : params.collection === 'english-vintage'
      ? 'English Vintage'
      : categoryLabel || 'The Collection';

  usePageMeta(pageTitle, `Shop ${pageTitle} at EVORA STYLE — British heritage menswear.`);

  const queryString = useMemo(() => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== 'page') query.set(key, value);
    });
    return query.toString();
  }, [params]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/products?${queryString}`)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
        setMeta({ total: data.total || 0, pages: data.pages || 1, page: data.page || 1 });
        setFacets(data.facets || { sizes: [], colors: [], price: { min: 0, max: 500 } });
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  useEffect(() => {
    setFiltersOpen(false);
  }, [queryString]);

  const update = useCallback(
    (changes) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') next.delete(key);
        else next.set(key, value);
      });
      next.delete('page');
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const clearAll = () => setSearchParams(new URLSearchParams(), { replace: false });

  const loadNextPage = async () => {
    setLoadMore(true);
    try {
      const query = new URLSearchParams(queryString);
      query.set('page', String((meta.page || 1) + 1));
      const data = await api.get(`/products?${query.toString()}`);
      setItems((current) => [...current, ...(data.items || [])]);
      setMeta({ total: data.total || 0, pages: data.pages || 1, page: data.page || 1 });
    } finally {
      setLoadMore(false);
    }
  };

  const activeFilterCount = ['category', 'minPrice', 'size', 'color', 'inStock'].filter((key) => params[key]).length;

  return (
    <div className="pt-8 lg:pt-12">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[9px] uppercase tracking-label text-ink/40">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink/70">{pageTitle}</span>
        </nav>

        <div className="mt-5 flex flex-col gap-2 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl leading-none sm:text-4xl lg:text-5xl">{pageTitle}</h1>
            <p className="mt-3 text-[11px] uppercase tracking-label text-ink/45">
              {meta.total} {meta.total === 1 ? 'piece' : 'pieces'}
              {params.category ? ` · ${categoryLabel}` : ''}
            </p>
          </div>
          <p className="max-w-sm text-[12px] leading-relaxed text-charcoal/60">
            {params.collection === 'english-vintage'
              ? settings.hero_lead || 'Refined pieces. Authentic style. Inspired by a timeless era.'
              : 'Considered clothing, made in small runs. Every piece is built to be repaired, not replaced.'}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-[10px] font-medium uppercase tracking-label"
          >
            <Icon name="filter" className="h-4 w-4" />
            Filter
            {activeFilterCount ? (
              <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] text-ivory">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
          <div className="flex items-center gap-2">
            <select
              value={params.sort || 'featured'}
              onChange={(event) => update({ sort: event.target.value })}
              aria-label="Sort products"
              className="border border-ink/20 bg-transparent px-3 py-2.5 text-[10px] uppercase tracking-label focus:outline-none"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <FilterPanel params={params} update={update} facets={facets} categories={categories} onClear={clearAll} />
            </div>
          </aside>

          <div>
            <div className="mb-5 hidden items-center justify-between border-b border-ink/10 pb-4 lg:flex">
              <p className="text-[10px] uppercase tracking-label text-ink/45">
                Showing {items.length} of {meta.total}
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={params.sort || 'featured'}
                  onChange={(event) => update({ sort: event.target.value })}
                  aria-label="Sort products"
                  className="border-0 bg-transparent text-[10px] uppercase tracking-label focus:outline-none"
                >
                  {SORTS.map((sort) => (
                    <option key={sort.value} value={sort.value}>
                      {sort.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                    aria-pressed={view === 'grid'}
                    className={`flex h-8 w-8 items-center justify-center ${view === 'grid' ? 'text-ink' : 'text-ink/35'}`}
                  >
                    <Icon name="grid" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    aria-label="List view"
                    aria-pressed={view === 'list'}
                    className={`flex h-8 w-8 items-center justify-center ${view === 'list' ? 'text-ink' : 'text-ink/35'}`}
                  >
                    <Icon name="list" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] w-full bg-beige/50" />
                    <div className="mt-3 h-3 w-2/3 bg-beige/50" />
                    <div className="mt-2 h-3 w-1/3 bg-beige/40" />
                  </div>
                ))}
              </div>
            ) : items.length ? (
              view === 'list' ? (
                <div>
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} view="list" onQuickView={setQuickView} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center border border-ink/10 py-20 text-center">
                <Icon name="search" className="h-8 w-8 text-ink/25" />
                <h2 className="mt-5 font-display text-2xl">Nothing matches those filters</h2>
                <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-charcoal/60">
                  Try widening the price range, or clear the filters to see the full collection.
                </p>
                <button type="button" onClick={clearAll} className="btn-dark mt-6">
                  Clear filters
                </button>
              </div>
            )}

            {meta.page < meta.pages ? (
              <div className="mt-12 flex flex-col items-center gap-3">
                <button type="button" onClick={loadNextPage} disabled={loadMore} className="btn-light px-12">
                  {loadMore ? 'Loading…' : 'Load more'}
                </button>
                <p className="text-[10px] uppercase tracking-label text-ink/40">
                  {items.length} of {meta.total}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/45"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-ivory">
            <div className="sticky top-0 flex items-center justify-between border-b border-ink/10 bg-ivory px-5 py-4">
              <p className="font-display text-lg">Filter</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-6">
              <FilterPanel params={params} update={update} facets={facets} categories={categories} onClear={clearAll} />
            </div>
            <div className="sticky bottom-0 border-t border-ink/10 bg-ivory px-5 py-4">
              <button type="button" onClick={() => setFiltersOpen(false)} className="btn-dark w-full">
                Show {meta.total} results
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
