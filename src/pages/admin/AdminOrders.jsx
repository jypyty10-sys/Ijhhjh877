import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { money, formatDate, statusMeta } from '../../lib/format.js';
import { usePageMeta } from '../../lib/hooks.js';
import Icon from '../../components/Icon.jsx';

const STATUSES = ['all', 'awaiting_confirmation', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  usePageMeta('Orders — Admin');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      const query = new URLSearchParams();
      if (status !== 'all') query.set('status', status);
      if (search.trim()) query.set('q', search.trim());
      api
        .get(`/admin/orders?${query.toString()}`)
        .then((data) => setOrders(data.orders || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 200);
    return () => window.clearTimeout(timer);
  }, [status, search]);

  return (
    <div>
      <div>
        <p className="label text-gold">Fulfilment</p>
        <h1 className="mt-2 font-display text-3xl">Orders</h1>
        <p className="mt-1 text-[11px] text-charcoal/55">{orders.length} orders</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={`border px-3 py-1.5 text-[9px] uppercase tracking-label transition-colors ${
                status === option ? 'border-ink bg-ink text-ivory' : 'border-ink/15 text-ink/55 hover:border-ink/40'
              }`}
            >
              {option === 'all' ? 'All' : statusMeta(option).label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-b border-ink/15 pb-1.5 sm:w-56">
          <Icon name="search" className="h-4 w-4 text-ink/40" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Order number or email"
            aria-label="Search orders"
            className="w-full bg-transparent text-[12px] placeholder:text-warmgray focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-[12px] text-ink/45">Loading orders…</p>
      ) : (
        <div className="mt-5 overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full min-w-[700px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-ink/10 text-[9px] uppercase tracking-label text-ink/40">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-ink/[0.06] last:border-0 hover:bg-ivory/60">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      {order.orderNumber}
                    </Link>
                    <p className="text-[9px] uppercase tracking-label text-ink/35">{order.paymentMethod}</p>
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="truncate text-charcoal/80">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                    <p className="truncate text-[10px] text-ink/40">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 tabular-nums text-charcoal/70">{order.itemCount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-label ${statusMeta(order.status).tone}`}>
                      {statusMeta(order.status).label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length ? <p className="px-4 py-8 text-center text-[12px] text-ink/45">No orders match these filters.</p> : null}
        </div>
      )}
    </div>
  );
}
