import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { money } from '../../lib/format.js';
import Icon from '../../components/Icon.jsx';

export default function AccountWishlist() {
  const { wishlist, toggleWishlist, addToCart, pushToast } = useStore();
  const [sizes, setSizes] = useState({});
  const navigate = useNavigate();

  const add = async (item) => {
    try {
      await addToCart({
        productId: item.productId,
        size: sizes[item.productId] || item.sizes?.[0] || 'One Size',
        color: item.colors?.[0]?.name || 'Default',
        quantity: 1,
      });
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  const remove = async (item) => {
    try {
      await toggleWishlist(item.productId);
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    }
  };

  if (!wishlist.items.length) {
    return (
      <div className="border border-ink/10 px-6 py-14 text-center">
        <Icon name="heart" className="mx-auto h-8 w-8 text-ink/25" />
        <h2 className="mt-5 font-display text-2xl">Your wishlist is empty</h2>
        <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-charcoal/65">
          Tap the heart on any piece to keep it here for later.
        </p>
        <Link to="/shop" className="btn-dark mt-6">
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl">Wishlist</h2>
        <p className="text-[10px] uppercase tracking-label text-ink/45">{wishlist.count} saved</p>
      </div>

      <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
        {wishlist.items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <Link to={`/product/${item.slug}`} className="shrink-0 overflow-hidden bg-beige/40">
              <img src={item.image} alt={item.imageAlt || item.name} className="h-28 w-20 object-cover" loading="lazy" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/product/${item.slug}`} className="block font-display text-lg leading-tight hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1.5 text-[12px] tabular-nums">{money(item.price)}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-label text-ink/40">
                    {item.stock > 0 ? 'In stock' : 'Sold out'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  className="text-ink/40 hover:text-ink"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                {item.sizes?.length ? (
                  <select
                    aria-label={`Size for ${item.name}`}
                    value={sizes[item.productId] || item.sizes[0]}
                    onChange={(event) => setSizes((current) => ({ ...current, [item.productId]: event.target.value }))}
                    className="border border-ink/20 bg-transparent px-3 py-2 text-[11px] uppercase tracking-wide focus:outline-none"
                  >
                    {item.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                ) : null}
                <button type="button" onClick={() => add(item)} className="btn-dark px-5 py-2.5" disabled={item.stock < 1}>
                  {item.stock > 0 ? 'Move to bag' : 'Sold out'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/product/${item.slug}`)}
                  className="text-[9px] uppercase tracking-label text-ink/50 hover:text-ink"
                >
                  View details
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
