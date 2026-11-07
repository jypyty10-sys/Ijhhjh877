import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import { money } from '../lib/format.js';
import { usePageMeta } from '../lib/hooks.js';
import { useDiscount } from '../lib/useDiscount.js';
import Icon from '../components/Icon.jsx';

export default function Cart() {
  const { cart, updateCartItem, removeCartItem, settings } = useStore();
  const threshold = Number(settings.free_shipping_threshold ?? 250);
  const standard = Number(settings.shipping_standard ?? 12);
  const [busy, setBusy] = useState(null);
  const discount = useDiscount(cart.subtotal);

  usePageMeta('Your Bag', 'Review the pieces in your EVORA STYLE bag.');

  const shipping = cart.subtotal === 0 ? 0 : cart.subtotal >= threshold ? 0 : standard;
  const total = Math.max(0, cart.subtotal + shipping - discount.amount);

  const changeQty = async (item, next) => {
    setBusy(item.id);
    try {
      await updateCartItem(item.id, next);
    } finally {
      setBusy(null);
    }
  };

  if (!cart.items.length) {
    return (
      <div className="shell flex min-h-[62vh] flex-col items-center justify-center py-16 text-center">
        <Icon name="bag" className="h-12 w-12 text-ink/20" />
        <p className="label mt-6 text-gold">Your bag</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">Nothing in your bag — yet.</h1>
        <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-charcoal/65">
          Begin with the overcoat or the Peaky cap, or browse the new season edit.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link to="/shop" className="btn-dark">
            Shop the collection
          </Link>
          <Link to="/shop?collection=english-vintage" className="btn-light">
            New season edit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell pt-8 lg:pt-12">
      <div className="flex items-end justify-between border-b border-ink/10 pb-5">
        <div>
          <p className="label text-gold">Your bag</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">
            {cart.count} {cart.count === 1 ? 'piece' : 'pieces'}
          </h1>
        </div>
        <Link to="/shop" className="link-line hidden text-[10px] text-ink/60 hover:text-ink sm:inline-block">
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <div>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {cart.items.map((item) => (
              <li key={item.id} className="flex gap-4 py-6 sm:gap-6">
                <Link to={`/product/${item.slug}`} className="shrink-0 overflow-hidden bg-beige/40">
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.name}
                    className="h-32 w-24 object-cover sm:h-40 sm:w-32"
                    loading="lazy"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label text-ink/45">{item.category}</p>
                      <Link to={`/product/${item.slug}`} className="mt-1.5 block font-display text-lg leading-tight hover:underline">
                        {item.name}
                      </Link>
                      <p className="mt-1.5 text-[10px] uppercase tracking-label text-ink/50">
                        {item.color}
                        {item.size ? ` · Size ${item.size}` : ''}
                      </p>
                      {item.stock < 5 ? (
                        <p className="mt-2 text-[10px] uppercase tracking-label text-gold">
                          Only {item.stock} left
                        </p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-[14px] tabular-nums">{money(item.price * item.quantity)}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-ink/20">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={busy === item.id}
                        onClick={() => changeQty(item, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-ink/70 disabled:opacity-40"
                      >
                        <Icon name="minus" className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-[12px] tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={busy === item.id || item.quantity >= item.stock}
                        onClick={() => changeQty(item, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-ink/70 disabled:opacity-40"
                      >
                        <Icon name="plus" className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-label text-ink/45 transition-colors hover:text-ink"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3 border border-ink/10 px-4 py-3">
            <Icon name="truck" className="h-4 w-4 text-ink/50" />
            <p className="text-[11px] text-charcoal/70">
              {cart.subtotal >= threshold
                ? 'Complimentary delivery has been applied to this order.'
                : `Add ${money(threshold - cart.subtotal)} more for complimentary delivery.`}
            </p>
          </div>
        </div>

        <aside>
          <div className="border border-ink/10 p-6">
            <h2 className="font-display text-xl">Order summary</h2>

            <dl className="mt-5 space-y-3 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd className="tabular-nums">{money(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Delivery</dt>
                <dd className="tabular-nums">{shipping === 0 ? 'Complimentary' : money(shipping)}</dd>
              </div>
              {discount.amount > 0 ? (
                <div className="flex justify-between text-gold">
                  <dt>Discount ({discount.applied.code})</dt>
                  <dd className="tabular-nums">−{money(discount.amount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-ink/10 pt-3 text-[14px]">
                <dt className="uppercase tracking-label text-[10px] text-ink/60">Total</dt>
                <dd className="font-display text-xl tabular-nums">{money(total)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <p className="label mb-2 text-ink/45">Discount code</p>
              {discount.applied ? (
                <div className="flex items-center justify-between border border-ink/15 px-3 py-2.5">
                  <span className="text-[12px] tracking-wide">{discount.applied.code}</span>
                  <button type="button" onClick={discount.clear} className="text-[10px] uppercase tracking-label text-ink/50 hover:text-ink">
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    discount.validate(discount.code);
                  }}
                  className="flex gap-2"
                >
                  <label className="sr-only" htmlFor="discount-code">
                    Discount code
                  </label>
                  <input
                    id="discount-code"
                    value={discount.code}
                    onChange={(event) => discount.setCode(event.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="field flex-1 py-2.5 text-[12px]"
                  />
                  <button type="submit" disabled={discount.pending} className="btn-light px-4 py-2.5">
                    {discount.pending ? '…' : 'Apply'}
                  </button>
                </form>
              )}
              {discount.error ? <p className="mt-2 text-[11px] text-[#b4523f]">{discount.error}</p> : null}
            </div>

            <Link to="/checkout" className="btn-dark mt-6 w-full">
              Proceed to checkout
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-[9px] uppercase tracking-label text-ink/40">
              <Icon name="lock" className="h-3.5 w-3.5" /> Secure checkout
            </div>
            <p className="mt-3 text-center text-[10px] leading-relaxed text-ink/40">
              No payment provider is connected to this store yet — orders are recorded and confirmed by the
              concierge.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
