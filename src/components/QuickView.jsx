import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { money } from '../lib/format.js';
import Icon from './Icon.jsx';

export default function QuickView({ product, onClose }) {
  const { addToCart, pushToast, wishlist, toggleWishlist } = useStore();
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes?.[0] || '');
    setColor(product.colors?.[0]?.name || '');
  }, [product]);

  useEffect(() => {
    if (!product) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  const saved = wishlist.ids?.includes(product.id);
  const image = product.images?.[0];

  const submit = async () => {
    setBusy(true);
    try {
      await addToCart({ productId: product.id, size, color, quantity: 1 });
      onClose();
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${product.name} quick view`}>
      <button type="button" aria-label="Close quick view" className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-ivory">
        <div className="grid sm:grid-cols-2">
          <div className="relative bg-beige/40">
            <img src={image?.url} alt={image?.alt || product.name} className="h-64 w-full object-cover sm:h-full" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-ivory/90 sm:hidden"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-gold">{product.categoryName}</p>
                <h3 className="mt-2 font-display text-2xl leading-tight">{product.name}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick view"
                className="hidden h-8 w-8 items-center justify-center text-ink/50 hover:text-ink sm:flex"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg tabular-nums">{money(product.price)}</span>
              {product.comparePrice ? (
                <span className="text-[13px] text-warmgray line-through tabular-nums">{money(product.comparePrice)}</span>
              ) : null}
            </div>

            <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-charcoal/70">{product.description}</p>

            {product.sizes?.length ? (
              <div className="mt-5">
                <p className="label mb-2 text-ink/50">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSize(option)}
                      className={`min-w-[46px] border px-3 py-2 text-[11px] uppercase tracking-wide transition-colors ${
                        size === option ? 'border-ink bg-ink text-ivory' : 'border-ink/20 hover:border-ink'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {product.colors?.length ? (
              <div className="mt-4">
                <p className="label mb-2 text-ink/50">Colour — {color}</p>
                <div className="flex gap-2">
                  {product.colors.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setColor(option.name)}
                      aria-label={option.name}
                      className={`h-7 w-7 rounded-full border transition-all ${
                        color === option.name ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-ivory' : 'border-ink/20'
                      }`}
                      style={{ backgroundColor: option.hex }}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex gap-2">
              <button type="button" onClick={submit} disabled={busy || product.stock < 1} className="btn-dark flex-1">
                {product.stock < 1 ? 'Sold out' : busy ? 'Adding…' : 'Add to Bag'}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`flex w-12 items-center justify-center border transition-colors ${
                  saved ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-ink hover:border-ink'
                }`}
              >
                <Icon name="heart" className="h-4 w-4" fill={saved ? 'solid' : 'none'} />
              </button>
            </div>

            <Link to={`/product/${product.slug}`} onClick={onClose} className="link-line mt-5 inline-block text-[10px]">
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
