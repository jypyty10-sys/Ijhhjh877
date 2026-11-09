import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { money } from '../lib/format.js';
import Icon from './Icon.jsx';

export default function ProductCard({ product, view = 'grid', onQuickView, priority = false }) {
  const { wishlist, toggleWishlist, addToCart, pushToast } = useStore();
  const [busy, setBusy] = useState(false);
  const saved = wishlist.ids?.includes(product.id);
  const outOfStock = product.stock < 1;
  const primary = product.images?.[0];
  const secondary = product.images?.[1];
  const href = `/product/${product.slug}`;

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    if (product.sizes?.length > 1) {
      onQuickView?.(product);
      return;
    }
    setBusy(true);
    try {
      await addToCart({
        productId: product.id,
        size: product.sizes?.[0],
        color: product.colors?.[0]?.name,
        quantity: 1,
      });
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  if (view === 'list') {
    return (
      <article className="group flex gap-5 border-b border-ink/10 py-6">
        <Link to={href} className="relative block w-32 shrink-0 overflow-hidden bg-beige/40 sm:w-48">
          <img
            src={primary?.url}
            alt={primary?.alt || product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.1s] ease-luxury group-hover:scale-[1.03]"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="label text-ink/45">{product.categoryName}</p>
              <Link to={href} className="mt-2 block font-display text-xl leading-tight hover:underline">
                {product.name}
              </Link>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-charcoal/65">{product.description}</p>
            </div>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={saved}
              className="shrink-0 p-2 text-ink/50 hover:text-ink"
            >
              <Icon name="heart" className="h-4 w-4" fill={saved ? 'solid' : 'none'} />
            </button>
          </div>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] tabular-nums">{money(product.price)}</span>
              {product.comparePrice ? (
                <span className="text-[12px] text-warmgray line-through tabular-nums">{money(product.comparePrice)}</span>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onQuickView?.(product)} className="btn-light px-5 py-2.5">
                Quick View
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={outOfStock || busy}
                className="btn-dark px-5 py-2.5"
              >
                {outOfStock ? 'Sold out' : busy ? 'Adding…' : 'Add to Bag'}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden bg-beige/40">
        <Link to={href} className="block aspect-[3/4]">
          <img
            src={primary?.url}
            alt={primary?.alt || product.name}
            loading={priority ? 'eager' : 'lazy'}
            className={`h-full w-full object-cover transition-all duration-[1.2s] ease-luxury ${
              secondary ? 'group-hover:opacity-0' : 'group-hover:scale-[1.04]'
            }`}
          />
          {secondary ? (
            <img
              src={secondary.url}
              alt={secondary.alt || product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1.2s] ease-luxury group-hover:opacity-100"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1">
            {product.badge ? (
              <span className="bg-ivory/95 px-2 py-1 text-[8px] font-medium uppercase tracking-label text-ink">
                {product.badge}
              </span>
            ) : null}
            {outOfStock ? (
              <span className="bg-ink px-2 py-1 text-[8px] font-medium uppercase tracking-label text-ivory">
                Sold out
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={saved}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center bg-ivory/85 text-ink/70 backdrop-blur transition-colors hover:bg-ivory hover:text-ink sm:h-8 sm:w-8"
          >
            <Icon name="heart" className="h-4 w-4" fill={saved ? 'solid' : 'none'} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 hidden translate-y-2 p-3 opacity-0 transition-all duration-500 ease-luxury group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onQuickView?.(product)}
              className="flex-1 bg-ivory/95 py-3 text-[9px] font-medium uppercase tracking-label text-ink backdrop-blur transition-colors hover:bg-ivory"
            >
              Quick View
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock || busy}
              aria-label={`Add ${product.name} to bag`}
              className="flex w-11 items-center justify-center bg-ink text-ivory transition-colors hover:bg-charcoal disabled:opacity-40"
            >
              <Icon name="bag" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2 pt-3">
        <div className="min-w-0">
          <Link to={href} className="block text-[13px] font-medium leading-snug text-ink transition-colors hover:text-gold">
            {product.name}
          </Link>
          <p className="mt-1 text-[9px] uppercase tracking-label text-ink/45">{product.categoryName}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[13px] tabular-nums">{money(product.price)}</p>
          {product.comparePrice ? (
            <p className="text-[11px] text-warmgray line-through tabular-nums">{money(product.comparePrice)}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-2 flex gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => onQuickView?.(product)}
          className="flex-1 border border-ink/20 py-2.5 text-[9px] font-medium uppercase tracking-label"
        >
          Quick View
        </button>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock || busy}
          className="flex-1 bg-ink py-2.5 text-[9px] font-medium uppercase tracking-label text-ivory disabled:opacity-40"
        >
          {outOfStock ? 'Sold out' : 'Add'}
        </button>
      </div>
    </article>
  );
}
