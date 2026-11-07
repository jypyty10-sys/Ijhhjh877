import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useStore } from '../../context/StoreContext.jsx';
import { money, formatDateTime, statusMeta } from '../../lib/format.js';
import { usePageMeta } from '../../lib/hooks.js';
import Icon from '../../components/Icon.jsx';

const STATUSES = ['awaiting_confirmation', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { pushToast } = useStore();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  usePageMeta('Order — Admin');

  useEffect(() => {
    api
      .get(`/admin/orders/${id}`)
      .then((data) => {
        setOrder(data.order);
        setStatus(data.order.status);
        setNotes(data.order.adminNotes || '');
      })
      .catch((err) => pushToast(err.message, { tone: 'error' }))
      .finally(() => setLoading(false));
  }, [id, pushToast]);

  const save = async () => {
    setBusy(true);
    try {
      await api.patch(`/admin/orders/${id}`, { status, adminNotes: notes });
      pushToast('Order updated.');
    } catch (error) {
      pushToast(error.message, { tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-[12px] text-ink/45">Loading order…</p>;
  if (!order) return <p className="text-[12px] text-[#b4523f]">Order not found.</p>;

  return (
    <div>
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-label text-ink/45 hover:text-ink">
        <Icon name="chevronLeft" className="h-3 w-3" /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label text-gold">Order</p>
          <h1 className="mt-2 font-display text-3xl">{order.orderNumber}</h1>
          <p className="mt-1 text-[11px] text-charcoal/55">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`px-2.5 py-1 text-[9px] uppercase tracking-label ${statusMeta(order.status).tone}`}>
          {statusMeta(order.status).label}
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">
          <section className="border border-ink/10 bg-paper">
            <h2 className="border-b border-ink/10 px-5 py-4 font-display text-lg">Items</h2>
            <ul className="divide-y divide-ink/[0.06]">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-5 py-4">
                  <img src={item.image} alt={item.name} className="h-16 w-12 object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium">{item.name}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-label text-ink/40">
                      {item.color}
                      {item.size ? ` · ${item.size}` : ''} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-[12px] tabular-nums">{money(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-ink/10 px-5 py-4 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Subtotal</dt>
                <dd className="tabular-nums">{money(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal/60">Delivery ({order.deliveryMethod})</dt>
                <dd className="tabular-nums">{money(order.shipping)}</dd>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-charcoal/60">Discount {order.discountCode ? `(${order.discountCode})` : ''}</dt>
                  <dd className="tabular-nums">−{money(order.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-ink/10 pt-2">
                <dt className="text-[10px] uppercase tracking-label text-ink/55">Total</dt>
                <dd className="font-display text-lg tabular-nums">{money(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="border border-ink/10 bg-paper p-5">
            <h2 className="font-display text-lg">Update order</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="order-status">Status</label>
                <select id="order-status" className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
                  {STATUSES.map((option) => (
                    <option key={option} value={option}>
                      {statusMeta(option).label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="order-notes">Internal notes</label>
                <textarea
                  id="order-notes"
                  rows="3"
                  className="field"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Shipping information, concierge notes…"
                />
              </div>
            </div>
            <button type="button" onClick={save} disabled={busy} className="btn-dark mt-4">
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="border border-ink/10 bg-paper p-5">
            <h2 className="font-display text-lg">Customer</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-charcoal/75">
              {order.customer?.firstName} {order.customer?.lastName}
              <br />
              <a href={`mailto:${order.email}`} className="underline underline-offset-2">
                {order.email}
              </a>
              {order.customer?.phone ? (
                <>
                  <br />
                  {order.customer.phone}
                </>
              ) : null}
            </p>
          </section>

          <section className="border border-ink/10 bg-paper p-5">
            <h2 className="font-display text-lg">Ship to</h2>
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
          </section>

          <section className="border border-ink/10 bg-paper p-5">
            <h2 className="font-display text-lg">Payment</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-charcoal/75">
              Method: {order.paymentMethod === 'invoice' ? 'Invoice on confirmation' : order.paymentMethod}
              <br />
              Status: <span className="uppercase tracking-label text-[10px]">{order.paymentStatus.replace('_', ' ')}</span>
            </p>
            {order.paymentStatus === 'not_charged' ? (
              <p className="mt-2 text-[10px] leading-relaxed text-ink/40">
                No payment provider is connected; no money has been collected for this order.
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
