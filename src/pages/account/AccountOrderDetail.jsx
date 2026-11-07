import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { money, formatDate, formatDateTime, statusMeta } from '../../lib/format.js';
import Icon from '../../components/Icon.jsx';

const TIMELINE = ['awaiting_confirmation', 'processing', 'shipped', 'delivered'];

export default function AccountOrderDetail() {
  const { number } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${number}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [number]);

  if (loading) return <p className="text-[12px] text-ink/45">Loading order…</p>;
  if (error || !order) return <p className="text-[12px] text-[#b4523f]">{error || 'Order not found.'}</p>;

  const status = statusMeta(order.status);
  const activeIndex = TIMELINE.indexOf(order.status);

  return (
    <div>
      <Link to="/account/orders" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-label text-ink/45 hover:text-ink">
        <Icon name="chevronLeft" className="h-3 w-3" /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Order {order.orderNumber}</h2>
          <p className="mt-1 text-[11px] text-charcoal/60">
            Placed {formatDateTime(order.createdAt)} · {order.items.length} piece(s)
          </p>
        </div>
        <span className={`px-2.5 py-1 text-[9px] uppercase tracking-label ${status.tone}`}>{status.label}</span>
      </div>

      {order.status !== 'cancelled' ? (
        <ol className="mt-6 flex items-center gap-1">
          {TIMELINE.map((step, index) => (
            <li key={step} className="flex flex-1 items-center gap-1">
              <div className="flex-1">
                <div className={`h-[2px] w-full ${index <= activeIndex ? 'bg-ink' : 'bg-ink/15'}`} />
                <p className={`mt-2 text-[8px] uppercase tracking-label ${index <= activeIndex ? 'text-ink/70' : 'text-ink/35'}`}>
                  {statusMeta(step).label}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      <ul className="mt-7 divide-y divide-ink/10 border-y border-ink/10">
        {order.items.map((item) => (
          <li key={item.id} className="flex gap-3 py-4">
            <img src={item.image} alt={item.name} className="h-24 w-20 object-cover" loading="lazy" />
            <div className="flex-1">
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

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="label text-ink/45">Delivering to</p>
          <p className="mt-2 text-[12px] leading-relaxed text-charcoal/75">
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
          <dl className="space-y-2 text-[12px]">
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Subtotal</dt>
              <dd className="tabular-nums">{money(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Delivery</dt>
              <dd className="tabular-nums">{order.shipping === 0 ? 'Complimentary' : money(order.shipping)}</dd>
            </div>
            {order.discount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Discount</dt>
                <dd className="tabular-nums">−{money(order.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-ink/10 pt-2">
              <dt className="text-[10px] uppercase tracking-label text-ink/60">Total</dt>
              <dd className="font-display text-lg tabular-nums">{money(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[10px] uppercase tracking-label text-ink/40">
            {order.paymentStatus === 'not_charged' ? 'No payment taken' : order.paymentStatus}
          </p>
        </div>
      </div>
    </div>
  );
}
