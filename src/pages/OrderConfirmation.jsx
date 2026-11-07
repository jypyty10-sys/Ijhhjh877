import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { money, formatDate, statusMeta } from '../lib/format.js';
import { usePageMeta } from '../lib/hooks.js';
import Icon from '../components/Icon.jsx';

export default function OrderConfirmation() {
  const { number } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initial = location.state?.order || null;
  const [order, setOrder] = useState(initial);
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!initial);

  usePageMeta('Order confirmed', `Your EVORA STYLE order ${number}.`);

  useEffect(() => {
    if (initial) return;
    const email = searchParams.get('email');
    api
      .get(`/orders/${number}${email ? `?email=${encodeURIComponent(email)}` : ''}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [number, initial, searchParams]);

  if (loading) {
    return (
      <div className="shell flex min-h-[50vh] items-center justify-center">
        <span className="label animate-pulse">Loading your order…</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl">We could not find that order.</h1>
        <p className="mt-3 max-w-sm text-[13px] text-charcoal/65">
          {error || 'Sign in to view your order history, or contact the concierge and quote your order number.'}
        </p>
        <div className="mt-7 flex gap-3">
          <Link to="/account/orders" className="btn-dark">
            My orders
          </Link>
          <Link to="/contact" className="btn-light">
            Contact concierge
          </Link>
        </div>
      </div>
    );
  }

  const status = statusMeta(order.status);

  return (
    <div className="shell pt-10 lg:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ink/15">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <p className="label mt-6 text-gold">Order {order.orderNumber}</p>
        <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">Thank you, {order.customer?.firstName}.</h1>
        <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-charcoal/70">
          Your order has been recorded on {formatDate(order.createdAt)} and is awaiting confirmation from the
          concierge. A confirmation is sent to {order.email}.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 border border-ink/15 px-3 py-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${status.tone.includes('gold') ? 'bg-gold' : 'bg-ink'}`} />
          <span className="text-[9px] uppercase tracking-label text-ink/60">{status.label}</span>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl border border-gold/40 bg-gold/[0.06] px-5 py-4">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-charcoal/75">
          <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {notice ||
            'No payment has been taken. No payment provider is connected to this store — the order is recorded as awaiting confirmation and our concierge will contact you to complete payment.'}
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="label text-ink/45">Pieces</h2>
            <ul className="mt-3 divide-y divide-ink/10 border-y border-ink/10">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <img src={item.image} alt={item.name} className="h-24 w-20 object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${item.slug}`} className="text-[13px] font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-[10px] uppercase tracking-label text-ink/45">
                      {item.color}
                      {item.size ? ` · ${item.size}` : ''} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-[13px] tabular-nums">{money(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd className="tabular-nums">{money(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Delivery ({order.deliveryMethod})</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? 'Complimentary' : money(order.shipping)}</dd>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-charcoal/60">Discount {order.discountCode ? `(${order.discountCode})` : ''}</dt>
                  <dd className="tabular-nums">−{money(order.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-ink/10 pt-2">
                <dt className="text-[10px] uppercase tracking-label text-ink/60">Total</dt>
                <dd className="font-display text-lg tabular-nums">{money(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="label text-ink/45">Delivering to</h2>
              <p className="mt-3 text-[12px] leading-relaxed text-charcoal/75">
                {order.shippingAddress?.fullName}
                <br />
                {order.shippingAddress?.line1}
                {order.shippingAddress?.line2 ? (
                  <>
                    <br />
                    {order.shippingAddress.line2}
                  </>
                ) : null}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.postcode}
                <br />
                {order.shippingAddress?.country}
              </p>
            </div>
            <div>
              <h2 className="label text-ink/45">Payment</h2>
              <p className="mt-3 text-[12px] leading-relaxed text-charcoal/75">
                {order.paymentMethod === 'invoice' ? 'Invoice on confirmation' : 'Card (not connected)'}
                <br />
                <span className="text-ink/50">No charge has been made</span>
              </p>
            </div>
            <div>
              <h2 className="label text-ink/45">Need help?</h2>
              <p className="mt-3 text-[12px] leading-relaxed text-charcoal/75">
                Quote order <strong>{order.orderNumber}</strong> to the concierge at
                <br />
                <a href="mailto:concierge@evorastyle.com" className="underline underline-offset-4">
                  concierge@evorastyle.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-dark">
            Continue shopping
          </Link>
          <Link to="/account/orders" className="btn-light">
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}
