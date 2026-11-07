import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import Icon from './Icon.jsx';
import { money } from '../lib/format.js';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateCartItem, removeCartItem, settings } = useStore();
  const [busy, setBusy] = useState(null);
  const navigate = useNavigate();
  const threshold = Number(settings.free_shipping_threshold ?? 250);
  const remaining = Math.max(0, threshold - cart.subtotal);

  useEffect(() => {
    if (!cartOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const changeQty = async (item, next) => {
    setBusy(item.id);
    try {
      await updateCartItem(item.id, next);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button type="button" aria-label="Close bag" className="absolute inset-0 bg-ink/45" onClick={() => setCartOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-5">
          <div>
            <p className="label text-ink/50">Your Bag</p>
            <p className="mt-1 font-display text-lg">
              {cart.count} {cart.count === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <Icon name="bag" className="h-10 w-10 text-ink/25" />
            <h3 className="mt-5 font-display text-xl">Your bag is empty</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-charcoal/65">
              Begin with the overcoat, or browse the new season edit.
            </p>
            <button
              type="button"
              className="btn-dark mt-6"
              onClick={() => {
                setCartOpen(false);
                navigate('/shop');
              }}
            >
              Shop the collection
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-ink/10 px-5 py-3">
              <p className="text-[10px] uppercase tracking-label text-ink/60">
                {remaining > 0 ? `${money(remaining)} away from complimentary delivery` : 'Complimentary delivery unlocked'}
              </p>
              <div className="mt-2 h-[2px] w-full bg-ink/10">
                <div
                  className="h-full bg-gold transition-all duration-700"
                  style={{ width: `${Math.min(100, (cart.subtotal / threshold) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-ink/10">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-5">
                    <Link to={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.name}
                        className="h-28 w-[84px] object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="block truncate text-[13px] font-medium"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-[10px] uppercase tracking-label text-ink/50">
                            {item.color}
                            {item.size ? ` · ${item.size}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeCartItem(item.id)}
                          className="text-ink/40 transition-colors hover:text-ink"
                        >
                          <Icon name="close" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between pt-3">
                        <div className="flex items-center border border-ink/15">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={busy === item.id}
                            onClick={() => changeQty(item, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-ink/70 disabled:opacity-40"
                          >
                            <Icon name="minus" className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-[11px] tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={busy === item.id || item.quantity >= item.stock}
                            onClick={() => changeQty(item, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-ink/70 disabled:opacity-40"
                          >
                            <Icon name="plus" className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-[13px] tabular-nums">{money(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 px-5 py-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="uppercase tracking-label text-[10px] text-ink/60">Subtotal</span>
                <span className="font-display text-lg tabular-nums">{money(cart.subtotal)}</span>
              </div>
              <p className="mt-1 text-[10px] text-ink/50">Delivery and taxes calculated at checkout.</p>
              <button
                type="button"
                className="btn-dark mt-4 w-full"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/checkout');
                }}
              >
                Proceed to checkout
                <Icon name="arrowRight" className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="btn-light mt-2 w-full"
                onClick={() => {
                  setCartOpen(false);
                  navigate('/cart');
                }}
              >
                View bag
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
